import type { Container, Matrix } from 'pixi.js';
import type { CanvasElement } from '../types';
import type { PixiAPI } from './contract';
import { ALL_EFFECTS } from '../animations/effects';

interface RunningAnimation { animation: Animation; probe: HTMLDivElement; base: Matrix; alpha: number; width: number; height: number; container: Container }

export class AnimationPlayer {
  private animations = new Map<string, RunningAnimation>();
  private last = new Map<string, string>();
  private delays = new Map<string, number>();
  private sheet: HTMLStyleElement;
  constructor(private pixi: PixiAPI, private invalidate: () => void) {
    this.sheet = document.createElement('style');
    this.sheet.textContent = ALL_EFFECTS.map(effect => effect.css).join('\n'); document.head.appendChild(this.sheet);
  }
  timeline(elements: CanvasElement[]): void {
    this.delays.clear();
    let start = 0, end = 0;
    elements.flatMap(el => el.animations).sort((a, b) => a.order - b.order).forEach(anim => {
      if (anim.trigger === 'onClick' || anim.trigger === 'onEnter') { start = 0; end = 0; }
      else if (anim.trigger === 'afterPrevious') start = end;
      this.delays.set(anim.id, start + anim.delay); end = start + anim.delay + anim.duration;
    });
  }
  sync(el: CanvasElement, container: Container, played: string[], preview: string | null | undefined, enabled: boolean, width: number, height: number, baseAlpha: number): void {
    const active = preview ? el.animations.find(a => a.id === preview) : el.animations.filter(a => played.includes(a.id)).at(-1);
    const key = enabled && active ? `${active.id}:${preview || ''}:${active.effect}:${active.duration}:${active.delay}:${active.easing}` : '';
    if (this.last.get(el.id) === key) {
      const running = this.animations.get(el.id);
      if (running) { running.base = container.localTransform.clone(); running.alpha = baseAlpha; }
      return;
    }
    this.cancel(el.id); this.last.set(el.id, key);
    if (!key || !active) return;
    const probe = document.createElement('div');
    const delay = preview ? active.delay : this.delays.get(active.id) ?? active.delay;
    probe.style.cssText = `position:fixed;left:-100000px;top:-100000px;width:${width}px;height:${height}px;visibility:hidden;animation:${active.effect} ${active.duration}ms ${active.easing || 'ease'} ${delay}ms ${active.type === 'emphasis' ? 'none' : 'both'};`;
    document.body.appendChild(probe);
    const animation = probe.getAnimations()[0]; if (!animation) { probe.remove(); return; }
    container.updateLocalTransform();
    this.animations.set(el.id, { animation, probe, container, width, height, alpha: baseAlpha, base: container.localTransform.clone() }); this.invalidate();
  }
  tick(): boolean {
    this.animations.forEach((entry, id) => {
      const style = getComputedStyle(entry.probe), m = new DOMMatrix(style.transform === 'none' ? undefined : style.transform);
      const x = entry.width / 2, y = entry.height / 2;
      const animated = new this.pixi.Matrix(m.a, m.b, m.c, m.d, m.e + x - m.a * x - m.c * y, m.f + y - m.b * x - m.d * y);
      entry.container.setFromMatrix(entry.base.clone().append(animated)); entry.container.alpha = Number(style.opacity) * entry.alpha;
      if (entry.animation.playState === 'finished') { entry.probe.remove(); this.animations.delete(id); }
    });
    return this.animations.size > 0;
  }
  cancel(id: string): void { const entry = this.animations.get(id); if (entry) { entry.animation.cancel(); entry.probe.remove(); this.animations.delete(id); } }
  remove(id: string): void { this.cancel(id); this.last.delete(id); }
  destroy(): void { [...this.animations.keys()].forEach(id => this.remove(id)); this.last.clear(); this.sheet.remove(); }
}
