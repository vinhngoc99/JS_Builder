// =============================================================================
// JS Builder — OOP Element Type System (Google Slides / Miro-inspired)
// =============================================================================

export type ElementType = 'text' | 'button' | 'image' | 'shape' | 'node' | 'video' | 'icon';

// ---------------------------------------------------------------------------
// Sub-style interfaces — composable properties matching Google Slides panels
// ---------------------------------------------------------------------------

/** Gradient color stop */
export interface GradientStop {
  offset: number;   // 0-1
  color: string;
}

/** Fill style — Google Slides "Fill" panel */
export interface FillStyle {
  type: 'none' | 'solid' | 'gradient';
  color: string;
  gradient?: {
    type: 'linear' | 'radial';
    angle: number;
    stops: GradientStop[];
  };
}

/** Stroke/border style — Google Slides "Border" panel */
export interface StrokeStyle {
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
  radius: number;
  cap: 'butt' | 'round' | 'square';
  join: 'miter' | 'round' | 'bevel';
}

/** Shadow style — Google Slides "Shadow" panel */
export interface ShadowStyle {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  spread: number;
}

/** Text style — unified text formatting across all element types */
export interface TextStyle {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  color: string;
  align: 'left' | 'center' | 'right' | 'justify';
  verticalAlign: 'top' | 'middle' | 'bottom';
  lineHeight: number;
  letterSpacing: number;
  padding: { top: number; right: number; bottom: number; left: number };
}

/** Element animation definition — Google Slides-style */
export interface ElementAnimation {
  id: string;
  trigger: 'onClick' | 'withPrevious' | 'afterPrevious' | 'onEnter';
  type: 'entrance' | 'exit' | 'emphasis';
  effect: string;       // e.g., 'fadeIn', 'slideInLeft', 'bounce', 'pulse'
  duration: number;     // ms
  delay: number;        // ms
  easing: string;       // CSS easing function
  order: number;        // sequence order
}

/** Action definition for interactive elements */
export interface ElementAction {
  type: 'link' | 'alert' | 'toggleVisibility' | 'toggleDisabled' | 'triggerFlow' | 'nextSlide' | 'prevSlide' | 'goToSlide' | 'none';
  target: string;       // URL, element ID, message, etc.
  link: string;         // URL for link action
}

// ---------------------------------------------------------------------------
// Shape types
// ---------------------------------------------------------------------------

export type ShapeType =
  | 'rectangle' | 'ellipse' | 'triangle' | 'rightTriangle'
  | 'diamond' | 'pentagon' | 'hexagon' | 'star'
  | 'parallelogram' | 'trapezoid'
  | 'arrowRight' | 'arrowLeft' | 'arrowUp' | 'arrowDown'
  | 'line' | 'arrow' | 'elbow';

// ---------------------------------------------------------------------------
// BaseElement — all element types inherit from this (OOP base class)
// ---------------------------------------------------------------------------

export interface BaseElement {
  // ── Identity ──
  id: string;
  type: ElementType;
  name: string;

  // ── Transform ──
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;

  // ── Appearance ──
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;

  // ── Styles (Google Slides panels) ──
  fill: FillStyle;
  stroke: StrokeStyle;
  shadow: ShadowStyle;

  // ── Text ──
  text: TextStyle | null;

  // ── Hierarchy ──
  parentId: string | null;
  groupId: string | null;

  // ── Interaction ──
  interactive: boolean;
  pinned: boolean;
  disabled: boolean;
  isSlide: boolean;
  fillParent: boolean;

  // ── Animations ──
  animations: ElementAnimation[];

  // ── Constraints ──
  aspectRatioLocked: boolean;
}

// ---------------------------------------------------------------------------
// Element type extensions (lean — most properties are in BaseElement)
// ---------------------------------------------------------------------------

export interface TextElement extends BaseElement {
  type: 'text';
  // text content & styling is in base.text
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  action: ElementAction;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt: string;
  objectFit: 'contain' | 'cover' | 'fill';
  objectPosition: string;
}

export interface VideoElement extends BaseElement {
  type: 'video';
  src: string;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
}

export interface NodeElement extends BaseElement {
  type: 'node';
}

export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string;
  iconColor: string;
}

// ---------------------------------------------------------------------------
// Union type for any canvas element
// ---------------------------------------------------------------------------

export type CanvasElement =
  | TextElement
  | ButtonElement
  | ImageElement
  | VideoElement
  | ShapeElement
  | NodeElement
  | IconElement;

// ---------------------------------------------------------------------------
// Other domain types (unchanged)
// ---------------------------------------------------------------------------

export type PortPosition = 'top' | 'right' | 'bottom' | 'left';

export type ConnectionLineType = 'curve' | 'straight' | 'elbow';
export type ConnectionArrowType = 'none' | 'arrow' | 'triangle' | 'circle' | 'diamond';

export interface ConnectionStrokeStyle {
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
  lineType: ConnectionLineType;
}

export interface ConnectionArrowStyle {
  start: ConnectionArrowType;
  end: ConnectionArrowType;
  size: number;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  fromPort: PortPosition;
  toPort: PortPosition;
  stroke?: ConnectionStrokeStyle;
  arrow?: ConnectionArrowStyle;
  label?: string;
  labelAlignment?: 'horizontal' | 'follow';
  startArrow?: 'none' | 'arrow';
  endArrow?: 'none' | 'arrow';
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  reverseLabelDirection?: boolean;
  interactiveBtnText?: 'YES' | 'NO';
}

export interface BrushStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  attachedNodeId?: string | null;
}

export interface Variant {
  id: string;
  name: string;
  elements: CanvasElement[];
  connections: Connection[];
  brushStrokes: BrushStroke[];
  guides: { id: string; type: 'horizontal' | 'vertical'; position: number }[];
}
