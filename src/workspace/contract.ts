import type * as Pixi from 'pixi.js';
import type { BrushStroke, CanvasElement, Connection, PortPosition, Variant } from '../types';
import type { Point, Viewport } from './CoordinateSystem';

export type PixiAPI = typeof Pixi;
export interface SceneData { elements: CanvasElement[]; connections: Connection[]; brushStrokes: BrushStroke[] }
export interface SceneOptions {
  editing: boolean;
  selectedIds: string[];
  selectedConnectionId: string | null;
  playedAnimationIds: string[];
  previewAnimationId?: string | null;
  presenting: boolean;
  brushMode: boolean;
  panMode: boolean;
  connectingId?: string | null;
  focalId?: string | null;
  theme: 'light' | 'dark';
  openFlowIds?: Set<string>;
  activatedEdges?: Set<string>;
}
export type SceneTarget = { kind: 'element'; id: string } | { kind: 'connection'; id: string } | { kind: 'port'; id: string; port: PortPosition } | { kind: 'resize'; id: string; handle: string } | { kind: 'rotate' | 'focal'; id: string } | { kind: 'flow'; id: string; port: PortPosition; targets: string[] };
export interface SceneEvent { target: SceneTarget; event: Pixi.FederatedPointerEvent }
export interface SceneCallbacks {
  pointerDown?: (event: SceneEvent) => void;
  pointerUp?: (event: SceneEvent) => void;
  click?: (event: SceneEvent) => void;
  doubleClick?: (event: SceneEvent) => void;
  viewport?: (viewport: Viewport) => void;
  frame?: () => void;
  textHeight?: (id: string, height: number) => void;
  error?: (message: string) => void;
}
export interface SceneOverlay {
  selection?: { x1: number; y1: number; x2: number; y2: number } | null;
  stroke?: { points: Point[]; color: string; width: number } | null;
  connecting?: { id: string; port: PortPosition; point: Point } | null;
  guides?: Variant['guides'];
  snap?: { x: number | null; y: number | null };
}
export const DEFAULT_SCENE_OPTIONS: SceneOptions = { editing: true, selectedIds: [], selectedConnectionId: null, playedAnimationIds: [], presenting: false, brushMode: false, panMode: false, theme: 'dark' };
export const PIXI_VERSION = '8.22.0';
export const DEFAULT_PIXI_URL = `https://cdn.jsdelivr.net/npm/pixi.js@${PIXI_VERSION}/dist/pixi.min.js`;
