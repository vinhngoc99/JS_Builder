import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { CanvasElement, ElementType, Connection, PortPosition, BrushStroke, Variant } from './types';
import { migrateConnections, migrateElements, migrateVariants } from './models/migration';
import { storage } from './services/StorageService';
import { GeometryService } from './services/GeometryService';
import { generateExportHTML } from './services/HtmlExportService';
import { BuilderDeps } from './managers/BuilderDeps';
import { HistoryManager } from './managers/HistoryManager';
import { SelectionManager } from './managers/SelectionManager';
import { ElementManager } from './managers/ElementManager';
import { ConnectionManager } from './managers/ConnectionManager';
import { BrushManager } from './managers/BrushManager';
import { LayerManager } from './managers/LayerManager';
import { VariantManager } from './managers/VariantManager';
import { GuideManager } from './managers/GuideManager';

// Re-export element accessors so existing import paths keep working
// (e.g. `import { getAdaptedTextColor } from '../BuilderContext'`).
export {
  getAdaptedTextColor,
  getAdaptedBorderColor,
  getAdaptedBgColor,
  getElementFillColor,
  getElementStroke,
  getElementText,
  getElementTextColor,
  getElementFontFamily,
  getElementFontSize,
  getElementTextAlign,
  getElementName,
  getElementShadowCSS,
  getElementAction,
} from './services/element-accessors';

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
    const parsed = storage.parsedVariants();
    if (parsed) {
      // Migrate old format elements to new OOP format
      return migrateVariants(parsed);
    }
    return [{
      id: 'default',
      name: 'Variant 1',
      elements: migrateElements(storage.read(storage.KEYS.elements, [])),
      connections: migrateConnections(storage.read(storage.KEYS.connections, [])),
      brushStrokes: storage.read(storage.KEYS.brush, []),
      guides: storage.read(storage.KEYS.guides, [])
    }];
  });

  const [activeVariantId, setActiveVariantIdState] = useState<string>(() => storage.activeVariantId());

  const [elements, setElements] = useState<CanvasElement[]>(() =>
    migrateElements(storage.activeVariantField('elements', storage.KEYS.elements, []))
  );

  const [connections, setConnections] = useState<Connection[]>(() =>
    migrateConnections(storage.activeVariantField('connections', storage.KEYS.connections, []))
  );

  const [brushStrokes, setBrushStrokes] = useState<BrushStroke[]>(() =>
    storage.activeVariantField('brushStrokes', storage.KEYS.brush, [])
  );

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = storage.getString(storage.KEYS.theme);
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [guides, setGuides] = useState<{ id: string; type: 'horizontal' | 'vertical'; position: number }[]>(() =>
    storage.activeVariantField('guides', storage.KEYS.guides, [])
  );
  const [copiedElements, setCopiedElements] = useState<CanvasElement[]>([]);
  const [isSnapEnabled, setIsSnapEnabled] = useState<boolean>(() => storage.getString(storage.KEYS.snap) !== 'false');
  const [isBlurEnabled, setIsBlurEnabled] = useState<boolean>(() => storage.getString(storage.KEYS.blur) !== 'false');

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    storage.saveTheme(t);
  };

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
  }, [theme]);

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

  const getElementCanvasBounds = useCallback(
    (el: CanvasElement, allElements: CanvasElement[] = elementsRef.current) =>
      GeometryService.getElementCanvasBounds(el, allElements),
    []
  );

  const historyScopesRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const historyScopes = historyScopesRef.current;
    return () => {
      Object.values(historyScopes).forEach(timer => window.clearTimeout(timer));
    };
  }, []);

  const handleSetIsSnapEnabled = (val: boolean) => {
    setIsSnapEnabled(val);
    storage.saveSnap(val);
  };

  const handleSetIsBlurEnabled = (val: boolean) => {
    setIsBlurEnabled(val);
    storage.saveBlur(val);
  };


  // Debounced localStorage persistence (500ms delay to avoid writes during drag)
  useEffect(() => { storage.saveElements(elements); }, [elements]);
  useEffect(() => { storage.saveConnections(connections); }, [connections]);
  useEffect(() => { storage.saveBrush(brushStrokes); }, [brushStrokes]);

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

  useEffect(() => { storage.saveVariants(variants); }, [variants]);

  useEffect(() => {
    storage.saveActiveVariantId(activeVariantId);
  }, [activeVariantId]);

  // -------------------------------------------------------------------------
  // Managers own all behavior. We keep ONE mutable deps object (refreshed every
  // render) and STABLE manager instances, so manager methods always read current
  // state while keeping stable identities across renders.
  // -------------------------------------------------------------------------
  const depsRef = useRef<BuilderDeps>({} as BuilderDeps);
  const deps = depsRef.current;
  deps.elementsRef = elementsRef;
  deps.connectionsRef = connectionsRef;
  deps.brushStrokesRef = brushStrokesRef;
  deps.historyScopesRef = historyScopesRef;
  deps.elements = elements;
  deps.connections = connections;
  deps.brushStrokes = brushStrokes;
  deps.selectedIds = selectedIds;
  deps.selectedConnectionId = selectedConnectionId;
  deps.copiedElements = copiedElements;
  deps.variants = variants;
  deps.activeVariantId = activeVariantId;
  deps.guides = guides;
  deps.pan = pan;
  deps.scale = scale;
  deps.setElements = setElements;
  deps.setConnections = setConnections;
  deps.setBrushStrokes = setBrushStrokes;
  deps.setSelectedIds = setSelectedIds;
  deps.setSelectedConnectionId = setSelectedConnectionId;
  deps.setCopiedElements = setCopiedElements;
  deps.setVariants = setVariants;
  deps.setActiveVariantIdState = setActiveVariantIdState;
  deps.setGuides = setGuides;
  deps.setHistory = setHistory;
  deps.setRedoStack = setRedoStack;
  deps.setCurrentSlideIndex = setCurrentSlideIndex;
  deps.setIsPropertiesOpen = setIsPropertiesOpen;
  deps.setIsBrushMode = setIsBrushMode;
  deps.setBrushColorVal = setBrushColorVal;
  deps.setBrushWidthVal = setBrushWidthVal;
  deps.setTheme = setTheme;

  const managersRef = useRef<{
    history: HistoryManager;
    selection: SelectionManager;
    element: ElementManager;
    connection: ConnectionManager;
    brush: BrushManager;
    layer: LayerManager;
    variant: VariantManager;
    guide: GuideManager;
  }>(undefined as never);
  if (!managersRef.current) {
    const history = new HistoryManager(deps);
    deps.saveHistory = history.saveHistory;
    managersRef.current = {
      history,
      selection: new SelectionManager(deps),
      element: new ElementManager(deps),
      connection: new ConnectionManager(deps),
      brush: new BrushManager(deps),
      layer: new LayerManager(deps),
      variant: new VariantManager(deps),
      guide: new GuideManager(deps),
    };
  }
  const { history, selection, element, connection, brush, layer, variant, guide } = managersRef.current;

  const exportHTML = () => generateExportHTML({ variants, activeVariantId, elements, connections, brushStrokes, guides, theme });

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
      addElement: element.addElement, addSlideNode: element.addSlideNode, duplicateSlideNode: element.duplicateSlideNode, moveSlideNode: element.moveSlideNode, updateElement: element.updateElement, updateConnection: connection.updateConnection, removeElement: element.removeElement, removeSelected: element.removeSelected, selectElement: selection.selectElement, selectConnection: selection.selectConnection,
      setConnectingNode, addConnection: connection.addConnection, removeConnection: connection.removeConnection, duplicateSelected: element.duplicateSelected,
      setScale, setPan, exportHTML, alignElements: element.alignElements, distributeElements: element.distributeElements, isPresenting, setIsPresenting, editingFocalPointId, setEditingFocalPointId,
      brushStrokes, isBrushMode, brushColor, brushWidth, setBrushMode: brush.setBrushMode, setBrushColor: brush.setBrushColor, setBrushWidth: brush.setBrushWidth, addBrushStroke: brush.addBrushStroke, clearBrush: brush.clearBrush, undo: history.undo, redo: history.redo, saveHistory: history.saveHistory, saveHistoryOnce: history.saveHistoryOnce,
      brushTool, setBrushTool, eraseBrushStrokesAt: brush.eraseBrushStrokesAt,
      theme, setTheme, guides, addGuide: guide.addGuide, updateGuide: guide.updateGuide, removeGuide: guide.removeGuide, copySelected: selection.copySelected, pasteCopied: selection.pasteCopied, selectAll: selection.selectAll, isSnapEnabled, setIsSnapEnabled: handleSetIsSnapEnabled,
      isBlurEnabled, setIsBlurEnabled: handleSetIsBlurEnabled,
      currentSlideIndex, setCurrentSlideIndex, revealDownstream: element.revealDownstream,
      playedAnimationIds, setPlayedAnimationIds,
      previewAnimationId, setPreviewAnimationId,
      isHelpOpen, setIsHelpOpen,
      isPropertiesOpen, setIsPropertiesOpen,
      variants, activeVariantId, switchVariant: variant.switchVariant, addVariant: variant.addVariant, deleteVariant: variant.deleteVariant, renameVariant: variant.renameVariant, importHTML: variant.importHTML, importCodeAndMerge: variant.importCodeAndMerge,
      showAlert, showConfirm,
      bringToFront: layer.bringToFront, sendToBack: layer.sendToBack, bringForward: layer.bringForward, sendBackward: layer.sendBackward, reorderElements: layer.reorderElements,
      groupElements: layer.groupElements, ungroupElements: layer.ungroupElements,
      updateElementAnimations: element.updateElementAnimations
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
