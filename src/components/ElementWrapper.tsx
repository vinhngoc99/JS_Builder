import React, { useRef, useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useBuilder, getAdaptedTextColor, getAdaptedBorderColor, getAdaptedBgColor } from '../BuilderContext';
import { CanvasElement, PortPosition } from '../types';
import { getIconSvgPath } from '../icons';
import { compat } from '../models/compat';

interface ElementWrapperProps {
  element: CanvasElement;
}

export const ElementWrapper: React.FC<ElementWrapperProps> = ({ element: rawElement }) => {
  const element = compat(rawElement) as any;
  const { 
    elements, selectedIds, selectElement, updateElement, setConnectingNode, connectingNode, 
    addConnection, scale, editingFocalPointId, setEditingFocalPointId, saveHistory, isSnapEnabled, guides,
    isPresenting, currentSlideIndex, setCurrentSlideIndex, revealDownstream, isBrushMode,
    showAlert
  } = useBuilder();

  const elementsRef = useRef(elements);
  const selectedIdsRef = useRef(selectedIds);
  const scaleRef = useRef(scale);
  const isSnapEnabledRef = useRef(isSnapEnabled);
  const guidesRef = useRef(guides);
  const elementRef = useRef(element);

  elementsRef.current = elements;
  selectedIdsRef.current = selectedIds;
  scaleRef.current = scale;
  isSnapEnabledRef.current = isSnapEnabled;
  guidesRef.current = guides;
  elementRef.current = element;

  const isSelected = selectedIds.includes(element.id);
  const isEditingFocalPoint = editingFocalPointId === element.id;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isEditingText, setIsEditingText] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const textStyle = rawElement.text && typeof rawElement.text === 'object' ? rawElement.text : null;
  const textPadding = textStyle?.padding || { top: 10, right: 14, bottom: 10, left: 14 };
  const verticalAlign = textStyle?.verticalAlign || 'middle';
  const contentAlignItems = verticalAlign === 'top' ? 'flex-start' : verticalAlign === 'bottom' ? 'flex-end' : 'center';

  const getFillBackground = (fill = rawElement.fill): string => {
    if (!fill || fill.type === 'none') return 'transparent';
    if (fill.type === 'gradient' && fill.gradient) {
      const stops = fill.gradient.stops
        .map(stop => `${stop.color} ${Math.round(stop.offset * 100)}%`)
        .join(', ');
      if (fill.gradient.type === 'radial') return `radial-gradient(circle, ${stops})`;
      return `linear-gradient(${fill.gradient.angle}deg, ${stops})`;
    }
    return fill.color || 'transparent';
  };

  const fillBackground = getFillBackground();
  const textFormattingStyle: React.CSSProperties = {
    color: getAdaptedTextColor(textStyle?.color || element.color),
    fontSize: `${textStyle?.fontSize || element.fontSize || 16}px`,
    fontFamily: textStyle?.fontFamily || element.fontFamily,
    fontWeight: textStyle?.fontWeight || 400,
    fontStyle: textStyle?.fontStyle || 'normal',
    textDecoration: textStyle?.textDecoration || 'none',
    textAlign: textStyle?.align || element.textAlign || 'center',
    lineHeight: textStyle?.lineHeight || element.lineHeight || 1.5,
    letterSpacing: `${textStyle?.letterSpacing ?? element.letterSpacing ?? 0}px`,
  };

  const svgGradientId = `fill-${element.id}`;
  const renderSvgFillDef = () => {
    const fill = rawElement.fill;
    if (!fill || fill.type !== 'gradient' || !fill.gradient) return null;
    const stops = fill.gradient.stops.map(stop => (
      <stop key={`${stop.offset}-${stop.color}`} offset={`${Math.round(stop.offset * 100)}%`} stopColor={stop.color} />
    ));
    if (fill.gradient.type === 'radial') {
      return <radialGradient id={svgGradientId}>{stops}</radialGradient>;
    }
    const angle = (fill.gradient.angle * Math.PI) / 180;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return (
      <linearGradient
        id={svgGradientId}
        x1={`${50 - x * 50}%`}
        y1={`${50 - y * 50}%`}
        x2={`${50 + x * 50}%`}
        y2={`${50 + y * 50}%`}
      >
        {stops}
      </linearGradient>
    );
  };

  const svgFill = rawElement.fill?.type === 'gradient' ? `url(#${svgGradientId})` : element.backgroundColor;

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      return sel.getRangeAt(0);
    }
    return null;
  };

  const restoreSelection = (range: Range | null) => {
    if (range) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  const insertPlainTextAtSelection = (text: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    savedRangeRef.current = range.cloneRange();
  };

  const applyRichTextStyle = (styles: Partial<CSSStyleDeclaration>) => {
    if (editableRef.current) {
      editableRef.current.focus();
    }
    restoreSelection(savedRangeRef.current);
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const wrapper = document.createElement('span');
    Object.assign(wrapper.style, styles);
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    const nextRange = document.createRange();
    nextRange.selectNodeContents(wrapper);
    selection.removeAllRanges();
    selection.addRange(nextRange);
    savedRangeRef.current = nextRange.cloneRange();
  };


  useEffect(() => {
    if (isEditingText && editableRef.current) {
      const initialText = element.type === 'shape' ? ((element as any).text || '') : (element.text || '');
      editableRef.current.innerHTML = initialText;
      
      editableRef.current.focus();
      try {
        const range = document.createRange();
        range.selectNodeContents(editableRef.current);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [isEditingText]);
  // Auto-resize text element height to fit content if content overflows
  useEffect(() => {
    if (element.type === 'text' && !isEditingText && wrapperRef.current) {
      const textContainer = wrapperRef.current.querySelector('.text-element-content') as HTMLElement;
      if (textContainer) {
        const scrollH = textContainer.scrollHeight;
        const borderWidth = (element as any).borderWidth || 0;
        const neededHeight = scrollH + 18 + (borderWidth * 2);
        if (neededHeight > element.height + 2) { // Add 2px tolerance to prevent infinite loop
          updateElement(element.id, { height: Math.ceil(neededHeight) });
        }
      }
    }
  }, [element.text, element.width, (element as any).fontSize, (element as any).fontFamily, element.type, isEditingText, updateElement, element.height, (element as any).borderWidth]);

  const saveTextEdit = (e?: React.FocusEvent) => {
    let isTargetSafe = false;

    if (e && e.relatedTarget) {
      const target = e.relatedTarget as HTMLElement;
      if (
        target.closest('.properties-panel') || 
        target.closest('.rich-text-toolbar') || 
        target.closest('.toolbar') ||
        target.closest('.brush-toolbar')
      ) {
        isTargetSafe = true;
      }
    }

    // Check hover state to catch clicks on non-focusable elements inside safe panels (e.g. background divs, labels)
    if (!isTargetSafe) {
      const safeSelectors = ['.properties-panel', '.rich-text-toolbar', '.toolbar', '.brush-toolbar', '.sketch-picker'];
      for (const selector of safeSelectors) {
        if (document.querySelector(`${selector}:hover`)) {
          isTargetSafe = true;
          break;
        }
      }
    }

    if (isTargetSafe) {
      // Save content to elements array, but do NOT exit edit mode
      if (editableRef.current) {
        const updatedHTML = editableRef.current.innerHTML;
        const currentText = rawElement.text || {
          content: '',
          fontFamily: "'Google Sans Text'",
          fontSize: 16,
          fontWeight: 400,
          fontStyle: 'normal',
          textDecoration: 'none',
          color: 'var(--text-primary)',
          align: 'center',
          verticalAlign: 'middle',
          lineHeight: 1.5,
          letterSpacing: 0,
          padding: { top: 10, right: 14, bottom: 10, left: 14 }
        };
        const updates: Partial<CanvasElement> = {
          text: {
            ...currentText,
            content: updatedHTML
          }
        };
        if (element.type === 'text') {
          const el = editableRef.current;
          const originalHeight = el.style.height;
          el.style.height = 'auto';
          const contentHeight = el.scrollHeight;
          el.style.height = originalHeight;
          const borderWidth = (element as any).borderWidth || 0;
          updates.height = Math.max(30, contentHeight + 18 + (borderWidth * 2));
        }
        updateElement(element.id, updates);
      }
      return;
    }

    if (editableRef.current) {
      const updatedHTML = editableRef.current.innerHTML;
      const currentText = rawElement.text || {
        content: '',
        fontFamily: "'Google Sans Text'",
        fontSize: 16,
        fontWeight: 400,
        fontStyle: 'normal',
        textDecoration: 'none',
        color: 'var(--text-primary)',
        align: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.5,
        letterSpacing: 0,
        padding: { top: 10, right: 14, bottom: 10, left: 14 }
      };
      const updates: Partial<CanvasElement> = {
        text: {
          ...currentText,
          content: updatedHTML
        }
      };
      
      if (element.type === 'text') {
        const el = editableRef.current;
        const originalHeight = el.style.height;
        el.style.height = 'auto';
        const contentHeight = el.scrollHeight;
        el.style.height = originalHeight;
        
        const borderWidth = (element as any).borderWidth || 0;
        const neededHeight = Math.max(30, contentHeight + 18 + (borderWidth * 2));
        updates.height = neededHeight;
      }
      
      updateElement(element.id, updates);
    }
    setIsEditingText(false);
  };

  const renderToolbar = () => {
    return (
      <div 
        className="rich-text-toolbar"
        onMouseDown={(e) => e.preventDefault()}
      >
        <button
          className="rich-text-btn"
          onClick={() => applyRichTextStyle({ fontWeight: '700' })}
          title="Bold"
          style={{ fontWeight: 'bold' }}
        >
          B
        </button>
        <button
          className="rich-text-btn"
          onClick={() => applyRichTextStyle({ fontStyle: 'italic' })}
          title="Italic"
          style={{ fontStyle: 'italic' }}
        >
          I
        </button>
        <button
          className="rich-text-btn"
          onClick={() => applyRichTextStyle({ textDecoration: 'underline' })}
          title="Underline"
          style={{ textDecoration: 'underline' }}
        >
          U
        </button>
        <div style={{ width: '1px', height: '16px', background: 'var(--border-color)', margin: '0 4px' }} />
        <div className="rich-text-color-picker-container" title="Text Color">
          <span>🎨</span>
          <input
            type="color"
            className="rich-text-color-picker-input"
            onMouseDown={(e) => {
              e.stopPropagation();
              savedRangeRef.current = saveSelection();
            }}
            onChange={(e) => {
              if (editableRef.current) {
                editableRef.current.focus();
              }
              restoreSelection(savedRangeRef.current);
              applyRichTextStyle({ color: e.target.value });
            }}
          />
        </div>
      </div>
    );
  };
  
  const startPos = useRef({ x: 0, y: 0 });
  const startElement = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const startPositions = useRef<{ id: string, x: number, y: number }[]>([]);
  const startBox = useRef<{ x: number, y: number, w: number, h: number } | null>(null);
  const startElementsRelative = useRef<{ id: string, relX: number, relY: number, relW: number, relH: number }[]>([]);
  const startRotations = useRef<{ id: string, rotation: number }[]>([]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPresenting) return;
    if (isEditingFocalPoint) return;
    
    const target = e.target as HTMLElement;
    if (isEditingText || target.closest('.rich-text-toolbar') || target.closest('[contenteditable="true"]')) {
      e.stopPropagation();
      return;
    }
    
    e.stopPropagation();
    
    const isMulti = e.shiftKey;
    if (!isSelected && !isMulti) {
      selectElement(element.id, false);
    } else if (isMulti) {
      selectElement(element.id, true);
    }

    if (element.isLocked) {
      return;
    }

    startPos.current = { x: e.clientX, y: e.clientY };
    
    const currentSelected = !isSelected && !isMulti ? [element.id] : (isSelected ? selectedIds : [...selectedIds, element.id]);
    startPositions.current = elements
      .filter(el => currentSelected.includes(el.id))
      .filter(el => !el.parentId || !currentSelected.includes(el.parentId))
      .map(el => ({ id: el.id, x: el.x, y: el.y }));

    startElement.current = { x: element.x, y: element.y, w: element.width, h: element.height };
    let hasSavedDragHistory = false;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const currentScale = scaleRef.current;
      const currentIsSnapEnabled = isSnapEnabledRef.current;
      const currentElement = elementRef.current;
      const currentElements = elementsRef.current;
      const currentSelectedIds = selectedIdsRef.current;
      const currentGuides = guidesRef.current;

      const dx = (moveEvent.clientX - startPos.current.x) / currentScale;
      const dy = (moveEvent.clientY - startPos.current.y) / currentScale;
      if (!hasSavedDragHistory && (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1)) {
        saveHistory();
        hasSavedDragHistory = true;
      }

      let finalDx = dx;
      let finalDy = dy;

      if (moveEvent.shiftKey) {
        if (Math.abs(dx) > Math.abs(dy)) {
          finalDy = 0;
        } else {
          finalDx = 0;
        }
      }

      let snapX: number | null = null;
      let snapY: number | null = null;

      if (currentIsSnapEnabled && !moveEvent.shiftKey) {
        const rawX = startElement.current.x + dx;
        const rawY = startElement.current.y + dy;
        const w = currentElement.width;
        const h = currentElement.height;

        const snapXCandidates: { val: number; diff: number }[] = [];
        const snapYCandidates: { val: number; diff: number }[] = [];

        currentElements.forEach(other => {
          if (currentSelectedIds.includes(other.id) || other.parentId === currentElement.id || other.id === currentElement.id) return;
          const ox = other.x;
          const oy = other.y;
          const ow = other.width;
          const oh = other.height;

          [ox, ox + ow / 2, ox + ow].forEach(targetX => {
            [rawX, rawX + w / 2, rawX + w].forEach(sourceX => {
              const diff = targetX - sourceX;
              if (Math.abs(diff) < 8) {
                const offset = sourceX - rawX;
                snapXCandidates.push({ val: targetX - offset, diff: Math.abs(diff) });
              }
            });
          });

          [oy, oy + oh / 2, oy + oh].forEach(targetY => {
            [rawY, rawY + h / 2, rawY + h].forEach(sourceY => {
              const diff = targetY - sourceY;
              if (Math.abs(diff) < 8) {
                const offset = sourceY - rawY;
                snapYCandidates.push({ val: targetY - offset, diff: Math.abs(diff) });
              }
            });
          });
        });

        currentGuides.forEach(guide => {
          if (guide.type === 'vertical') {
            [rawX, rawX + w / 2, rawX + w].forEach(sourceX => {
              const diff = guide.position - sourceX;
              if (Math.abs(diff) < 8) {
                const offset = sourceX - rawX;
                snapXCandidates.push({ val: guide.position - offset, diff: Math.abs(diff) });
              }
            });
          } else {
            [rawY, rawY + h / 2, rawY + h].forEach(sourceY => {
              const diff = guide.position - sourceY;
              if (Math.abs(diff) < 8) {
                const offset = sourceY - rawY;
                snapYCandidates.push({ val: guide.position - offset, diff: Math.abs(diff) });
              }
            });
          }
        });

        if (snapXCandidates.length > 0) {
          snapXCandidates.sort((a, b) => a.diff - b.diff);
          const bestSnapX = snapXCandidates[0].val;
          finalDx = bestSnapX - startElement.current.x;
          snapX = bestSnapX;
        }
        if (snapYCandidates.length > 0) {
          snapYCandidates.sort((a, b) => a.diff - b.diff);
          const bestSnapY = snapYCandidates[0].val;
          finalDy = bestSnapY - startElement.current.y;
          snapY = bestSnapY;
        }

        const setSnapGuides = (window as any).setSnapGuides;
        if (setSnapGuides) {
          let guideLineX: number | null = null;
          let guideLineY: number | null = null;
          const w = currentElement.width;
          const h = currentElement.height;

          if (snapX !== null) {
            const targetCoordsX = [
              ...currentElements.filter(o => !currentSelectedIds.includes(o.id) && o.parentId !== currentElement.id && o.id !== currentElement.id).flatMap(o => [o.x, o.x + o.width/2, o.x + o.width]),
              ...currentGuides.filter(g => g.type === 'vertical').map(g => g.position)
            ];
            const closestX = targetCoordsX.find(tx => Math.abs(tx - (snapX! + w/2)) < 2 || Math.abs(tx - snapX!) < 2 || Math.abs(tx - (snapX! + w)) < 2);
            if (closestX !== undefined) guideLineX = closestX;
          }
          if (snapY !== null) {
            const targetCoordsY = [
              ...currentElements.filter(o => !currentSelectedIds.includes(o.id) && o.parentId !== currentElement.id && o.id !== currentElement.id).flatMap(o => [o.y, o.y + o.height/2, o.y + o.height]),
              ...currentGuides.filter(g => g.type === 'horizontal').map(g => g.position)
            ];
            const closestY = targetCoordsY.find(ty => Math.abs(ty - (snapY! + h/2)) < 2 || Math.abs(ty - snapY!) < 2 || Math.abs(ty - (snapY! + h)) < 2);
            if (closestY !== undefined) guideLineY = closestY;
          }
          setSnapGuides({ x: guideLineX, y: guideLineY });
        }
      }

      startPositions.current.forEach(pos => { 
        updateElement(pos.id, { x: pos.x + finalDx, y: pos.y + finalDy }); 
      });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      const setSnapGuides = (window as any).setSnapGuides;
      if (setSnapGuides) setSnapGuides({ x: null, y: null });

      const currentElement = elementRef.current;
      const currentElements = elementsRef.current;

      if (startPositions.current.length === 1) {
        // Parenting logic
        const wrapper = wrapperRef.current;
        if (wrapper) {
          const totalMove = Math.sqrt(Math.pow(upEvent.clientX - startPos.current.x, 2) + Math.pow(upEvent.clientY - startPos.current.y, 2));
          if (totalMove < 5) return;

          wrapper.classList.add('pointer-events-none');
          const target = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
          wrapper.classList.remove('pointer-events-none');

          const nodeTarget = target?.closest('.is-node');
          const targetId = nodeTarget?.getAttribute('data-id');

          if (targetId && targetId !== currentElement.id && currentElement.type !== 'node') {
            if (currentElement.parentId === targetId) return;

            const parent = currentElements.find(el => el.id === targetId);
            if (parent) {
              let absX = currentElement.x;
              let absY = currentElement.y;
              if (currentElement.parentId) {
                const oldParent = currentElements.find(el => el.id === currentElement.parentId);
                if (oldParent) { absX += oldParent.x + 16; absY += oldParent.y + 45 + 16; }
              }
              
              updateElement(currentElement.id, { 
                parentId: targetId, 
                x: absX - parent.x - 16, 
                y: absY - (parent.y + 45 + 16)
              });
            }
          } else if (!nodeTarget && currentElement.parentId) {
            const oldParent = currentElements.find(el => el.id === currentElement.parentId);
            if (oldParent) {
              updateElement(currentElement.id, { 
                parentId: null, 
                x: currentElement.x + oldParent.x + 16, 
                y: currentElement.y + oldParent.y + 45 + 16 
              });
            }
          }
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleFocalPointPointerDown = (e: React.PointerEvent) => {
    if (!isEditingFocalPoint || !contentRef.current) return;
    e.stopPropagation();
    const initialPos = { x: e.clientX, y: e.clientY };
    const elAny = element as any;
    const currentObjPos = elAny.objectPosition || '50% 50%';
    const [startX, startY] = currentObjPos.split(' ').map((p: string) => parseFloat(p));
    const handleMove = (moveEvent: PointerEvent) => {
      const rect = contentRef.current!.getBoundingClientRect();
      const dx = ((moveEvent.clientX - initialPos.x) / rect.width) * 100;
      const dy = ((moveEvent.clientY - initialPos.y) / rect.height) * 100;
      let nextX = startX - dx, nextY = startY - dy;
      nextX = Math.max(0, Math.min(100, nextX)); nextY = Math.max(0, Math.min(100, nextY));
      updateElement(element.id, { objectPosition: `${Math.round(nextX)}% ${Math.round(nextY)}%` } as any);
    };
    const handleUp = () => { window.removeEventListener('pointermove', handleMove); window.removeEventListener('pointerup', handleUp); };
    window.addEventListener('pointermove', handleMove); window.addEventListener('pointerup', handleUp);
  };

  const handleResizeStart = (e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    if (!isSelected) selectElement(element.id);
    
    const currentSelected = selectedIds.includes(element.id) ? selectedIds : [...selectedIds, element.id];
    const selectedElements = elements.filter(el => currentSelected.includes(el.id));
    const minX = Math.min(...selectedElements.map(el => el.x));
    const minY = Math.min(...selectedElements.map(el => el.y));
    const maxX = Math.max(...selectedElements.map(el => el.x + el.width));
    const maxY = Math.max(...selectedElements.map(el => el.y + el.height));
    const boxW = maxX - minX;
    const boxH = maxY - minY;
    
    startBox.current = { x: minX, y: minY, w: boxW, h: boxH };
    startElementsRelative.current = selectedElements.map(el => ({
      id: el.id,
      relX: boxW > 0 ? (el.x - minX) / boxW : 0,
      relY: boxH > 0 ? (el.y - minY) / boxH : 0,
      relW: boxW > 0 ? el.width / boxW : 1,
      relH: boxH > 0 ? el.height / boxH : 1
    }));

    startPos.current = { x: e.clientX, y: e.clientY };
    startElement.current = { x: element.x, y: element.y, w: element.width, h: element.height };
    let hasSavedResizeHistory = false;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const currentScale = scaleRef.current;
      const currentIsSnapEnabled = isSnapEnabledRef.current;
      const currentElement = elementRef.current;
      const currentElements = elementsRef.current;
      const currentSelectedIds = selectedIdsRef.current;
      const currentGuides = guidesRef.current;

      const dx = (moveEvent.clientX - startPos.current.x) / currentScale;
      const dy = (moveEvent.clientY - startPos.current.y) / currentScale;
      if (!hasSavedResizeHistory && (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1)) {
        saveHistory();
        hasSavedResizeHistory = true;
      }

      if (startBox.current) {
        let finalDx = dx;
        let finalDy = dy;
        let snapX: number | null = null;
        let snapY: number | null = null;

        if (currentIsSnapEnabled && !moveEvent.shiftKey && !moveEvent.altKey) {
          const snapXCandidates: { val: number; diff: number }[] = [];
          const snapYCandidates: { val: number; diff: number }[] = [];

          currentElements.forEach(other => {
            if (currentSelectedIds.includes(other.id) || other.parentId === currentElement.id || other.id === currentElement.id) return;
            const ox = other.x;
            const oy = other.y;
            const ow = other.width;
            const oh = other.height;

            const otherEdgesX = [ox, ox + ow / 2, ox + ow];
            const otherEdgesY = [oy, oy + oh / 2, oy + oh];

            if (handle.includes('e')) {
              const rawRight = startElement.current.x + startElement.current.w + dx;
              otherEdgesX.forEach(tx => {
                const diff = tx - rawRight;
                if (Math.abs(diff) < 8) snapXCandidates.push({ val: tx, diff: Math.abs(diff) });
              });
            } else if (handle.includes('w')) {
              const rawLeft = startElement.current.x + dx;
              otherEdgesX.forEach(tx => {
                const diff = tx - rawLeft;
                if (Math.abs(diff) < 8) snapXCandidates.push({ val: tx, diff: Math.abs(diff) });
              });
            }

            if (handle.includes('s')) {
              const rawBottom = startElement.current.y + startElement.current.h + dy;
              otherEdgesY.forEach(ty => {
                const diff = ty - rawBottom;
                if (Math.abs(diff) < 8) snapYCandidates.push({ val: ty, diff: Math.abs(diff) });
              });
            } else if (handle.includes('n')) {
              const rawTop = startElement.current.y + dy;
              otherEdgesY.forEach(ty => {
                const diff = ty - rawTop;
                if (Math.abs(diff) < 8) snapYCandidates.push({ val: ty, diff: Math.abs(diff) });
              });
            }
          });

          currentGuides.forEach(guide => {
            if (guide.type === 'vertical') {
              if (handle.includes('e')) {
                const rawRight = startElement.current.x + startElement.current.w + dx;
                const diff = guide.position - rawRight;
                if (Math.abs(diff) < 8) snapXCandidates.push({ val: guide.position, diff: Math.abs(diff) });
              } else if (handle.includes('w')) {
                const rawLeft = startElement.current.x + dx;
                const diff = guide.position - rawLeft;
                if (Math.abs(diff) < 8) snapXCandidates.push({ val: guide.position, diff: Math.abs(diff) });
              }
            } else {
              if (handle.includes('s')) {
                const rawBottom = startElement.current.y + startElement.current.h + dy;
                const diff = guide.position - rawBottom;
                if (Math.abs(diff) < 8) snapYCandidates.push({ val: guide.position, diff: Math.abs(diff) });
              } else if (handle.includes('n')) {
                const rawTop = startElement.current.y + dy;
                const diff = guide.position - rawTop;
                if (Math.abs(diff) < 8) snapYCandidates.push({ val: guide.position, diff: Math.abs(diff) });
              }
            }
          });

          if (snapXCandidates.length > 0) {
            snapXCandidates.sort((a, b) => a.diff - b.diff);
            snapX = snapXCandidates[0].val;
            if (handle.includes('e')) {
              finalDx = snapX - (startElement.current.x + startElement.current.w);
            } else if (handle.includes('w')) {
              finalDx = snapX - startElement.current.x;
            }
          }
          if (snapYCandidates.length > 0) {
            snapYCandidates.sort((a, b) => a.diff - b.diff);
            snapY = snapYCandidates[0].val;
            if (handle.includes('s')) {
              finalDy = snapY - (startElement.current.y + startElement.current.h);
            } else if (handle.includes('n')) {
              finalDy = snapY - startElement.current.y;
            }
          }
        }

        const setSnapGuides = (window as any).setSnapGuides;
        if (setSnapGuides) {
          setSnapGuides({ x: snapX, y: snapY });
        }

        const ratio = startElement.current.w / startElement.current.h;
        let newW = startElement.current.w;
        let newH = startElement.current.h;

        if (moveEvent.altKey) {
          const dragX = handle.includes('w') ? -finalDx : finalDx;
          const dragY = handle.includes('n') ? -finalDy : finalDy;
          if (Math.abs(dragX) > Math.abs(dragY)) {
            newW = startElement.current.w + dragX;
            newH = newW / ratio;
          } else {
            newH = startElement.current.h + dragY;
            newW = newH * ratio;
          }
        } else {
          if (handle.includes('w')) {
            newW = startElement.current.w - finalDx;
          } else if (handle.includes('e')) {
            newW = startElement.current.w + finalDx;
          }
          if (handle.includes('n')) {
            newH = startElement.current.h - finalDy;
          } else if (handle.includes('s')) {
            newH = startElement.current.h + finalDy;
          }
        }



        if (newW >= 2 && newH >= 2) {
          const scaleW = newW / startElement.current.w;
          const scaleH = newH / startElement.current.h;
          const box = startBox.current;
          let newBoxW = box.w * scaleW;
          let newBoxH = box.h * scaleH;
          let newBoxX = box.x;
          let newBoxY = box.y;

          if (handle.includes('w')) {
            newBoxX = box.x + box.w - newBoxW;
          }
          if (handle.includes('n')) {
            newBoxY = box.y + box.h - newBoxH;
          }

          startElementsRelative.current.forEach(item => {
            updateElement(item.id, {
              x: newBoxX + item.relX * newBoxW,
              y: newBoxY + item.relY * newBoxH,
              width: Math.max(2, item.relW * newBoxW),
              height: Math.max(2, item.relH * newBoxH)
            });
          });
        }
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      const setSnapGuides = (window as any).setSnapGuides;
      if (setSnapGuides) setSnapGuides({ x: null, y: null });

    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleRotateStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!isSelected) selectElement(element.id);
    
    const currentSelected = selectedIds.includes(element.id) ? selectedIds : [...selectedIds, element.id];
    startRotations.current = elements
      .filter(el => currentSelected.includes(el.id))
      .map(el => ({ id: el.id, rotation: el.rotation || 0 }));
    let hasSavedRotateHistory = false;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (wrapperRef.current) {
        if (!hasSavedRotateHistory) {
          saveHistory();
          hasSavedRotateHistory = true;
        }
        const rect = wrapperRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2, centerY = rect.top + rect.height / 2;
        const rad = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
        let deg = (rad * (180 / Math.PI)) + 90;
        if (deg < 0) deg += 360;
        deg = Math.round(deg);
        
        const primaryStartRot = startRotations.current.find(r => r.id === element.id)?.rotation || 0;
        const deltaRot = deg - primaryStartRot;

        startRotations.current.forEach(r => {
          updateElement(r.id, { rotation: (r.rotation + deltaRot) % 360 });
        });
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePortDown = (e: React.PointerEvent, port: PortPosition) => { e.stopPropagation(); setConnectingNode({ id: element.id, port }); };
  const handlePortUp = (e: React.PointerEvent, port: PortPosition) => {
    e.stopPropagation();
    if (connectingNode && connectingNode.id !== element.id) { addConnection(connectingNode.id, connectingNode.port, element.id, port); }
    setConnectingNode(null);
  };

  const renderContent = () => {
    const elAny = element as any;
    switch (element.type) {
      case 'text':
        if (isEditingText) {
          return (
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid #4caf50',
                borderRadius: `${element.borderRadius}px`,
                boxSizing: 'border-box',
                padding: '10px 14px',
                lineHeight: '1.5',
                overflowY: 'auto'
              }}
            >
              {renderToolbar()}
              <div
                ref={editableRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={saveTextEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    saveTextEdit();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsEditingText(false);
                  }
                }}
                style={{
                  ...textFormattingStyle,
                  width: '100%',
                  outline: 'none',
                  userSelect: 'text',
                  wordBreak: 'break-word',
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData('text/plain');
                  insertPlainTextAtSelection(text);
                }}
                onKeyUp={() => {
                  savedRangeRef.current = saveSelection();
                }}
                onMouseUp={() => {
                  savedRangeRef.current = saveSelection();
                }}
              />
            </div>
          );
        }
        return (
          <div 
            onDoubleClick={() => setIsEditingText(true)} 
            style={{ 
              ...textFormattingStyle,
              background: fillBackground, 
              borderWidth: `${element.stroke?.width ?? 0}px`,
              borderStyle: element.stroke?.style || 'solid',
              borderColor: getAdaptedBorderColor(element.stroke?.color || 'transparent'),
              borderRadius: `${element.stroke?.radius ?? 0}px`,
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: contentAlignItems, 
              justifyContent: 'center', 
              wordBreak: 'break-word',
              overflow: 'hidden',
              padding: `${textPadding.top}px ${textPadding.right}px ${textPadding.bottom}px ${textPadding.left}px`,
              boxSizing: 'border-box'
            }}
          >
            <div 
              className="text-element-content"
              style={{
                width: '100%',
                textAlign: textFormattingStyle.textAlign,
                wordBreak: 'break-word',
                lineHeight: textFormattingStyle.lineHeight,
                letterSpacing: textFormattingStyle.letterSpacing
              }}
              dangerouslySetInnerHTML={{ __html: element.text }}
            />
          </div>
        );
      case 'button':
        if (isEditingText) {
          return (
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid #4caf50',
                borderRadius: `${element.borderRadius}px`,
                boxSizing: 'border-box',
                padding: '8px 14px',
                lineHeight: '1.5',
                overflowY: 'auto'
              }}
            >
              {renderToolbar()}
              <div
                ref={editableRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={saveTextEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    saveTextEdit();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsEditingText(false);
                  }
                }}
                style={{
                  ...textFormattingStyle,
                  width: '100%',
                  outline: 'none',
                  userSelect: 'text',
                  wordBreak: 'break-word',
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData('text/plain');
                  insertPlainTextAtSelection(text);
                }}
                onKeyUp={() => {
                  savedRangeRef.current = saveSelection();
                }}
                onMouseUp={() => {
                  savedRangeRef.current = saveSelection();
                }}
              />
            </div>
          );
        }
        return (
          <button 
            onDoubleClick={() => {
              if (isPresenting) return;
              setIsEditingText(true);
            }}
            onClick={(e) => {
              if (!isPresenting) return;
              e.stopPropagation();
              
              const action = element.actionType;
              const target = element.actionTarget;
              
              if (action === 'alert') {
                showAlert(target || 'Button clicked!', 'Notification');
              } else if (action === 'link') {
                if (element.link) {
                  window.open(element.link, '_blank', 'noopener,noreferrer');
                }
              } else if (action === 'toggleDisabled') {
                if (target) {
                  const targetEl = elements.find(el => el.id === target);
                  if (targetEl) {
                    updateElement(target, { disabled: !targetEl.disabled });
                  }
                }
              } else if (action === 'toggleVisibility') {
                if (target) {
                  const targetEl = elements.find(el => el.id === target);
                  if (targetEl) {
                    updateElement(target, { visible: !targetEl.visible });
                  }
                }
              } else if (action === 'triggerFlow') {
                if (target) {
                  revealDownstream(target);
                }
              } else if (action === 'nextSlide') {
                const slides = elements.filter(el => el.type === 'node' && (el as any).isSlide !== false).sort((a, b) => a.x - b.x);
                if (currentSlideIndex < slides.length - 1) {
                  setCurrentSlideIndex(currentSlideIndex + 1);
                }
              } else if (action === 'prevSlide') {
                if (currentSlideIndex > 0) {
                  setCurrentSlideIndex(currentSlideIndex - 1);
                }
              } else if (action === 'goToSlide') {
                if (target) {
                  const slides = elements.filter(el => el.type === 'node' && (el as any).isSlide !== false).sort((a, b) => a.x - b.x);
                  const targetIdx = slides.findIndex(s => s.id === target);
                  if (targetIdx !== -1) {
                    setCurrentSlideIndex(targetIdx);
                  }
                }
              }
            }}
            disabled={element.isDisabled}
            style={{ 
              ...textFormattingStyle,
              background: fillBackground, 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: contentAlignItems, 
              justifyContent: 'center', 
              cursor: isPresenting ? 'pointer' : 'default',
              pointerEvents: 'auto',
              transition: 'opacity 0.2s, transform 0.1s',
              padding: `${textPadding.top}px ${textPadding.right}px ${textPadding.bottom}px ${textPadding.left}px`,
              boxSizing: 'border-box',
              borderWidth: `${element.stroke?.width ?? 0}px`,
              borderStyle: element.stroke?.style || 'solid',
              borderColor: getAdaptedBorderColor(element.stroke?.color || 'transparent'),
              borderRadius: `${element.stroke?.radius ?? 6}px`,
            }}
          >
            <div
              style={{
                width: '100%',
                textAlign: textFormattingStyle.textAlign,
                wordBreak: 'break-word',
                lineHeight: textFormattingStyle.lineHeight,
                letterSpacing: textFormattingStyle.letterSpacing
              }}
              dangerouslySetInnerHTML={{ __html: element.text }}
            />
          </button>
        );
      case 'image': {
        const objPos = elAny.objectPosition || '50% 50%';
        const displaySrc = (() => {
          if (!element.src || !element.src.includes('lh3.googleusercontent.com')) return element.src;
          const q = (element as any).imageQuality;
          if (q === undefined) return element.src;
          const baseSrc = element.src.replace(/=s\d+$/, '');
          return q === 100 ? `${baseSrc}=s0` : `${baseSrc}=s${Math.round(40 * q)}`;
        })();
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {elAny.title && <div className="media-header" style={{ fontSize: `${elAny.fontSize || 11}px` }}>{elAny.title}</div>}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }} onPointerDown={handleFocalPointPointerDown}>
              <div className="media-settings-btn" onClick={(e) => { e.stopPropagation(); setEditingFocalPointId(isEditingFocalPoint ? null : element.id); }} title="Set Focal Point"><Settings size={14} /></div>
              {isEditingFocalPoint && (
                <div className="focal-point-overlay" style={{ cursor: 'move' }}>
                  <div className="focal-point-indicator" style={{ left: objPos.split(' ')[0], top: objPos.split(' ')[1] }} />
                  <div style={{ color: '#fff', fontSize: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', position: 'absolute', bottom: '10px' }}>Drag to pan image</div>
                </div>
              )}
              <img src={displaySrc} alt={element.alt} style={{ width: '100%', height: '100%', objectFit: element.objectFit, objectPosition: objPos, borderWidth: `${element.stroke?.width ?? 0}px`, borderStyle: element.stroke?.style || 'solid', borderColor: getAdaptedBorderColor(element.stroke?.color || 'transparent'), borderRadius: `${element.stroke?.radius ?? 0}px`, boxSizing: 'border-box' }} draggable={false} loading="lazy" decoding="async" />
            </div>
          </div>
        );
      }
      case 'video':
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
             {elAny.title && <div className="media-header" style={{ fontSize: `${elAny.fontSize || 11}px` }}>{elAny.title}</div>}
             <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }} onPointerDown={handleFocalPointPointerDown}>
               <div className="media-settings-btn" style={{ pointerEvents: 'auto' }} onClick={(e) => { e.stopPropagation(); setEditingFocalPointId(isEditingFocalPoint ? null : element.id); }} title="Set Video Alignment"><Settings size={14} /></div>
               {isEditingFocalPoint && <div className="focal-point-overlay" style={{ cursor: 'move' }}><div style={{ color: '#fff', fontSize: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px' }}>Drag to align video</div></div>}
              <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}><iframe src={element.src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderWidth: `${element.stroke?.width ?? 0}px`, borderStyle: element.stroke?.style || 'solid', borderColor: getAdaptedBorderColor(element.stroke?.color || 'transparent'), borderRadius: `${element.stroke?.radius ?? 0}px`, boxSizing: 'border-box' }} frameBorder="0" allowFullScreen /></div>
             </div>
          </div>
        );
      case 'shape': {
        const shapeText = elAny.text || '';
        let shapeTextOverlay = null;
 
        if (isEditingText) {
          shapeTextOverlay = (
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid #4caf50',
                borderRadius: `${element.borderRadius || 0}px`,
                boxSizing: 'border-box',
                padding: '8px',
                overflowY: 'auto'
              }}
            >
              {renderToolbar()}
              <div
                ref={editableRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={saveTextEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    saveTextEdit();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsEditingText(false);
                  }
                }}
                style={{
                  ...textFormattingStyle,
                  width: '100%',
                  outline: 'none',
                  userSelect: 'text',
                  wordBreak: 'break-word',
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData('text/plain');
                  insertPlainTextAtSelection(text);
                }}
                onKeyUp={() => {
                  savedRangeRef.current = saveSelection();
                }}
                onMouseUp={() => {
                  savedRangeRef.current = saveSelection();
                }}
              />
            </div>
          );
        } else if (shapeText) {
          shapeTextOverlay = (
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                pointerEvents: 'none', 
                padding: '8px', 
                boxSizing: 'border-box', 
                overflow: 'hidden' 
              }}
            >
              <div
                style={{
                  width: '100%',
                  ...textFormattingStyle,
                  wordBreak: 'break-word',
                }}
                dangerouslySetInnerHTML={{ __html: shapeText }}
              />
            </div>
          );
        }

        if (element.shapeType === 'line') {
          return (
            <div 
              style={{ position: 'relative', width: '100%', height: '100%' }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              <svg width="100%" height="100%" style={{ overflow: 'visible', filter: element.shadow?.enabled ? `drop-shadow(${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color})` : undefined }}>
                <line x1="0" y1="0" x2={element.width} y2={element.height} stroke={getAdaptedBorderColor(element.borderColor)} strokeWidth={element.borderWidth} strokeDasharray={element.stroke?.style === 'dashed' ? '8 4' : element.stroke?.style === 'dotted' ? '2 2' : undefined} />
              </svg>
              {shapeTextOverlay}
            </div>
          );
        }
        if (element.shapeType === 'arrow') {
          const markerId = `arrowhead-${element.id}`;
          return (
            <div 
              style={{ position: 'relative', width: '100%', height: '100%' }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              <svg width="100%" height="100%" style={{ overflow: 'visible', filter: element.shadow?.enabled ? `drop-shadow(${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color})` : undefined }}>
                <defs>
                  <marker 
                    id={markerId} 
                    viewBox="0 0 10 10" 
                    refX="6" 
                    refY="5" 
                    markerWidth="8" 
                    markerHeight="8" 
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill={getAdaptedBorderColor(element.borderColor)} />
                  </marker>
                </defs>
                <line 
                  x1="0" 
                  y1="0" 
                  x2={element.width} 
                  y2={element.height} 
                  stroke={getAdaptedBorderColor(element.borderColor)} 
                  strokeWidth={element.borderWidth} 
                  strokeDasharray={element.stroke?.style === 'dashed' ? '8 4' : element.stroke?.style === 'dotted' ? '2 2' : undefined}
                  markerEnd={`url(#${markerId})`} 
                />
              </svg>
              {shapeTextOverlay}
            </div>
          );
        }
        if (element.shapeType === 'elbow') {
          const halfWidth = element.width / 2;
          const d = `M 0 0 L ${halfWidth} 0 L ${halfWidth} ${element.height} L ${element.width} ${element.height}`;
          return (
            <div 
              style={{ position: 'relative', width: '100%', height: '100%' }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              <svg width="100%" height="100%" style={{ overflow: 'visible', filter: element.shadow?.enabled ? `drop-shadow(${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color})` : undefined }}>
                <path d={d} fill="none" stroke={getAdaptedBorderColor(element.borderColor)} strokeWidth={element.borderWidth} strokeDasharray={element.stroke?.style === 'dashed' ? '8 4' : element.stroke?.style === 'dotted' ? '2 2' : undefined} />
              </svg>
              {shapeTextOverlay}
            </div>
          );
        }

        if (element.shapeType === 'rectangle') {
          return (
            <div 
              style={{ position: 'relative', width: '100%', height: '100%', background: fillBackground, borderWidth: `${element.stroke?.width ?? 0}px`, borderStyle: element.stroke?.style || 'solid', borderColor: getAdaptedBorderColor(element.stroke?.color || 'transparent'), borderRadius: `${element.stroke?.radius ?? 0}px` }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              {shapeTextOverlay}
            </div>
          );
        }
        if (element.shapeType === 'ellipse') {
          return (
            <div 
              style={{ position: 'relative', width: '100%', height: '100%', background: fillBackground, borderWidth: `${element.stroke?.width ?? 0}px`, borderStyle: element.stroke?.style || 'solid', borderColor: getAdaptedBorderColor(element.stroke?.color || 'transparent'), borderRadius: '50%' }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              {shapeTextOverlay}
            </div>
          );
        }

        const ptsMap = {
          triangle: "50,0 100,100 0,100",
          rightTriangle: "0,0 100,100 0,100",
          diamond: "50,0 100,50 50,100 0,50",
          pentagon: "50,0 100,38 82,100 18,100 0,38",
          hexagon: "50,0 100,25 100,75 50,100 0,75 0,25",
          parallelogram: "25,0 100,0 75,100 0,100",
          trapezoid: "20,0 80,0 100,100 0,100",
          star: "50,0 63,38 100,38 69,59 82,100 50,75 18,100 31,59 0,38 37,38",
          arrowRight: "0,30 60,30 60,10 100,50 60,90 60,70 0,70",
          arrowLeft: "100,30 40,30 40,10 0,50 40,90 40,70 100,70",
          arrowUp: "30,100 30,40 10,40 50,0 90,40 70,40 70,100",
          arrowDown: "30,0 30,60 10,60 50,100 90,60 70,60 70,0"
        };
        const shapePts = (ptsMap as any)[element.shapeType] || ptsMap.triangle;

        return (
          <div 
            style={{ position: 'relative', width: '100%', height: '100%' }}
            onDoubleClick={() => setIsEditingText(true)}
          >
            <svg width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible', filter: element.shadow?.enabled ? `drop-shadow(${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color})` : undefined }}>
              <defs>{renderSvgFillDef()}</defs>
              <polygon points={shapePts} fill={svgFill} stroke={getAdaptedBorderColor(element.borderColor)} strokeWidth={element.borderWidth} strokeDasharray={element.stroke?.style === 'dashed' ? '8 4' : element.stroke?.style === 'dotted' ? '2 2' : undefined} vectorEffect="non-scaling-stroke" />
            </svg>
            {shapeTextOverlay}
          </div>
        );
      }
      case 'icon': {
        const svgPath = getIconSvgPath(element.iconName || 'home');
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg 
              viewBox="0 0 24 24" 
              width="100%" 
              height="100%" 
              stroke={element.iconColor || element.color || 'currentColor'} 
              fill="none" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ display: 'block', filter: element.shadow?.enabled ? `drop-shadow(${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color})` : undefined }}
            >
              <g dangerouslySetInnerHTML={{ __html: svgPath }} />
            </svg>
          </div>
        );
      }
      case 'node':
        return <>{elements.filter(el => el.parentId === element.id).map(child => <ElementWrapper key={child.id} element={child} />)}</>;
      default: return null;
    }
  };

  const isConnectingToThis = connectingNode && connectingNode.id !== element.id;
  const elAny = element as any;
  const isFillParent = elAny.parentId && elAny.fillParent;

  return (
    <div 
      ref={wrapperRef}
      className={`element-wrapper ${element.type === 'node' ? 'is-node' : ''} ${element.type === 'button' ? 'is-button' : ''} ${isSelected ? 'selected' : ''} ${isConnectingToThis ? 'connecting' : ''} ${element.isDisabled ? 'disabled' : ''} ${element.isHidden ? 'is-hidden' : ''} ${isBrushMode ? 'pointer-events-none' : ''}`}
      data-id={element.id}
      style={{ 
        left: isFillParent ? 0 : element.x, 
        top: isFillParent ? 0 : element.y, 
        width: isFillParent ? '100%' : element.width, 
        height: isFillParent ? '100%' : element.height, 
        transform: isFillParent ? 'none' : `rotate(${element.rotation || 0}deg)`, 
        background: element.type === 'node' ? getFillBackground(rawElement.fill) || getAdaptedBgColor('node', element.backgroundColor) : undefined, 
        zIndex: element.zIndex ?? (element.type === 'node' ? 20 : 21),
        opacity: element.isHidden || element.isDisabled ? undefined : (element.opacity ?? 1),
        pointerEvents: isBrushMode ? 'none' : 'auto',
        borderWidth: element.type === 'node' ? `${element.stroke?.width ?? 1}px` : undefined,
        borderStyle: element.type === 'node' ? (element.stroke?.style || 'solid') : undefined,
        borderColor: element.type === 'node' ? getAdaptedBorderColor(element.stroke?.color || 'var(--border-color)') : undefined,
        borderRadius: ['node', 'text', 'button', 'image', 'video'].includes(element.type) ? `${element.stroke?.radius ?? (element.type === 'node' ? 10 : element.type === 'button' ? 6 : 0)}px` : undefined,
        boxShadow: element.type !== 'shape' && element.type !== 'icon' && element.shadow?.enabled ? `${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.spread || 0}px ${element.shadow.color}` : undefined,
      }}
      onPointerDown={handlePointerDown}
      onDoubleClick={(e) => {
        if (isPresenting) return;
        if (['text', 'button', 'shape'].includes(element.type)) {
          e.stopPropagation();
          setIsEditingText(true);
        }
      }}
    >
      {element.type === 'node' && (
        <div className="element-header" style={{ fontFamily: element.fontFamily, fontSize: `${elAny.fontSize || 14}px` }}>
          <Settings size={16} color="#8c8d9c" />
          {isEditingText ? (
            <input
              type="text"
              value={element.title || ''}
              autoFocus
              onChange={(e) => updateElement(element.id, { title: e.target.value })}
              onBlur={() => setIsEditingText(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingText(false);
                }
              }}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid #4caf50',
                color: getAdaptedTextColor(element.color),
                outline: 'none',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
              onFocus={(e) => e.target.select()}
            />
          ) : (
            <span 
              style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: getAdaptedTextColor(element.color) }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              {element.title || 'NODE'}
            </span>
          )}
        </div>
      )}
      <div 
        ref={contentRef} 
        className="element-content"
        style={{
          pointerEvents: isEditingText ? 'auto' : (isPresenting ? 'auto' : (['text', 'button', 'shape'].includes(element.type) ? 'none' : 'auto'))
        }}
      >
        {renderContent()}
      </div>
      {!element.parentId && !isEditingFocalPoint && (
        <>
          <div className="node-handle top" onPointerDown={(e) => handlePortDown(e, 'top')} onPointerUp={(e) => handlePortUp(e, 'top')} />
          <div className="node-handle right" onPointerDown={(e) => handlePortDown(e, 'right')} onPointerUp={(e) => handlePortUp(e, 'right')} />
          <div className="node-handle bottom" onPointerDown={(e) => handlePortDown(e, 'bottom')} onPointerUp={(e) => handlePortUp(e, 'bottom')} />
          <div className="node-handle left" onPointerDown={(e) => handlePortDown(e, 'left')} onPointerUp={(e) => handlePortUp(e, 'left')} />
        </>
      )}
      {isSelected && !isEditingFocalPoint && !element.isLocked && (
        <>
          <div className="rotate-handle" onPointerDown={handleRotateStart} onDoubleClick={(e) => { e.stopPropagation(); updateElement(element.id, { rotation: 0 }); }} title="Rotate Element (Double-click to reset)" />
          <div className="resize-handle nw" onPointerDown={(e) => handleResizeStart(e, 'nw')} /><div className="resize-handle ne" onPointerDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="resize-handle sw" onPointerDown={(e) => handleResizeStart(e, 'sw')} /><div className="resize-handle se" onPointerDown={(e) => handleResizeStart(e, 'se')} />
        </>
      )}
    </div>
  );
};
