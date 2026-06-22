import React, { useState, useEffect, useRef } from 'react';
import { Type, Image as ImageIcon, MousePointerClick, AppWindow, Copy, Video, Sun, Moon, Magnet, Shapes, HelpCircle, Smile } from 'lucide-react';
import { useBuilder } from '../BuilderContext';
import { ICON_MAP } from '../icons';

export const Toolbar: React.FC = () => {
  const { addElement, selectedIds, duplicateSelected, theme, setTheme, isSnapEnabled, setIsSnapEnabled, isHelpOpen, setIsHelpOpen } = useBuilder();
  const [isShapeOpen, setIsShapeOpen] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);
  const [isTextOpen, setIsTextOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const iconPopoverRef = useRef<HTMLDivElement>(null);
  const textPopoverRef = useRef<HTMLDivElement>(null);

  const hasSelection = selectedIds.length > 0;

  // Handle clicking outside the shape popover to close it
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsShapeOpen(false);
      }
      if (textPopoverRef.current && !textPopoverRef.current.contains(e.target as Node)) {
        setIsTextOpen(false);
      }
    };
    if (isShapeOpen || isTextOpen) {
      document.addEventListener('mousedown', clickOutside);
    }
    return () => document.removeEventListener('mousedown', clickOutside);
  }, [isShapeOpen, isTextOpen]);

  // Handle clicking outside the icon popover to close it
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (iconPopoverRef.current && !iconPopoverRef.current.contains(e.target as Node)) {
        setIsIconOpen(false);
      }
    };
    if (isIconOpen) {
      document.addEventListener('mousedown', clickOutside);
    }
    return () => document.removeEventListener('mousedown', clickOutside);
  }, [isIconOpen]);

  const shapesList = [
    { type: 'rectangle', name: 'Rectangle', svg: <rect x="5" y="5" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /> },
    { type: 'ellipse', name: 'Circle', svg: <circle cx="15" cy="15" r="10" fill="none" stroke="currentColor" strokeWidth="2" /> },
    { type: 'triangle', name: 'Triangle', svg: <polygon points="15,4 26,24 4,24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'rightTriangle', name: 'Right Triangle', svg: <polygon points="5,5 25,25 5,25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'diamond', name: 'Diamond', svg: <polygon points="15,4 26,15 15,26 4,15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'pentagon', name: 'Pentagon', svg: <polygon points="15,4 26,12 22,25 8,25 4,12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'hexagon', name: 'Hexagon', svg: <polygon points="15,4 25,10 25,20 15,26 5,20 5,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'star', name: 'Star', svg: <polygon points="15,3 18,11 27,11 20,16 22,24 15,19 8,24 10,16 3,11 12,11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'parallelogram', name: 'Parallelogram', svg: <polygon points="9,5 26,5 21,25 4,25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'trapezoid', name: 'Trapezoid', svg: <polygon points="8,5 22,5 27,25 3,25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'arrowRight', name: 'Arrow Right', svg: <polygon points="4,11 18,11 18,6 26,15 18,24 18,19 4,19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'arrowLeft', name: 'Arrow Left', svg: <polygon points="26,11 12,11 12,6 4,15 12,24 12,19 26,19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'arrowUp', name: 'Arrow Up', svg: <polygon points="11,26 11,12 6,12 15,4 24,12 19,12 19,26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'arrowDown', name: 'Arrow Down', svg: <polygon points="11,4 11,18 6,18 15,26 24,18 19,18 19,4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> },
    { type: 'line', name: 'Line', svg: <line x1="5" y1="25" x2="25" y2="5" stroke="currentColor" strokeWidth="2" /> },
    { type: 'arrow', name: 'Arrow', svg: <g><line x1="5" y1="25" x2="21" y2="9" stroke="currentColor" strokeWidth="2" /><polygon points="25,5 17,7 23,13" fill="currentColor" /></g> },
    { type: 'elbow', name: 'Elbow Connector', svg: <path d="M 5 25 L 15 25 L 15 5 L 25 5" fill="none" stroke="currentColor" strokeWidth="2" /> }
  ];

  const handleSelectShape = (shapeType: string) => {
    addElement('shape', undefined, { shapeType } as any);
    setIsShapeOpen(false);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-item" onClick={() => addElement('node')} title="Add Node Container">
        <AppWindow size={22} />
      </div>
      <div className="toolbar-item" onClick={() => addElement('image')} title="Add Image">
        <ImageIcon size={22} />
      </div>
      <div className="toolbar-item" onClick={() => addElement('video')} title="Add Video">
        <Video size={22} />
      </div>
      <div 
        className={`toolbar-item ${isTextOpen ? 'active' : ''}`} 
        onClick={() => setIsTextOpen(!isTextOpen)} 
        title="Add Text"
        style={{ position: 'relative' }}
      >
        <Type size={22} />
        {isTextOpen && (
          <div 
            ref={textPopoverRef}
            className="shape-popover"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '180px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px', gap: '4px' }}>
              <div 
                className="shape-popover-item"
                style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'bold', fontSize: '24px', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => {
                  addElement('text', undefined, { text: { content: 'Heading 1', fontSize: 32, fontWeight: 700 } } as any);
                  setIsTextOpen(false);
                }}
              >Heading 1</div>
              <div 
                className="shape-popover-item"
                style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'bold', fontSize: '18px', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => {
                  addElement('text', undefined, { text: { content: 'Heading 2', fontSize: 24, fontWeight: 600 } } as any);
                  setIsTextOpen(false);
                }}
              >Heading 2</div>
              <div 
                className="shape-popover-item"
                style={{ padding: '8px 12px', textAlign: 'left', fontSize: '14px', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => {
                  addElement('text', undefined, { text: { content: 'Paragraph', fontSize: 16, fontWeight: 400 } } as any);
                  setIsTextOpen(false);
                }}
              >Normal Text</div>
              <div 
                className="shape-popover-item"
                style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#8c8d9c', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => {
                  addElement('text', undefined, { text: { content: 'Small Text', fontSize: 12, fontWeight: 400, color: '#8c8d9c' } } as any);
                  setIsTextOpen(false);
                }}
              >Small Text</div>
            </div>
          </div>
        )}
      </div>
      <div className="toolbar-item" onClick={() => addElement('button')} title="Add Button">
        <MousePointerClick size={22} />
      </div>
      <div 
        className={`toolbar-item ${isShapeOpen ? 'active' : ''}`} 
        onClick={() => setIsShapeOpen(!isShapeOpen)} 
        title="Add Shape"
        style={{ position: 'relative' }}
      >
        <Shapes size={22} />
        {isShapeOpen && (
          <div 
            ref={popoverRef}
            className="shape-popover"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '12px' }}>
              {shapesList.map((shape) => (
                <div 
                  key={shape.type} 
                  className="shape-popover-item"
                  onClick={() => handleSelectShape(shape.type)}
                  title={shape.name}
                >
                  <svg width="24" height="24" viewBox="0 0 30 30" style={{ color: 'var(--text-primary)' }}>
                    {shape.svg}
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div 
        className={`toolbar-item ${isIconOpen ? 'active' : ''}`} 
        onClick={() => setIsIconOpen(!isIconOpen)} 
        title="Add Icon"
        style={{ position: 'relative' }}
      >
        <Smile size={22} />
        {isIconOpen && (
          <div 
            ref={iconPopoverRef}
            className="shape-popover"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '220px', maxHeight: '300px', overflowY: 'auto' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', padding: '12px' }}>
              {Object.keys(ICON_MAP).map((name) => (
                <div 
                  key={name} 
                  className="shape-popover-item"
                  onClick={() => {
                    addElement('icon', undefined, { iconName: name, color: 'var(--text-primary)' } as any);
                    setIsIconOpen(false);
                  }}
                  title={name}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '6px' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <g dangerouslySetInnerHTML={{ __html: ICON_MAP[name] }} />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />
      
      <div 
        className={`toolbar-item ${isSnapEnabled ? 'active' : ''}`}
        onClick={() => setIsSnapEnabled(!isSnapEnabled)}
        title={isSnapEnabled ? "Disable Snapping" : "Enable Snapping"}
      >
        <Magnet size={22} />
      </div>

      <div 
        className="toolbar-item"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
      </div>

      <div 
        className={`toolbar-item ${isHelpOpen ? 'active' : ''}`}
        onClick={() => setIsHelpOpen(!isHelpOpen)}
        title="Keyboard Shortcuts (H)"
      >
        <HelpCircle size={22} />
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />

      <div 
        className="toolbar-item" 
        style={{ opacity: hasSelection ? 1 : 0.3, cursor: hasSelection ? 'pointer' : 'default' }}
        onClick={() => hasSelection && duplicateSelected()} 
        title="Duplicate Selected"
      >
        <Copy size={22} />
      </div>
    </div>
  );
};
