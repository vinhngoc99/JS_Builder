import type { CanvasElement, Variant } from '../types';
import type { PixiAPI, SceneEvent, SceneOptions } from '../workspace/contract';
import { SceneRenderer } from '../workspace/SceneRenderer';
import { CoordinateSystem, type Point } from '../workspace/CoordinateSystem';
import { DomOverlay } from '../workspace/DomOverlay';
import { GestureController } from '../workspace/GestureController';
import { FlowController } from '../workspace/FlowController';
import { BrushGeometry } from '../workspace/BrushGeometry';
import { GeometryService } from '../services/GeometryService';
import { createTextElement } from '../models/Element';
import { getSlideAnimationSteps } from '../animations';

export interface ExportState { variants: Variant[]; activeVariantId: string; theme: 'light' | 'dark' }

export class ExportController {
  readonly scene: SceneRenderer;
  private native!: DomOverlay;
  private gestures!: GestureController;
  private flow: FlowController;
  private data: Variant;
  private original: Variant;
  private selectedIds: string[] = [];
  private theme: 'light' | 'dark';
  private presenting = false;
  private slideIndex = 0;
  private played: string[] = [];
  private space = false;
  private brush: 'draw' | 'erase' | null = null;
  private stroke: Point[] | null = null;
  private lastErase: Point | null = null;
  private panStart: { point: Point; pan: Point } | null = null;
  private brushResize: { x: number; width: number } | null = null;
  private contextPoint: Point | null = null;
  private contextId: string | null = null;
  private lastReset = { id: '', time: 0 };
  private textColor: string;
  private customTextColor = false;
  private themeTextIds = new Set<string>();
  private history: Variant[] = [];
  private redoStack: Variant[] = [];
  private autoplayTimer = 0;
  private autoplay = false;
  private autoplayMode: 'step' | 'instant' = 'step';
  private interacted = false;
  private notifyTimer = 0;
  private laser = false;
  private trail: Point[] = [];
  private laserFrame = 0;
  private disposed = false;
  private syncScheduled = false;
  private events = new AbortController();

  constructor(pixi: PixiAPI, private host: HTMLElement, private state: ExportState) {
    const variant = state.variants.find(v => v.id === state.activeVariantId) || state.variants[0];
    if (!variant) throw new Error('Project contains no variants');
    this.data = structuredClone(variant); this.original = structuredClone(variant); this.theme = state.theme;
    try { const saved = localStorage.getItem('theme'); if (saved === 'light' || saved === 'dark') this.theme = saved; } catch { /* Storage is optional inside sandboxed embeds. */ }
    this.textColor = this.theme === 'light' ? '#111827' : '#ffffff';
    this.flow = new FlowController(() => this.data.elements, () => this.data.connections, (ids, visible) => { this.data.elements = this.data.elements.map(e => ids.has(e.id) ? { ...e, visible } : e); });
    this.scene = new SceneRenderer(pixi, host, { error: message => this.showError(message) });
  }
  async init(): Promise<void> {
    await this.scene.init(); if (this.disposed) return;
    this.native = new DomOverlay(this.host, (id, updates) => {
      this.saveHistory(); this.patch([{ id, updates }]);
      if (this.isRuntimeText(id)) this.original.elements = this.original.elements.map(el => el.id === id ? { ...el, ...updates } as CanvasElement : el);
    }, id => this.scene.setTextEditing(id), id => this.scene.nativeVisual(id));
    this.gestures = new GestureController(this.scene, {
      state: () => ({ ...this.data, selectedIds: this.selectedIds, presenting: this.presenting, editing: false, snap: false, guides: this.data.guides, connecting: null, focalId: null }),
      select: () => {}, selectConnection: () => {}, patch: changes => this.patch(changes), history: () => this.saveHistory(), connect: () => {}, setConnecting: () => {}, setFocal: () => {}, snapGuides: () => {},
    });
    this.scene.setCallbacks({
      error: message => this.showError(message),
      viewport: () => this.syncViewport(),
      frame: () => this.native.refreshVideos(),
      textHeight: (id, height) => { const el = this.data.elements.find(e => e.id === id); if (el && height > el.height) { this.data.elements = this.data.elements.map(e => e.id === id ? { ...e, height } : e); this.scheduleSync(); } },
      pointerDown: event => { if (event.event.button === 2) return; this.interact(); this.hideContext(); if (event.target.kind === 'element' && this.isRuntimeText(event.target.id)) { this.selectedIds = [event.target.id]; this.sync(); } this.gestures.down(event); },
      click: event => this.click(event),
      doubleClick: ({ target }) => { if (target.kind === 'element' && this.isRuntimeText(target.id)) { const el = this.data.elements.find(e => e.id === target.id); if (el) this.native.edit(el); } },
    });
    this.flow.reset(); this.applyTheme(); this.sync(); this.scene.fit(); this.bindUI(); this.bindEvents();
    this.host.dataset.ready = 'true';
    Object.defineProperty(this.host, 'workspaceDiagnostics', { configurable: true, get: () => ({ ...this.scene.diagnostics, viewport: this.scene.viewport, elements: this.data.elements, strokes: this.data.brushStrokes, activeVariantId: this.data.id, presenting: this.presenting }) });
    this.autoplayTimer = window.setTimeout(() => { if (!this.interacted) this.startAutoplay(); }, 1500);
  }
  private options(): SceneOptions {
    return { editing: false, presenting: this.presenting, selectedIds: this.selectedIds, selectedConnectionId: null, playedAnimationIds: this.played, brushMode: !!this.brush, panMode: this.space, theme: this.theme, openFlowIds: this.flow.openIds, activatedEdges: this.flow.activatedEdges };
  }
  private sync(): void {
    this.scene.setData(this.data, this.options());
    this.native?.sync(this.data.elements, this.scene.geometry, this.scene.viewport, this.theme, !this.brush && !this.space);
    this.presentationUI();
  }
  private scheduleSync(): void { if (this.syncScheduled) return; this.syncScheduled = true; queueMicrotask(() => { this.syncScheduled = false; if (!this.disposed) this.sync(); }); }
  private syncViewport(): void {
    const percent = this.el('zoom-percent'); if (percent) percent.textContent = `${Math.round(this.scene.viewport.scale * 100)}%`;
    this.native?.sync(this.data.elements, this.scene.geometry, this.scene.viewport, this.theme, !this.brush && !this.space);
  }
  private patch(changes: { id: string; updates: Partial<CanvasElement> }[]): void {
    const before = this.data.elements, updates = new Map(changes.map(c => [c.id, c.updates]));
    this.data.elements = before.map(el => updates.has(el.id) ? { ...el, ...updates.get(el.id) } as CanvasElement : el);
    this.data.brushStrokes = BrushGeometry.translate(this.data.brushStrokes, before, this.data.elements); this.sync();
  }
  private el(id: string): HTMLElement | null { return document.getElementById(id); }
  private input(id: string): HTMLInputElement { return document.getElementById(id) as HTMLInputElement; }
  private listen(target: EventTarget, type: string, callback: EventListener, options: AddEventListenerOptions = {}): void { target.addEventListener(type, callback, { ...options, signal: this.events.signal }); }
  private on(id: string, callback: () => void): void { const el = this.el(id); if (el) this.listen(el, 'click', callback); }
  private bindUI(): void {
    this.on('theme-toggle-btn', () => { this.theme = this.theme === 'dark' ? 'light' : 'dark'; this.applyTheme(); this.sync(); });
    this.on('zoom-fit', () => this.scene.fit()); this.on('reset-layout', () => this.reset());
    this.on('brush-toggle', () => this.toggleBrush('draw')); this.on('eraser-toggle', () => this.toggleBrush('erase'));
    this.on('brush-clear', () => { this.saveHistory(); this.data.brushStrokes = []; this.sync(); this.notify('Drawings cleared'); });
    this.on('undo-btn', () => this.undo()); this.on('redo-btn', () => this.redo());
    this.on('brush-hide', () => this.toggleToolbar()); this.on('brush-show-btn', () => this.toggleToolbar());
    this.listen(this.input('brush-width-slider'), 'input', () => { this.el('brush-width-val')!.textContent = this.input('brush-width-slider').value; this.updateCursor(); });
    this.listen(this.input('runtime-text-color'), 'input', () => {
      this.textColor = this.input('runtime-text-color').value; this.customTextColor = true;
      const id = this.selectedIds[0], el = this.data.elements.find(e => e.id === id);
      if (el?.text && this.isRuntimeText(id)) { this.themeTextIds.delete(id); this.patch([{ id, updates: { text: { ...el.text, color: this.textColor } } }]); this.original.elements = this.original.elements.map(e => e.id === id ? { ...e, text: { ...el.text!, color: this.textColor } } : e); }
    });
    this.on('ctx-add-text', () => this.addText()); this.on('ctx-delete-text', () => this.deleteText());
    this.on('present-btn', () => this.startPresentation()); this.on('prev-slide-btn', () => this.goToSlide(this.slideIndex - 1)); this.on('next-slide-btn', () => this.nextSlide());
    this.on('exit-presentation-btn', () => this.exitPresentation()); this.on('notes-toggle-btn', () => this.toggleNotes()); this.on('notes-close-btn', () => this.toggleNotes(false));
    const select = this.el('slide-select'); if (select) this.listen(select, 'change', () => this.goToSlide(Number((select as HTMLSelectElement).value)));
    this.on('variant-trigger', () => this.el('variant-dropdown-container')?.classList.toggle('open'));
    document.querySelectorAll<HTMLElement>('.variant-menu-item').forEach(item => this.listen(item, 'click', () => this.switchVariant(item.dataset.id!)));
    this.on('autoplay-btn', () => this.autoplay ? this.stopAutoplay() : this.startAutoplay());
    this.on('autoplay-settings-btn', () => { const el = this.el('autoplay-settings-panel')!; el.style.display = el.style.display === 'none' ? 'block' : 'none'; });
    this.on('autoplay-settings-close', () => { this.el('autoplay-settings-panel')!.style.display = 'none'; });
    this.on('mode-step-btn', () => this.setAutoplayMode('step')); this.on('mode-instant-btn', () => this.setAutoplayMode('instant'));
  }
  private bindEvents(): void {
    this.listen(this.host, 'wheel', event => {
      const e = event as WheelEvent; e.preventDefault(); const point = this.localPoint(e);
      this.scene.setViewport(CoordinateSystem.zoomAt(this.scene.viewport, point, this.scene.viewport.scale * (1 - e.deltaY * 0.001)));
    }, { passive: false });
    this.listen(this.host, 'contextmenu', event => { event.preventDefault(); });
    this.listen(this.host, 'pointerdown', event => { if ((event as PointerEvent).button !== 2) this.pointerDown(event as PointerEvent); });
    // Capture receives the event before Pixi's element propagation is stopped.
    this.listen(this.host, 'pointerdown', event => { const e = event as PointerEvent; if (e.button === 2) this.pointerDown(e); }, { capture: true });
    this.listen(window, 'pointermove', event => this.pointerMove(event as PointerEvent));
    this.listen(window, 'pointerup', () => this.pointerUp()); this.listen(window, 'pointercancel', () => this.pointerUp());
    this.listen(window, 'keydown', event => this.keyDown(event as KeyboardEvent));
    this.listen(window, 'keyup', event => { if ((event as KeyboardEvent).code === 'Space') { this.space = false; this.panStart = null; this.sync(); this.host.classList.remove('space-down', 'panning'); } });
    this.listen(window, 'blur', () => { this.space = false; this.panStart = null; this.sync(); });
    this.listen(document, 'pointerdown', event => { const target = event.target as HTMLElement; if ((event as PointerEvent).button !== 2 && !target.closest('#html-context-menu')) this.hideContext(); if (!target.closest('.variant-dropdown-container')) this.el('variant-dropdown-container')?.classList.remove('open'); });
    this.listen(window, 'pagehide', event => { if (!(event as PageTransitionEvent).persisted) this.destroy(); else this.stopAutoplay(); });
  }
  private localPoint(event: { clientX: number; clientY: number }): Point { return this.scene.clientToScreen({ x: event.clientX, y: event.clientY }); }
  private worldPoint(event: { clientX: number; clientY: number }): Point { return CoordinateSystem.screenToWorld(this.localPoint(event), this.scene.viewport); }
  private pointerDown(e: PointerEvent): void {
    this.scene.refreshOrigin();
    this.interact();
    if (e.button === 2) {
      e.preventDefault();
      if (e.altKey) { this.brushResize = { x: e.clientX, width: Number(this.input('brush-width-slider').value) }; return; }
      const point = this.worldPoint(e), id = this.scene.hit(point);
      if (id && !this.isRuntimeText(id)) {
        const now = performance.now(); if (this.lastReset.id === id && now - this.lastReset.time < 500) { this.resetElement(id); this.lastReset = { id: '', time: 0 }; } else this.lastReset = { id, time: now }; return;
      }
      this.contextPoint = point; this.contextId = id; if (id) this.selectedIds = [id];
      const menu = this.el('html-context-menu')!; this.el('ctx-delete-text')!.style.display = id ? 'block' : 'none'; menu.classList.add('open'); menu.style.left = `${Math.max(4, Math.min(e.clientX, innerWidth - menu.offsetWidth - 4))}px`; menu.style.top = `${Math.max(4, Math.min(e.clientY, innerHeight - menu.offsetHeight - 4))}px`; this.sync(); return;
    }
    if (e.button !== 0 && e.button !== 1) return;
    this.hideContext();
    if (this.space || e.button === 1) { this.panStart = { point: { x: e.clientX, y: e.clientY }, pan: { ...this.scene.viewport.pan } }; this.host.classList.add('panning'); return; }
    const point = this.worldPoint(e);
    if (this.brush === 'draw') { this.saveHistory(); this.stroke = [point]; }
    else if (this.brush === 'erase') { this.saveHistory(); this.lastErase = point; this.erase(point); }
    else { this.selectedIds = []; this.sync(); }
  }
  private pointerMove(e: PointerEvent): void {
    this.updateCursor(e);
    if (this.laser && this.presenting) this.moveLaser(e);
    if (this.brushResize) { this.input('brush-width-slider').value = String(Math.max(1, Math.min(100, Math.round(this.brushResize.width + (e.clientX - this.brushResize.x) * 0.2)))); this.el('brush-width-val')!.textContent = this.input('brush-width-slider').value; return; }
    if (this.panStart) { const p = this.panStart; this.scene.setViewport({ scale: this.scene.viewport.scale, pan: { x: p.pan.x + e.clientX - p.point.x, y: p.pan.y + e.clientY - p.point.y } }); return; }
    const point = this.worldPoint(e);
    if (this.stroke) { this.stroke.push(point); this.scene.setOverlay({ stroke: { points: this.stroke, color: this.input('brush-color').value, width: Number(this.input('brush-width-slider').value) } }); }
    if (this.brush === 'erase' && this.lastErase) { this.erase(point); this.lastErase = point; }
  }
  private pointerUp(): void {
    if (this.stroke) {
      const points = this.stroke; this.stroke = null;
      if (points.length > 1) this.data.brushStrokes.push({ id: crypto.randomUUID(), points, color: this.input('brush-color').value, width: Number(this.input('brush-width-slider').value), attachedNodeId: GeometryService.findBrushAttachmentElementId(points, this.data.elements) });
      this.scene.setOverlay({}); this.sync();
    }
    this.lastErase = null; this.panStart = null; this.brushResize = null; this.host.classList.remove('panning');
  }
  private erase(point: Point): void { this.data.brushStrokes = BrushGeometry.erase(this.data.brushStrokes, point, this.lastErase, Number(this.input('brush-width-slider').value) / 2, () => crypto.randomUUID()); this.sync(); }
  private click({ target }: SceneEvent): void {
    if (this.gestures.moved) return;
    if (target.kind === 'flow') { this.flow.toggle(target.id, target.port); this.sync(); return; }
    if (target.kind !== 'element') return;
    const el = this.data.elements.find(e => e.id === target.id); if (!el || el.disabled) return;
    if (el.interactive) { this.flow.toggleOpen(el.id); this.sync(); }
    if (el.type !== 'button') return;
    const a = el.action, owner = this.data.elements.find(e => e.id === a.target);
    if (a.type === 'link' && /^(https?:|mailto:)/i.test(a.link)) window.open(a.link, '_blank', 'noopener,noreferrer');
    if (a.type === 'alert') window.alert(a.target || 'Button clicked!');
    if (a.type === 'toggleVisibility' && owner) this.patch([{ id: owner.id, updates: { visible: !owner.visible } }]);
    if (a.type === 'toggleDisabled' && owner) this.patch([{ id: owner.id, updates: { disabled: !owner.disabled } }]);
    if (a.type === 'triggerFlow') { this.flow.reveal(a.target); this.sync(); }
    if (a.type === 'nextSlide') this.nextSlide(); if (a.type === 'prevSlide') this.goToSlide(this.slideIndex - 1);
    if (a.type === 'goToSlide') { const index = this.slides().findIndex(s => s.id === a.target); if (index >= 0) { if (!this.presenting) this.startPresentation(); this.goToSlide(index); } }
  }
  private keyDown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    if (target.matches('input,textarea,select') || target.isContentEditable) return;
    const key = e.key.toLowerCase();
    if ((key === 'delete' || key === 'backspace') && this.selectedIds.some(id => this.isRuntimeText(id))) { e.preventDefault(); this.deleteText(); return; }
    if (this.presenting) {
      if (e.key === 'Escape') this.exitPresentation();
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.code === 'Space' && !e.shiftKey) { e.preventDefault(); this.nextSlide(); }
      if (e.key === 'ArrowLeft' || e.code === 'Space' && e.shiftKey) { e.preventDefault(); this.goToSlide(this.slideIndex - 1); }
      if (key === 'l') { this.laser = !this.laser; this.el('laser-pointer-el')!.style.display = this.laser ? 'block' : 'none'; this.host.classList.toggle('laser-cursor-none', this.laser); }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && key === '0') { e.preventDefault(); this.scene.fit(); }
    else if ((e.ctrlKey || e.metaKey) && key === 'z') { e.preventDefault(); if (e.shiftKey) this.redo(); else this.undo(); }
    else if ((e.ctrlKey || e.metaKey) && key === 'y') { e.preventDefault(); this.redo(); }
    else if (e.code === 'Space') { e.preventDefault(); this.space = true; this.host.classList.add('space-down'); this.sync(); }
    else if (key === 'b') this.toggleBrush('draw'); else if (key === 'e') this.toggleBrush('erase');
    else if (key === 'h') this.toggleToolbar(); else if (key === 'x') { this.saveHistory(); this.data.brushStrokes = []; this.sync(); }
    else if (e.key === 'Escape') this.hideContext();
  }
  private hideContext(): void { this.el('html-context-menu')?.classList.remove('open'); this.contextId = null; }
  private isRuntimeText(id: string): boolean { return id.startsWith('runtime-text-'); }
  private addText(): void {
    if (!this.contextPoint) return;
    const el = createTextElement({ id: `runtime-text-${crypto.randomUUID()}`, x: this.contextPoint.x, y: this.contextPoint.y, width: 180, height: 64, name: 'Text', text: { content: 'Workflow Text', fontFamily: "'Lexend Deca', sans-serif", fontSize: 16, fontWeight: 400, fontStyle: 'normal', textDecoration: 'none', color: this.textColor, align: 'center', verticalAlign: 'middle', lineHeight: 1.5, letterSpacing: 0, padding: { top: 10, right: 14, bottom: 10, left: 14 } } });
    this.saveHistory(); this.data.elements.push(el); this.original.elements.push(structuredClone(el)); this.selectedIds = [el.id]; if (!this.customTextColor) this.themeTextIds.add(el.id); this.hideContext(); this.sync(); this.notify('Text added');
  }
  private deleteText(): void {
    const id = this.contextId || this.selectedIds[0]; if (!id || !this.isRuntimeText(id)) return;
    this.saveHistory(); this.native.close(false); this.data.elements = this.data.elements.filter(e => e.id !== id); this.original.elements = this.original.elements.filter(e => e.id !== id); this.data.brushStrokes = this.data.brushStrokes.filter(s => s.attachedNodeId !== id); this.themeTextIds.delete(id); this.selectedIds = []; this.contextId = null; this.hideContext(); this.sync(); this.notify('Text deleted');
  }
  private applyTheme(): void {
    document.body.classList.toggle('light-theme', this.theme === 'light');
    try { localStorage.setItem('theme', this.theme); } catch { /* Optional persistence. */ }
    const sun = document.querySelector<HTMLElement>('.sun-icon'), moon = document.querySelector<HTMLElement>('.moon-icon'); if (sun) sun.style.display = this.theme === 'light' ? 'block' : 'none'; if (moon) moon.style.display = this.theme === 'dark' ? 'block' : 'none';
    if (!this.customTextColor) this.textColor = this.theme === 'light' ? '#111827' : '#ffffff';
    this.data.elements = this.data.elements.map(el => this.themeTextIds.has(el.id) && el.text ? { ...el, text: { ...el.text, color: this.theme === 'light' ? '#111827' : '#ffffff' } } : el);
    this.original.elements = this.original.elements.map(el => this.themeTextIds.has(el.id) && el.text ? { ...el, text: { ...el.text, color: this.theme === 'light' ? '#111827' : '#ffffff' } } : el);
    if (this.input('runtime-text-color')) this.input('runtime-text-color').value = this.textColor;
  }
  private toggleBrush(tool: 'draw' | 'erase'): void { this.brush = this.brush === tool ? null : tool; this.el('brush-toggle')?.classList.toggle('primary', this.brush === 'draw'); this.el('eraser-toggle')?.classList.toggle('primary', this.brush === 'erase'); this.host.classList.toggle('brush-mode', !!this.brush); this.sync(); this.updateCursor(); }
  private toggleToolbar(): void { const toolbar = document.querySelector<HTMLElement>('.brush-toolbar')!; const hidden = toolbar.classList.toggle('hidden-toolbar'); this.el('brush-show-btn')!.style.display = hidden ? 'flex' : 'none'; }
  private updateCursor(event?: PointerEvent): void {
    const cursor = this.el('brush-cursor-el'), circle = this.el('brush-cursor-circle'); if (!cursor || !circle) return;
    cursor.style.display = this.brush && !this.space ? 'flex' : 'none'; if (event) { cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`; }
    const size = Number(this.input('brush-width-slider').value) * this.scene.viewport.scale; circle.style.width = `${size}px`; circle.style.height = `${size}px`;
  }
  private saveHistory(): void { this.history.push(structuredClone(this.data)); if (this.history.length > 50) this.history.shift(); this.redoStack = []; }
  private undo(): void { const data = this.history.pop(); if (!data) return; this.redoStack.push(structuredClone(this.data)); this.data = data; this.sync(); this.notify('Undo'); }
  private redo(): void { const data = this.redoStack.pop(); if (!data) return; this.history.push(structuredClone(this.data)); this.data = data; this.sync(); this.notify('Redo'); }
  private reset(): void { this.stopAutoplay(); this.native.close(false); this.data = structuredClone(this.original); this.flow.reset(); this.selectedIds = []; this.played = []; this.history = []; this.redoStack = []; this.sync(); this.scene.fit(); this.notify('Positions and state reset'); }
  private resetElement(id: string): void { const original = this.original.elements.find(e => e.id === id); if (original) { this.saveHistory(); this.patch([{ id, updates: { x: original.x, y: original.y } }]); this.notify('Position reset'); } }
  private switchVariant(id: string): void {
    const variant = this.state.variants.find(v => v.id === id); if (!variant) return;
    this.stopAutoplay(); this.native.close(false); this.exitPresentation(); this.data = structuredClone(variant); this.original = structuredClone(variant); this.selectedIds = []; this.themeTextIds.clear(); this.history = []; this.redoStack = []; this.flow.reset(); this.sync(); this.scene.fit();
    this.el('active-variant-name')!.textContent = variant.name; document.querySelectorAll<HTMLElement>('.variant-menu-item').forEach(item => item.classList.toggle('active', item.dataset.id === id)); this.el('variant-dropdown-container')?.classList.remove('open');
  }
  private slides(): CanvasElement[] { return this.data.elements.filter(e => e.type === 'node' && e.isSlide !== false).sort((a, b) => a.x - b.x); }
  private startPresentation(): void {
    if (!this.slides().length) { this.notify('No slides'); return; }
    this.stopAutoplay(); this.native.close(true); this.presenting = true; this.brush = null; this.played = []; document.body.classList.add('presentation-mode');
    const select = this.el('slide-select') as HTMLSelectElement; select.replaceChildren(...this.slides().map((s, i) => { const option = document.createElement('option'); option.value = String(i); option.textContent = `Slide ${i + 1}: ${s.name || 'Slide'}`; return option; }));
    this.goToSlide(0);
  }
  private exitPresentation(): void { this.presenting = false; this.laser = false; this.played = []; this.el('laser-pointer-el')!.style.display = 'none'; this.el('speaker-notes-panel')!.style.display = 'none'; document.body.classList.remove('presentation-mode'); this.host.classList.remove('laser-cursor-none'); this.sync(); }
  private goToSlide(index: number): void {
    const slides = this.slides(); if (!slides.length) return;
    const previous = this.slideIndex; this.slideIndex = Math.max(0, Math.min(slides.length - 1, index)); const slide = slides[this.slideIndex];
    const animations = this.data.elements.filter(e => e.id === slide.id || e.parentId === slide.id).flatMap(e => e.animations || []), ids = animations.map(a => a.id);
    this.played = this.played.filter(id => !ids.includes(id)); this.played.push(...animations.filter(a => this.slideIndex < previous || a.trigger === 'onEnter').map(a => a.id));
    this.flow.reveal(slide.id); this.sync(); const bounds = this.scene.geometry.layout(slide.id)?.bounds; if (bounds) this.scene.setViewport(CoordinateSystem.fit(bounds, this.scene.size, 60, 2));
  }
  private nextSlide(): void {
    const slide = this.slides()[this.slideIndex]; if (!slide) return;
    const step = getSlideAnimationSteps(slide.id, this.data.elements).find(s => !s.animations.every(a => this.played.includes(a.id)));
    if (step) { this.played.push(...step.animations.map(a => a.id)); this.sync(); } else if (this.slideIndex < this.slides().length - 1) this.goToSlide(this.slideIndex + 1);
  }
  private presentationUI(): void {
    const bar = this.el('presentation-bar'); if (!bar) return;
    bar.style.display = this.presenting ? 'flex' : 'none'; const zoom = document.querySelector<HTMLElement>('.zoom-controls'); if (zoom) zoom.style.display = this.presenting ? 'none' : 'flex';
    const slide = this.slides()[this.slideIndex], select = this.el('slide-select') as HTMLSelectElement; if (select) select.value = String(this.slideIndex);
    const previous = this.el('prev-slide-btn') as HTMLButtonElement, next = this.el('next-slide-btn') as HTMLButtonElement;
    if (previous) previous.disabled = this.slideIndex === 0; if (next) next.disabled = this.slideIndex >= this.slides().length - 1 && (!slide || getSlideAnimationSteps(slide.id, this.data.elements).every(s => s.animations.every(a => this.played.includes(a.id))));
    const notes = this.el('notes-toggle-btn') as HTMLButtonElement; if (notes) notes.disabled = !slide?.speakerNotes; const text = this.el('speaker-notes-text'); if (text) text.textContent = slide?.speakerNotes || '';
  }
  private toggleNotes(force?: boolean): void { const panel = this.el('speaker-notes-panel')!; panel.style.display = (force ?? panel.style.display === 'none') && !!this.slides()[this.slideIndex]?.speakerNotes ? 'block' : 'none'; }
  private setAutoplayMode(mode: 'step' | 'instant'): void { this.autoplayMode = mode; this.el('mode-step-btn')?.classList.toggle('primary', mode === 'step'); this.el('mode-instant-btn')?.classList.toggle('primary', mode === 'instant'); this.el('delay-settings-container')!.style.display = mode === 'step' ? 'block' : 'none'; }
  private startAutoplay(): void { this.stopAutoplay(); this.interacted = false; this.autoplay = true; this.autoplayUI(); this.playStep(); }
  private stopAutoplay(): void { this.autoplay = false; clearTimeout(this.autoplayTimer); this.autoplayTimer = 0; this.autoplayUI(); }
  private autoplayUI(): void { const play = document.querySelector<HTMLElement>('.play-icon'), pause = document.querySelector<HTMLElement>('.pause-icon'); if (play) play.style.display = this.autoplay ? 'none' : 'block'; if (pause) pause.style.display = this.autoplay ? 'block' : 'none'; }
  private playStep(): void {
    if (!this.autoplay || this.disposed) return;
    const available = this.flow.available();
    if (available.length) {
      (this.autoplayMode === 'instant' ? available : available.slice(0, 1)).forEach(item => this.flow.toggle(item.id, item.port)); this.sync();
      const delay = this.autoplayMode === 'instant' ? 150 : Math.max(100, Number(this.input('autoplay-delay-input').value) * 1000 || 1500); this.autoplayTimer = window.setTimeout(() => this.playStep(), delay);
    } else if (this.data.elements.some(e => e.interactive)) this.autoplayTimer = window.setTimeout(() => { if (!this.autoplay || this.interacted) return; this.data = structuredClone(this.original); this.flow.reset(); this.sync(); this.playStep(); }, 2000);
    else this.stopAutoplay();
  }
  private interact(): void { this.interacted = true; this.stopAutoplay(); }
  private moveLaser(e: PointerEvent): void {
    const pointer = this.el('laser-pointer-el')!; pointer.style.left = `${e.clientX}px`; pointer.style.top = `${e.clientY}px`;
    this.trail.push({ x: e.clientX, y: e.clientY }); if (this.trail.length > 20) this.trail.shift();
    if (!this.laserFrame) this.laserFrame = requestAnimationFrame(this.renderTrail);
  }
  private renderTrail = (): void => {
    this.laserFrame = 0; const svg = this.el('laser-trail-svg'); if (!svg) return;
    svg.replaceChildren();
    if (!this.laser || !this.presenting) { this.trail = []; svg.style.display = 'none'; return; }
    svg.style.display = 'block'; this.trail.slice(1).forEach((p, i) => { const from = this.trail[i], line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); for (const [key, value] of Object.entries({ x1: from.x, y1: from.y, x2: p.x, y2: p.y, stroke: '#ff1744', 'stroke-width': 2 + 8 * i / this.trail.length, opacity: i / this.trail.length })) line.setAttribute(key, String(value)); svg.appendChild(line); });
    this.trail.shift(); if (this.trail.length) this.laserFrame = requestAnimationFrame(this.renderTrail);
  };
  private notify(message: string): void { this.el('notification-text')!.textContent = message; this.el('notification-toast')!.classList.add('show'); clearTimeout(this.notifyTimer); this.notifyTimer = window.setTimeout(() => this.el('notification-toast')?.classList.remove('show'), 2200); }
  private showError(message: string): void { let error = this.el('workspace-error'); if (!error) { error = document.createElement('div'); error.id = 'workspace-error'; error.className = 'workspace-error'; error.setAttribute('role', 'alert'); this.host.appendChild(error); } error.textContent = message; error.style.display = message ? 'block' : 'none'; }
  destroy(): void { if (this.disposed) return; this.disposed = true; this.stopAutoplay(); clearTimeout(this.notifyTimer); cancelAnimationFrame(this.laserFrame); this.events.abort(); this.gestures?.destroy(); this.native?.destroy(); this.scene.destroy(); }
}
