// =============================================================================
// GeometryService — pure spatial math over the element tree.
//
// No React, no state: given an element and the full element list, compute
// absolute canvas bounds (walking the parent chain) and hit-test brush strokes.
// Shared with the Builder and standalone Pixi runtime.
// =============================================================================

import { CanvasElement } from '../types';
import { GraphGeometry } from '../workspace/GraphGeometry';

export const GeometryService = {
  /**
   * Topmost visible element whose bounds contain any of the given points,
   * or null. Used to attach a brush stroke to the node it was drawn over.
   */
  findBrushAttachmentElementId(
    points: { x: number; y: number }[],
    allElements: CanvasElement[]
  ): string | null {
    const geometry = new GraphGeometry(allElements);
    return geometry.paintOrder().reverse().find(el => geometry.visible(el.id) && points.some(p => geometry.contains(el.id, p)))?.id || null;
  },
};
