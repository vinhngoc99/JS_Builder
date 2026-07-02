// =============================================================================
// HistoryManager — undo/redo stacks and history snapshots.
// =============================================================================

import { BuilderDeps, HistoryState } from './BuilderDeps';

export class HistoryManager {
  constructor(private d: BuilderDeps) {}

  saveHistory = (): void => {
    const { elementsRef, connectionsRef, brushStrokesRef, setHistory, setRedoStack } = this.d;
    const snapshot: HistoryState = {
      elements: structuredClone(elementsRef.current),
      connections: structuredClone(connectionsRef.current),
      brushStrokes: structuredClone(brushStrokesRef.current),
    };
    setHistory(prev => [...prev.slice(-49), snapshot]);
    setRedoStack([]);
  };

  saveHistoryOnce = (scope: string, idleMs = 700): void => {
    const { historyScopesRef } = this.d;
    if (!historyScopesRef.current[scope]) {
      this.saveHistory();
    }

    window.clearTimeout(historyScopesRef.current[scope]);
    historyScopesRef.current[scope] = window.setTimeout(() => {
      delete historyScopesRef.current[scope];
    }, idleMs);
  };

  undo = (): void => {
    const { elementsRef, connectionsRef, brushStrokesRef, setHistory, setRedoStack, setElements, setConnections, setBrushStrokes } = this.d;
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
  };

  redo = (): void => {
    const { elementsRef, connectionsRef, brushStrokesRef, setHistory, setRedoStack, setElements, setConnections, setBrushStrokes } = this.d;
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
  };
}
