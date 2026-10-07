import type { CanvasElement, PortPosition, Variant } from '../types';
import type { SceneEvent, SceneData } from './contract';
import { SceneRenderer } from './SceneRenderer';
import { GraphGeometry } from './GraphGeometry';
import { CoordinateSystem, type Point } from './CoordinateSystem';

export interface GestureState extends SceneData {
  selectedIds: string[];
  presenting: boolean;
  editing: boolean;
  snap: boolean;
  guides: Variant['guides'];
  connecting: { id: string; port: PortPosition } | null;
  focalId: string | null;
}
export interface GestureAdapter {
  state: () => GestureState;
  select: (id: string, multi: boolean) => void;
  selectConnection: (id: string) => void;
  patch: (changes: { id: string; updates: Partial<CanvasElement> }[]) => void;
  history: () => void;
  connect: (from: string, fromPort: PortPosition, to: string, toPort: PortPosition) => void;
  setConnecting: (value: GestureState['connecting']) => void;
  setFocal: (id: string | null) => void;
  snapGuides: (point: { x: number | null; y: number | null }) => void;
}

export class GestureController {
  private gesture?: { target: SceneEvent['target']; start: Point; elements: CanvasElement[]; primary: CanvasElement; geometry: GraphGeometry; moved: boolean; history: boolean };
  private pending?: PointerEvent;
  private frame = 0;
  moved = false;
  constructor(private scene: SceneRenderer, private adapter: GestureAdapter) {
    window.addEventListener('pointermove', this.move); window.addEventListener('pointerup', this.up); window.addEventListener('pointercancel', this.cancel);
  }
  down = ({ target, event }: SceneEvent): void => {
    const state = this.adapter.state(); this.moved = false;
    if (target.kind === 'connection') { if (state.editing && !state.presenting) this.adapter.selectConnection(target.id); return; }
    if (target.kind === 'port') { this.adapter.setConnecting({ id: target.id, port: target.port }); return; }
    if (target.kind === 'flow') return;
    const el = state.elements.find(e => e.id === target.id); if (!el) return;
    if (state.presenting) return;
    if (target.kind === 'focal') { this.adapter.setFocal(state.focalId === el.id ? null : el.id); return; }
    if (state.editing) this.adapter.select(el.id, event.shiftKey);
    if (el.locked || event.button !== 0) return;
    const ids = state.selectedIds.includes(el.id) ? state.selectedIds : [el.id];
    const geometry = new GraphGeometry(state.elements);
    const selectedAncestor = (id: string): boolean => { let parent = geometry.parentId(id); while (parent) { if (ids.includes(parent)) return true; parent = geometry.parentId(parent); } return false; };
    const selected = state.editing ? state.elements.filter(e => ids.includes(e.id) && !selectedAncestor(e.id) && !e.locked) : [el];
    this.gesture = { target, start: { x: event.clientX, y: event.clientY }, elements: selected.map(e => ({ ...e })), primary: el, geometry, moved: false, history: false };
  };
  portUp = ({ target }: SceneEvent): void => {
    const connecting = this.adapter.state().connecting;
    if (target.kind === 'port' && connecting && connecting.id !== target.id) this.adapter.connect(connecting.id, connecting.port, target.id, target.port);
    if (target.kind === 'port') this.adapter.setConnecting(null);
  };
  private move = (event: PointerEvent): void => {
    if (!this.gesture) return;
    this.pending = event;
    if (!this.frame) this.frame = requestAnimationFrame(() => { this.frame = 0; if (this.pending) this.apply(this.pending); });
  };
  private apply(event: PointerEvent): void {
    const g = this.gesture; if (!g) return;
    const state = this.adapter.state(), scale = this.scene.viewport.scale;
    let dx = (event.clientX - g.start.x) / scale, dy = (event.clientY - g.start.y) / scale;
    if (!g.moved && Math.hypot(event.clientX - g.start.x, event.clientY - g.start.y) < 3) return;
    g.moved = true; this.moved = true;
    if (!g.history) { this.adapter.history(); g.history = true; }
    const changes: { id: string; updates: Partial<CanvasElement> }[] = [];
    const focalId = state.focalId;
    if (focalId === g.primary.id && g.primary.type === 'image') {
      const [px, py] = g.primary.objectPosition.split(' ').map(Number.parseFloat);
      const layout = this.scene.geometry.layout(focalId)!;
      changes.push({ id: focalId, updates: { objectPosition: `${Math.max(0, Math.min(100, px - dx / layout.local.width * 100))}% ${Math.max(0, Math.min(100, py - dy / Math.max(1, layout.local.height - layout.header) * 100))}%` } });
    } else if (g.target.kind === 'rotate') {
      const layout = this.scene.geometry.layout(g.primary.id); if (!layout) return;
      const center = GraphGeometry.transform(layout.matrix, { x: layout.local.width / 2, y: layout.local.height / 2 });
      const point = CoordinateSystem.screenToWorld(this.scene.clientToScreen({ x: event.clientX, y: event.clientY }), this.scene.viewport);
      let angle = Math.atan2(point.y - center.y, point.x - center.x) * 180 / Math.PI + 90;
      if (event.shiftKey) angle = Math.round(angle / 15) * 15;
      const delta = angle - Math.atan2(layout.matrix.b, layout.matrix.a) * 180 / Math.PI;
      g.elements.forEach(el => changes.push({ id: el.id, updates: { rotation: (el.rotation + delta + 360) % 360 } }));
    } else if (g.target.kind === 'resize') {
      const handle = g.target.handle, p = g.primary;
      const layout = g.geometry.layout(p.id)!;
      const local = GraphGeometry.inverse(layout.matrix, { x: layout.matrix.tx + dx, y: layout.matrix.ty + dy }); dx = local.x; dy = local.y;
      const baseWidth = p.fillParent ? layout.local.width : p.width, baseHeight = p.fillParent ? layout.local.height : p.height;
      let width = Math.max(2, baseWidth + (handle.includes('w') ? -dx : dx)), height = Math.max(2, baseHeight + (handle.includes('n') ? -dy : dy));
      if (state.snap && !event.shiftKey && !event.altKey && !p.aspectRatioLocked && !p.rotation && !p.fillParent) {
        const candidatesX: number[] = [], candidatesY: number[] = [];
        state.elements.filter(e => !g.elements.some(s => s.id === e.id) && e.parentId === p.parentId).forEach(e => { candidatesX.push(e.x, e.x + e.width / 2, e.x + e.width); candidatesY.push(e.y, e.y + e.height / 2, e.y + e.height); });
        if (!p.parentId) state.guides.forEach(guide => (guide.type === 'vertical' ? candidatesX : candidatesY).push(guide.position));
        const nearest = (values: number[], source: number) => values.reduce<number | null>((best, value) => Math.abs(value - source) < Math.min(8 / scale, best === null ? Infinity : Math.abs(best - source)) ? value : best, null);
        const x = nearest(candidatesX, handle.includes('w') ? p.x + baseWidth - width : p.x + width), y = nearest(candidatesY, handle.includes('n') ? p.y + baseHeight - height : p.y + height);
        if (x !== null) width = Math.max(2, handle.includes('w') ? p.x + baseWidth - x : x - p.x);
        if (y !== null) height = Math.max(2, handle.includes('n') ? p.y + baseHeight - y : y - p.y);
        this.adapter.snapGuides({ x: p.parentId ? null : x, y: p.parentId ? null : y });
      }
      if (event.altKey || p.aspectRatioLocked) { const ratio = baseWidth / baseHeight; if (Math.abs(dx) >= Math.abs(dy)) height = width / ratio; else width = height * ratio; }
      if (g.elements.length === 1) {
        const parentId = g.geometry.parentId(p.id), parent = parentId ? g.geometry.layout(parentId) : undefined;
        const origin = GraphGeometry.transform(layout.matrix, { x: handle.includes('w') ? baseWidth - width : 0, y: handle.includes('n') ? baseHeight - height : 0 });
        const position = parent ? GraphGeometry.inverse(parent.matrix, origin) : origin;
        const angle = (p.fillParent ? 0 : p.rotation) * Math.PI / 180, a = Math.cos(angle) * (p.scaleX ?? 1), b = Math.sin(angle) * (p.scaleX ?? 1), c = -Math.sin(angle) * (p.scaleY ?? 1), d = Math.cos(angle) * (p.scaleY ?? 1);
        changes.push({ id: p.id, updates: { width, height, fillParent: false, x: position.x - (parent ? 16 : 0) - width / 2 + a * width / 2 + c * height / 2, y: position.y - (parent ? parent.header + 16 : 0) - height / 2 + b * width / 2 + d * height / 2 } });
        this.adapter.patch(changes); return;
      }
      const sx = width / p.width, sy = height / p.height;
      const minX = Math.min(...g.elements.map(e => e.x)), minY = Math.min(...g.elements.map(e => e.y)), maxX = Math.max(...g.elements.map(e => e.x + e.width)), maxY = Math.max(...g.elements.map(e => e.y + e.height));
      const bx = handle.includes('w') ? maxX - (maxX - minX) * sx : minX, by = handle.includes('n') ? maxY - (maxY - minY) * sy : minY;
      g.elements.forEach(el => changes.push({ id: el.id, updates: { x: bx + (el.x - minX) * sx, y: by + (el.y - minY) * sy, width: Math.max(2, el.width * sx), height: Math.max(2, el.height * sy) } }));
    } else {
      if (event.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
      const p = g.primary;
      const primaryParentId = g.geometry.parentId(p.id), primaryParent = primaryParentId ? g.geometry.layout(primaryParentId) : undefined;
      if (primaryParent) { const local = GraphGeometry.inverseVector(primaryParent.matrix, { x: dx, y: dy }); dx = local.x; dy = local.y; }
      if (state.snap && !event.shiftKey) {
        let bestX = 8 / scale, bestY = 8 / scale, snapX: number | null = null, snapY: number | null = null;
        const sourcesX = [p.x + dx, p.x + dx + p.width / 2, p.x + dx + p.width], sourcesY = [p.y + dy, p.y + dy + p.height / 2, p.y + dy + p.height];
        const candidatesX: number[] = [], candidatesY: number[] = [];
        state.elements.filter(e => !g.elements.some(s => s.id === e.id) && e.parentId === p.parentId).forEach(e => { candidatesX.push(e.x, e.x + e.width / 2, e.x + e.width); candidatesY.push(e.y, e.y + e.height / 2, e.y + e.height); });
        if (!p.parentId) state.guides.forEach(guide => (guide.type === 'vertical' ? candidatesX : candidatesY).push(guide.position));
        let sx = 0, sy = 0;
        candidatesX.forEach(target => sourcesX.forEach(source => { const distance = target - source; if (Math.abs(distance) < bestX) { bestX = Math.abs(distance); sx = distance; snapX = target; } }));
        candidatesY.forEach(target => sourcesY.forEach(source => { const distance = target - source; if (Math.abs(distance) < bestY) { bestY = Math.abs(distance); sy = distance; snapY = target; } }));
        dx += sx; dy += sy;
        this.adapter.snapGuides({ x: p.parentId ? null : snapX, y: p.parentId ? null : snapY });
      }
      const worldDelta = primaryParent ? GraphGeometry.transformVector(primaryParent.matrix, { x: dx, y: dy }) : { x: dx, y: dy };
      g.elements.forEach(el => {
        const parentId = g.geometry.parentId(el.id), parent = parentId ? g.geometry.layout(parentId) : undefined;
        const delta = parent ? GraphGeometry.inverseVector(parent.matrix, worldDelta) : worldDelta;
        changes.push({ id: el.id, updates: { x: el.x + delta.x, y: el.y + delta.y } });
      });
    }
    this.adapter.patch(changes);
  }
  private up = (event: PointerEvent): void => {
    if (this.pending && this.gesture) this.apply(this.pending); this.pending = undefined; cancelAnimationFrame(this.frame); this.frame = 0;
    const g = this.gesture; this.gesture = undefined; this.adapter.snapGuides({ x: null, y: null });
    if (!g?.moved || g.target.kind !== 'element' || !this.adapter.state().editing || g.elements.length !== 1 || g.primary.type === 'node') return;
    const state = this.adapter.state(), geometry = new GraphGeometry(state.elements), el = state.elements.find(e => e.id === g.primary.id); if (!el || el.fillParent) return;
    const point = CoordinateSystem.screenToWorld(this.scene.clientToScreen({ x: event.clientX, y: event.clientY }), this.scene.viewport);
    const parentId = this.scene.hit(point, true, new Set([el.id]));
    if (parentId === el.parentId) return;
    const own = geometry.layout(el.id); if (!own) return;
    const absolute = GraphGeometry.transform(own.matrix, { x: own.local.width / 2, y: own.local.height / 2 });
    const parent = parentId ? geometry.layout(parentId) : undefined;
    const local = parent ? GraphGeometry.inverse(parent.matrix, absolute) : absolute;
    const rotation = (Math.atan2(own.matrix.b, own.matrix.a) - (parent ? Math.atan2(parent.matrix.b, parent.matrix.a) : 0)) * 180 / Math.PI;
    this.adapter.patch([{ id: el.id, updates: { parentId, rotation, x: local.x - own.local.width / 2 - (parent ? 16 : 0), y: local.y - own.local.height / 2 - (parent ? parent.header + 16 : 0) } }]);
  };
  private cancel = (): void => { this.gesture = undefined; this.pending = undefined; cancelAnimationFrame(this.frame); this.frame = 0; this.adapter.snapGuides({ x: null, y: null }); };
  destroy(): void { this.cancel(); window.removeEventListener('pointermove', this.move); window.removeEventListener('pointerup', this.up); window.removeEventListener('pointercancel', this.cancel); }
}
