import React, { useRef, useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { useBuilder } from '../BuilderContext';
import { PixiWorkspace } from './PixiWorkspace';
import { CoordinateSystem } from '../workspace/CoordinateSystem';
import { GraphGeometry } from '../workspace/GraphGeometry';
import type { SceneRenderer } from '../workspace/SceneRenderer';
import type { Viewport } from '../workspace/CoordinateSystem';
import { MousePointer2, Type, Play, Image as ImageIcon, Layout, Pencil, Trash2, Copy, Eraser, RotateCcw, RotateCw, X, Smile } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getSlideAnimationSteps } from '../animations';

export const Canvas: React.FC = () => {
  const { 
    elements, selectElement, connectingNode, setConnectingNode,
    selectedIds, selectedConnectionId, selectConnection, removeConnection, 
    scale, setScale, pan, setPan, editingFocalPointId, setEditingFocalPointId, 
    addElement, removeSelected, duplicateSelected, updateElement,
    isBrushMode, brushColor, brushWidth, setBrushWidth, addBrushStroke, clearBrush, setBrushMode, setBrushColor, undo, redo, saveHistory,
    guides, addGuide, updateGuide, removeGuide, copySelected, pasteCopied, selectAll, isPresenting, setIsPresenting,
    currentSlideIndex, setCurrentSlideIndex, revealDownstream, isHelpOpen, setIsHelpOpen,
    brushTool, setBrushTool, eraseBrushStrokesAt,
    playedAnimationIds, setPlayedAnimationIds
  } = useBuilder();

  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<SceneRenderer | null>(null);
  const viewportRef = useRef<Viewport>({ pan, scale });
  const viewportTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { if (!viewportTimer.current) viewportRef.current = { pan, scale }; }, [pan, scale]);
  const commitViewport = useCallback(() => {
    if (viewportTimer.current) clearTimeout(viewportTimer.current);
    viewportTimer.current = null;
    setScale(viewportRef.current.scale); setPan(viewportRef.current.pan);
  }, [setPan, setScale]);
  const applyViewport = useCallback((viewport: Viewport) => {
    viewportRef.current = viewport;
    rendererRef.current?.setViewport(viewport);
    if (!viewportTimer.current) viewportTimer.current = setTimeout(commitViewport, 120);
  }, [commitViewport]);
  const replaceViewport = useCallback((viewport: Viewport) => { applyViewport(viewport); commitViewport(); }, [applyViewport, commitViewport]);
  useEffect(() => () => { if (viewportTimer.current) clearTimeout(viewportTimer.current); }, []);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, originalX: number, originalY: number } | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);
  const [currentStroke, setCurrentStroke] = useState<{ x: number, y: number }[] | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const lastEraserPos = useRef<{ x: number, y: number } | null>(null);
  const brushCursorRef = useRef<HTMLDivElement>(null);
  const isResizingBrushRef = useRef(false);
  const startResizeInfoRef = useRef({ x: 0, width: 0 });
  const shouldAutoFitInitialViewRef = useRef(elements.length > 0);
  const didAutoFitInitialViewRef = useRef(false);
  
  const [snapGuides, setSnapGuides] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [draggedGuide, setDraggedGuide] = useState<{ id: string; type: 'horizontal' | 'vertical'; isNew: boolean } | null>(null);

  const [isLaserActive, setIsLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
  const [laserTrail, setLaserTrail] = useState<{ x: number; y: number }[]>([]);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const presentedSlideIndex = useRef<number | null>(null);

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
    presentedSlideIndex.current = safeIndex;
    
    const targetSlide = slides[safeIndex];
    const targetAnimations: string[] = [];
    const autoPlayIds: string[] = [];
    
    elements.forEach(el => {
      if (el.id === targetSlide.id || el.parentId === targetSlide.id) {
        (el.animations || []).forEach(anim => {
          targetAnimations.push(anim.id);
          if (anim.trigger === 'onEnter') {
            autoPlayIds.push(anim.id);
          }
        });
      }
    });

    const newPlayedIds = playedAnimationIds.filter(id => !targetAnimations.includes(id));
    if (safeIndex < currentSlideIndex) {
      setPlayedAnimationIds([...newPlayedIds, ...targetAnimations]);
    } else {
      setPlayedAnimationIds([...newPlayedIds, ...autoPlayIds]);
    }

    setCurrentSlideIndex(safeIndex);
    
    const slide = slides[safeIndex];
    
    if (!slide.visible) {
      updateElement(slide.id, { visible: true } as any);
      revealDownstream(slide.id);
    }

    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const bounds = new GraphGeometry(elements).layout(slide.id)?.bounds;
    if (bounds) replaceViewport(CoordinateSystem.fit(bounds, rect, 60, 2));
  }, [elements, replaceViewport, updateElement, revealDownstream, setCurrentSlideIndex, currentSlideIndex, playedAnimationIds, setPlayedAnimationIds]);

  const handleNextClick = useCallback(() => {
    const slides = elements.filter(el => el.type === 'node' && (el as any).isSlide !== false).sort((a, b) => a.x - b.x);
    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return;

    const slideSteps = getSlideAnimationSteps(currentSlide.id, elements);
    const nextStep = slideSteps.find(step => 
      !step.animations.every(anim => playedAnimationIds.includes(anim.id))
    );

    if (nextStep) {
      const nextAnimIds = nextStep.animations.map(a => a.id);
      setPlayedAnimationIds(prev => [...prev, ...nextAnimIds]);
    } else {
      if (currentSlideIndex < slides.length - 1) {
        goToSlide(currentSlideIndex + 1);
      }
    }
  }, [elements, currentSlideIndex, playedAnimationIds, setPlayedAnimationIds, goToSlide]);

  const handlePrevClick = useCallback(() => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }, [currentSlideIndex, goToSlide]);

  const wasPresenting = useRef(false);
  useEffect(() => {
    if (isPresenting && (!wasPresenting.current || presentedSlideIndex.current !== currentSlideIndex)) goToSlide(currentSlideIndex);
    if (!isPresenting) setShowSpeakerNotes(false);
    wasPresenting.current = isPresenting;
  }, [isPresenting, currentSlideIndex, goToSlide]);

  
  const startPanInfo = useRef({ startX: 0, startY: 0, initialPanX: 0, initialPanY: 0 });

  const zoomToFit = useCallback(() => {
    if (!canvasRef.current || !elements.length) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const viewport = CoordinateSystem.fit(new GraphGeometry(elements).bounds(), rect);
    replaceViewport(viewport);
  }, [elements, replaceViewport]);

  useEffect(() => {
    if (!shouldAutoFitInitialViewRef.current || didAutoFitInitialViewRef.current || elements.length === 0) return;
    const frame = window.requestAnimationFrame(() => {
      zoomToFit();
      didAutoFitInitialViewRef.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [elements.length, zoomToFit]);

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

      if (isPresenting && !isInput) {
        if (e.code === 'Space' && e.shiftKey) { e.preventDefault(); handlePrevClick(); return; }
        if (e.key === 'ArrowRight' || e.key === ' ' || e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          handleNextClick();
        } else if (e.key === 'ArrowLeft' || ((e.key === ' ' || e.code === 'Space') && e.shiftKey)) {
          e.preventDefault();
          handlePrevClick();
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
          if (el && !el.locked) {
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
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && !isInput) { e.preventDefault(); duplicateSelected(); }
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
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !isInput) { e.preventDefault(); selectAll(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !isInput) { e.preventDefault(); copySelected(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && !isInput) { e.preventDefault(); pasteCopied(); }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z' && !isInput) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z' && !isInput) { e.preventDefault(); redo(); } // some browsers
      if ((e.ctrlKey || e.metaKey) && e.key === 'y' && !isInput) { e.preventDefault(); redo(); }

      // Zoom to Fit
      if ((e.ctrlKey || e.metaKey) && e.key === '0' && !isInput) { e.preventDefault(); zoomToFit(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+') && !isInput) {
        e.preventDefault();
        setBrushWidth(Math.min(100, brushWidth + 5));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '-' && !isInput) {
        e.preventDefault();
        setBrushWidth(Math.max(1, brushWidth - 5));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') { setIsSpaceDown(false); setIsPanning(false); commitViewport(); } };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [selectedIds, selectedConnectionId, removeSelected, removeConnection, editingFocalPointId, setEditingFocalPointId, duplicateSelected, isBrushMode, setBrushMode, clearBrush, undo, redo, selectAll, copySelected, pasteCopied, isPresenting, currentSlideIndex, elements, goToSlide, handleNextClick, handlePrevClick, saveHistory, updateElement, setIsPresenting, isHelpOpen, setIsHelpOpen, brushTool, setBrushTool, zoomToFit, brushWidth, setBrushWidth, commitViewport]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const el = canvasRef.current; if (!el) return;
      const delta = -e.deltaY * 0.001;
      const current = viewportRef.current;
      const newScale = Math.min(Math.max(0.05, current.scale * (1 + delta)), 20);
      const point = rendererRef.current?.clientToScreen({ x: e.clientX, y: e.clientY }); if (!point) return;
      const mouseX = point.x, mouseY = point.y;
      applyViewport(CoordinateSystem.zoomAt(current, { x: mouseX, y: mouseY }, newScale));
    };
    const el = canvasRef.current; if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); }
  }, [applyViewport]);

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    rendererRef.current?.refreshOrigin();
    if (e.altKey && e.button === 2) {
      isResizingBrushRef.current = true;
      startResizeInfoRef.current = { x: e.clientX, width: brushWidth };
      return;
    }
    if (e.button !== 0 && e.button !== 1) return;
    if (contextMenu) setContextMenu(null);
    const rect = canvasRef.current!.getBoundingClientRect();
    const { x, y } = CoordinateSystem.screenToWorld({ x: e.clientX - rect.left, y: e.clientY - rect.top }, viewportRef.current);

    if (!isSpaceDown && !isBrushMode && !isPresenting) {
      const guide = guides.find(g => Math.abs((g.type === 'vertical' ? x : y) - g.position) * viewportRef.current.scale < 5);
      if (guide) { setDraggedGuide({ id: guide.id, type: guide.type, isNew: false }); return; }
    }
    if (isSpaceDown || e.button === 1) {
      setIsPanning(true);
      startPanInfo.current = { startX: e.clientX, startY: e.clientY, initialPanX: viewportRef.current.pan.x, initialPanY: viewportRef.current.pan.y };
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
    if (isPresenting) return;
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
    if (e.altKey) return;
    const menuWidth = 190;
    const isElementClick = selectedIds.length > 0;
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
    const clickX = contextMenu.originalX;
    const clickY = contextMenu.originalY;
    const { x, y } = CoordinateSystem.screenToWorld({ x: clickX - rect.left, y: clickY - rect.top }, viewportRef.current);
    addElement(type, { x: x - 50, y: y - 25 }); setContextMenu(null);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (isResizingBrushRef.current) {
      const deltaX = e.clientX - startResizeInfoRef.current.x;
      const newWidth = Math.max(1, Math.min(100, Math.floor(startResizeInfoRef.current.width + deltaX * 0.2)));
      setBrushWidth(newWidth);
      return;
    }

    if (brushCursorRef.current) {
      brushCursorRef.current.style.left = `${e.clientX}px`;
      brushCursorRef.current.style.top = `${e.clientY}px`;
    }
    if (!draggedGuide && !isErasing && !currentStroke && !isPanning && !selectionBox && !connectingNode) return;
    const screen = rendererRef.current?.clientToScreen({ x: e.clientX, y: e.clientY }); if (!screen) return;
    if (draggedGuide) {
      if (draggedGuide.type === 'horizontal') {
        const canvasY = CoordinateSystem.screenToWorld(screen, viewportRef.current).y;
        updateGuide(draggedGuide.id, canvasY);
      } else {
        const canvasX = CoordinateSystem.screenToWorld(screen, viewportRef.current).x;
        updateGuide(draggedGuide.id, canvasX);
      }
      return;
    }

    const { x, y } = CoordinateSystem.screenToWorld(screen, viewportRef.current);
    if (isErasing) {
      const currentPos = { x, y };
      eraseBrushStrokesAt(currentPos, lastEraserPos.current, brushWidth / 2);
      lastEraserPos.current = currentPos;
      return;
    }
    if (currentStroke) { setCurrentStroke(prev => prev ? [...prev, { x, y }] : null); return; }
    if (isPanning) {
      applyViewport({ scale: viewportRef.current.scale, pan: {
        x: startPanInfo.current.initialPanX + (e.clientX - startPanInfo.current.startX),
        y: startPanInfo.current.initialPanY + (e.clientY - startPanInfo.current.startY)
      } });
      return;
    }
    if (selectionBox) { setSelectionBox(prev => prev ? { ...prev, x2: x, y2: y } : null); return; }
    if (connectingNode) { setMousePos({ x, y }); }
  }, [connectingNode, isPanning, applyViewport, currentStroke, selectionBox, draggedGuide, updateGuide, isErasing, brushWidth, setBrushWidth, eraseBrushStrokesAt]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (isResizingBrushRef.current) {
      isResizingBrushRef.current = false;
      return;
    }
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
    if (isPanning) { setIsPanning(false); commitViewport(); }
    if (connectingNode) setConnectingNode(null);
    if (selectionBox) {
      const xMin = Math.min(selectionBox.x1, selectionBox.x2), xMax = Math.max(selectionBox.x1, selectionBox.x2);
      const yMin = Math.min(selectionBox.y1, selectionBox.y2), yMax = Math.max(selectionBox.y1, selectionBox.y2);
      const geometry = new GraphGeometry(elements);
      elements.filter(el => !el.parentId).forEach(el => { const b = geometry.layout(el.id)!.bounds; if (b.x >= xMin && b.x + b.width <= xMax && b.y >= yMin && b.y + b.height <= yMax) selectElement(el.id, true); });
      setSelectionBox(null);
    }
  }, [currentStroke, isPanning, connectingNode, selectionBox, elements, selectElement, addBrushStroke, brushColor, brushWidth, setConnectingNode, draggedGuide, removeGuide, isErasing, commitViewport]);

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
    const observer = new ResizeObserver(handleResize); observer.observe(canvasRef.current);
    return () => observer.disconnect();
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
      const canvasY = CoordinateSystem.screenToWorld({ x: e.clientX - rect.left, y: e.clientY - rect.top }, viewportRef.current).y;
      addGuide('horizontal', canvasY, id);
      setDraggedGuide({ id, type: 'horizontal', isNew: true });
    } else {
      const canvasX = CoordinateSystem.screenToWorld({ x: e.clientX - rect.left, y: e.clientY - rect.top }, viewportRef.current).x;
      addGuide('vertical', canvasX, id);
      setDraggedGuide({ id, type: 'vertical', isNew: true });
    }
  };

  const presentationSlides = useMemo(() => elements
    .filter(el => el.type === 'node' && (el as any).isSlide !== false)
    .sort((a, b) => a.x - b.x), [elements]);
  const currentPresentationSlide = presentationSlides[currentSlideIndex];
  useEffect(() => {
    if (presentationSlides.length === 0) {
      if (currentSlideIndex !== 0) setCurrentSlideIndex(0);
      return;
    }
    if (currentSlideIndex > presentationSlides.length - 1) {
      setCurrentSlideIndex(presentationSlides.length - 1);
    }
  }, [currentSlideIndex, presentationSlides.length, setCurrentSlideIndex]);

  const hasRemainingAnimationStep = currentPresentationSlide
    ? getSlideAnimationSteps(currentPresentationSlide.id, elements).some(step =>
        !step.animations.every(anim => playedAnimationIds.includes(anim.id))
      )
    : false;
  const isPrevDisabled = currentSlideIndex === 0;
  const isNextDisabled = currentSlideIndex >= presentationSlides.length - 1 && !hasRemainingAnimationStep;

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
        style={{ backgroundImage: 'none' }}
      >
        <PixiWorkspace
          rendererRef={rendererRef}
          panMode={isSpaceDown}
          onSnap={setSnapGuides}
          overlay={{
            selection: selectionBox,
            stroke: currentStroke ? { points: currentStroke, color: brushColor, width: brushWidth } : null,
            connecting: connectingNode ? { ...connectingNode, point: mousePos } : null,
            guides,
            snap: snapGuides,
          }}
        />
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
          <button className="btn" onClick={undo} title="Undo (Ctrl/⌘+Z)"><RotateCcw size={18} /></button>
          <button className="btn" onClick={redo} title="Redo (Ctrl/⌘+Shift+Z)"><RotateCw size={18} /></button>
          <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 5px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', userSelect: 'none' }}>Size:</span>
            <input 
              type="range" 
              min="1" 
              max="100" 
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
          <button onClick={zoomToFit} className="btn-fit" title="Fit in view (Ctrl/⌘+0)">Fit</button>
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
            onClick={handlePrevClick} 
            disabled={isPrevDisabled}
            tabIndex={-1}
            style={{ padding: '6px 12px', opacity: isPrevDisabled ? 0.4 : 1, background: 'var(--btn-bg)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
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
            {presentationSlides.map((slide, idx) => (
                <option key={slide.id} value={idx}>
                  Slide {idx + 1}: {slide.name || `Node ${idx + 1}`}
                </option>
              ))}
          </select>
          
          <button 
            className="btn" 
            onClick={handleNextClick} 
            disabled={isNextDisabled}
            tabIndex={-1}
            style={{ padding: '6px 12px', opacity: isNextDisabled ? 0.4 : 1, background: 'var(--btn-bg)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
          >
            Next &rarr;
          </button>
          
          <div style={{ width: '1px', background: 'var(--border-color)', height: '20px' }} />

          <button
            className="btn"
            onClick={() => setShowSpeakerNotes(prev => !prev)}
            disabled={!currentPresentationSlide?.speakerNotes}
            tabIndex={-1}
            style={{ padding: '6px 12px', opacity: currentPresentationSlide?.speakerNotes ? 1 : 0.45, background: 'var(--btn-bg)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: currentPresentationSlide?.speakerNotes ? 'pointer' : 'default' }}
          >
            Notes
          </button>
          
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

      {isPresenting && showSpeakerNotes && currentPresentationSlide?.speakerNotes && (
        <div className="speaker-notes-panel">
          <div className="speaker-notes-header">
            <span>Speaker Notes</span>
            <button onClick={() => setShowSpeakerNotes(false)} tabIndex={-1}>×</button>
          </div>
          <pre>{currentPresentationSlide.speakerNotes}</pre>
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
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Ctrl/⌘</kbd> + <kbd>C</kbd> / <kbd>V</kbd></span><span className="shortcut-desc">Copy / Paste selected</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Ctrl/⌘</kbd> + <kbd>D</kbd></span><span className="shortcut-desc">Duplicate selected</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Delete</kbd> / <kbd>Backspace</kbd></span><span className="shortcut-desc">Delete selected element / connection</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Ctrl/⌘</kbd> + <kbd>A</kbd></span><span className="shortcut-desc">Select all elements</span></div>
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Ctrl/⌘</kbd> + <kbd>Z</kbd> / <kbd>Y</kbd></span><span className="shortcut-desc">Undo / Redo</span></div>
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
                  <div className="shortcut-row"><span className="shortcut-keys"><kbd>Ctrl/⌘</kbd> + <kbd>0</kbd></span><span className="shortcut-desc">Fit in view</span></div>
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
