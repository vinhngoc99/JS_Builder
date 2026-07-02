// =============================================================================
// LayerManager — z-order (Miro/Figma-style) and grouping operations.
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { CanvasElement } from '../types';
import { BuilderDeps } from './BuilderDeps';

export class LayerManager {
  constructor(private d: BuilderDeps) {}

  bringToFront = (id: string): void => {
    const { saveHistory, setElements } = this.d;
    saveHistory();
    setElements(prev => {
      const maxZ = Math.max(...prev.map(el => el.zIndex || 0));
      return prev.map(el => el.id === id ? { ...el, zIndex: maxZ + 1 } as CanvasElement : el);
    });
  };

  sendToBack = (id: string): void => {
    const { saveHistory, setElements } = this.d;
    saveHistory();
    setElements(prev => {
      const minZ = Math.min(...prev.map(el => el.zIndex || 0));
      return prev.map(el => el.id === id ? { ...el, zIndex: minZ - 1 } as CanvasElement : el);
    });
  };

  bringForward = (id: string): void => {
    const { saveHistory, setElements } = this.d;
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
  };

  sendBackward = (id: string): void => {
    const { saveHistory, setElements } = this.d;
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
  };

  reorderElements = (draggedId: string, targetId: string): void => {
    const { saveHistory, setElements } = this.d;
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
  };

  groupElements = (ids: string[]): void => {
    const { saveHistory, setElements } = this.d;
    if (ids.length < 2) return;
    saveHistory();
    const groupId = uuidv4();
    setElements(prev => prev.map(el =>
      ids.includes(el.id) ? { ...el, groupId } as CanvasElement : el
    ));
  };

  ungroupElements = (groupId: string): void => {
    const { saveHistory, setElements } = this.d;
    saveHistory();
    setElements(prev => prev.map(el =>
      el.groupId === groupId ? { ...el, groupId: null } as CanvasElement : el
    ));
  };
}
