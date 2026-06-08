import React from 'react';
import { createPortal } from 'react-dom';
import { useBuilder } from '../BuilderContext';
import { CustomColorPicker } from './CustomColorPicker';

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
  const { elements, selectedIds, updateElement, removeElement, exportHTML, connections, selectedConnectionId, updateConnection, removeConnection, theme, setTheme, isSnapEnabled, setIsSnapEnabled, alignElements, distributeElements, isPresenting, setIsPresenting } = useBuilder();

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
  if (!selectedElement && !selectedConnectionId) {
    return (
      <div className="properties-panel">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Global Settings</div>
          <Divider />
          <Toggle label="Light Theme" checked={theme === 'light'} onChange={(v) => setTheme(v ? 'light' : 'dark')} color="#4caf50" />
          <Toggle label="Enable Snapping" checked={isSnapEnabled} onChange={(v) => setIsSnapEnabled(v)} color="#4caf50" />
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
      <div className="properties-panel">
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Connection</div>
        <Label>Label</Label>
        <input type="text" value={sc.label || ''} onChange={(e) => updateConnection(sc.id, { label: e.target.value })} placeholder="Label..." />
        <Label>Alignment</Label>
        <select value={sc.labelAlignment || 'horizontal'} onChange={(e) => updateConnection(sc.id, { labelAlignment: e.target.value as any })}>
          <option value="horizontal">Horizontal</option><option value="follow">Follow Curve</option>
        </select>
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
    if (name === 'src' && typeof parsedValue === 'string') {
      const driveMatch = parsedValue.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) || parsedValue.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        if (selectedElement?.type === 'image') parsedValue = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
        else if (selectedElement?.type === 'video') parsedValue = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      }
      if (selectedElement?.type === 'image') {
        const img = new Image();
        img.onload = () => { const maxWidth = 500; let newW = img.width, newH = img.height; if (newW > maxWidth) { const r = maxWidth / newW; newW = maxWidth; newH = img.height * r; } updateElement(selectedElement.id, { width: newW, height: newH, src: parsedValue as string }); };
        img.src = parsedValue as string;
      }
      if (selectedElement?.type === 'video') updateElement(selectedElement.id, { width: 560, height: 315, src: parsedValue as string });
    }
    if (selectedElement) {
      if (name === 'width' && (parsedValue as number) < 10) parsedValue = 10;
      if (name === 'height' && (parsedValue as number) < 10) parsedValue = 10;
      updateElement(selectedElement.id, { [name]: parsedValue });
    }
  };

  const handleToggle = (name: string, value: boolean) => {
    if (selectedElement) updateElement(selectedElement.id, { [name]: value });
  };

  const el = selectedElement as any;

  return (
    <div className="properties-panel">
      {selectedIds.length > 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          <div style={{ padding: '6px 10px', background: 'rgba(76, 175, 80, 0.15)', borderRadius: '6px', fontSize: '11px', color: '#4caf50', fontWeight: 600, textAlign: 'center' }}>
            {selectedIds.length} elements selected
          </div>

          <div style={{ height: '1px', background: '#2d2e3e', margin: '4px 0' }} />

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

          <div style={{ height: '1px', background: '#2d2e3e', margin: '4px 0' }} />
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{el.type.charAt(0).toUpperCase() + el.type.slice(1)}</span>
        <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{el.id.substring(0, 8)}</span>
      </div>

      <Divider />

      {/* Flags */}
      <Label>Properties</Label>
      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '6px 14px', border: '1px solid var(--border-color)', marginBottom: '8px' }}>
        {el.parentId && <Toggle label="Fill Parent" checked={!!el.fillParent} onChange={(v) => handleToggle('fillParent', v)} />}
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
                .filter(x => x.type === 'node')
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
