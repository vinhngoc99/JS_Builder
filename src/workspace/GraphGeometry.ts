import type { CanvasElement, Connection, PortPosition } from '../types';
import type { Point, Rect } from './CoordinateSystem';
import { getConnectionArrow, getConnectionStroke } from '../models/Connection';

export interface Transform { a: number; b: number; c: number; d: number; tx: number; ty: number }
export interface ElementLayout { local: Rect; matrix: Transform; bounds: Rect; header: number }
const identity: Transform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };

export class GraphGeometry {
  readonly elements: Map<string, CanvasElement>;
  readonly layouts = new Map<string, ElementLayout>();
  private parents = new Map<string, string | undefined>();
  constructor(elements: CanvasElement[]) { this.elements = new Map(elements.map(el => [el.id, el])); }
  parentId(id: string): string | undefined {
    if (this.parents.has(id)) return this.parents.get(id);
    const seen = new Set<string>(); let el = this.elements.get(id);
    while (el) { if (seen.has(el.id)) { this.parents.set(id, undefined); return; } seen.add(el.id); el = el.parentId ? this.elements.get(el.parentId) : undefined; }
    const parent = this.elements.get(id)?.parentId || undefined;
    const result = parent && this.elements.has(parent) ? parent : undefined;
    this.parents.set(id, result); return result;
  }
  paintOrder(): CanvasElement[] {
    const children = new Map<string | undefined, CanvasElement[]>();
    this.elements.forEach(el => { const parent = this.parentId(el.id), siblings = children.get(parent) || []; siblings.push(el); children.set(parent, siblings); });
    const result: CanvasElement[] = [];
    const walk = (parent?: string) => (children.get(parent) || []).sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).forEach(el => { result.push(el); walk(el.id); });
    walk(); return result;
  }

  static multiply(p: Transform, q: Transform): Transform {
    return { a: p.a * q.a + p.c * q.b, b: p.b * q.a + p.d * q.b, c: p.a * q.c + p.c * q.d, d: p.b * q.c + p.d * q.d, tx: p.a * q.tx + p.c * q.ty + p.tx, ty: p.b * q.tx + p.d * q.ty + p.ty };
  }
  static transform(m: Transform, p: Point): Point { return { x: m.a * p.x + m.c * p.y + m.tx, y: m.b * p.x + m.d * p.y + m.ty }; }
  static transformVector(m: Transform, p: Point): Point { return { x: m.a * p.x + m.c * p.y, y: m.b * p.x + m.d * p.y }; }
  static inverseVector(m: Transform, p: Point): Point {
    const det = m.a * m.d - m.b * m.c || 1;
    return { x: (m.d * p.x - m.c * p.y) / det, y: (-m.b * p.x + m.a * p.y) / det };
  }
  static inverse(m: Transform, p: Point): Point {
    const det = m.a * m.d - m.b * m.c || 1;
    return { x: (m.d * (p.x - m.tx) - m.c * (p.y - m.ty)) / det, y: (-m.b * (p.x - m.tx) + m.a * (p.y - m.ty)) / det };
  }
  layout(id: string, visited = new Set<string>()): ElementLayout | undefined {
    const cached = this.layouts.get(id);
    if (cached) return cached;
    const el = this.elements.get(id);
    if (!el || visited.has(id)) return;
    visited.add(id);
    const parentId = this.parentId(id);
    const parent = parentId ? this.layout(parentId, visited) : undefined;
    const inset = parent ? 16 : 0;
    const header = el.type === 'node' && el.name.trim() ? 45 : (el.type === 'image' || el.type === 'video') && el.name.trim() ? 27 : 0;
    const local = el.fillParent && parent
      ? { x: inset, y: parent.header + inset, width: Math.max(1, parent.local.width - inset * 2), height: Math.max(1, parent.local.height - parent.header - inset * 2) }
      : { x: el.x + inset, y: el.y + (parent?.header || 0) + inset, width: Math.max(1, el.width), height: Math.max(1, el.height) };
    const angle = (el.fillParent && parent ? 0 : el.rotation || 0) * Math.PI / 180;
    const a = Math.cos(angle) * (el.scaleX ?? 1), b = Math.sin(angle) * (el.scaleX ?? 1);
    const c = -Math.sin(angle) * (el.scaleY ?? 1), d = Math.cos(angle) * (el.scaleY ?? 1);
    const cx = local.width / 2, cy = local.height / 2;
    const matrix = GraphGeometry.multiply(parent?.matrix || identity, { a, b, c, d, tx: local.x + cx - a * cx - c * cy, ty: local.y + cy - b * cx - d * cy });
    const corners = [{ x: 0, y: 0 }, { x: local.width, y: 0 }, { x: 0, y: local.height }, { x: local.width, y: local.height }].map(p => GraphGeometry.transform(matrix, p));
    const x = Math.min(...corners.map(p => p.x)), y = Math.min(...corners.map(p => p.y));
    const result = { local, matrix, header, bounds: { x, y, width: Math.max(...corners.map(p => p.x)) - x, height: Math.max(...corners.map(p => p.y)) - y } };
    this.layouts.set(id, result);
    return result;
  }
  visible(id: string): boolean {
    const seen = new Set<string>();
    let el = this.elements.get(id);
    while (el) { if (!el.visible || seen.has(el.id)) return false; seen.add(el.id); el = el.parentId ? this.elements.get(el.parentId) : undefined; }
    return true;
  }
  contains(id: string, point: Point): boolean {
    const l = this.layout(id);
    if (!l) return false;
    const p = GraphGeometry.inverse(l.matrix, point);
    if (!(p.x >= 0 && p.y >= 0 && p.x <= l.local.width && p.y <= l.local.height)) return false;
    let parentId = this.parentId(id);
    while (parentId) {
      const parent = this.elements.get(parentId)!, layout = this.layout(parentId)!;
      if (parent.type === 'node') { const local = GraphGeometry.inverse(layout.matrix, point); if (local.x < 0 || local.x > layout.local.width || local.y < layout.header || local.y > layout.local.height) return false; }
      parentId = this.parentId(parentId);
    }
    return true;
  }
  port(id: string, port: PortPosition): (Point & { normal: Point }) | undefined {
    const l = this.layout(id); if (!l) return;
    const w = l.local.width, h = l.local.height;
    const p = port === 'left' ? { x: 0, y: h / 2 } : port === 'right' ? { x: w, y: h / 2 } : port === 'top' ? { x: w / 2, y: 0 } : { x: w / 2, y: h };
    const n = port === 'left' ? { x: -1, y: 0 } : port === 'right' ? { x: 1, y: 0 } : port === 'top' ? { x: 0, y: -1 } : { x: 0, y: 1 };
    const normal = { x: l.matrix.a * n.x + l.matrix.c * n.y, y: l.matrix.b * n.x + l.matrix.d * n.y };
    const len = Math.hypot(normal.x, normal.y) || 1;
    return { ...GraphGeometry.transform(l.matrix, p), normal: { x: normal.x / len, y: normal.y / len } };
  }
  connection(conn: Connection): Point[] {
    const start = this.port(conn.fromId, conn.fromPort), end = this.port(conn.toId, conn.toPort);
    if (!start || !end) return [];
    const arrow = getConnectionArrow(conn), stroke = getConnectionStroke(conn);
    const gap = Math.max(1.8, arrow.size * 0.3);
    const s = { x: start.x + start.normal.x * (arrow.start === 'none' ? 0 : gap), y: start.y + start.normal.y * (arrow.start === 'none' ? 0 : gap) };
    const e = { x: end.x + end.normal.x * (arrow.end === 'none' ? 0 : gap), y: end.y + end.normal.y * (arrow.end === 'none' ? 0 : gap) };
    if (stroke.lineType === 'straight') return [s, e];
    const dist = Math.min(Math.max(Math.hypot(e.x - s.x, e.y - s.y) * 0.35, 30), 120);
    const c1 = { x: s.x + start.normal.x * dist, y: s.y + start.normal.y * dist }, c2 = { x: e.x + end.normal.x * dist, y: e.y + end.normal.y * dist };
    if (stroke.lineType === 'elbow') return [s, c1, { x: c1.x, y: c2.y }, c2, e];
    const points: Point[] = [];
    for (let i = 0; i <= 32; i++) { const t = i / 32, u = 1 - t; points.push({ x: u ** 3 * s.x + 3 * u ** 2 * t * c1.x + 3 * u * t ** 2 * c2.x + t ** 3 * e.x, y: u ** 3 * s.y + 3 * u ** 2 * t * c1.y + 3 * u * t ** 2 * c2.y + t ** 3 * e.y }); }
    return points;
  }
  bounds(): Rect {
    const boxes = [...this.elements.values()].filter(e => !this.parentId(e.id)).flatMap(e => this.layout(e.id)?.bounds || []);
    if (!boxes.length) return { x: 0, y: 0, width: 1, height: 1 };
    const x = Math.min(...boxes.map(b => b.x)), y = Math.min(...boxes.map(b => b.y));
    return { x, y, width: Math.max(...boxes.map(b => b.x + b.width)) - x, height: Math.max(...boxes.map(b => b.y + b.height)) - y };
  }
}
