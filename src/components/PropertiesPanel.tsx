import React from 'react';
import { createPortal } from 'react-dom';
import { useBuilder } from '../BuilderContext';
import { CustomColorPicker } from './CustomColorPicker';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Settings, X } from 'lucide-react';
import { ICON_MAP } from '../icons';
import { Connection } from '../types';
import { compat } from '../models/compat';
import { FillPanel } from './panels/FillPanel';
import { StrokePanel } from './panels/StrokePanel';
import { ShadowPanel } from './panels/ShadowPanel';
import { TextPanel } from './panels/TextPanel';
import { ArrangePanel } from './panels/ArrangePanel';
import { AnimationPanel } from './panels/AnimationPanel';
import { getConnectionArrow, getConnectionStroke } from '../models/Connection';

const Divider = () => <div style={{ height: '1px', background: '#2d2e3e', margin: '10px 0' }} />;

const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: '11px', color: '#8c8d9c', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '6px', marginTop: '12px' }}>{children}</div>
);

const Toggle = ({ label, checked, onChange, color = '#4caf50' }: { label: string; checked: boolean; onChange: (v: boolean) => void; color?: string }) => (
  <div onClick={() => onChange(!checked)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', cursor: 'pointer' }}>
    <span style={{ fontSize: '12px', color: checked ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: checked ? 600 : 400, transition: 'color 0.2s' }}>{label}</span>
    <div style={{ width: '32px', height: '18px', borderRadius: '9px', position: 'relative', transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: checked ? color : 'rgba(128, 128, 128, 0.25)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
      <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '2px', left: checked ? '16px' : '2px', transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
    </div>
  </div>
);

const Accordion = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div style={{ marginBottom: '8px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '8px 12px', 
          background: 'var(--panel-header-bg)', 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          userSelect: 'none',
          borderRadius: isOpen ? '8px 8px 0 0' : '8px'
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && (
        <div style={{ padding: '12px', background: 'var(--bg-toolbar)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px', borderRadius: '0 0 8px 8px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

const getFittedImageSize = (naturalWidth: number, naturalHeight: number) => {
  if (!naturalWidth || !naturalHeight) return { width: 480, height: 270 };
  const maxWidth = 680;
  const maxHeight = 460;
  const minLongSide = 360;
  const longSide = Math.max(naturalWidth, naturalHeight);
  const fitScale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);
  const scale = fitScale < 1
    ? fitScale
    : Math.max(1, Math.min(fitScale, minLongSide / longSide));

  return {
    width: Math.max(80, Math.round(naturalWidth * scale)),
    height: Math.max(80, Math.round(naturalHeight * scale)),
  };
};

const loadImageDimensions = (src: string): Promise<{ width: number; height: number }> => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
  img.onerror = () => reject(new Error('Could not load image dimensions.'));
  img.src = src;
});

const readImageFileOriginal = (file: File): Promise<{ src: string; width: number; height: number }> => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const reader = new FileReader();
  const img = new Image();
  let readSrc = '';
  let width = 0;
  let height = 0;
  let hasRead = false;
  let hasDecoded = false;
  let done = false;

  const cleanup = () => URL.revokeObjectURL(objectUrl);
  const maybeResolve = () => {
    if (done || !hasRead || !hasDecoded) return;
    done = true;
    cleanup();
    resolve({ src: readSrc, width, height });
  };
  const fail = (error: Error) => {
    if (done) return;
    done = true;
    cleanup();
    reject(error);
  };

  reader.onerror = () => fail(new Error('Could not read image file.'));
  reader.onload = () => {
    readSrc = String(reader.result || '');
    hasRead = true;
    maybeResolve();
  };

  img.decoding = 'async';
  img.onerror = () => fail(new Error('Could not decode image file.'));
  img.onload = () => {
    width = img.naturalWidth || img.width;
    height = img.naturalHeight || img.height;
    hasDecoded = true;
    maybeResolve();
  };

  img.src = objectUrl;
  reader.readAsDataURL(file);
});


const NumberInput = ({ label, value, onChange, min, max, disabled, style }: any) => {
  const normalizeNumber = (nextValue: unknown) => {
    const parsed = typeof nextValue === 'number' ? nextValue : parseFloat(String(nextValue ?? ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const clampNumber = (nextValue: number) => {
    let clamped = Number.isFinite(nextValue) ? nextValue : 0;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    return clamped;
  };

  const [localValue, setLocalValue] = React.useState(String(Math.round(normalizeNumber(value))));
  React.useEffect(() => { setLocalValue(String(Math.round(normalizeNumber(value)))); }, [value]);
  
  return (
    <div>
      {label && <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '2px', textAlign: 'center' }}>{label}</div>}
      <input 
        type="number" 
        value={localValue} 
        onChange={(e) => {
          setLocalValue(e.target.value);
          const parsed = parseFloat(e.target.value);
          if (!isNaN(parsed)) onChange(parsed);
        }}
        onBlur={() => {
          const parsed = clampNumber(parseFloat(localValue));
          setLocalValue(String(parsed));
          onChange(parsed);
        }}
        disabled={disabled}
        min={min}
        max={max}
        style={style}
      />
    </div>
  );
};

export const PropertiesPanel: React.FC = () => {
  const { elements, selectedIds, updateElement, removeElement, removeSelected, exportHTML, connections, selectedConnectionId, updateConnection, removeConnection, theme, setTheme, isSnapEnabled, setIsSnapEnabled, isBlurEnabled, setIsBlurEnabled, alignElements, distributeElements, setIsPresenting, isPropertiesOpen, setIsPropertiesOpen, saveHistory, saveHistoryOnce, showAlert } = useBuilder();

  const lastSelectedId = selectedIds[selectedIds.length - 1];
  const selectedElement = elements.find(el => el.id === lastSelectedId);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState(false);
  const [htmlCode, setHtmlCode] = React.useState('');
  const [previewUrl, setPreviewUrl] = React.useState('');
  const imageLoadRequestRef = React.useRef(0);

  React.useEffect(() => {
    if (!modalOpen || !previewMode || !htmlCode) {
      setPreviewUrl('');
      return;
    }

    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [htmlCode, modalOpen, previewMode]);

  const handleGenerate = () => { setHtmlCode(exportHTML()); setModalOpen(true); };
  const handlePreview = () => {
    setHtmlCode(exportHTML());
    setPreviewMode(true);
    setModalOpen(true);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
    } catch (error) {
      console.error('Failed to copy HTML', error);
      await showAlert('Clipboard permission was denied. Please copy the code manually.', 'Copy failed');
    }
  };

  // --- Export Modal ---
  const renderExportModal = () => {
    if (!modalOpen) return null;
    return createPortal(
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
        <div style={{ backgroundColor: '#1e1f2e', padding: '20px', borderRadius: '12px', width: previewMode ? '90vw' : '700px', height: previewMode ? '90vh' : 'auto', maxWidth: '1200px', border: '1px solid #2d2e3e', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #2d2e3e' }}>
            <span style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>{previewMode ? 'Preview' : 'Export HTML'}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {previewMode && <button className="btn primary" onClick={() => setPreviewMode(false)} style={{ height: '32px', padding: '0 14px', fontSize: '12px' }}>Code</button>}
              <button className="btn" onClick={() => setModalOpen(false)} style={{ height: '32px', padding: '0 14px', fontSize: '12px', color: '#fff' }}>Close</button>
            </div>
          </div>
          {previewMode ? (
            <div style={{ flex: 1, backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2d2e3e' }}>
              <iframe key={previewUrl} src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Preview" sandbox="allow-scripts allow-same-origin" />
            </div>
          ) : (
            <>
              <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>Paste into Google Sites "Embed Code"</p>
              <textarea readOnly value={htmlCode} style={{ width: '100%', height: '300px', padding: '10px', fontFamily: 'monospace', fontSize: '11px', backgroundColor: '#0a0b10', color: '#4caf50', border: '1px solid #2d2e3e', borderRadius: '6px', resize: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button className="btn primary" onClick={handleCopy}>Copy</button>
              </div>
            </>
          )}
        </div>
      </div>,
      document.body
    );
  };

  const fontOptions = (<>
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
  </>);

  // --- Empty ---
  const handleClose = () => setIsPropertiesOpen(false);

  if (!isPropertiesOpen) {
    return (
      <button 
        onClick={() => setIsPropertiesOpen(true)}
        style={{
          position: 'fixed',
          right: '16px',
          top: '16px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-toolbar)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          color: 'var(--text-primary)',
          transition: 'all 0.2s',
        }}
        title="Show Properties Panel"
      >
        <Settings size={20} />
      </button>
    );
  }

  if (!selectedElement && !selectedConnectionId) {
    return (
      <div className={`properties-panel ${!isBlurEnabled ? 'no-blur' : ''}`}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Global Settings</div>
            <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} title="Hide Panel"><X size={16} /></button>
          </div>
          <Divider />
          <Toggle label="Light Theme" checked={theme === 'light'} onChange={(v) => setTheme(v ? 'light' : 'dark')} color="#4caf50" />
          <Toggle label="Enable Snapping" checked={isSnapEnabled} onChange={(v) => setIsSnapEnabled(v)} color="#4caf50" />
          <Toggle label="Enable Blur" checked={isBlurEnabled} onChange={(v) => setIsBlurEnabled(v)} color="#4caf50" />
          <Divider />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Select an element to view properties</p>
          </div>
        </div>
        <button onClick={() => setIsPresenting(true)} className="btn" style={{ width: '100%', padding: '10px', background: '#3f51b5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Present Slideshow</button>
        <button onClick={handleGenerate} className="btn primary" style={{ width: '100%', padding: '10px' }}>Export HTML</button>
        {renderExportModal()}
      </div>
    );
  }

  // --- Connection ---
  if (selectedConnectionId) {
    const sc = connections.find(c => c.id === selectedConnectionId);
    if (!sc) return null;
    const connStroke = getConnectionStroke(sc);
    const connArrow = getConnectionArrow(sc);
    const updateConnectionOnce = (updates: Partial<Connection>) => {
      saveHistoryOnce(`connection-panel:${sc.id}`);
      updateConnection(sc.id, updates);
    };
    const updateConnectionStroke = (updates: Partial<typeof connStroke>) => {
      updateConnectionOnce({ stroke: { ...connStroke, ...updates } });
    };
    const updateConnectionArrow = (updates: Partial<typeof connArrow>) => {
      const nextArrow = { ...connArrow, ...updates };
      updateConnectionOnce({
        arrow: nextArrow,
        startArrow: nextArrow.start === 'arrow' ? 'arrow' : 'none',
        endArrow: nextArrow.end === 'arrow' ? 'arrow' : 'none',
      });
    };
    return (
      <div className={`properties-panel ${!isBlurEnabled ? 'no-blur' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Connection</div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} title="Hide Panel"><X size={16} /></button>
        </div>
        <Label>Label</Label>
        <input 
          type="text" 
          value={sc.label || ''} 
          onChange={(e) => {
            const val = e.target.value;
            const updates: Partial<Connection> = { label: val };
            if (val) {
              const lower = val.toLowerCase().trim();
              if (lower === 'no' || lower === 'không' || lower === 'n' || lower === 'k') {
                updates.interactiveBtnText = 'NO';
              } else if (lower === 'yes' || lower === 'có' || lower === 'y') {
                updates.interactiveBtnText = 'YES';
              } else if (!sc.interactiveBtnText) {
                updates.interactiveBtnText = 'YES';
              }
            } else {
              updates.interactiveBtnText = undefined;
            }
            updateConnectionOnce(updates);
          }} 
          placeholder="Label..." 
        />

        {sc.label && (
          <>
            <Label>Interactive Button Text</Label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                className="btn"
                onClick={() => updateConnectionOnce({ interactiveBtnText: 'YES' })}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: (sc.interactiveBtnText || 'YES') === 'YES' ? '#4caf50' : 'var(--btn-bg)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  transition: 'background-color 0.2s'
                }}
              >
                YES
              </button>
              <button
                className="btn"
                onClick={() => updateConnectionOnce({ interactiveBtnText: 'NO' })}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: sc.interactiveBtnText === 'NO' ? '#4caf50' : 'var(--btn-bg)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  transition: 'background-color 0.2s'
                }}
              >
                NO
              </button>
            </div>
          </>
        )}
        <Label>Alignment</Label>
        <select value={sc.labelAlignment || 'horizontal'} onChange={(e) => updateConnectionOnce({ labelAlignment: e.target.value as any })}>
          <option value="horizontal">Horizontal</option><option value="follow">Follow Curve</option>
        </select>
        
        {sc.labelAlignment === 'follow' && (
          <div style={{ marginTop: '6px' }}>
            <Toggle 
              label="Reverse Text Direction" 
              checked={!!sc.reverseLabelDirection} 
              onChange={(v) => updateConnectionOnce({ reverseLabelDirection: v })} 
              color="#4caf50" 
            />
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
          <div style={{ flex: 2 }}><Label>Font</Label><select value={sc.fontFamily || 'sans-serif'} onChange={(e) => updateConnectionOnce({ fontFamily: e.target.value })}>{fontOptions}</select></div>
          <div style={{ flex: 1 }}><Label>Label Size</Label><input type="number" value={sc.fontSize || 14} onChange={(e) => updateConnectionOnce({ fontSize: parseInt(e.target.value) || 14 })} /></div>
        </div>
        <div style={{ marginTop: '6px' }}>
          <CustomColorPicker label="Text Color" name="color" value={sc.color || '#e0e0e0'} onChange={(e) => updateConnectionOnce({ color: e.target.value })} onTransparent={() => updateConnectionOnce({ color: 'transparent' })} />
        </div>

        <Divider />
        <Label>Line Style</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
          <div><Label>Path</Label><select value={connStroke.lineType} onChange={(e) => updateConnectionStroke({ lineType: e.target.value as any })}><option value="curve">Curve</option><option value="straight">Straight</option><option value="elbow">Elbow</option></select></div>
          <div><Label>Stroke</Label><select value={connStroke.style} onChange={(e) => updateConnectionStroke({ style: e.target.value as any })}><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select></div>
          <div><Label>Width</Label><input type="number" min={1} max={20} value={connStroke.width} onChange={(e) => updateConnectionStroke({ width: Math.max(1, parseInt(e.target.value) || 1) })} /></div>
          <div><Label>Arrow Size</Label><input type="number" min={4} max={24} value={connArrow.size} onChange={(e) => updateConnectionArrow({ size: Math.max(4, parseInt(e.target.value) || 4) })} /></div>
        </div>
        <div style={{ marginTop: '6px' }}>
          <CustomColorPicker label="Line Color" name="lineColor" value={connStroke.color} onChange={(e) => updateConnectionStroke({ color: e.target.value })} onTransparent={() => updateConnectionStroke({ color: 'transparent' })} />
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
          <div style={{ flex: 1 }}><Label>Start Arrow</Label><select value={connArrow.start} onChange={(e) => updateConnectionArrow({ start: e.target.value as any })}><option value="none">None</option><option value="arrow">Arrow</option><option value="triangle">Triangle</option><option value="circle">Circle</option><option value="diamond">Diamond</option></select></div>
          <div style={{ flex: 1 }}><Label>End Arrow</Label><select value={connArrow.end} onChange={(e) => updateConnectionArrow({ end: e.target.value as any })}><option value="none">None</option><option value="arrow">Arrow</option><option value="triangle">Triangle</option><option value="circle">Circle</option><option value="diamond">Diamond</option></select></div>
        </div>

        <div style={{ display: 'none', gap: '6px', marginTop: '6px' }}>
          <div style={{ flex: 1 }}><Label>Start</Label><select value={sc.startArrow || 'none'} onChange={(e) => updateConnectionOnce({ startArrow: e.target.value as any })}><option value="none">—</option><option value="arrow">Arrow</option></select></div>
          <div style={{ flex: 1 }}><Label>End</Label><select value={sc.endArrow || 'none'} onChange={(e) => updateConnectionOnce({ endArrow: e.target.value as any })}><option value="none">—</option><option value="arrow">Arrow</option></select></div>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={() => removeConnection(sc.id)} style={{ width: '100%', padding: '8px', background: 'none', border: '1px solid #ef5350', color: '#ef5350', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
          <button onClick={handleGenerate} className="btn primary" style={{ width: '100%', padding: '10px' }}>Export HTML</button>
        </div>
        {renderExportModal()}
      </div>
    );
  }

  // --- Element handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;
    if (type === 'number') parsedValue = parseFloat(value);
    saveHistoryOnce(`bulk-panel:${selectedIds.join(',')}`);
    
    selectedIds.forEach(id => {
      const targetEl = elements.find(el => el.id === id);
      if (!targetEl) return;
      let val = parsedValue;
      
      if (name === 'src' && typeof val === 'string') {
        const driveMatch = val.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) || val.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
          if (targetEl.type === 'image') val = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
          else if (targetEl.type === 'video') val = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
        }
        if (targetEl.type === 'image') {
          const img = new Image();
          img.onload = () => {
            updateElement(targetEl.id, {
              ...getFittedImageSize(img.naturalWidth || img.width, img.naturalHeight || img.height),
              src: val as string,
            });
          };
          img.src = val as string;
          return;
        }
        if (targetEl.type === 'video') {
          updateElement(targetEl.id, { width: 560, height: 315, src: val as string });
          return;
        }
      }
      if (name === 'width' && (val as number) < 10) val = 10;
      if (name === 'height' && (val as number) < 10) val = 10;
      updateElement(id, { [name]: val });
    });
  };

  const handleToggle = (name: string, value: boolean) => {
    saveHistory();
    selectedIds.forEach(id => {
      updateElement(id, { [name]: value });
    });
  };

  const handleColorTransparent = (name: string) => {
    saveHistory();
    selectedIds.forEach(id => {
      updateElement(id, { [name]: 'transparent' });
    });
  };

  const handleAlignText = (align: 'left' | 'center' | 'right' | 'justify') => {
    saveHistory();
    selectedIds.forEach(id => {
      const targetEl = elements.find(el => el.id === id);
      if (targetEl && ['text', 'button', 'shape', 'node'].includes(targetEl.type)) {
        updateElement(id, { textAlign: align });
      }
    });
  };

  const handlePanelChange = (updates: any) => {
    saveHistoryOnce(`element-panel:${selectedIds.join(',')}`);
    selectedIds.forEach(id => {
      updateElement(id, updates);
    });
  };

  const updateSelectedImageSource = async (src: string, extraUpdates: Record<string, any> = {}) => {
    const requestId = ++imageLoadRequestRef.current;
    if (!selectedElement || selectedElement.type !== 'image') {
      handlePanelChange({ src, ...extraUpdates });
      return;
    }

    try {
      const size = await loadImageDimensions(src);
      if (requestId !== imageLoadRequestRef.current) return;
      handlePanelChange({
        src,
        ...getFittedImageSize(size.width, size.height),
        ...extraUpdates,
      } as any);
    } catch {
      if (requestId !== imageLoadRequestRef.current) return;
      handlePanelChange({ src, ...extraUpdates });
    }
  };

  const el = selectedElement ? compat(selectedElement) as any : null;

  const renderAlignmentToolbar = (elementToAlign: any) => {
    if (!elementToAlign) return null;
    return (
      <>
        <Label>Text Alignment</Label>
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            className="btn"
            onClick={() => handleAlignText('left')}
            onMouseDown={(e) => e.preventDefault()}
            style={{ flex: 1, padding: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: elementToAlign.textAlign === 'left' ? '#4caf50' : 'transparent', color: elementToAlign.textAlign === 'left' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button 
            className="btn"
            onClick={() => handleAlignText('center')}
            onMouseDown={(e) => e.preventDefault()}
            style={{ flex: 1, padding: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: (!elementToAlign.textAlign || elementToAlign.textAlign === 'center') ? '#4caf50' : 'transparent', color: (!elementToAlign.textAlign || elementToAlign.textAlign === 'center') ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button 
            className="btn"
            onClick={() => handleAlignText('right')}
            onMouseDown={(e) => e.preventDefault()}
            style={{ flex: 1, padding: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: elementToAlign.textAlign === 'right' ? '#4caf50' : 'transparent', color: elementToAlign.textAlign === 'right' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
          <button 
            className="btn"
            onClick={() => handleAlignText('justify')}
            onMouseDown={(e) => e.preventDefault()}
            style={{ flex: 1, padding: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: elementToAlign.textAlign === 'justify' ? '#4caf50' : 'transparent', color: elementToAlign.textAlign === 'justify' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            title="Justify"
          >
            <AlignJustify size={16} />
          </button>
        </div>
      </>
    );
  };

  if (selectedIds.length > 1) {
    const hasTextSupport = elements.some(el => selectedIds.includes(el.id) && ['text', 'button', 'shape', 'node'].includes(el.type));
    const hasStylableSupport = elements.some(el => selectedIds.includes(el.id) && ['text', 'button', 'shape', 'node', 'image', 'video'].includes(el.type));
    const firstWithText = elements.find(el => selectedIds.includes(el.id) && ['text', 'button', 'shape', 'node'].includes(el.type)) as any;
    const firstWithStyle = elements.find(el => selectedIds.includes(el.id) && ['text', 'button', 'shape', 'node', 'image', 'video'].includes(el.type)) as any;
    
    const getCommonToggleState = (prop: string) => {
      const selected = elements.filter(el => selectedIds.includes(el.id));
      if (selected.length === 0) return false;
      return selected.every(el => (el as any)[prop] === true);
    };

    const isAllSlide = elements.filter(el => selectedIds.includes(el.id) && el.type === 'node').every(el => (el as any).isSlide !== false);

    return (
      <div className={`properties-panel ${!isBlurEnabled ? 'no-blur' : ''}`}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Bulk Edit</span>
          <button 
            onClick={handleClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} 
            title="Hide Panel"
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '6px 10px', background: 'rgba(76, 175, 80, 0.15)', borderRadius: '6px', fontSize: '11px', color: '#4caf50', fontWeight: 600, textAlign: 'center', marginBottom: '8px' }}>
          {selectedIds.length} elements selected
        </div>

        <Divider />

        {/* Alignment controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: '#8c8d9c', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Align Selected</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button className="btn" onClick={() => alignElements('left')} style={{ padding: '6px 4px', fontSize: '10px', width: '100%', boxSizing: 'border-box' }} title="Align left edges">Left</button>
            <button className="btn" onClick={() => alignElements('center')} style={{ padding: '6px 4px', fontSize: '10px', width: '100%', boxSizing: 'border-box' }} title="Align centers horizontally">Center</button>
            <button className="btn" onClick={() => alignElements('right')} style={{ padding: '6px 4px', fontSize: '10px', width: '100%', boxSizing: 'border-box' }} title="Align right edges">Right</button>
            <button className="btn" onClick={() => alignElements('top')} style={{ padding: '6px 4px', fontSize: '10px', width: '100%', boxSizing: 'border-box' }} title="Align top edges">Top</button>
            <button className="btn" onClick={() => alignElements('middle')} style={{ padding: '6px 4px', fontSize: '10px', width: '100%', boxSizing: 'border-box' }} title="Align centers vertically">Middle</button>
            <button className="btn" onClick={() => alignElements('bottom')} style={{ padding: '6px 4px', fontSize: '10px', width: '100%', boxSizing: 'border-box' }} title="Align bottom edges">Bottom</button>
          </div>

          <div style={{ fontSize: '11px', color: '#8c8d9c', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginTop: '4px' }}>Distribute Selected</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button className="btn" onClick={() => distributeElements('horizontal')} style={{ padding: '6px 4px', fontSize: '10px', width: '100%', boxSizing: 'border-box' }} title="Distribute centers horizontally">Horizontal</button>
            <button className="btn" onClick={() => distributeElements('vertical')} style={{ padding: '6px 4px', fontSize: '10px', width: '100%', boxSizing: 'border-box' }} title="Distribute centers vertically">Vertical</button>
          </div>
        </div>

        <Divider />

        {/* Common Switches */}
        <Label>Properties</Label>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '6px 14px', border: '1px solid var(--border-color)', marginBottom: '8px' }}>
          <Toggle label="Lock Position" checked={getCommonToggleState('isLocked')} onChange={(v) => handleToggle('isLocked', v)} color="#e91e63" />
          <Toggle label="Disabled" checked={getCommonToggleState('isDisabled')} onChange={(v) => handleToggle('isDisabled', v)} color="#ef5350" />
          <Toggle label="Hidden" checked={getCommonToggleState('isHidden')} onChange={(v) => handleToggle('isHidden', v)} color="#ff9800" />
          <Toggle label="Pinned" checked={getCommonToggleState('isPinned')} onChange={(v) => handleToggle('isPinned', v)} color="#ab47bc" />
          <Toggle label="Interactive Btns" checked={getCommonToggleState('enableExpandButton')} onChange={(v) => handleToggle('enableExpandButton', v)} color="#42a5f5" />
          {elements.some(el => selectedIds.includes(el.id) && el.type === 'node') && (
            <Toggle label="Include in Presentation" checked={isAllSlide} onChange={(v) => handleToggle('isSlide', v)} color="#3f51b5" />
          )}
        </div>

        {/* Text styling */}
        {hasTextSupport && (
          <>
            <Divider />
            <Label>Text Formatting</Label>
            <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
              <div style={{ flex: 2 }}>
                <Label>Font</Label>
                <select name="fontFamily" value={firstWithText?.fontFamily || 'sans-serif'} onChange={handleChange}>
                  {fontOptions}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <Label>Size</Label>
                <input type="number" name="fontSize" value={firstWithText?.fontSize || 14} onChange={handleChange} />
              </div>
            </div>
            {renderAlignmentToolbar(firstWithText)}
            <div style={{ marginTop: '12px' }}>
              <CustomColorPicker label="Text Color" name="color" value={firstWithText?.color || '#ffffff'} onChange={handleChange} onTransparent={() => handleColorTransparent('color')} />
            </div>
          </>
        )}

        {/* Styles (Fill / Line) */}
        {hasStylableSupport && (
          <>
            <Divider />
            <Label>Style & Border</Label>
            <div style={{ marginTop: '12px' }}>
              <CustomColorPicker label="Fill Color" name="backgroundColor" value={firstWithStyle?.backgroundColor || 'transparent'} onChange={handleChange} onTransparent={() => handleColorTransparent('backgroundColor')} />
              <CustomColorPicker label="Line Color" name="borderColor" value={firstWithStyle?.borderColor || 'transparent'} onChange={handleChange} onTransparent={() => handleColorTransparent('borderColor')} />
            </div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <div style={{ flex: 1 }}>
                <Label>Line Width</Label>
                <input type="number" name="borderWidth" value={firstWithStyle?.borderWidth || 0} onChange={handleChange} min={0} />
              </div>
              <div style={{ flex: 1 }}>
                <Label>Border Radius</Label>
                <input type="number" name="borderRadius" value={firstWithStyle?.borderRadius || 0} onChange={handleChange} min={0} />
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={() => setIsPresenting(true)} className="btn" style={{ width: '100%', padding: '8px', background: '#3f51b5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Present Slideshow</button>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={removeSelected} style={{ flex: 1, padding: '8px', background: 'none', border: '1px solid var(--border-color)', color: '#ef5350', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Delete Selected</button>
            <button onClick={handlePreview} style={{ flex: 1, padding: '8px', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Preview</button>
            <button onClick={handleGenerate} style={{ flex: 1, padding: '8px', background: '#4caf50', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Export</button>
          </div>
        </div>
        {renderExportModal()}
      </div>
    );
  }

  return (
    <div className={`properties-panel ${!isBlurEnabled ? 'no-blur' : ''}`}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedElement!.type.toUpperCase()}</span>
          <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{selectedElement!.id.substring(0, 8)}</span>
        </div>
        <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} title="Hide Panel"><X size={16} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {/* Size & Position */}
        <Accordion title="Size & Position" defaultOpen={true}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600 }}>Element Name</div>
            <input 
              type="text" 
              value={selectedElement!.name || ''} 
              onChange={(e) => handlePanelChange({ name: e.target.value })} 
              placeholder="Name..." 
              style={{ width: '100%' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '4px' }}>
              <NumberInput label="X" value={selectedElement!.x} onChange={(v: number) => handlePanelChange({ x: v })} disabled={!!selectedElement!.fillParent} style={{ width: '100%', boxSizing: 'border-box', padding: '4px 2px', textAlign: 'center' }} />
              <NumberInput label="Y" value={selectedElement!.y} onChange={(v: number) => handlePanelChange({ y: v })} disabled={!!selectedElement!.fillParent} style={{ width: '100%', boxSizing: 'border-box', padding: '4px 2px', textAlign: 'center' }} />
              <NumberInput label="W" value={selectedElement!.width} onChange={(v: number) => handlePanelChange({ width: v })} disabled={!!selectedElement!.fillParent} min={10} style={{ width: '100%', boxSizing: 'border-box', padding: '4px 2px', textAlign: 'center' }} />
              <NumberInput label="H" value={selectedElement!.height} onChange={(v: number) => handlePanelChange({ height: v })} disabled={!!selectedElement!.fillParent} min={10} style={{ width: '100%', boxSizing: 'border-box', padding: '4px 2px', textAlign: 'center' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <div style={{ fontSize: '11px', color: '#8c8d9c', width: '50px' }}>Rotation</div>
              <NumberInput 
                value={selectedElement!.rotation || 0} 
                onChange={(v: number) => handlePanelChange({ rotation: v })} 
                style={{ flex: 1, padding: '4px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>°</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#8c8d9c', width: '50px' }}>Opacity</div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={Math.round((selectedElement!.opacity ?? 1) * 100)} 
                onChange={(e) => handlePanelChange({ opacity: parseFloat(e.target.value) / 100 })} 
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '30px', textAlign: 'right' }}>{Math.round((selectedElement!.opacity ?? 1) * 100)}%</span>
            </div>
          </div>
        </Accordion>

        {/* Arrange & Ordering */}
        <Accordion title="Arrange & Layers" defaultOpen={false}>
          <ArrangePanel elementIds={selectedIds} />
        </Accordion>

        {/* Animations */}
        <Accordion title="Animations" defaultOpen={false}>
          <AnimationPanel element={selectedElement!} onChange={handlePanelChange} />
        </Accordion>
        {/* Fill (Only for nodes, shapes, texts, buttons) */}
        {['node', 'shape', 'text', 'button'].includes(selectedElement!.type) && (
          <Accordion title="Fill / Background" defaultOpen={true}>
            <FillPanel element={selectedElement!} onChange={handlePanelChange} />
          </Accordion>
        )}

        {/* Border & Corners (Only for nodes, shapes, texts, buttons, images, videos) */}
        {['node', 'shape', 'text', 'button', 'image', 'video'].includes(selectedElement!.type) && (
          <Accordion title="Border & Corners" defaultOpen={true}>
            <StrokePanel element={selectedElement!} onChange={handlePanelChange} />
          </Accordion>
        )}

        {/* Shadow (For all elements) */}
        {['node', 'shape', 'image', 'video', 'text', 'button', 'icon'].includes(selectedElement!.type) && (
          <Accordion title="Drop Shadow" defaultOpen={false}>
            <ShadowPanel element={selectedElement!} onChange={handlePanelChange} />
          </Accordion>
        )}

        {/* Text Styling (Only for elements that support text) */}
        {['text', 'button', 'shape', 'node'].includes(selectedElement!.type) && (
          <Accordion title="Text Formatting" defaultOpen={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selectedElement!.type === 'text' && (
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px dashed var(--border-color)', marginBottom: '6px', textAlign: 'center' }}>
                  Double-click text box on canvas to edit text content
                </div>
              )}
              {selectedElement!.type === 'shape' && (
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px dashed var(--border-color)', marginBottom: '6px', textAlign: 'center' }}>
                  Double-click shape on canvas to edit text content
                </div>
              )}
              <TextPanel element={selectedElement!} onChange={handlePanelChange} />
            </div>
          </Accordion>
        )}

        {/* Flags / Properties */}
        <Accordion title="Properties & Flags" defaultOpen={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {selectedElement!.parentId && <Toggle label="Fill Parent" checked={!!selectedElement!.fillParent} onChange={(v) => handlePanelChange({ fillParent: v })} />}
            <Toggle label="Lock Position" checked={!!selectedElement!.locked} onChange={(v) => handlePanelChange({ locked: v })} color="#e91e63" />
            <Toggle label="Disabled" checked={!!selectedElement!.disabled} onChange={(v) => handlePanelChange({ disabled: v })} color="#ef5350" />
            <Toggle label="Hidden" checked={!selectedElement!.visible} onChange={(v) => handlePanelChange({ visible: !v })} color="#ff9800" />
            <Toggle label="Pinned" checked={!!selectedElement!.pinned} onChange={(v) => handlePanelChange({ pinned: v })} color="#ab47bc" />
            <Toggle label="Interactive Btns" checked={!!selectedElement!.interactive} onChange={(v) => handlePanelChange({ interactive: v })} color="#42a5f5" />
            {selectedElement!.type === 'node' && (
              <Toggle label="Include in Presentation" checked={selectedElement!.isSlide !== false} onChange={(v) => handlePanelChange({ isSlide: v })} color="#3f51b5" />
            )}
          </div>
        </Accordion>

        {selectedElement!.type === 'node' && (
          <Accordion title="Speaker Notes" defaultOpen={false}>
            <textarea
              value={(selectedElement! as any).speakerNotes || ''}
              onChange={(e) => handlePanelChange({ speakerNotes: e.target.value } as any)}
              placeholder="Notes for this presentation node..."
              style={{
                width: '100%',
                minHeight: '96px',
                resize: 'vertical',
                padding: '8px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                fontSize: '12px',
                lineHeight: 1.4,
                boxSizing: 'border-box',
              }}
            />
          </Accordion>
        )}

        {/* Button Actions */}
        {selectedElement!.type === 'button' && (
          <Accordion title="Button Action" defaultOpen={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600 }}>Action Type</div>
              <select 
                value={el.actionType || 'alert'} 
                onChange={(e) => handlePanelChange({ actionType: e.target.value })}
                style={{ width: '100%', padding: '4px' }}
              >
                <option value="alert">Alert</option>
                <option value="link">Link (URL)</option>
                <option value="toggleDisabled">Toggle Disabled State</option>
                <option value="toggleVisibility">Toggle Visibility</option>
                <option value="triggerFlow">Trigger Flow (Reveal Cascade)</option>
                <option value="nextSlide">Next Slide</option>
                <option value="prevSlide">Previous Slide</option>
                <option value="goToSlide">Go to Slide</option>
              </select>

              {el.actionType === 'link' && (
                <>
                  <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600, marginTop: '4px' }}>URL</div>
                  <input type="text" value={el.link || ''} onChange={(e) => handlePanelChange({ link: e.target.value })} style={{ width: '100%' }} />
                </>
              )}

              {el.actionType === 'goToSlide' && (
                <>
                  <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600, marginTop: '4px' }}>Target Slide (Node)</div>
                  <select 
                    value={el.actionTarget || ''} 
                    onChange={(e) => handlePanelChange({ actionTarget: e.target.value })}
                    style={{ width: '100%', padding: '4px' }}
                  >
                    <option value="">—</option>
                    {elements
                      .filter(x => x.type === 'node' && (x as any).isSlide !== false)
                      .map(x => (
                        <option key={x.id} value={x.id}>
                          Slide: {x.name || x.id.substring(0, 6)}
                        </option>
                      ))}
                  </select>
                </>
              )}

              {['triggerFlow', 'toggleVisibility', 'toggleDisabled'].includes(el.actionType) && (
                <>
                  <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600, marginTop: '4px' }}>Target Element</div>
                  <select 
                    value={el.actionTarget || ''} 
                    onChange={(e) => handlePanelChange({ actionTarget: e.target.value })}
                    style={{ width: '100%', padding: '4px' }}
                  >
                    <option value="">—</option>
                    {elements
                      .filter(x => x.id !== selectedElement!.id)
                      .map(x => (
                        <option key={x.id} value={x.id}>
                          {x.type.toUpperCase()}: {x.name || x.id.substring(0, 6)}
                        </option>
                      ))}
                  </select>
                </>
              )}

              {el.actionType === 'alert' && (
                <>
                  <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600, marginTop: '4px' }}>Alert Message</div>
                  <input type="text" value={el.actionTarget || ''} onChange={(e) => handlePanelChange({ actionTarget: e.target.value })} style={{ width: '100%' }} />
                </>
              )}
            </div>
          </Accordion>
        )}

        {/* Shapes Configuration */}
        {selectedElement!.type === 'shape' && (
          <Accordion title="Shape Settings" defaultOpen={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600 }}>Shape Type</div>
              <select 
                value={el.shapeType || 'rectangle'} 
                onChange={(e) => handlePanelChange({ shapeType: e.target.value })}
                style={{ width: '100%', padding: '4px' }}
              >
                <option value="rectangle">Rectangle</option>
                <option value="ellipse">Circle / Ellipse</option>
                <option value="line">Line</option>
                <option value="arrow">Arrow</option>
                <option value="elbow">Elbow Connector</option>
                <option value="triangle">Triangle</option>
                <option value="rightTriangle">Right Triangle</option>
                <option value="diamond">Diamond</option>
                <option value="pentagon">Pentagon</option>
                <option value="hexagon">Hexagon</option>
                <option value="star">Star</option>
                <option value="parallelogram">Parallelogram</option>
                <option value="trapezoid">Trapezoid</option>
                <option value="arrowRight">Arrow Right</option>
                <option value="arrowLeft">Arrow Left</option>
                <option value="arrowUp">Arrow Up</option>
                <option value="arrowDown">Arrow Down</option>
              </select>
            </div>
          </Accordion>
        )}

        {/* Media (Image / Video) */}
        {['image', 'video'].includes(selectedElement!.type) && (
          <Accordion title="Media Settings" defaultOpen={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600 }}>URL</div>
              <input 
                type="text" 
                value={el.src || ''} 
                onChange={(e) => {
                  const val = e.target.value;
                  const driveMatch = val.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) || val.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
                  let finalVal = val;
                  if (driveMatch && driveMatch[1]) {
                    if (selectedElement!.type === 'image') finalVal = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
                    else if (selectedElement!.type === 'video') finalVal = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
                  }
                  if (selectedElement!.type === 'image') {
                    void updateSelectedImageSource(finalVal);
                  } else {
                    handlePanelChange({ src: finalVal });
                  }
                }} 
                style={{ width: '100%' }}
                placeholder="https://..."
              />
              {selectedElement!.type === 'image' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  <Toggle 
                    label="Custom Quality" 
                    checked={(selectedElement! as any).imageQuality !== undefined} 
                    onChange={(v) => handlePanelChange({ imageQuality: v ? 100 : undefined })} 
                    color="#4caf50" 
                  />
                  {(selectedElement! as any).imageQuality !== undefined && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#8c8d9c', width: '70px' }}>Quality</div>
                      <NumberInput 
                        value={(selectedElement! as any).imageQuality} 
                        onChange={(v: number) => handlePanelChange({ imageQuality: Math.max(1, Math.min(100, v)) })} 
                        style={{ flex: 1, padding: '4px' }}
                        min={1}
                        max={100}
                      />
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>%</span>
                    </div>
                  )}
                </div>
              )}
              {selectedElement!.type === 'image' && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        if (file.size > 12 * 1024 * 1024) {
                          await showAlert('Image is too large. Please choose an image under 12MB.', 'Upload image');
                          return;
                        }
                        const uploaded = await readImageFileOriginal(file);
                        handlePanelChange({
                          src: uploaded.src,
                          ...getFittedImageSize(uploaded.width, uploaded.height),
                          alt: file.name,
                        } as any);
                      } catch (error) {
                        console.error('Failed to upload image', error);
                        await showAlert('Could not process this image. Please try another file.', 'Upload image');
                      } finally {
                        e.target.value = '';
                      }
                    }}
                    style={{ width: '100%', fontSize: '11px' }}
                  />
                  <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600, marginTop: '4px' }}>Alt Text</div>
                  <input type="text" value={el.alt || ''} onChange={(e) => handlePanelChange({ alt: e.target.value })} style={{ width: '100%' }} />
                  <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600, marginTop: '4px' }}>Object Fit</div>
                  <select value={el.objectFit || 'cover'} onChange={(e) => handlePanelChange({ objectFit: e.target.value })} style={{ width: '100%', padding: '4px' }}>
                    <option value="contain">Contain</option>
                    <option value="cover">Cover</option>
                    <option value="fill">Fill</option>
                  </select>
                </>
              )}
            </div>
          </Accordion>
        )}

        {/* Icon Configuration */}
        {selectedElement!.type === 'icon' && (
          <Accordion title="Icon Settings" defaultOpen={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600 }}>Icon Name</div>
              <select 
                value={el.iconName || 'home'} 
                onChange={(e) => handlePanelChange({ iconName: e.target.value })}
                style={{ width: '100%', padding: '4px' }}
              >
                {Object.keys(ICON_MAP).map(name => (
                  <option key={name} value={name}>{name.toUpperCase()}</option>
                ))}
              </select>
              <CustomColorPicker 
                label="Icon Color" 
                name="iconColor" 
                value={el.iconColor || 'var(--text-primary)'} 
                onChange={(e) => handlePanelChange({ iconColor: e.target.value })} 
                onTransparent={() => handlePanelChange({ iconColor: 'transparent' })} 
              />
            </div>
          </Accordion>
        )}
      </div>

      {/* Panel Footer Actions */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <button onClick={() => setIsPresenting(true)} className="btn" style={{ width: '100%', padding: '10px', background: '#3f51b5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Present Slideshow</button>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => removeElement(selectedElement!.id)} style={{ flex: 1, padding: '10px', background: 'none', border: '1px solid var(--border-color)', color: '#ef5350', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
          <button onClick={handlePreview} style={{ flex: 1, padding: '10px', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Preview</button>
          <button onClick={handleGenerate} className="btn primary" style={{ flex: 1, padding: '10px' }}>Export</button>
        </div>
      </div>
      {renderExportModal()}
    </div>
  );
};
