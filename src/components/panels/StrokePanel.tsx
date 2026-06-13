import React from 'react';
import { CanvasElement, StrokeStyle } from '../../types';
import { CustomColorPicker } from '../CustomColorPicker';

interface StrokePanelProps {
  element: CanvasElement;
  onChange: (updates: { stroke: StrokeStyle }) => void;
}

export const StrokePanel: React.FC<StrokePanelProps> = ({ element, onChange }) => {
  const stroke = element.stroke || {
    width: 0,
    color: 'transparent',
    style: 'solid',
    radius: 0,
    cap: 'round',
    join: 'round',
  };

  const handlePropertyChange = (key: keyof StrokeStyle, value: any) => {
    onChange({
      stroke: {
        ...stroke,
        [key]: value,
      },
    });
  };

  const isLineType = ['line', 'arrow', 'elbow'].includes((element as any).shapeType || '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <CustomColorPicker
        label="Color"
        name="strokeColor"
        value={stroke.color}
        onChange={(e) => handlePropertyChange('color', e.target.value)}
        onTransparent={() => handlePropertyChange('color', 'transparent')}
      />

      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: '#8c8d9c', marginBottom: '4px', fontWeight: 600 }}>Width</div>
          <input
            type="number"
            value={stroke.width}
            onChange={(e) => handlePropertyChange('width', Math.max(0, parseInt(e.target.value) || 0))}
            style={{ width: '100%' }}
            min={0}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: '#8c8d9c', marginBottom: '4px', fontWeight: 600 }}>Style</div>
          <select
            value={stroke.style}
            onChange={(e) => handlePropertyChange('style', e.target.value as any)}
            style={{ width: '100%', padding: '4px' }}
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
      </div>

      {!isLineType && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
          <div style={{ fontSize: '11px', color: '#8c8d9c', width: '70px', fontWeight: 600 }}>Corner Radius</div>
          <input
            type="number"
            value={stroke.radius}
            onChange={(e) => handlePropertyChange('radius', Math.max(0, parseInt(e.target.value) || 0))}
            style={{ flex: 1 }}
            min={0}
          />
        </div>
      )}
    </div>
  );
};
