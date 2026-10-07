import { test, expect, type Page, type Frame } from '@playwright/test';
import { project } from './fixtures';
import { createElement } from '../src/models/Element';
import { GraphGeometry } from '../src/workspace/GraphGeometry';
import { CoordinateSystem } from '../src/workspace/CoordinateSystem';
import { FlowController } from '../src/workspace/FlowController';
import type { CanvasElement, BrushStroke } from '../src/types';
import { writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import { BrushGeometry } from '../src/workspace/BrushGeometry';
import { ImportService } from '../src/services/ImportService';
import { PathGeometry } from '../src/workspace/PathGeometry';

interface Diagnostics {
  nodes: number; edges: number; renderer: number; renders: number; culled: number; textures: number;
  nodeVisualUpdates: number; edgeUpdates: number; failedImages: string[];
  textureStats: { requests: number; hits: number; failures: number };
  viewport: { pan: { x: number; y: number }; scale: number };
  size: { width: number; height: number };
  elements: CanvasElement[];
  layouts: { id: string; bounds: { x: number; y: number; width: number; height: number } }[];
  strokes?: BrushStroke[];
  activeVariantId?: string;
}
type Surface = Page | Frame;
async function diagnostics(surface: Surface): Promise<Diagnostics> {
  return surface.evaluate(() => (document.querySelector('.pixi-workspace, #interactive-container') as HTMLElement & { workspaceDiagnostics: Diagnostics }).workspaceDiagnostics);
}
async function openBuilder(page: Page, variants = project()) {
  await page.addInitScript(data => { if (window !== window.top) return; localStorage.setItem('js-builder-variants', JSON.stringify(data)); localStorage.setItem('js-builder-active-variant', 'default'); localStorage.setItem('js-builder-theme', 'dark'); }, variants);
  await page.route('**/assets/test-image.png*', route => route.fulfill({ path: 'src/assets/hero.png' }));
  await page.route('**/pixi.js@8.22.0/dist/pixi.min.js', route => route.fulfill({ path: 'node_modules/pixi.js/dist/pixi.min.js', contentType: 'application/javascript', headers: { 'Access-Control-Allow-Origin': '*' } }));
  await page.goto('./'); await page.locator('.pixi-workspace[data-ready="true"]').waitFor();
  await expect.poll(async () => (await diagnostics(page)).textures).toBeGreaterThan(0);
}
async function exportHtml(page: Page) {
  await page.getByTitle('Export HTML', { exact: true }).click();
  const html = await page.locator('.export-modal textarea, .modal-overlay textarea, textarea[readonly]').last().inputValue();
  expect(html).toContain('pixi.js@8.22.0'); expect(html).not.toContain('id="elements-layer"'); expect(html).not.toContain('id="connections-layer"');
  await page.keyboard.press('Escape');
  return html;
}
async function independent(page: Page, html: string, opaque = false) {
  await page.route('**/standalone-test', route => route.fulfill({ contentType: 'text/html', body: `<html><body style="margin:0"><iframe title="Standalone export" sandbox="allow-scripts ${opaque ? '' : 'allow-same-origin'} allow-popups" style="width:100vw;height:100vh;border:none"></iframe></body></html>` }));
  await page.goto('http://127.0.0.1:5173/standalone-test');
  await page.locator('iframe').evaluate((iframe, text) => { (iframe as HTMLIFrameElement).srcdoc = text; }, html);
  const frame = page.frames().find(f => f !== page.mainFrame())!;
  await frame.locator('#interactive-container[data-ready="true"]').waitFor();
  // Stop the scheduled demonstration before deterministic interaction scenarios.
  await frame.locator('#interactive-container').dispatchEvent('pointerdown', { clientX: 5, clientY: 5, button: 0 });
  return frame;
}
async function location(surface: Surface, id: string) {
  const d = await diagnostics(surface), b = d.layouts.find(l => l.id === id)!.bounds;
  const rect = await surface.locator('canvas[data-renderer="pixi"]').boundingBox();
  return { x: rect!.x + (b.x + b.width / 2) * d.viewport.scale + d.viewport.pan.x, y: rect!.y + (b.y + b.height / 2) * d.viewport.scale + d.viewport.pan.y };
}

test('coordinates, nested fillParent, rotated ports and cycle protection', () => {
  const v = project()[0], root = v.elements[0]; root.rotation = 30;
  const inner = createElement('node', { id: 'inner', parentId: root.id, name: '', x: 10, y: 20, width: 100, height: 100 });
  const child = createElement('image', { id: 'nested', parentId: 'inner', fillParent: true });
  const g = new GraphGeometry([...v.elements, inner, child]);
  expect(g.layout('nested')!.local.width).toBe(68); expect(g.layout('nested')!.local.y).toBe(16);
  expect(g.port(root.id, 'right')!.normal.x).toBeCloseTo(Math.cos(Math.PI / 6));
  const viewport = { scale: 0.4, pan: { x: 20, y: -30 } }, p = { x: 220, y: 130 };
  expect(CoordinateSystem.worldToScreen(CoordinateSystem.screenToWorld(p, viewport), viewport)).toEqual(p);
  root.parentId = 'nested'; expect(() => new GraphGeometry([...v.elements, inner, child]).layout(root.id)).not.toThrow();
});

test('brush uses the full parent transform and does not move on a no-op', () => {
  const before = project()[0].elements, after = structuredClone(before); after[0].rotation = 90; after[0].x += 70;
  const strokes = [{ id: 's', attachedNodeId: 'image-0', color: '#ff0000', width: 4, points: [{ x: 40, y: 90 }, { x: 70, y: 110 }] }];
  const moved = BrushGeometry.translate(strokes, before, after), a = new GraphGeometry(before).layout('image-0')!, b = new GraphGeometry(after).layout('image-0')!;
  expect(moved[0].points[0]).toEqual(GraphGeometry.transform(b.matrix, GraphGeometry.inverse(a.matrix, strokes[0].points[0])));
  expect(BrushGeometry.translate(strokes, before, before)[0]).toBe(strokes[0]);
});

test('wire path sampling follows bends and preserves dash/reveal distances', () => {
  const path = new PathGeometry([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 20 }]);
  expect(path.length).toBe(30); expect(path.sample(15)).toEqual({ x: 10, y: 5, angle: Math.PI / 2 });
  expect(path.segment(5, 15).map(({ x, y }) => ({ x, y }))).toEqual([{ x: 5, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 5 }]);
  expect(path.segment(0, 0)).toEqual([]);
  const matrix = { a: 0, b: 2, c: -3, d: 0, tx: 100, ty: 200 }, delta = { x: 25, y: -10 };
  expect(GraphGeometry.transformVector(matrix, GraphGeometry.inverseVector(matrix, delta))).toEqual(delta);
});

test('Builder retains resize and connection controls after pan/zoom; undo restores brush once', async ({ page }) => {
  const variants = project(); variants[0].brushStrokes.push({ id: 's', points: [{ x: 40, y: 90 }, { x: 70, y: 110 }], attachedNodeId: 'image-0', color: '#f00000', width: 3 });
  await openBuilder(page, variants);
  const center = await location(page, 'node-0'), d = await diagnostics(page);
  await page.mouse.click(center.x, center.y - 105 * d.viewport.scale);
  await page.mouse.wheel(0, -70); await page.waitForTimeout(250);
  const resized = await diagnostics(page), bounds = resized.layouts.find(l => l.id === 'node-0')!.bounds, canvas = (await page.locator('canvas[data-renderer="pixi"]').boundingBox())!;
  const corner = CoordinateSystem.worldToScreen({ x: bounds.x + bounds.width, y: bounds.y + bounds.height }, resized.viewport);
  await page.mouse.move(canvas.x + corner.x, canvas.y + corner.y); await page.mouse.down(); await page.mouse.move(canvas.x + corner.x + 35, canvas.y + corner.y + 25, { steps: 4 }); await page.mouse.up();
  await expect.poll(async () => (await diagnostics(page)).elements[0].width).toBeGreaterThan(280);
  await page.keyboard.press('Control+z'); await expect.poll(async () => (await diagnostics(page)).elements[0].width).toBe(280);
  const now = await diagnostics(page), b = now.layouts.find(l => l.id === 'node-0')!.bounds, start = CoordinateSystem.worldToScreen({ x: b.x + b.width, y: b.y + b.height / 2 }, now.viewport);
  const target = now.layouts.find(l => l.id === 'node-1')!.bounds, end = CoordinateSystem.worldToScreen({ x: target.x + target.width / 2, y: target.y }, now.viewport);
  await page.mouse.move(canvas.x + start.x, canvas.y + start.y); await page.mouse.down(); await page.mouse.move(canvas.x + end.x, canvas.y + end.y, { steps: 4 }); await page.mouse.up();
  await expect.poll(async () => (await diagnostics(page)).edges).toBe(2);
  await page.waitForTimeout(650); const strokes = await page.evaluate(() => JSON.parse(localStorage.getItem('js-builder-brush')!) as BrushStroke[]); expect(strokes[0].points[0]).toEqual({ x: 40, y: 90 });
});

test('group drag keeps a common world displacement across differently rotated parents', async ({ page }) => {
  const variants = project(); variants[0].elements[0].rotation = 90;
  variants[0].elements.filter(e => e.type === 'image').forEach(e => { e.fillParent = false; e.x = 30; e.y = 20; e.width = 100; e.height = 80; });
  await openBuilder(page, variants);
  const first = await location(page, 'image-0'), second = await location(page, 'image-1');
  await page.mouse.click(first.x, first.y); await page.keyboard.down('Shift'); await page.mouse.click(second.x, second.y); await page.keyboard.up('Shift');
  const before = await diagnostics(page); await page.mouse.move(first.x, first.y); await page.mouse.down(); await page.keyboard.down('Shift');
  await page.mouse.move(first.x + 40, first.y, { steps: 4 }); await page.mouse.up(); await page.keyboard.up('Shift');
  const after = await diagnostics(page);
  for (const id of ['image-0', 'image-1']) {
    const a = before.layouts.find(l => l.id === id)!.bounds, b = after.layouts.find(l => l.id === id)!.bounds;
    expect(b.x - a.x).toBeCloseTo(40 / before.viewport.scale, 1); expect(b.y).toBeCloseTo(a.y, 1);
  }
});

test('large quality-100 URL images have real canvas pixels and bounded shared GPU textures', async ({ page }) => {
  const png = new PNG({ width: 6000, height: 3000 }); for (let i = 0; i < png.data.length; i += 4) { png.data[i] = 227; png.data[i + 1] = 34; png.data[i + 2] = 153; png.data[i + 3] = 255; }
  const body = PNG.sync.write(png), variants = project();
  variants[0].elements.filter(e => e.type === 'image').forEach((el, i) => { el.src = `https://lh3.googleusercontent.com/test-${i}=s0`; });
  await page.route('https://lh3.googleusercontent.com/**', route => route.fulfill({ body, contentType: 'image/png', headers: { 'Access-Control-Allow-Origin': '*' } }));
  await openBuilder(page, variants);
  await expect.poll(async () => (await page.evaluate(() => (document.querySelector('.pixi-workspace') as HTMLElement & { workspaceDiagnostics: { visuals: { image: string }[] } }).workspaceDiagnostics.visuals)).filter(n => n.image === 'loaded').length).toBe(2);
  const stats = await page.evaluate(() => (document.querySelector('.pixi-workspace') as HTMLElement & { workspaceDiagnostics: { textureStats: { pixels: number } } }).workspaceDiagnostics.textureStats);
  expect(stats.pixels).toBeLessThanOrEqual(2 * 4096 * 2048);
  const pixels = PNG.sync.read(await page.locator('canvas[data-renderer="pixi"]').screenshot()); let magenta = 0;
  for (let i = 0; i < pixels.data.length; i += 4) if (pixels.data[i] > 200 && pixels.data[i + 1] < 60 && pixels.data[i + 2] > 120) magenta++;
  expect(magenta).toBeGreaterThan(10000);
  const frame = await independent(page, await exportHtml(page)); await expect.poll(async () => (await diagnostics(frame)).textures).toBe(2);
  await page.setViewportSize({ width: 390, height: 844 }); await frame.locator('#zoom-fit').click(); await page.screenshot({ path: 'scratch/pixi-export-phone.png' });
  expect(await frame.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('sandboxed export runs without parent access and presents entrance/exit animations', async ({ page }) => {
  const variants = project(), text = createElement('text', { id: 'animated', parentId: 'node-0', x: 20, y: 30, width: 170, height: 80 });
  text.animations = [{ id: 'enter', trigger: 'onClick', type: 'entrance', effect: 'fadeIn', duration: 180, delay: 0, easing: 'linear', order: 1 }, { id: 'exit', trigger: 'onClick', type: 'exit', effect: 'fadeOut', duration: 180, delay: 0, easing: 'linear', order: 2 }]; variants[0].elements.push(text);
  const hidden = structuredClone(text); hidden.id = 'hidden-animated'; hidden.visible = false;
  hidden.animations = hidden.animations.map(a => ({ ...a, id: `hidden-${a.id}`, trigger: 'withPrevious', order: a.order + 0.1 })); variants[0].elements.push(hidden);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message)); await openBuilder(page, variants);
  const frame = await independent(page, await exportHtml(page), true);
  await frame.locator('#present-btn').click();
  const alpha = () => frame.evaluate(() => (document.querySelector('#interactive-container') as HTMLElement & { workspaceDiagnostics: { visuals: { id: string; alpha: number }[] } }).workspaceDiagnostics.visuals.find(v => v.id === 'animated')!.alpha);
  expect(await alpha()).toBe(0); await frame.locator('#next-slide-btn').click(); await expect.poll(alpha).toBe(1);
  expect(await frame.evaluate(() => (document.querySelector('#interactive-container') as HTMLElement & { workspaceDiagnostics: { visuals: { id: string; alpha: number }[] } }).workspaceDiagnostics.visuals.find(v => v.id === 'hidden-animated')!.alpha)).toBe(0);
  await frame.locator('#next-slide-btn').click(); await expect.poll(alpha).toBe(0);
  await frame.locator('#exit-presentation-btn').click(); await expect.poll(alpha).toBe(1); expect(errors).toEqual([]);
});

test('HTML interactive buttons are scoped to their owner and preserve later boundaries', async ({ page }) => {
  const variants = project(3); variants[0].elements[0].interactive = true; variants[0].elements[1].interactive = true;
  await openBuilder(page, variants); const frame = await independent(page, await exportHtml(page));
  const p = await location(frame, 'node-0'), d = await diagnostics(frame); await page.mouse.click(p.x, p.y - 105 * d.viewport.scale);
  const b = d.layouts.find(l => l.id === 'node-0')!.bounds, button = CoordinateSystem.worldToScreen({ x: b.x + b.width + 14, y: b.y + b.height / 2 }, d.viewport);
  await page.mouse.click(button.x, button.y);
  await expect.poll(async () => (await diagnostics(frame)).elements.find(e => e.id === 'node-1')!.visible).toBe(true);
  expect((await diagnostics(frame)).elements.find(e => e.id === 'node-2')!.visible).toBe(false);
});

test('Pixi CDN failure is visible instead of an empty preview', async ({ page }) => {
  await openBuilder(page); const html = await exportHtml(page); await page.unroute('**/pixi.js@8.22.0/dist/pixi.min.js'); await page.route('**/pixi.js@8.22.0/dist/pixi.min.js', route => route.abort());
  await page.route('**/standalone-failure', route => route.fulfill({ body: html, contentType: 'text/html' })); await page.goto('http://127.0.0.1:5173/standalone-failure');
  await expect(page.getByRole('alert')).toContainText('Pixi');
});

test('flow stops at an interactive boundary and handles cycles', () => {
  const v = project(3)[0]; v.elements[0].interactive = true; v.elements[1].interactive = true;
  const flow = new FlowController(() => v.elements, () => v.connections, (ids, visible) => { v.elements.forEach(e => { if (ids.has(e.id)) e.visible = visible; }); });
  flow.reset(); expect(v.elements[1].visible).toBe(false); expect(v.elements[2].visible).toBe(false);
  flow.toggle('node-0', 'right'); expect(v.elements[1].visible).toBe(true); expect(v.elements[2].visible).toBe(false);
  flow.toggle('node-1', 'right'); expect(v.elements[2].visible).toBe(true);
  v.connections.push({ id: 'cycle', fromId: 'node-2', toId: 'node-0', fromPort: 'right', toPort: 'left' }); expect(() => flow.reveal('node-2')).not.toThrow();
});

test('Builder uses one real WebGL canvas; images reuse a texture and pan/zoom keep visuals', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type()) && /WebGL|GL_INVALID|PixiJS|Shader|Uncaught|TypeError/i.test(message.text())) errors.push(message.text()); });
  const variants = project(); variants[0].elements[1].y = 150;
  variants[0].connections[0] = { ...variants[0].connections[0], label: 'Curved Label', labelAlignment: 'follow', reverseLabelDirection: true, arrow: { start: 'circle', end: 'diamond', size: 5 }, stroke: { color: '#ea4474', width: 3, style: 'dashed', lineType: 'curve' } };
  await openBuilder(page, variants); await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);
  await expect(page.locator('.pixi-workspace canvas')).toHaveCount(1); await expect(page.locator('.element-wrapper,.connections-layer')).toHaveCount(0);
  expect((await diagnostics(page)).renderer).toBe(1); expect((await diagnostics(page)).textures).toBe(1);
  await expect.poll(async () => (await diagnostics(page)).textureStats.hits).toBeGreaterThan(0);
  const point = await location(page, 'node-0'); await page.mouse.move(point.x, point.y);
  const before = await diagnostics(page); await page.mouse.wheel(0, -100); await page.waitForTimeout(200);
  const after = await diagnostics(page); expect(after.viewport.scale).toBeGreaterThan(before.viewport.scale); expect(after.textureStats.requests).toBe(1); expect(after.nodeVisualUpdates).toBe(before.nodeVisualUpdates);
  await page.keyboard.down('Space'); await page.mouse.move(800, 650); await page.mouse.down(); await page.mouse.move(900, 700, { steps: 6 }); await page.mouse.up(); await page.keyboard.up('Space');
  await page.getByTitle('Fit in view (Ctrl/⌘+0)').click();
  await page.screenshot({ path: 'scratch/pixi-builder-desktop.png' });
  expect(errors).toEqual([]);
});

test('Builder drag, selection, resize, text editing and brush attachment', async ({ page }) => {
  const variants = project(); variants[0].brushStrokes.push({ id: 'brush', points: [{ x: 40, y: 90 }, { x: 90, y: 120 }], color: '#ff0000', width: 5, attachedNodeId: 'image-0' });
  await openBuilder(page, variants);
  const p = await location(page, 'node-0');
  // Drag the header to avoid selecting its fillParent child.
  const d = await diagnostics(page), y = p.y - 100 * d.viewport.scale;
  await page.mouse.move(p.x, y); await page.mouse.down(); await page.mouse.move(p.x + 70, y + 40, { steps: 6 }); await page.mouse.up();
  await expect.poll(async () => (await diagnostics(page)).elements.find(e => e.id === 'node-0')!.x).toBeGreaterThan(20);
  const moved = await diagnostics(page); expect(moved.elements.find(e => e.id === 'image-0')!.fillParent).toBe(true);
  await page.waitForTimeout(700);
  const strokes = await page.evaluate(() => JSON.parse(localStorage.getItem('js-builder-brush') || '[]') as BrushStroke[]); expect(strokes[0].points[0].x).toBeGreaterThan(40);
  await page.keyboard.press('Delete'); await expect.poll(async () => (await diagnostics(page)).nodes).toBe(2);
});

test('standalone HTML in iframe renders Pixi, survives resize/reload and reset restores brush', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type()) && /WebGL|GL_INVALID|PixiJS|Shader|Uncaught|TypeError/i.test(message.text())) errors.push(message.text()); });
  const variants = project(); variants[0].brushStrokes.push({ id: 'brush', points: [{ x: 40, y: 90 }, { x: 90, y: 120 }], color: '#ff0000', width: 5, attachedNodeId: 'image-0' });
  await openBuilder(page, variants); const html = await exportHtml(page); writeFileSync('scratch/pixi-example.html', html);
  const frame = await independent(page, html); expect((await diagnostics(frame)).renderer).toBe(1);
  await expect(frame.locator('#interactive-container img, #interactive-container svg')).toHaveCount(0);
  const p = await location(frame, 'node-0'), before = await diagnostics(frame);
  await page.mouse.move(p.x, p.y - 100 * before.viewport.scale); await page.mouse.down(); await page.mouse.move(p.x + 50, p.y - 100 * before.viewport.scale + 20, { steps: 5 }); await page.mouse.up();
  await expect.poll(async () => (await diagnostics(frame)).elements.find(e => e.id === 'node-0')!.x).toBeGreaterThan(0);
  expect((await diagnostics(frame)).strokes![0].points[0].x).toBeGreaterThan(40);
  await frame.locator('#reset-layout').click(); expect((await diagnostics(frame)).elements.find(e => e.id === 'node-0')!.x).toBe(0); expect((await diagnostics(frame)).strokes![0].points[0].x).toBe(40);
  await page.setViewportSize({ width: 800, height: 600 }); await expect.poll(async () => (await diagnostics(frame)).size.width).toBeLessThan(900);
  await frame.locator('#zoom-fit').click(); await page.screenshot({ path: 'scratch/pixi-export-mobile.png' });
  await page.locator('iframe').evaluate((el, source) => { (el as HTMLIFrameElement).srcdoc = source; }, html);
  await frame.locator('#interactive-container[data-ready="true"]').waitFor(); expect(errors).toEqual([]);
});

test('HTML text can be added, edited, recolored and deleted, preserving theme defaults', async ({ page }) => {
  await openBuilder(page); const frame = await independent(page, await exportHtml(page));
  await page.mouse.click(500, 760, { button: 'right' }); await frame.locator('#ctx-add-text').click();
  const d = await diagnostics(frame), text = d.elements.find(e => e.id.startsWith('runtime-text-'))!; expect(text.text!.fontFamily).toContain('Lexend Deca'); expect(text.text!.color).toBe('#ffffff');
  const p = await location(frame, text.id); await page.mouse.dblclick(p.x, p.y); await frame.locator('.workspace-text-editor').fill('Long text with all characters and accents: nội dung đầy đủ'); await page.keyboard.press('Enter');
  expect((await diagnostics(frame)).elements.find(e => e.id === text.id)!.text!.content).toContain('nội dung');
  await frame.locator('#theme-toggle-btn').click(); expect((await diagnostics(frame)).elements.find(e => e.id === text.id)!.text!.color).toBe('#111827');
  await frame.locator('#runtime-text-color').evaluate(el => { (el as HTMLInputElement).value = '#ff0000'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  expect((await diagnostics(frame)).elements.find(e => e.id === text.id)!.text!.color).toBe('#ff0000');
  await page.mouse.click(p.x, p.y); await page.keyboard.press('Delete'); await expect.poll(async () => (await diagnostics(frame)).elements.some(e => e.id === text.id)).toBe(false);
});

test('HTML switches variants, preserves empty image title and reports image failure', async ({ page }) => {
  const variants = project(), second = structuredClone(variants[0]); second.id = 'second'; second.name = 'Variant 2'; second.elements[0].name = 'Changed'; if (second.elements[2].type === 'image') second.elements[2].src = 'https://example.invalid/fail.png'; variants.push(second);
  await page.route('**/fail.png', route => route.abort()); await openBuilder(page, variants); const frame = await independent(page, await exportHtml(page));
  expect((await diagnostics(frame)).elements.find(e => e.id === 'image-0')!.name).toBe('');
  await frame.locator('#variant-trigger').click(); await frame.locator('.variant-menu-item[data-id="second"]').click();
  expect((await diagnostics(frame)).activeVariantId).toBe('second'); await expect.poll(async () => (await diagnostics(frame)).failedImages.length).toBe(1);
});

test('large graph culls without recreation or repeated image requests', async ({ page }) => {
  await openBuilder(page, project(240));
  await page.waitForTimeout(1500); const before = await diagnostics(page);
  const frames = await page.evaluate(async () => {
    const samples: number[] = []; let last = performance.now(); const surface = document.querySelector('.canvas')!;
    for (let i = 0; i < 80; i++) { surface.dispatchEvent(new WheelEvent('wheel', { deltaY: i % 2 ? 10 : -10, clientX: 700, clientY: 450, bubbles: true, cancelable: true })); await new Promise(requestAnimationFrame); const now = performance.now(); samples.push(now - last); last = now; }
    return samples.sort((a, b) => a - b);
  });
  const after = await diagnostics(page); expect(after.nodes).toBe(480); expect(after.textureStats.requests).toBe(1); expect(after.nodeVisualUpdates).toBe(before.nodeVisualUpdates); expect(after.edgeUpdates).toBe(before.edgeUpdates);
  writeFileSync('scratch/pixi-after.json', JSON.stringify({ graph: 480, medianFrameMs: frames[40], p95FrameMs: frames[76], domCount: await page.locator('*').count(), diagnostics: { nodes: after.nodes, edges: after.edges, textures: after.textures } }, null, 2));
  await page.mouse.move(700, 450);
  for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, -1000); await page.waitForTimeout(150); }
  await expect.poll(async () => (await diagnostics(page)).culled).toBeGreaterThan(100);
  expect((await diagnostics(page)).textureStats.requests).toBe(1);
});

test('Preview follows the standalone Pixi export path', async ({ page }) => {
  await openBuilder(page); await page.getByTitle('Live Preview Code', { exact: true }).click();
  await page.getByTitle('Live Preview', { exact: true }).waitFor();
  const preview = page.frames().find(f => f !== page.mainFrame())!; await preview.locator('#interactive-container[data-ready="true"]').waitFor();
  expect((await diagnostics(preview)).renderer).toBe(1); await expect(preview.locator('#interactive-container img,#interactive-container svg')).toHaveCount(0);
  await page.screenshot({ path: 'scratch/pixi-preview.png' });
});

test('large exported graph has an independent benchmark and texture lifecycle', async ({ page }) => {
  const variants = project(240), second = project()[0]; second.id = 'small'; second.name = 'Small'; variants.push(second);
  await openBuilder(page, variants); const html = await exportHtml(page), start = Date.now(), frame = await independent(page, html);
  const loadMs = Date.now() - start; await frame.waitForTimeout(800); const before = await diagnostics(frame);
  const samples = await frame.evaluate(async () => {
    const result: number[] = []; const host = document.querySelector('#interactive-container')!; let last = performance.now();
    for (let i = 0; i < 60; i++) { host.dispatchEvent(new WheelEvent('wheel', { deltaY: i % 2 ? 10 : -10, clientX: 700, clientY: 450, bubbles: true, cancelable: true })); await new Promise(requestAnimationFrame); const now = performance.now(); result.push(now - last); last = now; }
    return result.sort((a, b) => a - b);
  });
  const after = await diagnostics(frame); expect(after.textureStats.requests).toBe(1); expect(after.nodeVisualUpdates).toBe(before.nodeVisualUpdates);
  writeFileSync('scratch/pixi-export-performance.json', JSON.stringify({ loadMs, medianFrameMs: samples[30], p95FrameMs: samples[57], nodes: after.nodes, edges: after.edges, domCount: await frame.locator('*').count() }, null, 2));
  await frame.locator('#variant-trigger').click(); await frame.locator('.variant-menu-item[data-id="small"]').click();
  expect((await diagnostics(frame)).nodes).toBe(4); expect((await diagnostics(frame)).textures).toBe(1); expect((await diagnostics(frame)).textureStats.requests).toBe(1);
});

test('export/import retains empty titles, geometry, styles and brush attachments', async ({ page }) => {
  const variants = project(); variants[0].brushStrokes.push({ id: 'attached', attachedNodeId: 'image-0', points: [{ x: 20, y: 60 }, { x: 40, y: 90 }], width: 4, color: '#ff00aa' });
  await openBuilder(page, variants); const html = await exportHtml(page), parsed = ImportService.parseStateFromHtml(html);
  expect(parsed.variants[0].elements).toEqual(variants[0].elements); expect(parsed.variants[0].brushStrokes).toEqual(variants[0].brushStrokes);
  expect(html).not.toContain('src="/src/'); expect(html).not.toContain('type="module"');
});

test('image metadata and rendering share requests; deleting the last owner releases textures', async ({ page }) => {
  await openBuilder(page); const point = await location(page, 'image-0'); await page.mouse.click(point.x, point.y);
  const url = page.locator('.properties-panel input[placeholder="https://..."]');
  await url.fill('http://127.0.0.1:5173/JS_Builder/assets/test-image.png?replacement');
  await expect.poll(async () => (await diagnostics(page)).textureStats.requests).toBe(2);
  await expect.poll(async () => (await diagnostics(page)).textureStats.hits).toBeGreaterThan(1);
  await page.locator('.canvas').click({ position: { x: 1050, y: 750 } }); await page.keyboard.press('Control+a'); await page.keyboard.press('Delete');
  await expect.poll(async () => (await diagnostics(page)).nodes).toBe(0); await expect.poll(async () => (await diagnostics(page)).textures).toBe(0);
});

test('video overlays clip to rotated parents and foreground nodes, in both runtimes', async ({ page }) => {
  const variants = project(), video = createElement('video', { id: 'video', parentId: 'node-0', name: '', src: 'about:blank', x: -30, y: 30, width: 340, height: 150 });
  variants[0].elements[0].rotation = 15; variants[0].elements.push(video);
  await openBuilder(page, variants); const overlay = page.locator('.workspace-native-overlay iframe'); await expect(overlay).toHaveCount(1);
  const clip = await overlay.evaluate(el => getComputedStyle(el).clipPath); expect(clip).toContain('path('); expect(clip).not.toContain('M0 0 Z');
  const frame = await independent(page, await exportHtml(page)); await expect(frame.locator('.workspace-native-overlay iframe')).toHaveCount(1);
  expect(await frame.locator('.workspace-native-overlay iframe').evaluate(el => getComputedStyle(el).clipPath)).toContain('path(');
});

test('rich-text links keep native click behavior without DOM graph rendering', async ({ page }) => {
  const variants = project(), text = createElement('text', { id: 'linked', x: 30, y: 320, width: 300, height: 80 }); text.text.content = '<a href="https://example.test/document">Open document</a>'; variants[0].elements.push(text);
  await page.context().route('https://example.test/**', route => route.fulfill({ body: 'Document', contentType: 'text/html' }));
  await openBuilder(page, variants); const frame = await independent(page, await exportHtml(page));
  await expect(frame.locator('.workspace-link-overlay a')).toHaveCount(1); const popup = page.waitForEvent('popup'); await frame.locator('.workspace-link-overlay a').click(); const opened = await popup; await opened.waitForLoadState(); expect(opened.url()).toBe('https://example.test/document'); await opened.close();
  await expect(frame.locator('#interactive-container img,#interactive-container svg')).toHaveCount(0);
});
