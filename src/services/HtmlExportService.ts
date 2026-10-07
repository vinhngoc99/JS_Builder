import type { CanvasElement, Connection, BrushStroke, Variant } from '../types';
import { DEFAULT_PIXI_URL } from '../workspace/contract';
import runtime from 'virtual:pixi-export-runtime';
import css from '../export/export.css?raw';
import { exportControls } from '../export/template';
import { escapeHtml } from './dom-utils';

export interface ExportSnapshot {
  variants: Variant[];
  activeVariantId: string;
  elements: CanvasElement[];
  connections: Connection[];
  brushStrokes: BrushStroke[];
  guides: Variant['guides'];
  theme: 'light' | 'dark';
}
export interface ExportOptions { pixiUrl?: string }

export function scriptJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

export function generateExportHTML(snapshot: ExportSnapshot, options: ExportOptions = {}): string {
  const current = { id: snapshot.activeVariantId, name: snapshot.variants.find(v => v.id === snapshot.activeVariantId)?.name || 'Variant 1', elements: snapshot.elements, connections: snapshot.connections, brushStrokes: snapshot.brushStrokes, guides: snapshot.guides };
  const variants = snapshot.variants.some(v => v.id === current.id) ? snapshot.variants.map(v => v.id === current.id ? current : v) : [current, ...snapshot.variants];
  const fonts = new Set<string>(['Lexend Deca']);
  variants.forEach(v => {
    v.elements.forEach(el => { if (el.text?.fontFamily) fonts.add(el.text.fontFamily.split(',')[0].replace(/['"]/g, '').trim()); });
    v.connections.forEach(c => { if (c.fontFamily) fonts.add(c.fontFamily.split(',')[0].replace(/['"]/g, '').trim()); });
  });
  const system = new Set(['sans-serif', 'serif', 'monospace', 'arial', 'georgia', 'verdana', 'times new roman', 'courier new', 'trebuchet ms', 'impact', 'comic sans ms', 'google sans text', 'google sans display', 'google sans flex']);
  const family = [...fonts].filter(f => !system.has(f.toLowerCase())).map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700`).join('&');
  const pixiUrl = options.pixiUrl || DEFAULT_PIXI_URL;
  if (!/^https:\/\//i.test(pixiUrl)) throw new Error('Pixi runtime URL must use HTTPS');
  const state = { variants, activeVariantId: current.id, theme: snapshot.theme };
  return `<!doctype html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${escapeHtml(family)}&display=swap">
<style>${css}</style></head><body class="${snapshot.theme === 'light' ? 'light-theme' : 'dark-theme'}">
${exportControls({ ...snapshot, variants })}
<script id="js-builder-state" type="application/json">${scriptJson(state)}</script>
<script src="${escapeHtml(pixiUrl)}" crossorigin="anonymous"></script>
<script>${runtime.replace(/<\/script/gi, '<\\/script')}</script>
</body></html>`;
}
