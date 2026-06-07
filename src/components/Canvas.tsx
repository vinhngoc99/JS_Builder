import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useBuilder } from '../BuilderContext';
import { ElementWrapper } from './ElementWrapper';
import { ZoomIn, ZoomOut, Maximize, MousePointer2, Type, Square, Play, Image as ImageIcon, Layout, Pencil, Trash2, Copy, Eraser, RotateCcw, RotateCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const Canvas: React.FC = () => {
  const { 
    elements, connections, selectElement, connectingNode, setConnectingNode, 
    selectedIds, selectedConnectionId, selectConnection, removeElement, removeConnection, 
    scale, setScale, pan, setPan, editingFocalPointId, setEditingFocalPointId, 
    addElement, removeSelected, duplicateSelected,
    brushStrokes, isBrushMode, brushColor, brushWidth, addBrushStroke, clearBrush, setBrushMode, setBrushColor, undo, redo
  } = useBuilder();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);
  const [currentStroke, setCurrentStroke] = useState<{ x: number, y: number }[] | null>(null);
  
  const startPanInfo = useRef({ startX: 0, startY: 0, initialPanX: 0, initialPanY: 0 });

  const zoomToFit = useCallback(() => {
    if (elements.length === 0 || !canvasRef.current) {
      setScale(1); setPan({ x: 0, y: 0 }); return;
    }
    const padding = 50;
    const rect = canvasRef.current.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    elements.filter(el => !el.parentId).forEach(el => {
      minX = Math.min(minX, el.x); minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width); maxY = Math.max(maxY, el.y + el.height);
    });
    const contentWidth = maxX - minX, contentHeight = maxY - minY;
    const availableWidth = rect.width - padding * 2, availableHeight = rect.height - padding * 2;
    const newScale = Math.min(Math.min(availableWidth / contentWidth, availableHeight / contentHeight), 1.5);
    const centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2;
    const newPanX = rect.width / 2 - centerX * newScale, newPanY = rect.height / 2 - centerY * newScale;
    setScale(newScale); setPan({ x: newPanX, y: newPanY });
  }, [elements, setScale, setPan]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
      
      if (editingFocalPointId && (e.key === 'Enter' || e.key === 'Escape')) { setEditingFocalPointId(null); return; }
      if (!isInput && e.code === 'Space') { e.preventDefault(); setIsSpaceDown(true); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        if (selectedIds.length > 0) removeSelected();
        else if (selectedConnectionId) removeConnection(selectedConnectionId);
      }
      if (e.ctrlKey && e.key === 'd' && !isInput) { e.preventDefault(); duplicateSelected(); }
      if (e.key.toLowerCase() === 'b' && !isInput) { setBrushMode(!isBrushMode); }
      if (e.shiftKey && e.key.toLowerCase() === 'x' && !isInput) { clearBrush(); }
      
      // Undo / Redo
      if (e.ctrlKey && !e.shiftKey && e.key === 'z' && !isInput) { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.shiftKey && e.key === 'Z' && !isInput) { e.preventDefault(); redo(); } // some browsers
      if (e.ctrlKey && e.key === 'y' && !isInput) { e.preventDefault(); redo(); }
    };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') { setIsSpaceDown(false); setIsPanning(false); } };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [selectedIds, selectedConnectionId, removeSelected, removeConnection, editingFocalPointId, setEditingFocalPointId, duplicateSelected, isBrushMode, setBrushMode, clearBrush, undo, redo]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const el = canvasRef.current; if (!el) return;
      const delta = -e.deltaY * 0.001;
      const newScale = Math.min(Math.max(0.1, scale * (1 + delta)), 5);
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
      const canvasX = (mouseX - pan.x) / scale, canvasY = (mouseY - pan.y) / scale;
      const newPanX = mouseX - canvasX * newScale, newPanY = mouseY - canvasY * newScale;
      setScale(newScale); setPan({ x: newPanX, y: newPanY });
    };
    const el = canvasRef.current; if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); }
  }, [scale, pan, setScale, setPan]);

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (contextMenu) setContextMenu(null);
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / scale, y = (e.clientY - rect.top - pan.y) / scale;

    if (isBrushMode) { setCurrentStroke([{ x, y }]); return; }
    if (isSpaceDown) {
      setIsPanning(true);
      startPanInfo.current = { startX: e.clientX, startY: e.clientY, initialPanX: pan.x, initialPanY: pan.y };
      return;
    }
    if (!e.shiftKey) { selectElement(null); selectConnection(null); }
    setSelectionBox({ x1: x, y1: y, x2: x, y2: y });
  };

  const handleContextMenu = (e: React.MouseEvent) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }); };

  const handleAddElementFromMenu = (type: any) => {
    if (!contextMenu) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (contextMenu.x - rect.left - pan.x) / scale, y = (contextMenu.y - rect.top - pan.y) / scale;
    addElement(type, { x: x - 50, y: y - 25 }); setContextMenu(null);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / scale, y = (e.clientY - rect.top - pan.y) / scale;
    if (currentStroke) { setCurrentStroke(prev => prev ? [...prev, { x, y }] : null); return; }
    if (isPanning) {
      setPan({
        x: startPanInfo.current.initialPanX + (e.clientX - startPanInfo.current.startX),
        y: startPanInfo.current.initialPanY + (e.clientY - startPanInfo.current.startY)
      });
      return;
    }
    if (selectionBox) { setSelectionBox(prev => prev ? { ...prev, x2: x, y2: y } : null); return; }
    if (connectingNode) { setMousePos({ x, y }); }
  }, [connectingNode, scale, pan, isPanning, setPan, currentStroke, selectionBox]);

  const handlePointerUp = useCallback(() => {
    if (currentStroke) { addBrushStroke({ id: uuidv4(), points: currentStroke, color: brushColor, width: brushWidth }); setCurrentStroke(null); }
    if (isPanning) setIsPanning(false);
    if (connectingNode) setConnectingNode(null);
    if (selectionBox) {
      const xMin = Math.min(selectionBox.x1, selectionBox.x2), xMax = Math.max(selectionBox.x1, selectionBox.x2);
      const yMin = Math.min(selectionBox.y1, selectionBox.y2), yMax = Math.max(selectionBox.y1, selectionBox.y2);
      elements.filter(el => !el.parentId).forEach(el => { if (el.x >= xMin && el.x + el.width <= xMax && el.y >= yMin && el.y + el.height <= yMax) selectElement(el.id, true); });
      setSelectionBox(null);
    }
  }, [currentStroke, isPanning, connectingNode, selectionBox, elements, selectElement, addBrushStroke, brushColor, brushWidth, setConnectingNode]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove); window.addEventListener('pointerup', handlePointerUp);
    return () => { window.removeEventListener('pointermove', handlePointerMove); window.removeEventListener('pointerup', handlePointerUp); };
  }, [handlePointerMove, handlePointerUp]);

  const getAbsoluteBounds = (id: string) => {
    let el = elements.find(e => e.id === id); if (!el) return null;
    let { x, y, width, height } = el;
    if (el.parentId) { const parent = elements.find(e => e.id === el?.parentId); if (parent) { x += parent.x + 16; y += parent.y + 45 + 16; } }
    return { x, y, width, height };
  };

  const getPathData = (startX: number, startY: number, startPort: string, endX: number, endY: number, endPort: string) => {
    const controlDist = 60;
    let cx1 = startX, cy1 = startY, cx2 = endX, cy2 = endY;
    if (startPort === 'top') cy1 -= controlDist; else if (startPort === 'bottom') cy1 += controlDist; else if (startPort === 'left') cx1 -= controlDist; else cx1 += controlDist;
    if (endPort === 'top') cy2 -= controlDist; else if (endPort === 'bottom') cy2 += controlDist; else if (endPort === 'left') cx2 -= controlDist; else cx2 += controlDist;
    return `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
  };

  const getPortCoords = (bounds: any, port: string) => {
    let x = bounds.x + bounds.width / 2, y = bounds.y + bounds.height / 2;
    if (port === 'top') y = bounds.y; else if (port === 'bottom') y = bounds.y + bounds.height; else if (port === 'left') x = bounds.x; else if (port === 'right') x = bounds.x + bounds.width;
    return { x, y };
  };

  const baseGridSize = 24;
  let currentGridSize = baseGridSize * scale;
  while (currentGridSize < 15) currentGridSize *= 2;
  while (currentGridSize > 60) currentGridSize /= 2;

  return (
    <div className="canvas-container" onContextMenu={handleContextMenu}>
      <div 
        className={`canvas ${isSpaceDown ? 'space-down' : ''} ${isPanning ? 'panning' : ''} ${isBrushMode ? 'brush-cursor' : ''}`}
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        style={{ backgroundPosition: `${pan.x}px ${pan.y}px`, backgroundSize: `${currentGridSize}px ${currentGridSize}px` }}
      >
        <div className="canvas-content" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: '0 0', width: '100%', height: '100%', position: 'absolute' }}>
          
          <svg className="connections-layer" style={{ overflow: 'visible', zIndex: 1, position: 'absolute' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6c6d80" />
              </marker>
              <marker id="arrow-selected" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4caf50" />
              </marker>
            </defs>
            {connections.map(conn => {
              const f = elements.find(el => el.id === conn.fromId);
              const t = elements.find(el => el.id === conn.toId);
              if (!f || !t || f.isHidden || t.isHidden) return null;

              const fb = getAbsoluteBounds(conn.fromId), tb = getAbsoluteBounds(conn.toId); 
              if (!fb || !tb) return null;
              const { x: sx, y: sy } = getPortCoords(fb, conn.fromPort), { x: ex, y: ey } = getPortCoords(tb, conn.toPort);
              const pathData = getPathData(sx, sy, conn.fromPort, ex, ey, conn.toPort);
              const midX = 0.125 * sx + 0.375 * (conn.fromPort === 'left' ? sx - 60 : conn.fromPort === 'right' ? sx + 60 : sx) + 0.375 * (conn.toPort === 'left' ? ex - 60 : conn.toPort === 'right' ? ex + 60 : ex) + 0.125 * ex;
              const midY = 0.125 * sy + 0.375 * (conn.fromPort === 'top' ? sy - 60 : conn.fromPort === 'bottom' ? sy + 60 : sy) + 0.375 * (conn.toPort === 'top' ? ey - 60 : conn.toPort === 'bottom' ? ey + 60 : ey) + 0.125 * ey;
              const markerStart = conn.startArrow === 'arrow' ? (selectedConnectionId === conn.id ? "url(#arrow-selected)" : "url(#arrow)") : "none";
              const markerEnd = conn.endArrow === 'arrow' ? (selectedConnectionId === conn.id ? "url(#arrow-selected)" : "url(#arrow)") : "none";

              return (
                <g key={conn.id} className={`connection-group ${selectedConnectionId === conn.id ? 'selected' : ''}`} onPointerDown={(e) => { e.stopPropagation(); selectConnection(conn.id); }}>
                  <path id={`editor-conn-${conn.id}`} d={pathData} className="connection-path" markerStart={markerStart} markerEnd={markerEnd} />
                  <path d={pathData} stroke="transparent" strokeWidth="20" fill="none" />
                  
                  {conn.label && (
                    conn.labelAlignment === 'follow' ? (
                      <text fill="#e0e0e0" fontSize="14" dy="-5" pointerEvents="none" fontWeight="bold">
                        <textPath href={`#editor-conn-${conn.id}`} startOffset="50%" text-anchor="middle">{conn.label}</textPath>
                      </text>
                    ) : (
                      <text x={midX} y={midY} fill="#e0e0e0" fontSize="14" textAnchor="middle" dominantBaseline="middle" pointerEvents="none" fontWeight="bold" paintOrder="stroke fill" stroke="#17181f" strokeWidth="4px">
                        {conn.label}
                      </text>
                    )
                  )}
                </g>
              );
            })}
            {connectingNode && <path d={getPathData(getPortCoords(getAbsoluteBounds(connectingNode.id), connectingNode.port).x, getPortCoords(getAbsoluteBounds(connectingNode.id), connectingNode.port).y, connectingNode.port, mousePos.x, mousePos.y, 'left')} fill="none" stroke="#4caf50" strokeWidth="2" strokeDasharray="5,5" />}
          </svg>

          {elements.filter(el => !el.parentId).map(el => (
            <ElementWrapper key={el.id} element={el} />
          ))}

          <svg className="brush-layer" style={{ overflow: 'visible', position: 'absolute', zIndex: 1000, pointerEvents: 'none' }}>
            {brushStrokes.map(s => <path key={s.id} d={s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" />)}
            {currentStroke && <path d={currentStroke.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} fill="none" stroke={brushColor} strokeWidth={brushWidth} strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />}
          </svg>

          {selectionBox && (
            <div style={{ position: 'absolute', left: Math.min(selectionBox.x1, selectionBox.x2), top: Math.min(selectionBox.y1, selectionBox.y2), width: Math.abs(selectionBox.x2 - selectionBox.x1), height: Math.abs(selectionBox.y2 - selectionBox.y1), backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4caf50', pointerEvents: 'none', zIndex: 2000 }} />
          )}
        </div>
      </div>

      <div className="brush-toolbar" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', background: '#242533', padding: '10px', borderRadius: '12px', border: '1px solid #3a3c50', zIndex: 1000, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
        <button className={`btn ${isBrushMode ? 'primary' : ''}`} onClick={() => setBrushMode(!isBrushMode)} title="Brush Tool (B)"><Pencil size={18} /></button>
        <button className="btn" onClick={clearBrush} title="Clear Drawings (Shift+X)"><Eraser size={18} /></button>
        <div style={{ width: '1px', background: '#3a3c50', margin: '0 5px' }} />
        <button className="btn" onClick={undo} title="Undo (Ctrl+Z)"><RotateCcw size={18} /></button>
        <button className="btn" onClick={redo} title="Redo (Ctrl+Shift+Z)"><RotateCw size={18} /></button>
        <div className="color-picker-wrapper">
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
        </div>
      </div>

      {contextMenu && (
        <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }}>
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('node')}><Layout size={14} /> Add Node</div>
          <div className="context-menu-separator" />
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('text')}><Type size={14} /> Add Text</div>
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('button')}><MousePointer2 size={14} /> Add Button</div>
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('image')}><ImageIcon size={14} /> Add Image</div>
          <div className="context-menu-item" onClick={() => handleAddElementFromMenu('video')}><Play size={14} /> Add Video</div>
          {selectedIds.length > 0 && (
            <>
              <div className="context-menu-separator" />
              <div className="context-menu-item" onClick={duplicateSelected}><Copy size={14} /> Duplicate Selected</div>
              <div className="context-menu-item" onClick={removeSelected} style={{ color: '#ef5350' }}><Trash2 size={14} /> Delete Selected</div>
            </>
          )}
        </div>
      )}

      <div className="zoom-controls">
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={zoomToFit} className="btn-fit">Fit in view</button>
      </div>
    </div>
  );
};
