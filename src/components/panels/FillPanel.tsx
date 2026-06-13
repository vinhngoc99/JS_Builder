import React from 'react';
import { CanvasElement, FillStyle } from '../../types';
import { CustomColorPicker } from '../CustomColorPicker';

interface FillPanelProps {
  element: CanvasElement;
  onChange: (updates: { fill: FillStyle }) => void;
}

export const FillPanel: React.FC<FillPanelProps> = ({ element, onChange }) => {
  const fill = element.fill || { type: 'none', color: 'transparent' };

  const handleTypeChange = (type: 'none' | 'solid' | 'gradient') => {
    if (type === 'none') {
      onChange({ fill: { type: 'none', color: 'transparent' } });
    } else if (type === 'solid') {
      onChange({
        fill: {
          type: 'solid',
          color: fill.color === 'transparent' ? '#4caf50' : fill.color,
        },
      });
    } else {
      onChange({
        fill: {
          type: 'gradient',
          color: fill.color || '#4caf50',
          gradient: {
            type: 'linear',
            angle: 90,
            stops: [
              { offset: 0, color: fill.color || '#4caf50' },
              { offset: 1, color: '#ffffff' },
            ],
          },
        },
      });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      fill: {
        ...fill,
        color: e.target.value,
      },
    });
  };

  const handleTransparent = () => {
    onChange({ fill: { type: 'none', color: 'transparent' } });
  };

  const handleGradientStopChange = (index: number, color: string) => {
    if (!fill.gradient) return;
    const newStops = [...fill.gradient.stops];
    newStops[index] = { ...newStops[index], color };
    onChange({
      fill: {
        ...fill,
        gradient: {
          ...fill.gradient,
          stops: newStops,
        },
      },
    });
  };

  const handleGradientTypeChange = (type: 'linear' | 'radial') => {
    if (!fill.gradient) return;
    onChange({
      fill: {
        ...fill,
        gradient: {
          ...fill.gradient,
          type,
        },
      },
    });
  };

  const handleGradientAngleChange = (angle: number) => {
    if (!fill.gradient) return;
    onChange({
      fill: {
        ...fill,
        gradient: {
          ...fill.gradient,
          angle,
        },
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => handleTypeChange('none')}
          className={`btn ${fill.type === 'none' ? 'primary' : ''}`}
          style={{ flex: 1, fontSize: '11px', padding: '6px' }}
        >
          None
        </button>
        <button
          onClick={() => handleTypeChange('solid')}
          className={`btn ${fill.type === 'solid' ? 'primary' : ''}`}
          style={{ flex: 1, fontSize: '11px', padding: '6px' }}
        >
          Solid
        </button>
        <button
          onClick={() => handleTypeChange('gradient')}
          className={`btn ${fill.type === 'gradient' ? 'primary' : ''}`}
          style={{ flex: 1, fontSize: '11px', padding: '6px' }}
        >
          Gradient
        </button>
      </div>

      {fill.type === 'solid' && (
        <CustomColorPicker
          label="Color"
          name="color"
          value={fill.color}
          onChange={handleColorChange}
          onTransparent={handleTransparent}
        />
      )}

      {fill.type === 'gradient' && fill.gradient && (
        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: '#8c8d9c', width: '45px' }}>Type</div>
            <select
              value={fill.gradient.type}
              onChange={(e) => handleGradientTypeChange(e.target.value as 'linear' | 'radial')}
              style={{ flex: 1, padding: '4px' }}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>

          {fill.gradient.type === 'linear' && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#8c8d9c', width: '45px' }}>Angle</div>
              <input
                type="number"
                value={fill.gradient.angle}
                onChange={(e) => handleGradientAngleChange(parseInt(e.target.value) || 0)}
                style={{ flex: 1, padding: '4px' }}
                min={0}
                max={360}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>°</span>
            </div>
          )}

          <div style={{ marginTop: '4px' }}>
            <div style={{ fontSize: '10px', color: '#8c8d9c', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Gradient Stops</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {fill.gradient.stops.map((stop, index) => (
                <CustomColorPicker
                  key={index}
                  label={`Stop ${index + 1}`}
                  name={`stop-${index}`}
                  value={stop.color}
                  onChange={(e) => handleGradientStopChange(index, e.target.value)}
                  onTransparent={() => handleGradientStopChange(index, 'transparent')}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
