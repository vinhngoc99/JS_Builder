// =============================================================================
// Default values for all element properties — matches Google Slides defaults
// =============================================================================

import type { FillStyle, StrokeStyle, ShadowStyle, TextStyle, ElementAction } from '../types';

// ── Default Styles ──

export const DEFAULT_FILL: FillStyle = {
  type: 'none',
  color: 'transparent',
};

export const DEFAULT_FILL_NODE: FillStyle = {
  type: 'solid',
  color: 'var(--bg-node)',
};

export const DEFAULT_FILL_BUTTON: FillStyle = {
  type: 'solid',
  color: '#4caf50',
};

export const DEFAULT_STROKE: StrokeStyle = {
  width: 0,
  color: 'var(--border-color)',
  style: 'solid',
  radius: 0,
  cap: 'round',
  join: 'round',
};

export const DEFAULT_SHADOW: ShadowStyle = {
  enabled: true,
  color: 'rgba(0,0,0,0.3)',
  blur: 8,
  offsetX: 0,
  offsetY: 4,
  spread: 0,
};

export const DEFAULT_TEXT_STYLE: TextStyle = {
  content: '',
  fontFamily: "'Google Sans Text'",
  fontSize: 16,
  fontWeight: 400,
  fontStyle: 'normal',
  textDecoration: 'none',
  color: 'var(--text-primary)',
  align: 'center',
  verticalAlign: 'middle',
  lineHeight: 1.5,
  letterSpacing: 0,
  padding: { top: 10, right: 14, bottom: 10, left: 14 },
};

export const DEFAULT_ACTION: ElementAction = {
  type: 'alert',
  target: 'Button clicked!',
  link: '#',
};

// ── Element Dimensions ──

export const DEFAULT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  node: { width: 220, height: 250 },
  text: { width: 150, height: 60 },
  button: { width: 120, height: 40 },
  image: { width: 150, height: 150 },
  video: { width: 280, height: 157 },
  shape: { width: 100, height: 100 },
  icon: { width: 60, height: 60 },
};
