import type { Texture } from 'pixi.js';
import type { PixiAPI } from './contract';
import type { ImageElement } from '../types';

interface TextureEntry { refs: number; texture?: Texture; promise: Promise<Texture>; dispose: boolean; settled: boolean; dimensions?: { width: number; height: number } }

export class TextureManager {
  private entries = new Map<string, TextureEntry>();
  private queue: (() => void)[] = [];
  private active = 0;
  private destroyed = false;
  private cancellations = new Set<() => void>();
  readonly stats = { requests: 0, hits: 0, failures: 0, pixels: 0 };

  constructor(private pixi: PixiAPI, private maxSize = 4096, private concurrency = 3) {}
  limitSize(maxSize: number): void { this.maxSize = Math.max(1, Math.min(this.maxSize, maxSize)); }

  static imageUrl(el: ImageElement): string {
    const quality = (el as ImageElement & { imageQuality?: number }).imageQuality;
    if (quality === undefined || !el.src.includes('lh3.googleusercontent.com')) return el.src;
    const base = el.src.replace(/=s\d+$/, '');
    return `${base}=s${quality === 100 ? 0 : Math.round(40 * quality)}`;
  }

  acquire(url: string): Promise<Texture> {
    const cached = this.entries.get(url);
    if (cached) { cached.refs++; cached.dispose = false; this.stats.hits++; return cached.promise; }
    const entry: TextureEntry = { refs: 1, dispose: false, settled: false, promise: Promise.resolve(this.pixi.Texture.EMPTY) };
    entry.promise = new Promise<Texture>((resolve, reject) => {
      this.queue.push(() => {
        if (this.destroyed || entry.dispose) { entry.settled = true; this.entries.delete(url); reject(new Error('Texture request cancelled')); this.next(); return; }
        this.load(url).then(loaded => {
          const texture = loaded.texture; entry.dimensions = loaded.dimensions;
          entry.settled = true;
          entry.texture = texture;
          if (entry.dispose || this.destroyed) { this.stats.pixels = Math.max(0, this.stats.pixels - texture.width * texture.height); texture.destroy(true); this.entries.delete(url); }
          resolve(texture);
        }, error => { entry.settled = true; if (entry.dispose) this.entries.delete(url); if (!this.destroyed) this.stats.failures++; reject(error); }).finally(() => this.next());
      });
    });
    this.entries.set(url, entry);
    this.pump();
    return entry.promise;
  }
  retainExisting(url: string): (() => void) | undefined {
    const entry = this.entries.get(url); if (!entry) return;
    entry.refs++; entry.dispose = false; return () => this.release(url);
  }

  release(url: string): void {
    const entry = this.entries.get(url);
    if (!entry) return;
    entry.refs = Math.max(0, entry.refs - 1);
    if (entry.refs > 0) return;
    entry.dispose = true;
    if (entry.texture) { this.stats.pixels -= entry.texture.width * entry.texture.height; entry.texture.destroy(true); }
    if (entry.settled) this.entries.delete(url);
  }
  async dimensions(url: string): Promise<{ width: number; height: number }> {
    const texture = this.acquire(url);
    try { await texture; const dimensions = this.entries.get(url)?.dimensions; if (!dimensions) throw new Error('Image metadata unavailable'); return dimensions; }
    finally { this.release(url); }
  }

  private pump(): void {
    while (this.active < this.concurrency && this.queue.length) { this.active++; this.queue.shift()!(); }
  }
  private next(): void { this.active--; this.pump(); }
  private async load(url: string): Promise<{ texture: Texture; dimensions: { width: number; height: number } }> {
    this.stats.requests++;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      const finish = (error?: Error) => {
        clearTimeout(timeout); this.cancellations.delete(cancel); image.onload = null; image.onerror = null;
        if (error) { image.src = ''; reject(error); } else resolve();
      };
      const cancel = () => finish(new Error('Texture manager disposed'));
      const timeout = window.setTimeout(() => finish(new Error('Image request timed out')), 30000);
      this.cancellations.add(cancel);
      image.onload = () => finish();
      image.onerror = () => finish(new Error('Image unavailable or server does not allow CORS'));
      image.src = url;
    });
    if (this.destroyed) throw new Error('Texture manager disposed');
    const ratio = Math.min(1, this.maxSize / Math.max(image.naturalWidth, image.naturalHeight));
    let source: HTMLImageElement | HTMLCanvasElement = image;
    if (ratio < 1) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Image resize context unavailable');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      source = canvas;
    }
    this.stats.pixels += source.width * source.height;
    return { texture: this.pixi.Texture.from(source), dimensions: { width: image.naturalWidth, height: image.naturalHeight } };
  }
  get size(): number { return this.entries.size; }
  destroy(): void {
    this.destroyed = true;
    this.cancellations.forEach(cancel => cancel()); this.cancellations.clear();
    this.entries.forEach(entry => { entry.dispose = true; entry.texture?.destroy(true); });
    this.entries.clear();
    this.stats.pixels = 0;
    this.pump();
  }
}
