import type { Point } from './CoordinateSystem';

export class PathGeometry {
  readonly lengths: number[];
  readonly length: number;
  constructor(readonly points: Point[]) {
    this.lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
    this.length = this.lengths.reduce((sum, n) => sum + n, 0);
  }
  sample(distance: number): Point & { angle: number } {
    let remaining = Math.max(0, Math.min(this.length, distance));
    for (let i = 0; i < this.lengths.length; i++) {
      const length = this.lengths[i];
      if (remaining <= length || i === this.lengths.length - 1) {
        const a = this.points[i], b = this.points[i + 1], t = length ? remaining / length : 0;
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: Math.atan2(b.y - a.y, b.x - a.x) };
      }
      remaining -= length;
    }
    return { ...(this.points[0] || { x: 0, y: 0 }), angle: 0 };
  }
  segment(from: number, to: number): Point[] {
    const start = Math.max(0, from), end = Math.min(this.length, to);
    if (end <= start) return [];
    const result: Point[] = [this.sample(start)]; let distance = 0;
    for (let i = 0; i < this.lengths.length; i++) {
      distance += this.lengths[i];
      if (distance > start && distance < end) result.push(this.points[i + 1]);
    }
    result.push(this.sample(end)); return result;
  }
}
