import type {
  CanvasElement,
  Connection,
  ElementAction,
  FillStyle,
  ShadowStyle,
  StrokeStyle,
  TextStyle,
} from '../types';
import { DEFAULT_FILL, DEFAULT_STROKE, DEFAULT_SHADOW, DEFAULT_TEXT_STYLE } from './defaults';
import { DEFAULT_CONNECTION_ARROW, DEFAULT_CONNECTION_STROKE } from './Connection';

function isNewFormat(el: any): boolean {
  return !!el && !!el.fill && typeof el.fill === 'object' && 'type' in el.fill;
}

function hasOwn(obj: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function normalizeName(source: any, fallback: string): string {
  if (hasOwn(source, 'name')) return source.name ?? '';
  if (hasOwn(source, 'title')) return source.title ?? '';
  return fallback;
}

function normalizeFill(fill: any, fallback: FillStyle): FillStyle {
  if (!fill || typeof fill !== 'object') return { ...fallback };
  return {
    ...fallback,
    ...fill,
    type: fill.type || fallback.type,
    color: fill.color ?? fallback.color,
  };
}

function normalizeStroke(stroke: any, legacy: any = {}): StrokeStyle {
  return {
    ...DEFAULT_STROKE,
    ...(stroke && typeof stroke === 'object' ? stroke : {}),
    width: stroke?.width ?? legacy.borderWidth ?? DEFAULT_STROKE.width,
    color: stroke?.color ?? legacy.borderColor ?? DEFAULT_STROKE.color,
    radius: stroke?.radius ?? legacy.borderRadius ?? DEFAULT_STROKE.radius,
  };
}

function normalizeShadow(shadow: any): ShadowStyle {
  return {
    ...DEFAULT_SHADOW,
    ...(shadow && typeof shadow === 'object' ? shadow : {}),
  };
}

function normalizeText(text: any, fallbackContent = ''): TextStyle | null {
  if (text === null || text === false) return null;
  if (typeof text === 'string') {
    return { ...DEFAULT_TEXT_STYLE, content: text || fallbackContent };
  }
  if (text && typeof text === 'object') {
    return {
      ...DEFAULT_TEXT_STYLE,
      ...text,
      content: text.content ?? fallbackContent,
      padding: {
        ...DEFAULT_TEXT_STYLE.padding,
        ...(text.padding || {}),
      },
    };
  }
  return fallbackContent ? { ...DEFAULT_TEXT_STYLE, content: fallbackContent } : null;
}

function normalizeAction(action: any, legacy: any = {}): ElementAction {
  return {
    type: action?.type || legacy.actionType || 'alert',
    target: action?.target ?? legacy.actionTarget ?? '',
    link: action?.link ?? legacy.link ?? '#',
  };
}

function buildLegacyFill(old: any): FillStyle {
  if (old.type === 'node') {
    return { type: 'solid', color: old.backgroundColor || 'var(--bg-node)' };
  }
  if (old.type === 'button') {
    return { type: 'solid', color: old.backgroundColor || '#4caf50' };
  }
  if (old.backgroundColor && old.backgroundColor !== 'transparent') {
    return { type: 'solid', color: old.backgroundColor };
  }
  return { ...DEFAULT_FILL };
}

function buildLegacyText(old: any): TextStyle | null {
  if (old.type === 'text') {
    return {
      ...DEFAULT_TEXT_STYLE,
      content: old.text || '',
      fontFamily: old.fontFamily || "'Google Sans Text'",
      fontSize: old.fontSize || 16,
      color: old.color || 'var(--text-primary)',
      align: old.textAlign || 'center',
    };
  }
  if (old.type === 'button') {
    return {
      ...DEFAULT_TEXT_STYLE,
      content: old.text || 'Action',
      fontFamily: old.fontFamily || "'Google Sans Text'",
      fontSize: old.fontSize || 16,
      fontWeight: 700,
      color: old.color || '#ffffff',
      align: old.textAlign || 'center',
    };
  }
  if (old.type === 'shape') {
    return {
      ...DEFAULT_TEXT_STYLE,
      content: old.text || '',
      fontFamily: old.fontFamily || "'Google Sans Text'",
      fontSize: old.fontSize || 14,
      color: old.color || 'var(--text-primary)',
      align: old.textAlign || 'center',
    };
  }
  if (old.type === 'node') {
    return {
      ...DEFAULT_TEXT_STYLE,
      content: '',
      fontFamily: old.fontFamily || "'Google Sans Text'",
      fontSize: old.fontSize || 14,
      color: old.color || 'var(--text-primary)',
    };
  }
  return null;
}

function normalizeNewElement(el: any): CanvasElement {
  const normalized: any = {
    ...el,
    id: el.id,
    type: el.type,
    name: normalizeName(el, `${el.type || 'Element'} ${el.id?.substring?.(0, 6) || ''}`),
    x: el.x ?? 0,
    y: el.y ?? 0,
    width: el.width ?? 100,
    height: el.height ?? 100,
    rotation: el.rotation ?? 0,
    scaleX: el.scaleX ?? 1,
    scaleY: el.scaleY ?? 1,
    opacity: el.opacity ?? 1,
    visible: el.visible ?? (el.isHidden !== true),
    locked: el.locked ?? (el.isLocked === true),
    zIndex: el.zIndex ?? 0,
    fill: normalizeFill(el.fill, DEFAULT_FILL),
    stroke: normalizeStroke(el.stroke, el),
    shadow: normalizeShadow(el.shadow),
    text: normalizeText(el.text),
    parentId: el.parentId ?? null,
    groupId: el.groupId ?? null,
    interactive: el.interactive ?? (el.enableExpandButton === true),
    pinned: el.pinned ?? (el.isPinned === true),
    disabled: el.disabled ?? (el.isDisabled === true),
    isSlide: el.isSlide !== false,
    fillParent: el.fillParent === true,
    animations: Array.isArray(el.animations) ? el.animations : [],
    aspectRatioLocked: el.aspectRatioLocked === true,
  };

  if (normalized.type === 'button') {
    normalized.action = normalizeAction(el.action, el);
    normalized.text = normalizeText(el.text, 'Action');
  }
  if (normalized.type === 'image') {
    normalized.src = el.src || '';
    normalized.alt = el.alt || '';
    normalized.objectFit = el.objectFit || 'cover';
    normalized.objectPosition = el.objectPosition || '50% 50%';
  }
  if (normalized.type === 'video') {
    normalized.src = el.src || '';
  }
  if (normalized.type === 'shape') {
    normalized.shapeType = el.shapeType || 'rectangle';
    normalized.text = normalizeText(el.text, '');
  }
  if (normalized.type === 'node') {
    normalized.text = normalizeText(el.text, '');
  }
  if (normalized.type === 'icon') {
    normalized.iconName = el.iconName || 'home';
    normalized.iconColor = el.iconColor || el.color || 'var(--text-primary)';
  }

  return normalized as CanvasElement;
}

export function migrateElement(old: any): CanvasElement {
  if (isNewFormat(old)) return normalizeNewElement(old);

  const base: any = {
    id: old.id,
    type: old.type,
    name: normalizeName(old, `${old.type || 'Element'} ${old.id?.substring?.(0, 6) || ''}`),
    x: old.x ?? 0,
    y: old.y ?? 0,
    width: old.width ?? 100,
    height: old.height ?? 100,
    rotation: old.rotation ?? 0,
    scaleX: old.scaleX ?? 1,
    scaleY: old.scaleY ?? 1,
    opacity: old.opacity ?? 1,
    visible: old.visible ?? (old.isHidden !== true),
    locked: old.locked ?? (old.isLocked === true),
    zIndex: old.zIndex ?? 0,
    fill: buildLegacyFill(old),
    stroke: normalizeStroke(old.stroke, old),
    shadow: normalizeShadow(old.shadow),
    text: buildLegacyText(old),
    parentId: old.parentId ?? null,
    groupId: old.groupId ?? null,
    interactive: old.interactive ?? (old.enableExpandButton === true),
    pinned: old.pinned ?? (old.isPinned === true),
    disabled: old.disabled ?? (old.isDisabled === true),
    isSlide: old.isSlide !== false,
    fillParent: old.fillParent === true,
    animations: Array.isArray(old.animations) ? old.animations : [],
    aspectRatioLocked: old.aspectRatioLocked === true,
  };

  switch (old.type) {
    case 'button':
      return { ...base, type: 'button', action: normalizeAction(old.action, old) } as any;
    case 'image':
      return {
        ...base,
        type: 'image',
        src: old.src || '',
        alt: old.alt || '',
        objectFit: old.objectFit || 'cover',
        objectPosition: old.objectPosition || '50% 50%',
      } as any;
    case 'video':
      return { ...base, type: 'video', src: old.src || '' } as any;
    case 'shape':
      return { ...base, type: 'shape', shapeType: old.shapeType || 'rectangle' } as any;
    case 'node':
      return { ...base, type: 'node' } as any;
    case 'icon':
      return {
        ...base,
        type: 'icon',
        iconName: old.iconName || 'home',
        iconColor: old.iconColor || old.color || 'var(--text-primary)',
      } as any;
    case 'text':
    default:
      return { ...base, type: 'text' } as any;
  }
}

export function migrateElements(elements: any[] = []): CanvasElement[] {
  return (elements || []).filter(Boolean).map(migrateElement);
}

export function migrateConnections(connections: any[] = []): Connection[] {
  return (connections || []).filter(Boolean).map(conn => ({
    ...conn,
    stroke: conn.stroke ? { ...DEFAULT_CONNECTION_STROKE, ...conn.stroke } : conn.stroke,
    arrow: conn.arrow ? { ...DEFAULT_CONNECTION_ARROW, ...conn.arrow } : conn.arrow,
  }));
}

export function migrateVariants(variants: any[] = []): any[] {
  return (variants || []).filter(Boolean).map(v => ({
    id: v.id || 'default',
    name: v.name || 'Variant',
    ...v,
    elements: migrateElements(v.elements || []),
    connections: migrateConnections(v.connections || []),
    brushStrokes: v.brushStrokes || [],
    guides: v.guides || [],
  }));
}
