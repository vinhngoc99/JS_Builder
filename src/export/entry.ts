import { ExportController, type ExportState } from './ExportController';
import type { PixiAPI } from '../workspace/contract';

async function start() {
  const host = document.getElementById('interactive-container');
  const json = document.getElementById('js-builder-state');
  if (!host || !json) return;
  try {
    const pixi = (window as Window & { PIXI?: PixiAPI }).PIXI;
    if (!pixi) throw new Error('PixiJS could not load. Check the CDN URL and network access.');
    const state = JSON.parse(json.textContent || '{}') as ExportState;
    const controller = new ExportController(pixi, host, state);
    await controller.init();
  } catch (error) {
    const message = document.createElement('div'); message.className = 'workspace-error'; message.setAttribute('role', 'alert'); message.textContent = error instanceof Error ? error.message : 'Workspace could not start'; host.appendChild(message);
  }
}
void start();
