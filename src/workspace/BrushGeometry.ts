import type { BrushStroke, CanvasElement } from '../types';
import type { Point } from './CoordinateSystem';
import { GraphGeometry } from './GraphGeometry';
import { getDistanceToSegment } from '../services/dom-utils';

export class BrushGeometry {
  static translate(strokes: BrushStroke[], before: CanvasElement[], after: CanvasElement[]): BrushStroke[] {
    const from = new GraphGeometry(before), to = new GraphGeometry(after);
    return strokes.map(stroke => {
      if (!stroke.attachedNodeId) return stroke;
      const a = from.layout(stroke.attachedNodeId), b = to.layout(stroke.attachedNodeId);
      if (!a || !b) return stroke;
      if (Object.keys(a.matrix).every(key => a.matrix[key as keyof typeof a.matrix] === b.matrix[key as keyof typeof b.matrix])) return stroke;
      return { ...stroke, points: stroke.points.map(p => GraphGeometry.transform(b.matrix, GraphGeometry.inverse(a.matrix, p))) };
    });
  }
  static erase(strokes: BrushStroke[], point: Point, last: Point | null, radius: number, id: () => string): BrushStroke[] {
    let changed = false;
    const result: BrushStroke[] = [];
    for (const stroke of strokes) {
      let points: Point[] = [];
      let part = 0;
      const flush = () => { if (points.length > 1) result.push({ ...stroke, id: part++ ? id() : stroke.id, points }); points = []; };
      for (const p of stroke.points) {
        const distance = last ? getDistanceToSegment(p, last, point) : Math.hypot(p.x - point.x, p.y - point.y);
        if (distance <= radius + stroke.width / 2) { flush(); changed = true; } else points.push(p);
      }
      flush();
    }
    return changed ? result : strokes;
  }
}
