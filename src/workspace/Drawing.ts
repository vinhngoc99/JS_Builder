import type { Graphics, FillGradient, ColorSource } from 'pixi.js';
import type { FillStyle } from '../types';
import type { PixiAPI } from './contract';
import type { Point } from './CoordinateSystem';

export class Palette {
  constructor(public theme: 'light' | 'dark') {}
  color(value: string | undefined, fallback = '#ffffff'): string {
    const light = this.theme === 'light';
    const colors: Record<string, string> = { '--text-primary': light ? '#111827' : '#ffffff', '--text-secondary': light ? '#5f6368' : '#8c8d9c', '--border-color': light ? '#dadce0' : '#3a3c50', '--bg-node': light ? '#ffffff' : '#242533', '--bg-toolbar': light ? '#ffffff' : '#242533', '--bg-canvas': light ? '#f8f9fa' : '#17181f', '--panel-header-bg': light ? '#f1f3f4' : '#1a1b26', '--grid-dot': light ? '#dadce0' : '#3a3c50' };
    if (!value) return fallback;
    if (value === '#e0e0e0') return colors['--text-primary'];
    if (value === '#3a3c50') return colors['--border-color'];
    const resolved = value.replace(/var\((--[\w-]+)(?:,[^)]*)?\)/g, (_, name: string) => colors[name] || fallback);
    return CSS.supports('color', resolved) ? resolved : fallback;
  }
  fill(pixi: PixiAPI, style: FillStyle): ColorSource | FillGradient {
    if (style.type === 'none') return 'transparent';
    if (style.type !== 'gradient' || !style.gradient) return this.color(style.color, 'transparent');
    const g = style.gradient, rad = (g.angle - 90) * Math.PI / 180;
    const gradient = g.type === 'radial'
      ? new pixi.FillGradient({ type: 'radial', center: { x: 0.5, y: 0.5 }, innerRadius: 0, outerRadius: 0.7, textureSpace: 'local' })
      : new pixi.FillGradient({ type: 'linear', start: { x: 0.5 - Math.cos(rad) * 0.5, y: 0.5 - Math.sin(rad) * 0.5 }, end: { x: 0.5 + Math.cos(rad) * 0.5, y: 0.5 + Math.sin(rad) * 0.5 }, textureSpace: 'local' });
    [...g.stops].sort((a, b) => a.offset - b.offset).forEach(stop => gradient.addColorStop(stop.offset, this.color(stop.color)));
    return gradient;
  }
}

export function strokePath(g: Graphics, points: Point[], color: string, width: number, style = 'solid', cap: 'round' | 'butt' | 'square' = 'round', join: 'round' | 'miter' | 'bevel' = 'round'): void {
  if (!points.length || width <= 0) return;
  if (style === 'solid') {
    g.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => g.lineTo(p.x, p.y));
  } else {
    const dash = style === 'dotted' ? width : width * 4, gap = width * 2;
    let phase = 0;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i], len = Math.hypot(b.x - a.x, b.y - a.y);
      let distance = 0;
      while (distance < len) {
        const on = phase < dash;
        const step = Math.min(len - distance, (on ? dash : dash + gap) - phase);
        const at = (d: number) => ({ x: a.x + (b.x - a.x) * d / len, y: a.y + (b.y - a.y) * d / len });
        if (on) { const from = at(distance), to = at(distance + step); g.moveTo(from.x, from.y).lineTo(to.x, to.y); }
        distance += step; phase = (phase + step) % (dash + gap);
      }
    }
  }
  g.stroke({ color, width, cap, join });
}

export const SHAPE_POINTS: Record<string, number[]> = {
  triangle: [50, 0, 100, 100, 0, 100], rightTriangle: [0, 0, 100, 100, 0, 100], diamond: [50, 0, 100, 50, 50, 100, 0, 50], pentagon: [50, 0, 100, 38, 82, 100, 18, 100, 0, 38], hexagon: [50, 0, 100, 25, 100, 75, 50, 100, 0, 75, 0, 25], parallelogram: [25, 0, 100, 0, 75, 100, 0, 100], trapezoid: [20, 0, 80, 0, 100, 100, 0, 100], star: [50, 0, 63, 38, 100, 38, 69, 59, 82, 100, 50, 75, 18, 100, 31, 59, 0, 38, 37, 38], arrowRight: [0, 30, 60, 30, 60, 10, 100, 50, 60, 90, 60, 70, 0, 70], arrowLeft: [100, 30, 40, 30, 40, 10, 0, 50, 40, 90, 40, 70, 100, 70], arrowUp: [30, 100, 30, 40, 10, 40, 50, 0, 90, 40, 70, 40, 70, 100], arrowDown: [30, 0, 30, 60, 10, 60, 50, 100, 90, 60, 70, 60, 70, 0],
};

export function drawArrow(g: Graphics, type: string, tip: Point, tangent: Point, size: number, color: string): void {
  if (type === 'none') return;
  const angle = Math.atan2(tangent.y, tangent.x), cos = Math.cos(angle), sin = Math.sin(angle);
  const at = (x: number, y: number): Point => ({ x: tip.x + x * cos - y * sin, y: tip.y + x * sin + y * cos });
  if (type === 'circle') { g.circle(tip.x, tip.y, size * 0.4).fill(color); return; }
  const local = type === 'diamond' ? [[0, 0], [-size * 0.5, size * 0.5], [-size, 0], [-size * 0.5, -size * 0.5]] : type === 'triangle' ? [[0, 0], [-size, size * 0.5], [-size, -size * 0.5]] : [[0, 0], [-size, size * 0.5], [-size * 0.7, 0], [-size, -size * 0.5]];
  g.poly(local.map(([x, y]) => at(x, y))).fill(color);
}
