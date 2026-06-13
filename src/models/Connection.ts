import { Connection, ConnectionArrowStyle, ConnectionStrokeStyle } from '../types';

export const DEFAULT_CONNECTION_STROKE: ConnectionStrokeStyle = {
  width: 2,
  color: '#6c6d80',
  style: 'solid',
  lineType: 'curve',
};

export const DEFAULT_CONNECTION_ARROW: ConnectionArrowStyle = {
  start: 'none',
  end: 'arrow',
  size: 6,
};

export const getConnectionStroke = (conn: Connection): ConnectionStrokeStyle => ({
  ...DEFAULT_CONNECTION_STROKE,
  color: conn.stroke?.color || conn.color || DEFAULT_CONNECTION_STROKE.color,
  width: conn.stroke?.width ?? DEFAULT_CONNECTION_STROKE.width,
  style: conn.stroke?.style || DEFAULT_CONNECTION_STROKE.style,
  lineType: conn.stroke?.lineType || DEFAULT_CONNECTION_STROKE.lineType,
});

export const getConnectionArrow = (conn: Connection): ConnectionArrowStyle => ({
  ...DEFAULT_CONNECTION_ARROW,
  start: conn.arrow?.start || conn.startArrow || 'none',
  end: conn.arrow?.end || conn.endArrow || 'none',
  size: conn.arrow?.size ?? DEFAULT_CONNECTION_ARROW.size,
});

export const getConnectionDasharray = (style: ConnectionStrokeStyle['style'], width: number): string | undefined => {
  if (style === 'dashed') return `${width * 4} ${width * 2}`;
  if (style === 'dotted') return `${width} ${width * 2}`;
  return undefined;
};
