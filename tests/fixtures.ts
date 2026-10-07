import { createElement } from '../src/models/Element';
import type { Variant } from '../src/types';

export function project(count = 2): Variant[] {
  const elements = Array.from({ length: count }, (_, i) => createElement('node', { id: `node-${i}`, name: `Node ${i + 1}`, x: (i % 16) * 320, y: Math.floor(i / 16) * 280, width: 280, height: 240, zIndex: i }));
  elements.push(...Array.from({ length: count }, (_, i) => createElement('image', { id: `image-${i}`, name: '', parentId: `node-${i}`, fillParent: true, src: 'http://127.0.0.1:5173/JS_Builder/assets/test-image.png', width: 200, height: 140 })));
  const connections = Array.from({ length: Math.max(0, count - 1) }, (_, i) => ({ id: `edge-${i}`, fromId: `node-${i}`, toId: `node-${i + 1}`, fromPort: 'right' as const, toPort: 'left' as const }));
  return [{ id: 'default', name: 'Variant 1', elements, connections, brushStrokes: [], guides: [] }];
}
