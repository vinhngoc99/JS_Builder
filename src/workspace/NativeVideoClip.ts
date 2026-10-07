import { intersection, difference, type MultiPolygon, type Ring } from 'polygon-clipping';
import type { CanvasElement } from '../types';
import { GraphGeometry, type ElementLayout } from './GraphGeometry';
import { SHAPE_POINTS } from './Drawing';

// Native video playback cannot be rasterized into a WebGL texture. Clip its
// overlay to ancestors and visible foreground geometry instead.
export class NativeVideoClip {
  static path(id: string, geometry: GraphGeometry): string {
    const own = geometry.layout(id)!;
    const toLocal = (ring: Ring) => ring.map(([x, y]) => { const p = GraphGeometry.inverse(own.matrix, { x, y }); return [p.x, p.y - own.header] as [number, number]; });
    const rectangle = (l: ElementLayout, top = 0): Ring => [[0, top], [l.local.width, top], [l.local.width, l.local.height], [0, l.local.height], [0, top]].map(([x, y]) => { const p = GraphGeometry.transform(l.matrix, { x, y }); return [p.x, p.y]; });
    let visible: MultiPolygon = [[toLocal(rectangle(own, own.header))]];
    let parentId = geometry.parentId(id);
    const ancestors = new Set<string>();
    while (parentId) {
      ancestors.add(parentId); const el = geometry.elements.get(parentId)!, layout = geometry.layout(parentId)!;
      if (el.type === 'node') visible = intersection(visible, [toLocal(rectangle(layout, layout.header))]);
      parentId = geometry.parentId(parentId);
    }
    const order = geometry.paintOrder(), index = order.findIndex(el => el.id === id);
    for (const el of order.slice(index + 1)) {
      if (ancestors.has(el.id) || !geometry.visible(el.id) || el.opacity === 0 || !NativeVideoClip.occludes(el)) continue;
      const layout = geometry.layout(el.id)!;
      let ring = rectangle(layout);
      if (el.type === 'shape') {
        const vertices = SHAPE_POINTS[el.shapeType];
        if (vertices) ring = Array.from({ length: vertices.length / 2 }, (_, i) => { const p = GraphGeometry.transform(layout.matrix, { x: vertices[i * 2] * layout.local.width / 100, y: vertices[i * 2 + 1] * layout.local.height / 100 }); return [p.x, p.y] as [number, number]; });
        if (el.shapeType === 'ellipse') ring = Array.from({ length: 49 }, (_, i) => { const a = i / 48 * Math.PI * 2, p = GraphGeometry.transform(layout.matrix, { x: (1 + Math.cos(a)) * layout.local.width / 2, y: (1 + Math.sin(a)) * layout.local.height / 2 }); return [p.x, p.y] as [number, number]; });
      }
      visible = difference(visible, [toLocal(ring)]);
      if (!visible.length) break;
    }
    const path = visible.flatMap(polygon => polygon.map(ring => ring.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(3)} ${y.toFixed(3)}`).join(' ') + ' Z')).join(' ');
    return `path(evenodd, "${path || 'M0 0 Z'}")`;
  }
  private static occludes(el: CanvasElement): boolean {
    if (el.type === 'icon' || el.type === 'shape' && ['line', 'arrow', 'elbow'].includes(el.shapeType)) return false;
    return el.type === 'image' || el.type === 'video' || el.fill.type !== 'none' && el.fill.color !== 'transparent';
  }
}
