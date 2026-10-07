import type { Container, Graphics } from 'pixi.js';
import type { Connection } from '../types';
import type { PixiAPI } from './contract';
import { GraphGeometry } from './GraphGeometry';
import { getConnectionArrow, getConnectionStroke } from '../models/Connection';
import { Palette, drawArrow, strokePath } from './Drawing';
import type { Point } from './CoordinateSystem';
import { PathGeometry } from './PathGeometry';

export class ConnectionView {
  readonly container: Container;
  private line: Graphics;
  private signature = '';
  private pulse: Graphics;
  private lineStyle = { color: '#6c6d80', width: 2, style: 'solid' };
  private opacity = -1;
  private active = false;
  private transition?: { time: number; from: number; to: number };
  private path = new PathGeometry([]);
  points: Point[] = [];
  constructor(private pixi: PixiAPI) { this.container = new pixi.Container(); this.line = new pixi.Graphics(); this.pulse = new pixi.Graphics(); this.pulse.eventMode = 'none'; this.container.addChild(this.line, this.pulse); }
  invalidateText(): void { this.signature = ''; }
  update(conn: Connection, geometry: GraphGeometry, palette: Palette, selected: boolean): boolean {
    const f = geometry.layout(conn.fromId), t = geometry.layout(conn.toId);
    const signature = [conn.fromId, conn.toId, conn.fromPort, conn.toPort, f && Object.values(f.matrix), t && Object.values(t.matrix), f?.local.width, f?.local.height, t?.local.width, t?.local.height, conn.stroke?.width, conn.stroke?.color, conn.stroke?.style, conn.stroke?.lineType, conn.arrow?.start, conn.arrow?.end, conn.arrow?.size, conn.startArrow, conn.endArrow, conn.label, conn.labelAlignment, conn.reverseLabelDirection, conn.fontFamily, conn.fontSize, conn.color, selected, palette.theme].join('|');
    if (signature === this.signature) return false;
    this.signature = signature;
    this.points = geometry.connection(conn);
    this.path = new PathGeometry(this.points);
    this.container.removeChildren().forEach(child => child.destroy({ children: true }));
    this.line = new this.pixi.Graphics(); this.container.addChild(this.line);
    this.pulse = new this.pixi.Graphics(); this.pulse.eventMode = 'none'; this.container.addChild(this.pulse);
    const stroke = getConnectionStroke(conn), arrow = getConnectionArrow(conn);
    const color = selected ? '#4caf50' : palette.color(stroke.color, '#6c6d80');
    this.lineStyle = { color, width: stroke.width, style: stroke.style };
    strokePath(this.line, this.points, color, stroke.width, stroke.style);
    if (this.points.length >= 2) {
      const first = this.points[0], second = this.points[1], last = this.points.at(-1)!, before = this.points.at(-2)!;
      const arrows = new this.pixi.Graphics(); this.container.addChild(arrows);
      drawArrow(arrows, arrow.start, first, { x: first.x - second.x, y: first.y - second.y }, arrow.size * stroke.width, color);
      drawArrow(arrows, arrow.end, last, { x: last.x - before.x, y: last.y - before.y }, arrow.size * stroke.width, color);
      if (conn.label) {
        const style = { fontFamily: conn.fontFamily?.replace(/'/g, '') || 'Lexend Deca', fontSize: conn.fontSize || 14, fontWeight: 'bold' as const, fill: palette.color(conn.color || 'var(--text-primary)') };
        if (conn.labelAlignment === 'follow') {
          const path = conn.reverseLabelDirection ? new PathGeometry([...this.points].reverse()) : this.path;
          // Place grapheme clusters along the same sampled path used by the wire.
          const clusters = Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(conn.label), entry => entry.segment);
          const glyphs = clusters.map(text => new this.pixi.Text({ text, style }));
          let distance = (path.length - glyphs.reduce((sum, glyph) => sum + glyph.width, 0)) / 2;
          glyphs.forEach(glyph => {
            const position = path.sample(distance + glyph.width / 2); distance += glyph.width;
            glyph.anchor.set(0.5, 1); glyph.rotation = position.angle;
            glyph.position.set(position.x + Math.sin(position.angle) * 5, position.y - Math.cos(position.angle) * 5); this.container.addChild(glyph);
          });
        } else {
          const label = new this.pixi.Text({ text: conn.label, style }), mid = this.path.sample(this.path.length / 2);
          label.anchor.set(0.5, 0.5); label.position.set(mid.x, mid.y);
          const background = new this.pixi.Graphics().roundRect(-label.width / 2 - 10, -label.height / 2 - 3, label.width + 20, label.height + 6, 8).fill(palette.color('var(--bg-canvas)')).stroke({ color: palette.color('var(--border-color)'), width: 1 }); background.position.copyFrom(label.position); this.container.addChild(background, label);
        }
      }
    }
    return true;
  }
  setFlow(opacity: number, active: boolean, animate: boolean): void {
    if (opacity !== this.opacity) {
      this.transition = animate ? { time: performance.now(), from: Math.max(0, this.opacity), to: opacity } : undefined;
      this.opacity = opacity;
    }
    this.active = active && animate;
    if (!this.transition) this.container.alpha = opacity;
    if (!this.active) this.pulse.clear();
  }
  tick(now: number): boolean {
    if (this.transition) {
      const t = Math.min(1, (now - this.transition.time) / (this.transition.to ? 300 : 200));
      this.container.alpha = this.transition.from + (this.transition.to - this.transition.from) * t;
      const progress = this.transition.to ? 1 - (1 - t) ** 3 : 1 - t ** 3;
      this.line.clear(); strokePath(this.line, this.path.segment(0, this.path.length * progress), this.lineStyle.color, this.lineStyle.width, this.lineStyle.style);
      if (t === 1) { this.transition = undefined; if (this.opacity) strokePath(this.line.clear(), this.points, this.lineStyle.color, this.lineStyle.width, this.lineStyle.style); }
    }
    if (this.active && this.container.renderable && this.container.alpha > 0) {
      this.pulse.clear();
      const offset = (now % 1200) / 1200 * 24;
      for (let at = offset - 24; at < this.path.length; at += 24) strokePath(this.pulse, this.path.segment(at, at + 6), this.lineStyle.color, Math.max(2, this.lineStyle.width));
      this.pulse.alpha = 0.8;
      return true;
    }
    return !!this.transition;
  }
  destroy(): void { this.container.destroy({ children: true }); }
}
