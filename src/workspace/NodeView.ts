import type { Container, Graphics, Sprite, Text, HTMLText, Texture, FillGradient, ColorMatrixFilter } from 'pixi.js';
import type { CanvasElement } from '../types';
import type { PixiAPI } from './contract';
import type { ElementLayout } from './GraphGeometry';
import { TextureManager } from './TextureManager';
import { Palette, SHAPE_POINTS, drawArrow, strokePath } from './Drawing';
import { getIconSvgPath } from '../icons';
import { TextContent } from './TextContent';

export class NodeView {
  readonly container: Container;
  readonly children: Container;
  private body: Container;
  private controls: Container;
  private mask: Graphics;
  private image?: Sprite;
  private imageMask?: Graphics;
  private imageStatus?: Text;
  private imageUrl = '';
  private source?: Texture;
  private signature: unknown[] = [];
  private shadowTexture?: Texture;
  private gradient?: FillGradient;
  private disposed = false;
  private latestImage?: { el: CanvasElement & { type: 'image' }; width: number; height: number; top: number };
  private imageGeneration = 0;
  private text?: Text | HTMLText;
  private disabledFilter?: ColorMatrixFilter;
  textHeight = 0;
  readonly state = { image: 'none' as 'none' | 'loading' | 'loaded' | 'failed' };

  constructor(private pixi: PixiAPI, private textures: TextureManager, private invalidate: () => void) {
    this.container = new pixi.Container(); this.body = new pixi.Container(); this.children = new pixi.Container({ sortableChildren: true });
    this.controls = new pixi.Container(); this.mask = new pixi.Graphics();
    this.container.addChild(this.body, this.children, this.mask, this.controls);
  }
  get controlsLayer(): Container { return this.controls; }
  updateHitArea(width: number, height: number): void {
    const bounds = this.controls.getLocalBounds();
    const x = Math.min(0, bounds.x), y = Math.min(0, bounds.y);
    this.container.hitArea = new this.pixi.Rectangle(x, y, Math.max(width, bounds.x + bounds.width) - x, Math.max(height, bounds.y + bounds.height) - y);
  }
  get diagnostics() { return { image: this.state.image, source: this.source ? { width: this.source.width, height: this.source.height } : null, renderable: this.container.renderable, alpha: this.container.alpha, parent: this.container.parent?.label, position: { x: this.container.x, y: this.container.y }, bounds: this.container.getBounds(), imageBounds: this.image?.getBounds(), maskBounds: this.mask.getBounds(), imageRenderable: this.image?.renderable }; }

  update(el: CanvasElement, layout: ElementLayout, palette: Palette): boolean {
    if (el.disabled && !this.disabledFilter) { this.disabledFilter = new this.pixi.ColorMatrixFilter(); this.disabledFilter.greyscale(1, false); this.disabledFilter.contrast(-0.5, true); }
    this.container.filters = el.disabled ? this.disabledFilter : null;
    const { width: w, height: h } = layout.local;
    const sig = [el.type, w, h, layout.header, el.fill, el.stroke, el.shadow, el.text, el.name, el.type === 'shape' ? el.shapeType : '', el.type === 'icon' ? `${el.iconName}|${el.iconColor}` : '', palette.theme];
    const changed = sig.some((value, i) => value !== this.signature[i]);
    if (changed) {
      this.textHeight = 0;
      this.signature = sig;
      this.body.removeChildren().forEach(child => child.destroy({ children: true }));
      this.text = undefined;
      this.image = undefined; this.imageMask = undefined; this.imageStatus = undefined;
      this.shadowTexture?.destroy(true); this.shadowTexture = undefined;
      this.gradient?.destroy(); this.gradient = undefined;
      if (el.shadow.enabled) this.drawShadow(el, w, h);
      const g = new this.pixi.Graphics();
      const fill = palette.fill(this.pixi, el.fill);
      if (fill instanceof this.pixi.FillGradient) this.gradient = fill;
      const stroke = { width: el.stroke.width, color: palette.color(el.stroke.color, 'transparent'), cap: el.stroke.cap, join: el.stroke.join };
      const radius = Math.min(el.stroke.radius, w / 2, h / 2);
      if (el.type === 'icon') {
        g.svg(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${palette.color(el.iconColor)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${getIconSvgPath(el.iconName)}</svg>`);
        g.scale.set(w / 24, h / 24);
      } else if (el.type === 'shape' && ['line', 'arrow', 'elbow'].includes(el.shapeType)) {
        const points = el.shapeType === 'elbow' ? [{ x: 0, y: 0 }, { x: w / 2, y: 0 }, { x: w / 2, y: h }, { x: w, y: h }] : [{ x: 0, y: 0 }, { x: w, y: h }];
        strokePath(g, points, stroke.color, stroke.width, el.stroke.style, stroke.cap, stroke.join);
        if (el.shapeType === 'arrow') drawArrow(g, 'triangle', { x: w, y: h }, { x: w, y: h }, Math.max(8, stroke.width * 8), stroke.color);
      } else {
        if (el.type === 'shape' && el.shapeType === 'ellipse') g.ellipse(w / 2, h / 2, w / 2, h / 2);
        else if (el.type === 'shape' && SHAPE_POINTS[el.shapeType]) g.poly(SHAPE_POINTS[el.shapeType].map((v, i) => v * (i % 2 ? h : w) / 100));
        else g.roundRect(0, 0, w, h, radius);
        g.fill(fill);
        if (el.stroke.width && el.stroke.style === 'solid') g.stroke(stroke);
        if (el.stroke.width && el.stroke.style !== 'solid') {
          const vertices = el.type === 'shape' && SHAPE_POINTS[el.shapeType] ? SHAPE_POINTS[el.shapeType].map((v, i) => v * (i % 2 ? h : w) / 100) : [0, 0, w, 0, w, h, 0, h];
          const points = el.type === 'shape' && el.shapeType === 'ellipse' ? Array.from({ length: 64 }, (_, i) => ({ x: (1 + Math.cos(i * Math.PI / 32)) * w / 2, y: (1 + Math.sin(i * Math.PI / 32)) * h / 2 })) : Array.from({ length: vertices.length / 2 }, (_, i) => ({ x: vertices[i * 2], y: vertices[i * 2 + 1] }));
          strokePath(g, [...points, points[0]], stroke.color, stroke.width, el.stroke.style);
        }
      }
      this.body.addChild(g);
      if (layout.header) {
        const header = new this.pixi.Graphics().roundRect(0, 0, w, layout.header, radius).fill(palette.color('var(--panel-header-bg)'));
        this.body.addChild(header);
        const title = new this.pixi.Text({ text: el.type === 'node' ? el.name : el.name.toUpperCase(), style: { fontFamily: el.text?.fontFamily.replace(/'/g, '') || 'Lexend Deca', fontSize: el.text?.fontSize || (el.type === 'node' ? 14 : 11), fontWeight: '600', fill: palette.color(el.text?.color), wordWrap: false } });
        const left = el.type === 'node' ? 42 : 12;
        if (el.type === 'node') { const icon = new this.pixi.Graphics().svg(`<svg width="24" height="24" stroke="#8c8d9c" fill="none" stroke-width="2">${getIconSvgPath('settings')}</svg>`); icon.scale.set(16 / 24); icon.position.set(16, (layout.header - 16) / 2); this.body.addChild(icon); }
        let label = title.text; while (title.width > Math.max(1, w - left - 12) && label.length > 1) { label = label.slice(0, -1); title.text = label + '\u2026'; }
        title.position.set(left, Math.max(2, (layout.header - title.height) / 2));
        this.body.addChild(title);
      }
      if (el.type === 'image') this.makeImage(w, h, layout.header);
      if (el.text?.content && !['node', 'image', 'video', 'icon'].includes(el.type)) this.makeText(el, w, h, palette);
      this.mask.clear().rect(0, layout.header, w, Math.max(1, h - layout.header)).fill(0xffffff);
      this.mask.renderable = el.type === 'node';
      this.children.mask = el.type === 'node' ? this.mask : null;
    }
    if (el.type === 'image') {
      this.latestImage = { el, width: w, height: h, top: layout.header };
      const url = TextureManager.imageUrl(el);
      if (!url) {
        if (this.imageUrl) this.textures.release(this.imageUrl);
        this.imageUrl = ''; this.source = undefined; this.imageGeneration++; this.state.image = 'failed';
        if (this.image) this.image.texture = this.pixi.Texture.EMPTY;
        if (this.imageStatus) { this.imageStatus.text = 'Image URL is empty'; this.imageStatus.visible = true; }
      }
      if (url && url !== this.imageUrl) {
        if (this.imageUrl) this.textures.release(this.imageUrl);
        this.imageUrl = url; this.source = undefined; this.state.image = 'loading';
        if (this.image) this.image.texture = this.pixi.Texture.EMPTY;
        if (this.imageStatus) { this.imageStatus.visible = true; this.imageStatus.text = 'Loading image...'; }
        const generation = ++this.imageGeneration;
        this.textures.acquire(url).then(texture => {
          if (this.disposed || this.imageGeneration !== generation || texture.destroyed || !this.latestImage) return;
          const latest = this.latestImage;
          this.source = texture; this.state.image = 'loaded'; this.fitImage(latest.el, latest.width, latest.height, latest.top); this.invalidate();
        }, () => {
          if (this.disposed || this.imageGeneration !== generation) return;
          this.state.image = 'failed'; if (this.imageStatus) this.imageStatus.text = 'Image unavailable (URL / CORS)'; this.invalidate();
        });
      }
      this.fitImage(el, w, h, layout.header);
    }
    return changed;
  }
  private makeImage(w: number, h: number, top: number): void {
    this.image = new this.pixi.Sprite(this.pixi.Texture.EMPTY);
    this.imageMask = new this.pixi.Graphics().rect(0, top, w, Math.max(1, h - top)).fill(0xffffff);
    this.image.mask = this.imageMask;
    this.imageStatus = new this.pixi.Text({ text: this.state.image === 'failed' ? 'Image unavailable (URL / CORS)' : 'Loading image...', style: { fontSize: 12, fill: '#8c8d9c', wordWrap: true, wordWrapWidth: Math.max(1, w - 20) } });
    this.imageStatus.position.set(10, top + 10);
    this.body.addChild(this.image, this.imageMask, this.imageStatus);
  }
  private fitImage(el: CanvasElement & { type: 'image' }, w: number, h: number, top: number): void {
    if (!this.image || !this.source) return;
    this.image.texture = this.source;
    const height = Math.max(1, h - top), tw = this.source.width, th = this.source.height;
    const ratio = el.objectFit === 'contain' ? Math.min(w / tw, height / th) : Math.max(w / tw, height / th);
    const iw = el.objectFit === 'fill' ? w : tw * ratio, ih = el.objectFit === 'fill' ? height : th * ratio;
    const [px = 50, py = 50] = el.objectPosition.split(' ').map(value => parseFloat(value));
    this.image.width = iw; this.image.height = ih;
    this.image.position.set((w - iw) * px / 100, top + (height - ih) * py / 100);
    if (this.imageStatus) this.imageStatus.visible = false;
  }
  private makeText(el: CanvasElement, w: number, h: number, palette: Palette): void {
    const ts = el.text!;
    const padding = ts.padding, contentWidth = Math.max(1, w - padding.left - padding.right);
    const style = { fontFamily: ts.fontFamily.replace(/'/g, ''), fontSize: ts.fontSize, fontWeight: String(ts.fontWeight) as '400', fontStyle: ts.fontStyle, fill: palette.color(ts.color), align: ts.align, lineHeight: ts.fontSize * ts.lineHeight, letterSpacing: ts.letterSpacing, wordWrap: true, wordWrapWidth: contentWidth, breakWords: true };
    const content = TextContent.sanitize(ts.content);
    const isRich = /<(span|b|strong|i|em|u|s|a|ul|ol|li)\b/i.test(content) || ts.textDecoration !== 'none';
    this.text = isRich
      ? new this.pixi.HTMLText({ text: `<div style="width:${contentWidth}px;line-height:${ts.lineHeight};text-align:${ts.align};text-decoration:${ts.textDecoration};color:${palette.color(ts.color)}">${content}</div>`, style })
      : new this.pixi.Text({ text: TextContent.plain(content), style });
    const innerHeight = Math.max(1, h - padding.top - padding.bottom);
    this.text.position.set(padding.left + (ts.align === 'center' ? Math.max(0, (contentWidth - this.text.width) / 2) : ts.align === 'right' ? Math.max(0, contentWidth - this.text.width) : 0), padding.top + (ts.verticalAlign === 'middle' ? Math.max(0, (innerHeight - this.text.height) / 2) : ts.verticalAlign === 'bottom' ? Math.max(0, innerHeight - this.text.height) : 0));
    this.body.addChild(this.text);
    if (el.type === 'text') this.textHeight = Math.ceil(this.text.height + padding.top + padding.bottom);
  }
  private drawShadow(el: CanvasElement, w: number, h: number): void {
    const s = el.shadow, pad = Math.ceil(s.blur * 2 + Math.abs(s.offsetX) + Math.abs(s.offsetY) + Math.abs(s.spread) + 2);
    const ratio = Math.min(1, 1024 / Math.max(w + pad * 2, h + pad * 2));
    const canvas = document.createElement('canvas'); canvas.width = Math.ceil((w + pad * 2) * ratio); canvas.height = Math.ceil((h + pad * 2) * ratio);
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.scale(ratio, ratio); ctx.shadowColor = s.color; ctx.shadowBlur = s.blur * ratio; ctx.shadowOffsetX = s.offsetX * ratio; ctx.shadowOffsetY = s.offsetY * ratio;
    const path = (spread: number) => {
      ctx.beginPath(); const x = pad - spread, y = pad - spread, width = Math.max(1, w + spread * 2), height = Math.max(1, h + spread * 2);
      if (el.type === 'shape' && el.shapeType === 'ellipse') ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
      else if (el.type === 'shape' && SHAPE_POINTS[el.shapeType]) { const vertices = SHAPE_POINTS[el.shapeType]; vertices.forEach((_, i) => { if (i % 2) return; const px = x + vertices[i] * width / 100, py = y + vertices[i + 1] * height / 100; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }); ctx.closePath(); }
      else if (el.type === 'shape' && ['line', 'arrow', 'elbow'].includes(el.shapeType)) { ctx.moveTo(x, y); if (el.shapeType === 'elbow') { ctx.lineTo(x + width / 2, y); ctx.lineTo(x + width / 2, y + height); } ctx.lineTo(x + width, y + height); ctx.lineWidth = Math.max(1, el.stroke.width); ctx.lineCap = el.stroke.cap; ctx.stroke(); return; }
      else ctx.roundRect(x, y, width, height, Math.max(0, el.stroke.radius));
      ctx.fill();
    };
    ctx.fillStyle = '#000000'; path(s.spread);
    ctx.shadowColor = 'transparent'; ctx.globalCompositeOperation = 'destination-out'; path(0);
    this.shadowTexture = this.pixi.Texture.from(canvas);
    const sprite = new this.pixi.Sprite(this.shadowTexture); sprite.position.set(-pad, -pad); sprite.width = w + pad * 2; sprite.height = h + pad * 2; this.body.addChild(sprite);
  }
  setTextEditing(editing: boolean): void { if (this.text) this.text.visible = !editing; }
  destroy(): void {
    this.disposed = true;
    if (this.imageUrl) this.textures.release(this.imageUrl);
    this.container.destroy({ children: true }); this.shadowTexture?.destroy(true); this.gradient?.destroy(); this.disabledFilter?.destroy();
  }
}
