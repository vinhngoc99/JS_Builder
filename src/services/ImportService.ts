// =============================================================================
// ImportService — pure parsing/remapping for importing builder state.
//
// Extracts the embedded state JSON from an exported HTML document (or raw JSON)
// and remaps element/connection/brush ids when merging imported content into an
// existing document. No React, no state. Logic matches the original inline code.
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { CanvasElement, Connection, BrushStroke } from '../types';

const STATE_SCRIPT_RE = /<script id="js-builder-state" type="application\/json">([\s\S]*?)<\/script>/;

export const ImportService = {
  /**
   * Parse the embedded state from an exported HTML string.
   * Returns null when the state script tag is absent. May throw on malformed
   * JSON (caller is expected to catch and treat as failure).
   */
  parseStateFromHtml(htmlText: string): any | null {
    const match = htmlText.match(STATE_SCRIPT_RE);
    if (!match || !match[1]) return null;
    return JSON.parse(match[1]);
  },

  /**
   * Parse state from either an exported HTML string or raw JSON. May throw on
   * malformed input (caller catches).
   */
  parseStateFromCode(code: string): any {
    const match = code.match(STATE_SCRIPT_RE);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    return JSON.parse(code);
  },

  /**
   * Remap imported elements/connections/brush strokes with fresh ids and a
   * +50/+50 offset, preserving parent links within the import and dropping
   * connections whose endpoints are neither imported nor already present.
   */
  remapForMerge(
    importedElements: CanvasElement[],
    importedConnections: Connection[],
    importedBrushStrokes: BrushStroke[],
    existingIds: Set<string>
  ): { newElements: CanvasElement[]; newConnections: Connection[]; newBrushStrokes: BrushStroke[] } {
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

    return { newElements, newConnections, newBrushStrokes };
  },
};
