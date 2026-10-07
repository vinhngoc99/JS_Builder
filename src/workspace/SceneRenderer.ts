import type { Application, Container, Graphics, TilingSprite, Texture, FederatedPointerEvent, WebGLRenderer } from 'pixi.js';
import type { PixiAPI, SceneData, SceneOptions, SceneCallbacks, SceneTarget, SceneOverlay } from './contract';
import { DEFAULT_SCENE_OPTIONS } from './contract';
import { CoordinateSystem, type Viewport, type Point } from './CoordinateSystem';
import { GraphGeometry } from './GraphGeometry';
import { TextureManager } from './TextureManager';
import { NodeView } from './NodeView';
import { ConnectionView } from './ConnectionView';
import { Palette, strokePath } from './Drawing';
import { AnimationPlayer } from './AnimationPlayer';
import { getDistanceToSegment } from '../services/dom-utils';
import type { BrushStroke, PortPosition } from '../types';
import { getIconSvgPath } from '../icons';

export class SceneRenderer {
  app!: Application;
  world!: Container;
  private grid!: TilingSprite;
  private gridTexture!: Texture;
  private connectionLayer!: Container;
  private elementLayer!: Container;
  private brushLayer!: Container;
  private overlayLayer!: Graphics;
  private nodes = new Map<string, NodeView>();
  private edges = new Map<string, ConnectionView>();
  private strokes = new Map<string, { graphics: Graphics; data: BrushStroke }>();
  readonly textures: TextureManager;
  geometry = new GraphGeometry([]);
  data: SceneData = { elements: [], connections: [], brushStrokes: [] };
  options: SceneOptions = DEFAULT_SCENE_OPTIONS;
  viewport: Viewport = { pan: { x: 0, y: 0 }, scale: 1 };
  size = { width: 1, height: 1 };
  readonly stats = { renders: 0, nodeVisualUpdates: 0, edgeUpdates: 0, culled: 0 };
  private observer?: ResizeObserver;
  private animation?: AnimationPlayer;
  private frame = 0;
  private disposed = false;
  private ready = false;
  private overlay: SceneOverlay = {};
  private palette = new Palette('dark');
  private lastClick = { id: '', time: 0 };
  private editingTextId: string | null = null;
  private controlSignatures = new Map<string, string>();
  private cachedRoots = new Set<string>();
  private cacheDirty = new Set<string>();
  private origin = { x: 0, y: 0 };
  private textSizes = new Map<string, { element: SceneData['elements'][number]; height: number }>();
  private sizeUpdateScheduled = false;

  constructor(private pixi: PixiAPI, private host: HTMLElement, private callbacks: SceneCallbacks = {}) {
    this.textures = new TextureManager(pixi);
  }
  setCallbacks(callbacks: SceneCallbacks): void { this.callbacks = callbacks; }
  refreshOrigin = (): void => { const rect = this.host.getBoundingClientRect(); this.origin = { x: rect.left, y: rect.top }; };
  clientToScreen(point: Point): Point { return { x: point.x - this.origin.x, y: point.y - this.origin.y }; }
  nativeVisual(id: string) {
    const node = this.nodes.get(id); if (!node || !this.ready) return;
    const m = node.container.getGlobalTransform(), s = this.viewport.scale, p = this.viewport.pan;
    return { matrix: { a: m.a / s, b: m.b / s, c: m.c / s, d: m.d / s, tx: (m.tx - p.x) / s, ty: (m.ty - p.y) / s }, alpha: node.container.getGlobalAlpha() };
  }
  async init(): Promise<void> {
    const app = new this.pixi.Application();
    this.app = app;
    try {
      await app.init({ preference: 'webgl', width: Math.max(1, this.host.clientWidth), height: Math.max(1, this.host.clientHeight), backgroundAlpha: 0, antialias: true, resolution: Math.min(devicePixelRatio || 1, 2), autoDensity: true, autoStart: false });
    } catch (error) { this.callbacks.error?.('WebGL unavailable. Enable hardware acceleration or try another browser.'); throw error; }
    if (this.disposed) { app.destroy(true, { children: true }); return; }
    app.stop();
    const gl = (app.renderer as WebGLRenderer).gl;
    this.textures.limitSize(Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)));
    this.host.appendChild(app.canvas);
    app.canvas.dataset.renderer = 'pixi'; app.canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
    app.canvas.addEventListener('webglcontextlost', this.contextLost);
    app.canvas.addEventListener('webglcontextrestored', this.contextRestored);
    window.addEventListener('scroll', this.refreshOrigin, true); window.addEventListener('resize', this.refreshOrigin);
    this.world = new this.pixi.Container({ label: 'world' });
    this.connectionLayer = new this.pixi.Container({ label: 'connections' });
    this.elementLayer = new this.pixi.Container({ label: 'elements', sortableChildren: true });
    this.brushLayer = new this.pixi.Container({ label: 'brush' });
    this.overlayLayer = new this.pixi.Graphics({ label: 'overlays' });
    this.gridTexture = this.createGridTexture();
    this.grid = new this.pixi.TilingSprite({ texture: this.gridTexture, width: 1, height: 1 });
    this.grid.eventMode = 'none'; this.brushLayer.eventMode = 'none'; this.overlayLayer.eventMode = 'none';
    this.world.addChild(this.grid, this.connectionLayer, this.elementLayer, this.brushLayer, this.overlayLayer); app.stage.addChild(this.world);
    app.stage.eventMode = 'static';
    this.animation = new AnimationPlayer(this.pixi, this.invalidate);
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(this.host);
    this.ready = true; this.resize(); this.setData(this.data, this.options);
    document.fonts?.addEventListener('loadingdone', this.fontsLoaded);
    void document.fonts?.ready.then(() => { if (!this.disposed) this.fontsLoaded(); });
  }
  private contextLost = (event: Event): void => { event.preventDefault(); this.callbacks.error?.('Graphics context lost. Waiting for recovery...'); };
  private contextRestored = (): void => { this.callbacks.error?.(''); this.invalidate(); };
  private fontsLoaded = (): void => {
    if (!this.ready || this.disposed) return;
    // Reconcile text after web fonts finish, without touching image textures.
    this.data.elements.forEach(el => { if (el.text) { const copy = { ...el, text: { ...el.text } }; const layout = this.geometry.layout(el.id); if (layout) { const node = this.nodes.get(el.id); node?.update(copy, layout, this.palette); if (node) this.measureText(el, node.textHeight); this.invalidateNode(el.id); } } });
    this.data.connections.forEach(conn => { if (!conn.label) return; const edge = this.edges.get(conn.id); if (edge) { edge.invalidateText(); if (edge.update(conn, this.geometry, this.palette, this.options.selectedConnectionId === conn.id)) this.stats.edgeUpdates++; } });
    this.invalidate();
  };
  private measureText(element: SceneData['elements'][number], height: number): void {
    if (height <= element.height || !this.callbacks.textHeight) return;
    this.textSizes.set(element.id, { element, height });
    if (this.sizeUpdateScheduled) return;
    this.sizeUpdateScheduled = true;
    queueMicrotask(() => {
      this.sizeUpdateScheduled = false; const updates = [...this.textSizes]; this.textSizes.clear();
      if (this.disposed) return;
      updates.forEach(([id, size]) => { if (this.geometry.elements.get(id) === size.element) this.callbacks.textHeight?.(id, size.height); });
    });
  }
  private createGridTexture(): Texture {
    const canvas = document.createElement('canvas'); canvas.width = 24; canvas.height = 24;
    const context = canvas.getContext('2d')!; context.fillStyle = this.palette.color('var(--grid-dot)'); context.beginPath(); context.arc(1, 1, 1, 0, Math.PI * 2); context.fill();
    return this.pixi.Texture.from(canvas);
  }
  resize(): void {
    if (!this.ready || this.disposed) return;
    this.size = { width: Math.max(1, this.host.clientWidth), height: Math.max(1, this.host.clientHeight) };
    this.refreshOrigin();
    this.app.renderer.resize(this.size.width, this.size.height);
    this.app.stage.hitArea = new this.pixi.Rectangle(0, 0, this.size.width, this.size.height);
    this.setViewport(this.viewport);
  }
  setData(data: SceneData, options: SceneOptions = this.options): void {
    this.data = data; this.options = options;
    if (!this.ready || this.disposed) return;
    if (this.palette.theme !== options.theme) {
      this.palette = new Palette(options.theme); const old = this.gridTexture; this.gridTexture = this.createGridTexture(); this.grid.texture = this.gridTexture; old.destroy(true);
    }
    const previousElements = this.geometry.elements;
    this.geometry = new GraphGeometry(data.elements);
    this.animation?.timeline(data.elements);
    const ids = new Set(data.elements.map(el => el.id));
    const leases = [...new Set(data.elements.filter(el => el.type === 'image').map(el => TextureManager.imageUrl(el)))].flatMap(url => this.textures.retainExisting(url) || []);
    try {
    // Detach hierarchy before deleting parents, so retained children survive reparenting.
    this.nodes.forEach(node => this.elementLayer.addChild(node.container));
    this.nodes.forEach((node, id) => { if (!ids.has(id)) { this.animation?.remove(id); node.destroy(); this.nodes.delete(id); this.cachedRoots.delete(id); this.controlSignatures.delete(id); } });
    data.elements.forEach(el => {
      const layout = this.geometry.layout(el.id); if (!layout) return;
      if (previousElements.get(el.id) !== el) this.invalidateNode(el.id);
      let node = this.nodes.get(el.id);
      if (!node) { node = new NodeView(this.pixi, this.textures, () => this.invalidateNode(el.id)); this.nodes.set(el.id, node); this.wire(node.container, { kind: 'element', id: el.id }); }
      node.container.label = el.id; node.children.label = `${el.id}:children`;
      const parentId = this.geometry.parentId(el.id);
      const parent = parentId ? this.nodes.get(parentId) : undefined;
      (parent?.children || this.elementLayer).addChild(node.container);
      node.container.setFromMatrix(new this.pixi.Matrix(layout.matrix.a, layout.matrix.b, layout.matrix.c, layout.matrix.d, layout.matrix.tx, layout.matrix.ty));
      // A nested container uses its local matrix, not its already composed world matrix.
      if (parent && parentId) {
        const parentMatrix = this.geometry.layout(parentId)!.matrix;
        const inverse = new this.pixi.Matrix(parentMatrix.a, parentMatrix.b, parentMatrix.c, parentMatrix.d, parentMatrix.tx, parentMatrix.ty).invert();
        const local = inverse.append(new this.pixi.Matrix(layout.matrix.a, layout.matrix.b, layout.matrix.c, layout.matrix.d, layout.matrix.tx, layout.matrix.ty)); node.container.setFromMatrix(local);
      }
      node.container.zIndex = el.zIndex || 0;
      const hidden = !el.visible;
      const active = options.previewAnimationId ? el.animations.find(a => a.id === options.previewAnimationId) : el.animations.filter(a => options.playedAnimationIds.includes(a.id)).at(-1);
      const animationHidden = options.presenting && ((!active && el.animations.some(a => a.type === 'entrance')) || active?.type === 'exit');
      const baseAlpha = hidden ? options.editing && !options.presenting ? 0.2 : 0 : (el.opacity ?? 1) * (el.disabled ? 0.6 : 1);
      node.container.alpha = animationHidden ? 0 : baseAlpha;
      node.container.eventMode = options.brushMode || options.panMode || ((!this.geometry.visible(el.id) || animationHidden || el.disabled) && !options.editing) ? 'none' : 'static';
      node.container.cursor = el.type === 'button' && !el.disabled ? 'pointer' : options.editing ? 'grab' : 'pointer';
      if (node.update(el, layout, this.palette)) { this.stats.nodeVisualUpdates++; this.invalidateNode(el.id); }
      this.measureText(el, node.textHeight);
      node.setTextEditing(this.editingTextId === el.id);
      this.drawControls(el.id);
    });
    // Parent order in serialized input need not precede children.
    data.elements.forEach(el => { const parentId = this.geometry.parentId(el.id); if (!parentId) return; const node = this.nodes.get(el.id), parent = this.nodes.get(parentId); if (node && parent && node.container.parent !== parent.children) { parent.children.addChild(node.container); const p = this.geometry.layout(parentId)!, l = this.geometry.layout(el.id)!; node.container.setFromMatrix(new this.pixi.Matrix(p.matrix.a, p.matrix.b, p.matrix.c, p.matrix.d, p.matrix.tx, p.matrix.ty).invert().append(new this.pixi.Matrix(l.matrix.a, l.matrix.b, l.matrix.c, l.matrix.d, l.matrix.tx, l.matrix.ty))); } });
    data.elements.forEach(el => {
      const node = this.nodes.get(el.id), layout = this.geometry.layout(el.id); if (!node || !layout) return;
      const baseAlpha = !el.visible ? options.editing && !options.presenting ? 0.2 : 0 : (el.opacity ?? 1) * (el.disabled ? 0.6 : 1);
      node.container.updateLocalTransform();
      this.animation?.sync(el, node.container, options.playedAnimationIds, options.previewAnimationId, options.presenting || !!options.previewAnimationId, layout.local.width, layout.local.height, baseAlpha);
    });
    const edges = new Set(data.connections.map(conn => conn.id));
    this.edges.forEach((edge, id) => { if (!edges.has(id)) { edge.destroy(); this.edges.delete(id); } });
    data.connections.forEach(conn => {
      let edge = this.edges.get(conn.id);
      if (!edge) { edge = new ConnectionView(this.pixi); this.edges.set(conn.id, edge); this.connectionLayer.addChild(edge.container); this.wire(edge.container, { kind: 'connection', id: conn.id }); }
      if (edge.update(conn, this.geometry, this.palette, options.selectedConnectionId === conn.id)) this.stats.edgeUpdates++;
      const points = edge.points;
      edge.container.hitArea = { contains: (x: number, y: number) => points.some((p, i) => i > 0 && getDistanceToSegment({ x, y }, points[i - 1], p) < Math.max(10 / this.viewport.scale, 4)) };
      const visible = this.geometry.visible(conn.fromId) && this.geometry.visible(conn.toId);
      edge.setFlow(visible ? 1 : options.editing && !options.presenting ? 0.2 : 0, !!options.activatedEdges?.has(conn.id), !options.editing);
      edge.container.eventMode = options.brushMode || options.panMode || !visible && !options.editing ? 'none' : 'static';
    });
    const strokes = new Set(data.brushStrokes.map(stroke => stroke.id));
    this.strokes.forEach((stroke, id) => { if (!strokes.has(id)) { stroke.graphics.destroy(); this.strokes.delete(id); } });
    data.brushStrokes.forEach(stroke => {
      let view = this.strokes.get(stroke.id);
      if (!view) { view = { graphics: new this.pixi.Graphics(), data: stroke }; this.strokes.set(stroke.id, view); this.brushLayer.addChild(view.graphics); strokePath(view.graphics, stroke.points, stroke.color, stroke.width); }
      else if (view.data !== stroke) { view.graphics.clear(); strokePath(view.graphics, stroke.points, stroke.color, stroke.width); view.data = stroke; }
      view.graphics.alpha = stroke.attachedNodeId && !this.geometry.visible(stroke.attachedNodeId) ? options.editing && !options.presenting ? 0.2 : 0 : 1;
    });
    this.setViewport(this.viewport); this.setOverlay(this.overlay);
    } finally { leases.forEach(release => release()); }
  }
  private wire(container: Container, target: SceneTarget): void {
    container.eventMode = 'static';
    container.on('pointerdown', (event: FederatedPointerEvent) => {
      if (this.options.brushMode || this.options.panMode || event.button === 1) return;
      this.refreshOrigin();
      event.stopPropagation(); if ('stopPropagation' in event.nativeEvent) event.nativeEvent.stopPropagation(); this.callbacks.pointerDown?.({ target, event });
    });
    container.on('pointerup', (event: FederatedPointerEvent) => { event.stopPropagation(); this.callbacks.pointerUp?.({ target, event }); });
    container.on('pointertap', (event: FederatedPointerEvent) => {
      if (this.options.brushMode || this.options.panMode || event.button !== 0) return;
      event.stopPropagation(); this.callbacks.click?.({ target, event });
      const key = `${target.kind}:${target.id}`, now = performance.now();
      if (key === this.lastClick.id && now - this.lastClick.time < 350) { this.callbacks.doubleClick?.({ target, event }); this.lastClick = { id: '', time: 0 }; }
      else this.lastClick = { id: key, time: now };
    });
  }
  private drawControls(id: string): void {
    const el = this.geometry.elements.get(id), layout = this.geometry.layout(id), node = this.nodes.get(id); if (!el || !layout || !node) return;
    const w = layout.local.width, h = layout.local.height, scale = this.viewport.scale;
    const selected = this.options.selectedIds.includes(id), flowOpen = !!this.options.openFlowIds?.has(id);
    const focal = this.options.focalId === id;
    const signature = [w, h, selected, this.options.editing, this.options.presenting, this.options.connectingId, focal, el.type === 'image' ? el.objectPosition : '', el.locked, el.parentId, el.interactive, flowOpen, selected || flowOpen ? scale : '', el.type, layout.header, flowOpen ? this.data.connections.filter(c => c.fromId === id).map(c => `${c.id}:${c.fromPort}:${c.interactiveBtnText}:${c.label}:${this.options.activatedEdges?.has(c.id)}`).join(',') : ''].join('|');
    if (this.controlSignatures.get(id) === signature) return;
    this.controlSignatures.set(id, signature);
    node.controlsLayer.removeChildren().forEach(child => child.destroy({ children: true }));
    this.invalidateNode(id);
    if (this.options.selectedIds.includes(id)) node.controlsLayer.addChild(new this.pixi.Graphics().rect(-2, -2, w + 4, h + 4).stroke({ color: '#4caf50', width: 1 / scale }));
    if (this.options.editing && !this.options.presenting && selected && !el.locked && !focal) {
      const handle = (x: number, y: number, target: SceneTarget, color: string, cursor: string) => {
        const g = new this.pixi.Graphics().circle(0, 0, 5 / scale).fill(color).stroke({ color: '#ffffff', width: 1 / scale }); g.position.set(x, y); g.cursor = cursor; this.wire(g, target); node.controlsLayer.addChild(g);
      };
      for (const [name, x, y] of [['nw', 0, 0], ['ne', w, 0], ['sw', 0, h], ['se', w, h]] as const) handle(x, y, { kind: 'resize', id, handle: name }, '#4caf50', name === 'nw' || name === 'se' ? 'nwse-resize' : 'nesw-resize');
      handle(w / 2, -24 / scale, { kind: 'rotate', id }, '#4caf50', 'crosshair');
    }
    if (this.options.editing && !this.options.presenting && !el.parentId && !focal && (selected || this.options.connectingId)) {
      for (const [port, x, y] of [['top', w / 2, 0], ['right', w, h / 2], ['bottom', w / 2, h], ['left', 0, h / 2]] as const) {
        const g = new this.pixi.Graphics().circle(0, 0, 6).fill('#8c8d9c').stroke({ color: this.palette.color('var(--bg-toolbar)'), width: 2 }); g.position.set(x, y); g.cursor = 'crosshair'; g.hitArea = new this.pixi.Circle(0, 0, Math.max(7, 6 / scale)); this.wire(g, { kind: 'port', id, port }); node.controlsLayer.addChild(g);
      }
    }
    if (el.type === 'image' && this.options.editing && this.options.selectedIds.includes(id)) {
      const g = new this.pixi.Graphics().roundRect(0, 0, 22 / scale, 22 / scale, 3 / scale).fill('#3a3c50'); g.position.set(w - 25 / scale, layout.header + 3 / scale); g.cursor = 'move'; this.wire(g, { kind: 'focal', id });
      const icon = new this.pixi.Graphics().svg(`<svg width="24" height="24" stroke="white" fill="none" stroke-width="2">${getIconSvgPath('settings')}</svg>`); icon.scale.set(14 / 24 / scale); icon.position.set(4 / scale, 4 / scale); g.addChild(icon); node.controlsLayer.addChild(g);
      if (focal && el.type === 'image') { const [px, py] = el.objectPosition.split(' ').map(Number.parseFloat); node.controlsLayer.addChild(new this.pixi.Graphics().circle(w * px / 100, layout.header + (h - layout.header) * py / 100, 12 / scale).fill({ color: '#4caf50', alpha: 0.6 }).stroke({ color: '#ffffff', width: 2 / scale })); }
    }
    if (!el.interactive || this.options.editing && !this.options.presenting || !this.options.openFlowIds?.has(id)) { node.updateHitArea(w, h); return; }
    for (const port of ['top', 'right', 'bottom', 'left'] as PortPosition[]) {
      const edges = this.data.connections.filter(c => c.fromId === id && c.fromPort === port);
      if (!edges.length || edges.every(e => this.options.activatedEdges?.has(e.id))) continue;
      const label = edges.map(c => c.interactiveBtnText || (c.label ? 'YES' : '')).filter(Boolean).join(' / ') || ({ top: '\u25b2', right: '\u25b6', bottom: '\u25bc', left: '\u25c0' }[port]);
      const group = new this.pixi.Container();
      const text = new this.pixi.Text({ text: label, style: { fontFamily: 'Lexend Deca', fontSize: 10, fontWeight: '700', fill: '#ffffff' } }); text.position.set(8, 4);
      const bw = Math.max(24, text.width + 16), bh = 22;
      group.addChild(new this.pixi.Graphics().roundRect(0, 0, bw, bh, 5).fill('#3f51b5'), text);
      const s = Math.max(1, 1 / scale); group.scale.set(s);
      group.position.set(port === 'left' ? -bw * s - 4 : port === 'right' ? w + 4 : (w - bw * s) / 2, port === 'top' ? -bh * s - 4 : port === 'bottom' ? h + 4 : (h - bh * s) / 2);
      group.cursor = 'pointer'; this.wire(group, { kind: 'flow', id, port, targets: edges.map(e => e.toId) }); node.controlsLayer.addChild(group);
    }
    node.updateHitArea(w, h);
  }
  setViewport(viewport: Viewport): void {
    this.viewport = viewport;
    if (!this.ready || this.disposed) return;
    this.world.position.set(viewport.pan.x, viewport.pan.y); this.world.scale.set(viewport.scale);
    const top = CoordinateSystem.screenToWorld({ x: 0, y: 0 }, viewport), bottom = CoordinateSystem.screenToWorld({ x: this.size.width, y: this.size.height }, viewport);
    let spacing = 24; while (spacing * viewport.scale < 15) spacing *= 2; while (spacing * viewport.scale > 60) spacing /= 2;
    this.grid.position.set(top.x, top.y); this.grid.width = bottom.x - top.x; this.grid.height = bottom.y - top.y; this.grid.tileScale.set(spacing / 24); this.grid.tilePosition.set(-top.x, -top.y);
    let culled = 0;
    const margin = 200 / viewport.scale;
    this.nodes.forEach((node, id) => {
      const bounds = this.geometry.layout(id)?.bounds; if (!bounds) return;
      const renderable = bounds.x + bounds.width >= top.x - margin && bounds.y + bounds.height >= top.y - margin && bounds.x <= bottom.x + margin && bounds.y <= bottom.y + margin;
      if (renderable !== node.container.renderable && this.geometry.parentId(id)) this.cacheDirty.add(this.rootId(id));
      node.container.renderable = renderable;
      if (!node.container.renderable) culled++;
      // Keep scale-dependent editor affordances readable without rebuilding node visuals.
      this.drawControls(id);
    });
    this.edges.forEach(edge => { if (!edge.points.length) return; const xs = edge.points.map(p => p.x), ys = edge.points.map(p => p.y); edge.container.renderable = Math.max(...xs) >= top.x - margin && Math.max(...ys) >= top.y - margin && Math.min(...xs) <= bottom.x + margin && Math.min(...ys) <= bottom.y + margin; });
    this.stats.culled = culled; this.callbacks.viewport?.(viewport); this.invalidate();
    this.updateLOD();
  }
  private rootId(id: string): string {
    const seen = new Set<string>(); let el = this.geometry.elements.get(id);
    while (el?.parentId && !seen.has(el.id)) { seen.add(el.id); const parent = this.geometry.elements.get(el.parentId); if (!parent) break; el = parent; }
    return el?.id || id;
  }
  private invalidateNode(id: string): void { this.cacheDirty.add(this.rootId(id)); this.invalidate(); }
  private updateLOD(): void {
    this.nodes.forEach((node, id) => {
      const el = this.geometry.elements.get(id); if (!el) return;
      const layout = this.geometry.layout(id)!;
      const cache = !el.parentId && layout.local.width <= 2048 && layout.local.height <= 2048 && this.viewport.scale < 0.5 && !this.options.presenting && !this.options.previewAnimationId && !this.editingTextId;
      if (cache && !this.cachedRoots.has(id)) { node.container.cacheAsTexture({ resolution: 1, antialias: true }); this.cachedRoots.add(id); }
      if (!cache && this.cachedRoots.has(id)) { node.container.cacheAsTexture(false); this.cachedRoots.delete(id); }
      if (cache && this.cacheDirty.has(id)) node.container.updateCacheTexture();
    });
    this.cacheDirty.clear();
  }
  fit(padding = 50, maxScale = 1.5): Viewport { const viewport = CoordinateSystem.fit(this.geometry.bounds(), this.size, padding, maxScale); this.setViewport(viewport); return viewport; }
  setTextEditing(id: string | null): void { this.editingTextId = id; this.nodes.forEach((node, nodeId) => node.setTextEditing(nodeId === id)); this.updateLOD(); this.invalidate(); }
  setOverlay(overlay: SceneOverlay): void {
    this.overlay = overlay; if (!this.ready || this.disposed) return;
    const g = this.overlayLayer.clear(), width = 1 / this.viewport.scale;
    const start = CoordinateSystem.screenToWorld({ x: 0, y: 0 }, this.viewport), end = CoordinateSystem.screenToWorld({ x: this.size.width, y: this.size.height }, this.viewport);
    overlay.guides?.forEach(guide => strokePath(g, guide.type === 'horizontal' ? [{ x: start.x, y: guide.position }, { x: end.x, y: guide.position }] : [{ x: guide.position, y: start.y }, { x: guide.position, y: end.y }], '#ff5252', width, 'dashed'));
    if (overlay.snap?.x != null) strokePath(g, [{ x: overlay.snap.x, y: start.y }, { x: overlay.snap.x, y: end.y }], '#4caf50', width, 'dashed');
    if (overlay.snap?.y != null) strokePath(g, [{ x: start.x, y: overlay.snap.y }, { x: end.x, y: overlay.snap.y }], '#4caf50', width, 'dashed');
    if (overlay.selection) { const s = overlay.selection; g.rect(Math.min(s.x1, s.x2), Math.min(s.y1, s.y2), Math.abs(s.x2 - s.x1), Math.abs(s.y2 - s.y1)).fill({ color: '#4caf50', alpha: 0.1 }).stroke({ color: '#4caf50', width }); }
    if (overlay.stroke) strokePath(g, overlay.stroke.points, overlay.stroke.color, overlay.stroke.width);
    if (overlay.connecting) { const c = overlay.connecting, point = this.geometry.port(c.id, c.port); if (point) strokePath(g, [point, c.point], '#4caf50', 2, 'dashed'); }
    this.invalidate();
  }
  hit(point: Point, nodesOnly = false, exclude = new Set<string>()): string | null {
    const order = this.geometry.paintOrder().reverse();
    return order.find(el => !exclude.has(el.id) && (!nodesOnly || el.type === 'node') && this.geometry.visible(el.id) && this.geometry.contains(el.id, point))?.id || null;
  }
  get diagnostics() { return { ...this.stats, renderer: this.app?.renderer?.type, nodes: this.nodes.size, edges: this.edges.size, visuals: [...this.nodes].map(([id, node]) => ({ id, ...node.diagnostics })), viewport: this.viewport, size: this.size, elements: this.data.elements, layouts: this.data.elements.map(el => ({ id: el.id, ...this.geometry.layout(el.id) })), textures: this.textures.size, textureStats: { ...this.textures.stats }, failedImages: [...this.nodes].filter(([, node]) => node.state.image === 'failed').map(([id]) => id) }; }
  invalidate = (): void => {
    if (this.frame || !this.ready || this.disposed) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0; if (this.disposed) return;
      const animated = this.animation?.tick(); let flow = false;
      const now = performance.now(); this.edges.forEach(edge => { if (edge.tick(now)) flow = true; });
      this.updateLOD(); this.app.render(); this.stats.renders++; this.callbacks.frame?.();
      if (animated || flow) this.invalidate();
    });
  };
  destroy(): void {
    this.disposed = true; cancelAnimationFrame(this.frame); this.observer?.disconnect(); this.animation?.destroy(); document.fonts?.removeEventListener('loadingdone', this.fontsLoaded);
    if (!this.ready) return;
    this.app.canvas.removeEventListener('webglcontextlost', this.contextLost); this.app.canvas.removeEventListener('webglcontextrestored', this.contextRestored);
    window.removeEventListener('scroll', this.refreshOrigin, true); window.removeEventListener('resize', this.refreshOrigin);
    this.nodes.forEach(node => this.elementLayer.addChild(node.container)); this.nodes.forEach(node => node.destroy()); this.edges.forEach(edge => edge.destroy()); this.textures.destroy(); this.gridTexture.destroy(true);
    this.app.destroy(true, { children: true }); this.ready = false;
  }
}
