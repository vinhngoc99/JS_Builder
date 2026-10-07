# Workspace rendering architecture

## Before

- `BuilderContext` owns serializable variants, elements, connections, strokes,
  selection, presentation and viewport state. Stable OOP managers mutate it.
- `Canvas` applies a CSS world transform, renders the grid as a CSS pattern,
  connections and brush as SVG, and delegates nested elements to `ElementWrapper`.
- `ElementWrapper` draws DOM images/cards/text/shapes, handles dragging, snapping,
  reparenting, resize, rotate, ports, rich-text editing and image focal points.
- Coordinates are world units for roots and local units for children. Nodes
  inset children by 16px with a 45px header. The old geometry always assumed a
  header even when it was absent; connection geometry only handled one parent.
- Layer order is sibling zIndex/order, connections below elements, brush above.
- Fit uses root bounds; presentation fits slide nodes. Wheel zoom anchors at the
  pointer; space-drag pans. Export additionally supports reset and flow autoplay.
- `HtmlExportService` produces static nested DOM, SVG connections/brush, variant
  templates and an inline runtime. Its independent geometry reads DOM styles.
  Visibility, flow, animation, drag, reset and brush history query/mutate DOM.
- `ImportService` reads `js-builder-state`; storage and migration operate on the
  model rather than renderer output. Preview consumes the same HTML exporter.
- DOM geometry consumers: Canvas viewport/rulers/menu; ElementWrapper drag drop,
  resize/rotate/focal points; SlideNavigator viewport; exported workspace runtime.

## After

- `workspace/CoordinateSystem` is the viewport transform contract.
- `workspace/GraphGeometry` resolves the complete parent chain, local transforms,
  fillParent, rotated bounds, ports and connection curves from model data.
- `workspace/TextureManager` owns URL loading, reference counts, a bounded queue,
  decode/upload limits and shared texture disposal.
- `workspace/SceneRenderer` owns one Pixi Application and the world layers:
  grid, connections, nested elements, brush and editing overlays. It reconciles
  by id, updates only changed visuals, and culls without recreating objects.
- `workspace/DomOverlay` owns native rich-text input, iframe video and transparent
  hyperlink hit regions. All display text remains in the Pixi scene.
- `components/PixiWorkspace` adapts shared renderer events to existing managers.
  Canvas keeps its DOM toolbar, rulers, menus, shortcuts and presentation controls.
- `export/ExportController` reconstructs the same renderer from embedded variants
  and owns standalone flow, presentation, brush, viewport and UI state.
- A Vite plugin bundles the export entry and shared classes into an inline IIFE.
  No React, localhost, module imports or Builder runtime are exported. Pixi is
  loaded from a configurable, version-pinned URL before controller initialization.
- `js-builder-state` and storage keys remain compatible. Pixi objects never own
  project business data. Native overlays use the same coordinate matrices.

## Validation

Automated browser scenarios cover Builder and independent HTML in an iframe,
WebGL pixels, image reuse/failure, pan/zoom/fit/reset, resize, hierarchy, brush,
variants, flow boundaries, text creation/deletion, and a large graph. See the
refactor report for measured results and environmental limitations.
