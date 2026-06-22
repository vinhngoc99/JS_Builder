import React, { useState } from 'react';
import { useBuilder } from '../BuilderContext';
import { Eye, EyeOff, Lock, Unlock, Layers, Type, Square, Image, Video, Play, ArrowUp, ArrowDown } from 'lucide-react';
import { CanvasElement } from '../types';

export const LayerPanel: React.FC = () => {
  const {
    elements,
    selectedIds,
    selectElement,
    updateElement,
    bringForward,
    sendBackward,
    reorderElements,
  } = useBuilder();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const draggedIdRef = React.useRef<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    draggedIdRef.current = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    if (draggedIdRef.current === id) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = draggedIdRef.current || e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== targetId) {
      reorderElements(draggedId, targetId);
    }
    draggedIdRef.current = null;
  };

  // Sort elements by zIndex descending (top layers first)
  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type size={14} color="#42a5f5" />;
      case 'shape': return <Square size={14} color="#4caf50" />;
      case 'image': return <Image size={14} color="#ab47bc" />;
      case 'video': return <Video size={14} color="#ef5350" />;
      case 'button': return <Play size={14} color="#ff9800" />;
      default: return <Layers size={14} color="#8c8d9c" />;
    }
  };

  const handleStartRename = (el: CanvasElement) => {
    setEditingId(el.id);
    setTempName(el.name || el.type.toUpperCase());
  };

  const handleFinishRename = (id: string) => {
    if (tempName.trim()) {
      updateElement(id, { name: tempName.trim() });
    }
    setEditingId(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          left: '16px',
          bottom: '16px',
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
        title="Show Layers Panel"
      >
        <Layers size={20} />
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '70px', // Right next to the Left Toolbar
        top: '402px',
        bottom: '20px',
        width: '240px',
        backgroundColor: 'var(--bg-panel)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 999,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--panel-header-bg)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="var(--text-primary)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Layers</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
          className="btn"
        >
          Hide
        </button>
      </div>

      {/* Layer List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {sortedElements.length === 0 ? (
          <div
            style={{
              padding: '20px 10px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '11px',
            }}
          >
            No elements on canvas
          </div>
        ) : (
          sortedElements.map((el, index) => {
            const isSelected = selectedIds.includes(el.id);
            return (
              <div
                key={el.id}
                onClick={() => selectElement(el.id, false)}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, el.id)}
                onDragOver={(e) => handleDragOver(e, el.id)}
                onDrop={(e) => handleDrop(e, el.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
                  border: `1px solid ${isSelected ? '#4caf50' : 'transparent'}`,
                  cursor: 'grab',
                  userSelect: 'none',
                  transition: 'all 0.2s',
                  gap: '8px',
                }}
                className="layer-item"
              >
                {/* Type Icon */}
                {getElementIcon(el.type)}

                {/* Name / Inline Rename */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === el.id ? (
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={() => handleFinishRename(el.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleFinishRename(el.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '2px 4px',
                        fontSize: '11px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid #4caf50',
                        borderRadius: '4px',
                        color: '#fff',
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <span
                      onDoubleClick={() => handleStartRename(el)}
                      style={{
                        fontSize: '11px',
                        fontWeight: isSelected ? 600 : 400,
                        color: el.visible ? 'var(--text-primary)' : 'var(--text-secondary)',
                        textDecoration: el.visible ? 'none' : 'line-through',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'block',
                      }}
                      title="Double-click to rename"
                    >
                      {el.name || `${el.type.toUpperCase()} ${elements.length - index}`}
                    </span>
                  )}
                </div>

                {/* Reordering mini controls */}
                {isSelected && (
                  <div style={{ display: 'flex', gap: '2px', marginRight: '4px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        bringForward(el.id);
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '2px', cursor: 'pointer' }}
                      title="Move Up"
                    >
                      <ArrowUp size={10} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sendBackward(el.id);
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '2px', cursor: 'pointer' }}
                      title="Move Down"
                    >
                      <ArrowDown size={10} />
                    </button>
                  </div>
                )}

                {/* Visibility/Lock Toggles */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(el.id, { visible: !el.visible });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: el.visible ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >
                    {el.visible ? <Eye size={12} /> : <EyeOff size={12} opacity={0.5} />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(el.id, { locked: !el.locked });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: el.locked ? '#e91e63' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >
                    {el.locked ? <Lock size={12} /> : <Unlock size={12} opacity={0.4} />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
