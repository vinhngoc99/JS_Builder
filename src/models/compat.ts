// =============================================================================
// Compatibility Layer — exposes old-style property names from new OOP model
// =============================================================================
// This allows the existing rendering code (ElementWrapper, Canvas, exportHTML)
// to continue working while we progressively migrate to the new OOP accessors.

import type { CanvasElement, ButtonElement, ImageElement, IconElement, ShapeElement } from '../types';

/**
 * Create a compatibility proxy that exposes old flat property names
 * from the new structured OOP element model.
 *
 * Legacy code can still do `el.backgroundColor`, `el.borderWidth`, etc.
 * and it will read from `el.fill.color`, `el.stroke.width`, etc.
 *
 * This is used at the rendering boundary to bridge old and new code.
 */
export function compat(el: CanvasElement): CanvasElement & Record<string, any> {
  return new Proxy(el, {
    get(target: CanvasElement, prop: string | symbol) {
      if (typeof prop !== 'string') return (target as any)[prop];

      if (prop === 'text') {
        const text = (target as any).text;
        if (text === null || text === undefined) return '';
        if (typeof text === 'string') return text;
        return text.content || '';
      }
      
      // Direct properties first (new model)
      if (prop in target) return (target as any)[prop];
      
      // --- Legacy property mappings ---
      
      // Fill → backgroundColor
      if (prop === 'backgroundColor') {
        return target.fill?.type === 'none' ? 'transparent' : (target.fill?.color || 'transparent');
      }
      
      // Stroke → border properties
      if (prop === 'borderWidth') return target.stroke?.width ?? 0;
      if (prop === 'borderColor') return target.stroke?.color || 'transparent';
      if (prop === 'borderRadius') return target.stroke?.radius ?? 0;
      
      // Text spacing properties
      if (prop === 'lineHeight') return target.text?.lineHeight ?? 1.5;
      if (prop === 'letterSpacing') return target.text?.letterSpacing ?? 0;
      
      // Text properties
      if (prop === 'text' && target.text !== null && typeof target.text === 'object') {
        // Already handled by direct access — 'text' is now a TextStyle object
        return target.text;
      }
      
      // For elements that had text as a string, map to text.content
      if (prop === 'color') return target.text?.color || 'var(--text-primary)';
      if (prop === 'fontSize') return target.text?.fontSize || 16;
      if (prop === 'fontFamily') return target.text?.fontFamily || "'Google Sans Text'";
      if (prop === 'textAlign') return target.text?.align || 'center';
      
      // Visibility flags (inverted naming)
      if (prop === 'isHidden') return !target.visible;
      if (prop === 'isLocked') return target.locked;
      if (prop === 'isDisabled') return target.disabled;
      if (prop === 'isPinned') return target.pinned;
      if (prop === 'enableExpandButton') return target.interactive;
      
      // Node title
      if (prop === 'title') return target.name || '';
      
      // Button action properties
      if (prop === 'actionType' && target.type === 'button') {
        return (target as ButtonElement).action?.type || 'alert';
      }
      if (prop === 'actionTarget' && target.type === 'button') {
        return (target as ButtonElement).action?.target || '';
      }
      if (prop === 'link' && target.type === 'button') {
        return (target as ButtonElement).action?.link || '#';
      }
      
      // Image properties
      if (prop === 'src' && (target.type === 'image' || target.type === 'video')) {
        return (target as ImageElement).src || '';
      }
      if (prop === 'alt' && target.type === 'image') {
        return (target as ImageElement).alt || '';
      }
      if (prop === 'objectFit' && target.type === 'image') {
        return (target as ImageElement).objectFit || 'cover';
      }
      if (prop === 'objectPosition' && target.type === 'image') {
        return (target as ImageElement).objectPosition || '50% 50%';
      }
      
      // Shape properties
      if (prop === 'shapeType' && target.type === 'shape') {
        return (target as ShapeElement).shapeType || 'rectangle';
      }
      
      // Icon properties
      if (prop === 'iconName' && target.type === 'icon') {
        return (target as IconElement).iconName || 'home';
      }
      
      return undefined;
    },
    
    set(target: CanvasElement, prop: string | symbol, value: any) {
      if (typeof prop !== 'string') {
        (target as any)[prop] = value;
        return true;
      }
      
      // Direct properties first
      if (prop in target) {
        (target as any)[prop] = value;
        return true;
      }
      
      // Legacy → new mappings for writes
      if (prop === 'backgroundColor') {
        target.fill = { ...target.fill, type: value === 'transparent' ? 'none' : 'solid', color: value };
        return true;
      }
      if (prop === 'borderWidth') { target.stroke = { ...target.stroke, width: value }; return true; }
      if (prop === 'borderColor') { target.stroke = { ...target.stroke, color: value }; return true; }
      if (prop === 'borderRadius') { target.stroke = { ...target.stroke, radius: value }; return true; }
      
      if (prop === 'lineHeight' && target.text) { target.text = { ...target.text, lineHeight: value }; return true; }
      if (prop === 'letterSpacing' && target.text) { target.text = { ...target.text, letterSpacing: value }; return true; }
      if (prop === 'color' && target.text) { target.text = { ...target.text, color: value }; return true; }
      if (prop === 'fontSize' && target.text) { target.text = { ...target.text, fontSize: value }; return true; }
      if (prop === 'fontFamily' && target.text) { target.text = { ...target.text, fontFamily: value }; return true; }
      if (prop === 'textAlign' && target.text) { target.text = { ...target.text, align: value }; return true; }
      if (prop === 'isHidden') { target.visible = !value; return true; }
      if (prop === 'isLocked') { target.locked = value; return true; }
      if (prop === 'isDisabled') { target.disabled = value; return true; }
      if (prop === 'isPinned') { target.pinned = value; return true; }
      if (prop === 'enableExpandButton') { target.interactive = value; return true; }
      if (prop === 'title') { target.name = value; return true; }
      
      // Fallback: set directly
      (target as any)[prop] = value;
      return true;
    }
  }) as CanvasElement & Record<string, any>;
}
