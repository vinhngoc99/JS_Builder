// =============================================================================
// BuilderDeps — the dependency contract shared by all builder managers.
//
// The provider owns React state; managers own behavior. Rather than closing
// over state (which would re-create managers every render), the provider builds
// ONE mutable deps object, refreshes its fields each render, and hands it to
// stable manager instances. Managers read `this.d.<field>` at call time, so
// they always see current state while keeping stable method identities.
// =============================================================================

import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { CanvasElement, Connection, BrushStroke, Variant } from '../types';

export type Guide = { id: string; type: 'horizontal' | 'vertical'; position: number };

export interface HistoryState {
  elements: CanvasElement[];
  connections: Connection[];
  brushStrokes: BrushStroke[];
}

export interface BuilderDeps {
  // --- Live refs (latest value, no stale closures) ---
  elementsRef: MutableRefObject<CanvasElement[]>;
  connectionsRef: MutableRefObject<Connection[]>;
  brushStrokesRef: MutableRefObject<BrushStroke[]>;
  historyScopesRef: MutableRefObject<Record<string, ReturnType<typeof setTimeout>>>;

  // --- Current state snapshots (this render's committed values) ---
  elements: CanvasElement[];
  connections: Connection[];
  brushStrokes: BrushStroke[];
  selectedIds: string[];
  selectedConnectionId: string | null;
  copiedElements: CanvasElement[];
  variants: Variant[];
  activeVariantId: string;
  guides: Guide[];
  pan: { x: number; y: number };
  scale: number;

  // --- Setters ---
  setElements: Dispatch<SetStateAction<CanvasElement[]>>;
  setConnections: Dispatch<SetStateAction<Connection[]>>;
  setBrushStrokes: Dispatch<SetStateAction<BrushStroke[]>>;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  setSelectedConnectionId: Dispatch<SetStateAction<string | null>>;
  setCopiedElements: Dispatch<SetStateAction<CanvasElement[]>>;
  setVariants: Dispatch<SetStateAction<Variant[]>>;
  setActiveVariantIdState: Dispatch<SetStateAction<string>>;
  setGuides: Dispatch<SetStateAction<Guide[]>>;
  setHistory: Dispatch<SetStateAction<HistoryState[]>>;
  setRedoStack: Dispatch<SetStateAction<HistoryState[]>>;
  setCurrentSlideIndex: Dispatch<SetStateAction<number>>;
  setIsPropertiesOpen: Dispatch<SetStateAction<boolean>>;
  setIsBrushMode: Dispatch<SetStateAction<boolean>>;
  setBrushColorVal: Dispatch<SetStateAction<string>>;
  setBrushWidthVal: Dispatch<SetStateAction<number>>;
  setTheme: (theme: 'light' | 'dark') => void;

  // --- Cross-manager (wired to HistoryManager.saveHistory) ---
  saveHistory: () => void;
}
