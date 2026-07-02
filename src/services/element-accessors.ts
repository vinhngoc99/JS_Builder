// =============================================================================
// element-accessors — pure "bridge" helpers that read the OOP element model
// and adapt it for legacy rendering. Extracted verbatim from BuilderContext.
//
// These are re-exported from BuilderContext to preserve existing import paths
// (e.g. ElementWrapper imports getAdapted* from '../BuilderContext').
// =============================================================================

import { CanvasElement, ButtonElement } from '../types';

export const getAdaptedTextColor = (color: string | undefined): string => {
  if (!color || color === '#e0e0e0' || color === 'var(--text-primary)') {
    return 'var(--text-primary)';
  }
  return color;
};

export const getAdaptedBorderColor = (color: string | undefined): string => {
  if (!color || color === '#3a3c50' || color === 'var(--border-color)') {
    return 'var(--border-color)';
  }
  return color;
};

export const getAdaptedBgColor = (type: string, color: string | undefined): string => {
  if (type === 'node' && (!color || color === '#242533' || color === 'var(--bg-node)')) {
    return 'var(--bg-node)';
  }
  return color || 'transparent';
};

// --- OOP Helpers: Bridge new model to legacy rendering ---

/** Get the fill color from an element's fill style */
export const getElementFillColor = (el: CanvasElement): string => {
  if (el.fill.type === 'none') return 'transparent';
  return el.fill.color || 'transparent';
};

/** Get the border/stroke CSS values */
export const getElementStroke = (el: CanvasElement) => ({
  width: el.stroke.width,
  color: el.stroke.color,
  radius: el.stroke.radius,
  style: el.stroke.style,
});

/** Get text content from element */
export const getElementText = (el: CanvasElement): string => {
  return el.text?.content || '';
};

/** Get text color */
export const getElementTextColor = (el: CanvasElement): string => {
  return getAdaptedTextColor(el.text?.color);
};

/** Get font family */
export const getElementFontFamily = (el: CanvasElement): string => {
  return el.text?.fontFamily || "'Google Sans Text'";
};

/** Get font size */
export const getElementFontSize = (el: CanvasElement): number => {
  return el.text?.fontSize || 16;
};

/** Get text alignment */
export const getElementTextAlign = (el: CanvasElement): string => {
  return el.text?.align || 'center';
};

/** Get element name / title for display */
export const getElementName = (el: CanvasElement): string => {
  return el.name || '';
};

/** Get the shadow CSS */
export const getElementShadowCSS = (el: CanvasElement): string => {
  if (!el.shadow.enabled) return 'none';
  const s = el.shadow;
  return `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`;
};

/** Get button action */
export const getElementAction = (el: CanvasElement): { type: string; target: string; link: string } => {
  if (el.type === 'button') {
    return (el as ButtonElement).action;
  }
  return { type: 'none', target: '', link: '#' };
};
