import { useEffect, useRef, useState, type RefObject } from 'react';
import * as PIXI from 'pixi.js';
import { useBuilder } from '../BuilderContext';
import { SceneRenderer } from '../workspace/SceneRenderer';
import { DomOverlay } from '../workspace/DomOverlay';
import { GestureController } from '../workspace/GestureController';
import type { SceneOverlay, SceneOptions } from '../workspace/contract';

interface Props { overlay: SceneOverlay; panMode: boolean; onSnap: (point: { x: number | null; y: number | null }) => void; rendererRef: RefObject<SceneRenderer | null> }

export function PixiWorkspace({ overlay, panMode, onSnap, rendererRef }: Props) {
  const builder = useBuilder();
  const host = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneRenderer | null>(null);
  const nativeRef = useRef<DomOverlay | null>(null);
  const live = useRef({ builder, overlay, panMode, onSnap });
  live.current = { builder, overlay, panMode, onSnap };
  const [error, setError] = useState('');
  const options = (): SceneOptions => {
    const { builder: b, panMode: p } = live.current;
    return { editing: true, selectedIds: b.selectedIds, selectedConnectionId: b.selectedConnectionId, presenting: b.isPresenting, playedAnimationIds: b.playedAnimationIds, previewAnimationId: b.previewAnimationId, theme: b.theme, brushMode: b.isBrushMode, panMode: p, connectingId: b.connectingNode?.id, focalId: b.editingFocalPointId };
  };
  const syncNative = () => {
    const scene = sceneRef.current, b = live.current.builder;
    if (scene) nativeRef.current?.sync(b.elements, scene.geometry, scene.viewport, b.theme, b.isPresenting);
  };
  useEffect(() => {
    const container = host.current; if (!container) return;
    let dead = false;
    const scene = new SceneRenderer(PIXI, container, { error: setError });
    sceneRef.current = scene;
    rendererRef.current = scene;
    let gestures: GestureController | undefined;
    void scene.init().then(() => {
      if (dead) return;
      const native = new DomOverlay(container, (id, updates) => { live.current.builder.saveHistory(); live.current.builder.updateElement(id, updates); }, id => scene.setTextEditing(id), id => scene.nativeVisual(id));
      nativeRef.current = native;
      live.current.builder.registerImageDimensions(src => scene.textures.dimensions(src));
      gestures = new GestureController(scene, {
        state: () => { const b = live.current.builder; return { elements: b.elements, connections: b.connections, brushStrokes: b.brushStrokes, selectedIds: b.selectedIds, presenting: b.isPresenting, editing: true, snap: b.isSnapEnabled, guides: b.guides, connecting: b.connectingNode, focalId: b.editingFocalPointId }; },
        select: (id, multi) => { const b = live.current.builder; if (!b.selectedIds.includes(id) || multi) b.selectElement(id, multi); },
        selectConnection: id => live.current.builder.selectConnection(id),
        patch: changes => changes.forEach(change => live.current.builder.updateElement(change.id, change.updates)),
        history: () => live.current.builder.saveHistory(),
        connect: (from, fp, to, tp) => live.current.builder.addConnection(from, fp, to, tp),
        setConnecting: value => live.current.builder.setConnectingNode(value),
        setFocal: id => live.current.builder.setEditingFocalPointId(id),
        snapGuides: point => live.current.onSnap(point),
      });
      scene.setCallbacks({
        error: setError,
        viewport: syncNative,
        frame: () => native.refreshVideos(),
        textHeight: (id, height) => live.current.builder.updateElement(id, { height }),
        pointerDown: gestures.down,
        pointerUp: gestures.portUp,
        doubleClick: ({ target }) => {
          const b = live.current.builder;
          if (target.kind === 'rotate') { b.saveHistory(); b.updateElement(target.id, { rotation: 0 }); return; }
          if (target.kind !== 'element' || b.isPresenting) return;
          const el = b.elements.find(e => e.id === target.id); if (el && ['node', 'text', 'button', 'shape'].includes(el.type)) native.edit(el);
        },
        click: ({ target }) => {
          const b = live.current.builder;
          if (!b.isPresenting || gestures?.moved || target.kind !== 'element') return;
          const el = b.elements.find(e => e.id === target.id); if (el?.type !== 'button' || el.disabled) return;
          const a = el.action, targetEl = b.elements.find(e => e.id === a.target);
          if (a.type === 'link' && /^(https?:|mailto:)/i.test(a.link)) window.open(a.link, '_blank', 'noopener,noreferrer');
          if (a.type === 'alert') b.showAlert(a.target || 'Button clicked!', 'Notification');
          if (a.type === 'toggleVisibility' && targetEl) b.updateElement(targetEl.id, { visible: !targetEl.visible });
          if (a.type === 'toggleDisabled' && targetEl) b.updateElement(targetEl.id, { disabled: !targetEl.disabled });
          if (a.type === 'triggerFlow') b.revealDownstream(a.target);
          const slides = b.elements.filter(e => e.type === 'node' && e.isSlide !== false).sort((x, y) => x.x - y.x);
          if (a.type === 'nextSlide') b.setCurrentSlideIndex(Math.min(slides.length - 1, b.currentSlideIndex + 1));
          if (a.type === 'prevSlide') b.setCurrentSlideIndex(Math.max(0, b.currentSlideIndex - 1));
          if (a.type === 'goToSlide') { const index = slides.findIndex(s => s.id === a.target); if (index >= 0) b.setCurrentSlideIndex(index); }
        },
      });
      const b = live.current.builder; scene.setData(b, options()); scene.setViewport({ pan: b.pan, scale: b.scale }); scene.setOverlay(live.current.overlay); syncNative(); container.dataset.ready = 'true';
      Object.defineProperty(container, 'workspaceDiagnostics', { configurable: true, get: () => scene.diagnostics });
    }).catch(() => { if (!dead) setError('WebGL unavailable. Enable hardware acceleration or try another browser.'); });
    return () => { dead = true; live.current.builder.registerImageDimensions(null); gestures?.destroy(); nativeRef.current?.destroy(); nativeRef.current = null; scene.destroy(); sceneRef.current = null; rendererRef.current = null; delete container.dataset.ready; };
    // The adapter reads live refs; the renderer is created once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    sceneRef.current?.setData(live.current.builder, options()); syncNative();
  }, [builder.elements, builder.connections, builder.brushStrokes, builder.selectedIds, builder.selectedConnectionId, builder.theme, builder.isPresenting, builder.playedAnimationIds, builder.previewAnimationId, builder.isBrushMode, builder.connectingNode, builder.editingFocalPointId, panMode]);
  useEffect(() => {
    sceneRef.current?.setViewport({ pan: builder.pan, scale: builder.scale }); syncNative();
  }, [builder.pan, builder.scale]);
  useEffect(() => { sceneRef.current?.setOverlay(overlay); }, [overlay]);
  return <div ref={host} className="pixi-workspace" style={{ position: 'absolute', inset: 0 }}>
    {error && <div role="alert" className="workspace-error">{error}</div>}
  </div>;
}
