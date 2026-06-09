import React from 'react';
import { createPortal } from 'react-dom';
import { useBuilder } from '../BuilderContext';
import { CustomColorPicker } from './CustomColorPicker';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Settings, X } from 'lucide-react';
import { ICON_MAP } from '../icons';

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



export const PropertiesPanel: React.FC = () => {
  const { elements, selectedIds, updateElement, removeElement, removeSelected, exportHTML, connections, selectedConnectionId, updateConnection, removeConnection, theme, setTheme, isSnapEnabled, setIsSnapEnabled, isBlurEnabled, setIsBlurEnabled, alignElements, distributeElements, isPresenting, setIsPresenting, isPropertiesOpen, setIsPropertiesOpen, saveHistory } = useBuilder();

  const lastSelectedId = selectedIds[selectedIds.length - 1];
  const selectedElement = elements.find(el => el.id === lastSelectedId);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState(false);
  const [htmlCode, setHtmlCode] = React.useState('');

  const handleGenerate = () => { setHtmlCode(exportHTML()); setModalOpen(true); };
  const handleCopy = () => { navigator.clipboard.writeText(htmlCode); };

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
              <iframe srcDoc={htmlCode} style={{ width: '100%', height: '100%', border: 'none' }} title="Preview" sandbox="allow-scripts allow-same-origin" />
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
    return (
      <div className={`properties-panel ${!isBlurEnabled ? 'no-blur' : ''}`} onFocus={saveHistory}>
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
            updateConnection(sc.id, updates);
          }} 
          placeholder="Label..." 
        />

        {sc.label && (
          <>
            <Label>Interactive Button Text</Label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                className="btn"
                onClick={() => updateConnection(sc.id, { interactiveBtnText: 'YES' })}
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
                onClick={() => updateConnection(sc.id, { interactiveBtnText: 'NO' })}
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
        <select value={sc.labelAlignment || 'horizontal'} onChange={(e) => updateConnection(sc.id, { labelAlignment: e.target.value as any })}>
          <option value="horizontal">Horizontal</option><option value="follow">Follow Curve</option>
        </select>
        
        {sc.labelAlignment === 'follow' && (
          <div style={{ marginTop: '6px' }}>
            <Toggle 
              label="Reverse Text Direction" 
              checked={!!sc.reverseLabelDirection} 
              onChange={(v) => updateConnection(sc.id, { reverseLabelDirection: v })} 
              color="#4caf50" 
            />
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
          <div style={{ flex: 2 }}><Label>Font</Label><select value={sc.fontFamily || 'sans-serif'} onChange={(e) => updateConnection(sc.id, { fontFamily: e.target.value })}>{fontOptions}</select></div>
          <div style={{ flex: 1 }}><Label>Size</Label><input type="number" value={sc.fontSize || 14} onChange={(e) => updateConnection(sc.id, { fontSize: parseInt(e.target.value) || 14 })} /></div>
        </div>
        <div style={{ marginTop: '6px' }}>
          <CustomColorPicker label="Text Color" name="color" value={sc.color || '#e0e0e0'} onChange={(e) => updateConnection(sc.id, { color: e.target.value })} onTransparent={() => updateConnection(sc.id, { color: 'transparent' })} />
        </div>

        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
          <div style={{ flex: 1 }}><Label>Start</Label><select value={sc.startArrow || 'none'} onChange={(e) => updateConnection(sc.id, { startArrow: e.target.value as any })}><option value="none">—</option><option value="arrow">Arrow</option></select></div>
          <div style={{ flex: 1 }}><Label>End</Label><select value={sc.endArrow || 'none'} onChange={(e) => updateConnection(sc.id, { endArrow: e.target.value as any })}><option value="none">—</option><option value="arrow">Arrow</option></select></div>
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
          img.onload = () => { const maxWidth = 500; let newW = img.width, newH = img.height; if (newW > maxWidth) { const r = maxWidth / newW; newW = maxWidth; newH = img.height * r; } updateElement(targetEl.id, { width: newW, height: newH, src: val as string }); };
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

  const el = selectedElement as any;

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
            <button onClick={() => { setHtmlCode(exportHTML()); setPreviewMode(true); setModalOpen(true); }} style={{ flex: 1, padding: '8px', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Preview</button>
            <button onClick={handleGenerate} style={{ flex: 1, padding: '8px', background: '#4caf50', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Export</button>
          </div>
        </div>
        {renderExportModal()}
      </div>
    );
  }

  return (
    <div className={`properties-panel ${!isBlurEnabled ? 'no-blur' : ''}`} onFocus={saveHistory}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{el.type.charAt(0).toUpperCase() + el.type.slice(1)}</span>
          <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{el.id.substring(0, 8)}</span>
        </div>
        <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} title="Hide Panel"><X size={16} /></button>
      </div>

      <Divider />

      {/* Flags */}
      <Label>Properties</Label>
      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '6px 14px', border: '1px solid var(--border-color)', marginBottom: '8px' }}>
        {el.parentId && <Toggle label="Fill Parent" checked={!!el.fillParent} onChange={(v) => handleToggle('fillParent', v)} />}
        <Toggle label="Lock Position" checked={!!el.isLocked} onChange={(v) => handleToggle('isLocked', v)} color="#e91e63" />
        <Toggle label="Disabled" checked={!!el.isDisabled} onChange={(v) => handleToggle('isDisabled', v)} color="#ef5350" />
        <Toggle label="Hidden" checked={!!el.isHidden} onChange={(v) => handleToggle('isHidden', v)} color="#ff9800" />
        <Toggle label="Pinned" checked={!!el.isPinned} onChange={(v) => handleToggle('isPinned', v)} color="#ab47bc" />
        <Toggle label="Interactive Btns" checked={!!el.enableExpandButton} onChange={(v) => handleToggle('enableExpandButton', v)} color="#42a5f5" />
      </div>

      <Divider />

      {/* Position */}
      <Label>Position & Size</Label>
      {el.type === 'node' && (
        <input type="text" name="title" value={el.title || ''} onChange={handleChange} placeholder="Title..." style={{ marginBottom: '6px' }} />
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
        <div><div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>X</div><input type="number" name="x" value={Math.round(el.x)} onChange={handleChange} disabled={!!el.fillParent} /></div>
        <div><div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>Y</div><input type="number" name="y" value={Math.round(el.y)} onChange={handleChange} disabled={!!el.fillParent} /></div>
        <div><div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>W</div><input type="number" name="width" value={Math.round(el.width)} onChange={handleChange} disabled={!!el.fillParent} min={10} /></div>
        <div><div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>H</div><input type="number" name="height" value={Math.round(el.height)} onChange={handleChange} disabled={!!el.fillParent} min={10} /></div>
      </div>

      <Divider />

      {/* Type-specific */}
      {el.type === 'text' && (<>
        <Label>Content</Label>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px dashed var(--border-color)', marginBottom: '8px', textAlign: 'center' }}>
          Double-click element on canvas to edit text & formatting
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
          <div style={{ flex: 2 }}><Label>Font</Label><select name="fontFamily" value={el.fontFamily || 'sans-serif'} onChange={handleChange}>{fontOptions}</select></div>
          <div style={{ flex: 1 }}><Label>Size</Label><input type="number" name="fontSize" value={el.fontSize || 16} onChange={handleChange} /></div>
        </div>
        {renderAlignmentToolbar(el)}
        <div style={{ marginTop: '12px' }}>
          <CustomColorPicker label="Text" name="color" value={el.color} onChange={handleChange} onTransparent={() => updateElement(el.id, { color: 'transparent' })} />
          <CustomColorPicker label="Fill" name="backgroundColor" value={el.backgroundColor} onChange={handleChange} onTransparent={() => updateElement(el.id, { backgroundColor: 'transparent' })} />
          <CustomColorPicker label="Line" name="borderColor" value={el.borderColor || 'transparent'} onChange={handleChange} onTransparent={() => updateElement(el.id, { borderColor: 'transparent' })} />
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          <div style={{ flex: 1 }}><Label>Border W</Label><input type="number" name="borderWidth" value={el.borderWidth || 0} onChange={handleChange} min={0} /></div>
          <div style={{ flex: 1 }}><Label>Radius</Label><input type="number" name="borderRadius" value={el.borderRadius || 0} onChange={handleChange} min={0} /></div>
        </div>
      </>)}

      {el.type === 'button' && (<>
        <Label>Label</Label>
        <input type="text" name="text" value={el.text} onChange={handleChange} />
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
          <div style={{ flex: 2 }}><Label>Font</Label><select name="fontFamily" value={el.fontFamily || 'sans-serif'} onChange={handleChange}>{fontOptions}</select></div>
          <div style={{ flex: 1 }}><Label>Size</Label><input type="number" name="fontSize" value={el.fontSize || 16} onChange={handleChange} /></div>
        </div>
        {renderAlignmentToolbar(el)}
        <Label>Action</Label>
        <select name="actionType" value={el.actionType} onChange={handleChange}>
          <option value="alert">Alert</option>
          <option value="link">Link (URL)</option>
          <option value="toggleDisabled">Toggle Disabled State</option>
          <option value="toggleVisibility">Toggle Visibility</option>
          <option value="triggerFlow">Trigger Flow (Reveal Cascade)</option>
          <option value="nextSlide">Next Slide</option>
          <option value="prevSlide">Previous Slide</option>
          <option value="goToSlide">Go to Slide</option>
        </select>
        {el.actionType === 'link' ? (
          <>
            <Label>URL</Label>
            <input type="text" name="link" value={el.link} onChange={handleChange} />
          </>
        ) : el.actionType === 'goToSlide' ? (
          <>
            <Label>Target Slide (Node)</Label>
            <select name="actionTarget" value={el.actionTarget} onChange={handleChange}>
              <option value="">—</option>
              {elements
                .filter(x => x.type === 'node' && (x as any).isSlide !== false)
                .map(x => (
                  <option key={x.id} value={x.id}>
                    Slide: {x.title || x.id.substring(0, 6)}
                  </option>
                ))}
            </select>
          </>
        ) : (el.actionType === 'triggerFlow' || el.actionType === 'toggleVisibility' || el.actionType === 'toggleDisabled') ? (
          <>
            <Label>Target Element</Label>
            <select name="actionTarget" value={el.actionTarget} onChange={handleChange}>
              <option value="">—</option>
              {elements
                .filter(x => x.id !== el.id)
                .map(x => (
                  <option key={x.id} value={x.id}>
                    {x.type.toUpperCase()}: {x.title || (x as any).text || x.id.substring(0, 6)}
                  </option>
                ))}
            </select>
          </>
        ) : (el.actionType === 'nextSlide' || el.actionType === 'prevSlide') ? (
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', fontStyle: 'italic' }}>
            Navigates slideshow when clicked.
          </div>
        ) : (
          <>
            <Label>Message</Label>
            <input type="text" name="actionTarget" value={el.actionTarget} onChange={handleChange} />
          </>
        )}
        <div style={{ marginTop: '12px' }}>
          <CustomColorPicker label="Text" name="color" value={el.color || '#ffffff'} onChange={handleChange} onTransparent={() => updateElement(el.id, { color: 'transparent' })} />
          <CustomColorPicker label="Fill" name="backgroundColor" value={el.backgroundColor} onChange={handleChange} onTransparent={() => updateElement(el.id, { backgroundColor: 'transparent' })} />
          <CustomColorPicker label="Line" name="borderColor" value={el.borderColor || 'transparent'} onChange={handleChange} onTransparent={() => updateElement(el.id, { borderColor: 'transparent' })} />
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          <div style={{ flex: 1 }}><Label>Radius</Label><input type="number" name="borderRadius" value={el.borderRadius || 0} onChange={handleChange} min={0} /></div>
        </div>
      </>)}

      {el.type === 'image' && (<>
        <Label>Title</Label><input type="text" name="title" value={el.title || ''} onChange={handleChange} />
        <Label>URL</Label><input type="text" name="src" value={el.src} onChange={handleChange} />
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
          <div style={{ flex: 2 }}><Label>Fit</Label><select name="objectFit" value={el.objectFit} onChange={handleChange}><option value="contain">Contain</option><option value="cover">Cover</option><option value="fill">Fill</option></select></div>
          <div style={{ flex: 1 }}><Label>Font</Label><input type="number" name="fontSize" value={el.fontSize || 11} onChange={handleChange} /></div>
        </div>
      </>)}

      {el.type === 'video' && (<>
        <Label>Title</Label><input type="text" name="title" value={el.title || ''} onChange={handleChange} />
        <Label>Video URL</Label><input type="text" name="src" value={el.src} onChange={handleChange} placeholder="YouTube / Drive" />
      </>)}

      {el.type === 'node' && (<>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ flex: 2 }}><Label>Font</Label><select name="fontFamily" value={el.fontFamily || 'sans-serif'} onChange={handleChange}>{fontOptions}</select></div>
          <div style={{ flex: 1 }}><Label>Size</Label><input type="number" name="fontSize" value={el.fontSize || 14} onChange={handleChange} /></div>
        </div>
        <div style={{ marginTop: '12px' }}>
          <CustomColorPicker label="Text" name="color" value={el.color || '#ffffff'} onChange={handleChange} onTransparent={() => updateElement(el.id, { color: 'transparent' })} />
          <CustomColorPicker label="Fill" name="backgroundColor" value={el.backgroundColor} onChange={handleChange} onTransparent={() => updateElement(el.id, { backgroundColor: 'transparent' })} />
        </div>
        <div style={{ marginTop: '8px' }}>
          <Toggle label="Include in Presentation" checked={el.isSlide !== false} onChange={(v) => handleToggle('isSlide', v)} color="#3f51b5" />
        </div>
      </>)}

      {el.type === 'icon' && (<>
        <Label>Icon Name</Label>
        <select name="iconName" value={el.iconName || 'home'} onChange={handleChange}>
          {Object.keys(ICON_MAP).map(name => (
            <option key={name} value={name}>{name.toUpperCase()}</option>
          ))}
        </select>
        <div style={{ marginTop: '12px' }}>
          <CustomColorPicker label="Color" name="color" value={el.color || '#ffffff'} onChange={handleChange} onTransparent={() => updateElement(el.id, { color: 'transparent' })} />
        </div>
      </>)}

      {el.type === 'shape' && (<>
        <Label>Shape Type</Label>
        <select name="shapeType" value={el.shapeType} onChange={handleChange}>
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

        <Label>Text Inside Shape</Label>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px dashed var(--border-color)', marginBottom: '8px', textAlign: 'center' }}>
          Double-click shape on canvas to edit text & formatting
        </div>

        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
          <div style={{ flex: 2 }}><Label>Font</Label><select name="fontFamily" value={el.fontFamily || 'sans-serif'} onChange={handleChange}>{fontOptions}</select></div>
          <div style={{ flex: 1 }}><Label>Size</Label><input type="number" name="fontSize" value={el.fontSize || 14} onChange={handleChange} /></div>
        </div>
        {renderAlignmentToolbar(el)}

        <div style={{ marginTop: '12px' }}>
          <CustomColorPicker label="Text" name="color" value={el.color || '#e0e0e0'} onChange={handleChange} onTransparent={() => updateElement(el.id, { color: 'transparent' })} />
          <CustomColorPicker label="Fill" name="backgroundColor" value={el.backgroundColor} onChange={handleChange} onTransparent={() => updateElement(el.id, { backgroundColor: 'transparent' })} />
          <CustomColorPicker label="Line" name="borderColor" value={el.borderColor || 'transparent'} onChange={handleChange} onTransparent={() => updateElement(el.id, { borderColor: 'transparent' })} />
        </div>

        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          <div style={{ flex: 1 }}>
            <Label>{['line', 'arrow', 'elbow'].includes(el.shapeType) ? 'Line Width' : 'Border W'}</Label>
            <input type="number" name="borderWidth" value={el.borderWidth || 0} onChange={handleChange} min={0} />
          </div>
          {!['line', 'arrow', 'elbow'].includes(el.shapeType) && (
            <div style={{ flex: 1 }}>
              <Label>Radius</Label>
              <input type="number" name="borderRadius" value={el.borderRadius || 0} onChange={handleChange} min={0} />
            </div>
          )}
        </div>
      </>)}

      {/* Actions */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button onClick={() => setIsPresenting(true)} className="btn" style={{ width: '100%', padding: '8px', background: '#3f51b5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Present Slideshow</button>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => removeElement(el.id)} style={{ flex: 1, padding: '8px', background: 'none', border: '1px solid var(--border-color)', color: '#ef5350', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Delete</button>
          <button onClick={() => { setHtmlCode(exportHTML()); setPreviewMode(true); setModalOpen(true); }} style={{ flex: 1, padding: '8px', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Preview</button>
          <button onClick={handleGenerate} style={{ flex: 1, padding: '8px', background: '#4caf50', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Export</button>
        </div>
      </div>
      {renderExportModal()}
    </div>
  );
};
