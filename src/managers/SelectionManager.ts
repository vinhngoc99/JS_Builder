// =============================================================================
// SelectionManager — element/connection selection and clipboard (copy/paste).
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { CanvasElement } from '../types';
import { BuilderDeps } from './BuilderDeps';

export class SelectionManager {
  constructor(private d: BuilderDeps) {}

  selectElement = (id: string | null, isMulti: boolean = false): void => {
    const { elementsRef, setSelectedIds, setSelectedConnectionId, setIsPropertiesOpen } = this.d;
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

  selectConnection = (id: string | null): void => {
    const { setSelectedConnectionId, setSelectedIds, setIsPropertiesOpen } = this.d;
    setSelectedConnectionId(id);
    if (id) {
      setSelectedIds([]);
      setIsPropertiesOpen(true);
    }
  };

  selectAll = (): void => {
    const { elementsRef, setSelectedIds, setSelectedConnectionId } = this.d;
    setSelectedIds(elementsRef.current.map(el => el.id));
    setSelectedConnectionId(null);
  };

  copySelected = (): void => {
    const { selectedIds, elementsRef, setCopiedElements } = this.d;
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
  };

  pasteCopied = (): void => {
    const { copiedElements, saveHistory, setElements, setSelectedIds } = this.d;
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
  };
}
