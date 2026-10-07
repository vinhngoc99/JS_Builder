import type { CanvasElement, Connection, PortPosition } from '../types';
import { GraphGeometry } from './GraphGeometry';

export class FlowController {
  readonly openIds = new Set<string>();
  readonly activatedEdges = new Set<string>();
  constructor(private elements: () => CanvasElement[], private connections: () => Connection[], private visibility: (ids: Set<string>, visible: boolean) => void) {}
  reset(): void {
    this.openIds.clear(); this.activatedEdges.clear();
    const hidden = new Set<string>(), byId = new Map(this.elements().map(el => [el.id, el]));
    const queue = this.connections().filter(c => byId.get(c.fromId)?.interactive).map(c => c.toId);
    while (queue.length) {
      const id = queue.shift()!, el = byId.get(id); if (!el || el.pinned || hidden.has(id)) continue;
      hidden.add(id); if (!el.interactive) this.connections().filter(c => c.fromId === id).forEach(c => queue.push(c.toId));
    }
    this.visibility(hidden, false);
  }
  toggleOpen(id: string): void {
    if (this.openIds.has(id)) this.openIds.delete(id);
    else { this.openIds.add(id); this.connections().filter(c => c.fromId === id).forEach(c => this.activatedEdges.delete(c.id)); }
  }
  reveal(id: string): void { this.cascade([id], true); }
  toggle(id: string, port: PortPosition): void {
    const edges = this.connections().filter(c => c.fromId === id && c.fromPort === port);
    const show = edges.some(c => !this.activatedEdges.has(c.id));
    edges.forEach(c => { if (show) this.activatedEdges.add(c.id); else this.activatedEdges.delete(c.id); });
    this.cascade(edges.map(c => c.toId), show);
  }
  private cascade(queue: string[], show: boolean): void {
    const ids = new Set<string>(), byId = new Map(this.elements().map(e => [e.id, e]));
    while (queue.length) {
      const id = queue.shift()!, el = byId.get(id);
      if (!el || ids.has(id) || !show && el.pinned) continue;
      ids.add(id);
      if (!show) { this.openIds.delete(id); this.connections().filter(c => c.fromId === id).forEach(c => this.activatedEdges.delete(c.id)); }
      if (!el.interactive || !show) this.connections().filter(c => c.fromId === id).forEach(c => queue.push(c.toId));
    }
    this.visibility(ids, show);
  }
  available(): { id: string; port: PortPosition }[] {
    const byId = new Map(this.elements().map(e => [e.id, e]));
    const geometry = new GraphGeometry(this.elements());
    const seen = new Set<string>();
    return this.connections().flatMap(c => {
      const owner = byId.get(c.fromId), key = `${c.fromId}:${c.fromPort}`;
      if (!owner?.interactive || !geometry.visible(owner.id) || owner.disabled || this.activatedEdges.has(c.id) || seen.has(key)) return [];
      seen.add(key); return [{ id: c.fromId, port: c.fromPort }];
    });
  }
}
