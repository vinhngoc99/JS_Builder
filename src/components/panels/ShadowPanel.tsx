import React from 'react';
import { CanvasElement, ShadowStyle } from '../../types';
import { CustomColorPicker } from '../CustomColorPicker';
import { DEFAULT_SHADOW } from '../../models/defaults';

interface ShadowPanelProps {
  element: CanvasElement;
  onChange: (updates: { shadow: ShadowStyle }) => void;
}

export const ShadowPanel: React.FC<ShadowPanelProps> = ({ element, onChange }) => {
  const shadow = element.shadow || DEFAULT_SHADOW;

  const handlePropertyChange = (key: keyof ShadowStyle, value: any) => {
    onChange({
      shadow: {
        ...shadow,
        [key]: value,
      },
    });
  };

  const Toggle = ({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: (v: boolean) => void }) => (
    <div 
      onClick={() => onToggle(!checked)} 
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', cursor: 'pointer', marginBottom: '8px' }}
    >
      <span style={{ fontSize: '12px', color: checked ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: checked ? 600 : 400 }}>
        {label}
      </span>
      <div style={{ width: '32px', height: '18px', borderRadius: '9px', position: 'relative', backgroundColor: checked ? '#e91e63' : 'rgba(128,128,128,0.25)', transition: 'background-color 0.2s' }}>
        <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '2px', left: checked ? '16px' : '2px', transition: 'left 0.2s' }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Toggle
        label="Enable Drop Shadow"
        checked={shadow.enabled}
        onToggle={(v) => handlePropertyChange('enabled', v)}
      />

      {shadow.enabled && (
        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <CustomColorPicker
            label="Color"
            name="shadowColor"
            value={shadow.color}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
            onTransparent={() => handlePropertyChange('color', 'transparent')}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#8c8d9c', marginBottom: '2px' }}>Offset X</div>
              <input
                type="number"
                value={shadow.offsetX}
                onChange={(e) => handlePropertyChange('offsetX', parseInt(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#8c8d9c', marginBottom: '2px' }}>Offset Y</div>
              <input
                type="number"
                value={shadow.offsetY}
                onChange={(e) => handlePropertyChange('offsetY', parseInt(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#8c8d9c', marginBottom: '2px' }}>Blur</div>
              <input
                type="number"
                value={shadow.blur}
                onChange={(e) => handlePropertyChange('blur', Math.max(0, parseInt(e.target.value) || 0))}
                style={{ width: '100%' }}
                min={0}
              />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#8c8d9c', marginBottom: '2px' }}>Spread</div>
              <input
                type="number"
                value={shadow.spread}
                onChange={(e) => handlePropertyChange('spread', parseInt(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
