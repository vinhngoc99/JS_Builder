import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { CanvasElement, ElementType, Connection, PortPosition, BrushStroke } from './types';
import { v4 as uuidv4 } from 'uuid';

// --- Utilities ---

/** Escape HTML special characters to prevent XSS in exported HTML */
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/** Safely parse JSON from localStorage, returning fallback on error */
const safeParse = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Failed to parse localStorage key "${key}", using fallback.`, e);
    return fallback;
  }
};

/** Create a debounced version of a function */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number): T => {
  let timer: ReturnType<typeof setTimeout>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
};

export const getAdaptedTextColor = (color: string | undefined): string => {
  if (!color || color === '#e0e0e0' || color === 'var(--text-primary)') {
    return 'var(--text-primary)';
  }
  return color;
};

export const getAdaptedBorderColor = (color: string | undefined): string => {
  if (!color || color === '#3a3c50' || color === 'var(--border-color)') {
    return 'var(--border-color)';
  }
  return color;
};

export const getAdaptedBgColor = (type: string, color: string | undefined): string => {
  if (type === 'node' && (!color || color === '#242533' || color === 'var(--bg-node)')) {
    return 'var(--bg-node)';
  }
  return color || 'transparent';
};

interface ConnectingState {
  id: string;
  port: PortPosition;
}

interface HistoryState {
  elements: CanvasElement[];
  connections: Connection[];
  brushStrokes: BrushStroke[];
}

interface BuilderContextType {
  elements: CanvasElement[];
  connections: Connection[];
  selectedIds: string[];
  selectedConnectionId: string | null;
  connectingNode: ConnectingState | null;
  scale: number;
  pan: { x: number; y: number };
  brushStrokes: BrushStroke[];
  isBrushMode: boolean;
  brushColor: string;
  brushWidth: number;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  guides: { id: string; type: 'horizontal' | 'vertical'; position: number }[];
  addGuide: (type: 'horizontal' | 'vertical', position: number, id?: string) => void;
  updateGuide: (id: string, position: number) => void;
  removeGuide: (id: string) => void;
  copySelected: () => void;
  pasteCopied: () => void;
  selectAll: () => void;
  isSnapEnabled: boolean;
  setIsSnapEnabled: (enabled: boolean) => void;
  
  addElement: (type: ElementType, pos?: { x: number, y: number }, additionalProps?: Partial<CanvasElement>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  removeElement: (id: string) => void;
  removeSelected: () => void;
  selectElement: (id: string | null, isMulti?: boolean) => void;
  selectConnection: (id: string | null) => void;
  setConnectingNode: (state: ConnectingState | null) => void;
  addConnection: (fromId: string, fromPort: PortPosition, toId: string, toPort: PortPosition) => void;
  removeConnection: (id: string) => void;
  duplicateSelected: () => void;
  setScale: (scale: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  exportHTML: () => string;
  alignElements: (alignmentType: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeElements: (direction: 'horizontal' | 'vertical') => void;
  isPresenting: boolean;
  setIsPresenting: (presenting: boolean) => void;
  editingFocalPointId: string | null;
  setEditingFocalPointId: (id: string | null) => void;
  setBrushMode: (enabled: boolean) => void;
  setBrushColor: (color: string) => void;
  setBrushWidth: (width: number) => void;
  addBrushStroke: (stroke: BrushStroke) => void;
  clearBrush: () => void;
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  revealDownstream: (startId: string) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<CanvasElement[]>(() => safeParse('js-builder-elements', []));
  const [connections, setConnections] = useState<Connection[]>(() => safeParse('js-builder-connections', []));
  const [brushStrokes, setBrushStrokes] = useState<BrushStroke[]>(() => safeParse('js-builder-brush', []));

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('js-builder-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });
  const [guides, setGuides] = useState<{ id: string; type: 'horizontal' | 'vertical'; position: number }[]>(() => safeParse('js-builder-guides', []));
  const [copiedElements, setCopiedElements] = useState<CanvasElement[]>([]);
  const [isSnapEnabled, setIsSnapEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('js-builder-snap');
    return saved !== 'false';
  });

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem('js-builder-theme', t);
  };

  const addGuide = (type: 'horizontal' | 'vertical', position: number, id?: string) => {
    setGuides(prev => {
      const next = [...prev, { id: id || uuidv4(), type, position }];
      localStorage.setItem('js-builder-guides', JSON.stringify(next));
      return next;
    });
  };

  const updateGuide = (id: string, position: number) => {
    setGuides(prev => {
      const next = prev.map(g => g.id === id ? { ...g, position } : g);
      localStorage.setItem('js-builder-guides', JSON.stringify(next));
      return next;
    });
  };

  const removeGuide = (id: string) => {
    setGuides(prev => {
      const next = prev.filter(g => g.id !== id);
      localStorage.setItem('js-builder-guides', JSON.stringify(next));
      return next;
    });
  };

  const [_history, setHistory] = useState<HistoryState[]>([]);
  const [_redoStack, setRedoStack] = useState<HistoryState[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connectingNode, setConnectingNode] = useState<ConnectingState | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [editingFocalPointId, setEditingFocalPointId] = useState<string | null>(null);
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const [isBrushMode, setIsBrushMode] = useState(false);
  const [brushColor, setBrushColorVal] = useState('#4caf50');
  const [brushWidth, setBrushWidthVal] = useState(4);

  // Refs to avoid stale closures in history callbacks
  const elementsRef = useRef(elements);
  const connectionsRef = useRef(connections);
  const brushStrokesRef = useRef(brushStrokes);
  elementsRef.current = elements;
  connectionsRef.current = connections;
  brushStrokesRef.current = brushStrokes;

  const saveHistory = useCallback(() => {
    const snapshot: HistoryState = {
      elements: structuredClone(elementsRef.current),
      connections: structuredClone(connectionsRef.current),
      brushStrokes: structuredClone(brushStrokesRef.current),
    };
    setHistory(prev => [...prev.slice(-49), snapshot]);
    setRedoStack([]);
  }, []);

  const revealDownstream = useCallback((startId: string) => {
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
          if (!targetEl.enableExpandButton) {
            traverse(targetId);
          }
        }
      });
    };
    
    traverse(startId);
    
    if (toUpdate.size > 0) {
      setElements(prev => prev.map(el => {
        if (toUpdate.has(el.id)) {
          return { ...el, isHidden: false };
        }
        return el;
      }));
    }
  }, []);

  const copySelected = useCallback(() => {
    const selected = elementsRef.current.filter(el => selectedIds.includes(el.id));
    if (selected.length > 0) {
      setCopiedElements(structuredClone(selected));
    }
  }, [selectedIds]);

  const pasteCopied = useCallback(() => {
    if (copiedElements.length === 0) return;
    saveHistory();
    const idMap = new Map<string, string>();
    copiedElements.forEach(el => {
      idMap.set(el.id, uuidv4());
    });
    
    const pasted: CanvasElement[] = copiedElements.map(el => {
      const newId = idMap.get(el.id)!;
      let newParentId = el.parentId;
      if (el.parentId && idMap.has(el.parentId)) {
        newParentId = idMap.get(el.parentId)!;
      } else if (el.parentId) {
        newParentId = null;
      }
      
      const offsetX = newParentId ? 0 : 20;
      const offsetY = newParentId ? 0 : 20;
      
      return {
        ...el,
        id: newId,
        parentId: newParentId,
        x: el.x + offsetX,
        y: el.y + offsetY
      } as CanvasElement;
    });
    
    setElements(prev => [...prev, ...pasted]);
    setSelectedIds(pasted.map(p => p.id));
  }, [copiedElements, saveHistory]);

  const selectAll = useCallback(() => {
    setSelectedIds(elementsRef.current.map(el => el.id));
    setSelectedConnectionId(null);
  }, []);

  const handleSetIsSnapEnabled = (val: boolean) => {
    setIsSnapEnabled(val);
    localStorage.setItem('js-builder-snap', String(val));
  };

  const undo = useCallback(() => {
    setHistory(prevHistory => {
      if (prevHistory.length === 0) return prevHistory;
      const last = prevHistory[prevHistory.length - 1];
      // Push current state to redo
      setRedoStack(prevRedo => [...prevRedo, {
        elements: structuredClone(elementsRef.current),
        connections: structuredClone(connectionsRef.current),
        brushStrokes: structuredClone(brushStrokesRef.current),
      }]);
      // Restore
      setElements(last.elements);
      setConnections(last.connections);
      setBrushStrokes(last.brushStrokes);
      return prevHistory.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack(prevRedo => {
      if (prevRedo.length === 0) return prevRedo;
      const next = prevRedo[prevRedo.length - 1];
      // Push current state to history
      setHistory(prevHistory => [...prevHistory, {
        elements: structuredClone(elementsRef.current),
        connections: structuredClone(connectionsRef.current),
        brushStrokes: structuredClone(brushStrokesRef.current),
      }]);
      // Restore
      setElements(next.elements);
      setConnections(next.connections);
      setBrushStrokes(next.brushStrokes);
      return prevRedo.slice(0, -1);
    });
  }, []);

  // Debounced localStorage persistence (500ms delay to avoid writes during drag)
  const debouncedSaveElements = useRef(debounce((data: CanvasElement[]) => {
    localStorage.setItem('js-builder-elements', JSON.stringify(data));
  }, 500)).current;

  const debouncedSaveConnections = useRef(debounce((data: Connection[]) => {
    localStorage.setItem('js-builder-connections', JSON.stringify(data));
  }, 500)).current;

  const debouncedSaveBrush = useRef(debounce((data: BrushStroke[]) => {
    localStorage.setItem('js-builder-brush', JSON.stringify(data));
  }, 500)).current;

  useEffect(() => { debouncedSaveElements(elements); }, [elements, debouncedSaveElements]);
  useEffect(() => { debouncedSaveConnections(connections); }, [connections, debouncedSaveConnections]);
  useEffect(() => { debouncedSaveBrush(brushStrokes); }, [brushStrokes, debouncedSaveBrush]);

  const addElement = (type: ElementType, pos?: { x: number, y: number }, additionalProps?: Partial<CanvasElement>) => {
    saveHistory();
    const id = uuidv4();
    const x = pos ? pos.x : window.innerWidth / 2 - 100 + (elements.length * 10);
    const y = pos ? pos.y : window.innerHeight / 2 - 100 + (elements.length * 10);
    const baseProps = { id, type, x, y, width: 220, height: 250, title: `Node ${elements.length + 1}`, rotation: 0, parentId: null };
    let newElement: CanvasElement;
    switch (type) {
      case 'node': newElement = { ...baseProps, type: 'node', backgroundColor: 'var(--bg-node)', title: `Node ${elements.length + 1}`, fontFamily: "'Google Sans Text'", ...additionalProps }; break;
      case 'text': newElement = { ...baseProps, width: 150, height: 60, type: 'text', text: 'Workflow Text', fontSize: 16, color: 'var(--text-primary)', fontFamily: "'Google Sans Text'", borderWidth: 1, borderColor: 'var(--border-color)', borderRadius: 4, backgroundColor: 'transparent', ...additionalProps }; break;
      case 'button': newElement = { ...baseProps, width: 120, height: 40, type: 'button', text: 'Action', link: '#', backgroundColor: '#4caf50', color: '#ffffff', borderRadius: 6, actionType: 'alert', actionTarget: 'Button clicked!', fontFamily: "'Google Sans Text'", ...additionalProps }; break;
      case 'image': newElement = { ...baseProps, width: 150, height: 150, type: 'image', src: 'https://images.unsplash.com/photo-1531297172867-4f40136225a4?auto=format&fit=crop&w=300&q=80', alt: 'Placeholder', objectFit: 'cover', borderWidth: 0, borderColor: '#4caf50', borderRadius: 4, ...additionalProps }; break;
      case 'video': newElement = { ...baseProps, width: 280, height: 157, type: 'video', src: '', borderWidth: 0, borderColor: '#4caf50', borderRadius: 8, ...additionalProps }; break;
      case 'shape': newElement = { ...baseProps, width: 100, height: 100, type: 'shape', shapeType: 'rectangle', backgroundColor: 'transparent', borderColor: '#4caf50', borderWidth: 2, borderRadius: 8, color: 'var(--text-primary)', ...additionalProps }; break;
      default: return;
    }
    setElements([...elements, newElement as CanvasElement]); setSelectedIds([id]); setSelectedConnectionId(null);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } as CanvasElement : el));
  };

  const updateConnection = (id: string, updates: Partial<Connection>) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, ...updates } as Connection : c));
  };

  const removeElement = (id: string) => {
    saveHistory();
    const toDelete = new Set([id]);
    elementsRef.current.forEach(el => {
      if (el.parentId === id) toDelete.add(el.id);
    });
    setElements(prev => prev.filter(el => !toDelete.has(el.id)));
    setConnections(prev => prev.filter(c => !toDelete.has(c.fromId) && !toDelete.has(c.toId)));
    setSelectedIds(prev => prev.filter(sid => !toDelete.has(sid)));
  };

  const removeSelected = () => {
    saveHistory();
    const toDelete = new Set(selectedIds);
    elementsRef.current.forEach(el => {
      if (el.parentId && toDelete.has(el.parentId)) toDelete.add(el.id);
    });
    setElements(prev => prev.filter(el => !toDelete.has(el.id)));
    setConnections(prev => prev.filter(c => !toDelete.has(c.fromId) && !toDelete.has(c.toId)));
    setSelectedIds([]);
  };

  const duplicateSelected = () => {
    saveHistory();
    const newElements: CanvasElement[] = [];
    selectedIds.forEach(id => {
      const el = elementsRef.current.find(e => e.id === id);
      if (!el) return;
      const newId = uuidv4();
      newElements.push({ ...el, id: newId, x: el.x + 40, y: el.y + 40 } as CanvasElement);
    });
    if (newElements.length > 0) {
      setElements(prev => [...prev, ...newElements]);
      setSelectedIds(newElements.map(e => e.id));
    }
  };

  const alignElements = useCallback((alignmentType: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
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
  }, [selectedIds, saveHistory]);

  const distributeElements = useCallback((direction: 'horizontal' | 'vertical') => {
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
  }, [selectedIds, saveHistory]);

  const selectElement = (id: string | null, isMulti: boolean = false) => {
    if (!id) { setSelectedIds([]); return; }
    if (isMulti) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
    setSelectedConnectionId(null);
  };

  const selectConnection = (id: string | null) => {
    setSelectedConnectionId(id);
    if (id) setSelectedIds([]);
  };

  const addConnection = (fromId: string, fromPort: PortPosition, toId: string, toPort: PortPosition) => {
    saveHistory();
    if (fromId === toId) return;
    const exists = connectionsRef.current.find(
      c => c.fromId === fromId && c.toId === toId && c.fromPort === fromPort && c.toPort === toPort
    );
    if (!exists) {
      setConnections(prev => [...prev, { id: uuidv4(), fromId, toId, fromPort, toPort }]);
    }
  };

  const removeConnection = (id: string) => {
    saveHistory();
    setConnections(prev => prev.filter(c => c.id !== id));
    if (selectedConnectionId === id) setSelectedConnectionId(null);
  };

  const addBrushStroke = (stroke: BrushStroke) => { saveHistory(); setBrushStrokes(prev => [...prev, stroke]); };
  const clearBrush = () => { saveHistory(); setBrushStrokes([]); };
  const setBrushMode = (enabled: boolean) => setIsBrushMode(enabled);
  const setBrushColor = (color: string) => setBrushColorVal(color);
  const setBrushWidth = (width: number) => setBrushWidthVal(width);

  const exportHTML = () => {
    const adj = new Map<string, Connection[]>();
    connections.forEach(c => {
      if (!adj.has(c.fromId)) adj.set(c.fromId, []);
      adj.get(c.fromId)!.push(c);
    });

    const hiddenNodes = new Set<string>();
    const hiddenConnections = new Set<string>();
    const interactiveTargets = new Set<string>();
    const elementsMap = new Map(elements.map(e => [e.id, e]));

    // 1. Direct targets of Interactive Btns are hidden
    elements.forEach(el => {
      if (el.enableExpandButton) {
        (adj.get(el.id) || []).forEach(c => {
          interactiveTargets.add(c.toId);
          hiddenConnections.add(c.id);
        });
      }
    });

    // 2. BFS to hide downstream nodes unless blocked by another Interactive Btn or Pinned
    const visited = new Set<string>();
    interactiveTargets.forEach(id => visited.add(id));
    const queue = Array.from(interactiveTargets);
    while (queue.length > 0) {
      const curr = queue.shift()!;
      const el = elementsMap.get(curr);
      if (el && el.isPinned) {
        continue; // Skip hiding pinned node
      }
      hiddenNodes.add(curr);
      if (el && !el.enableExpandButton) {
        (adj.get(curr) || []).forEach(c => {
          hiddenConnections.add(c.id);
          if (!visited.has(c.toId)) {
            visited.add(c.toId);
            queue.push(c.toId);
          }
        });
      }
    }

    const SHAPE_POLYGONS = {
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

    const buildElementHTML = (el: CanvasElement, isChild: boolean = false): string => {
      const elAny = el as any;
      const isFillParent = isChild && elAny.fillParent;
      
      const isInteractiveHidden = hiddenNodes.has(el.id);

      let visibilityStyle = 'pointer-events: auto;';
      if (isInteractiveHidden) visibilityStyle = 'opacity: 0; pointer-events: none;';
      else if (el.isDisabled) {
        visibilityStyle = 'filter: grayscale(1) contrast(0.5); opacity: 0.6;';
        if (el.type !== 'button') visibilityStyle += ' pointer-events: none;';
      }

      const innerVisibilityStyle = el.isHidden ? 'opacity: 0; pointer-events: none;' : '';

      const baseStyle = isFillParent 
        ? `position: absolute; left: 0; top: 0; width: 100%; height: 100%; color: var(--text-primary); z-index: ${el.type === 'node' ? 1 : 2}; transition: opacity 0.4s ease; ${visibilityStyle}`
        : `position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; color: var(--text-primary); transform: rotate(${el.rotation}deg); transform-origin: center center; z-index: ${el.type === 'node' ? 1 : 2}; transition: opacity 0.4s ease; ${visibilityStyle}`;
      
      let expandBtnHTML = '';
      if (el.enableExpandButton) {
        const outConnections = connections.filter(c => c.fromId === el.id);
        if (outConnections.length > 0) {
          const groups: Record<string, typeof outConnections> = { top: [], right: [], bottom: [], left: [] };
          outConnections.forEach(c => { const side = c.fromPort || 'bottom'; if (groups[side]) groups[side].push(c); });
          const posMap: Record<string, string> = {
            top: 'top: -32px; left: 50%; transform: translateX(-50%); flex-direction: row;',
            bottom: 'bottom: -32px; left: 50%; transform: translateX(-50%); flex-direction: row;',
            left: 'left: -32px; top: 50%; transform: translateY(-50%); flex-direction: column;',
            right: 'right: -32px; top: 50%; transform: translateY(-50%); flex-direction: column;',
          };
          const arrows: Record<string, string> = { top: '\u25b2', bottom: '\u25bc', left: '\u25c0', right: '\u25b6' };
          for (const [side, conns] of Object.entries(groups)) {
            if (conns.length === 0) continue;
            const btns = conns.map(c => {
              const lbl = c.label ? escapeHtml(c.label) : arrows[side];
              const btnClass = 'conn-btn';
              return '<button class="' + btnClass + '" data-target="' + c.toId + '" onclick="event.stopPropagation(); toggleOneTarget(this, \'' + c.toId + '\', \'' + el.id + '\')">' + lbl + '</button>';
            }).join('');
            expandBtnHTML += '<div class="conn-btn-group" style="position:absolute; ' + posMap[side] + ' display:flex; gap:4px; z-index:100; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;">' + btns + '</div>';
          }
        }
      }
      
      const wrapperOnClick = el.enableExpandButton 
        ? `onclick="toggleNodeArrows(event, '${el.id}')"`
        : '';

      if (el.type === 'node') {
        const children = elements.filter(child => child.parentId === el.id);
        const childrenHTML = children.map(child => buildElementHTML(child, true)).join('\n');
        const safeTitle = escapeHtml(el.title || '');
        const titleColor = `color: ${getAdaptedTextColor(el.color)};`;
        return `<div id="el-wrapper-${el.id}" ${wrapperOnClick} class="${isChild ? '' : 'draggable-element'} is-node ${el.isDisabled ? 'disabled' : ''} ${isInteractiveHidden ? 'is-hidden' : ''}" data-id="${el.id}" style="${baseStyle} overflow: visible; cursor: grab;"><div style="width: 100%; height: 100%; background-color: ${getAdaptedBgColor('node', el.backgroundColor)}; font-family: ${el.fontFamily}; border: 1px solid var(--border-color); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); display: flex; flex-direction: column; overflow: hidden; transition: opacity 0.3s; ${innerVisibilityStyle}"><div style="padding: 12px 16px; background-color: var(--panel-header-bg); font-size: 14px; font-weight: 600; border-bottom: 1px solid var(--border-color); pointer-events: none; ${titleColor}">${safeTitle}</div><div style="position: relative; flex: 1; padding: 16px; pointer-events: none; overflow: hidden;">${childrenHTML}</div></div>${expandBtnHTML}</div>`;
      }
      let innerContent = '';
      switch (el.type) {
        case 'text': {
          const safeText = escapeHtml(el.text);
          innerContent = `<div id="el-${el.id}" style="width: 100%; height: 100%; color: ${getAdaptedTextColor(el.color)}; font-size: ${el.fontSize}px; font-family: ${el.fontFamily}; background-color: ${el.backgroundColor}; border: ${el.borderWidth}px solid ${getAdaptedBorderColor(el.borderColor)}; border-radius: ${el.borderRadius}px; text-align: center; display: flex; align-items: center; justify-content: center; overflow: hidden; pointer-events: none;">${safeText}</div>`;
          break;
        }
        case 'button': {
          const safeButtonText = escapeHtml(el.text);
          let onClickAttr = '';
          const action = el.actionType;
          const target = el.actionTarget;
          
          if (action === 'alert') {
            const safeTarget = escapeHtml(target).replace(/'/g, "\\'");
            onClickAttr = `onclick="showNotification('${safeTarget}')"`;
          } else if (action === 'link') {
            const safeLink = escapeHtml(el.link);
            onClickAttr = `href="${safeLink}" target="_blank" rel="noopener noreferrer"`;
          } else if (action === 'toggleDisabled') {
            const safeTarget = escapeHtml(target).replace(/'/g, "\\'");
            onClickAttr = `onclick="toggleDisabled('${safeTarget}')"`;
          } else if (action === 'toggleVisibility') {
            const safeTarget = escapeHtml(target).replace(/'/g, "\\'");
            onClickAttr = `onclick="toggleVisibility('${safeTarget}')"`;
          } else if (action === 'triggerFlow') {
            const safeTarget = escapeHtml(target).replace(/'/g, "\\'");
            onClickAttr = `onclick="triggerFlow('${safeTarget}')"`;
          } else if (action === 'nextSlide') {
            onClickAttr = `onclick="nextSlide()"`;
          } else if (action === 'prevSlide') {
            onClickAttr = `onclick="prevSlide()"`;
          } else if (action === 'goToSlide') {
            const safeTarget = escapeHtml(target).replace(/'/g, "\\'");
            onClickAttr = `onclick="goToSlideById('${safeTarget}')"`;
          }
          
          const tag = action === 'link' ? 'a' : 'button';
          const buttonDisabledAttr = (action !== 'link' && el.isDisabled) ? 'disabled' : '';
          innerContent = `<${tag} id="el-${el.id}" ${onClickAttr} ${buttonDisabledAttr} class="${el.isDisabled ? 'disabled' : ''}" style="width: 100%; height: 100%; font-family: ${el.fontFamily}; background-color: ${el.backgroundColor}; color: ${getAdaptedTextColor(el.color)}; border: none; border-radius: ${el.borderRadius}px; cursor: pointer; display: flex; align-items: center; justify-content: center; text-decoration: none; font-weight: bold; font-size: ${elAny.fontSize || 16}px;">${safeButtonText}</${tag}>`;
          break;
        }
        case 'image': {
          const safeImgTitle = elAny.title ? escapeHtml(elAny.title) : '';
          const safeAlt = escapeHtml(el.alt);
          const imgHeader = safeImgTitle ? `<div style="padding: 6px 12px; background-color: var(--panel-header-bg); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; font-size: ${elAny.fontSize || 11}px; font-weight: 700; color: var(--text-secondary); width: 100%; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0;">${safeImgTitle}</div>` : '';
          innerContent = `<div style="width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;">${imgHeader}<div style="flex: 1; position: relative;"><img id="el-${el.id}" src="${escapeHtml(el.src)}" alt="${safeAlt}" style="width: 100%; height: 100%; object-fit: ${el.objectFit}; object-position: ${elAny.objectPosition || '50% 50%'}; border: ${el.borderWidth}px solid ${getAdaptedBorderColor(el.borderColor)}; border-radius: ${el.borderRadius}px; box-sizing: border-box; pointer-events: none;" draggable="false" /></div></div>`;
          break;
        }
        case 'video': {
          const safeVidTitle = elAny.title ? escapeHtml(elAny.title) : '';
          const safeSrc = escapeHtml(el.src);
          const vidHeader = safeVidTitle ? `<div style="padding: 6px 12px; background-color: var(--panel-header-bg); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; font-size: ${elAny.fontSize || 11}px; font-weight: 700; color: var(--text-secondary); width: 100%; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0;">${safeVidTitle}</div>` : '';
          innerContent = `<div style="width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;">${vidHeader}<div style="flex: 1;"><iframe id="el-${el.id}" src="${safeSrc}" style="width: 100%; height: 100%; border: ${el.borderWidth}px solid ${getAdaptedBorderColor(el.borderColor)}; border-radius: ${el.borderRadius}px; box-sizing: border-box;" frameborder="0" allowfullscreen sandbox="allow-scripts allow-same-origin"></iframe></div></div>`;
          break;
        }
        case 'shape': {
          const hasText = el.text ? true : false;
          const shapeTextHTML = hasText ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: ${getAdaptedTextColor(el.color)}; font-size: ${el.fontSize || 14}px; font-family: ${el.fontFamily || 'sans-serif'}; text-align: center; padding: 8px; box-sizing: border-box; pointer-events: none; overflow: hidden; white-space: pre-wrap; word-break: break-word;">${escapeHtml(el.text)}</div>` : '';
          
          if (el.shapeType === 'rectangle') {
            innerContent = `<div id="el-${el.id}" style="position: relative; width: 100%; height: 100%; background-color: ${el.backgroundColor}; border: ${el.borderWidth}px solid ${getAdaptedBorderColor(el.borderColor)}; border-radius: ${el.borderRadius}px; pointer-events: none;">${shapeTextHTML}</div>`;
          } else if (el.shapeType === 'ellipse') {
            innerContent = `<div id="el-${el.id}" style="position: relative; width: 100%; height: 100%; background-color: ${el.backgroundColor}; border: ${el.borderWidth}px solid ${getAdaptedBorderColor(el.borderColor)}; border-radius: 50%; pointer-events: none;">${shapeTextHTML}</div>`;
          } else if (el.shapeType === 'line') {
            innerContent = `<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${el.id}" width="100%" height="100%" style="overflow: visible; pointer-events: none;"><line x1="0" y1="0" x2="${el.width}" y2="${el.height}" stroke="${getAdaptedBorderColor(el.borderColor)}" stroke-width="${el.borderWidth}" /></svg>${shapeTextHTML}</div>`;
          } else if (el.shapeType === 'arrow') {
            const markerId = `arrowhead-${el.id}`;
            innerContent = `<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${el.id}" width="100%" height="100%" style="overflow: visible; pointer-events: none;"><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="${getAdaptedBorderColor(el.borderColor)}" /></marker></defs><line x1="0" y1="0" x2="${el.width}" y2="${el.height}" stroke="${getAdaptedBorderColor(el.borderColor)}" stroke-width="${el.borderWidth}" marker-end="url(#${markerId})" /></svg>${shapeTextHTML}</div>`;
          } else if (el.shapeType === 'elbow') {
            const halfW = el.width / 2;
            const d = `M 0 0 L ${halfW} 0 L ${halfW} ${el.height} L ${el.width} ${el.height}`;
            innerContent = `<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${el.id}" width="100%" height="100%" style="overflow: visible; pointer-events: none;"><path d="${d}" fill="none" stroke="${getAdaptedBorderColor(el.borderColor)}" stroke-width="${el.borderWidth}" /></svg>${shapeTextHTML}</div>`;
          } else {
            const pts = (SHAPE_POLYGONS as any)[el.shapeType] || SHAPE_POLYGONS.triangle;
            innerContent = `<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${el.id}" width="100%" height="100%" preserveAspectRatio="none" style="overflow: visible; pointer-events: none;"><polygon points="${pts}" fill="${el.backgroundColor}" stroke="${getAdaptedBorderColor(el.borderColor)}" stroke-width="${el.borderWidth}" vector-effect="non-scaling-stroke" /></svg>${shapeTextHTML}</div>`;
          }
          break;
        }
      }
      innerContent = `<div style="width: 100%; height: 100%; transition: opacity 0.3s; ${innerVisibilityStyle}">${innerContent}</div>`;
      return `<div id="el-wrapper-${el.id}" ${wrapperOnClick} class="${isChild ? '' : 'draggable-element'} ${el.type === 'button' ? 'is-button' : ''} ${el.isDisabled ? 'disabled' : ''} ${isInteractiveHidden ? 'is-hidden' : ''}" data-id="${el.id}" style="${baseStyle} cursor: grab; overflow: visible;">${innerContent}${expandBtnHTML}</div>`;
    };

    const svgPaths = connections.map(conn => {
      const fromEl = elements.find(el => el.id === conn.fromId);
      const toEl = elements.find(el => el.id === conn.toId);
      const isHidden = hiddenConnections.has(conn.id) || (fromEl && fromEl.isHidden) || (toEl && toEl.isHidden);
      const safeLabel = conn.label ? escapeHtml(conn.label) : '';
      const labelHTML = safeLabel ? (
        conn.labelAlignment === 'follow'
          ? `<text fill="#e0e0e0" font-size="14" dy="-5" pointer-events="none" font-weight="bold"><textPath href="#conn-${conn.id}" startOffset="50%" text-anchor="middle">${safeLabel}</textPath></text>`
          : `<text id="conn-label-${conn.id}" fill="#e0e0e0" font-size="14" text-anchor="middle" dominant-baseline="middle" pointer-events="none" font-weight="bold" paint-order="stroke fill" stroke="#17181f" stroke-width="4px">${safeLabel}</text>`
      ) : '';
      const markerStartAttr = conn.startArrow === 'arrow' ? 'marker-start="url(#arrow)"' : '';
      const markerEndAttr = conn.endArrow === 'arrow' ? 'marker-end="url(#arrow)"' : '';
      return `<g id="conn-group-${conn.id}" class="connection-group" data-id="${conn.id}" data-from="${conn.fromId}" data-to="${conn.toId}" data-label="${escapeHtml(conn.label || '')}" data-align="${conn.labelAlignment || 'horizontal'}" style="cursor: pointer; transition: opacity 0.4s ease; ${isHidden ? 'opacity: 0;' : ''}"><path id="conn-${conn.id}" fill="none" stroke="#6c6d80" stroke-width="2" ${markerStartAttr} ${markerEndAttr} /><path id="conn-hit-${conn.id}" stroke="transparent" stroke-width="20" fill="none" />${labelHTML}</g>`;
    }).join('\n');

    const brushPaths = brushStrokes.map(s => `<path d="${s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}" fill="none" stroke="${s.color}" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round" pointer-events="none" />`).join('\n');
    const rootElements = elements.filter(el => !el.parentId).map(el => buildElementHTML(el)).join('\n');

    return `
      <style>
        :root {
          --bg-canvas: #17181f;
          --bg-panel: rgba(22, 23, 33, 0.6);
          --bg-toolbar: #242533;
          --bg-node: #242533;
          --text-primary: #ffffff;
          --text-secondary: #8c8d9c;
          --border-color: #3a3c50;
          --input-bg: rgba(10, 11, 16, 0.6);
          --input-focus-bg: rgba(15, 16, 23, 0.8);
          --grid-dot: #3a3c50;
          --btn-bg: #3a3c50;
          --btn-hover-bg: #4a4c62;
          --panel-header-bg: #1a1b26;
        }
        body.light-theme {
          --bg-canvas: #f8f9fa;
          --bg-panel: rgba(255, 255, 255, 0.85);
          --bg-toolbar: #ffffff;
          --bg-node: #ffffff;
          --text-primary: #1f2937;
          --text-secondary: #4b5563;
          --border-color: #e5e7eb;
          --input-bg: #f9fafb;
          --input-focus-bg: #ffffff;
          --grid-dot: #cccccc;
          --btn-bg: #e5e7eb;
          --btn-hover-bg: #d1d5db;
          --panel-header-bg: #f3f4f6;
        }
        body { margin: 0; padding: 0; overflow: hidden; background: var(--bg-canvas); font-family: 'Google Sans Text', sans-serif; color: var(--text-primary); transition: background 0.3s, color 0.3s; }
        body.presentation-mode #interactive-content { transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); }
        .draggable-element { transition: transform 0.05s linear; }
        .notification-toast { position: fixed; top: 24px; right: 24px; background: var(--bg-toolbar); color: var(--text-primary); padding: 14px 20px; border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,0.6); z-index: 10000; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform: translateX(120%); opacity: 0; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; }
        .notification-toast.show { transform: translateX(0); opacity: 1; }
        .zoom-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: var(--bg-toolbar); padding: 5px; padding-left: 20px; border-radius: 40px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 15px; color: var(--text-primary); z-index: 1000; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .btn-fit { background: #3f51b5; border: none; color: white; padding: 10px 24px; border-radius: 30px; cursor: pointer; font-size: 13px; font-weight: 700; transition: all 0.2s; white-space: nowrap; box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3); }
        .btn-fit:hover { background: #4c5fd7; transform: scale(1.05); }
        .brush-toolbar { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; background: var(--bg-toolbar); padding: 10px; borderRadius: 12px; border: 1px solid var(--border-color); z-index: 1000; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
        .btn-tool { background: var(--btn-bg); border: none; color: var(--text-primary); width: 38px; height: 38px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-tool:hover { background: var(--btn-hover-bg); }
        .btn-tool svg { width: 18px; height: 18px; }
        .btn-tool.primary { background: #4caf50; box-shadow: 0 0 12px rgba(76, 175, 80, 0.4); color: white; }
        .color-picker-btn { width: 38px; height: 38px; border: none; border-radius: 8px; padding: 0; cursor: pointer; overflow: hidden; background: none; }
        .notification-icon { background: #4caf50; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .theme-toggle-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--bg-toolbar);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          z-index: 10000;
          transition: all 0.2s;
        }
        .theme-toggle-btn:hover {
          transform: scale(1.08);
          background: var(--btn-hover-bg);
        }
        .conn-btn-group { opacity: 1; pointer-events: auto; }
        .show-btns .conn-btn-group { opacity: 1 !important; pointer-events: auto !important; }
        .conn-btn { background: #3f51b5; color: #fff; border: 2px solid #1e1f2e; padding: 3px 8px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.5); transition: all 0.2s; white-space: nowrap; line-height: 1.2; }
        .conn-btn:hover { background: #5c6bc0; transform: scale(1.1); }
        .conn-btn.active { background: #f44336; }
        .flow-reveal { animation: flowIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .flow-hide { animation: flowOut 0.25s cubic-bezier(0.4, 0, 0.6, 1) forwards; }
        @keyframes flowIn { from { opacity: 0; transform: scale(0.85) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes flowOut { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.85) translateY(12px); } }
        .connection-group { transition: opacity 0.3s ease; }
        .is-hidden { opacity: 0 !important; pointer-events: none !important; }
        .wire-draw path:first-child { stroke-dasharray: var(--wire-len); stroke-dashoffset: var(--wire-len); animation: wireDraw 0.3s ease-out forwards; }
        .wire-undraw path:first-child { stroke-dasharray: var(--wire-len); stroke-dashoffset: 0; animation: wireUndraw 0.2s ease-in forwards; }
        @keyframes wireDraw { to { stroke-dashoffset: 0; } }
        @keyframes wireUndraw { to { stroke-dashoffset: var(--wire-len); } }
        #interactive-container.space-down { cursor: grab; }
        #interactive-container.panning { cursor: grabbing; }
        #interactive-container.brush-mode { cursor: crosshair !important; }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Display:wght@400;500;700&family=Google+Sans+Flex:wght@100..1000&family=Google+Sans+Text:wght@400;500;700&display=swap" rel="stylesheet">
      <button class="theme-toggle-btn" id="present-btn" onclick="startPresentation()" title="Present Slideshow" style="right: 74px; display: flex; align-items: center; justify-content: center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <button class="theme-toggle-btn" id="theme-toggle-btn" onclick="toggleTheme()" title="Toggle Theme">
        <svg class="sun-icon" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      </button>
      <div id="interactive-container" oncontextmenu="return false;" style="position: relative; width: 100vw; height: 100vh; overflow: hidden; user-select: none; background-color: var(--bg-canvas); background-image: radial-gradient(circle, var(--grid-dot) 1px, transparent 1px);">
        <div id="interactive-content" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform-origin: 0 0;">
          <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: visible;">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6c6d80" />
              </marker>
            </defs>
            <g id="connections-layer">${svgPaths}</g>
          </svg>
          <div id="elements-layer">${rootElements}</div>
          <svg id="canvas-svg-top" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000; overflow: visible;"><g id="brush-layer">${brushPaths}</g></svg>
        </div>
      </div>
      <div class="brush-toolbar">
        <button id="brush-toggle" class="btn-tool" title="Brush (B)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg></button>
        <button id="brush-clear" class="btn-tool" title="Clear (X)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.9-9.9c1-1 2.5-1 3.4 0l4.3 4.3c1 1 1 2.5 0 3.4L10.5 21c-1 1-2.5 1-3.4 0Z"/><path d="m11 6 4 4"/></svg></button>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <button id="undo-btn" class="btn-tool" title="Undo (Ctrl+Z)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
        <button id="redo-btn" class="btn-tool" title="Redo (Ctrl+Y)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></button>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div style="display:flex; align-items:center; gap:6px; padding:0 4px;">
          <span style="font-size:11px; color:var(--text-secondary); user-select:none;">Size:</span>
          <input type="range" id="brush-width-slider" min="1" max="20" value="4" style="width:60px; cursor:pointer;" title="Brush Width">
          <span id="brush-width-val" style="font-size:11px; color:var(--text-secondary); min-width:14px; text-align:right;">4</span>
        </div>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div class="color-picker-btn"><input type="color" id="brush-color" value="#4caf50" style="width:150%;height:150%;margin:-25%;border:none;cursor:pointer;background:none;"></div>
      </div>
      <div id="presentation-bar" style="display: none; position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 24px; padding: 8px 24px; align-items: center; gap: 20px; z-index: 10000; box-shadow: 0 12px 32px rgba(0,0,0,0.6); color: var(--text-primary);">
        <button class="conn-btn" id="prev-slide-btn" onclick="prevSlide()" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">&larr; Prev</button>
        <span id="slide-num-text" style="font-weight: 600; font-size: 14px; min-width: 80px; text-align: center;">Slide 1 of X</span>
        <button class="conn-btn" id="next-slide-btn" onclick="nextSlide()" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">Next &rarr;</button>
        <div style="width: 1px; background: var(--border-color); height: 20px;"></div>
        <button class="conn-btn" onclick="exitPresentation()" style="background: #ef5350; border-radius: 12px; padding: 6px 16px; border: none; font-size: 13px; cursor: pointer; color: #fff; font-weight: 600;">Exit</button>
      </div>
      <div class="zoom-controls"><span id="zoom-percent" style="font-weight:700; min-width: 50px; text-align: center; font-size: 16px;">100%</span><button class="btn-fit" id="zoom-fit">Fit in view</button></div>
      <div id="notification-toast" class="notification-toast"><div class="notification-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span id="notification-text"></span></div>
      <script>
        (function() {
          window.toggleTheme = () => {
            const isLight = document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeIcons(isLight);
          };
          function updateThemeIcons(isLight) {
            document.querySelector('.sun-icon').style.display = isLight ? 'block' : 'none';
            document.querySelector('.moon-icon').style.display = isLight ? 'none' : 'block';
          }
          const savedTheme = localStorage.getItem('theme') || '${theme}';
          if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            updateThemeIcons(true);
          } else {
            updateThemeIcons(false);
          }

          const container = document.getElementById('interactive-container');
          const content = document.getElementById('interactive-content');
          const brushLayer = document.getElementById('brush-layer');
          let elements = ${JSON.stringify(elements)};
          const connections = ${JSON.stringify(connections)};
          let scale = 1, pan = { x: 0, y: 0 }, isBrushMode = false, isSpaceDown = false, isPanning = false, currentStroke = null, activeDrag = null, startDrag = { x: 0, y: 0, ex: 0, ey: 0 }, startPan = { x: 0, y: 0, px: 0, py: 0 };
          
          let history = [], redoStack = [];
          function saveHistory() { history.push(JSON.stringify({elements: JSON.parse(JSON.stringify(elements)), brush: brushLayer.innerHTML})); redoStack = []; if(history.length > 50) history.shift(); }
          function undo() { if(!history.length) return; redoStack.push(JSON.stringify({elements: JSON.parse(JSON.stringify(elements)), brush: brushLayer.innerHTML})); const last = JSON.parse(history.pop()); elements = last.elements; brushLayer.innerHTML = last.brush; updateAllElements(); updateConnections(); showNotification('Undo'); }
          function redo() { if(!redoStack.length) return; history.push(JSON.stringify({elements: JSON.parse(JSON.stringify(elements)), brush: brushLayer.innerHTML})); const next = JSON.parse(redoStack.pop()); elements = next.elements; brushLayer.innerHTML = next.brush; updateAllElements(); updateConnections(); showNotification('Redo'); }

          function updateAllElements() {
            elements.forEach(el => {
              const wrapper = document.getElementById('el-wrapper-' + el.id);
              if(wrapper) { wrapper.style.left = el.x + 'px'; wrapper.style.top = el.y + 'px'; }
            });
          }

          window.showNotification = function(msg) {
            const toast = document.getElementById('notification-toast');
            document.getElementById('notification-text').innerText = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
          };

          const toggleBrush = () => {
            isBrushMode = !isBrushMode;
            document.getElementById('brush-toggle').classList.toggle('primary', isBrushMode);
            container.classList.toggle('brush-mode', isBrushMode);
            showNotification(isBrushMode ? 'Brush mode enabled' : 'Brush mode disabled');
          };

          const clearBrush = () => { saveHistory(); brushLayer.innerHTML = ''; showNotification('Drawings cleared'); };
          document.getElementById('brush-toggle').onclick = toggleBrush;
          document.getElementById('brush-clear').onclick = clearBrush;
          document.getElementById('undo-btn').onclick = undo;
          document.getElementById('redo-btn').onclick = redo;
          
          const widthSlider = document.getElementById('brush-width-slider');
          const widthVal = document.getElementById('brush-width-val');
          if (widthSlider && widthVal) {
            widthSlider.oninput = () => {
              widthVal.innerText = widthSlider.value;
            };
          }

          let slides = [];
          let currentSlideIndex = 0;
          let isPresenting = false;

          window.startPresentation = () => {
            slides = elements.filter(el => el.type === 'node').sort((a, b) => a.x - b.x);
            if (slides.length === 0) {
              showNotification('No Node Containers found to present.');
              return;
            }
            isPresenting = true;
            document.getElementById('presentation-bar').style.display = 'flex';
            document.getElementById('present-btn').style.display = 'none';
            document.getElementById('theme-toggle-btn').style.display = 'none';
            document.querySelector('.brush-toolbar').style.display = 'none';
            document.querySelector('.zoom-controls').style.display = 'none';
            
            document.body.classList.add('presentation-mode');
            
            goToSlide(0);
          };

          window.exitPresentation = () => {
            isPresenting = false;
            document.getElementById('presentation-bar').style.display = 'none';
            document.getElementById('present-btn').style.display = 'flex';
            document.getElementById('theme-toggle-btn').style.display = 'flex';
            document.querySelector('.brush-toolbar').style.display = 'flex';
            document.querySelector('.zoom-controls').style.display = 'flex';
            
            document.body.classList.remove('presentation-mode');
            
            document.getElementById('zoom-fit').click();
          };

          window.goToSlide = (index) => {
            if (slides.length === 0) return;
            currentSlideIndex = Math.max(0, Math.min(index, slides.length - 1));
            
            const slide = slides[currentSlideIndex];
            const padding = 60;
            const availW = window.innerWidth - padding * 2;
            const availH = window.innerHeight - padding * 2;
            
            const scaleX = availW / slide.width;
            const scaleY = availH / slide.height;
            const targetScale = Math.min(scaleX, scaleY, 2.0);
            
            const targetPanX = window.innerWidth / 2 - (slide.x + slide.width / 2) * targetScale;
            const targetPanY = window.innerHeight / 2 - (slide.y + slide.height / 2) * targetScale;
            
            scale = targetScale;
            pan = { x: targetPanX, y: targetPanY };
            updateTransform();
            
            document.getElementById('prev-slide-btn').disabled = (currentSlideIndex === 0);
            document.getElementById('prev-slide-btn').style.opacity = (currentSlideIndex === 0) ? '0.4' : '1';
            
            document.getElementById('next-slide-btn').disabled = (currentSlideIndex === slides.length - 1);
            document.getElementById('next-slide-btn').style.opacity = (currentSlideIndex === slides.length - 1) ? '0.4' : '1';
            
            document.getElementById('slide-num-text').innerText = 'Slide ' + (currentSlideIndex + 1) + ' of ' + slides.length;
          };

          window.nextSlide = () => {
            if (slides.length === 0) {
              slides = elements.filter(el => el.type === 'node').sort((a, b) => a.x - b.x);
            }
            if (slides.length === 0) return;
            if (!isPresenting) {
              startPresentation();
              return;
            }
            if (currentSlideIndex < slides.length - 1) goToSlide(currentSlideIndex + 1);
          };

          window.prevSlide = () => {
            if (slides.length === 0) {
              slides = elements.filter(el => el.type === 'node').sort((a, b) => a.x - b.x);
            }
            if (slides.length === 0) return;
            if (!isPresenting) {
              startPresentation();
              return;
            }
            if (currentSlideIndex > 0) goToSlide(currentSlideIndex - 1);
          };

          window.onkeydown = e => {
            if (isPresenting) {
              if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                nextSlide();
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                exitPresentation();
              }
              return;
            }
            if (e.code === 'Space') { e.preventDefault(); isSpaceDown = true; container.classList.add('space-down'); }
            if (e.key.toLowerCase() === 'b') toggleBrush();
            if (e.key.toLowerCase() === 'x') clearBrush();
            if (e.ctrlKey && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); }
            if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
          };
          window.onkeyup = e => { if (e.code === 'Space') { isSpaceDown = false; isPanning = false; container.classList.remove('space-down', 'panning'); }};

          function animateWire(connGroup, show) {
            const path = connGroup.querySelector('path');
            if (!path) return;
            const len = path.getTotalLength ? path.getTotalLength() : 500;
            connGroup.style.setProperty('--wire-len', len + '');
            connGroup.classList.remove('wire-draw', 'wire-undraw');
            void connGroup.offsetWidth; // force reflow
            if (show) {
              connGroup.style.opacity = '1';
              connGroup.classList.add('wire-draw');
              connGroup.addEventListener('animationend', function h() {
                connGroup.removeEventListener('animationend', h);
                connGroup.classList.remove('wire-draw');
              }, {once: true});
            } else {
              connGroup.style.opacity = '0';
              connGroup.classList.add('wire-undraw');
              connGroup.addEventListener('animationend', function h() {
                connGroup.removeEventListener('animationend', h);
                // Do not remove wire-undraw to prevent the path from snapping back to fully drawn during transition
              }, {once: true});
            }
          }





          window.toggleNodeArrows = function(event, id) {
            if (event) event.stopPropagation();
            const el = document.getElementById('el-wrapper-' + id);
            if (!el) return;
            el.classList.toggle('show-btns');
          };

          function revealCascade(id) {
            const el = document.getElementById('el-wrapper-' + id);
            if (!el) return;

            el.classList.remove('is-hidden', 'flow-hide');
            el.style.pointerEvents = 'auto';
            el.classList.add('flow-reveal');

            const elData = elements.find(e => e.id === id);
            if (elData && elData.enableExpandButton) {
              return;
            }

            document.querySelectorAll('.connection-group').forEach(cg => {
              if (cg.dataset.from === id) {
                animateWire(cg, true);
                revealCascade(cg.dataset.to);
              }
            });
          }

          window.toggleOneTarget = function(btn, targetId, fromId) {
            const isShowing = btn.classList.toggle('active');
            let connGroup = null;
            document.querySelectorAll('.connection-group').forEach(cg => {
              if (cg.dataset.from === fromId && cg.dataset.to === targetId) {
                connGroup = cg;
              }
            });

            if (isShowing) {
              if (connGroup) animateWire(connGroup, true);
              revealCascade(targetId);
            } else {
              if (connGroup) animateWire(connGroup, false);
              hideCascade(targetId);
            }
          };

          function hideCascade(id) {
            const el = document.getElementById('el-wrapper-' + id);
            if (!el) return;
            const elData = elements.find(e => e.id === id);
            if (elData && elData.isPinned) return;

            el.classList.remove('flow-reveal');
            el.classList.add('flow-hide');
            el.style.pointerEvents = 'none';
            
            el.addEventListener('animationend', function h() {
              el.removeEventListener('animationend', h);
              el.classList.add('is-hidden');
              el.classList.remove('flow-hide');
              el.classList.remove('show-btns');
              el.querySelectorAll('.conn-btn-group').forEach(bg => {
                bg.style.opacity = '0';
                bg.style.pointerEvents = 'none';
              });
              el.querySelectorAll('.conn-btn.active').forEach(cb => cb.classList.remove('active'));
            }, {once: true});

            document.querySelectorAll('.connection-group').forEach(cg => {
              if (cg.dataset.from === id) {
                if (cg.style.opacity !== '0') animateWire(cg, false);
                hideCascade(cg.dataset.to);
              }
            });
          }

          window.toggleDisabled = function(id) {
            const el = document.getElementById('el-wrapper-' + id); if (!el) return;
            const disabled = el.classList.toggle('disabled');
            el.style.filter = disabled ? 'grayscale(1) contrast(0.5)' : 'none';
            el.style.opacity = disabled ? '0.6' : '1';
            if (!el.classList.contains('is-button')) {
              el.style.pointerEvents = disabled ? 'none' : 'auto';
            } else {
              const innerBtn = el.querySelector('button');
              if (innerBtn) innerBtn.disabled = disabled;
            }
          };

          window.toggleVisibility = function(id) {
            const el = document.getElementById('el-wrapper-' + id); if (!el) return;
            el.classList.toggle('is-hidden');
          };

          window.triggerFlow = function(id) {
            revealCascade(id);
          };

          window.goToSlideById = function(id) {
            if (slides.length === 0) {
              slides = elements.filter(el => el.type === 'node').sort((a, b) => a.x - b.x);
            }
            const index = slides.findIndex(s => s.id === id);
            if (index !== -1) {
              if (!isPresenting) {
                startPresentation();
              }
              goToSlide(index);
            }
          };

          function updateTransform() {
            content.style.transform = 'translate(' + pan.x + 'px, ' + pan.y + 'px) scale(' + scale + ')';
            document.getElementById('zoom-percent').innerText = Math.round(scale * 100) + '%';
            let gridS = 24 * scale;
            while(gridS < 15) gridS *= 2;
            while(gridS > 60) gridS /= 2;
            container.style.backgroundSize = gridS + 'px ' + gridS + 'px';
            container.style.backgroundPosition = pan.x + 'px ' + pan.y + 'px';
          }

          container.onwheel = e => {
            e.preventDefault(); const delta = -e.deltaY * 0.001; const ns = Math.min(Math.max(0.1, scale * (1 + delta)), 5);
            const r = container.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top;
            const cx = (mx - pan.x) / scale, cy = (my - pan.y) / scale;
            pan.x = mx - cx * ns; pan.y = my - cy * ns; scale = ns; updateTransform();
          };

          container.addEventListener('pointerdown', e => {
            if (isSpaceDown) { isPanning = true; container.classList.add('panning'); startPan = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; return; }
            if (isBrushMode) {
              const r = container.getBoundingClientRect();
              const x = (e.clientX - r.left - pan.x) / scale, y = (e.clientY - r.top - pan.y) / scale;
              currentStroke = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              currentStroke.setAttribute('fill', 'none');
              currentStroke.setAttribute('stroke', document.getElementById('brush-color').value);
              const brushWidthVal = document.getElementById('brush-width-slider') ? document.getElementById('brush-width-slider').value : '4';
              currentStroke.setAttribute('stroke-width', brushWidthVal);
              currentStroke.setAttribute('stroke-linecap', 'round');
              currentStroke.setAttribute('stroke-linejoin', 'round');
              currentStroke.dataset.pts = x + ',' + y;
              brushLayer.appendChild(currentStroke);
              return;
            }
            if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea') || e.target.closest('.conn-btn-group') || e.target.closest('.conn-btn')) {
              return;
            }
            const el = e.target.closest('.draggable-element');
            if (el) {
              saveHistory();
              activeDrag = el;
              startDrag = { x: e.clientX, y: e.clientY, ex: parseFloat(el.style.left), ey: parseFloat(el.style.top) };
              el.style.zIndex = 2000;
              e.stopPropagation();
            }
          }, true);

          window.addEventListener('pointermove', e => {
            if (isPanning) { pan.x = startPan.px + (e.clientX - startPan.x); pan.y = startPan.py + (e.clientY - startPan.y); updateTransform(); return; }
            if (currentStroke) {
              const r = container.getBoundingClientRect();
              const x = (e.clientX - r.left - pan.x) / scale, y = (e.clientY - r.top - pan.y) / scale;
              currentStroke.dataset.pts += ' ' + x + ',' + y;
              currentStroke.setAttribute('d', 'M ' + currentStroke.dataset.pts.split(' ').map(p => p.replace(',', ' ')).join(' L '));
            }
            if (activeDrag) {
              const dx = (e.clientX - startDrag.x) / scale, dy = (e.clientY - startDrag.y) / scale;
              const newX = startDrag.ex + dx, newY = startDrag.ey + dy;
              activeDrag.style.left = newX + 'px'; activeDrag.style.top = newY + 'px';
              const id = activeDrag.id.replace('el-wrapper-', '');
              const elData = elements.find(el => el.id === id); if(elData) { elData.x = newX; elData.y = newY; }
              requestAnimationFrame(updateConnections);
            }
          });

          window.addEventListener('pointerup', () => { if(currentStroke) saveHistory(); currentStroke = null; isPanning = false; container.classList.remove('panning'); if(activeDrag) { activeDrag.style.zIndex = activeDrag.classList.contains('is-node') ? 1 : 2; activeDrag = null; } });

          document.getElementById('zoom-fit').onclick = () => {
            const rootEls = elements.filter(el => !el.parentId);
            if (!rootEls.length) { scale = 1; pan = {x:0,y:0}; updateTransform(); return; }
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            rootEls.forEach(el => { minX = Math.min(minX, el.x); minY = Math.min(minY, el.y); maxX = Math.max(maxX, el.x + el.width); maxY = Math.max(maxY, el.y + el.height); });
            const p = 50, cw = maxX - minX, ch = maxY - minY, aw = window.innerWidth - p*2, ah = window.innerHeight - p*2;
            scale = Math.min(Math.min(aw/cw, ah/ch), 1.5);
            pan.x = window.innerWidth/2 - ((minX+maxX)/2)*scale; pan.y = window.innerHeight/2 - ((minY+maxY)/2)*scale;
            updateTransform(); updateConnections();
          };

          function getAbsoluteBounds(id) {
            const el = document.getElementById('el-wrapper-' + id); if (!el) return null;
            let x = parseFloat(el.style.left), y = parseFloat(el.style.top);
            const parent = el.parentElement.closest('.is-node');
            if (parent) { x += parseFloat(parent.style.left); y += parseFloat(parent.style.top) + 45; }
            return { x, y, width: parseFloat(el.style.width), height: parseFloat(el.style.height) };
          }

          function updateConnections() {
            connections.forEach(conn => {
              const path = document.getElementById('conn-' + conn.id); if (!path) return;
              const f = getAbsoluteBounds(conn.fromId), t = getAbsoluteBounds(conn.toId); if (!f || !t) return;
              const coords = (b, p) => { let x = b.x + b.width/2, y = b.y + b.height/2; if (p === 'top') y = b.y; else if (p === 'bottom') y = b.y + b.height; else if (p === 'left') x = b.x; else x = b.x + b.width; return {x, y}; };
              const s = coords(f, conn.fromPort), e = coords(t, conn.toPort);
              const cd = 50; let cx1 = s.x, cy1 = s.y, cx2 = e.x, cy2 = e.y;
              if (conn.fromPort === 'top') cy1 -= cd; else if (conn.fromPort === 'bottom') cy1 += cd; else if (conn.fromPort === 'left') cx1 -= cd; else cx1 += cd;
              if (conn.toPort === 'top') cy2 -= cd; else if (conn.toPort === 'bottom') cy2 += cd; else if (conn.toPort === 'left') cx2 -= cd; else cx2 += cd;
              path.setAttribute('d', 'M ' + s.x + ' ' + s.y + ' C ' + cx1 + ' ' + cy1 + ', ' + cx2 + ' ' + cy2 + ', ' + e.x + ' ' + e.y);
              const labelEl = document.getElementById('conn-label-' + conn.id);
              if (labelEl) {
                const midX = 0.125 * s.x + 0.375 * cx1 + 0.375 * cx2 + 0.125 * e.x;
                const midY = 0.125 * s.y + 0.375 * cy1 + 0.375 * cy2 + 0.125 * e.y;
                if(labelEl.tagName === 'textPath') {} else { labelEl.setAttribute('x', midX); labelEl.setAttribute('y', midY); }
              }
              const connGroup = document.getElementById('conn-group-' + conn.id);
              if (connGroup && (connGroup.classList.contains('wire-draw') || connGroup.classList.contains('wire-undraw'))) {
                const len = path.getTotalLength ? path.getTotalLength() : 500;
                connGroup.style.setProperty('--wire-len', len + '');
              }
            });
          }
          updateTransform(); updateConnections();
        })();
      </script>
    `;
  };

  return (
    <BuilderContext.Provider value={{ 
      elements, connections, selectedIds, selectedConnectionId, connectingNode, scale, pan, 
      addElement, updateElement, updateConnection, removeElement, removeSelected, selectElement, selectConnection, 
      setConnectingNode, addConnection, removeConnection, duplicateSelected, 
      setScale, setPan, exportHTML, alignElements, distributeElements, isPresenting, setIsPresenting, editingFocalPointId, setEditingFocalPointId,
      brushStrokes, isBrushMode, brushColor, brushWidth, setBrushMode, setBrushColor, setBrushWidth, addBrushStroke, clearBrush, undo, redo, saveHistory,
      theme, setTheme, guides, addGuide, updateGuide, removeGuide, copySelected, pasteCopied, selectAll, isSnapEnabled, setIsSnapEnabled: handleSetIsSnapEnabled,
      currentSlideIndex, setCurrentSlideIndex, revealDownstream
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) throw new Error('useBuilder must be used within BuilderProvider');
  return context;
};
