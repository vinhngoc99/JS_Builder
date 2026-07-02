// =============================================================================
// ElementManager — element lifecycle and layout: create, slides, update,
// remove, duplicate, align/distribute, flow reveal, and animations.
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { CanvasElement, ElementType, ButtonElement } from '../types';
import { createElement } from '../models/Element';
import type { SlideLayout } from '../BuilderContext';
import { BuilderDeps } from './BuilderDeps';

export class ElementManager {
  constructor(private d: BuilderDeps) {}

  revealDownstream = (startId: string): void => {
    const { connectionsRef, elementsRef, setElements } = this.d;
    const visited = new Set<string>();
    const toUpdate = new Set<string>();

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const outgoing = connectionsRef.current.filter(c => c.fromId === id);
      outgoing.forEach(conn => {
        const targetId = conn.toId;
        const targetEl = elementsRef.current.find(e => e.id === targetId);
        if (targetEl) {
          toUpdate.add(targetId);
          if (!targetEl.interactive) {
            traverse(targetId);
          }
        }
      });
    };

    traverse(startId);

    if (toUpdate.size > 0) {
      setElements(prev => prev.map(el => {
        if (toUpdate.has(el.id)) {
          return { ...el, visible: true };
        }
        return el;
      }));
    }
  };

  addElement = (type: ElementType, pos?: { x: number, y: number }, additionalProps?: Partial<CanvasElement>): void => {
    const { saveHistory, elements, pan, scale, setElements, setSelectedIds, setSelectedConnectionId } = this.d;
    saveHistory();
    const id = uuidv4();

    // Create element using OOP factory
    const newElement = createElement(type, { id, ...additionalProps } as any);

    // Calculate position
    const viewCenterX = window.innerWidth / 2;
    const viewCenterY = window.innerHeight / 2;
    const offset = (elements.length * 15) % 150;
    const canvasCenterX = (viewCenterX - pan.x) / scale;
    const canvasCenterY = (viewCenterY - pan.y) / scale;

    newElement.x = pos ? pos.x : canvasCenterX - newElement.width / 2 + offset;
    newElement.y = pos ? pos.y : canvasCenterY - newElement.height / 2 + offset;
    newElement.name = additionalProps?.name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${elements.length + 1}`;

    // Apply position/size overrides if provided
    if (additionalProps?.width) newElement.width = additionalProps.width;
    if (additionalProps?.height) newElement.height = additionalProps.height;

    setElements([...elements, newElement]); setSelectedIds([id]); setSelectedConnectionId(null);
  };

  addSlideNode = (layout: SlideLayout = 'blank'): void => {
    const { saveHistory, elementsRef, setElements, setSelectedIds, setSelectedConnectionId, setIsPropertiesOpen } = this.d;
    saveHistory();
    const slideId = uuidv4();
    const slides = elementsRef.current
      .filter(el => el.type === 'node' && el.isSlide !== false)
      .sort((a, b) => a.x - b.x);
    const lastSlide = slides[slides.length - 1];
    const x = lastSlide ? lastSlide.x + lastSlide.width + 90 : 120;
    const y = lastSlide ? lastSlide.y : 120;
    const maxZ = Math.max(0, ...elementsRef.current.map(el => el.zIndex || 0));
    const slide = createElement('node', {
      id: slideId,
      name: `Slide ${slides.length + 1}`,
      x,
      y,
      width: 640,
      height: 360,
      zIndex: maxZ + 1,
      isSlide: true,
      fill: { type: 'solid', color: 'var(--bg-node)' },
      stroke: { width: 1, color: 'var(--border-color)', style: 'solid', radius: 10, cap: 'round', join: 'round' },
    } as any);

    const makeText = (
      content: string,
      left: number,
      top: number,
      width: number,
      height: number,
      fontSize: number,
      fontWeight: number,
      align: 'left' | 'center' = 'center'
    ) => createElement('text', {
      id: uuidv4(),
      parentId: slideId,
      name: content,
      x: left,
      y: top,
      width,
      height,
      zIndex: maxZ + 2,
      fill: { type: 'none', color: 'transparent' },
      stroke: { width: 0, color: 'transparent', style: 'solid', radius: 0, cap: 'round', join: 'round' },
      text: {
        content,
        fontFamily: "'Google Sans Text'",
        fontSize,
        fontWeight,
        fontStyle: 'normal',
        textDecoration: 'none',
        color: 'var(--text-primary)',
        align,
        verticalAlign: 'middle',
        lineHeight: 1.25,
        letterSpacing: 0,
        padding: { top: 8, right: 8, bottom: 8, left: 8 },
      },
    } as any);

    const children: CanvasElement[] = [];
    if (layout === 'title') {
      children.push(makeText('Presentation title', 54, 92, 500, 70, 36, 700));
      children.push(makeText('Subtitle', 92, 170, 424, 44, 18, 400));
    } else if (layout === 'titleBody') {
      children.push(makeText('Slide title', 38, 28, 540, 54, 30, 700, 'left'));
      children.push(makeText('Add supporting points here', 54, 112, 500, 120, 18, 400, 'left'));
    } else if (layout === 'section') {
      children.push(makeText('Section headline', 54, 106, 500, 62, 34, 700));
      children.push(makeText('Short context', 110, 176, 390, 40, 16, 400));
    } else if (layout === 'media') {
      children.push(makeText('Slide title', 38, 24, 540, 48, 28, 700, 'left'));
      children.push(createElement('image', {
        id: uuidv4(),
        parentId: slideId,
        name: 'Image placeholder',
        x: 40,
        y: 92,
        width: 260,
        height: 170,
        zIndex: maxZ + 2,
        objectFit: 'cover',
      } as any));
      children.push(makeText('Add notes beside the image', 326, 116, 230, 110, 18, 400, 'left'));
    }

    setElements(prev => [...prev, slide, ...children]);
    setSelectedIds([slideId]);
    setSelectedConnectionId(null);
    setIsPropertiesOpen(true);
  };

  duplicateSlideNode = (id: string): void => {
    const { elementsRef, saveHistory, connectionsRef, brushStrokesRef, setElements, setConnections, setBrushStrokes, setSelectedIds, setSelectedConnectionId } = this.d;
    const source = elementsRef.current.find(el => el.id === id && el.type === 'node');
    if (!source) return;
    saveHistory();
    const idMap = new Map<string, string>();
    const collectDescendants = (parentId: string): CanvasElement[] => {
      const children = elementsRef.current.filter(el => el.parentId === parentId);
      return children.flatMap(child => [child, ...collectDescendants(child.id)]);
    };
    const descendants = collectDescendants(id);
    [source, ...descendants].forEach(el => idMap.set(el.id, uuidv4()));
    const offsetX = source.width + 90;
    const clones = [source, ...descendants].map(el => ({
      ...structuredClone(el),
      id: idMap.get(el.id)!,
      name: el.id === source.id ? `${el.name || 'Slide'} Copy` : el.name,
      parentId: el.parentId && idMap.has(el.parentId) ? idMap.get(el.parentId)! : el.parentId,
      x: el.parentId ? el.x : el.x + offsetX,
      y: el.y,
      animations: (el.animations || []).map(anim => ({ ...anim, id: uuidv4() })),
      actionTarget: idMap.get((el as any).actionTarget) || (el as any).actionTarget,
      action: (el as ButtonElement).action
        ? {
            ...(el as ButtonElement).action,
            target: idMap.get((el as ButtonElement).action.target) || (el as ButtonElement).action.target,
          }
        : (el as ButtonElement).action,
    })) as CanvasElement[];
    const clonedConnections = connectionsRef.current
      .filter(conn => idMap.has(conn.fromId) && idMap.has(conn.toId))
      .map(conn => ({
        ...structuredClone(conn),
        id: uuidv4(),
        fromId: idMap.get(conn.fromId)!,
        toId: idMap.get(conn.toId)!,
      }));
    const clonedBrushStrokes = brushStrokesRef.current
      .filter(stroke => stroke.attachedNodeId && idMap.has(stroke.attachedNodeId))
      .map(stroke => ({
        ...structuredClone(stroke),
        id: uuidv4(),
        attachedNodeId: stroke.attachedNodeId ? idMap.get(stroke.attachedNodeId) || stroke.attachedNodeId : stroke.attachedNodeId,
        points: stroke.points.map(point => ({ x: point.x + offsetX, y: point.y })),
      }));
    setElements(prev => [...prev, ...clones]);
    setConnections(prev => [...prev, ...clonedConnections]);
    setBrushStrokes(prev => [...prev, ...clonedBrushStrokes]);
    setSelectedIds([idMap.get(id)!]);
    setSelectedConnectionId(null);
  };

  moveSlideNode = (id: string, direction: 'left' | 'right'): void => {
    const { elementsRef, saveHistory, setElements, setCurrentSlideIndex } = this.d;
    const slides = elementsRef.current
      .filter(el => el.type === 'node' && el.isSlide !== false)
      .sort((a, b) => a.x - b.x);
    const index = slides.findIndex(slide => slide.id === id);
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= slides.length) return;
    saveHistory();
    const current = slides[index];
    const target = slides[targetIndex];
    setElements(prev => prev.map(el => {
      if (el.id === current.id) return { ...el, x: target.x, y: target.y } as CanvasElement;
      if (el.id === target.id) return { ...el, x: current.x, y: current.y } as CanvasElement;
      return el;
    }));
    setCurrentSlideIndex(targetIndex);
  };

  updateElement = (id: string, updates: Partial<CanvasElement> & Record<string, any>): void => {
    this.d.setElements(prev => prev.map(el => {
      if (el.id !== id) return el;

      const merged = { ...el } as any;

      for (const [key, value] of Object.entries(updates)) {
        // --- Translate legacy property names to new OOP model ---
        if (key === 'backgroundColor') {
          merged.fill = { ...merged.fill, type: value === 'transparent' ? 'none' : 'solid', color: value };
        } else if (key === 'borderWidth') {
          merged.stroke = { ...merged.stroke, width: value };
        } else if (key === 'borderColor') {
          merged.stroke = { ...merged.stroke, color: value };
        } else if (key === 'borderRadius') {
          merged.stroke = { ...merged.stroke, radius: value };
        } else if (key === 'color' && merged.text) {
          merged.text = { ...merged.text, color: value };
        } else if (key === 'fontSize' && merged.text) {
          merged.text = { ...merged.text, fontSize: value };
        } else if (key === 'fontFamily' && merged.text) {
          merged.text = { ...merged.text, fontFamily: value };
        } else if (key === 'textAlign' && merged.text) {
          merged.text = { ...merged.text, align: value };
        } else if (key === 'text' && typeof value === 'string' && merged.text && typeof merged.text === 'object') {
          // Update text content (string → TextStyle.content)
          merged.text = { ...merged.text, content: value };
        } else if (key === 'isHidden') {
          merged.visible = !value;
        } else if (key === 'isLocked') {
          merged.locked = value;
        } else if (key === 'isDisabled') {
          merged.disabled = value;
        } else if (key === 'isPinned') {
          merged.pinned = value;
        } else if (key === 'enableExpandButton') {
          merged.interactive = value;
        } else if (key === 'title') {
          merged.name = value;
        } else if (key === 'actionType' && merged.type === 'button') {
          merged.action = { ...merged.action, type: value };
        } else if (key === 'actionTarget' && merged.type === 'button') {
          merged.action = { ...merged.action, target: value };
        } else if (key === 'link' && merged.type === 'button') {
          merged.action = { ...merged.action, link: value };
        } else if (key === 'objectPosition' && merged.type === 'image') {
          merged.objectPosition = value;
        } else {
          // Direct assignment for new OOP properties or unknown properties
          merged[key] = value;
        }
      }

      return merged as CanvasElement;
    }));
  };

  removeElement = (id: string): void => {
    const { saveHistory, elementsRef, setElements, setConnections, setBrushStrokes, setSelectedIds } = this.d;
    saveHistory();
    const toDelete = new Set([id]);
    let added = true;
    while (added) {
      added = false;
      elementsRef.current.forEach(el => {
        if (el.parentId && toDelete.has(el.parentId) && !toDelete.has(el.id)) {
          toDelete.add(el.id);
          added = true;
        }
      });
    }
    setElements(prev => prev.filter(el => !toDelete.has(el.id)));
    setConnections(prev => prev.filter(c => !toDelete.has(c.fromId) && !toDelete.has(c.toId)));
    setBrushStrokes(prev => prev.filter(stroke => !stroke.attachedNodeId || !toDelete.has(stroke.attachedNodeId)));
    setSelectedIds(prev => prev.filter(sid => !toDelete.has(sid)));
  };

  removeSelected = (): void => {
    const { saveHistory, selectedIds, elementsRef, setElements, setConnections, setSelectedIds } = this.d;
    saveHistory();
    const toDelete = new Set(selectedIds);
    elementsRef.current.forEach(el => {
      if (el.parentId && toDelete.has(el.parentId)) toDelete.add(el.id);
    });
    setElements(prev => prev.filter(el => !toDelete.has(el.id)));
    setConnections(prev => prev.filter(c => !toDelete.has(c.fromId) && !toDelete.has(c.toId)));
    setSelectedIds([]);
  };

  duplicateSelected = (): void => {
    const { saveHistory, selectedIds, elementsRef, connectionsRef, brushStrokesRef, setElements, setConnections, setBrushStrokes, setSelectedIds, setSelectedConnectionId } = this.d;
    saveHistory();
    const toDuplicate = new Set(selectedIds);
    let added = true;
    while (added) {
      added = false;
      elementsRef.current.forEach(el => {
        if (el.parentId && toDuplicate.has(el.parentId) && !toDuplicate.has(el.id)) {
          toDuplicate.add(el.id);
          added = true;
        }
      });
    }

    const idMap = new Map<string, string>();
    toDuplicate.forEach(id => idMap.set(id, uuidv4()));

    const newElements: CanvasElement[] = [];
    toDuplicate.forEach(id => {
      const el = elementsRef.current.find(e => e.id === id);
      if (!el) return;

      let newParentId = el.parentId;
      if (el.parentId && idMap.has(el.parentId)) {
        newParentId = idMap.get(el.parentId)!;
      }

      const isTopLevel = !el.parentId || !toDuplicate.has(el.parentId);
      const offsetX = isTopLevel ? 40 : 0;
      const offsetY = isTopLevel ? 40 : 0;

      newElements.push({
        ...el,
        id: idMap.get(el.id)!,
        parentId: newParentId,
        x: el.x + offsetX,
        y: el.y + offsetY,
        animations: (el.animations || []).map(anim => ({ ...anim, id: uuidv4() }))
      } as CanvasElement);
    });

    const clonedConnections = connectionsRef.current
      .filter(conn => toDuplicate.has(conn.fromId) && toDuplicate.has(conn.toId))
      .map(conn => ({
        ...structuredClone(conn),
        id: uuidv4(),
        fromId: idMap.get(conn.fromId)!,
        toId: idMap.get(conn.toId)!,
      }));

    const clonedBrushStrokes = brushStrokesRef.current
      .filter(stroke => stroke.attachedNodeId && toDuplicate.has(stroke.attachedNodeId))
      .map(stroke => ({
        ...structuredClone(stroke),
        id: uuidv4(),
        attachedNodeId: idMap.get(stroke.attachedNodeId!),
        points: stroke.points.map(point => ({ ...point })),
      }));

    if (newElements.length > 0) {
      setElements(prev => [...prev, ...newElements]);
      setConnections(prev => [...prev, ...clonedConnections]);
      setBrushStrokes(prev => [...prev, ...clonedBrushStrokes]);

      const newSelectedIds = selectedIds.map(id => idMap.get(id)).filter(Boolean) as string[];
      setSelectedIds(newSelectedIds);
      setSelectedConnectionId(null);
    }
  };

  alignElements = (alignmentType: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'): void => {
    const { selectedIds, saveHistory, elementsRef, setElements } = this.d;
    if (selectedIds.length <= 1) return;
    saveHistory();

    const selectedElements = elementsRef.current.filter(el => selectedIds.includes(el.id));
    if (selectedElements.length === 0) return;

    const lefts = selectedElements.map(el => el.x);
    const rights = selectedElements.map(el => el.x + el.width);
    const tops = selectedElements.map(el => el.y);
    const bottoms = selectedElements.map(el => el.y + el.height);

    const minX = Math.min(...lefts);
    const maxX = Math.max(...rights);
    const minY = Math.min(...tops);
    const maxY = Math.max(...bottoms);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setElements(prev => prev.map(el => {
      if (!selectedIds.includes(el.id)) return el;

      let newX = el.x;
      let newY = el.y;

      switch (alignmentType) {
        case 'left':
          newX = minX;
          break;
        case 'center':
          newX = centerX - el.width / 2;
          break;
        case 'right':
          newX = maxX - el.width;
          break;
        case 'top':
          newY = minY;
          break;
        case 'middle':
          newY = centerY - el.height / 2;
          break;
        case 'bottom':
          newY = maxY - el.height;
          break;
      }

      return { ...el, x: newX, y: newY } as CanvasElement;
    }));
  };

  distributeElements = (direction: 'horizontal' | 'vertical'): void => {
    const { selectedIds, saveHistory, elementsRef, setElements } = this.d;
    if (selectedIds.length <= 2) return;
    saveHistory();

    const selectedElements = elementsRef.current.filter(el => selectedIds.includes(el.id));
    if (selectedElements.length <= 2) return;

    if (direction === 'horizontal') {
      const sorted = [...selectedElements].sort((a, b) => (a.x + a.width / 2) - (b.x + b.width / 2));
      const firstCenter = sorted[0].x + sorted[0].width / 2;
      const lastCenter = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width / 2;
      const step = (lastCenter - firstCenter) / (sorted.length - 1);

      setElements(prev => prev.map(el => {
        const idx = sorted.findIndex(s => s.id === el.id);
        if (idx === -1) return el;
        if (idx === 0 || idx === sorted.length - 1) return el;
        const targetCenter = firstCenter + idx * step;
        const x = targetCenter - el.width / 2;
        return { ...el, x } as CanvasElement;
      }));
    } else {
      const sorted = [...selectedElements].sort((a, b) => (a.y + a.height / 2) - (b.y + b.height / 2));
      const firstCenter = sorted[0].y + sorted[0].height / 2;
      const lastCenter = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height / 2;
      const step = (lastCenter - firstCenter) / (sorted.length - 1);

      setElements(prev => prev.map(el => {
        const idx = sorted.findIndex(s => s.id === el.id);
        if (idx === -1) return el;
        if (idx === 0 || idx === sorted.length - 1) return el;
        const targetCenter = firstCenter + idx * step;
        const y = targetCenter - el.height / 2;
        return { ...el, y } as CanvasElement;
      }));
    }
  };

  updateElementAnimations = (id: string, animations: any[]): void => {
    const { saveHistory, setElements } = this.d;
    saveHistory();
    setElements(prev => prev.map(el =>
      el.id === id ? { ...el, animations } as CanvasElement : el
    ));
  };
}
