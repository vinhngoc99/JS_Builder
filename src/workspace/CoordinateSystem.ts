export interface Point { x: number; y: number }
export interface Viewport { pan: Point; scale: number }
export interface Rect extends Point { width: number; height: number }

export class CoordinateSystem {
  static screenToWorld(point: Point, viewport: Viewport): Point {
    return { x: (point.x - viewport.pan.x) / viewport.scale, y: (point.y - viewport.pan.y) / viewport.scale };
  }

  static worldToScreen(point: Point, viewport: Viewport): Point {
    return { x: point.x * viewport.scale + viewport.pan.x, y: point.y * viewport.scale + viewport.pan.y };
  }

  static zoomAt(viewport: Viewport, anchor: Point, scale: number): Viewport {
    const world = this.screenToWorld(anchor, viewport);
    const nextScale = Math.max(0.05, Math.min(20, scale));
    return { scale: nextScale, pan: { x: anchor.x - world.x * nextScale, y: anchor.y - world.y * nextScale } };
  }

  static fit(bounds: Rect, size: { width: number; height: number }, padding = 50, maxScale = 1.5): Viewport {
    const scale = Math.max(0.05, Math.min(maxScale, Math.max(1, size.width - padding * 2) / Math.max(1, bounds.width), Math.max(1, size.height - padding * 2) / Math.max(1, bounds.height)));
    return { scale, pan: { x: size.width / 2 - (bounds.x + bounds.width / 2) * scale, y: size.height / 2 - (bounds.y + bounds.height / 2) * scale } };
  }
}
