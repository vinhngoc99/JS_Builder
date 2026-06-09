import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useBuilder } from '../BuilderContext';
import { ElementWrapper } from './ElementWrapper';
import { ZoomIn, ZoomOut, Maximize, MousePointer2, Type, Square, Play, Image as ImageIcon, Layout, Pencil, Trash2, Copy, Eraser, RotateCcw, RotateCw, X, Settings, Smile } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const Canvas: React.FC = () => {
  const { 
    elements, connections, selectElement, connectingNode, setConnectingNode, 
    selectedIds, selectedConnectionId, selectConnection, removeElement, removeConnection, 
    scale, setScale, pan, setPan, editingFocalPointId, setEditingFocalPointId, 
    addElement, removeSelected, duplicateSelected, updateElement,
    brushStrokes, isBrushMode, brushColor, brushWidth, setBrushWidth, addBrushStroke, clearBrush, setBrushMode, setBrushColor, undo, redo, saveHistory,
    theme, guides, addGuide, updateGuide, removeGuide, copySelected, pasteCopied, selectAll, isSnapEnabled, isPresenting, setIsPresenting,
    currentSlideIndex, setCurrentSlideIndex, revealDownstream, isHelpOpen, setIsHelpOpen,
    brushTool, setBrushTool, eraseBrushStrokesAt
  } = useBuilder();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, originalX: number, originalY: number } | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);
  const [currentStroke, setCurrentStroke] = useState<{ x: number, y: number }[] | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const lastEraserPos = useRef<{ x: number, y: number } | null>(null);
  const brushCursorRef = useRef<HTMLDivElement>(null);
  
  const [snapGuides, setSnapGuides] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [draggedGuide, setDraggedGuide] = useState<{ id: string; type: 'horizontal' | 'vertical'; isNew: boolean } | null>(null);

  const [isLaserActive, setIsLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
  const [laserTrail, setLaserTrail] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!isLaserActive) return;
    const handlePointerMoveLaser = (e: PointerEvent) => {
      setLaserPos({ x: e.clientX, y: e.clientY });
      setLaserTrail(prev => {
        const next = [...prev, { x: e.clientX, y: e.clientY }];
        if (next.length > 20) {
          next.shift();
        }
        return next;
      });
    };
    window.addEventListener('pointermove', handlePointerMoveLaser);
    return () => window.removeEventListener('pointermove', handlePointerMoveLaser);
  }, [isLaserActive]);

  useEffect(() => {
    if (!isLaserActive) {
      setLaserTrail([]);
      return;
    }
    
    let active = true;
    const decay = () => {
      if (!active) return;
      setLaserTrail(prev => {
        if (prev.length === 0) return prev;
        return prev.slice(1);
      });
      requestAnimationFrame(decay);
    };
    
    const interval = setTimeout(() => {
      requestAnimationFrame(decay);
    }, 80);
    
    return () => {
      active = false;
      clearTimeout(interval);
    };
  }, [isPresenting, isLaserActive, laserPos]);

  const goToSlide = useCallback((index: number) => {
    const slides = elements.filter(el => el.type === 'node' && (el as any).isSlide !== false).sort((a, b) => a.x - b.x);
    if (slides.length === 0) return;
    const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
    setCurrentSlideIndex(safeIndex);
    
    const slide = slides[safeIndex];
    
    if (slide.isHidden) {
      updateElement(slide.id, { isHidden: false });
      revealDownstream(slide.id);
    }

    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const padding = 60;
    const availW = rect.width - padding * 2;
    const availH = rect.height - padding * 2;
    
    const scaleX = availW / slide.width;
    const scaleY = availH / slide.height;
    const targetScale = Math.min(scaleX, scaleY, 2.0);
    
    const targetPanX = rect.width / 2 - (slide.x + slide.width / 2) * targetScale;
    const targetPanY = rect.height / 2 - (slide.y + slide.height / 2) * targetScale;
    
    setScale(targetScale);
    setPan({ x: targetPanX, y: targetPanY });
  }, [elements, setScale, setPan, updateElement, revealDownstream, setCurrentSlideIndex]);

  useEffect(() => {
    if (isPresenting) {
      goToSlide(currentSlideIndex);
    }
  }, [isPresenting, currentSlideIndex, goToSlide]);

  // Expose snapGuides via window so ElementWrapper can update them during drag
  useEffect(() => {
    (window as any).setSnapGuides = setSnapGuides;
    return () => { delete (window as any).setSnapGuides; };
  }, []);
  
  const startPanInfo = useRef({ startX: 0, startY: 0, initialPanX: 0, initialPanY: 0 });

  const zoomToFit = useCallback(() => {
    if (elements.length === 0 || !canvasRef.current) {
      setScale(1); setPan({ x: 0, y: 0 }); return;
    }
    const padding = 50;
    const rect = canvasRef.current.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    elements.filter(el => !el.parentId).forEach(el => {
      minX = Math.min(minX, el.x); minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width); maxY = Math.max(maxY, el.y + el.height);
    });
    const contentWidth = maxX - minX, contentHeight = maxY - minY;
    const availableWidth = rect.width - padding * 2, availableHeight = rect.height - padding * 2;
    const newScale = Math.min(Math.min(availableWidth / contentWidth, availableHeight / contentHeight), 1.5);
    const centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2;
    const newPanX = rect.width / 2 - centerX * newScale, newPanY = rect.height / 2 - centerY * newScale;
    setScale(newScale); setPan({ x: newPanX, y: newPanY });
  }, [elements, setScale, setPan]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.contentEditable === 'true';
      
      if (!isInput && (e.key.toLowerCase() === 'h' || e.key === '?')) {
        e.preventDefault();
        setIsHelpOpen(!isHelpOpen);
        return;
      }

      if (!isInput && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setIsLaserActive(prev => !prev);
        return;
      }

      if (isPresenting) {
        const slides = elements.filter(el => el.type === 'node' && (el as any).isSlide !== false).sort((a, b) => a.x - b.x);
        if (e.key === 'ArrowRight' || e.key === ' ' || e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          if (currentSlideIndex < slides.length - 1) {
            goToSlide(currentSlideIndex + 1);
          }
        } else if (e.key === 'ArrowLeft' || ((e.key === ' ' || e.code === 'Space') && e.shiftKey)) {
          e.preventDefault();
          if (currentSlideIndex > 0) {
            goToSlide(currentSlideIndex - 1);
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setIsPresenting(false);
        }
        return;
      }

      if (!isInput && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedIds.length > 0) {
        e.preventDefault();
        saveHistory();
        const moveAmount = e.shiftKey ? 10 : 1;
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowUp') dy = -moveAmount;
        else if (e.key === 'ArrowDown') dy = moveAmount;
        else if (e.key === 'ArrowLeft') dx = -moveAmount;
        else if (e.key === 'ArrowRight') dx = moveAmount;

        selectedIds.forEach(id => {
          const el = elements.find(x => x.id === id);
          if (el && !el.isLocked) {
            updateElement(el.id, { x: el.x + dx, y: el.y + dy });
          }
        });
        return;
      }

      if (editingFocalPointId && (e.key === 'Enter' || e.key === 'Escape')) { setEditingFocalPointId(null); return; }
      if (!isInput && e.code === 'Space') { e.preventDefault(); setIsSpaceDown(true); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        if (selectedIds.length > 0) removeSelected();
        else if (selectedConnectionId) removeConnection(selectedConnectionId);
      }
      if (e.ctrlKey && e.key === 'd' && !isInput) { e.preventDefault(); duplicateSelected(); }
      if (e.key.toLowerCase() === 'b' && !isInput) {
        e.preventDefault();
        if (isBrushMode && brushTool === 'draw') {
          setBrushMode(false);
        } else {
          setBrushMode(true);
          setBrushTool('draw');
        }
      }
      if (e.key.toLowerCase() === 'e' && !isInput) {
        e.preventDefault();
        if (isBrushMode && brushTool === 'erase') {
          setBrushMode(false);
        } else {
          setBrushMode(true);
          setBrushTool('erase');
        }
      }
      if (e.key.toLowerCase() === 'x' && !isInput) {
        e.preventDefault();
        clearBrush();
      }
      
      // Select All, Copy, Paste
      if (e.ctrlKey && e.key === 'a' && !isInput) { e.preventDefault(); selectAll(); }
      if (e.ctrlKey && e.key === 'c' && !isInput) { e.preventDefault(); copySelected(); }
      if (e.ctrlKey && e.key === 'v' && !isInput) { e.preventDefault(); pasteCopied(); }

      // Undo / Redo
      if (e.ctrlKey && !e.shiftKey && e.key === 'z' && !isInput) { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.shiftKey && e.key === 'Z' && !isInput) { e.preventDefault(); redo(); } // some browsers
      if (e.ctrlKey && e.key === 'y' && !isInput) { e.preventDefault(); redo(); }
    };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') { setIsSpaceDown(false); setIsPanning(false); } };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [selectedIds, selectedConnectionId, removeSelected, removeConnection, editingFocalPointId, setEditingFocalPointId, duplicateSelected, isBrushMode, setBrushMode, clearBrush, undo, redo, selectAll, copySelected, pasteCopied, isPresenting, currentSlideIndex, elements, goToSlide, setIsPresenting, isHelpOpen, setIsHelpOpen, brushTool, setBrushTool]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const el = canvasRef.current; if (!el) return;
      const delta = -e.deltaY * 0.001;
      const newScale = Math.min(Math.max(0.1, scale * (1 + delta)), 5);
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
      const canvasX = (mouseX - pan.x) / scale, canvasY = (mouseY - pan.y) / scale;
      const newPanX = mouseX - canvasX * newScale, newPanY = mouseY - canvasY * newScale;
      setScale(newScale); setPan({ x: newPanX, y: newPanY });
    };
    const el = canvasRef.current; if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); }
  }, [scale, pan, setScale, setPan]);

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (contextMenu) setContextMenu(null);
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / scale, y = (e.clientY - rect.top - pan.y) / scale;

    if (isSpaceDown) {
      setIsPanning(true);
      startPanInfo.current = { startX: e.clientX, startY: e.clientY, initialPanX: pan.x, initialPanY: pan.y };
      return;
    }
    if (isBrushMode) {
      if (brushTool === 'erase') {
        saveHistory();
        setIsErasing(true);
        lastEraserPos.current = { x, y };
        eraseBrushStrokesAt({ x, y }, null, brushWidth / 2);
      } else {
        setCurrentStroke([{ x, y }]);
      }
      return;
    }
    if (!e.shiftKey) { selectElement(null); selectConnection(null); }
    setSelectionBox({ x1: x, y1: y, x2: x, y2: y });
  };

  const contextMenuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!contextMenu || !contextMenuRef.current) return;
    
    const menuEl = contextMenuRef.current;
    const rect = menuEl.getBoundingClientRect();
    const width = rect.width || 190;
    const height = rect.height || 250;
    
    let adjustedX = contextMenu.originalX;
    let adjustedY = contextMenu.originalY;
    
    if (adjustedX + width > window.innerWidth) {
      adjustedX = window.innerWidth - width - 10;
    }
    if (adjustedY + height > window.innerHeight) {
      adjustedY = window.innerHeight - height - 10;
    }
    
    adjustedX = Math.max(10, adjustedX);
    adjustedY = Math.max(10, adjustedY);
    
    if (adjustedX !== contextMenu.x || adjustedY !== contextMenu.y) {
      setContextMenu({
        x: adjustedX,
        y: adjustedY,
        originalX: contextMenu.originalX,
        originalY: contextMenu.originalY
      });
    }
  }, [contextMenu, selectedIds]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const menuWidth = 190;
    const target = e.target as HTMLElement;
    const isElementClick = !!target.closest('.element-wrapper') || selectedIds.length > 0;
    const menuHeight = isElementClick ? 330 : 250;
    
    let x = e.clientX;
    let y = e.clientY;
    
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }
    
    x = Math.max(10, x);
    y = Math.max(10, y);
    
    setContextMenu({ x, y, originalX: e.clientX, originalY: e.clientY });
  };

  const handleAddElementFromMenu = (type: any) => {
    if (!contextMenu) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const clickX = 'originalX' in contextMenu ? contextMenu.originalX : contextMenu.x;
    const clickY = 'originalY' in contextMenu ? contextMenu.originalY : contextMenu.y;
    const x = (clickX - rect.left - pan.x) / scale, y = (clickY - rect.top - pan.y) / scale;
    addElement(type, { x: x - 50, y: y - 25 }); setContextMenu(null);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (brushCursorRef.current) {
      brushCursorRef.current.style.left = `${e.clientX}px`;
      brushCursorRef.current.style.top = `${e.clientY}px`;
    }
    const rect = canvasRef.current!.getBoundingClientRect();
    if (draggedGuide) {
      if (draggedGuide.type === 'horizontal') {
        const canvasY = (e.clientY - rect.top - pan.y) / scale;
        updateGuide(draggedGuide.id, canvasY);
      } else {
        const canvasX = (e.clientX - rect.left - pan.x) / scale;
        updateGuide(draggedGuide.id, canvasX);
      }
      return;
    }

    const x = (e.clientX - rect.left - pan.x) / scale, y = (e.clientY - rect.top - pan.y) / scale;
    if (isErasing) {
      const currentPos = { x, y };
      eraseBrushStrokesAt(currentPos, lastEraserPos.current, brushWidth / 2);
      lastEraserPos.current = currentPos;
      return;
    }
    if (currentStroke) { setCurrentStroke(prev => prev ? [...prev, { x, y }] : null); return; }
    if (isPanning) {
      setPan({
        x: startPanInfo.current.initialPanX + (e.clientX - startPanInfo.current.startX),
        y: startPanInfo.current.initialPanY + (e.clientY - startPanInfo.current.startY)
      });
      return;
    }
    if (selectionBox) { setSelectionBox(prev => prev ? { ...prev, x2: x, y2: y } : null); return; }
    if (connectingNode) { setMousePos({ x, y }); }
  }, [connectingNode, scale, pan, isPanning, setPan, currentStroke, selectionBox, draggedGuide, updateGuide, isErasing, brushWidth, eraseBrushStrokesAt]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (draggedGuide) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      
      if (draggedGuide.type === 'horizontal' && (relativeY < 20 || relativeY > rect.height)) {
        removeGuide(draggedGuide.id);
      } else if (draggedGuide.type === 'vertical' && (relativeX < 20 || relativeX > rect.width)) {
        removeGuide(draggedGuide.id);
      }
      setDraggedGuide(null);
      return;
    }

    if (isErasing) {
      setIsErasing(false);
      lastEraserPos.current = null;
      return;
    }
    if (currentStroke) { addBrushStroke({ id: uuidv4(), points: currentStroke, color: brushColor, width: brushWidth }); setCurrentStroke(null); }
    if (isPanning) setIsPanning(false);
    if (connectingNode) setConnectingNode(null);
    if (selectionBox) {
      const xMin = Math.min(selectionBox.x1, selectionBox.x2), xMax = Math.max(selectionBox.x1, selectionBox.x2);
      const yMin = Math.min(selectionBox.y1, selectionBox.y2), yMax = Math.max(selectionBox.y1, selectionBox.y2);
      elements.filter(el => !el.parentId).forEach(el => { if (el.x >= xMin && el.x + el.width <= xMax && el.y >= yMin && el.y + el.height <= yMax) selectElement(el.id, true); });
      setSelectionBox(null);
    }
  }, [currentStroke, isPanning, connectingNode, selectionBox, elements, selectElement, addBrushStroke, brushColor, brushWidth, setConnectingNode, draggedGuide, removeGuide, isErasing]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove); window.addEventListener('pointerup', handlePointerUp);
    return () => { window.removeEventListener('pointermove', handlePointerMove); window.removeEventListener('pointerup', handlePointerUp); };
  }, [handlePointerMove, handlePointerUp]);

  const [containerSize, setContainerSize] = useState({ width: 1000, height: 1000 });
  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });

    const handleResize = () => {
      if (!canvasRef.current) return;
      const r = canvasRef.current.getBoundingClientRect();
      setContainerSize({ width: r.width, height: r.height });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRulerTicks = (size: number, panOffset: number, scale: number) => {
    const baseIntervals = [10, 50, 100, 500, 1000];
    let interval = 100;
    for (const val of baseIntervals) {
      if (val * scale >= 40) {
        interval = val;
        break;
      }
    }

    const ticks = [];
    const startValue = Math.floor(-panOffset / (interval * scale)) * interval;
    const endValue = Math.ceil((size - panOffset) / (interval * scale)) * interval;

    for (let val = startValue; val <= endValue; val += interval) {
      const pos = panOffset + val * scale;
      ticks.push({ value: val, pos, isMajor: val % (interval * 5) === 0 });
    }
    return { ticks, interval };
  };

  const handleRulerPointerDown = (e: React.PointerEvent, type: 'horizontal' | 'vertical') => {
    e.stopPropagation();
    const rect = canvasRef.current!.getBoundingClientRect();
    const id = uuidv4();
    if (type === 'horizontal') {
      const canvasY = (e.clientY - rect.top - pan.y) / scale;
      addGuide('horizontal', canvasY, id);
      setDraggedGuide({ id, type: 'horizontal', isNew: true });
    } else {
      const canvasX = (e.clientX - rect.left - pan.x) / scale;
      addGuide('vertical', canvasX, id);
      setDraggedGuide({ id, type: 'vertical', isNew: true });
    }
  };

  const handleGuidePointerDown = (e: React.PointerEvent, id: string, type: 'horizontal' | 'vertical') => {
    e.stopPropagation();
    setDraggedGuide({ id, type, isNew: false });
  };

  const getAbsoluteBounds = (id: string) => {
    let el = elements.find(e => e.id === id); if (!el) return null;
    let { x, y, width, height } = el;
    if (el.parentId) { const parent = elements.find(e => e.id === el?.parentId); if (parent) { x += parent.x + 16; y += parent.y + 45 + 16; } }
    return { x, y, width, height };
  };

  const getPathData = (startX: number, startY: number, startPort: string, endX: number, endY: number, endPort: string) => {
    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.hypot(dx, dy);
    const controlDist = Math.min(Math.max(dist * 0.35, 30), 120);
    let cx1 = startX, cy1 = startY, cx2 = endX, cy2 = endY;
    if (startPort === 'top') cy1 -= controlDist; else if (startPort === 'bottom') cy1 += controlDist; else if (startPort === 'left') cx1 -= controlDist; else cx1 += controlDist;
    if (endPort === 'top') cy2 -= controlDist; else if (endPort === 'bottom') cy2 += controlDist; else if (endPort === 'left') cx2 -= controlDist; else cx2 += controlDist;
    return `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
  };

  const getPortCoords = (bounds: any, port: string) => {
    let x = bounds.x + bounds.width / 2, y = bounds.y + bounds.height / 2;
    if (port === 'top') y = bounds.y; else if (port === 'bottom') y = bounds.y + bounds.height; else if (port === 'left') x = bounds.x; else if (port === 'right') x = bounds.x + bounds.width;
    return { x, y };
  };

  const baseGridSize = 24;
  let currentGridSize = baseGridSize * scale;
  while (currentGridSize < 15) currentGridSize *= 2;
  while (currentGridSize > 60) currentGridSize /= 2;

  const renderHorizontalRuler = () => {
    const { ticks } = getRulerTicks(containerSize.width - 20, pan.x - 20, scale);
    return (
      <svg style={{ position: 'absolute', top: 0, left: 20, width: 'calc(100% - 20px)', height: 20, background: 'var(--bg-toolbar)', borderBottom: '1px solid var(--border-color)', zIndex: 1001, userSelect: 'none', pointerEvents: 'auto', cursor: 'row-resize' }} onPointerDown={(e) => handleRulerPointerDown(e, 'horizontal')}>
        {ticks.map((t, idx) => {
          if (t.pos < 0) return null;
          return (
            <g key={`h-tick-${idx}`}>
              <line x1={t.pos} y1={t.isMajor ? 8 : 12} x2={t.pos} y2={20} stroke="var(--text-secondary)" strokeWidth="1" />
              {t.isMajor && (
                <text x={t.pos + 3} y={3} fontSize="9" fill="var(--text-secondary)" textAnchor="start" dominantBaseline="hanging">
                  {t.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  const renderVerticalRuler = () => {
    const { ticks } = getRulerTicks(containerSize.height - 20, pan.y - 20, scale);
    return (
      <svg style={{ position: 'absolute', top: 20, left: 0, width: 20, height: 'calc(100% - 20px)', background: 'var(--bg-toolbar)', borderRight: '1px solid var(--border-color)', zIndex: 1001, userSelect: 'none', pointerEvents: 'auto', cursor: 'col-resize' }} onPointerDown={(e) => handleRulerPointerDown(e, 'vertical')}>
        {ticks.map((t, idx) => {
          if (t.pos < 0) return null;
          return (
            <g key={`v-tick-${idx}`}>
              <line x1={t.isMajor ? 8 : 12} y1={t.pos} x2={20} y2={t.pos} stroke="var(--text-secondary)" strokeWidth="1" />
              {t.isMajor && (
                <text x={2} y={t.pos + 3} fontSize="9" fill="var(--text-secondary)" transform={`rotate(-90 2 ${t.pos + 3})`} textAnchor="end" dominantBaseline="middle">
                  {t.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className={`canvas-container ${(isPresenting && isLaserActive) ? 'laser-cursor-none' : ''} ${(isBrushMode && !isSpaceDown) ? 'brush-cursor-none' : ''}`} onContextMenu={handleContextMenu}>
      {/* Rulers */}
      {!isPresenting && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, background: 'var(--bg-toolbar)', borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', zIndex: 1002 }} />
          {renderHorizontalRuler()}
          {renderVerticalRuler()}
        </>
      )}

      <div 
        className={`canvas ${isSpaceDown ? 'space-down' : ''} ${isPanning ? 'panning' : ''} ${(isBrushMode && !isSpaceDown) ? (brushTool === 'erase' ? 'eraser-cursor' : 'brush-cursor') : ''}`}
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        style={{ backgroundPosition: `${pan.x}px ${pan.y}px`, backgroundSize: `${currentGridSize}px ${currentGridSize}px` }}
      >
        <div 
          className="canvas-content" 
          style={{ 
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, 
            transformOrigin: '0 0', 
            width: '100%', 
            height: '100%', 
            position: 'absolute',
            transition: isPresenting ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
          }}
        >
          
          <svg className="connections-layer" style={{ overflow: 'visible', zIndex: 1, position: 'absolute', pointerEvents: isBrushMode ? 'none' : 'auto' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#6c6d80" />
              </marker>
              <marker id="arrow-selected" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#4caf50" />
              </marker>
            </defs>
            {connections.map(conn => {
              const f = elements.find(el => el.id === conn.fromId);
              const t = elements.find(el => el.id === conn.toId);
              if (!f || !t) return null;

              const fb = getAbsoluteBounds(conn.fromId), tb = getAbsoluteBounds(conn.toId); 
              if (!fb || !tb) return null;
              
              let { x: sx, y: sy } = getPortCoords(fb, conn.fromPort);
              let { x: ex, y: ey } = getPortCoords(tb, conn.toPort);

              // Shorten path if there are arrowheads to create an aesthetic gap
              const gap = 1.8;
              if (conn.startArrow === 'arrow') {
                if (conn.fromPort === 'top') sy -= gap;
                else if (conn.fromPort === 'bottom') sy += gap;
                else if (conn.fromPort === 'left') sx -= gap;
                else if (conn.fromPort === 'right') sx += gap;
              }
              if (conn.endArrow === 'arrow') {
                if (conn.toPort === 'top') ey -= gap;
                else if (conn.toPort === 'bottom') ey += gap;
                else if (conn.toPort === 'left') ex -= gap;
                else if (conn.toPort === 'right') ex += gap;
              }

              const dx = ex - sx;
              const dy = ey - sy;
              const dist = Math.hypot(dx, dy);
              const controlDist = Math.min(Math.max(dist * 0.35, 30), 120);
              let cx1 = sx, cy1 = sy, cx2 = ex, cy2 = ey;
              if (conn.fromPort === 'top') cy1 -= controlDist; 
              else if (conn.fromPort === 'bottom') cy1 += controlDist; 
              else if (conn.fromPort === 'left') cx1 -= controlDist; 
              else cx1 += controlDist;

              if (conn.toPort === 'top') cy2 -= controlDist; 
              else if (conn.toPort === 'bottom') cy2 += controlDist; 
              else if (conn.toPort === 'left') cx2 -= controlDist; 
              else cx2 += controlDist;

              const midX = 0.125 * sx + 0.375 * cx1 + 0.375 * cx2 + 0.125 * ex;
              const midY = 0.125 * sy + 0.375 * cy1 + 0.375 * cy2 + 0.125 * ey;
              const pathData = `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${ex} ${ey}`;
              const markerStart = conn.startArrow === 'arrow' ? (selectedConnectionId === conn.id ? "url(#arrow-selected)" : "url(#arrow)") : "none";
              const markerEnd = conn.endArrow === 'arrow' ? (selectedConnectionId === conn.id ? "url(#arrow-selected)" : "url(#arrow)") : "none";

              return (
                <g 
                  key={conn.id} 
                  className={`connection-group ${selectedConnectionId === conn.id ? 'selected' : ''}`} 
                  onPointerDown={(e) => { e.stopPropagation(); selectConnection(conn.id); }}
                  onDoubleClick={(e) => { e.stopPropagation(); removeConnection(conn.id); }}
                >
                  <path id={`editor-conn-${conn.id}`} d={pathData} className="connection-path" markerStart={markerStart} markerEnd={markerEnd} />
                  <path id={`editor-conn-pulse-${conn.id}`} d={pathData} className="flow-pulse-path" fill="none" stroke={conn.color || '#4c5fd7'} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                  <path d={pathData} stroke="transparent" strokeWidth="20" fill="none" />
                  
                  {conn.label && (
                    conn.labelAlignment === 'follow' ? (
                      <>
                        {conn.reverseLabelDirection && (
                          <path 
                            id={`editor-conn-text-${conn.id}`} 
                            d={`M ${ex} ${ey} C ${cx2} ${cy2}, ${cx1} ${cy1}, ${sx} ${sy}`} 
                            fill="none" 
                            stroke="none" 
                            pointerEvents="none" 
                          />
                        )}
                        <text fill={conn.color || "var(--text-primary)"} fontSize={conn.fontSize || "14"} fontFamily={conn.fontFamily} dy="-5" pointerEvents="none" fontWeight="bold">
                          <textPath href={conn.reverseLabelDirection ? `#editor-conn-text-${conn.id}` : `#editor-conn-${conn.id}`} startOffset="50%" textAnchor="middle">{conn.label}</textPath>
                        </text>
                      </>
                    ) : (
                      <foreignObject 
                        x={midX - 200} 
                        y={midY - 20} 
                        width={400} 
                        height={40} 
                        pointerEvents="none"
                      >
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', pointerEvents: 'none' }}>
                          <span 
                            style={{ 
                              background: 'var(--bg-canvas)', 
                              padding: '3px 10px', 
                              borderRadius: '100px', 
                              fontSize: `${conn.fontSize || 12}px`, 
                              color: conn.color || 'var(--text-primary)', 
                              fontWeight: 'bold', 
                              whiteSpace: 'nowrap',
                              border: '1px solid var(--border-color)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                              fontFamily: conn.fontFamily || 'inherit'
                            }}
                          >
                            {conn.label}
                          </span>
                        </div>
                      </foreignObject>
                    )
                  )}
                </g>
              );
            })}
            {connectingNode && <path d={getPathData(getPortCoords(getAbsoluteBounds(connectingNode.id), connectingNode.port).x, getPortCoords(getAbsoluteBounds(connectingNode.id), connectingNode.port).y, connectingNode.port, mousePos.x, mousePos.y, 'left')} fill="none" stroke="#4caf50" strokeWidth="2" strokeDasharray="5,5" />}
          </svg>

          {elements.filter(el => !el.parentId).map(el => (
            <ElementWrapper key={el.id} element={el} />
          ))}

          {/* Custom user guidelines */}
          {guides.map(guide => {
            if (guide.type === 'horizontal') {
              return (
                <div 
                  key={guide.id}
                  onPointerDown={(e) => handleGuidePointerDown(e, guide.id, 'horizontal')}
                  style={{ 
                    position: 'absolute', 
                    top: guide.position, 
                    left: -10000, 
                    right: -10000, 
                    height: '6px', 
                    marginTop: '-3px',
                    borderTop: '1.5px dashed #ff5252', 
                    cursor: 'row-resize', 
                    zIndex: 1998, 
                    pointerEvents: isBrushMode ? 'none' : 'auto' 
                  }} 
                />
              );
            } else {
              return (
                <div 
                  key={guide.id}
                  onPointerDown={(e) => handleGuidePointerDown(e, guide.id, 'vertical')}
                  style={{ 
                    position: 'absolute', 
                    left: guide.position, 
                    top: -10000, 
                    bottom: -10000, 
                    width: '6px', 
                    marginLeft: '-3px',
                    borderLeft: '1.5px dashed #ff5252', 
                    cursor: 'col-resize', 
                    zIndex: 1998, 
                    pointerEvents: isBrushMode ? 'none' : 'auto' 
                  }} 
                />
              );
            }
          })}

          {/* Dynamic snapping guidelines */}
          {isSnapEnabled && snapGuides.x !== null && (
            <div style={{ position: 'absolute', left: snapGuides.x, top: -10000, bottom: -10000, width: '1px', borderLeft: '1px dashed #4caf50', zIndex: 1999, pointerEvents: 'none' }} />
          )}
          {isSnapEnabled && snapGuides.y !== null && (
            <div style={{ position: 'absolute', top: snapGuides.y, left: -10000, right: -10000, height: '1px', borderTop: '1px dashed #4caf50', zIndex: 1999, pointerEvents: 'none' }} />
          )}

          <svg className="brush-layer" style={{ overflow: 'visible', position: 'absolute', zIndex: 1000, pointerEvents: 'none' }}>
            {brushStrokes.map(s => {
              const attachedNode = elements.find(el => el.id === s.attachedNodeId);
              const isHidden = attachedNode ? attachedNode.isHidden : false;
              return (
                <path
                  key={s.id}
                  d={s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isHidden ? 0.2 : 1}
                />
              );
            })}
            {currentStroke && <path d={currentStroke.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} fill="none" stroke={brushColor} strokeWidth={brushWidth} strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />}
          </svg>

          {selectionBox && (
            <div style={{ position: 'absolute', left: Math.min(selectionBox.x1, selectionBox.x2), top: Math.min(selectionBox.y1, selectionBox.y2), width: Math.abs(selectionBox.x2 - selectionBox.x1), height: Math.abs(selectionBox.y2 - selectionBox.y1), backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4caf50', pointerEvents: 'none', zIndex: 2000 }} />
          )}
        </div>
      </div>

      {!isPresenting && (
        <div className="brush-toolbar" style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', background: 'var(--bg-toolbar)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)', zIndex: 1000, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', alignItems: 'center' }}>
          <button 
            className={`btn ${isBrushMode && brushTool === 'draw' ? 'primary' : ''}`} 
            onClick={() => {
              if (isBrushMode && brushTool === 'draw') {
                setBrushMode(false);
              } else {
                setBrushMode(true);
                setBrushTool('draw');
              }
            }} 
            title="Brush Tool (B)"
          >
            <Pencil size={18} />
          </button>
          <button 
            className={`btn ${isBrushMode && brushTool === 'erase' ? 'primary' : ''}`} 
            onClick={() => {
              if (isBrushMode && brushTool === 'erase') {
                setBrushMode(false);
              } else {
                setBrushMode(true);
                setBrushTool('erase');
              }
            }} 
            title="Eraser Tool (E)"
          >
            <Eraser size={18} />
          </button>
          <button className="btn" onClick={clearBrush} title="Clear All Drawings (X)"><Trash2 size={18} /></button>
          <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 5px' }} />
          <button className="btn" onClick={undo} title="Undo (Ctrl+Z)"><RotateCcw size={18} /></button>
          <button className="btn" onClick={redo} title="Redo (Ctrl+Shift+Z)"><RotateCw size={18} /></button>
          <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 5px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', userSelect: 'none' }}>Size:</span>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={brushWidth} 
              onChange={(e) => setBrushWidth(parseInt(e.target.value))} 
              style={{ width: '60px', cursor: 'pointer', height: '4px', background: 'var(--border-color)', borderRadius: '2px', outline: 'none' }}
              title={`Brush Size: ${brushWidth}px`}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', minWidth: '16px', textAlign: 'right', userSelect: 'none' }}>{brushWidth}</span>
          </div>
          <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 5px' }} />
          <div className="color-picker-wrapper">
            <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
          </div>
        </div>
      )}

      {contextMenu && !isPresenting && (
        <div ref={contextMenuRef} className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }}>
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('node')}><Layout size={14} /> Add Node</div>
          <div className="context-menu-separator" />
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('text')}><Type size={14} /> Add Text</div>
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('button')}><MousePointer2 size={14} /> Add Button</div>
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('image')}><ImageIcon size={14} /> Add Image</div>
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('video')}><Play size={14} /> Add Video</div>
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('icon')}><Smile size={14} /> Add Icon</div>
          {selectedIds.length > 0 && (
            <>
              <div className="context-menu-separator" />
              <div className="context-menu-item" onClick={() => { duplicateSelected(); setContextMenu(null); }}><Copy size={14} /> Duplicate Selected</div>
              <div className="context-menu-item" onClick={() => { removeSelected(); setContextMenu(null); }} style={{ color: '#ef5350' }}><Trash2 size={14} /> Delete Selected</div>
            </>
          )}
        </div>
      )}

      {!isPresenting && (
        <div className="zoom-controls">
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={zoomToFit} className="btn-fit">Fit in view</button>
        </div>
      )}

      {isPresenting && (
        <div 
          style={{ 
            position: 'fixed', 
            bottom: '24px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: 'var(--bg-toolbar)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '24px', 
            padding: '8px 24px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px', 
            zIndex: 10000, 
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)', 
            color: 'var(--text-primary)' 
          }}
        >
          <button 
            className="btn" 
            onClick={() => {
              if (currentSlideIndex > 0) setCurrentSlideIndex(currentSlideIndex - 1);
            }} 
            disabled={currentSlideIndex === 0}
            tabIndex={-1}
            style={{ padding: '6px 12px', opacity: currentSlideIndex === 0 ? 0.4 : 1, background: 'var(--btn-bg)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
          >
            &larr; Prev
          </button>
          
          <select 
            value={currentSlideIndex}
            onChange={(e) => goToSlide(parseInt(e.target.value))}
            style={{ 
              background: 'var(--input-bg)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '4px 8px', 
              fontSize: '13px', 
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {elements
              .filter(el => el.type === 'node' && (el as any).isSlide !== false)
              .sort((a, b) => a.x - b.x)
              .map((slide, idx) => (
                <option key={slide.id} value={idx}>
                  Slide {idx + 1}: {slide.title || `Node ${idx + 1}`}
                </option>
              ))}
          </select>
          
          <button 
            className="btn" 
            onClick={() => {
              const slidesCount = elements.filter(el => el.type === 'node' && (el as any).isSlide !== false).length;
              if (currentSlideIndex < slidesCount - 1) setCurrentSlideIndex(currentSlideIndex + 1);
            }} 
            disabled={currentSlideIndex === elements.filter(el => el.type === 'node' && (el as any).isSlide !== false).length - 1}
            tabIndex={-1}
            style={{ padding: '6px 12px', opacity: currentSlideIndex === elements.filter(el => el.type === 'node' && (el as any).isSlide !== false).length - 1 ? 0.4 : 1, background: 'var(--btn-bg)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
          >
            Next &rarr;
          </button>
          
          <div style={{ width: '1px', background: 'var(--border-color)', height: '20px' }} />
          
          <button 
            className="btn" 
            onClick={() => setIsPresenting(false)} 
            tabIndex={-1}
            style={{ padding: '6px 16px', background: '#ef5350', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}
          >
            Exit
          </button>
        </div>
      )}

      {/* Presentation Laser Pointer and Trail */}
      {isLaserActive && (
        <>
          <svg 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
              zIndex: 100000,
              overflow: 'visible'
            }}
          >
            {laserTrail.map((p, i) => {
              if (i === 0) return null;
              const prevPoint = laserTrail[i - 1];
              const ratio = i / laserTrail.length;
              const opacity = ratio * 0.8;
              const strokeWidth = ratio * 8 + 2;
              return (
                <line
                  key={`laser-seg-${i}`}
                  x1={prevPoint.x}
                  y1={prevPoint.y}
                  x2={p.x}
                  y2={p.y}
                  stroke="#ff1744"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  opacity={opacity}
                  style={{
                    filter: 'drop-shadow(0 0 4px #ff1744)',
                  }}
                />
              );
            })}
          </svg>
          <div 
            className="laser-pointer"
            style={{
              position: 'fixed',
              left: laserPos.x,
              top: laserPos.y,
              pointerEvents: 'none',
              zIndex: 100001,
            }}
          />
        </>
      )}

      {/* Keyboard Shortcuts Help Modal */}
      {isHelpOpen && (
        <div className="help-modal-overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="help-modal-header">
              <h2>Keyboard Shortcuts</h2>
              <button className="help-close-btn" onClick={() => setIsHelpOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="help-modal-body">
              <div className="shortcut-section">
                <h3>General Editing</h3>
                <div className="shortcut-grid">
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>C</kbd> / <kbd>V</kbd></span><span className="shortcut-desc">Copy / Paste selected</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>D</kbd></span><span className="shortcut-desc">Duplicate selected</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Delete</kbd> / <kbd>Backspace</kbd></span><span className="shortcut-desc">Delete selected element / connection</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>A</kbd></span><span className="shortcut-desc">Select all elements</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>Y</kbd></span><span className="shortcut-desc">Undo / Redo</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Shift</kbd> + Drag</span><span className="shortcut-desc">Lock drag axis (horizontal/vertical)</span></div>
                </div>
              </div>
              <div className="shortcut-section">
                <h3>Tools & View</h3>
                <div className="shortcut-grid">
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>B</kbd></span><span className="shortcut-desc">Toggle brush tool</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>E</kbd></span><span className="shortcut-desc">Toggle eraser tool</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>X</kbd></span><span className="shortcut-desc">Clear all drawings</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Space</kbd> + Drag</span><span className="shortcut-desc">Pan canvas</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Scroll Wheel</kbd></span><span className="shortcut-desc">Zoom in / out</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>H</kbd> / <kbd>?</kbd></span><span className="shortcut-desc">Toggle this Help shortcuts menu</span></div>
                </div>
              </div>
              <div className="shortcut-section">
                <h3>Presentation Mode</h3>
                <div className="shortcut-grid">
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Space</kbd> / <kbd>Enter</kbd> / <kbd>&rarr;</kbd></span><span className="shortcut-desc">Next slide</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Shift</kbd> + <kbd>Space</kbd> / <kbd>&larr;</kbd></span><span className="shortcut-desc">Previous slide</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>L</kbd></span><span className="shortcut-desc">Toggle laser pointer cursor</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Escape</kbd></span><span className="shortcut-desc">Exit slideshow</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Brush/Eraser Cursor */}
      {isBrushMode && !isSpaceDown && (
        <div
          ref={brushCursorRef}
          className="brush-custom-cursor"
          style={{
            left: '-100px',
            top: '-100px',
          }}
        >
          <div
            className="brush-custom-cursor-circle"
            style={{
              width: `${brushWidth * scale}px`,
              height: `${brushWidth * scale}px`,
            }}
          />
        </div>
      )}
    </div>
  );
};
