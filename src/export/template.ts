import type { ExportSnapshot } from '../services/HtmlExportService';
import { escapeHtml } from '../services/dom-utils';

export function exportControls(snapshot: ExportSnapshot): string {
  return `      <button class="theme-toggle-btn" id="autoplay-btn" title="Auto Play Flow" style="right: 92px; display: flex; align-items: center; justify-content: center; background: #4caf50;">
        <svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        <svg class="pause-icon" style="display:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>
      </button>
      <button class="theme-toggle-btn" id="autoplay-settings-btn" title="Autoplay Settings" style="right: 132px; display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
 
      <!-- Autoplay Settings Panel -->
      <div id="autoplay-settings-panel" style="display: none; position: fixed; top: 50px; right: 132px; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; width: 220px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); z-index: 10000; font-family: inherit; font-size: 13px; color: var(--text-primary);">
        <div style="margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span>Autoplay Settings</span>
          <button id="autoplay-settings-close" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 14px; font-weight: bold; padding: 0;">&times;</button>
        </div>
        <div style="margin-bottom: 10px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 600;">Reveal Mode</label>
          <div style="display: flex; gap: 8px;">
            <button id="mode-step-btn" style="flex: 1; padding: 6px; font-size: 11px; background: #3f51b5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Step-by-Step</button>
            <button id="mode-instant-btn" style="flex: 1; padding: 6px; font-size: 11px; background: var(--btn-bg); color: var(--text-primary); border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Instant (All)</button>
          </div>
        </div>
        <div id="delay-settings-container" style="margin-bottom: 4px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 600;">Step Delay (seconds)</label>
          <input type="number" id="autoplay-delay-input" min="0.1" max="10.0" step="0.1" value="1.5" style="width: 100%; box-sizing: border-box; padding: 6px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-primary); outline: none; font-size: 13px;" />
        </div>
      </div>
      <button class="theme-toggle-btn" id="present-btn" title="Present Slideshow" style="right: 52px; display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <button class="theme-toggle-btn" id="theme-toggle-btn" title="Toggle Theme">
        <svg class="sun-icon" style="display:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      </button>
      <!-- Variant Selector -->
      ${snapshot.variants.length > 1 ? `
      <div class="variant-dropdown-container" id="variant-dropdown-container">
        <button id="variant-trigger" class="variant-dropdown-trigger">
          <span id="active-variant-name">${escapeHtml(snapshot.variants.find(v => v.id === snapshot.activeVariantId)?.name || 'Variant 1')}</span>
          <svg class="dropdown-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="variant-dropdown-menu" id="variant-dropdown-menu">
          ${snapshot.variants.map(rv => `
            <button class="variant-menu-item ${rv.id === snapshot.activeVariantId ? 'active' : ''}" data-id="${escapeHtml(rv.id)}">
              ${escapeHtml(rv.name)}
            </button>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div id="interactive-container"></div>
      <div id="html-context-menu" class="html-context-menu">
        <button id="ctx-add-text" type="button">Add Text</button>
        <button id="ctx-delete-text" class="danger" type="button" style="display:none;">Delete Text</button>
      </div>
      <div class="brush-toolbar hidden-toolbar">
        <button id="brush-toggle" class="btn-tool" title="Brush (B)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg></button>
        <button id="eraser-toggle" class="btn-tool" title="Eraser (E)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.9-9.9c1-1 2.5-1 3.4 0l4.3 4.3c1 1 1 2.5 0 3.4L10.5 21c-1 1-2.5 1-3.4 0Z"/><path d="m11 6 4 4"/></svg></button>
        <button id="brush-clear" class="btn-tool" title="Clear (X)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <button id="undo-btn" class="btn-tool" title="Undo (Ctrl/⌘+Z)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
        <button id="redo-btn" class="btn-tool" title="Redo (Ctrl/⌘+Y)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></button>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div style="display:flex; align-items:center; gap:6px; padding:0 4px;">
          <span style="font-size:11px; color:var(--text-secondary); user-select:none;">Size:</span>
          <input type="range" id="brush-width-slider" min="1" max="100" value="4" style="width:60px; cursor:pointer;" title="Brush Width">
          <span id="brush-width-val" style="font-size:11px; color:var(--text-secondary); min-width:14px; text-align:right;">4</span>
        </div>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div class="color-picker-btn"><input type="color" id="brush-color" value="#4caf50" style="width:150%;height:150%;margin:-25%;border:none;cursor:pointer;background:none;"></div>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div style="display:flex; align-items:center; gap:6px; padding:0 4px;" title="Text color">
          <span style="font-size:11px; color:var(--text-secondary); user-select:none;">Text:</span>
          <div class="color-picker-btn"><input type="color" id="runtime-text-color" value="#e0e0e0" style="width:150%;height:150%;margin:-25%;border:none;cursor:pointer;background:none;"></div>
        </div>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <button id="brush-hide" class="btn-tool" title="Hide Toolbar (H)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg></button>
      </div>
      <button id="brush-show-btn" class="btn-tool" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1001; display: flex; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 50%; width: 32px; height: 32px; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.5); cursor: pointer; color: var(--text-primary);" title="Show Toolbar (H)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div id="presentation-bar" style="display: none; position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 24px; padding: 8px 24px; align-items: center; gap: 20px; z-index: 10000; box-shadow: 0 12px 32px rgba(0,0,0,0.6); color: var(--text-primary);">
        <button class="conn-btn" id="prev-slide-btn" tabindex="-1" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">&larr; Prev</button>
        <select id="slide-select" tabindex="-1" style="background: var(--input-bg); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 4px 8px; font-size: 13px; font-weight: 600; cursor: pointer; outline: none;"></select>
        <button class="conn-btn" id="next-slide-btn" tabindex="-1" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">Next &rarr;</button>
        <div style="width: 1px; background: var(--border-color); height: 20px;"></div>
        <button class="conn-btn" id="notes-toggle-btn" tabindex="-1" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">Notes</button>
        <button class="conn-btn" id="exit-presentation-btn" tabindex="-1" style="background: #ef5350; border-radius: 12px; padding: 6px 16px; border: none; font-size: 13px; cursor: pointer; color: #fff; font-weight: 600;">Exit</button>
      </div>
      <div id="speaker-notes-panel" style="display: none; position: fixed; right: 24px; bottom: 88px; width: min(360px, calc(100vw - 48px)); max-height: min(260px, calc(100vh - 140px)); overflow: auto; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.55); z-index: 10000; color: var(--text-primary);">
        <div style="padding: 10px 12px; border-bottom: 1px solid var(--border-color); font-size: 12px; font-weight: 700; display: flex; justify-content: space-between; align-items: center;"><span>Speaker Notes</span><button id="notes-close-btn" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 16px;">&times;</button></div>
        <pre id="speaker-notes-text" style="white-space: pre-wrap; margin: 0; padding: 12px; font-family: inherit; font-size: 13px; line-height: 1.45; color: var(--text-secondary);"></pre>
      </div>
      <div class="zoom-controls"><span id="zoom-percent" style="font-weight:700; min-width: 36px; text-align: center; font-size: 12px;">100%</span><button class="btn-fit" id="zoom-fit" style="margin-right: 5px;" title="Fit in view (Ctrl/⌘+0)">Fit</button><button class="btn-fit" id="reset-layout" style="background: #e91e63; box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);">Reset</button></div>
      <div id="notification-toast" class="notification-toast"><div class="notification-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span id="notification-text"></span></div>
      
      <!-- Exported Laser Pointer Elements -->
      <div id="laser-pointer-el" class="laser-pointer"></div>
      <svg id="laser-trail-svg" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 100000; overflow: visible; display: none;"></svg>

      <!-- Exported Custom Brush Cursor Element -->
      <div id="brush-cursor-el" class="brush-custom-cursor" style="display: none; left: -100px; top: -100px;">
        <div id="brush-cursor-circle" class="brush-custom-cursor-circle"></div>
      </div>
`;
}
