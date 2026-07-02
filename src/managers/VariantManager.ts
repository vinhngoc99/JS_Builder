// =============================================================================
// VariantManager — multi-variant (A/B) document management and import.
//
// Switching/adding/deleting a variant snapshots the live document back into the
// variants array before loading the target. Import replaces or merges state
// parsed by ImportService.
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { CanvasElement, Connection, BrushStroke, Variant } from '../types';
import { migrateConnections, migrateElements, migrateVariants } from '../models/migration';
import { ImportService } from '../services/ImportService';
import { BuilderDeps } from './BuilderDeps';

export class VariantManager {
  constructor(private d: BuilderDeps) {}

  switchVariant = (targetId: string): void => {
    const {
      activeVariantId, variants, elements, connections, brushStrokes, guides,
      setActiveVariantIdState, setVariants, setElements, setConnections, setBrushStrokes,
      setGuides, setSelectedIds, setSelectedConnectionId, setHistory, setRedoStack,
    } = this.d;
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

  addVariant = (): void => {
    const {
      variants, saveHistory, activeVariantId, elements, connections, brushStrokes, guides,
      setVariants, setActiveVariantIdState, setElements, setConnections, setBrushStrokes,
      setGuides, setSelectedIds, setSelectedConnectionId, setHistory, setRedoStack,
    } = this.d;
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

  deleteVariant = (id: string): void => {
    const {
      variants, saveHistory, activeVariantId,
      setActiveVariantIdState, setVariants, setElements, setConnections, setBrushStrokes,
      setGuides, setSelectedIds, setSelectedConnectionId, setHistory, setRedoStack,
    } = this.d;
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

  renameVariant = (id: string, name: string): void => {
    this.d.setVariants(prev => prev.map(v => v.id === id ? { ...v, name } : v));
  };

  importHTML = (htmlText: string): boolean => {
    const {
      saveHistory, setVariants, setActiveVariantIdState, setElements, setConnections,
      setBrushStrokes, setGuides, setTheme, setSelectedIds, setSelectedConnectionId,
      setHistory, setRedoStack,
    } = this.d;
    try {
      const state = ImportService.parseStateFromHtml(htmlText);
      if (!state) return false;
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

  importCodeAndMerge = (code: string): boolean => {
    const { saveHistory, elementsRef, setElements, setConnections, setBrushStrokes, setSelectedIds } = this.d;
    try {
      const state = ImportService.parseStateFromCode(code);

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

      const existingIds = new Set(elementsRef.current.map(el => el.id));
      const { newElements, newConnections, newBrushStrokes } = ImportService.remapForMerge(
        importedElements,
        importedConnections,
        importedBrushStrokes,
        existingIds
      );

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
}
