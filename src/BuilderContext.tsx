import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { CanvasElement, ElementType, Connection, PortPosition, BrushStroke, Variant, ButtonElement } from './types';
import { getIconSvgPath } from './icons';
import { v4 as uuidv4 } from 'uuid';
import { createElement } from './models/Element';
import { migrateConnections, migrateElements, migrateVariants } from './models/migration';
import { compat } from './models/compat';
import { ALL_EFFECTS } from './animations/effects';
import { getConnectionArrow, getConnectionDasharray, getConnectionStroke } from './models/Connection';

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
const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number): T => {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
};

/** Calculate shortest distance from point p to line segment ab */
const getDistanceToSegment = (
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number }
): number => {
  const l2 = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = a.x + t * (b.x - a.x);
  const projY = a.y + t * (b.y - a.y);
  return Math.hypot(p.x - projX, p.y - projY);
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

// --- OOP Helpers: Bridge new model to legacy rendering ---

/** Get the fill color from an element's fill style */
export const getElementFillColor = (el: CanvasElement): string => {
  if (el.fill.type === 'none') return 'transparent';
  return el.fill.color || 'transparent';
};

/** Get the border/stroke CSS values */
export const getElementStroke = (el: CanvasElement) => ({
  width: el.stroke.width,
  color: el.stroke.color,
  radius: el.stroke.radius,
  style: el.stroke.style,
});

/** Get text content from element */
export const getElementText = (el: CanvasElement): string => {
  return el.text?.content || '';
};

/** Get text color */
export const getElementTextColor = (el: CanvasElement): string => {
  return getAdaptedTextColor(el.text?.color);
};

/** Get font family */
export const getElementFontFamily = (el: CanvasElement): string => {
  return el.text?.fontFamily || "'Google Sans Text'";
};

/** Get font size */
export const getElementFontSize = (el: CanvasElement): number => {
  return el.text?.fontSize || 16;
};

/** Get text alignment */
export const getElementTextAlign = (el: CanvasElement): string => {
  return el.text?.align || 'center';
};

/** Get element name / title for display */
export const getElementName = (el: CanvasElement): string => {
  return el.name || '';
};

/** Get the shadow CSS */
export const getElementShadowCSS = (el: CanvasElement): string => {
  if (!el.shadow.enabled) return 'none';
  const s = el.shadow;
  return `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`;
};

/** Get button action */
export const getElementAction = (el: CanvasElement): { type: string; target: string; link: string } => {
  if (el.type === 'button') {
    return (el as ButtonElement).action;
  }
  return { type: 'none', target: '', link: '#' };
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

export type SlideLayout = 'blank' | 'title' | 'titleBody' | 'section' | 'media';

interface BuilderContextType {
  elements: CanvasElement[];
  connections: Connection[];
  selectedIds: string[];
  selectedConnectionId: string | null;
  isPropertiesOpen: boolean;
  setIsPropertiesOpen: (open: boolean) => void;
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
  isBlurEnabled: boolean;
  setIsBlurEnabled: (enabled: boolean) => void;
  
  addElement: (type: ElementType, pos?: { x: number, y: number }, additionalProps?: Partial<CanvasElement>) => void;
  addSlideNode: (layout?: SlideLayout) => void;
  duplicateSlideNode: (id: string) => void;
  moveSlideNode: (id: string, direction: 'left' | 'right') => void;
  updateElement: (id: string, updates: Partial<CanvasElement> & Record<string, any>) => void;
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
  playedAnimationIds: string[];
  setPlayedAnimationIds: React.Dispatch<React.SetStateAction<string[]>>;
  previewAnimationId: string | null;
  setPreviewAnimationId: (id: string | null) => void;
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
  saveHistoryOnce: (scope: string, idleMs?: number) => void;
  brushTool: 'draw' | 'erase';
  setBrushTool: (tool: 'draw' | 'erase') => void;
  eraseBrushStrokesAt: (currentPos: { x: number; y: number }, lastPos: { x: number; y: number } | null, radius: number) => void;
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  revealDownstream: (startId: string) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;
  variants: Variant[];
  activeVariantId: string;
  switchVariant: (id: string) => void;
  addVariant: () => void;
  deleteVariant: (id: string) => void;
  renameVariant: (id: string, name: string) => void;
  importHTML: (htmlText: string) => boolean;
  importCodeAndMerge: (code: string) => boolean;
  showAlert: (message: string, title?: string) => Promise<void>;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
  
  // --- Layer Management (Miro/Figma-style) ---
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  reorderElements: (draggedId: string, targetId: string) => void;
  
  // --- Group Management ---
  groupElements: (ids: string[]) => void;
  ungroupElements: (groupId: string) => void;
  
  // --- Animation Management ---
  updateElementAnimations: (id: string, animations: any[]) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [variants, setVariants] = useState<Variant[]>(() => {
    const saved = localStorage.getItem('js-builder-variants');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old format elements to new OOP format
        return migrateVariants(parsed);
      } catch (e) {
        console.warn("Failed to parse variants, using fallback", e);
      }
    }
    const oldElements = safeParse('js-builder-elements', []);
    const oldConnections = safeParse('js-builder-connections', []);
    const oldBrush = safeParse('js-builder-brush', []);
    const oldGuides = safeParse('js-builder-guides', []);
    return [{
      id: 'default',
      name: 'Variant 1',
      elements: migrateElements(oldElements),
      connections: migrateConnections(oldConnections),
      brushStrokes: oldBrush,
      guides: oldGuides
    }];
  });

  const [activeVariantId, setActiveVariantIdState] = useState<string>(() => {
    return localStorage.getItem('js-builder-active-variant') || 'default';
  });

  const [elements, setElements] = useState<CanvasElement[]>(() => {
    const savedActiveId = localStorage.getItem('js-builder-active-variant') || 'default';
    const savedVariants = localStorage.getItem('js-builder-variants');
    if (savedVariants) {
      try {
        const parsed = JSON.parse(savedVariants) as Variant[];
        const active = parsed.find(v => v.id === savedActiveId);
        if (active) return migrateElements(active.elements);
      } catch {
        // Ignore malformed saved variants and fall back to legacy keys.
      }
    }
    return migrateElements(safeParse('js-builder-elements', []));
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const savedActiveId = localStorage.getItem('js-builder-active-variant') || 'default';
    const savedVariants = localStorage.getItem('js-builder-variants');
    if (savedVariants) {
      try {
        const parsed = JSON.parse(savedVariants) as Variant[];
        const active = parsed.find(v => v.id === savedActiveId);
        if (active) return migrateConnections(active.connections);
      } catch {
        // Ignore malformed saved variants and fall back to legacy keys.
      }
    }
    return migrateConnections(safeParse('js-builder-connections', []));
  });

  const [brushStrokes, setBrushStrokes] = useState<BrushStroke[]>(() => {
    const savedActiveId = localStorage.getItem('js-builder-active-variant') || 'default';
    const savedVariants = localStorage.getItem('js-builder-variants');
    if (savedVariants) {
      try {
        const parsed = JSON.parse(savedVariants) as Variant[];
        const active = parsed.find(v => v.id === savedActiveId);
        if (active) return active.brushStrokes;
      } catch {
        // Ignore malformed saved variants and fall back to legacy keys.
      }
    }
    return safeParse('js-builder-brush', []);
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('js-builder-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [guides, setGuides] = useState<{ id: string; type: 'horizontal' | 'vertical'; position: number }[]>(() => {
    const savedActiveId = localStorage.getItem('js-builder-active-variant') || 'default';
    const savedVariants = localStorage.getItem('js-builder-variants');
    if (savedVariants) {
      try {
        const parsed = JSON.parse(savedVariants) as Variant[];
        const active = parsed.find(v => v.id === savedActiveId);
        if (active) return active.guides;
      } catch {
        // Ignore malformed saved variants and fall back to legacy keys.
      }
    }
    return safeParse('js-builder-guides', []);
  });
  const [copiedElements, setCopiedElements] = useState<CanvasElement[]>([]);
  const [isSnapEnabled, setIsSnapEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('js-builder-snap');
    return saved !== 'false';
  });
  const [isBlurEnabled, setIsBlurEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('js-builder-blur');
    return saved !== 'false';
  });

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem('js-builder-theme', t);
  };

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
  }, [theme]);

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

  const [, setHistory] = useState<HistoryState[]>([]);
  const [, setRedoStack] = useState<HistoryState[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connectingNode, setConnectingNode] = useState<ConnectingState | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [editingFocalPointId, setEditingFocalPointId] = useState<string | null>(null);
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [playedAnimationIds, setPlayedAnimationIds] = useState<string[]>([]);
  const [previewAnimationId, setPreviewAnimationId] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  
  const [isBrushMode, setIsBrushMode] = useState(false);
  const [brushColor, setBrushColorVal] = useState('#4caf50');
  const [brushWidth, setBrushWidthVal] = useState(4);
  const [brushTool, setBrushTool] = useState<'draw' | 'erase'>('draw');

  // Refs to avoid stale closures in history callbacks
  const elementsRef = useRef(elements);
  const connectionsRef = useRef(connections);
  const brushStrokesRef = useRef(brushStrokes);
  elementsRef.current = elements;
  connectionsRef.current = connections;
  brushStrokesRef.current = brushStrokes;

  const getElementCanvasBounds = useCallback((el: CanvasElement, allElements: CanvasElement[] = elementsRef.current) => {
    const chain: CanvasElement[] = [el];
    let parentId = el.parentId;
    while (parentId) {
      const parent = allElements.find(parentEl => parentEl.id === parentId);
      if (!parent) break;
      chain.unshift(parent);
      parentId = parent.parentId;
    }

    const root = chain[0];
    let bounds = { x: root.x, y: root.y, width: root.width, height: root.height };
    for (const child of chain.slice(1)) {
      bounds = child.fillParent
        ? {
            x: bounds.x + 16,
            y: bounds.y + 45 + 16,
            width: Math.max(1, bounds.width - 32),
            height: Math.max(1, bounds.height - 45 - 32),
          }
        : {
            x: bounds.x + 16 + child.x,
            y: bounds.y + 45 + 16 + child.y,
            width: child.width,
            height: child.height,
          };
    }
    return bounds;
  }, []);

  const findBrushAttachmentElementId = useCallback((points: { x: number; y: number }[], allElements: CanvasElement[] = elementsRef.current): string | null => {
    for (let i = allElements.length - 1; i >= 0; i--) {
      const el = allElements[i];
      if (el.visible === false) continue;
      const bounds = getElementCanvasBounds(el, allElements);
      const intersects = points.some(p =>
        p.x >= bounds.x &&
        p.x <= bounds.x + bounds.width &&
        p.y >= bounds.y &&
        p.y <= bounds.y + bounds.height
      );
      if (intersects) return el.id;
    }
    return null;
  }, [getElementCanvasBounds]);

  const saveHistory = useCallback(() => {
    const snapshot: HistoryState = {
      elements: structuredClone(elementsRef.current),
      connections: structuredClone(connectionsRef.current),
      brushStrokes: structuredClone(brushStrokesRef.current),
    };
    setHistory(prev => [...prev.slice(-49), snapshot]);
    setRedoStack([]);
  }, []);

  const historyScopesRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const saveHistoryOnce = useCallback((scope: string, idleMs = 700) => {
    if (!historyScopesRef.current[scope]) {
      saveHistory();
    }

    window.clearTimeout(historyScopesRef.current[scope]);
    historyScopesRef.current[scope] = window.setTimeout(() => {
      delete historyScopesRef.current[scope];
    }, idleMs);
  }, [saveHistory]);

  useEffect(() => {
    const historyScopes = historyScopesRef.current;
    return () => {
      Object.values(historyScopes).forEach(timer => window.clearTimeout(timer));
    };
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
  }, []);

  const copySelected = useCallback(() => {
    const toCopy = new Set(selectedIds);
    let added = true;
    while (added) {
      added = false;
      elementsRef.current.forEach(el => {
        if (el.parentId && toCopy.has(el.parentId) && !toCopy.has(el.id)) {
          toCopy.add(el.id);
          added = true;
        }
      });
    }
    const selected = elementsRef.current.filter(el => toCopy.has(el.id));
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

  const handleSetIsBlurEnabled = (val: boolean) => {
    setIsBlurEnabled(val);
    localStorage.setItem('js-builder-blur', String(val));
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

  const debouncedSaveVariants = useRef(debounce((data: Variant[]) => {
    localStorage.setItem('js-builder-variants', JSON.stringify(data));
  }, 500)).current;

  useEffect(() => { debouncedSaveElements(elements); }, [elements, debouncedSaveElements]);
  useEffect(() => { debouncedSaveConnections(connections); }, [connections, debouncedSaveConnections]);
  useEffect(() => { debouncedSaveBrush(brushStrokes); }, [brushStrokes, debouncedSaveBrush]);

  const prevElementPositionsRef = useRef<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    const currentPositions: Record<string, { x: number; y: number }> = {};
    
    let hasChanges = false;
    const updates: Record<string, { dx: number; dy: number }> = {};
    
    elements.forEach(el => {
      const bounds = getElementCanvasBounds(el, elements);
      currentPositions[el.id] = { x: bounds.x, y: bounds.y };
      const prev = prevElementPositionsRef.current[el.id];
      if (prev) {
        const dx = bounds.x - prev.x;
        const dy = bounds.y - prev.y;
        if (dx !== 0 || dy !== 0) {
          updates[el.id] = { dx, dy };
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      setBrushStrokes(prevStrokes => prevStrokes.map(stroke => {
        if (stroke.attachedNodeId && updates[stroke.attachedNodeId]) {
          const { dx, dy } = updates[stroke.attachedNodeId];
          return {
            ...stroke,
            points: stroke.points.map(p => ({ x: p.x + dx, y: p.y + dy }))
          };
        }
        return stroke;
      }));
    }
    
    prevElementPositionsRef.current = currentPositions;
  }, [elements, getElementCanvasBounds]);

  const lastActiveVariantIdRef = useRef(activeVariantId);

  useEffect(() => {
    if (lastActiveVariantIdRef.current !== activeVariantId) {
      lastActiveVariantIdRef.current = activeVariantId;
      return;
    }
    setVariants(prev => prev.map(v => {
      if (v.id === activeVariantId) {
        return { ...v, elements, connections, brushStrokes, guides };
      }
      return v;
    }));
  }, [elements, connections, brushStrokes, guides, activeVariantId]);

  useEffect(() => { debouncedSaveVariants(variants); }, [variants, debouncedSaveVariants]);

  useEffect(() => {
    localStorage.setItem('js-builder-active-variant', activeVariantId);
  }, [activeVariantId]);

  const switchVariant = (targetId: string) => {
    if (targetId === activeVariantId) return;

    const updatedVariants = variants.map(v => {
      if (v.id === activeVariantId) {
        return { ...v, elements, connections, brushStrokes, guides };
      }
      return v;
    });

    const targetVariant = updatedVariants.find(v => v.id === targetId);
    if (targetVariant) {
      const targetElements = migrateElements(targetVariant.elements);
      const targetConnections = migrateConnections(targetVariant.connections);
      setActiveVariantIdState(targetId);
      setVariants(updatedVariants);

      setElements(targetElements);
      setConnections(targetConnections);
      setBrushStrokes(targetVariant.brushStrokes);
      setGuides(targetVariant.guides);

      setSelectedIds([]);
      setSelectedConnectionId(null);
      setHistory([]);
      setRedoStack([]);
    }
  };

  const addVariant = () => {
    if (variants.length >= 5) return;
    saveHistory();
    const newId = uuidv4();
    const newVariant: Variant = {
      id: newId,
      name: `Variant ${variants.length + 1}`,
      elements: [],
      connections: [],
      brushStrokes: [],
      guides: []
    };
    
    const updatedVariants = variants.map(v => {
      if (v.id === activeVariantId) {
        return { ...v, elements, connections, brushStrokes, guides };
      }
      return v;
    });

    const nextVariants = [...updatedVariants, newVariant];
    setVariants(nextVariants);
    setActiveVariantIdState(newId);
    setElements([]);
    setConnections([]);
    setBrushStrokes([]);
    setGuides([]);
    setSelectedIds([]);
    setSelectedConnectionId(null);
    setHistory([]);
    setRedoStack([]);
  };

  const deleteVariant = (id: string) => {
    if (variants.length <= 1) return;
    saveHistory();
    const index = variants.findIndex(v => v.id === id);
    const updatedVariants = variants.filter(v => v.id !== id);
    
    if (activeVariantId === id) {
      const nextActiveIndex = index === 0 ? 0 : index - 1;
      const targetVariant = updatedVariants[nextActiveIndex];
      const targetElements = migrateElements(targetVariant.elements);
      const targetConnections = migrateConnections(targetVariant.connections);
      setActiveVariantIdState(targetVariant.id);
      setVariants(updatedVariants);
      setElements(targetElements);
      setConnections(targetConnections);
      setBrushStrokes(targetVariant.brushStrokes);
      setGuides(targetVariant.guides);
      setSelectedIds([]);
      setSelectedConnectionId(null);
      setHistory([]);
      setRedoStack([]);
    } else {
      setVariants(updatedVariants);
    }
  };

  const renameVariant = (id: string, name: string) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, name } : v));
  };

  const importHTML = (htmlText: string): boolean => {
    try {
      const match = htmlText.match(/<script id="js-builder-state" type="application\/json">([\s\S]*?)<\/script>/);
      if (!match || !match[1]) {
        return false;
      }
      const state = JSON.parse(match[1]);
      if (state.variants && state.activeVariantId) {
        saveHistory();
        const nextVariants = migrateVariants(state.variants);
        if (nextVariants.length === 0) return false;
        const nextActiveId = nextVariants.some(v => v.id === state.activeVariantId)
          ? state.activeVariantId
          : nextVariants[0]?.id || 'default';
        setVariants(nextVariants);
        setActiveVariantIdState(nextActiveId);
        
        const active = nextVariants.find((v: any) => v.id === nextActiveId);
        if (active) {
          setElements(active.elements || []);
          setConnections(active.connections || []);
          setBrushStrokes(active.brushStrokes || []);
          setGuides(active.guides || []);
        }
        if (state.theme === 'light' || state.theme === 'dark') {
          setTheme(state.theme);
        }
        setSelectedIds([]);
        setSelectedConnectionId(null);
        setHistory([]);
        setRedoStack([]);
        return true;
      } else if (state.elements) {
        saveHistory();
        const fallbackVariant: Variant = {
          id: 'default',
          name: 'Variant 1',
          elements: migrateElements(state.elements || []),
          connections: migrateConnections(state.connections || []),
          brushStrokes: state.brushStrokes || [],
          guides: state.guides || []
        };
        setVariants([fallbackVariant]);
        setActiveVariantIdState('default');
        setElements(fallbackVariant.elements);
        setConnections(fallbackVariant.connections);
        setBrushStrokes(fallbackVariant.brushStrokes);
        setGuides(fallbackVariant.guides);
        if (state.theme === 'light' || state.theme === 'dark') {
          setTheme(state.theme);
        }
        setSelectedIds([]);
        setSelectedConnectionId(null);
        setHistory([]);
        setRedoStack([]);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to import HTML state", e);
      return false;
    }
  };

  const importCodeAndMerge = (code: string): boolean => {
    try {
      let state: any;
      const match = code.match(/<script id="js-builder-state" type="application\/json">([\s\S]*?)<\/script>/);
      if (match && match[1]) {
        state = JSON.parse(match[1]);
      } else {
        state = JSON.parse(code);
      }

      let importedElements: CanvasElement[] = [];
      let importedConnections: Connection[] = [];
      let importedBrushStrokes: BrushStroke[] = [];

      if (state.variants && state.activeVariantId) {
        const active = state.variants.find((v: any) => v.id === state.activeVariantId) || state.variants[0];
        if (active) {
          importedElements = active.elements || [];
          importedConnections = active.connections || [];
          importedBrushStrokes = active.brushStrokes || [];
        }
      } else if (state.elements) {
        importedElements = state.elements || [];
        importedConnections = state.connections || [];
        importedBrushStrokes = state.brushStrokes || [];
      } else {
        return false;
      }

      importedElements = migrateElements(importedElements);
      importedConnections = migrateConnections(importedConnections);

      saveHistory();

      const idMap = new Map<string, string>();
      importedElements.forEach(el => idMap.set(el.id, uuidv4()));

      const newElements = importedElements.map(el => {
        let newParentId = el.parentId;
        if (newParentId && idMap.has(newParentId)) {
          newParentId = idMap.get(newParentId)!;
        } else if (newParentId) {
          newParentId = null;
        }
        
        return {
          ...el,
          id: idMap.get(el.id)!,
          parentId: newParentId,
          x: newParentId ? el.x : el.x + 50,
          y: newParentId ? el.y : el.y + 50,
        };
      }) as CanvasElement[];

      const existingIds = new Set(elementsRef.current.map(el => el.id));
      const newConnections = importedConnections
        .filter(conn =>
          (idMap.has(conn.fromId) || existingIds.has(conn.fromId)) &&
          (idMap.has(conn.toId) || existingIds.has(conn.toId))
        )
        .map(conn => ({
          ...conn,
          id: uuidv4(),
          fromId: idMap.get(conn.fromId) || conn.fromId,
          toId: idMap.get(conn.toId) || conn.toId,
        })) as Connection[];

      const newBrushStrokes = importedBrushStrokes
        .filter(stroke => Array.isArray(stroke.points))
        .map(stroke => ({
          ...stroke,
          id: uuidv4(),
          attachedNodeId: stroke.attachedNodeId ? (idMap.get(stroke.attachedNodeId) || null) : null,
          points: stroke.points.map(p => ({ x: p.x + 50, y: p.y + 50 })),
        }));

      setElements(prev => [...prev, ...newElements]);
      setConnections(prev => [...prev, ...newConnections]);
      setBrushStrokes(prev => [...prev, ...newBrushStrokes]);
      setSelectedIds(newElements.map(el => el.id));

      return true;
    } catch (e) {
      console.error("Failed to import code and merge", e);
      return false;
    }
  };

  const addElement = (type: ElementType, pos?: { x: number, y: number }, additionalProps?: Partial<CanvasElement>) => {
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

  const addSlideNode = (layout: SlideLayout = 'blank') => {
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

  const duplicateSlideNode = (id: string) => {
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

  const moveSlideNode = (id: string, direction: 'left' | 'right') => {
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

  const updateElement = (id: string, updates: Partial<CanvasElement> & Record<string, any>) => {
    setElements(prev => prev.map(el => {
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

  const updateConnection = (id: string, updates: Partial<Connection>) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, ...updates } as Connection : c));
  };
  const removeElement = (id: string) => {
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
      const target = elementsRef.current.find(el => el.id === id);
      const groupIds = target?.groupId
        ? elementsRef.current.filter(el => el.groupId === target.groupId).map(el => el.id)
        : [id];
      setSelectedIds(prev => {
        const allSelected = groupIds.every(groupId => prev.includes(groupId));
        return allSelected
          ? prev.filter(sid => !groupIds.includes(sid))
          : Array.from(new Set([...prev, ...groupIds]));
      });
    } else {
      const target = elementsRef.current.find(el => el.id === id);
      if (target?.groupId) {
        setSelectedIds(elementsRef.current.filter(el => el.groupId === target.groupId).map(el => el.id));
      } else {
        setSelectedIds([id]);
      }
    }
    setSelectedConnectionId(null);
    setIsPropertiesOpen(true);
  };

  const selectConnection = (id: string | null) => {
    setSelectedConnectionId(id);
    if (id) {
      setSelectedIds([]);
      setIsPropertiesOpen(true);
    }
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

  const addBrushStroke = (stroke: BrushStroke) => {
    saveHistory();
    const attachedNodeId = findBrushAttachmentElementId(stroke.points);
    const updatedStroke = { ...stroke, attachedNodeId };
    setBrushStrokes(prev => [...prev, updatedStroke]);
  };
  const clearBrush = () => { saveHistory(); setBrushStrokes([]); };
  const setBrushMode = (enabled: boolean) => {
    setIsBrushMode(enabled);
    if (enabled) {
      setSelectedIds([]);
      setSelectedConnectionId(null);
    }
  };
  const setBrushColor = (color: string) => setBrushColorVal(color);
  const setBrushWidth = (width: number) => setBrushWidthVal(width);
  const eraseBrushStrokesAt = useCallback((currentPos: { x: number; y: number }, lastPos: { x: number; y: number } | null, radius: number) => {
    setBrushStrokes(prevStrokes => {
      let changed = false;
      const newStrokes: BrushStroke[] = [];
      for (const stroke of prevStrokes) {
        let currentPoints: { x: number; y: number }[] = [];
        for (const p of stroke.points) {
          const dist = lastPos 
            ? getDistanceToSegment(p, lastPos, currentPos)
            : Math.hypot(p.x - currentPos.x, p.y - currentPos.y);
          
          const threshold = radius + stroke.width / 2;
          if (dist <= threshold) {
            if (currentPoints.length > 1) {
              newStrokes.push({
                id: uuidv4(),
                points: currentPoints,
                color: stroke.color,
                width: stroke.width,
                attachedNodeId: stroke.attachedNodeId
              });
            }
            currentPoints = [];
            changed = true;
          } else {
            currentPoints.push(p);
          }
        }
        if (currentPoints.length > 1) {
          newStrokes.push({
            id: stroke.id,
            points: currentPoints,
            color: stroke.color,
            width: stroke.width,
            attachedNodeId: stroke.attachedNodeId
          });
        }
      }
      if (changed) {
        return newStrokes;
      }
      return prevStrokes;
    });
  }, []);

  const exportHTML = () => {
    const animationKeyframesCSS = ALL_EFFECTS.map(eff => eff.css).join('\n');
    const sanitizeHTML = (html: string | undefined): string => {
      if (!html) return '';
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/on\w+\s*=\s*(['"])(.*?)\1/gi, '');
    };

    // Collect fonts used by elements across all variants
    const usedFonts = new Set<string>();
    const currentActiveVariant = {
      id: activeVariantId,
      name: variants.find(v => v.id === activeVariantId)?.name || 'Variant 1',
      elements,
      connections,
      brushStrokes,
      guides
    };
    const allVariants = variants.map(v => v.id === activeVariantId ? currentActiveVariant : v);

    allVariants.forEach(v => {
      v.elements.forEach(el => {
        const fontFamily = el.text?.fontFamily;
        if (fontFamily) {
          const clean = fontFamily.replace(/['"]/g, '').trim();
          if (clean) usedFonts.add(clean);
        }
      });
      v.connections.forEach(conn => {
        if (conn.fontFamily) {
          const clean = conn.fontFamily.replace(/['"]/g, '').trim();
          if (clean) usedFonts.add(clean);
        }
      });
    });

    const systemFonts = new Set(['sans-serif', 'serif', 'monospace', 'arial', 'georgia', 'verdana', 'times new roman', 'courier new', 'trebuchet ms', 'impact', 'comic sans ms']);
    const googleFontApiMap: Record<string, string> = {
      'Lexend Deca': 'Lexend+Deca:wght@100..900',
      'Comic Neue': 'Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700',
      'Open Sans': 'Open+Sans:ital,wght@0,300..800;1,300..800',
      'Roboto': 'Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900',
    };

    const fontFamiliesToLoad: string[] = [];
    usedFonts.forEach(font => {
      if (systemFonts.has(font.toLowerCase())) return;
      if (font === 'Google Sans Display' || font === 'Google Sans Text' || font === 'Google Sans Flex') return;
      
      const apiName = googleFontApiMap[font] || `${font.replace(/\s+/g, '+')}:wght@300;400;500;700`;
      fontFamiliesToLoad.push(apiName);
    });

    let fontLinkTags = '';
    if (fontFamiliesToLoad.length > 0) {
      const familiesParam = fontFamiliesToLoad.map(f => `family=${f}`).join('&');
      fontLinkTags = `<link href="https://fonts.googleapis.com/css2?${familiesParam}&display=swap" rel="stylesheet">`;
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

    const getExportFillCSS = (fill: any) => {
      if (!fill || fill.type === 'none') return 'background: transparent;';
      if (fill.type === 'solid') return `background: ${fill.color || 'transparent'};`;
      if (fill.type === 'gradient' && fill.gradient) {
        const { type, stops, angle } = fill.gradient;
        const sortedStops = [...stops].sort((a, b) => a.offset - b.offset);
        const stopsStr = sortedStops.map(s => `${s.color} ${s.offset * 100}%`).join(', ');
        if (type === 'radial') {
          return `background: radial-gradient(circle, ${stopsStr});`;
        } else {
          return `background: linear-gradient(${angle}deg, ${stopsStr});`;
        }
      }
      return 'background: transparent;';
    };

    const getExportSvgFill = (fill: any, id: string, fallback: string) => {
      if (!fill || fill.type === 'none') return { defs: '', fillValue: 'transparent' };
      if (fill.type !== 'gradient' || !fill.gradient) return { defs: '', fillValue: fallback || fill.color || 'transparent' };
      const stops = [...fill.gradient.stops]
        .sort((a, b) => a.offset - b.offset)
        .map(stop => `<stop offset="${Math.round(stop.offset * 100)}%" stop-color="${escapeHtml(stop.color)}" />`)
        .join('');
      const gradientId = `svg-fill-${id}`;
      if (fill.gradient.type === 'radial') {
        return {
          defs: `<defs><radialGradient id="${gradientId}">${stops}</radialGradient></defs>`,
          fillValue: `url(#${gradientId})`,
        };
      }
      const angle = (fill.gradient.angle * Math.PI) / 180;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      return {
        defs: `<defs><linearGradient id="${gradientId}" x1="${50 - x * 50}%" y1="${50 - y * 50}%" x2="${50 + x * 50}%" y2="${50 + y * 50}%">${stops}</linearGradient></defs>`,
        fillValue: `url(#${gradientId})`,
      };
    };

    const getExportStrokeCSS = (stroke: any) => {
      const radius = stroke?.radius ?? 0;
      const radiusCSS = radius > 0 ? `border-radius: ${radius}px;` : '';
      if (!stroke || stroke.width === 0) return `border: none; ${radiusCSS}`;
      return `border-width: ${stroke.width}px; border-style: ${stroke.style || 'solid'}; border-color: ${stroke.color || 'var(--border-color)'}; ${radiusCSS}`;
    };

    const getExportShadowCSS = (shadow: any) => {
      if (!shadow || !shadow.enabled) return 'box-shadow: none;';
      return `box-shadow: ${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread || 0}px ${shadow.color};`;
    };

    const getExportSvgShadowCSS = (shadow: any) => {
      if (!shadow || !shadow.enabled) return 'filter: none;';
      return `filter: drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color});`;
    };

    const getSvgStrokeDasharray = (style: string) => {
      if (style === 'dashed') return '8 4';
      if (style === 'dotted') return '2 2';
      return 'none';
    };

    const renderVariantHTMLData = (vElements: CanvasElement[], vConnections: Connection[], vBrushStrokes: BrushStroke[]) => {
      const adj = new Map<string, Connection[]>();
      vConnections.forEach(c => {
        if (!adj.has(c.fromId)) adj.set(c.fromId, []);
        adj.get(c.fromId)!.push(c);
      });

      const hiddenNodes = new Set<string>();
      const hiddenConnections = new Set<string>();
      const interactiveTargets = new Set<string>();
      const elementsMap = new Map(vElements.map(e => [e.id, e]));

      // 1. Direct targets of Interactive Btns are hidden
      vElements.forEach(el => {
        if (el.interactive) {
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
        if (el && el.pinned) {
          continue; // Skip hiding pinned node
        }
        hiddenNodes.add(curr);
        if (el && !el.interactive) {
          (adj.get(curr) || []).forEach(c => {
            hiddenConnections.add(c.id);
            if (!visited.has(c.toId)) {
              visited.add(c.toId);
              queue.push(c.toId);
            }
          });
        }
      }

      const buildElementHTML = (rawEl: CanvasElement, isChild: boolean = false): string => {
        const el = compat(rawEl) as any;
        const elAny = el;
        const isFillParent = isChild && elAny.fillParent;
        
        const isInteractiveHidden = hiddenNodes.has(el.id);

        let visibilityStyle = 'pointer-events: auto;';
        if (isInteractiveHidden) visibilityStyle = 'opacity: 0; pointer-events: none;';
        else if (el.isDisabled) {
          visibilityStyle = 'filter: grayscale(1) contrast(0.5); opacity: 0.6;';
          if (el.type !== 'button') visibilityStyle += ' pointer-events: none;';
        }

        const innerVisibilityStyle = el.isHidden ? 'opacity: 0; pointer-events: none;' : '';

        const shadowStyle = (el.type !== 'shape' && el.type !== 'icon') 
          ? getExportShadowCSS(rawEl.shadow) 
          : '';

        const radiusCSS = ['node', 'text', 'button', 'image', 'video'].includes(el.type) 
          ? `border-radius: ${rawEl.stroke?.radius ?? (el.type === 'node' ? 10 : el.type === 'button' ? 6 : 0)}px;` 
          : '';

        const baseStyle = isFillParent 
          ? `position: absolute; left: 0; top: 0; width: 100%; height: 100%; color: var(--text-primary); --element-transform: rotate(0deg); transform: var(--element-transform); transform-origin: center center; z-index: ${el.zIndex ?? (el.type === 'node' ? 1 : 2)}; opacity: ${el.opacity ?? 1}; ${shadowStyle} ${radiusCSS} transition: opacity 0.4s ease; ${visibilityStyle}`
          : `position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; color: var(--text-primary); --element-transform: rotate(${el.rotation || 0}deg); transform: var(--element-transform); transform-origin: center center; z-index: ${el.zIndex ?? (el.type === 'node' ? 1 : 2)}; opacity: ${el.opacity ?? 1}; ${shadowStyle} ${radiusCSS} transition: opacity 0.4s ease; ${visibilityStyle}`;
        
        let expandBtnHTML = '';
        if (el.enableExpandButton) {
          const outConnections = vConnections.filter(c => c.fromId === el.id);
          if (outConnections.length > 0) {
            const groups: Record<string, typeof outConnections> = { top: [], right: [], bottom: [], left: [] };
            outConnections.forEach(c => { const side = c.fromPort || 'bottom'; if (groups[side]) groups[side].push(c); });
            const arrows: Record<string, string> = { top: '\u25b2', bottom: '\u25bc', left: '\u25c0', right: '\u25b6' };
            for (const [side, conns] of Object.entries(groups)) {
              if (conns.length === 0) continue;
              const targetIdsStr = conns.map(c => c.toId).join(',');
              const labelTexts = conns.map(c => c.interactiveBtnText || (c.label ? 'YES' : '')).filter(Boolean);
              const lbl = labelTexts.length > 0 ? escapeHtml(labelTexts.join(' / ')) : arrows[side];
              const btnClass = 'conn-btn';
              const btn = '<button class="' + btnClass + '" data-targets="' + targetIdsStr + '" onclick="event.stopPropagation(); toggleMultipleTargets(this, \'' + targetIdsStr + '\', \'' + el.id + '\')">' + lbl + '</button>';
              expandBtnHTML += '<div class="conn-btn-group ' + side + '">' + btn + '</div>';
            }
          }
        }
        
        const wrapperOnClick = el.enableExpandButton 
          ? `onclick="toggleNodeArrows(event, '${el.id}')"`
          : '';

        if (el.type === 'node') {
          const children = vElements.filter(child => child.parentId === el.id);
          const childrenHTML = children.map(child => buildElementHTML(child, true)).join('\n');
          const safeTitle = escapeHtml(el.title || '');
          const titleColor = `color: ${getAdaptedTextColor(el.color)};`;
          return `<div id="el-wrapper-${el.id}" ${wrapperOnClick} class="${isChild ? '' : 'draggable-element'} is-node ${el.isDisabled ? 'disabled' : ''} ${isInteractiveHidden ? 'is-hidden' : ''}" data-id="${el.id}" style="${baseStyle} overflow: visible; cursor: grab;"><div style="width: 100%; height: 100%; ${getExportFillCSS(rawEl.fill)} font-family: ${el.fontFamily}; ${getExportStrokeCSS(rawEl.stroke)} display: flex; flex-direction: column; overflow: hidden; transition: opacity 0.3s; ${innerVisibilityStyle}"><div style="padding: 12px 16px; background-color: var(--panel-header-bg); font-size: 14px; font-weight: 600; border-bottom: 1px solid var(--border-color); pointer-events: none; ${titleColor}">${safeTitle}</div><div style="position: relative; flex: 1; padding: 16px; overflow: hidden;">${childrenHTML}</div></div>${expandBtnHTML}</div>`;
        }
        let innerContent = '';
        switch (el.type) {
          case 'text': {
            const safeText = sanitizeHTML(el.text);
            const alignItems = rawEl.text?.verticalAlign === 'top' ? 'flex-start' : rawEl.text?.verticalAlign === 'bottom' ? 'flex-end' : 'center';
            innerContent = `<div id="el-${el.id}" style="width: 100%; height: 100%; color: ${getAdaptedTextColor(el.color)}; font-size: ${el.fontSize}px; font-family: ${el.fontFamily}; ${getExportFillCSS(rawEl.fill)} ${getExportStrokeCSS(rawEl.stroke)} display: flex; align-items: ${alignItems}; justify-content: center; padding: ${rawEl.text?.padding?.top ?? 10}px ${rawEl.text?.padding?.right ?? 14}px ${rawEl.text?.padding?.bottom ?? 10}px ${rawEl.text?.padding?.left ?? 14}px; font-weight: ${rawEl.text?.fontWeight ?? 400}; font-style: ${rawEl.text?.fontStyle ?? 'normal'}; text-decoration: ${rawEl.text?.textDecoration ?? 'none'}; letter-spacing: ${rawEl.text?.letterSpacing ?? 0}px; line-height: ${rawEl.text?.lineHeight ?? 1.5}; box-sizing: border-box; overflow: hidden; pointer-events: none;"><div style="width: 100%; text-align: ${el.textAlign || 'center'}; word-break: break-word; line-height: ${rawEl.text?.lineHeight ?? 1.5}; letter-spacing: ${rawEl.text?.letterSpacing ?? 0}px;">${safeText}</div></div>`;
            break;
          }
          case 'button': {
            const safeButtonText = sanitizeHTML(el.text);
            let onClickAttr = '';
            const action = el.actionType;
            const target = el.actionTarget;
            
            const check = "if(window.blockClick){window.blockClick=false;event?.preventDefault();return;}";
            if (action === 'alert') {
              const safeTarget = escapeHtml(target).replace(/'/g, "\\'");
              onClickAttr = `onclick="${check} event.stopPropagation(); showNotification('${safeTarget}')"`;
            } else if (action === 'link') {
              const safeLink = escapeHtml(el.link);
              onClickAttr = `href="${safeLink}" target="_blank" rel="noopener noreferrer" onclick="${check} event.stopPropagation();"`;
            } else if (action === 'toggleDisabled') {
              const safeTarget = escapeHtml(target).replace(/'/g, "\\'");
              onClickAttr = `onclick="${check} event.stopPropagation(); toggleDisabled('${safeTarget}')"`;
            } else if (action === 'toggleVisibility') {
              const safeTarget = escapeHtml(target).replace(/'/g, "\\'");
              onClickAttr = `onclick="${check} event.stopPropagation(); toggleVisibility('${safeTarget}')"`;
            } else if (action === 'triggerFlow') {
              const safeTarget = escapeHtml(target).replace(/'/g, "\\'");
              onClickAttr = `onclick="${check} event.stopPropagation(); triggerFlow('${safeTarget}')"`;
            } else if (action === 'nextSlide') {
              onClickAttr = `onclick="${check} event.stopPropagation(); nextSlide()"`;
            } else if (action === 'prevSlide') {
              onClickAttr = `onclick="${check} event.stopPropagation(); prevSlide()"`;
            } else if (action === 'goToSlide') {
              const safeTarget = escapeHtml(target).replace(/'/g, "\\'");
              onClickAttr = `onclick="${check} event.stopPropagation(); goToSlideById('${safeTarget}')"`;
            }
            
            const tag = action === 'link' ? 'a' : 'button';
            const buttonDisabledAttr = (action !== 'link' && el.isDisabled) ? 'disabled' : '';
            const alignItems = rawEl.text?.verticalAlign === 'top' ? 'flex-start' : rawEl.text?.verticalAlign === 'bottom' ? 'flex-end' : 'center';
            innerContent = `<${tag} id="el-${el.id}" ${onClickAttr} ${buttonDisabledAttr} class="${el.isDisabled ? 'disabled' : ''}" style="width: 100%; height: 100%; font-family: ${el.fontFamily}; ${getExportFillCSS(rawEl.fill)} ${getExportStrokeCSS(rawEl.stroke)} color: ${getAdaptedTextColor(el.color)}; cursor: pointer; display: flex; align-items: ${alignItems}; justify-content: center; text-decoration: none; font-weight: ${rawEl.text?.fontWeight ?? 700}; font-style: ${rawEl.text?.fontStyle ?? 'normal'}; text-decoration: ${rawEl.text?.textDecoration ?? 'none'}; font-size: ${elAny.fontSize || 16}px; padding: ${rawEl.text?.padding?.top ?? 8}px ${rawEl.text?.padding?.right ?? 14}px ${rawEl.text?.padding?.bottom ?? 8}px ${rawEl.text?.padding?.left ?? 14}px; line-height: ${rawEl.text?.lineHeight ?? 1.5}; letter-spacing: ${rawEl.text?.letterSpacing ?? 0}px; box-sizing: border-box;"><div style="width: 100%; text-align: ${el.textAlign || 'center'}; word-break: break-word; line-height: ${rawEl.text?.lineHeight ?? 1.5}; letter-spacing: ${rawEl.text?.letterSpacing ?? 0}px;">${safeButtonText}</div></${tag}>`;
            break;
          }
          case 'image': {
            const safeImgTitle = elAny.title ? escapeHtml(elAny.title) : '';
            const exportSrc = (() => {
              if (!el.src || !el.src.includes('lh3.googleusercontent.com')) return el.src;
              const q = (el as any).imageQuality;
              if (q === undefined) return el.src;
              const baseSrc = el.src.replace(/=s\d+$/, '');
              return q === 100 ? `${baseSrc}=s0` : `${baseSrc}=s${Math.round(40 * q)}`;
            })();
            const safeAlt = escapeHtml(el.alt);
            const imgHeader = safeImgTitle ? `<div style="padding: 6px 12px; background-color: var(--panel-header-bg); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; font-size: ${elAny.fontSize || 11}px; font-weight: 700; color: var(--text-secondary); width: 100%; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0;">${safeImgTitle}</div>` : '';
            innerContent = `<div style="width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;">${imgHeader}<div style="flex: 1; position: relative; overflow: hidden;"><img id="el-${el.id}" src="${escapeHtml(exportSrc)}" alt="${safeAlt}" style="width: 100%; height: 100%; object-fit: ${el.objectFit}; object-position: ${elAny.objectPosition || '50% 50%'}; ${getExportStrokeCSS(rawEl.stroke)} box-sizing: border-box; pointer-events: none;" draggable="false" loading="lazy" decoding="async" /></div></div>`;
            break;
          }
          case 'video': {
            const safeVidTitle = elAny.title ? escapeHtml(elAny.title) : '';
            const safeSrc = escapeHtml(el.src);
            const vidHeader = safeVidTitle ? `<div style="padding: 6px 12px; background-color: var(--panel-header-bg); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; font-size: ${elAny.fontSize || 11}px; font-weight: 700; color: var(--text-secondary); width: 100%; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0;">${safeVidTitle}</div>` : '';
            innerContent = `<div style="width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;">${vidHeader}<div style="flex: 1; position: relative; overflow: hidden;"><iframe id="el-${el.id}" src="${safeSrc}" style="width: 100%; height: 100%; ${getExportStrokeCSS(rawEl.stroke)} box-sizing: border-box;" frameborder="0" allowfullscreen sandbox="allow-scripts allow-same-origin"></iframe></div></div>`;
            break;
          }
          case 'icon': {
            const svgPath = getIconSvgPath(el.iconName || 'home');
            const iconShadow = getExportSvgShadowCSS(rawEl.shadow);
            innerContent = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><svg viewBox="0 0 24 24" width="100%" height="100%" stroke="${el.iconColor || el.color || 'var(--text-primary)'}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block; ${iconShadow}">${svgPath}</svg></div>`;
            break;
          }
          case 'shape': {
            const hasText = el.text ? true : false;
            const alignItems = rawEl.text?.verticalAlign === 'top' ? 'flex-start' : rawEl.text?.verticalAlign === 'bottom' ? 'flex-end' : 'center';
            const shapeTextHTML = hasText ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: ${alignItems}; justify-content: center; pointer-events: none; padding: ${rawEl.text?.padding?.top ?? 8}px ${rawEl.text?.padding?.right ?? 8}px ${rawEl.text?.padding?.bottom ?? 8}px ${rawEl.text?.padding?.left ?? 8}px; box-sizing: border-box; overflow: hidden;"><div style="width: 100%; color: ${getAdaptedTextColor(el.color)}; font-size: ${el.fontSize || 14}px; font-family: ${el.fontFamily || 'sans-serif'}; text-align: ${el.textAlign || 'center'}; word-break: break-word; font-weight: ${rawEl.text?.fontWeight ?? 400}; font-style: ${rawEl.text?.fontStyle ?? 'normal'}; text-decoration: ${rawEl.text?.textDecoration ?? 'none'}; line-height: ${rawEl.text?.lineHeight ?? 1.5}; letter-spacing: ${rawEl.text?.letterSpacing ?? 0}px;">${sanitizeHTML(el.text)}</div></div>` : '';
            
            if (el.shapeType === 'rectangle') {
              innerContent = `<div id="el-${el.id}" style="position: relative; width: 100%; height: 100%; ${getExportFillCSS(rawEl.fill)} ${getExportStrokeCSS(rawEl.stroke)} pointer-events: none;">${shapeTextHTML}</div>`;
            } else if (el.shapeType === 'ellipse') {
              innerContent = `<div id="el-${el.id}" style="position: relative; width: 100%; height: 100%; ${getExportFillCSS(rawEl.fill)} ${getExportStrokeCSS(rawEl.stroke)} border-radius: 50%; pointer-events: none;">${shapeTextHTML}</div>`;
            } else if (el.shapeType === 'line') {
              innerContent = `<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${el.id}" width="100%" height="100%" style="overflow: visible; pointer-events: none; ${getExportSvgShadowCSS(rawEl.shadow)}"><line x1="0" y1="0" x2="${el.width}" y2="${el.height}" stroke="${rawEl.stroke?.color || getAdaptedBorderColor(el.borderColor)}" stroke-width="${rawEl.stroke?.width ?? el.borderWidth}" stroke-dasharray="${getSvgStrokeDasharray(rawEl.stroke?.style)}" /></svg>${shapeTextHTML}</div>`;
            } else if (el.shapeType === 'arrow') {
              const markerId = `arrowhead-${el.id}`;
              innerContent = `<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${el.id}" width="100%" height="100%" style="overflow: visible; pointer-events: none; ${getExportSvgShadowCSS(rawEl.shadow)}"><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="${rawEl.stroke?.color || getAdaptedBorderColor(el.borderColor)}" /></marker></defs><line x1="0" y1="0" x2="${el.width}" y2="${el.height}" stroke="${rawEl.stroke?.color || getAdaptedBorderColor(el.borderColor)}" stroke-width="${rawEl.stroke?.width ?? el.borderWidth}" stroke-dasharray="${getSvgStrokeDasharray(rawEl.stroke?.style)}" marker-end="url(#${markerId})" /></svg>${shapeTextHTML}</div>`;
            } else if (el.shapeType === 'elbow') {
              const halfW = el.width / 2;
              const d = `M 0 0 L ${halfW} 0 L ${halfW} ${el.height} L ${el.width} ${el.height}`;
              innerContent = `<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${el.id}" width="100%" height="100%" style="overflow: visible; pointer-events: none; ${getExportSvgShadowCSS(rawEl.shadow)}"><path d="${d}" fill="none" stroke="${rawEl.stroke?.color || getAdaptedBorderColor(el.borderColor)}" stroke-width="${rawEl.stroke?.width ?? el.borderWidth}" stroke-dasharray="${getSvgStrokeDasharray(rawEl.stroke?.style)}" /></svg>${shapeTextHTML}</div>`;
            } else {
              const pts = (SHAPE_POLYGONS as any)[el.shapeType] || SHAPE_POLYGONS.triangle;
              const svgFill = getExportSvgFill(rawEl.fill, el.id, el.backgroundColor);
              innerContent = `<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${el.id}" width="100%" height="100%" preserveAspectRatio="none" style="overflow: visible; pointer-events: none; ${getExportSvgShadowCSS(rawEl.shadow)}">${svgFill.defs}<polygon points="${pts}" fill="${svgFill.fillValue}" stroke="${rawEl.stroke?.color || getAdaptedBorderColor(el.borderColor)}" stroke-width="${rawEl.stroke?.width ?? el.borderWidth}" stroke-dasharray="${getSvgStrokeDasharray(rawEl.stroke?.style)}" vector-effect="non-scaling-stroke" /></svg>${shapeTextHTML}</div>`;
            }
            break;
          }
        }
        innerContent = `<div style="width: 100%; height: 100%; transition: opacity 0.3s; ${innerVisibilityStyle}">${innerContent}</div>`;
        return `<div id="el-wrapper-${el.id}" ${wrapperOnClick} class="${isChild ? '' : 'draggable-element'} ${el.type === 'button' ? 'is-button' : ''} ${el.isDisabled ? 'disabled' : ''} ${isInteractiveHidden ? 'is-hidden' : ''}" data-id="${el.id}" style="${baseStyle} cursor: grab; overflow: visible;">${innerContent}${expandBtnHTML}</div>`;
      };

      const svgPaths = vConnections.map(conn => {
        const fromEl = vElements.find(el => el.id === conn.fromId);
        const toEl = vElements.find(el => el.id === conn.toId);
        const isHidden = hiddenConnections.has(conn.id) || (fromEl && !fromEl.visible) || (toEl && !toEl.visible);
        const safeLabel = conn.label ? escapeHtml(conn.label) : '';
        
        const connFontFamily = conn.fontFamily ? ` font-family="${conn.fontFamily.replace(/"/g, '&quot;')}"` : '';
        const connFontSize = conn.fontSize || 14;
        const connStroke = getConnectionStroke(conn);
        const connArrow = getConnectionArrow(conn);
        const connColor = conn.color || 'var(--text-primary)';
        const connLineColor = connStroke.color;
        const connStrokeWidth = connStroke.width;
        const connDasharray = getConnectionDasharray(connStroke.style, connStroke.width);
        const markerStartId = `arrow-start-${conn.id}`;
        const markerEndId = `arrow-end-${conn.id}`;
        const markerStartAttr = connArrow.start !== 'none' ? `marker-start="url(#${markerStartId})"` : '';
        const markerEndAttr = connArrow.end !== 'none' ? `marker-end="url(#${markerEndId})"` : '';
        const dashAttr = connDasharray ? `stroke-dasharray="${connDasharray}"` : '';
        const markerHTML = (type: string, id: string, orient: string) => {
          if (type === 'circle') {
            return `<marker id="${id}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="${connArrow.size}" markerHeight="${connArrow.size}" orient="${orient}"><circle cx="5" cy="5" r="3.2" fill="${connLineColor}" /></marker>`;
          }
          if (type === 'diamond') {
            return `<marker id="${id}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="${connArrow.size}" markerHeight="${connArrow.size}" orient="${orient}"><path d="M 5 0.8 L 9.2 5 L 5 9.2 L 0.8 5 Z" fill="${connLineColor}" /></marker>`;
          }
          const d = type === 'triangle' ? 'M 1 1 L 9 5 L 1 9 Z' : 'M 0 1.5 L 10 5 L 0 8.5 Z';
          return `<marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="${connArrow.size}" markerHeight="${connArrow.size}" orient="${orient}"><path d="${d}" fill="${connLineColor}" /></marker>`;
        };
        const defsHTML = `<defs>${connArrow.start !== 'none' ? markerHTML(connArrow.start, markerStartId, 'auto-start-reverse') : ''}${connArrow.end !== 'none' ? markerHTML(connArrow.end, markerEndId, 'auto') : ''}</defs>`;

        const labelHTML = safeLabel ? (
          conn.labelAlignment === 'follow'
            ? (conn.reverseLabelDirection
                ? `<path id="conn-text-${conn.id}" fill="none" stroke="none" pointer-events="none" /><text fill="${connColor}" font-size="${connFontSize}"${connFontFamily} dy="-5" pointer-events="none" font-weight="bold"><textPath href="#conn-text-${conn.id}" startOffset="50%" text-anchor="middle">${safeLabel}</textPath></text>`
                : `<text fill="${connColor}" font-size="${connFontSize}"${connFontFamily} dy="-5" pointer-events="none" font-weight="bold"><textPath href="#conn-${conn.id}" startOffset="50%" text-anchor="middle">${safeLabel}</textPath></text>`
              )
            : `<foreignObject id="conn-label-${conn.id}" x="0" y="0" width="400" height="40" pointer-events="none"><div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; pointer-events: none;"><span style="background: var(--bg-canvas); padding: 3px 10px; border-radius: 100px; font-size: ${connFontSize}px; color: ${connColor}; font-weight: bold; white-space: nowrap; border: 1px solid var(--border-color); box-shadow: 0 2px 8px rgba(0,0,0,0.15);${conn.fontFamily ? ` font-family: ${conn.fontFamily};` : ''}">${safeLabel}</span></div></foreignObject>`
        ) : '';
        return `<g id="conn-group-${conn.id}" class="connection-group ${isHidden ? 'is-hidden' : ''}" data-id="${conn.id}" data-from="${conn.fromId}" data-to="${conn.toId}" data-label="${escapeHtml(conn.label || '')}" data-align="${conn.labelAlignment || 'horizontal'}" style="cursor: pointer; transition: opacity 0.4s ease; opacity: 0;">${defsHTML}<path id="conn-${conn.id}" fill="none" stroke="${connLineColor}" stroke-width="${connStrokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${dashAttr} data-line-type="${connStroke.lineType}" ${markerStartAttr} ${markerEndAttr} /><path id="conn-pulse-${conn.id}" class="flow-pulse-path" fill="none" stroke="${connLineColor}" stroke-width="${Math.max(2, connStrokeWidth)}" stroke-linecap="round" /><path id="conn-hit-${conn.id}" stroke="transparent" stroke-width="${Math.max(20, connStrokeWidth + 16)}" fill="none" />${labelHTML}</g>`;
      }).join('\n');

      const brushPaths = vBrushStrokes.map(s => {
        const isHidden = s.attachedNodeId && (hiddenNodes.has(s.attachedNodeId) || elementsMap.get(s.attachedNodeId)?.visible === false);
        const styleAttr = isHidden ? 'style="opacity: 0; pointer-events: none; transition: opacity 0.4s ease;"' : 'style="transition: opacity 0.4s ease;"';
        const ptsAttr = s.points.map(p => `${p.x},${p.y}`).join(' ');
        return `<path d="${s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}" data-pts="${ptsAttr}" fill="none" stroke="${s.color}" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round" pointer-events="none" ${s.attachedNodeId ? `data-attached-node-id="${s.attachedNodeId}"` : ''} ${styleAttr} />`;
      }).join('\n');

      const rootElements = vElements.filter(el => !el.parentId).map(el => buildElementHTML(el)).join('\n');

      return { rootElements, svgPaths, brushPaths, hiddenNodes: Array.from(hiddenNodes), hiddenConnections: Array.from(hiddenConnections) };
    };

    const renderedVariantsData = allVariants.map(v => {
      const rendered = renderVariantHTMLData(v.elements, v.connections, v.brushStrokes);
      return {
        id: v.id,
        name: v.name,
        rootElements: rendered.rootElements,
        svgPaths: rendered.svgPaths,
        brushPaths: rendered.brushPaths,
        elements: v.elements,
        connections: v.connections,
        brushStrokes: v.brushStrokes,
        guides: v.guides,
        hiddenNodes: rendered.hiddenNodes,
        hiddenConnections: rendered.hiddenConnections
      };
    });

    const activeRendered = renderedVariantsData.find(rv => rv.id === activeVariantId) || renderedVariantsData[0];
    const scriptJson = (value: unknown) => JSON.stringify(value)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');

    return `<!doctype html>
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${fontLinkTags}
      <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @font-face {
          font-family: 'Google Sans Display';
          src: url('https://fonts.gstatic.com/s/productsans/v5/HYvgU2fE2nRJvZ5JFAumwegdm0LZdjqr5-oayXSOefg.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Google Sans Text';
          src: url('https://fonts.gstatic.com/s/productsans/v5/HYvgU2fE2nRJvZ5JFAumwegdm0LZdjqr5-oayXSOefg.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Google Sans Flex';
          src: url('https://fonts.gstatic.com/s/productsans/v5/HYvgU2fE2nRJvZ5JFAumwegdm0LZdjqr5-oayXSOefg.woff2') format('woff2');
        }
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
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; transition: background 0.2s; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }
        * { scrollbar-width: thin; scrollbar-color: var(--border-color) transparent; }
        .variant-dropdown-container {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 10000;
          font-family: inherit;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        body.presentation-mode .variant-dropdown-container {
          opacity: 0;
          pointer-events: none;
          transform: translateY(-20px);
        }
        .variant-dropdown-trigger {
          background: var(--bg-toolbar);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .variant-dropdown-trigger:hover {
          background: var(--btn-hover-bg);
          border-color: var(--text-secondary);
        }
        .dropdown-chevron {
          transition: transform 0.25s ease;
        }
        .variant-dropdown-container.open .dropdown-chevron {
          transform: rotate(180deg);
        }
        .variant-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: var(--bg-toolbar);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 180px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: top left;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .variant-dropdown-container.open .variant-dropdown-menu {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .variant-menu-item {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .variant-menu-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        body.light-theme .variant-menu-item:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        .variant-menu-item.active {
          background: #3f51b5;
          color: #ffffff;
          font-weight: 600;
        }
        body.presentation-mode #interactive-content { transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); }
        .draggable-element { transition: transform 0.05s linear; }
        .notification-toast { position: fixed; top: 76px; right: 20px; max-width: min(420px, calc(100vw - 40px)); background: var(--bg-toolbar); color: var(--text-primary); padding: 14px 20px; border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,0.6); z-index: 10000; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform: translateX(120%); opacity: 0; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; pointer-events: none; }
        .notification-toast.show { transform: translateX(0); opacity: 1; }
        .zoom-controls { position: fixed; bottom: 20px; right: 20px; background: var(--bg-toolbar); padding: 4px; padding-left: 12px; border-radius: 20px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; color: var(--text-primary); z-index: 1000; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .html-context-menu { position: fixed; display: none; min-width: 140px; padding: 6px; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 12px 32px rgba(0,0,0,0.55); z-index: 10001; }
        .html-context-menu.open { display: block; }
        .html-context-menu button { width: 100%; display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: transparent; border: none; border-radius: 6px; color: var(--text-primary); font-size: 12px; font-weight: 600; cursor: pointer; text-align: left; }
        .html-context-menu button:hover { background: rgba(92,107,192,0.2); }
        .runtime-text-selected { outline: 1px solid #4caf50; outline-offset: 2px; }
        .runtime-text-content[contenteditable="true"] { outline: 1px solid #4caf50; background: rgba(0,0,0,0.18); cursor: text; pointer-events: auto; }
        .html-context-menu button.danger { color: #ef5350; }
        .html-context-menu button.danger:hover { background: rgba(239,83,80,0.14); }
        .btn-fit { background: #3f51b5; border: none; color: white; padding: 6px 14px; border-radius: 16px; cursor: pointer; font-size: 11px; font-weight: 700; transition: all 0.2s; white-space: nowrap; box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3); }
        .btn-fit:hover { background: #4c5fd7; transform: scale(1.05); }
        .brush-toolbar { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; background: var(--bg-toolbar); padding: 10px; borderRadius: 12px; border: 1px solid var(--border-color); z-index: 1000; box-shadow: 0 8px 24px rgba(0,0,0,0.5); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease; }
        .brush-toolbar.hidden-toolbar { transform: translateX(-50%) translateY(-100px); opacity: 0; pointer-events: none; }
        .btn-tool { background: var(--btn-bg); border: none; color: var(--text-primary); width: 38px; height: 38px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-tool:hover { background: var(--btn-hover-bg); }
        .btn-tool svg { width: 18px; height: 18px; }
        .btn-tool.primary { background: #4caf50; box-shadow: 0 0 12px rgba(76, 175, 80, 0.4); color: white; }
        .color-picker-btn { width: 38px; height: 38px; border: none; border-radius: 8px; padding: 0; cursor: pointer; overflow: hidden; background: none; }
        .notification-icon { background: #4caf50; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .theme-toggle-btn {
          position: fixed;
          top: 12px;
          right: 12px;
          background: var(--bg-toolbar);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 32px;
          height: 32px;
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
        .conn-btn-group {
          position: absolute;
          display: flex;
          gap: 4px;
          z-index: 100;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .show-btns .conn-btn-group { opacity: 1 !important; pointer-events: auto !important; }
        .conn-btn-group.top {
          top: -26px;
          left: 50%;
          transform: translateX(-50%) scale(var(--conn-btn-scale, 1));
          transform-origin: bottom center;
          flex-direction: row;
        }
        .conn-btn-group.bottom {
          bottom: -26px;
          left: 50%;
          transform: translateX(-50%) scale(var(--conn-btn-scale, 1));
          transform-origin: top center;
          flex-direction: row;
        }
        .conn-btn-group.left {
          left: -26px;
          top: 50%;
          transform: translateY(-50%) scale(var(--conn-btn-scale, 1));
          transform-origin: right center;
          flex-direction: column;
        }
        .conn-btn-group.right {
          right: -26px;
          top: 50%;
          transform: translateY(-50%) scale(var(--conn-btn-scale, 1));
          transform-origin: left center;
          flex-direction: column;
        }
        .conn-btn { 
          background: #3f51b5; 
          color: #fff; 
          border: 1.5px solid #1e1f2e; 
          padding: 4px 8px; 
          border-radius: 5px; 
          font-size: 10px; 
          font-weight: 700; 
          cursor: pointer; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.4); 
          transition: transform 0.15s ease, background-color 0.15s ease; 
          white-space: nowrap; 
          line-height: 1.2; 
        }
        .conn-btn:hover { background: #5c6bc0; transform: scale(1.08); }
        .conn-btn.active { background: #f44336; }
        .conn-btn.clicked-hidden { display: none !important; }
        .flow-reveal { animation: flowIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .flow-hide { animation: flowOut 0.25s cubic-bezier(0.4, 0, 0.6, 1) forwards; }
        @keyframes flowIn { from { opacity: 0; transform: var(--element-transform, rotate(0deg)) scale(0.85) translateY(12px); } to { opacity: 1; transform: var(--element-transform, rotate(0deg)) scale(1) translateY(0); } }
        @keyframes flowOut { from { opacity: 1; transform: var(--element-transform, rotate(0deg)) scale(1) translateY(0); } to { opacity: 0; transform: var(--element-transform, rotate(0deg)) scale(0.85) translateY(12px); } }
        .connection-group { transition: opacity 0.3s ease; }
        .is-hidden { opacity: 0 !important; pointer-events: none !important; }
        .wire-draw path:first-child { stroke-dasharray: var(--wire-len); stroke-dashoffset: var(--wire-len); animation: wireDraw 0.3s ease-out forwards; }
        .wire-undraw path:first-child { stroke-dasharray: var(--wire-len); stroke-dashoffset: 0; animation: wireUndraw 0.2s ease-in forwards; }
        @keyframes wireDraw { to { stroke-dashoffset: 0; } }
        @keyframes wireUndraw { to { stroke-dashoffset: var(--wire-len); } }
        #interactive-container.space-down, #interactive-container.space-down * { cursor: grab !important; }
        #interactive-container.panning, #interactive-container.panning * { cursor: grabbing !important; }
        #interactive-container.brush-mode, #interactive-container.brush-mode * { cursor: none !important; }
        .laser-cursor-none, .laser-cursor-none * {
          cursor: none !important;
        }
        .laser-pointer {
          width: 14px;
          height: 14px;
          background: radial-gradient(circle, #ffffff 20%, #ff1744 60%, rgba(255, 23, 68, 0) 100%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px #ff1744, 0 0 16px #ff1744, 0 0 32px #ff1744;
          position: fixed;
          pointer-events: none;
          z-index: 100001;
          display: none;
        }
        .brush-custom-cursor {
          position: fixed;
          pointer-events: none;
          z-index: 100002;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brush-custom-cursor-circle {
          border: 1px solid #ffffff;
          border-radius: 50%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          box-shadow: 0 0 0 1px #000000;
        }
        .flow-pulse-path {
          stroke-dasharray: 6 18;
          animation: flowPulse 1.2s linear infinite;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .flow-active .flow-pulse-path {
          opacity: 0.8;
        }
        @keyframes flowPulse {
          to {
            stroke-dashoffset: -24;
          }
        }
        #reset-layout:hover { background: #ff2a76 !important; transform: scale(1.05); }
        ${animationKeyframesCSS}
      </style>
      </head>
      <body>      <button class="theme-toggle-btn" id="autoplay-btn" onclick="toggleAutoplay()" title="Auto Play Flow" style="right: 92px; display: flex; align-items: center; justify-content: center; background: #4caf50;">
        <svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        <svg class="pause-icon" style="display:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>
      </button>
      <button class="theme-toggle-btn" id="autoplay-settings-btn" onclick="toggleAutoplaySettings()" title="Autoplay Settings" style="right: 132px; display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
 
      <!-- Autoplay Settings Panel -->
      <div id="autoplay-settings-panel" style="display: none; position: fixed; top: 50px; right: 132px; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; width: 220px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); z-index: 10000; font-family: inherit; font-size: 13px; color: var(--text-primary);">
        <div style="margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span>Autoplay Settings</span>
          <button onclick="toggleAutoplaySettings()" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 14px; font-weight: bold; padding: 0;">&times;</button>
        </div>
        <div style="margin-bottom: 10px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 600;">Reveal Mode</label>
          <div style="display: flex; gap: 8px;">
            <button id="mode-step-btn" onclick="setAutoplayMode('step')" style="flex: 1; padding: 6px; font-size: 11px; background: #3f51b5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Step-by-Step</button>
            <button id="mode-instant-btn" onclick="setAutoplayMode('instant')" style="flex: 1; padding: 6px; font-size: 11px; background: var(--btn-bg); color: var(--text-primary); border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Instant (All)</button>
          </div>
        </div>
        <div id="delay-settings-container" style="margin-bottom: 4px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 600;">Step Delay (seconds)</label>
          <input type="number" id="autoplay-delay-input" min="0.1" max="10.0" step="0.1" value="1.5" style="width: 100%; box-sizing: border-box; padding: 6px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-primary); outline: none; font-size: 13px;" />
        </div>
      </div>
      <button class="theme-toggle-btn" id="present-btn" onclick="startPresentation()" title="Present Slideshow" style="right: 52px; display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <button class="theme-toggle-btn" id="theme-toggle-btn" onclick="toggleTheme()" title="Toggle Theme">
        <svg class="sun-icon" style="display:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      </button>
      <!-- Variant Selector -->
      ${renderedVariantsData.length > 1 ? `
      <div class="variant-dropdown-container" id="variant-dropdown-container">
        <button class="variant-dropdown-trigger" onclick="toggleVariantDropdown(event)">
          <span id="active-variant-name">${escapeHtml(variants.find(v => v.id === activeVariantId)?.name || 'Variant 1')}</span>
          <svg class="dropdown-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="variant-dropdown-menu" id="variant-dropdown-menu">
          ${renderedVariantsData.map(rv => `
            <button class="variant-menu-item ${rv.id === activeVariantId ? 'active' : ''}" data-id="${rv.id}" onclick="switchVariant('${rv.id}'); toggleVariantDropdown(event)">
              ${escapeHtml(rv.name)}
            </button>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Variant Templates -->
      ${renderedVariantsData.map(rv => `
        <template id="template-elements-${rv.id}">${rv.rootElements}</template>
        <template id="template-connections-${rv.id}">${rv.svgPaths}</template>
        <template id="template-brush-${rv.id}">${rv.brushPaths}</template>
      `).join('\n')}

      <div id="interactive-container" oncontextmenu="return false;" style="position: relative; width: 100vw; height: 100vh; overflow: hidden; user-select: none; background-color: var(--bg-canvas); background-image: radial-gradient(circle, var(--grid-dot) 1px, transparent 1px);">
        <div id="interactive-content" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform-origin: 0 0;">
          <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: visible;">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#6c6d80" />
              </marker>
            </defs>
            <g id="connections-layer">${activeRendered.svgPaths}</g>
          </svg>
          <div id="elements-layer">${activeRendered.rootElements}</div>
           <svg id="canvas-svg-top" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000; overflow: visible;"><g id="edit-brush-layer" pointer-events="none">${activeRendered.brushPaths}</g><g id="brush-layer"></g></svg>
        </div>
      </div>
      <div id="html-context-menu" class="html-context-menu">
        <button id="ctx-add-text" type="button">Add Text</button>
        <button id="ctx-delete-text" class="danger" type="button" style="display:none;">Delete Text</button>
      </div>
      <div class="brush-toolbar hidden-toolbar">
        <button id="brush-toggle" class="btn-tool" title="Brush (B)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg></button>
        <button id="eraser-toggle" class="btn-tool" title="Eraser (E)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.9-9.9c1-1 2.5-1 3.4 0l4.3 4.3c1 1 1 2.5 0 3.4L10.5 21c-1 1-2.5 1-3.4 0Z"/><path d="m11 6 4 4"/></svg></button>
        <button id="brush-clear" class="btn-tool" title="Clear (X)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <button id="undo-btn" class="btn-tool" title="Undo (Ctrl/⌘+Z)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
        <button id="redo-btn" class="btn-tool" title="Redo (Ctrl/⌘+Y)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></button>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div style="display:flex; align-items:center; gap:6px; padding:0 4px;">
          <span style="font-size:11px; color:var(--text-secondary); user-select:none;">Size:</span>
          <input type="range" id="brush-width-slider" min="1" max="100" value="4" style="width:60px; cursor:pointer;" title="Brush Width">
          <span id="brush-width-val" style="font-size:11px; color:var(--text-secondary); min-width:14px; text-align:right;">4</span>
        </div>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div class="color-picker-btn"><input type="color" id="brush-color" value="#4caf50" style="width:150%;height:150%;margin:-25%;border:none;cursor:pointer;background:none;"></div>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div style="display:flex; align-items:center; gap:6px; padding:0 4px;" title="Text color">
          <span style="font-size:11px; color:var(--text-secondary); user-select:none;">Text:</span>
          <div class="color-picker-btn"><input type="color" id="runtime-text-color" value="#e0e0e0" style="width:150%;height:150%;margin:-25%;border:none;cursor:pointer;background:none;"></div>
        </div>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <button id="brush-hide" class="btn-tool" title="Hide Toolbar (H)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg></button>
      </div>
      <button id="brush-show-btn" class="btn-tool" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1001; display: flex; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 50%; width: 32px; height: 32px; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.5); cursor: pointer; color: var(--text-primary);" title="Show Toolbar (H)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div id="presentation-bar" style="display: none; position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 24px; padding: 8px 24px; align-items: center; gap: 20px; z-index: 10000; box-shadow: 0 12px 32px rgba(0,0,0,0.6); color: var(--text-primary);">
        <button class="conn-btn" id="prev-slide-btn" onclick="prevSlide()" tabindex="-1" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">&larr; Prev</button>
        <select id="slide-select" onchange="goToSlide(parseInt(this.value))" tabindex="-1" style="background: var(--input-bg); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 4px 8px; font-size: 13px; font-weight: 600; cursor: pointer; outline: none;"></select>
        <button class="conn-btn" id="next-slide-btn" onclick="nextSlide()" tabindex="-1" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">Next &rarr;</button>
        <div style="width: 1px; background: var(--border-color); height: 20px;"></div>
        <button class="conn-btn" id="notes-toggle-btn" onclick="toggleSpeakerNotes()" tabindex="-1" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">Notes</button>
        <button class="conn-btn" onclick="exitPresentation()" tabindex="-1" style="background: #ef5350; border-radius: 12px; padding: 6px 16px; border: none; font-size: 13px; cursor: pointer; color: #fff; font-weight: 600;">Exit</button>
      </div>
      <div id="speaker-notes-panel" style="display: none; position: fixed; right: 24px; bottom: 88px; width: min(360px, calc(100vw - 48px)); max-height: min(260px, calc(100vh - 140px)); overflow: auto; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.55); z-index: 10000; color: var(--text-primary);">
        <div style="padding: 10px 12px; border-bottom: 1px solid var(--border-color); font-size: 12px; font-weight: 700; display: flex; justify-content: space-between; align-items: center;"><span>Speaker Notes</span><button onclick="toggleSpeakerNotes(false)" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 16px;">&times;</button></div>
        <pre id="speaker-notes-text" style="white-space: pre-wrap; margin: 0; padding: 12px; font-family: inherit; font-size: 13px; line-height: 1.45; color: var(--text-secondary);"></pre>
      </div>
      <div class="zoom-controls"><span id="zoom-percent" style="font-weight:700; min-width: 36px; text-align: center; font-size: 12px;">100%</span><button class="btn-fit" id="zoom-fit" style="margin-right: 5px;" title="Fit in view (Ctrl/⌘+0)">Fit</button><button class="btn-fit" id="reset-layout" style="background: #e91e63; box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);">Reset</button></div>
      <div id="notification-toast" class="notification-toast"><div class="notification-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span id="notification-text"></span></div>
      
      <!-- Exported Laser Pointer Elements -->
      <div id="laser-pointer-el" class="laser-pointer"></div>
      <svg id="laser-trail-svg" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 100000; overflow: visible; display: none;"></svg>

      <!-- Exported Custom Brush Cursor Element -->
      <div id="brush-cursor-el" class="brush-custom-cursor" style="display: none; left: -100px; top: -100px;">
        <div id="brush-cursor-circle" class="brush-custom-cursor-circle"></div>
      </div>
      <script>
        (function() {
          window.toggleVariantDropdown = (event) => {
            if (event) event.stopPropagation();
            const container = document.getElementById('variant-dropdown-container');
            if (container) {
              container.classList.toggle('open');
            }
          };
          document.addEventListener('click', (e) => {
            const container = document.getElementById('variant-dropdown-container');
            if (container && !container.contains(e.target)) {
              container.classList.remove('open');
            }
          });

          window.toggleTheme = () => {
            const isLight = document.body.classList.toggle('light-theme');
            try {
              localStorage.setItem('theme', isLight ? 'light' : 'dark');
            } catch (e) {}
            updateThemeIcons(isLight);
            updateDefaultRuntimeTextColors();
          };
          function updateThemeIcons(isLight) {
            const sunIcon = document.querySelector('.sun-icon');
            const moonIcon = document.querySelector('.moon-icon');
            if (sunIcon) sunIcon.style.display = isLight ? 'block' : 'none';
            if (moonIcon) moonIcon.style.display = isLight ? 'none' : 'block';
          }
          let savedTheme = '${theme}';
          try {
            savedTheme = localStorage.getItem('theme') || '${theme}';
          } catch (e) {}
          if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            updateThemeIcons(true);
          } else {
            updateThemeIcons(false);
          }

          const container = document.getElementById('interactive-container');
          const content = document.getElementById('interactive-content');
          const brushLayer = document.getElementById('brush-layer');
          const variantsData = ${scriptJson(renderedVariantsData.reduce((acc, rv) => { acc[rv.id] = { elements: rv.elements, connections: rv.connections, hiddenNodes: rv.hiddenNodes, hiddenConnections: rv.hiddenConnections }; return acc; }, {} as any))};
          let activeVariantId = '${activeVariantId}';
          let elements = ${scriptJson(activeRendered.elements)};
          let connections = ${scriptJson(activeRendered.connections)};
          let originalElements = JSON.parse(JSON.stringify(elements));
          let originalEditBrushHTML = document.getElementById('edit-brush-layer') ? document.getElementById('edit-brush-layer').innerHTML : '';
          let hiddenNodes = ${scriptJson(activeRendered.hiddenNodes)};
          let hiddenConnections = ${scriptJson(activeRendered.hiddenConnections)};
          let scale = 1, pan = { x: 0, y: 0 }, isBrushMode = false, isSpaceDown = false, isPanning = false, currentStroke = null, activeDrag = null, startDrag = { x: 0, y: 0, ex: 0, ey: 0 }, startPan = { x: 0, y: 0, px: 0, py: 0 }, brushTool = 'draw', isErasing = false, lastEraserPos = null, isAutoplayActive = false, autoplayInterval = null, autoplayMode = 'step', lastRightClickReset = { id: null, time: 0 }, userInteracted = false, activeRuntimeTextId = null, contextMenuRuntimeTextId = null, nextRuntimeTextColor = getDefaultRuntimeTextColor(), nextRuntimeTextUsesThemeColor = true;
          let isLaserActive = false, laserPos = { x: -100, y: -100 }, laserTrail = [];

          const brushCursorEl = document.getElementById('brush-cursor-el');
          const brushCursorCircle = document.getElementById('brush-cursor-circle');

          function updateBrushCursor(e) {
            if (!brushCursorEl) return;
            if (isBrushMode && !isSpaceDown) {
              brushCursorEl.style.display = 'flex';
              if (e) {
                brushCursorEl.style.left = e.clientX + 'px';
                brushCursorEl.style.top = e.clientY + 'px';
              }
              const currentWidth = parseFloat(document.getElementById('brush-width-slider')?.value || '4');
              const size = currentWidth * scale;
              if (brushCursorCircle) {
                brushCursorCircle.style.width = size + 'px';
                brushCursorCircle.style.height = size + 'px';
              }
            } else {
              brushCursorEl.style.display = 'none';
            }
          }

          function getDistanceToSegment(p, a, b) {
            const l2 = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
            if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
            let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            const projX = a.x + t * (b.x - a.x);
            const projY = a.y + t * (b.y - a.y);
            return Math.hypot(p.x - projX, p.y - projY);
          }

          function getElementCanvasBounds(el) {
            if (el && el.parentId) {
              const parent = elements.find(parentEl => parentEl.id === el.parentId);
              if (parent) {
                const parentBounds = getElementCanvasBounds(parent);
                if (el.fillParent) {
                  return {
                    x: parentBounds.x + 16,
                    y: parentBounds.y + 45 + 16,
                    width: Math.max(1, parentBounds.width - 32),
                    height: Math.max(1, parentBounds.height - 45 - 32)
                  };
                }
                return {
                  x: parentBounds.x + 16 + el.x,
                  y: parentBounds.y + 45 + 16 + el.y,
                  width: el.width,
                  height: el.height
                };
              }
            }
            return { x: el.x, y: el.y, width: el.width, height: el.height };
          }

          function getDescendantElementIds(parentId) {
            const ids = [];
            const queue = [parentId];
            while (queue.length) {
              const currentId = queue.shift();
              elements.forEach(el => {
                if (el.parentId === currentId) {
                  ids.push(el.id);
                  queue.push(el.id);
                }
              });
            }
            return ids;
          }

          function translateAttachedBrushPaths(id, dx, dy) {
            const targetIds = [id, ...getDescendantElementIds(id)];
            targetIds.forEach(targetId => {
              document.querySelectorAll('path[data-attached-node-id="' + targetId + '"]').forEach(path => {
                translateBrushPath(path, dx, dy);
              });
            });
          }

          function brushPtsToD(ptsStr) {
            const pts = (ptsStr || '').trim().split(/\\s+/).filter(Boolean);
            if (!pts.length) return '';
            return pts.map((pt, idx) => {
              const coords = pt.split(',');
              return (idx === 0 ? 'M ' : 'L ') + coords[0] + ' ' + coords[1];
            }).join(' ');
          }

          function translateBrushPath(path, dx, dy) {
            const ptsSource = path.dataset.pts || path.getAttribute('data-pts') || '';
            if (ptsSource) {
              const updatedPts = ptsSource.trim().split(/\\s+/).map(pt => {
                const coords = pt.split(',');
                const px = parseFloat(coords[0]);
                const py = parseFloat(coords[1]);
                if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
                return (px + dx) + ',' + (py + dy);
              }).filter(Boolean).join(' ');
              if (updatedPts) {
                path.dataset.pts = updatedPts;
                path.setAttribute('data-pts', updatedPts);
                path.setAttribute('d', brushPtsToD(updatedPts));
              }
              return;
            }

            const dAttr = path.getAttribute('d') || '';
            const updatedD = dAttr.replace(/([ML])\\s*(-?\\d+(?:\\.\\d+)?)\\s*,?\\s*(-?\\d+(?:\\.\\d+)?)/gi, function(_, cmd, xVal, yVal) {
              const px = parseFloat(xVal);
              const py = parseFloat(yVal);
              if (!Number.isFinite(px) || !Number.isFinite(py)) return '';
              return cmd.toUpperCase() + ' ' + (px + dx) + ' ' + (py + dy);
            });
            if (updatedD.trim()) {
              path.setAttribute('d', updatedD);
            }
          }

          function eraseBrushStrokesAt(currentPos, lastPos, radius) {
            const paths = Array.from(document.querySelectorAll('#edit-brush-layer path, #brush-layer path'));
            paths.forEach(path => {
              const ptsStr = path.dataset.pts || path.getAttribute('data-pts') || path.getAttribute('d')?.replace(/[ML]/g, '').trim();
              if (!ptsStr) return;
              
              const pts = ptsStr.split(/[,\\s]+/).map(parseFloat);
              const points = [];
              for (let i = 0; i < pts.length; i += 2) {
                if (!isNaN(pts[i]) && !isNaN(pts[i+1])) {
                  points.push({ x: pts[i], y: pts[i+1] });
                }
              }

              let changed = false;
              let currentPoints = [];
              const newSubPaths = [];
              const strokeWidth = parseFloat(path.getAttribute('stroke-width') || '4');

              points.forEach(p => {
                const dist = lastPos 
                  ? getDistanceToSegment(p, lastPos, currentPos)
                  : Math.hypot(p.x - currentPos.x, p.y - currentPos.y);
                
                const threshold = radius + strokeWidth / 2;
                if (dist <= threshold) {
                  if (currentPoints.length > 1) {
                    newSubPaths.push(currentPoints);
                  }
                  currentPoints = [];
                  changed = true;
                } else {
                  currentPoints.push(p);
                }
              });

              if (currentPoints.length > 1) {
                newSubPaths.push(currentPoints);
              }

              if (changed) {
                const parent = path.parentNode;
                newSubPaths.forEach(subPts => {
                  const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  newPath.setAttribute('fill', 'none');
                  newPath.setAttribute('stroke', path.getAttribute('stroke'));
                  newPath.setAttribute('stroke-width', path.getAttribute('stroke-width'));
                  newPath.setAttribute('stroke-linecap', 'round');
                  newPath.setAttribute('stroke-linejoin', 'round');
                  const dVal = subPts.map((pt, idx) => (idx === 0 ? 'M ' : 'L ') + pt.x + ' ' + pt.y).join(' ');
                  newPath.setAttribute('d', dVal);
                  newPath.dataset.pts = subPts.map(pt => pt.x + ',' + pt.y).join(' ');
                  newPath.setAttribute('data-pts', newPath.dataset.pts);
                  
                  const attachedNodeId = path.dataset.attachedNodeId || path.getAttribute('data-attached-node-id');
                  if (attachedNodeId) {
                    newPath.setAttribute('data-attached-node-id', attachedNodeId);
                    newPath.dataset.attachedNodeId = attachedNodeId;
                    newPath.style.transition = 'opacity 0.4s ease';
                    newPath.style.opacity = path.style.opacity;
                  }
                  parent.appendChild(newPath);
                });
                path.remove();
              }
            });
          }
          
          let history = [], redoStack = [];
          function saveHistory() { history.push(brushLayer.innerHTML); redoStack = []; if(history.length > 50) history.shift(); }
          function undo() { if(!history.length) return; redoStack.push(brushLayer.innerHTML); const last = history.pop(); brushLayer.innerHTML = last; showNotification('Undo'); }
          function redo() { if(!redoStack.length) return; history.push(brushLayer.innerHTML); const next = redoStack.pop(); brushLayer.innerHTML = next; showNotification('Redo'); }

          function updateAllElements() {
            elements.forEach(el => {
              const wrapper = document.getElementById('el-wrapper-' + el.id);
              if(wrapper) {
                const isFillParent = el.parentId && el.fillParent;
                wrapper.style.left = isFillParent ? '0px' : el.x + 'px';
                wrapper.style.top = isFillParent ? '0px' : el.y + 'px';
              }
            });
          }

          function resetElementPosition(id) {
            const current = elements.find(el => el.id === id);
            const original = originalElements.find(el => el.id === id);
            const wrapper = document.getElementById('el-wrapper-' + id);
            if (!current || !original || !wrapper) return false;

            const dx = original.x - current.x;
            const dy = original.y - current.y;
            current.x = original.x;
            current.y = original.y;
            wrapper.style.left = original.x + 'px';
            wrapper.style.top = original.y + 'px';

            if (dx !== 0 || dy !== 0) {
              translateAttachedBrushPaths(id, dx, dy);
            }

            updateConnections();
            showNotification('Element position reset');
            return true;
          }

          window.showNotification = function(msg) {
            const toast = document.getElementById('notification-toast');
            document.getElementById('notification-text').innerText = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
          };

          const htmlContextMenu = document.getElementById('html-context-menu');
          let contextMenuCanvasPos = null;

          function hideHtmlContextMenu() {
            if (htmlContextMenu) htmlContextMenu.classList.remove('open');
            contextMenuCanvasPos = null;
            contextMenuRuntimeTextId = null;
          }

          function showHtmlContextMenu(clientX, clientY, canvasX, canvasY, runtimeTextId) {
            if (!htmlContextMenu) return;
            contextMenuCanvasPos = { x: canvasX, y: canvasY };
            contextMenuRuntimeTextId = runtimeTextId || null;
            const deleteTextBtn = document.getElementById('ctx-delete-text');
            if (deleteTextBtn) deleteTextBtn.style.display = contextMenuRuntimeTextId ? 'flex' : 'none';
            htmlContextMenu.classList.add('open');
            const menuRect = htmlContextMenu.getBoundingClientRect();
            const left = Math.min(clientX, window.innerWidth - menuRect.width - 8);
            const top = Math.min(clientY, window.innerHeight - menuRect.height - 8);
            htmlContextMenu.style.left = Math.max(8, left) + 'px';
            htmlContextMenu.style.top = Math.max(8, top) + 'px';
          }

          function cssColorToHex(color) {
            if (!color) return '#ffffff';
            if (color[0] === '#') {
              if (color.length === 4) return '#' + color.slice(1).split('').map(ch => ch + ch).join('');
              return color.slice(0, 7);
            }
            const match = String(color).match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
            if (!match) return getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#ffffff';
            return '#' + [match[1], match[2], match[3]].map(value => {
              return Math.max(0, Math.min(255, parseInt(value, 10))).toString(16).padStart(2, '0');
            }).join('');
          }

          function getDefaultRuntimeTextColor() {
            return document.body.classList.contains('light-theme') ? '#111827' : '#ffffff';
          }

          function syncRuntimeTextColorInput(color) {
            const input = document.getElementById('runtime-text-color');
            if (input) input.value = cssColorToHex(color);
          }

          function selectRuntimeTextElement(id) {
            activeRuntimeTextId = id;
            document.querySelectorAll('.runtime-text-selected').forEach(el => el.classList.remove('runtime-text-selected'));
            const wrapper = document.getElementById('el-wrapper-' + id);
            const elData = elements.find(el => el.id === id);
            if (wrapper) wrapper.classList.add('runtime-text-selected');
            if (elData && elData.text) syncRuntimeTextColorInput(elData.text.color);
          }

          function clearRuntimeTextSelection() {
            activeRuntimeTextId = null;
            document.querySelectorAll('.runtime-text-selected').forEach(el => el.classList.remove('runtime-text-selected'));
            syncRuntimeTextColorInput(nextRuntimeTextColor);
          }

          function applyRuntimeTextColor(color) {
            nextRuntimeTextColor = color;
            nextRuntimeTextUsesThemeColor = false;
            if (!activeRuntimeTextId) return;
            const elData = elements.find(el => el.id === activeRuntimeTextId);
            const wrapper = document.getElementById('el-wrapper-' + activeRuntimeTextId);
            const text = wrapper ? wrapper.querySelector('.runtime-text-content') : null;
            if (elData && elData.text) {
              elData.text.color = color;
              elData.runtimeTextUsesThemeColor = false;
              const original = originalElements.find(el => el.id === elData.id);
              if (original) {
                original.text = JSON.parse(JSON.stringify(elData.text));
                original.runtimeTextUsesThemeColor = false;
              }
            }
            if (text) text.style.color = color;
          }

          function updateDefaultRuntimeTextColors() {
            const defaultColor = getDefaultRuntimeTextColor();
            nextRuntimeTextColor = defaultColor;
            nextRuntimeTextUsesThemeColor = true;
            elements.forEach(el => {
              if (el.type !== 'text' || !el.text || !el.id?.startsWith('runtime-text-')) return;
              if (el.runtimeTextUsesThemeColor === false) return;
              el.text.color = defaultColor;
              const wrapper = document.getElementById('el-wrapper-' + el.id);
              const text = wrapper ? wrapper.querySelector('.runtime-text-content') : null;
              if (text) text.style.color = defaultColor;
              const original = originalElements.find(item => item.id === el.id);
              if (original) {
                original.text = JSON.parse(JSON.stringify(el.text));
                original.runtimeTextUsesThemeColor = true;
              }
            });
            syncRuntimeTextColorInput(activeRuntimeTextId ? (elements.find(el => el.id === activeRuntimeTextId)?.text?.color || defaultColor) : defaultColor);
          }

          function deleteRuntimeTextElement(id) {
            if (!id) return;
            const wrapper = document.getElementById('el-wrapper-' + id);
            if (wrapper) wrapper.remove();
            elements = elements.filter(el => el.id !== id);
            originalElements = originalElements.filter(el => el.id !== id);
            document.querySelectorAll('path[data-attached-node-id="' + id + '"]').forEach(path => path.remove());
            if (activeRuntimeTextId === id) clearRuntimeTextSelection();
            showNotification('Text deleted');
          }

          function autoSizeRuntimeTextElement(elData, wrapper, shell, text) {
            if (!elData || !wrapper || !shell || !text) return;
            const padding = elData.text.padding || { top: 10, right: 14, bottom: 10, left: 14 };
            const border = elData.stroke?.width ?? 0;
            const minHeight = 64;
            const measuredWidth = Math.max(180, Number(elData.width) || 180);
            wrapper.style.width = measuredWidth + 'px';
            const neededHeight = Math.ceil(Math.max(minHeight, text.scrollHeight + padding.top + padding.bottom + border * 2 + 4));
            wrapper.style.height = neededHeight + 'px';
            elData.width = measuredWidth;
            elData.height = neededHeight;
            shell.style.height = '100%';
          }
          syncRuntimeTextColorInput(nextRuntimeTextColor);

          function createRuntimeTextElement(x, y) {
            const maxZ = elements.reduce((value, el) => Math.max(value, Number(el.zIndex || 0)), 0);
            const elData = {
              id: 'runtime-text-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
              type: 'text',
              name: '',
              x,
              y,
              width: 180,
              height: 64,
              rotation: 0,
              opacity: 1,
              visible: true,
              disabled: false,
              pinned: false,
              parentId: null,
              zIndex: maxZ + 1,
              fill: { type: 'none', color: 'transparent' },
              stroke: { width: 1, color: 'var(--border-color)', style: 'solid', radius: 4 },
              shadow: { enabled: true, color: 'rgba(0,0,0,0.3)', blur: 8, offsetX: 0, offsetY: 4, spread: 0 },
              runtimeTextUsesThemeColor: nextRuntimeTextUsesThemeColor,
              text: {
                content: 'Workflow Text',
                fontSize: 16,
                fontFamily: "'Lexend Deca', 'Google Sans Text', sans-serif",
                fontWeight: 400,
                fontStyle: 'normal',
                textDecoration: 'none',
                color: nextRuntimeTextColor || getDefaultRuntimeTextColor(),
                align: 'center',
                verticalAlign: 'middle',
                lineHeight: 1.5,
                letterSpacing: 0,
                padding: { top: 10, right: 14, bottom: 10, left: 14 }
              }
            };
            elements.push(elData);
            originalElements.push(JSON.parse(JSON.stringify(elData)));
            appendRuntimeTextElement(elData);
            selectRuntimeTextElement(elData.id);
            showNotification('Text added');
          }

          function appendRuntimeTextElement(elData) {
            const layer = document.getElementById('elements-layer');
            if (!layer) return;

            const wrapper = document.createElement('div');
            wrapper.id = 'el-wrapper-' + elData.id;
            wrapper.className = 'draggable-element';
            wrapper.dataset.id = elData.id;
            wrapper.style.position = 'absolute';
            wrapper.style.left = elData.x + 'px';
            wrapper.style.top = elData.y + 'px';
            wrapper.style.width = elData.width + 'px';
            wrapper.style.height = elData.height + 'px';
            wrapper.style.color = 'var(--text-primary)';
            wrapper.style.transform = 'rotate(0deg)';
            wrapper.style.transformOrigin = 'center center';
            wrapper.style.zIndex = String(elData.zIndex || 2);
            wrapper.style.opacity = '1';
            wrapper.style.borderRadius = (elData.stroke?.radius ?? 4) + 'px';
            wrapper.style.boxShadow = elData.shadow?.enabled ? (elData.shadow.offsetX + 'px ' + elData.shadow.offsetY + 'px ' + elData.shadow.blur + 'px ' + (elData.shadow.spread || 0) + 'px ' + elData.shadow.color) : '';
            wrapper.style.cursor = 'grab';
            wrapper.style.overflow = 'visible';

            const shell = document.createElement('div');
            shell.style.width = '100%';
            shell.style.height = '100%';
            shell.style.background = elData.fill?.type === 'solid' ? (elData.fill.color || 'transparent') : 'transparent';
            shell.style.border = (elData.stroke?.width ?? 1) + 'px ' + (elData.stroke?.style || 'solid') + ' ' + (elData.stroke?.color || 'var(--border-color)');
            shell.style.borderRadius = (elData.stroke?.radius ?? 4) + 'px';
            shell.style.display = 'flex';
            shell.style.alignItems = elData.text.verticalAlign === 'top' ? 'flex-start' : elData.text.verticalAlign === 'bottom' ? 'flex-end' : 'center';
            shell.style.justifyContent = 'center';
            shell.style.padding = elData.text.padding.top + 'px ' + elData.text.padding.right + 'px ' + elData.text.padding.bottom + 'px ' + elData.text.padding.left + 'px';
            shell.style.boxSizing = 'border-box';
            shell.style.overflow = 'hidden';
            shell.style.pointerEvents = 'none';

            const text = document.createElement('div');
            text.className = 'runtime-text-content';
            text.dataset.runtimeTextContent = 'true';
            text.textContent = elData.text.content;
            text.style.width = '100%';
            text.style.textAlign = elData.text.align || 'center';
            text.style.wordBreak = 'break-word';
            text.style.fontSize = elData.text.fontSize + 'px';
            text.style.fontFamily = elData.text.fontFamily;
            text.style.fontWeight = String(elData.text.fontWeight);
            text.style.fontStyle = elData.text.fontStyle || 'normal';
            text.style.textDecoration = elData.text.textDecoration || 'none';
            text.style.lineHeight = String(elData.text.lineHeight);
            text.style.letterSpacing = elData.text.letterSpacing + 'px';
            text.style.color = elData.text.color;
            text.style.borderRadius = '4px';
            text.style.overflow = 'visible';

            shell.appendChild(text);
            wrapper.appendChild(shell);
            layer.appendChild(wrapper);
            autoSizeRuntimeTextElement(elData, wrapper, shell, text);

            wrapper.addEventListener('pointerdown', event => {
              selectRuntimeTextElement(elData.id);
            }, true);

            wrapper.addEventListener('dblclick', event => {
              event.stopPropagation();
              selectRuntimeTextElement(elData.id);
              text.contentEditable = 'true';
              shell.style.pointerEvents = 'auto';
              text.focus();
              const range = document.createRange();
              range.selectNodeContents(text);
              const selection = window.getSelection();
              if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
              }
            });

            text.addEventListener('blur', () => {
              text.contentEditable = 'false';
              shell.style.pointerEvents = 'none';
              elData.text.content = text.textContent || '';
              autoSizeRuntimeTextElement(elData, wrapper, shell, text);
              const original = originalElements.find(el => el.id === elData.id);
              if (original) {
                original.text = JSON.parse(JSON.stringify(elData.text));
                original.width = elData.width;
                original.height = elData.height;
              }
            });
            text.addEventListener('input', () => {
              elData.text.content = text.textContent || '';
              autoSizeRuntimeTextElement(elData, wrapper, shell, text);
            });
            text.addEventListener('keydown', event => {
              if (event.key === 'Escape') {
                text.blur();
              }
            });
          }

          document.getElementById('ctx-add-text')?.addEventListener('click', event => {
            event.stopPropagation();
            if (contextMenuCanvasPos) {
              createRuntimeTextElement(contextMenuCanvasPos.x, contextMenuCanvasPos.y);
            }
            hideHtmlContextMenu();
          });
          document.getElementById('ctx-delete-text')?.addEventListener('click', event => {
            event.stopPropagation();
            const id = contextMenuRuntimeTextId || activeRuntimeTextId;
            if (id) deleteRuntimeTextElement(id);
            hideHtmlContextMenu();
          });

          document.addEventListener('pointerdown', event => {
            if (event.button !== 2 && htmlContextMenu && !htmlContextMenu.contains(event.target)) {
              hideHtmlContextMenu();
            }
          }, true);

          function updateBrushToolClasses() {
            document.getElementById('brush-toggle').classList.toggle('primary', isBrushMode && brushTool === 'draw');
            const eraserBtn = document.getElementById('eraser-toggle');
            if (eraserBtn) eraserBtn.classList.toggle('primary', isBrushMode && brushTool === 'erase');
            container.classList.toggle('brush-mode', isBrushMode);
            updateBrushCursor();
          }

          const toggleBrush = () => {
            if (isBrushMode && brushTool === 'draw') {
              isBrushMode = false;
            } else {
              isBrushMode = true;
              brushTool = 'draw';
            }
            updateBrushToolClasses();
            showNotification(isBrushMode ? 'Brush mode enabled' : 'Brush mode disabled');
          };

          const toggleEraser = () => {
            if (isBrushMode && brushTool === 'erase') {
              isBrushMode = false;
            } else {
              isBrushMode = true;
              brushTool = 'erase';
            }
            updateBrushToolClasses();
            showNotification(isBrushMode ? 'Eraser mode enabled' : 'Eraser mode disabled');
          };

          const clearBrush = () => { saveHistory(); brushLayer.innerHTML = ''; showNotification('Drawings cleared'); };
          
          const toggleToolbarVisibility = () => {
            const toolbar = document.querySelector('.brush-toolbar');
            const showBtn = document.getElementById('brush-show-btn');
            if (toolbar && showBtn) {
              const isHidden = toolbar.classList.toggle('hidden-toolbar');
              showBtn.style.display = isHidden ? 'flex' : 'none';
              showNotification(isHidden ? 'Toolbar hidden (Press H to show)' : 'Toolbar shown');
            }
          };

          document.getElementById('brush-toggle').onclick = toggleBrush;
          const eraserToggle = document.getElementById('eraser-toggle');
          if (eraserToggle) eraserToggle.onclick = toggleEraser;
          document.getElementById('brush-clear').onclick = clearBrush;
          document.getElementById('undo-btn').onclick = undo;
          document.getElementById('redo-btn').onclick = redo;
          document.getElementById('brush-hide').onclick = toggleToolbarVisibility;
          document.getElementById('brush-show-btn').onclick = toggleToolbarVisibility;
          const runtimeTextColor = document.getElementById('runtime-text-color');
          if (runtimeTextColor) {
            runtimeTextColor.oninput = () => applyRuntimeTextColor(runtimeTextColor.value);
          }

          const resetBtn = document.getElementById('reset-layout');
          if (resetBtn) {
            resetBtn.onclick = () => {
              stopAutoplay();
              elements = JSON.parse(JSON.stringify(originalElements));
              updateAllElements();
              resetVisibilities();
              updateConnections();
              if (document.getElementById('edit-brush-layer')) {
                document.getElementById('edit-brush-layer').innerHTML = originalEditBrushHTML;
              }
              brushLayer.innerHTML = '';
              document.getElementById('zoom-fit').click();
              showNotification('Positions and state reset');
              setTimeout(animateInitialConnections, 200);
            };
          }
          
          const widthSlider = document.getElementById('brush-width-slider');
          const widthVal = document.getElementById('brush-width-val');
          if (widthSlider && widthVal) {
            widthSlider.oninput = () => {
              widthVal.innerText = widthSlider.value;
              updateBrushCursor();
            };
          }

          window.toggleAutoplay = () => {
            if (isAutoplayActive) {
              stopAutoplay();
            } else {
              startAutoplay();
            }
          };

          window.toggleAutoplaySettings = () => {
            const panel = document.getElementById('autoplay-settings-panel');
            if (panel) {
              const isHidden = panel.style.display === 'none';
              panel.style.display = isHidden ? 'block' : 'none';
            }
          };

          window.setAutoplayMode = (mode) => {
            autoplayMode = mode;
            const stepBtn = document.getElementById('mode-step-btn');
            const instBtn = document.getElementById('mode-instant-btn');
            const delayCont = document.getElementById('delay-settings-container');
            
            if (stepBtn && instBtn) {
              if (mode === 'step') {
                stepBtn.style.background = '#3f51b5';
                stepBtn.style.color = '#fff';
                instBtn.style.background = 'var(--btn-bg)';
                instBtn.style.color = 'var(--text-primary)';
                if (delayCont) delayCont.style.display = 'block';
              } else {
                instBtn.style.background = '#3f51b5';
                instBtn.style.color = '#fff';
                stepBtn.style.background = 'var(--btn-bg)';
                stepBtn.style.color = 'var(--text-primary)';
                if (delayCont) delayCont.style.display = 'none';
              }
            }
          };

          function startAutoplay() {
            if (isAutoplayActive) return;

            userInteracted = false;

            if (autoplayMode === 'instant') {
              playInstant();
              showNotification('Revealing all steps smoothly...');
              return;
            }

            isAutoplayActive = true;
            updateAutoplayUI();
            playNextStep();
          }

          function stopAutoplay() {
            isAutoplayActive = false;
            if (autoplayInterval) {
              clearTimeout(autoplayInterval);
              autoplayInterval = null;
            }
            updateAutoplayUI();
          }

          function isAutoplayOwnerVisible(owner) {
            if (!owner) return false;
            if (owner.classList.contains('is-hidden') || owner.classList.contains('disabled')) return false;
            if (owner.closest('.is-hidden')) return false;
            const style = window.getComputedStyle(owner);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.pointerEvents !== 'none';
          }

          function getAvailableAutoplayButtons() {
            return Array.from(document.querySelectorAll('.conn-btn-group .conn-btn:not(.active):not(.clicked-hidden)'))
              .filter(btn => {
                if (btn.disabled) return false;
                const owner = btn.closest('[id^="el-wrapper-"]');
                return isAutoplayOwnerVisible(owner);
              });
          }

          function resetAndRestartAutoplay() {
            if (userInteracted) return;
            elements = JSON.parse(JSON.stringify(originalElements));
            updateAllElements();
            resetVisibilities();
            updateConnections();
            if (document.getElementById('edit-brush-layer')) {
              document.getElementById('edit-brush-layer').innerHTML = originalEditBrushHTML;
            }
            brushLayer.innerHTML = '';
            setTimeout(() => {
              if (userInteracted) return;
              animateInitialConnections();
              setTimeout(() => {
                if (userInteracted) return;
                startAutoplay();
              }, 500);
            }, 200);
          }

          async function playInstant() {
            isAutoplayActive = true;
            updateAutoplayUI();

            let clickedAny = true;
            let iterations = 0;
            while (clickedAny && iterations < 500 && isAutoplayActive) {
              const availableBtns = getAvailableAutoplayButtons();

              if (availableBtns.length > 0) {
                availableBtns.forEach(btn => btn.click());
                iterations++;
                await new Promise(resolve => setTimeout(resolve, 150));
              } else {
                clickedAny = false;
              }
            }
            stopAutoplay();
            if (!userInteracted) {
              autoplayInterval = setTimeout(resetAndRestartAutoplay, 2000);
            }
          }

          function playNextStep() {
            if (!isAutoplayActive) return;

            const availableBtns = getAvailableAutoplayButtons();

            if (availableBtns.length > 0) {
              const btn = availableBtns[0];
              btn.click();
              
              const delayInput = document.getElementById('autoplay-delay-input');
              const val = delayInput ? parseFloat(delayInput.value) : 1.5;
              const delayMs = isNaN(val) || val <= 0 ? 1500 : val * 1000;
              
              autoplayInterval = setTimeout(playNextStep, delayMs);
            } else {
              stopAutoplay();
              if (!userInteracted) {
                autoplayInterval = setTimeout(resetAndRestartAutoplay, 2000);
              }
            }
          }

          function updateAutoplayUI() {
            const btn = document.getElementById('autoplay-btn');
            if (btn) {
              const playIcon = btn.querySelector('.play-icon');
              const pauseIcon = btn.querySelector('.pause-icon');
              if (isAutoplayActive) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                btn.style.background = '#ff9800';
              } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                btn.style.background = '#4caf50';
              }
            }
          }

          let slides = [];
          let currentSlideIndex = 0;
          let isPresenting = false;
          let playedAnimationIds = [];

          function getSlideAnimationSteps(slideId) {
            const slideAnimations = [];
            elements.forEach(el => {
              if (el.id === slideId || el.parentId === slideId) {
                (el.animations || []).forEach(anim => {
                  slideAnimations.push({ anim, elementId: el.id });
                });
              }
            });
            slideAnimations.sort((a, b) => (a.anim.order || 0) - (b.anim.order || 0));

            const steps = [];
            let currentStep = null;
            slideAnimations.forEach(({ anim }) => {
              if (anim.trigger === 'onClick' || anim.trigger === 'onEnter' || !currentStep) {
                currentStep = {
                  triggerAnimId: anim.id,
                  animations: [anim]
                };
                steps.push(currentStep);
              } else {
                currentStep.animations.push(anim);
              }
            });
            return steps;
          }

          function getAnimationCSSStyle(element, playedAnimationIds) {
            const animations = element.animations || [];
            if (animations.length === 0) return {};

            let activeAnim = null;
            const played = animations.filter(a => playedAnimationIds.includes(a.id));
            if (played.length > 0) {
              activeAnim = played[played.length - 1];
            }

            const hasEntrance = animations.some(a => a.type === 'entrance');
            const entrancePlayed = animations
              .filter(a => a.type === 'entrance')
              .every(a => playedAnimationIds.includes(a.id));

            const styles = {};
            if (hasEntrance && !entrancePlayed) {
              styles.opacity = '0';
              styles.pointerEvents = 'none';
            } else {
              styles.opacity = '1';
              styles.pointerEvents = 'auto';
            }

            if (activeAnim) {
              const isPlaying = playedAnimationIds.includes(activeAnim.id);
              
              if (isPlaying) {
                styles.animationName = activeAnim.effect;
                styles.animationDuration = activeAnim.duration + 'ms';
                styles.animationTimingFunction = activeAnim.easing || 'ease';
                styles.animationDelay = activeAnim.delay + 'ms';
                styles.animationFillMode = 'forwards';

                if (activeAnim.type === 'emphasis') {
                  styles.animationFillMode = 'none';
                }
              }

              if (playedAnimationIds.includes(activeAnim.id)) {
                if (activeAnim.type === 'exit') {
                  styles.opacity = '0';
                  styles.pointerEvents = 'none';
                } else if (activeAnim.type === 'entrance') {
                  styles.opacity = '1';
                }
              }
            }

            return styles;
          }

          function updateAnimationStyles() {
            if (!isPresenting) {
              elements.forEach(el => {
                const wrapper = document.getElementById('el-wrapper-' + el.id);
                if (!wrapper) return;
                wrapper.style.animationName = '';
                wrapper.style.animationDuration = '';
                wrapper.style.animationTimingFunction = '';
                wrapper.style.animationDelay = '';
                wrapper.style.animationFillMode = '';
                wrapper.style.opacity = '';
                wrapper.style.pointerEvents = '';
              });
              return;
            }

            elements.forEach(el => {
              const wrapper = document.getElementById('el-wrapper-' + el.id);
              if (!wrapper) return;
              const styles = getAnimationCSSStyle(el, playedAnimationIds);
              
              wrapper.style.animationName = '';
              wrapper.style.animationDuration = '';
              wrapper.style.animationTimingFunction = '';
              wrapper.style.animationDelay = '';
              wrapper.style.animationFillMode = '';
              
              Object.keys(styles).forEach(key => {
                wrapper.style[key] = styles[key];
              });
            });
          }

          function hasRemainingAnimationStep(slide) {
            if (!slide) return false;
            return getSlideAnimationSteps(slide.id).some(step =>
              !step.animations.every(anim => playedAnimationIds.includes(anim.id))
            );
          }

          function updateSpeakerNotes() {
            const currentSlide = slides[currentSlideIndex];
            const notesPanel = document.getElementById('speaker-notes-panel');
            const notesText = document.getElementById('speaker-notes-text');
            const notesToggle = document.getElementById('notes-toggle-btn');
            const notes = currentSlide && currentSlide.speakerNotes ? currentSlide.speakerNotes : '';
            if (notesText) notesText.textContent = notes || 'No notes for this slide.';
            if (notesToggle) notesToggle.style.opacity = notes ? '1' : '0.55';
            if (notesPanel && notesPanel.style.display !== 'none' && !notes) {
              notesPanel.style.display = 'none';
            }
          }

          window.toggleSpeakerNotes = function(force) {
            const panel = document.getElementById('speaker-notes-panel');
            if (!panel) return;
            updateSpeakerNotes();
            const shouldShow = typeof force === 'boolean' ? force : panel.style.display === 'none';
            panel.style.display = shouldShow ? 'block' : 'none';
          };

          function updatePresentationControls() {
            const currentSlide = slides[currentSlideIndex];
            const prevBtn = document.getElementById('prev-slide-btn');
            const nextBtn = document.getElementById('next-slide-btn');
            const selectEl = document.getElementById('slide-select');
            const prevDisabled = currentSlideIndex === 0;
            const nextDisabled = currentSlideIndex >= slides.length - 1 && !hasRemainingAnimationStep(currentSlide);

            if (prevBtn) {
              prevBtn.disabled = prevDisabled;
              prevBtn.style.opacity = prevDisabled ? '0.4' : '1';
            }
            if (nextBtn) {
              nextBtn.disabled = nextDisabled;
              nextBtn.style.opacity = nextDisabled ? '0.4' : '1';
            }
            if (selectEl) {
              selectEl.value = currentSlideIndex + '';
            }
            updateSpeakerNotes();
          }

          window.startPresentation = () => {
            slides = elements.filter(el => el.type === 'node' && el.isSlide !== false).sort((a, b) => a.x - b.x);
            if (slides.length === 0) {
              showNotification('No Node Containers found to present.');
              return;
            }
            isPresenting = true;
             document.getElementById('presentation-bar').style.display = 'flex';
             document.getElementById('present-btn').style.display = 'none';
             document.getElementById('theme-toggle-btn').style.display = 'none';
             document.getElementById('autoplay-btn').style.display = 'none';
             document.getElementById('autoplay-settings-btn').style.display = 'none';
             document.getElementById('autoplay-settings-panel').style.display = 'none';
            document.querySelector('.brush-toolbar').style.display = 'none';
            const showBtn = document.getElementById('brush-show-btn');
            if (showBtn) showBtn.style.display = 'none';
            document.querySelector('.zoom-controls').style.display = 'none';
            
            document.body.classList.add('presentation-mode');
            
            const selectEl = document.getElementById('slide-select');
            if (selectEl) {
              selectEl.innerHTML = slides.map((s, idx) => '<option value="' + idx + '">Slide ' + (idx + 1) + ': ' + (s.title || 'Slide ' + (idx + 1)) + '</option>').join('');
            }
            
            goToSlide(0);
          };

          window.exitPresentation = () => {
            isPresenting = false;
            playedAnimationIds = [];
            updateAnimationStyles();
             document.getElementById('presentation-bar').style.display = 'none';
             document.getElementById('present-btn').style.display = 'flex';
             document.getElementById('theme-toggle-btn').style.display = 'flex';
             document.getElementById('autoplay-btn').style.display = 'flex';
             document.getElementById('autoplay-settings-btn').style.display = 'flex';
            const notesPanel = document.getElementById('speaker-notes-panel');
            if (notesPanel) notesPanel.style.display = 'none';
            const toolbar = document.querySelector('.brush-toolbar');
            const showBtn = document.getElementById('brush-show-btn');
            const isHidden = toolbar.classList.contains('hidden-toolbar');
            if (toolbar) toolbar.style.display = '';
            if (showBtn) showBtn.style.display = isHidden ? 'flex' : 'none';
            document.querySelector('.zoom-controls').style.display = 'flex';
            
            document.body.classList.remove('presentation-mode');
            
            document.getElementById('zoom-fit').click();
          };

          window.switchVariant = (variantId) => {
            if (variantId === activeVariantId) return;

            stopAutoplay();

            document.querySelectorAll('.variant-menu-item').forEach(item => {
              item.classList.toggle('active', item.getAttribute('data-id') === variantId);
            });
            const activeNameSpan = document.getElementById('active-variant-name');
            if (activeNameSpan) {
              const activeItem = document.querySelector('.variant-menu-item[data-id="' + variantId + '"]');
              if (activeItem) {
                activeNameSpan.innerText = activeItem.innerText.trim();
              }
            }

            const elementsLayer = document.getElementById('elements-layer');
            const connectionsLayer = document.getElementById('connections-layer');
            const editBrushLayer = document.getElementById('edit-brush-layer');
            const brushLayer = document.getElementById('brush-layer');

            const newElementsTemplate = document.getElementById('template-elements-' + variantId);
            const newConnectionsTemplate = document.getElementById('template-connections-' + variantId);
            const newBrushTemplate = document.getElementById('template-brush-' + variantId);

            if (elementsLayer && newElementsTemplate) {
              elementsLayer.innerHTML = newElementsTemplate.innerHTML;
            }
            if (connectionsLayer && newConnectionsTemplate) {
              connectionsLayer.innerHTML = newConnectionsTemplate.innerHTML;
            }
            if (editBrushLayer && newBrushTemplate) {
              editBrushLayer.innerHTML = newBrushTemplate.innerHTML;
            }
            if (brushLayer) {
              brushLayer.innerHTML = '';
            }

            activeVariantId = variantId;
            const data = variantsData[variantId];
            if (data) {
              elements = JSON.parse(JSON.stringify(data.elements));
              connections = JSON.parse(JSON.stringify(data.connections));
              originalElements = JSON.parse(JSON.stringify(data.elements));
              hiddenNodes = data.hiddenNodes;
              hiddenConnections = data.hiddenConnections;
              originalEditBrushHTML = editBrushLayer ? editBrushLayer.innerHTML : '';
            }

            isPresenting = false;
            document.body.classList.remove('presentation-mode');
            const presBar = document.getElementById('presentation-bar');
            if (presBar) presBar.style.display = 'none';
            const notesPanel = document.getElementById('speaker-notes-panel');
            if (notesPanel) notesPanel.style.display = 'none';
            playedAnimationIds = [];
            currentSlideIndex = 0;
            slides = [];
            history = [];
            redoStack = [];

            document.getElementById('present-btn').style.display = 'flex';
            document.getElementById('theme-toggle-btn').style.display = 'flex';
            document.getElementById('autoplay-btn').style.display = 'flex';
            document.getElementById('autoplay-settings-btn').style.display = 'flex';
            const toolbar = document.querySelector('.brush-toolbar');
            const showBtn = document.getElementById('brush-show-btn');
            if (toolbar) {
              const isHidden = toolbar.classList.contains('hidden-toolbar');
              toolbar.style.display = '';
              if (showBtn) showBtn.style.display = isHidden ? 'flex' : 'none';
            }
            const zoomCtrls = document.querySelector('.zoom-controls');
            if (zoomCtrls) zoomCtrls.style.display = 'flex';

            updateTransform();
            updateConnections();

            setTimeout(() => {
              if (document.getElementById('zoom-fit')) {
                document.getElementById('zoom-fit').click();
              }
            }, 50);
            setTimeout(() => {
              resetVisibilities();
              animateInitialConnections();
              startPropagationAnimation();
            }, 500);

            showNotification('Switched variant');
          };

          window.goToSlide = (index) => {
            if (slides.length === 0) return;
            const prevIndex = currentSlideIndex;
            currentSlideIndex = Math.max(0, Math.min(index, slides.length - 1));
            
            const slide = slides[currentSlideIndex];
            
            const targetAnimations = [];
            const autoPlayIds = [];
            elements.forEach(el => {
              if (el.id === slide.id || el.parentId === slide.id) {
                (el.animations || []).forEach(anim => {
                  targetAnimations.push(anim.id);
                  if (anim.trigger === 'onEnter') {
                    autoPlayIds.push(anim.id);
                  }
                });
              }
            });

            const newPlayedIds = playedAnimationIds.filter(id => !targetAnimations.includes(id));
            if (currentSlideIndex < prevIndex) {
              playedAnimationIds = [...newPlayedIds, ...targetAnimations];
            } else {
              playedAnimationIds = [...newPlayedIds, ...autoPlayIds];
            }

            updateAnimationStyles();

            const slideEl = document.getElementById('el-wrapper-' + slide.id);
            if (slideEl && slideEl.classList.contains('is-hidden')) {
              revealCascade(slide.id);
            }
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
            
            updatePresentationControls();
          };

          window.nextSlide = () => {
            if (slides.length === 0) {
              slides = elements.filter(el => el.type === 'node' && el.isSlide !== false).sort((a, b) => a.x - b.x);
            }
            if (slides.length === 0) return;
            if (!isPresenting) {
              startPresentation();
              return;
            }
            
            const currentSlide = slides[currentSlideIndex];
            if (!currentSlide) return;

            const slideSteps = getSlideAnimationSteps(currentSlide.id);
            const nextStep = slideSteps.find(step => 
              !step.animations.every(anim => playedAnimationIds.includes(anim.id))
            );

            if (nextStep) {
              const nextAnimIds = nextStep.animations.map(a => a.id);
              playedAnimationIds = [...playedAnimationIds, ...nextAnimIds];
              updateAnimationStyles();
              updatePresentationControls();
            } else {
              if (currentSlideIndex < slides.length - 1) {
                goToSlide(currentSlideIndex + 1);
              }
            }
          };

          window.prevSlide = () => {
            if (slides.length === 0) {
              slides = elements.filter(el => el.type === 'node' && el.isSlide !== false).sort((a, b) => a.x - b.x);
            }
            if (slides.length === 0) return;
            if (!isPresenting) {
              startPresentation();
              return;
            }
            if (currentSlideIndex > 0) goToSlide(currentSlideIndex - 1);
          };

          window.onkeydown = e => {
            const target = e.target;
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.contentEditable === 'true';

            if (!isInput && e.key.toLowerCase() === 'l') {
              e.preventDefault();
              isLaserActive = !isLaserActive;
              updateLaserState();
              return;
            }

            if (isPresenting) {
              if (e.key === 'ArrowRight' || e.key === ' ' || e.code === 'Space' || e.key === 'Enter') {
                e.preventDefault();
                nextSlide();
              } else if (e.key === 'ArrowLeft' || ((e.key === ' ' || e.code === 'Space') && e.shiftKey)) {
                e.preventDefault();
                prevSlide();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                exitPresentation();
              }
              return;
            }
            if (!isInput && (e.key === 'Delete' || e.key === 'Backspace') && activeRuntimeTextId) {
              e.preventDefault();
              deleteRuntimeTextElement(activeRuntimeTextId);
              return;
            }
            if (e.code === 'Space' && !isInput) { e.preventDefault(); isSpaceDown = true; container.classList.add('space-down'); updateBrushCursor(); }
            if (e.key.toLowerCase() === 'b' && !isInput) {
              e.preventDefault();
              if (isBrushMode && brushTool === 'draw') {
                isBrushMode = false;
              } else {
                isBrushMode = true;
                brushTool = 'draw';
              }
              updateBrushToolClasses();
              showNotification(isBrushMode ? 'Brush mode enabled' : 'Brush mode disabled');
            }
            if (e.key.toLowerCase() === 'e' && !isInput) {
              e.preventDefault();
              if (isBrushMode && brushTool === 'erase') {
                isBrushMode = false;
              } else {
                isBrushMode = true;
                brushTool = 'erase';
              }
              updateBrushToolClasses();
              showNotification(isBrushMode ? 'Eraser mode enabled' : 'Eraser mode disabled');
            }
            if (e.key.toLowerCase() === 'x' && !isInput) clearBrush();
            // Ctrl + 0 shortcut for fit in view
            if ((e.ctrlKey || e.metaKey) && e.key === '0') {
              e.preventDefault();
              const zoomFitBtn = document.getElementById('zoom-fit');
              if (zoomFitBtn) zoomFitBtn.click();
              return;
            }

            if (!isInput && e.key.toLowerCase() === 'h' && !isInput) { e.preventDefault(); toggleToolbarVisibility(); }
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z' && !isInput) { e.preventDefault(); undo(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y' && !isInput) { e.preventDefault(); redo(); }
            if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+') && !isInput) {
              e.preventDefault();
              const slider = document.getElementById('brush-width-slider');
              if (slider) {
                slider.value = Math.min(100, parseInt(slider.value) + 5) + '';
                document.getElementById('brush-width-val').innerText = slider.value;
                updateBrushCursor();
              }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === '-' && !isInput) {
              e.preventDefault();
              const slider = document.getElementById('brush-width-slider');
              if (slider) {
                slider.value = Math.max(1, parseInt(slider.value) - 5) + '';
                document.getElementById('brush-width-val').innerText = slider.value;
                updateBrushCursor();
              }
            }
          };
          window.onkeyup = e => { if (e.code === 'Space') { isSpaceDown = false; isPanning = false; container.classList.remove('space-down', 'panning'); updateBrushCursor(); }};

          // Laser pointer and trail logic inside exported HTML
          const laserEl = document.getElementById('laser-pointer-el');
          const trailSvg = document.getElementById('laser-trail-svg');
          let lastMoveTime = Date.now();

          function updateLaserState() {
            if (isLaserActive) {
              laserEl.style.display = 'block';
              trailSvg.style.display = 'block';
              container.classList.add('laser-cursor-none');
            } else {
              laserEl.style.display = 'none';
              trailSvg.style.display = 'none';
              container.classList.remove('laser-cursor-none');
              laserTrail = [];
              trailSvg.innerHTML = '';
            }
          }

          window.addEventListener('pointermove', e => {
            if (!isLaserActive) return;
            laserPos = { x: e.clientX, y: e.clientY };
            laserEl.style.left = laserPos.x + 'px';
            laserEl.style.top = laserPos.y + 'px';
            
            laserTrail.push({ x: e.clientX, y: e.clientY });
            if (laserTrail.length > 20) {
              laserTrail.shift();
            }
            lastMoveTime = Date.now();
            renderTrail();
          });

          function renderTrail() {
            if (laserTrail.length === 0) {
              trailSvg.innerHTML = '';
              return;
            }
            let html = '';
            for (let i = 1; i < laserTrail.length; i++) {
              const p1 = laserTrail[i - 1];
              const p2 = laserTrail[i];
              const ratio = i / laserTrail.length;
              const opacity = ratio * 0.8;
              const strokeWidth = ratio * 8 + 2;
              html += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="#ff1744" stroke-width="' + strokeWidth + '" opacity="' + opacity + '" stroke-linecap="round" style="filter: drop-shadow(0 0 4px #ff1744);" />';
            }
            trailSvg.innerHTML = html;
          }

          function decayTrail() {
            if (isLaserActive && Date.now() - lastMoveTime > 80) {
              if (laserTrail.length > 0) {
                laserTrail.shift();
                renderTrail();
              }
            }
            setTimeout(() => requestAnimationFrame(decayTrail), 16);
          }
          requestAnimationFrame(decayTrail);

          function animateWire(connGroup, show) {
            const path = connGroup.querySelector('path');
            if (!path) return;
            const len = path.getTotalLength ? path.getTotalLength() : 500;
            connGroup.style.setProperty('--wire-len', len + '');
            connGroup.classList.remove('wire-draw', 'wire-undraw');
            void connGroup.offsetWidth; // force reflow
            if (show) {
              connGroup.classList.remove('is-hidden');
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
                connGroup.classList.add('is-hidden');
              }, {once: true});
            }
          }





          window.toggleNodeArrows = function(event, id) {
            if (event) event.stopPropagation();
            const el = document.getElementById('el-wrapper-' + id);
            if (!el) return;
            const isShowingNow = el.classList.toggle('show-btns');
            if (isShowingNow) {
              // Show all buttons again (clear any temporary hide class) when reopening
              el.querySelectorAll('.conn-btn').forEach(btn => {
                btn.classList.remove('clicked-hidden');
              });
            }
          };

          function revealCascade(id) {
            const el = document.getElementById('el-wrapper-' + id);
            if (!el) return;

            el.classList.remove('is-hidden', 'flow-hide');
            el.style.pointerEvents = 'auto';
            el.classList.add('flow-reveal');

            document.querySelectorAll('path[data-attached-node-id="' + id + '"]').forEach(path => {
              path.style.opacity = '1';
              path.style.pointerEvents = 'auto';
            });

            const elData = elements.find(e => e.id === id);
            if (elData && (elData.interactive || elData.enableExpandButton)) {
              return;
            }

            document.querySelectorAll('.connection-group').forEach(cg => {
              if (cg.dataset.from === id) {
                animateWire(cg, true);
                revealCascade(cg.dataset.to);
              }
            });
          }

          window.toggleMultipleTargets = function(btn, targetIdsStr, fromId) {
            const targetIds = targetIdsStr.split(',');
            const isShowing = btn.classList.toggle('active');
            
            targetIds.forEach(targetId => {
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
            });

            if (isShowing) {
              btn.classList.add('clicked-hidden');
            } else {
              btn.classList.remove('clicked-hidden');
            }
          };

          function hideCascade(id) {
            const el = document.getElementById('el-wrapper-' + id);
            if (!el) return;
            const elData = elements.find(e => e.id === id);
            if (elData && (elData.pinned || elData.isPinned)) return;

            el.classList.remove('flow-reveal');
            el.classList.add('flow-hide');
            el.style.pointerEvents = 'none';

            document.querySelectorAll('path[data-attached-node-id="' + id + '"]').forEach(path => {
              path.style.opacity = '0';
              path.style.pointerEvents = 'none';
            });
            
            el.addEventListener('animationend', function h() {
              el.removeEventListener('animationend', h);
              el.classList.add('is-hidden');
              el.classList.remove('flow-hide');
              el.classList.remove('show-btns');
              el.querySelectorAll('.conn-btn-group').forEach(bg => {
                bg.style.opacity = '0';
                bg.style.pointerEvents = 'none';
              });
              el.querySelectorAll('.conn-btn').forEach(cb => {
                cb.classList.remove('active', 'clicked-hidden');
              });
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
            const isHidden = el.classList.toggle('is-hidden');
            document.querySelectorAll('path[data-attached-node-id="' + id + '"]').forEach(path => {
              path.style.opacity = isHidden ? '0' : '1';
              path.style.pointerEvents = isHidden ? 'none' : 'auto';
            });
          };

          window.triggerFlow = function(id) {
            revealCascade(id);
          };

          window.goToSlideById = function(id) {
            if (slides.length === 0) {
              slides = elements.filter(el => el.type === 'node' && el.isSlide !== false).sort((a, b) => a.x - b.x);
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
            
            // Adjust interactive button scale when zoomed out
            const btnScale = scale < 1 ? 1 / scale : 1;
            container.style.setProperty('--conn-btn-scale', btnScale + '');
            updateBrushCursor();
          }

          container.onwheel = e => {
            e.preventDefault(); const delta = -e.deltaY * 0.001; const ns = Math.min(Math.max(0.05, scale * (1 + delta)), 20);
            const r = container.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top;
            const cx = (mx - pan.x) / scale, cy = (my - pan.y) / scale;
            pan.x = mx - cx * ns; pan.y = my - cy * ns; scale = ns; updateTransform();
          };

          let isResizingBrush = false;
          let startResizeInfo = { x: 0, width: 0 };

          container.addEventListener('pointerdown', e => {
            if (e.altKey && e.button === 2) {
              isResizingBrush = true;
              const slider = document.getElementById('brush-width-slider');
              startResizeInfo = { x: e.clientX, width: parseFloat(slider ? slider.value : '4') };
              return;
            }
            if (isSpaceDown) { isPanning = true; container.classList.add('panning'); startPan = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; return; }
            if (e.button === 2) {
              e.preventDefault();
              const el = e.target.closest('.draggable-element');
              if (el) {
                const id = el.id.replace('el-wrapper-', '');
                const elData = elements.find(item => item.id === id);
                if (elData && elData.id?.startsWith('runtime-text-')) {
                  selectRuntimeTextElement(id);
                  lastRightClickReset = { id: null, time: 0 };
                  const r = container.getBoundingClientRect();
                  const canvasX = (e.clientX - r.left - pan.x) / scale;
                  const canvasY = (e.clientY - r.top - pan.y) / scale;
                  showHtmlContextMenu(e.clientX, e.clientY, canvasX, canvasY, id);
                } else {
                  const now = Date.now();
                  if (lastRightClickReset.id === id && now - lastRightClickReset.time < 550) {
                    resetElementPosition(id);
                    lastRightClickReset = { id: null, time: 0 };
                  } else {
                    lastRightClickReset = { id, time: now };
                  }
                }
              } else {
                lastRightClickReset = { id: null, time: 0 };
                const r = container.getBoundingClientRect();
                const canvasX = (e.clientX - r.left - pan.x) / scale;
                const canvasY = (e.clientY - r.top - pan.y) / scale;
                showHtmlContextMenu(e.clientX, e.clientY, canvasX, canvasY, null);
              }
              return;
            }
            if (isBrushMode) {
              const r = container.getBoundingClientRect();
              const x = (e.clientX - r.left - pan.x) / scale, y = (e.clientY - r.top - pan.y) / scale;
              if (brushTool === 'erase') {
                isErasing = true;
                lastEraserPos = { x, y };
                const brushWidthVal = parseFloat(document.getElementById('brush-width-slider')?.value || '4');
                eraseBrushStrokesAt({ x, y }, null, brushWidthVal / 2);
              } else {
                currentStroke = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                currentStroke.setAttribute('fill', 'none');
                currentStroke.setAttribute('stroke', document.getElementById('brush-color').value);
                const brushWidthVal = document.getElementById('brush-width-slider') ? document.getElementById('brush-width-slider').value : '4';
                currentStroke.setAttribute('stroke-width', brushWidthVal);
                currentStroke.setAttribute('stroke-linecap', 'round');
                currentStroke.setAttribute('stroke-linejoin', 'round');
                currentStroke.dataset.pts = x + ',' + y;
                brushLayer.appendChild(currentStroke);
              }
              return;
            }
            window.blockClick = false;
            if (e.target.closest('.brush-toolbar') || e.target.closest('#presentation-bar') || e.target.closest('.theme-toggle-btn') || e.target.closest('.zoom-controls') || e.target.closest('.conn-btn-group') || e.target.closest('.conn-btn')) {
              return;
            }
            if (e.target.closest('[contenteditable="true"]')) {
              return;
            }
            hideHtmlContextMenu();
            const el = e.target.closest('.draggable-element');
            if (el) {
              const id = el.id.replace('el-wrapper-', '');
              if (!id.startsWith('runtime-text-')) clearRuntimeTextSelection();
              activeDrag = el;
              startDrag = { x: e.clientX, y: e.clientY, ex: parseFloat(el.style.left), ey: parseFloat(el.style.top) };
              el.style.zIndex = 2000;
              e.stopPropagation();
            } else {
              clearRuntimeTextSelection();
            }
          }, false);

          window.addEventListener('pointermove', e => {
            if (isResizingBrush) {
              const deltaX = e.clientX - startResizeInfo.x;
              const newWidth = Math.max(1, Math.min(100, Math.floor(startResizeInfo.width + deltaX * 0.2)));
              const slider = document.getElementById('brush-width-slider');
              if (slider) {
                slider.value = newWidth + '';
                document.getElementById('brush-width-val').innerText = newWidth;
                updateBrushCursor(e);
              }
              return;
            }
            updateBrushCursor(e);
            if (isPanning) { pan.x = startPan.px + (e.clientX - startPan.x); pan.y = startPan.py + (e.clientY - startPan.y); updateTransform(); return; }
            if (isErasing) {
              const r = container.getBoundingClientRect();
              const x = (e.clientX - r.left - pan.x) / scale, y = (e.clientY - r.top - pan.y) / scale;
              const brushWidthVal = parseFloat(document.getElementById('brush-width-slider')?.value || '4');
              eraseBrushStrokesAt({ x, y }, lastEraserPos, brushWidthVal / 2);
              lastEraserPos = { x, y };
              return;
            }
            if (currentStroke) {
              const r = container.getBoundingClientRect();
              const x = (e.clientX - r.left - pan.x) / scale, y = (e.clientY - r.top - pan.y) / scale;
              currentStroke.dataset.pts += ' ' + x + ',' + y;
              currentStroke.setAttribute('d', 'M ' + currentStroke.dataset.pts.split(' ').map(p => p.replace(',', ' ')).join(' L '));
            }
            if (activeDrag) {
              const totalMove = Math.hypot(e.clientX - startDrag.x, e.clientY - startDrag.y);
              if (totalMove > 5) {
                window.blockClick = true;
              }
              const dx = (e.clientX - startDrag.x) / scale, dy = (e.clientY - startDrag.y) / scale;
              const newX = startDrag.ex + dx, newY = startDrag.ey + dy;
              activeDrag.style.left = newX + 'px'; activeDrag.style.top = newY + 'px';
              const id = activeDrag.id.replace('el-wrapper-', '');
              const elData = elements.find(el => el.id === id);
              if (elData) {
                const diffX = newX - elData.x;
                const diffY = newY - elData.y;
                elData.x = newX;
                elData.y = newY;
                if (diffX !== 0 || diffY !== 0) {
                  translateAttachedBrushPaths(id, diffX, diffY);
                }
              }
              requestAnimationFrame(updateConnections);
            }
          });

          window.addEventListener('pointerup', () => {
            if (currentStroke) {
              const ptsStr = currentStroke.dataset.pts || '';
              const pts = ptsStr.split(' ').map(pt => {
                const [x, y] = pt.split(',').map(parseFloat);
                return { x, y };
              });
              let attachedNodeId = null;
              for (let i = elements.length - 1; i >= 0; i--) {
                const node = elements[i];
                if (node.visible === false) continue;
                const bounds = getElementCanvasBounds(node);
                const intersects = pts.some(p =>
                  p.x >= bounds.x &&
                  p.x <= bounds.x + bounds.width &&
                  p.y >= bounds.y &&
                  p.y <= bounds.y + bounds.height
                );
                if (intersects) {
                  attachedNodeId = node.id;
                  break;
                }
              }
              if (ptsStr) {
                currentStroke.setAttribute('data-pts', ptsStr);
              }
              if (attachedNodeId) {
                currentStroke.setAttribute('data-attached-node-id', attachedNodeId);
                currentStroke.dataset.attachedNodeId = attachedNodeId;
              }
              saveHistory();
            }
            currentStroke = null;
            isErasing = false;
            lastEraserPos = null;
            isPanning = false;
            isResizingBrush = false;
            container.classList.remove('panning');
            if (activeDrag) {
              activeDrag.style.zIndex = activeDrag.classList.contains('is-node') ? 1 : 2;
              activeDrag = null;
            }
          });

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
            const data = elements.find(item => item.id === id);
            if (data) {
              const bounds = getElementCanvasBounds(data);
              return { ...bounds, rotation: data.rotation || 0 };
            }
            const el = document.getElementById('el-wrapper-' + id); if (!el) return null;
            let x = parseFloat(el.style.left), y = parseFloat(el.style.top);
            const parent = el.parentElement.closest('.is-node');
            if (parent) { x += parseFloat(parent.style.left) + 16; y += parseFloat(parent.style.top) + 45 + 16; }
            return { x, y, width: parseFloat(el.style.width), height: parseFloat(el.style.height), rotation: 0 };
          }

          function rotateVector(x, y, degrees) {
            const rad = degrees * Math.PI / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            return {
              x: x * cos - y * sin,
              y: x * sin + y * cos
            };
          }

          function updateConnections() {
            connections.forEach(conn => {
              const path = document.getElementById('conn-' + conn.id); if (!path) return;
              const f = getAbsoluteBounds(conn.fromId), t = getAbsoluteBounds(conn.toId); if (!f || !t) return;
              const coords = (b, p) => {
                const cx = b.x + b.width / 2;
                const cy = b.y + b.height / 2;
                let lx = 0, ly = 0, nx = 1, ny = 0;
                if (p === 'top') {
                  ly = -b.height / 2; nx = 0; ny = -1;
                } else if (p === 'bottom') {
                  ly = b.height / 2; nx = 0; ny = 1;
                } else if (p === 'left') {
                  lx = -b.width / 2; nx = -1; ny = 0;
                } else {
                  lx = b.width / 2; nx = 1; ny = 0;
                }
                const point = rotateVector(lx, ly, b.rotation || 0);
                const normal = rotateVector(nx, ny, b.rotation || 0);
                return { x: cx + point.x, y: cy + point.y, nx: normal.x, ny: normal.y };
              };
              const s = coords(f, conn.fromPort), e = coords(t, conn.toPort);
              const connArrow = Object.assign({ start: conn.startArrow || 'none', end: conn.endArrow || 'none', size: 6 }, conn.arrow || {});
              const connStroke = Object.assign({ lineType: 'curve' }, conn.stroke || {});
              const gap = Math.max(1.8, connArrow.size * 0.3);
              if (connArrow.start !== 'none') {
                s.x += s.nx * gap;
                s.y += s.ny * gap;
              }
              if (connArrow.end !== 'none') {
                e.x += e.nx * gap;
                e.y += e.ny * gap;
              }
              const dx = e.x - s.x;
              const dy = e.y - s.y;
              const dist = Math.hypot(dx, dy);
              const cd = Math.min(Math.max(dist * 0.35, 30), 120);
              let cx1 = s.x, cy1 = s.y, cx2 = e.x, cy2 = e.y;
              cx1 += s.nx * cd;
              cy1 += s.ny * cd;
              cx2 += e.nx * cd;
              cy2 += e.ny * cd;
              const midX = 0.125 * s.x + 0.375 * cx1 + 0.375 * cx2 + 0.125 * e.x;
              const midY = 0.125 * s.y + 0.375 * cy1 + 0.375 * cy2 + 0.125 * e.y;
              const d = connStroke.lineType === 'straight'
                ? 'M ' + s.x + ' ' + s.y + ' L ' + e.x + ' ' + e.y
                : connStroke.lineType === 'elbow'
                  ? 'M ' + s.x + ' ' + s.y + ' L ' + s.x + ' ' + midY + ' L ' + e.x + ' ' + midY + ' L ' + e.x + ' ' + e.y
                  : 'M ' + s.x + ' ' + s.y + ' C ' + cx1 + ' ' + cy1 + ', ' + cx2 + ' ' + cy2 + ', ' + e.x + ' ' + e.y;
              const reverseD = connStroke.lineType === 'straight'
                ? 'M ' + e.x + ' ' + e.y + ' L ' + s.x + ' ' + s.y
                : connStroke.lineType === 'elbow'
                  ? 'M ' + e.x + ' ' + e.y + ' L ' + e.x + ' ' + midY + ' L ' + s.x + ' ' + midY + ' L ' + s.x + ' ' + s.y
                  : 'M ' + e.x + ' ' + e.y + ' C ' + cx2 + ' ' + cy2 + ', ' + cx1 + ' ' + cy1 + ', ' + s.x + ' ' + s.y;
              path.setAttribute('d', d);
              const pulsePath = document.getElementById('conn-pulse-' + conn.id);
              if (pulsePath) {
                pulsePath.setAttribute('d', d);
              }
              const helperPath = document.getElementById('conn-text-' + conn.id);
              if (helperPath) {
                helperPath.setAttribute('d', reverseD);
              }
              const labelEl = document.getElementById('conn-label-' + conn.id);
              if (labelEl) {
                const tagName = labelEl.tagName.toLowerCase();
                if (tagName === 'textpath') {
                  // do nothing
                } else if (tagName === 'foreignobject') {
                  labelEl.setAttribute('x', (midX - 200).toString());
                  labelEl.setAttribute('y', (midY - 20).toString());
                } else {
                  labelEl.setAttribute('x', midX.toString());
                  labelEl.setAttribute('y', midY.toString());
                }
              }
              const connGroup = document.getElementById('conn-group-' + conn.id);
              if (connGroup && (connGroup.classList.contains('wire-draw') || connGroup.classList.contains('wire-undraw'))) {
                const len = path.getTotalLength ? path.getTotalLength() : 500;
                connGroup.style.setProperty('--wire-len', len + '');
              }
            });
          }
          function animateInitialConnections() {
            document.querySelectorAll('.connection-group').forEach(cg => {
              const toId = cg.dataset.to;
              const toEl = document.getElementById('el-wrapper-' + toId);
              const fromId = cg.dataset.from;
              const fromEl = document.getElementById('el-wrapper-' + fromId);
              
              const isFromHidden = fromEl && fromEl.classList.contains('is-hidden');
              const isToHidden = toEl && toEl.classList.contains('is-hidden');
              
              if (!cg.classList.contains('is-hidden') && !isFromHidden && !isToHidden) {
                animateWire(cg, true);
              } else {
                cg.style.opacity = '0';
              }
            });
          }
          function resetVisibilities() {
            elements.forEach(el => {
              const wrapper = document.getElementById('el-wrapper-' + el.id);
              if (wrapper) {
                wrapper.classList.remove('flow-reveal', 'flow-hide', 'show-btns');
                wrapper.style.filter = '';
                
                const isInteractiveHidden = hiddenNodes.includes(el.id);
                if (isInteractiveHidden) {
                   wrapper.classList.add('is-hidden');
                  wrapper.style.opacity = '0';
                  wrapper.style.pointerEvents = 'none';
                } else if (el.isDisabled) {
                  wrapper.classList.remove('is-hidden');
                  wrapper.style.filter = 'grayscale(1) contrast(0.5)';
                  wrapper.style.opacity = '0.6';
                  if (el.type !== 'button') wrapper.style.pointerEvents = 'none';
                  else wrapper.style.pointerEvents = 'auto';
                } else {
                  wrapper.classList.remove('is-hidden');
                  wrapper.style.opacity = '1';
                  wrapper.style.pointerEvents = 'auto';
                }

                const btn = wrapper.querySelector('button');
                if (btn && el.type === 'button') {
                  btn.disabled = !!el.isDisabled;
                }

                wrapper.querySelectorAll('.conn-btn').forEach(cb => {
                  cb.classList.remove('active', 'clicked-hidden');
                });
              }
            });

            document.querySelectorAll('.connection-group').forEach(cg => {
              cg.classList.remove('flow-active');
              const connId = cg.dataset.id;
              const isInitialHidden = hiddenConnections.includes(connId);
              cg.style.opacity = '0';
              if (isInitialHidden) {
                cg.classList.add('is-hidden');
              } else {
                cg.classList.remove('is-hidden');
              }
          });
          }

          function startPropagationAnimation() {
            const targetIds = new Set(connections.map(c => c.toId));
            const rootNodes = elements.filter(el => !el.parentId && !targetIds.has(el.id));
            const startNodes = rootNodes.length > 0 ? rootNodes : elements.filter(el => !el.parentId);
            
            const visitedNodes = new Set();
            const queue = startNodes.map(n => ({ id: n.id, delay: 0 }));
            queue.forEach(item => visitedNodes.add(item.id));
            
            while (queue.length > 0) {
              const current = queue.shift();
              const outConns = connections.filter(c => c.fromId === current.id);
              outConns.forEach(conn => {
                const connGroup = document.getElementById('conn-group-' + conn.id);
                if (connGroup) {
                  setTimeout(() => {
                    connGroup.classList.add('flow-active');
                  }, current.delay);
                }
                
                if (!visitedNodes.has(conn.toId)) {
                  visitedNodes.add(conn.toId);
                  queue.push({ id: conn.toId, delay: current.delay + 500 });
                }
              });
            }
          }

          updateTransform(); updateConnections();
          setTimeout(() => {
            if (document.getElementById('zoom-fit')) {
              document.getElementById('zoom-fit').click();
            }
          }, 50);
          setTimeout(() => {
            animateInitialConnections();
            startPropagationAnimation();
          }, 500);

          function handleUserInteraction(e) {
            const isElementClick = e.target.closest('.draggable-element') || 
                                   e.target.closest('.connection-group') || 
                                   e.target.closest('.conn-btn') ||
                                   (isBrushMode && !e.target.closest('.brush-toolbar') && !e.target.closest('.theme-toggle-btn') && !e.target.closest('.zoom-controls'));
            if (isElementClick) {
              if (!userInteracted) {
                userInteracted = true;
                stopAutoplay();
              }
            }
          }
          window.addEventListener('pointerdown', handleUserInteraction, { capture: true });

          setTimeout(() => {
            if (!userInteracted) {
              startAutoplay();
            }
          }, 1500);
        })();
      </script>
      <script id="js-builder-state" type="application/json">${scriptJson({
        variants: variants.map(v => v.id === activeVariantId ? { ...v, elements, connections, brushStrokes, guides } : v),
        activeVariantId,
        theme
      })}</script>
      </body>
      </html>
    `;
  };

  // --- Layer Management (Miro/Figma-style) ---
  
  const bringToFront = useCallback((id: string) => {
    saveHistory();
    setElements(prev => {
      const maxZ = Math.max(...prev.map(el => el.zIndex || 0));
      return prev.map(el => el.id === id ? { ...el, zIndex: maxZ + 1 } as CanvasElement : el);
    });
  }, [saveHistory]);

  const sendToBack = useCallback((id: string) => {
    saveHistory();
    setElements(prev => {
      const minZ = Math.min(...prev.map(el => el.zIndex || 0));
      return prev.map(el => el.id === id ? { ...el, zIndex: minZ - 1 } as CanvasElement : el);
    });
  }, [saveHistory]);

  const bringForward = useCallback((id: string) => {
    saveHistory();
    setElements(prev => {
      const el = prev.find(e => e.id === id);
      if (!el) return prev;
      const currentZ = el.zIndex || 0;
      // Find the next higher zIndex
      const aboveElements = prev.filter(e => (e.zIndex || 0) > currentZ);
      if (aboveElements.length === 0) return prev;
      const nextZ = Math.min(...aboveElements.map(e => e.zIndex || 0));
      return prev.map(e => {
        if (e.id === id) return { ...e, zIndex: nextZ + 1 } as CanvasElement;
        return e;
      });
    });
  }, [saveHistory]);

  const sendBackward = useCallback((id: string) => {
    saveHistory();
    setElements(prev => {
      const el = prev.find(e => e.id === id);
      if (!el) return prev;
      const currentZ = el.zIndex || 0;
      // Find the next lower zIndex
      const belowElements = prev.filter(e => (e.zIndex || 0) < currentZ);
      if (belowElements.length === 0) return prev;
      const prevZ = Math.max(...belowElements.map(e => e.zIndex || 0));
      return prev.map(e => {
        if (e.id === id) return { ...e, zIndex: prevZ - 1 } as CanvasElement;
        return e;
      });
    });
  }, [saveHistory]);

  const reorderElements = useCallback((draggedId: string, targetId: string) => {
    saveHistory();
    setElements(prev => {
      // Sort elements by zIndex descending (top layers first)
      const sorted = [...prev].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
      const dragIdx = sorted.findIndex(el => el.id === draggedId);
      const targetIdx = sorted.findIndex(el => el.id === targetId);
      if (dragIdx === -1 || targetIdx === -1) return prev;

      const newSorted = [...sorted];
      const [draggedElement] = newSorted.splice(dragIdx, 1);
      newSorted.splice(targetIdx, 0, draggedElement);

      // Re-assign sequential z-indexes to all elements
      // Top layer gets zIndex = length, bottom gets 1
      return prev.map(el => {
        const sortedIndex = newSorted.findIndex(s => s.id === el.id);
        if (sortedIndex !== -1) {
          return { ...el, zIndex: newSorted.length - sortedIndex } as CanvasElement;
        }
        return el;
      });
    });
  }, [saveHistory]);

  // --- Group Management ---
  
  const groupElements = useCallback((ids: string[]) => {
    if (ids.length < 2) return;
    saveHistory();
    const groupId = uuidv4();
    setElements(prev => prev.map(el => 
      ids.includes(el.id) ? { ...el, groupId } as CanvasElement : el
    ));
  }, [saveHistory]);

  const ungroupElements = useCallback((groupId: string) => {
    saveHistory();
    setElements(prev => prev.map(el => 
      el.groupId === groupId ? { ...el, groupId: null } as CanvasElement : el
    ));
  }, [saveHistory]);

  // --- Animation Management ---

  const updateElementAnimations = useCallback((id: string, animations: any[]) => {
    saveHistory();
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, animations } as CanvasElement : el
    ));
  }, [saveHistory]);

  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    resolve: ((val: boolean) => void) | null;
  }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
    resolve: null
  });

  const showAlert = useCallback((message: string, title: string = 'Notification'): Promise<void> => {
    return new Promise<void>((resolve) => {
      setDialogConfig({
        isOpen: true,
        type: 'alert',
        title,
        message,
        resolve: () => resolve()
      });
    });
  }, []);

  const showConfirm = useCallback((message: string, title: string = 'Confirmation'): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setDialogConfig({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        resolve: (val: boolean) => resolve(val)
      });
    });
  }, []);

  return (
    <BuilderContext.Provider value={{ 
      elements, connections, selectedIds, selectedConnectionId, connectingNode, scale, pan, 
      addElement, addSlideNode, duplicateSlideNode, moveSlideNode, updateElement, updateConnection, removeElement, removeSelected, selectElement, selectConnection, 
      setConnectingNode, addConnection, removeConnection, duplicateSelected, 
      setScale, setPan, exportHTML, alignElements, distributeElements, isPresenting, setIsPresenting, editingFocalPointId, setEditingFocalPointId,
      brushStrokes, isBrushMode, brushColor, brushWidth, setBrushMode, setBrushColor, setBrushWidth, addBrushStroke, clearBrush, undo, redo, saveHistory, saveHistoryOnce,
      brushTool, setBrushTool, eraseBrushStrokesAt,
      theme, setTheme, guides, addGuide, updateGuide, removeGuide, copySelected, pasteCopied, selectAll, isSnapEnabled, setIsSnapEnabled: handleSetIsSnapEnabled,
      isBlurEnabled, setIsBlurEnabled: handleSetIsBlurEnabled,
      currentSlideIndex, setCurrentSlideIndex, revealDownstream,
      playedAnimationIds, setPlayedAnimationIds,
      previewAnimationId, setPreviewAnimationId,
      isHelpOpen, setIsHelpOpen,
      isPropertiesOpen, setIsPropertiesOpen,
      variants, activeVariantId, switchVariant, addVariant, deleteVariant, renameVariant, importHTML, importCodeAndMerge,
      showAlert, showConfirm,
      bringToFront, sendToBack, bringForward, sendBackward, reorderElements,
      groupElements, ungroupElements,
      updateElementAnimations
    }}>
      {children}
      {dialogConfig.isOpen && (
        <div className="custom-dialog-overlay" onClick={() => {
          if (dialogConfig.type === 'alert') {
            dialogConfig.resolve?.(true);
            setDialogConfig(prev => ({ ...prev, isOpen: false }));
          }
        }}>
          <div className="custom-dialog-container" onClick={e => e.stopPropagation()}>
            <div className="custom-dialog-header">
              <span className="custom-dialog-title">{dialogConfig.title}</span>
            </div>
            <div className="custom-dialog-body">
              <p className="custom-dialog-message" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{dialogConfig.message}</p>
            </div>
            <div className="custom-dialog-footer">
              {dialogConfig.type === 'confirm' && (
                <button 
                  className="custom-dialog-btn secondary" 
                  onClick={() => {
                    dialogConfig.resolve?.(false);
                    setDialogConfig(prev => ({ ...prev, isOpen: false }));
                  }}
                >
                  Cancel
                </button>
              )}
              <button 
                className="custom-dialog-btn primary" 
                onClick={() => {
                  dialogConfig.resolve?.(true);
                  setDialogConfig(prev => ({ ...prev, isOpen: false }));
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) throw new Error('useBuilder must be used within BuilderProvider');
  return context;
};
