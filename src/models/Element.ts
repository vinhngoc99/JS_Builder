// =============================================================================
// Element Factory — creates elements with proper OOP defaults
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  CanvasElement, ElementType, TextElement, ButtonElement,
  ImageElement, VideoElement, ShapeElement, NodeElement, IconElement,
  BaseElement,
} from '../types';
import {
  DEFAULT_FILL, DEFAULT_FILL_NODE, DEFAULT_FILL_BUTTON,
  DEFAULT_STROKE, DEFAULT_SHADOW, DEFAULT_TEXT_STYLE,
  DEFAULT_ACTION, DEFAULT_DIMENSIONS,
} from './defaults';

// ── Helper: create a base element with all OOP properties ──

function createBaseElement(
  type: ElementType,
  overrides: Partial<BaseElement> = {}
): BaseElement {
  const dims = DEFAULT_DIMENSIONS[type] || { width: 100, height: 100 };
  return {
    id: uuidv4(),
    type,
    name: '',

    x: 0,
    y: 0,
    width: dims.width,
    height: dims.height,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,

    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 0,

    fill: { ...DEFAULT_FILL },
    stroke: { ...DEFAULT_STROKE },
    shadow: { ...DEFAULT_SHADOW },

    text: null,

    parentId: null,
    groupId: null,

    interactive: false,
    pinned: false,
    disabled: false,
    isSlide: true,
    fillParent: false,

    animations: [],
    aspectRatioLocked: false,

    ...overrides,
  };
}

// ── Factory functions for each element type ──

export function createTextElement(overrides: Partial<TextElement> = {}): TextElement {
  const base = createBaseElement('text', overrides);
  return {
    ...base,
    type: 'text',
    text: {
      ...DEFAULT_TEXT_STYLE,
      content: 'Workflow Text',
      ...(overrides.text || {}),
    },
    stroke: {
      ...DEFAULT_STROKE,
      width: 1,
      color: 'var(--border-color)',
      radius: 4,
      ...(overrides.stroke || {}),
    },
    ...overrides,
  } as TextElement;
}

export function createButtonElement(overrides: Partial<ButtonElement> = {}): ButtonElement {
  const base = createBaseElement('button', overrides);
  return {
    ...base,
    type: 'button',
    action: { ...DEFAULT_ACTION, ...(overrides.action || {}) },
    fill: { ...DEFAULT_FILL_BUTTON, ...(overrides.fill || {}) },
    stroke: { ...DEFAULT_STROKE, radius: 6, ...(overrides.stroke || {}) },
    text: {
      ...DEFAULT_TEXT_STYLE,
      content: 'Action',
      fontWeight: 700,
      color: '#ffffff',
      ...(overrides.text || {}),
    },
    ...overrides,
  } as ButtonElement;
}

export function createImageElement(overrides: Partial<ImageElement> = {}): ImageElement {
  const base = createBaseElement('image', overrides);
  return {
    ...base,
    type: 'image',
    src: overrides.src || 'https://images.unsplash.com/photo-1531297172867-4f40136225a4?auto=format&fit=crop&w=300&q=80',
    alt: overrides.alt || 'Placeholder',
    objectFit: overrides.objectFit || 'cover',
    objectPosition: overrides.objectPosition || '50% 50%',
    stroke: { ...DEFAULT_STROKE, radius: 4, ...(overrides.stroke || {}) },
    ...overrides,
  } as ImageElement;
}

export function createVideoElement(overrides: Partial<VideoElement> = {}): VideoElement {
  const base = createBaseElement('video', overrides);
  return {
    ...base,
    type: 'video',
    src: overrides.src || '',
    stroke: { ...DEFAULT_STROKE, radius: 8, ...(overrides.stroke || {}) },
    ...overrides,
  } as VideoElement;
}

export function createShapeElement(overrides: Partial<ShapeElement> = {}): ShapeElement {
  const base = createBaseElement('shape', overrides);
  return {
    ...base,
    type: 'shape',
    shapeType: overrides.shapeType || 'rectangle',
    stroke: { ...DEFAULT_STROKE, width: 2, color: '#4caf50', radius: 8, ...(overrides.stroke || {}) },
    text: overrides.text || {
      ...DEFAULT_TEXT_STYLE,
      content: '',
      fontSize: 14,
      color: 'var(--text-primary)',
    },
    ...overrides,
  } as ShapeElement;
}

export function createNodeElement(overrides: Partial<NodeElement> = {}): NodeElement {
  const base = createBaseElement('node', overrides);
  return {
    ...base,
    type: 'node',
    fill: { ...DEFAULT_FILL_NODE, ...(overrides.fill || {}) },
    text: overrides.text || {
      ...DEFAULT_TEXT_STYLE,
      content: '',
    },
    ...overrides,
  } as NodeElement;
}

export function createIconElement(overrides: Partial<IconElement> = {}): IconElement {
  const base = createBaseElement('icon', overrides);
  return {
    ...base,
    type: 'icon',
    iconName: overrides.iconName || 'home',
    iconColor: overrides.iconColor || 'var(--text-primary)',
    ...overrides,
  } as IconElement;
}

// ── General factory ──

export function createElement(
  type: ElementType,
  overrides: Partial<CanvasElement> = {}
): CanvasElement {
  switch (type) {
    case 'text': return createTextElement(overrides as Partial<TextElement>);
    case 'button': return createButtonElement(overrides as Partial<ButtonElement>);
    case 'image': return createImageElement(overrides as Partial<ImageElement>);
    case 'video': return createVideoElement(overrides as Partial<VideoElement>);
    case 'shape': return createShapeElement(overrides as Partial<ShapeElement>);
    case 'node': return createNodeElement(overrides as Partial<NodeElement>);
    case 'icon': return createIconElement(overrides as Partial<IconElement>);
    default: return createTextElement(overrides as Partial<TextElement>);
  }
}
