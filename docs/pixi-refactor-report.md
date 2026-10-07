# Báo cáo refactor workspace sang PixiJS

## 1. Kiến trúc trước và sau

Trước: React/DOM vẽ từng phần tử bằng `ElementWrapper`; CSS transform điều khiển
workspace, SVG vẽ connection và brush. HTML export có renderer DOM/SVG và runtime
riêng, gồm các phép tính tọa độ/visibility/drag trùng với Builder.

Sau: React giữ toolbar, panel, dialog, menu, ruler và điều khiển trình chiếu.
`SceneRenderer` dùng một `PIXI.Application` cho mỗi workspace. Builder và HTML
export dùng cùng các lớp trong `src/workspace`, không duy trì hai renderer graph.

```text
Application / ExportController
  -> SceneRenderer -> PIXI.Application -> world
       grid -> connections -> nested elements -> brush -> editing overlays
  -> DomOverlay: rich-text input, video iframe, hyperlink hit regions
```

Bản đồ dependency trước/sau chi tiết hơn: `docs/pixi-architecture.md`.

## 2. Các file đã sửa

- `src/components/Canvas.tsx`: bỏ DOM/SVG graph, giữ UI và chuyển viewport sang Pixi.
- `src/BuilderContext.tsx`: đồng bộ brush bằng ma trận, chia sẻ loader metadata ảnh.
- `src/components/PropertiesPanel.tsx`: metadata URL dùng chung TextureManager;
  chống kết quả tải cũ ghi đè ảnh mới.
- `src/services/HtmlExportService.ts`: thay exporter DOM/SVG bằng snapshot + shared runtime.
- `src/services/GeometryService.ts`: hit-test brush dùng toàn bộ cây cha và thứ tự vẽ.
- `src/managers/BrushManager.ts`, `src/managers/ElementManager.ts`: eraser chung,
  xóa cây con và brush đính kèm nhất quán.
- `src/animations/index.ts`, `src/models/Connection.ts`, `src/models/compat.ts`:
  bỏ helper renderer cũ và cập nhật mô tả; giữ model/migration đang dùng.
- `src/App.css`: bỏ CSS của wrapper, port, resize/rotate và renderer graph cũ.
- `vite.config.js`, `src/vite-env.d.ts`, `package.json`, `package-lock.json`:
  dependency Pixi, export bundle và kiểm thử.
- `.gitignore`, `eslint.config.js`: loại trừ output kiểm thử/đo hiệu năng.

## 3. Các file mới

- `src/components/PixiWorkspace.tsx`: adapter React/state/managers.
- `src/workspace/contract.ts`, `CoordinateSystem.ts`, `GraphGeometry.ts`,
  `PathGeometry.ts`: contract và hình học chung.
- `src/workspace/SceneRenderer.ts`, `NodeView.ts`, `ConnectionView.ts`,
  `TextureManager.ts`, `Drawing.ts`: scene, hình ảnh, đường nối và styling.
- `src/workspace/GestureController.ts`, `FlowController.ts`, `AnimationPlayer.ts`,
  `BrushGeometry.ts`: tương tác, flow, animation và brush.
- `src/workspace/DomOverlay.ts`, `NativeVideoClip.ts`, `TextContent.ts`:
  native editing/video/link overlay và rich-text an toàn.
- `src/export/ExportController.ts`, `entry.ts`, `template.ts`, `export.css`:
  runtime HTML độc lập và UI ngoài canvas.
- `build/pixi-export-plugin.js`: bundle shared core thành inline IIFE.
- `playwright.config.ts`, `tests/fixtures.ts`, `tests/workspace.spec.ts`:
  kiểm thử browser cho cả hai môi trường.
- `docs/pixi-architecture.md`, `docs/pixi-refactor-report.md`: tài liệu kiến trúc/kết quả.

## 4. Renderer cũ đã xóa

Đã xóa `src/components/ElementWrapper.tsx`, DOM/SVG workspace trong Canvas,
runtime DOM/SVG dài trong exporter, CSS renderer không dùng, animation-style
helper cũ, `getConnectionDasharray`, và `src/services/element-accessors.ts` cùng
re-export không còn consumer. Không có DOM image hoặc SVG connection renderer
chạy song song với Pixi. SVG icon của toolbar và native DOM overlay vẫn có lý do sử dụng.

## 5. Data flow mới

Model serializable vẫn là nguồn dữ liệu: variants/elements/connections/brush/guides.
Storage keys, migration và tag `js-builder-state` giữ tương thích import/export.
Pixi Container/Sprite/Graphics không chứa business state duy nhất của project.

Builder: manager cập nhật model -> React adapter -> scene reconcile theo ID.
HTML: JSON snapshot -> ExportController -> cùng scene/geometry/gesture classes.
Tương tác trả về thay đổi model; renderer nhận lại model rồi cập nhật visual.
Variant, undo/redo, reset và brush đều đi qua dữ liệu, không đọc lại DOM graph.

## 6. Pan/zoom và tọa độ

Pan/zoom cập nhật trực tiếp position/scale của `world`. Builder commit viewport
về React sau khoảng nghỉ 120 ms, không rebuild visual cho từng wheel frame.
`screenToWorld`, `worldToScreen`, `zoomAt`, `fit` dùng chung CoordinateSystem.
GraphGeometry xử lý parent chain, header thực sự hiện diện, inset, fillParent,
rotation, scale, bounds và port. ResizeObserver cập nhật canvas theo container.
Native overlay dùng cùng ma trận, kể cả ma trận đang chạy animation.

## 7. Cache và lifecycle ảnh

TextureManager cache theo URL, chia sẻ promise/Texture và reference count.
Giới hạn ba request đang tải; node/variant còn dùng URL sẽ không mất texture
khi một owner bị xóa. Metadata kích thước và rendering chia sẻ cùng request.
Lease trong reconcile giữ texture khi variant thay ID nhưng vẫn dùng cùng URL.

Có trạng thái loading/failure, timeout, generation guard, crop/contain/fill,
focal position và hủy tài nguyên khi xóa/unmount/replace. Texture hiển thị giới
hạn cạnh lớn nhất 4096 hoặc giới hạn GPU thấp hơn; URL, quality và kích thước
ảnh gốc vẫn giữ trong dữ liệu. Texture downsample có thể giảm chi tiết khi zoom rất sâu.

## 8. Connection rendering

Graphics vẽ curve/straight/elbow, solid/dashed/dotted, màu, độ rộng, mũi tên và nhãn.
Port dựa trên ma trận node, không query DOM. Signature chỉ rebuild edge khi
endpoint/style thay đổi. PathGeometry cache độ dài đoạn, hỗ trợ wire reveal,
dash pulse và nhãn đặt từng grapheme dọc đường cong, kể cả reverse direction.
Làm mới nhãn sau khi font tải xong; hit area dùng đường đã lấy mẫu và scale viewport.

## 9. HTML export

Exporter nhúng JSON snapshot, CSS/UI controls và inline runtime IIFE được build
từ `src/export/entry.ts` cùng shared core. Preview dùng chính HTML này trong iframe.
Không export React, module nội bộ, Builder state runtime hay đường dẫn dev module.
Nguồn ảnh/font bên ngoài vẫn là URL; URL localhost do người dùng đưa vào project
không tự biến thành URL public khi xuất HTML.

## 10. Pixi trong generated HTML

Cả dependency Builder và CDN runtime được pin tại PixiJS **8.22.0**:
`https://cdn.jsdelivr.net/npm/pixi.js@8.22.0/dist/pixi.min.js`.
Script Pixi chạy trước entry runtime. CDN/WebGL failure có thông báo hiển thị,
không để preview trắng im lặng. Có thể cấu hình URL HTTPS do mình quản lý qua
`generateExportHTML(snapshot, { pixiUrl })`; URL đó cần cung cấp bản tương thích.

## 11. Chạy độc lập trong iframe/Google Sites

Runtime dựng Application và canvas riêng, không dùng `window.top`, parent DOM,
React hoặc canvas của Builder. Pointer/wheel chỉ gắn vào workspace; resize theo
iframe/container. localStorage là tùy chọn, có xử lý khi sandbox cấm truy cập.
Đã chạy độc lập sau khi rời trang Builder, trong iframe same-origin và iframe
sandbox opaque-origin `allow-scripts`. Chưa đăng lên Google Sites thật vì không
có trang/tài khoản đích; kiểm thử dùng môi trường iframe tương đương được yêu cầu.

## 12. Optimization và số đo

Đã áp dụng: scene reuse theo ID, visual signatures, texture ref-count/cache,
request queue, GPU texture cap, DPR tối đa 2, viewport culling với margin,
on-demand rendering, coalesced drag pointermove, grid TilingSprite, và cache
root subtree khi scale < 0.5. Tắt subtree cache khi trình chiếu/animation/edit text.
Culling không destroy/reload node; đổi renderability của child làm mới root cache.

Benchmark Chromium/SwiftShader, viewport 1440x900, graph 240 node + 240 ảnh,
239 connection, tất cả ảnh dùng chung một URL. Builder đo cùng chuỗi 80 wheel events.

| Chỉ số | Builder cũ | Builder Pixi | HTML Pixi độc lập |
| --- | ---: | ---: | ---: |
| Median khoảng cách frame | 445.4 ms | 43.0 ms | 38.0 ms |
| P95 khoảng cách frame | 1341.8 ms | 77.9 ms | 429.8 ms |
| DOM toàn tài liệu | 6272 | 271 | 131 |
| Texture ảnh dùng chung | Không có GPU cache | 1 | 1 |

HTML đo riêng 60 wheel events; startup lần đo đó khoảng 5.69 giây. Không dùng
số startup HTML để so với startup Builder. Số đo là rAF interval, không phải
GPU render time riêng. Kết quả dao động theo máy/font/cache/tải đồng thời;
không cam kết 60 FPS. Các output nằm trong `scratch/pixi-*.json` (không commit).

## 13. Bottleneck và giới hạn còn lại

- Ảnh cực lớn vẫn phải được trình duyệt decode trước khi downsample/upload;
  Pixi không loại bỏ peak CPU/RAM của ảnh nguồn quality 100.
- URL phải cho phép CORS để dùng WebGL texture. Chưa kiểm thử link Drive production
  thật của người dùng; test dùng URL response có CORS và case tải lỗi có kiểm soát.
- Cache nhiều URL khác nhau vẫn có thể dùng nhiều VRAM; chưa có global memory
  budget/LRU. Culling giới hạn việc vẽ, chưa trì hoãn mọi tải ảnh ngoài viewport.
- Culling và model reconcile còn O(N+E); chưa có spatial index. Reparent hierarchy
  và React panel/storage updates vẫn có chi phí khi edit graph rất lớn.
- Text/rich text, font rasterization, shadow texture và lần tạo subtree cache đầu
  tiên còn có thể tạo frame spike. Curve dùng 32 đoạn; typographic kerning của
  nhãn từng grapheme không hoàn toàn giống SVG textPath.
- Video iframe phải giữ native DOM; clip theo cha/foreground có giới hạn ở
  translucent overlap, rounded corners và silhouette chữ/icon. Không khẳng định
  pixel-perfect compositing với canvas trong các trường hợp đó.
- Reparent giữa các cha có non-uniform scale kết hợp rotation chưa biểu diễn
  được mọi affine shear qua model hiện tại. Test kéo nhóm khác góc cha đã qua.
- Build còn cảnh báo chunk Pixi >500 kB: khoảng 891 kB minified / 255 kB gzip.
  Đã tách chunk Pixi, không che cảnh báo bằng tăng ngưỡng.
- Chưa kiểm thử Safari/Firefox, GPU thiết bị thật, mất context do driver, hoặc
  đăng Google Sites thực tế. WebGL không khả dụng sẽ hiện lỗi, không fallback DOM.

## 14. Test/build đã chạy

`npm run check`: lint + TypeScript + production build đã qua.
`npm test`: **22/22 bài qua**, tổng thời gian 59.3 giây, với Chromium và Pixi thật.

Coverage: tọa độ/rotation/fillParent/cycles, group drag khác cha, controls resize/
connect sau zoom, undo brush, ảnh 6000x3000 quality 100 và pixel canvas, texture
reuse/release, CDN/image failure, presentation entrance/exit và phần tử ẩn,
interactive flow boundary, pan/zoom/fit/reset, responsive resize/reload iframe,
runtime text edit/color/delete/theme, variants, preview, export/import round-trip,
video clipping, native hyperlinks, large-graph benchmark/culling và serious console errors.

Production dependency audit: **0 vulnerabilities** (`npm audit --omit=dev`).
Full audit còn 11 cảnh báo toolchain/dev dependency (1 moderate, 10 high);
không tự áp dụng breaking/downgrade fixes ngoài phạm vi renderer.

Trang kiểm tra đang chạy: `http://127.0.0.1:5173/JS_Builder/`.

## 15. Vấn đề kiến trúc liên quan đã phát hiện/sửa

- Geometry cũ giả định header ngay cả khi title rỗng và thiếu transform nhiều cấp.
- Brush cần đi theo ma trận của phần tử đính kèm, không chỉ tọa độ node cha;
  undo/restore không được dịch brush thêm lần nữa.
- Xóa selection cần xử lý toàn bộ descendants, connection và attached strokes.
- Loader metadata độc lập từng decode lại ảnh URL và có race khi đổi URL nhanh.
- Presentation effect cũ có thể lặp cập nhật; Shift+Space bị nhánh next chặn.
- Animation không được làm phần tử model đã ẩn hiện lại; base transform chỉ lấy
  sau khi đã gắn đúng hierarchy, kể cả dữ liệu child xuất hiện trước parent.
- Nhóm phần tử trong các cha xoay khác nhau cần cùng world displacement thay vì
  áp cùng local delta của phần tử được kéo đầu tiên.
- Export cần escape JSON/script/attribute và sanitize rich text; optional storage
  phải chịu được sandbox, và lỗi CDN/WebGL cần hiển thị rõ.
