// =============================================================================
// GeometryService — pure spatial math over the element tree.
//
// No React, no state: given an element and the full element list, compute
// absolute canvas bounds (walking the parent chain) and hit-test brush strokes.
// Extracted verbatim from BuilderContext to keep behavior identical.
// =============================================================================

import { CanvasElement } from '../types';

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const GeometryService = {
  /**
   * Absolute canvas bounds of an element, accounting for nested parents.
   * Parents contribute a 16px inset plus a 45px header offset; fillParent
   * children stretch to the parent's inner box.
   */
  getElementCanvasBounds(el: CanvasElement, allElements: CanvasElement[]): Bounds {
    const chain: CanvasElement[] = [el];
    let parentId = el.parentId;
    while (parentId) {
      const parent = allElements.find(parentEl => parentEl.id === parentId);
      if (!parent) break;
      chain.unshift(parent);
      parentId = parent.parentId;
    }

    const root = chain[0];
    let bounds: Bounds = { x: root.x, y: root.y, width: root.width, height: root.height };
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
  },

  /**
   * Topmost visible element whose bounds contain any of the given points,
   * or null. Used to attach a brush stroke to the node it was drawn over.
   */
  findBrushAttachmentElementId(
    points: { x: number; y: number }[],
    allElements: CanvasElement[]
  ): string | null {
    for (let i = allElements.length - 1; i >= 0; i--) {
      const el = allElements[i];
      if (el.visible === false) continue;
      const bounds = this.getElementCanvasBounds(el, allElements);
      const intersects = points.some(p =>
        p.x >= bounds.x &&
        p.x <= bounds.x + bounds.width &&
        p.y >= bounds.y &&
        p.y <= bounds.y + bounds.height
      );
      if (intersects) return el.id;
    }
    return null;
  },
};
