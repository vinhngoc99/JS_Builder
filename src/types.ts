export type ElementType = 'text' | 'button' | 'image' | 'shape' | 'node' | 'video';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  rotation: number;
  parentId?: string | null;
  fillParent?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  enableExpandButton?: boolean;
  isPinned?: boolean;
}

export interface NodeElement extends BaseElement {
  type: 'node';
  backgroundColor: string;
  fontFamily: string;
  fontSize?: number;
  color?: string;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  backgroundColor: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  text: string;
  link: string;
  backgroundColor: string;
  color: string;
  borderRadius: number;
  actionType: 'link' | 'alert' | 'toggleVisibility' | 'toggleDisabled' | 'triggerFlow' | 'nextSlide' | 'prevSlide' | 'goToSlide';
  actionTarget: string;
  fontFamily: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt: string;
  objectFit: 'contain' | 'cover' | 'fill';
  objectPosition?: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  fontSize?: number;
}

export interface VideoElement extends BaseElement {
  type: 'video';
  src: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  fontSize?: number;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: 'rectangle' | 'ellipse' | 'triangle' | 'rightTriangle' | 'diamond' | 'pentagon' | 'hexagon' | 'star' | 'parallelogram' | 'trapezoid' | 'arrowRight' | 'arrowLeft' | 'arrowUp' | 'arrowDown' | 'line' | 'arrow' | 'elbow';
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  fontSize?: number;
  text?: string;
  color?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export type CanvasElement = TextElement | ButtonElement | ImageElement | ShapeElement | NodeElement | VideoElement;

export type PortPosition = 'top' | 'right' | 'bottom' | 'left';

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  fromPort: PortPosition;
  toPort: PortPosition;
  label?: string;
  labelAlignment?: 'horizontal' | 'follow';
  startArrow?: 'none' | 'arrow';
  endArrow?: 'none' | 'arrow';
}

export interface BrushStroke {
  id: string;
  points: { x: number, y: number }[];
  color: string;
  width: number;
}
