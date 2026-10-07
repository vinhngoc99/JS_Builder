import type { CanvasElement } from '../types';
import { GraphGeometry, type Transform } from './GraphGeometry';
import type { Viewport } from './CoordinateSystem';
import { Palette } from './Drawing';
import { TextContent } from './TextContent';
import { NativeVideoClip } from './NativeVideoClip';

export class DomOverlay {
  private layer: HTMLDivElement;
  private editor?: HTMLDivElement;
  private input?: HTMLDivElement | HTMLInputElement;
  private editingId: string | null = null;
  private range: Range | null = null;
  private videos = new Map<string, HTMLIFrameElement>();
  private links = new Map<string, { dom: HTMLDivElement; signature: string }>();
  private viewport: Viewport = { scale: 1, pan: { x: 0, y: 0 } };
  private geometry = new GraphGeometry([]);
  private palette = new Palette('dark');
  private elements: CanvasElement[] = [];
  private interactiveVideos = false;
  constructor(private host: HTMLElement, private update: (id: string, updates: Partial<CanvasElement>) => void, private editingChanged: (id: string | null) => void, private visual?: (id: string) => { matrix: Transform; alpha: number } | undefined) {
    this.layer = document.createElement('div'); this.layer.className = 'workspace-native-overlay'; this.layer.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;'; this.host.appendChild(this.layer);
  }
  sync(elements: CanvasElement[], geometry: GraphGeometry, viewport: Viewport, theme: 'light' | 'dark', interactiveVideos: boolean): void {
    this.geometry = geometry; this.viewport = viewport; this.palette = new Palette(theme);
    this.elements = elements; this.interactiveVideos = interactiveVideos;
    const ids = new Set(elements.filter(el => el.type === 'video').map(el => el.id));
    this.videos.forEach((video, id) => { if (!ids.has(id)) { video.remove(); this.videos.delete(id); } });
    elements.forEach(el => {
      if (el.type !== 'video') return;
      let iframe = this.videos.get(el.id);
      if (!iframe) { iframe = document.createElement('iframe'); iframe.setAttribute('allowfullscreen', ''); iframe.setAttribute('allow', 'autoplay; fullscreen'); iframe.title = el.name || 'Video'; iframe.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0;border:none;'; this.layer.appendChild(iframe); this.videos.set(el.id, iframe); }
      if (iframe.getAttribute('src') !== el.src) iframe.src = /^(https?:|about:blank)/i.test(el.src) ? el.src : 'about:blank';
    });
    this.syncLinks();
    this.refreshVideos();
    if (this.editor && this.editingId) {
      const layout = geometry.layout(this.editingId);
      if (!layout) this.close(true); else this.position(this.editor, this.editingId);
    }
  }
  private syncLinks(geometry = this.geometry): void {
    const ids = new Set(this.elements.filter(el => el.text && /<a\b/i.test(el.text.content)).map(el => el.id));
    this.links.forEach((entry, id) => { if (!ids.has(id)) { entry.dom.remove(); this.links.delete(id); } });
    this.elements.forEach(el => {
      if (!ids.has(el.id) || !el.text) return;
      const ts = el.text, signature = JSON.stringify(ts); let entry = this.links.get(el.id);
      if (!entry) {
        const dom = document.createElement('div'); dom.className = 'workspace-link-overlay'; dom.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0;display:flex;pointer-events:none;overflow:hidden;';
        dom.addEventListener('pointerdown', event => event.stopPropagation()); this.layer.appendChild(dom); entry = { dom, signature: '' }; this.links.set(el.id, entry);
      }
      if (entry.signature !== signature) {
        entry.signature = signature; const text = document.createElement('div');
        text.style.cssText = `width:100%;box-sizing:border-box;word-break:break-word;padding:${ts.padding.top}px ${ts.padding.right}px ${ts.padding.bottom}px ${ts.padding.left}px;font-family:${ts.fontFamily};font-size:${ts.fontSize}px;font-weight:${ts.fontWeight};font-style:${ts.fontStyle};text-align:${ts.align};line-height:${ts.lineHeight};letter-spacing:${ts.letterSpacing}px;color:transparent;`;
        text.innerHTML = TextContent.sanitize(ts.content);
        text.querySelectorAll<HTMLElement>('*').forEach(child => { child.style.color = 'transparent'; child.style.textDecorationColor = 'transparent'; if (child.tagName === 'A') { child.style.pointerEvents = 'auto'; child.style.cursor = 'pointer'; } });
        entry.dom.style.alignItems = ts.verticalAlign === 'middle' ? 'center' : ts.verticalAlign === 'bottom' ? 'flex-end' : 'flex-start'; entry.dom.replaceChildren(text);
      }
      const visual = this.visual?.(el.id); this.position(entry.dom, el.id, 0, geometry.layout(el.id)?.matrix); entry.dom.style.display = geometry.visible(el.id) && (!visual || visual.alpha > 0) && this.editingId !== el.id && !el.disabled ? 'flex' : 'none'; entry.dom.style.clipPath = NativeVideoClip.path(el.id, geometry);
    });
  }
  refreshVideos(): void {
    if (!this.videos.size && !this.links.size) return;
    const geometry = new GraphGeometry(this.elements);
    this.elements.forEach(el => { const layout = geometry.layout(el.id), visual = this.visual?.(el.id); if (layout && visual) geometry.layouts.set(el.id, { ...layout, matrix: visual.matrix }); });
    this.videos.forEach((iframe, id) => {
      const layout = geometry.layout(id), el = geometry.elements.get(id); if (!layout || !el) return;
      const visual = this.visual?.(id), alpha = visual?.alpha ?? el.opacity;
      this.position(iframe, id, layout.header, layout.matrix);
      iframe.style.display = alpha > 0 ? 'block' : 'none'; iframe.style.pointerEvents = this.interactiveVideos && geometry.visible(id) && !el.disabled ? 'auto' : 'none'; iframe.style.opacity = String(alpha); iframe.style.clipPath = NativeVideoClip.path(id, geometry);
      iframe.style.filter = el.disabled ? 'grayscale(1)' : '';
    });
    this.syncLinks(geometry);
  }
  private position(dom: HTMLElement, id: string, top = 0, matrix?: Transform): void {
    const l = this.geometry.layout(id); if (!l) return;
    const m = matrix || l.matrix, s = this.viewport.scale, pan = this.viewport.pan;
    dom.style.width = `${l.local.width}px`; dom.style.height = `${Math.max(1, l.local.height - top)}px`;
    dom.style.transform = `matrix(${m.a * s},${m.b * s},${m.c * s},${m.d * s},${(m.tx + m.c * top) * s + pan.x},${(m.ty + m.d * top) * s + pan.y})`;
  }
  edit(el: CanvasElement): void {
    this.close(true); this.editingId = el.id;
    const editor = document.createElement('div'); editor.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0;pointer-events:auto;box-sizing:border-box;outline:1px solid #4caf50;display:flex;align-items:center;';
    editor.style.background = this.palette.color('var(--bg-toolbar)'); this.editor = editor;
    editor.addEventListener('pointerdown', event => event.stopPropagation()); editor.addEventListener('wheel', event => event.stopPropagation());
    if (el.type === 'node') {
      const input = document.createElement('input'); input.value = el.name; input.style.cssText = 'width:100%;font:14px Lexend Deca;color:inherit;background:transparent;border:none;outline:none;';
      input.addEventListener('blur', () => this.close(true)); input.addEventListener('keydown', event => { if (event.key === 'Enter') this.close(true); else if (event.key === 'Escape') this.close(false); });
      this.input = input; editor.appendChild(input);
    } else if (el.text) {
      const ts = el.text, input = document.createElement('div'); input.contentEditable = 'true'; input.className = 'workspace-text-editor';
      input.style.cssText = `width:100%;max-height:100%;overflow:auto;outline:none;box-sizing:border-box;word-break:break-word;padding:${ts.padding.top}px ${ts.padding.right}px ${ts.padding.bottom}px ${ts.padding.left}px;font-family:${ts.fontFamily};font-size:${ts.fontSize}px;font-weight:${ts.fontWeight};font-style:${ts.fontStyle};text-decoration:${ts.textDecoration};color:${this.palette.color(ts.color)};text-align:${ts.align};line-height:${ts.lineHeight};letter-spacing:${ts.letterSpacing}px;`;
      input.innerHTML = TextContent.sanitize(ts.content); this.input = input;
      const remember = () => { const selection = window.getSelection(); if (selection?.rangeCount) this.range = selection.getRangeAt(0).cloneRange(); };
      input.addEventListener('mouseup', remember); input.addEventListener('keyup', remember);
      input.addEventListener('blur', event => { if (event.relatedTarget instanceof Node && editor.contains(event.relatedTarget)) return; this.close(true); });
      input.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); this.close(false); } else if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); this.close(true); } });
      input.addEventListener('paste', event => {
        event.preventDefault(); const selection = window.getSelection(); if (!selection?.rangeCount) return; const range = selection.getRangeAt(0); range.deleteContents(); const text = document.createTextNode(event.clipboardData?.getData('text/plain') || ''); range.insertNode(text); range.setStartAfter(text); range.collapse(true); selection.removeAllRanges(); selection.addRange(range);
      });
      const toolbar = document.createElement('div'); toolbar.className = 'rich-text-toolbar'; toolbar.style.cssText = 'position:absolute;bottom:100%;left:0;display:flex;background:var(--bg-toolbar);border:1px solid var(--border-color);padding:4px;gap:4px;';
      const apply = (styles: Partial<CSSStyleDeclaration>) => {
        input.focus(); const selection = window.getSelection(); if (!selection) return;
        if (this.range) { selection.removeAllRanges(); selection.addRange(this.range); }
        if (!selection.rangeCount || selection.isCollapsed) {
          const span = document.createElement('span'); Object.assign(span.style, styles);
          while (input.firstChild) span.appendChild(input.firstChild);
          input.appendChild(span); return;
        }
        const range = selection.getRangeAt(0), span = document.createElement('span'); Object.assign(span.style, styles); span.appendChild(range.extractContents()); range.insertNode(span); range.selectNodeContents(span); selection.removeAllRanges(); selection.addRange(range); this.range = range.cloneRange();
      };
      for (const [label, styles] of [['Bold', { fontWeight: '700' }], ['Italic', { fontStyle: 'italic' }], ['Underline', { textDecoration: 'underline' }]] as const) {
        const button = document.createElement('button'); button.type = 'button'; button.title = label; button.textContent = label[0]; button.style.fontWeight = label === 'Bold' ? '700' : ''; button.style.fontStyle = label === 'Italic' ? 'italic' : '';
        button.addEventListener('mousedown', event => event.preventDefault()); button.addEventListener('click', () => apply(styles)); toolbar.appendChild(button);
      }
      const color = document.createElement('input'); color.type = 'color'; color.title = 'Text Color'; color.value = /^#[\da-f]{6}$/i.test(this.palette.color(ts.color)) ? this.palette.color(ts.color) : '#ffffff'; color.addEventListener('input', () => apply({ color: color.value })); toolbar.appendChild(color);
      editor.append(toolbar, input);
    }
    this.layer.appendChild(editor); this.position(editor, el.id); this.editingChanged(el.id); this.input?.focus();
    if (this.input instanceof HTMLInputElement) this.input.select();
  }
  close(save: boolean): void {
    if (!this.editor || !this.editingId || !this.input) return;
    const id = this.editingId, input = this.input, el = this.geometry.elements.get(id), editor = this.editor;
    this.editor = undefined; this.input = undefined; this.editingId = null; this.range = null;
    if (save && el) {
      if (input instanceof HTMLInputElement) this.update(id, { name: input.value });
      else if (el.text) {
        const content = TextContent.sanitize(input.innerHTML);
        const measured = Math.max(el.height, input.scrollHeight + (el.stroke.width || 0) * 2);
        this.update(id, { text: { ...el.text, content }, ...(el.type === 'text' ? { height: measured } : {}) });
      }
    }
    editor.remove(); this.editingChanged(null); this.syncLinks();
  }
  destroy(): void { this.close(false); this.videos.clear(); this.links.clear(); this.layer.remove(); }
}
