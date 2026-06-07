import React from 'react';
import { Type, Square, Image as ImageIcon, MousePointerClick, AppWindow, Copy, Video } from 'lucide-react';
import { useBuilder } from '../BuilderContext';

export const Toolbar: React.FC = () => {
  const { addElement, selectedIds, duplicateSelected } = useBuilder();

  const hasSelection = selectedIds.length > 0;

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
      <div className="toolbar-item" onClick={() => addElement('text')} title="Add Text">
        <Type size={22} />
      </div>
      <div className="toolbar-item" onClick={() => addElement('button')} title="Add Button">
        <MousePointerClick size={22} />
      </div>
      <div className="toolbar-item" onClick={() => addElement('shape')} title="Add Shape">
        <Square size={22} />
      </div>
      <div style={{ height: '1px', backgroundColor: '#3a3c50', margin: '8px 0' }} />
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
