import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { useBuilder } from '../BuilderContext';

interface CustomColorPickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTransparent: () => void;
}

export const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ label, name, value, onChange, onTransparent }) => {
  const { saveHistory } = useBuilder();
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value);
  const popoverRef = useRef<HTMLDivElement>(null);
  const originalColorRef = useRef(value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setTempColor(value);
  }, [value]);

  const handleOpen = () => {
    saveHistory();
    originalColorRef.current = value;
    setIsOpen(true);
  };

  const handleColorChange = (color: ColorResult) => {
    const hexColor = color.hex + (color.rgb.a !== undefined && color.rgb.a !== 1 ? (Math.round(color.rgb.a * 255).toString(16).padStart(2, '0')) : '');
    setTempColor(hexColor);
    onChange({ target: { name, value: hexColor } } as any);
  };

  const handleCancel = () => {
    onChange({ target: { name, value: originalColorRef.current } } as any);
    setIsOpen(false);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  const isTransparent = value === 'transparent' || value === '';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <div style={{ width: '45px', fontSize: '11px', color: '#8c8d9c', fontWeight: 500 }}>{label}</div>
      
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div 
          onClick={handleOpen}
          onMouseDown={(e) => e.preventDefault()}
          style={{ 
            width: '24px', height: '24px', borderRadius: '6px', 
            background: isTransparent ? 'repeating-conic-gradient(#3a3c50 0% 25%, transparent 0% 50%) 50% / 8px 8px' : value,
            border: '2px solid #2d2e3e', cursor: 'pointer', flexShrink: 0,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
          }}
          title="Choose Color"
        />
        
        <input 
          type="text" value={isTransparent ? 'transparent' : value} 
          onChange={onChange} name={name}
          style={{ 
            flex: 1, padding: '6px 8px', fontSize: '11px', fontFamily: '"Fira Code", monospace', 
            background: 'rgba(20, 21, 31, 0.6)', border: '1px solid #2d2e3e', borderRadius: '6px', 
            color: '#e0e0e0', outline: 'none', minWidth: 0, transition: 'all 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#4caf50'}
          onBlur={(e) => e.target.style.borderColor = '#2d2e3e'}
          placeholder="#hex or transparent"
        />

        <button 
          onClick={onTransparent}
          onMouseDown={(e) => e.preventDefault()}
          title="Set to Transparent"
          style={{ 
            width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #3a3c50', 
            background: 'rgba(36, 37, 51, 0.8)', cursor: 'pointer', flexShrink: 0, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c8d9c', padding: 0,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef5350'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#8c8d9c'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
        </button>

        {isOpen && (
          <div ref={popoverRef} onMouseDown={(e) => e.preventDefault()} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 1000, marginTop: '8px', filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.8))' }}>
            <div style={{ background: '#1e1f2e', border: '1px solid #3a3c50', borderRadius: '8px', overflow: 'hidden' }}>
              <SketchPicker color={tempColor} onChange={handleColorChange} disableAlpha={false} presetColors={['#242533', '#4caf50', '#ef5350', '#42a5f5', '#ab47bc', '#e0e0e0', '#1a1b26']} styles={{ default: { picker: { background: '#1e1f2e', border: 'none', boxShadow: 'none' } } }} />
              <div style={{ padding: '10px 14px', background: '#1a1b26', borderTop: '1px solid #2d2e3e', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button onClick={handleCancel} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #3a3c50', color: '#8c8d9c', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button onClick={handleApply} style={{ padding: '6px 16px', background: '#4caf50', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)' }}>OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
