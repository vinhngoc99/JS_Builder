import React from 'react';
import { CanvasElement, TextStyle } from '../../types';
import { CustomColorPicker } from '../CustomColorPicker';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline } from 'lucide-react';

interface TextPanelProps {
  element: CanvasElement;
  onChange: (updates: { text: TextStyle }) => void;
}

export const TextPanel: React.FC<TextPanelProps> = ({ element, onChange }) => {
  const text = element.text || {
    content: '',
    fontFamily: "'Google Sans Text'",
    fontSize: 16,
    fontWeight: 400,
    fontStyle: 'normal',
    textDecoration: 'none',
    color: 'var(--text-primary)',
    align: 'center',
    verticalAlign: 'middle',
    lineHeight: 1.5,
    letterSpacing: 0,
    padding: { top: 10, right: 14, bottom: 10, left: 14 },
  };

  const handlePropertyChange = (key: keyof TextStyle, value: any) => {
    onChange({
      text: {
        ...text,
        [key]: value,
      },
    });
  };

  const handlePaddingChange = (side: 'top' | 'right' | 'bottom' | 'left', val: number) => {
    onChange({
      text: {
        ...text,
        padding: {
          ...text.padding,
          [side]: val,
        },
      },
    });
  };

  const parseFiniteNumber = (value: string): number | null => {
    if (value.trim() === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const fontOptions = (
    <>
      <option value="sans-serif">Sans-Serif</option>
      <option value="'Google Sans Display'">Google Sans Display</option>
      <option value="'Google Sans Flex'">Google Sans Flex</option>
      <option value="'Google Sans Text'">Google Sans Text</option>
      <option value="'Lexend Deca'">Lexend Deca</option>
      <option value="serif">Serif</option>
      <option value="monospace">Monospace</option>
      <option value="Arial">Arial</option>
      <option value="Georgia">Georgia</option>
      <option value="Verdana">Verdana</option>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 2 }}>
          <div style={{ fontSize: '11px', color: '#8c8d9c', marginBottom: '4px', fontWeight: 600 }}>Font Family</div>
          <select
            value={text.fontFamily}
            onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
            style={{ width: '100%', padding: '4px' }}
          >
            {fontOptions}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: '#8c8d9c', marginBottom: '4px', fontWeight: 600 }}>Size</div>
          <input
            type="number"
            value={text.fontSize}
            onChange={(e) => {
              const val = parseFiniteNumber(e.target.value);
              if (val !== null) handlePropertyChange('fontSize', Math.round(val));
            }}
            onBlur={(e) => {
              const val = parseFiniteNumber(e.target.value);
              handlePropertyChange('fontSize', val === null || val < 6 ? 12 : Math.round(val));
            }}
            style={{ width: '100%' }}
            min={6}
          />
        </div>
      </div>

      {/* Style Toggle Buttons */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
        <button
          onClick={() => handlePropertyChange('fontWeight', text.fontWeight === 700 ? 400 : 700)}
          className="btn"
          style={{
            flex: 1,
            padding: '6px',
            background: text.fontWeight === 700 ? 'var(--btn-hover-bg)' : 'transparent',
            border: '1px solid var(--border-color)',
            color: text.fontWeight === 700 ? '#fff' : 'var(--text-secondary)',
          }}
          title="Bold"
        >
          <Bold size={14} style={{ margin: '0 auto' }} />
        </button>
        <button
          onClick={() => handlePropertyChange('fontStyle', text.fontStyle === 'italic' ? 'normal' : 'italic')}
          className="btn"
          style={{
            flex: 1,
            padding: '6px',
            background: text.fontStyle === 'italic' ? 'var(--btn-hover-bg)' : 'transparent',
            border: '1px solid var(--border-color)',
            color: text.fontStyle === 'italic' ? '#fff' : 'var(--text-secondary)',
          }}
          title="Italic"
        >
          <Italic size={14} style={{ margin: '0 auto' }} />
        </button>
        <button
          onClick={() => handlePropertyChange('textDecoration', text.textDecoration === 'underline' ? 'none' : 'underline')}
          className="btn"
          style={{
            flex: 1,
            padding: '6px',
            background: text.textDecoration === 'underline' ? 'var(--btn-hover-bg)' : 'transparent',
            border: '1px solid var(--border-color)',
            color: text.textDecoration === 'underline' ? '#fff' : 'var(--text-secondary)',
          }}
          title="Underline"
        >
          <Underline size={14} style={{ margin: '0 auto' }} />
        </button>
      </div>

      {/* Alignment */}
      <div>
        <div style={{ fontSize: '11px', color: '#8c8d9c', marginBottom: '4px', fontWeight: 600 }}>Horizontal Align</div>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {(['left', 'center', 'right', 'justify'] as const).map((align) => {
            const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : align === 'right' ? AlignRight : AlignJustify;
            return (
              <button
                key={align}
                className="btn"
                onClick={() => handlePropertyChange('align', align)}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: text.align === align ? '#4caf50' : 'transparent',
                  color: text.align === align ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                <Icon size={14} style={{ margin: '0 auto' }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Vertical Alignment */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
        <div style={{ fontSize: '11px', color: '#8c8d9c', width: '75px', fontWeight: 600 }}>Vertical Align</div>
        <select
          value={text.verticalAlign}
          onChange={(e) => handlePropertyChange('verticalAlign', e.target.value)}
          style={{ flex: 1, padding: '4px' }}
        >
          <option value="top">Top</option>
          <option value="middle">Middle</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>

      {/* Colors */}
      <div style={{ marginTop: '4px' }}>
        <CustomColorPicker
          label="Text Color"
          name="textColor"
          value={text.color}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
          onTransparent={() => handlePropertyChange('color', 'transparent')}
        />
      </div>

      {/* Spacing details */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color: '#8c8d9c', marginBottom: '2px' }}>Line Height</div>
          <input
            type="number"
            value={text.lineHeight}
            onChange={(e) => {
              const val = parseFiniteNumber(e.target.value);
              if (val !== null) handlePropertyChange('lineHeight', val);
            }}
            onBlur={(e) => {
              const val = parseFiniteNumber(e.target.value);
              handlePropertyChange('lineHeight', val === null ? 1.5 : val);
            }}
            step="0.1"
            min="0.5"
            max="3"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color: '#8c8d9c', marginBottom: '2px' }}>Letter Spacing</div>
          <input
            type="number"
            value={text.letterSpacing}
            onChange={(e) => {
              const val = parseFiniteNumber(e.target.value);
              if (val !== null) handlePropertyChange('letterSpacing', val);
            }}
            onBlur={(e) => {
              const val = parseFiniteNumber(e.target.value);
              handlePropertyChange('letterSpacing', val === null ? 0 : val);
            }}
            step="0.5"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Padding */}
      <div style={{ marginTop: '6px' }}>
        <div style={{ fontSize: '11px', color: '#8c8d9c', marginBottom: '4px', fontWeight: 600 }}>Internal Padding (px)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {([['top', 'T'], ['right', 'R'], ['bottom', 'B'], ['left', 'L']] as const).map(([side, label]) => (
            <div key={side}>
              <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '2px', textAlign: 'center' }}>{label}</div>
              <input
                type="number"
                value={text.padding?.[side] ?? 0}
                onChange={(e) => {
                  const val = parseFiniteNumber(e.target.value);
                  if (val !== null) handlePaddingChange(side, Math.round(val));
                }}
                onBlur={(e) => {
                  const val = parseFiniteNumber(e.target.value);
                  handlePaddingChange(side, val === null || val < 0 ? 0 : Math.round(val));
                }}
                style={{ width: '100%', textAlign: 'center', padding: '4px' }}
                min={0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
