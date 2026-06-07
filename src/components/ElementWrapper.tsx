import React, { useRef, useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useBuilder } from '../BuilderContext';
import { CanvasElement, PortPosition } from '../types';

interface ElementWrapperProps {
  element: CanvasElement;
}

export const ElementWrapper: React.FC<ElementWrapperProps> = ({ element }) => {
  const { elements, selectedIds, selectElement, updateElement, setConnectingNode, connectingNode, addConnection, scale, editingFocalPointId, setEditingFocalPointId, saveHistory } = useBuilder();
  const isSelected = selectedIds.includes(element.id);
  const isEditingFocalPoint = editingFocalPointId === element.id;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  
  const startPos = useRef({ x: 0, y: 0 });
  const startElement = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const startPositions = useRef<{ id: string, x: number, y: number }[]>([]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isEditingFocalPoint) return;
    e.stopPropagation();
    
    const isMulti = e.shiftKey;
    if (!isSelected && !isMulti) {
      selectElement(element.id, false);
    } else if (isMulti) {
      selectElement(element.id, true);
    }

    startPos.current = { x: e.clientX, y: e.clientY };
    
    const currentSelected = !isSelected && !isMulti ? [element.id] : (isSelected ? selectedIds : [...selectedIds, element.id]);
    startPositions.current = elements
      .filter(el => currentSelected.includes(el.id))
      .map(el => ({ id: el.id, x: el.x, y: el.y }));

    startElement.current = { x: element.x, y: element.y, w: element.width, h: element.height };
    setIsDragging(true);
  };

  const handleFocalPointPointerDown = (e: React.PointerEvent) => {
    if (!isEditingFocalPoint || !contentRef.current) return;
    e.stopPropagation();
    const initialPos = { x: e.clientX, y: e.clientY };
    const elAny = element as any;
    const currentObjPos = elAny.objectPosition || '50% 50%';
    const [startX, startY] = currentObjPos.split(' ').map((p: string) => parseFloat(p));
    const handleMove = (moveEvent: PointerEvent) => {
      const rect = contentRef.current!.getBoundingClientRect();
      const dx = ((moveEvent.clientX - initialPos.x) / rect.width) * 100;
      const dy = ((moveEvent.clientY - initialPos.y) / rect.height) * 100;
      let nextX = startX - dx, nextY = startY - dy;
      nextX = Math.max(0, Math.min(100, nextX)); nextY = Math.max(0, Math.min(100, nextY));
      updateElement(element.id, { objectPosition: `${Math.round(nextX)}% ${Math.round(nextY)}%` } as any);
    };
    const handleUp = () => { window.removeEventListener('pointermove', handleMove); window.removeEventListener('pointerup', handleUp); };
    window.addEventListener('pointermove', handleMove); window.addEventListener('pointerup', handleUp);
  };

  const handleResizeStart = (e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    if (!isSelected) selectElement(element.id);
    startPos.current = { x: e.clientX, y: e.clientY };
    startElement.current = { x: element.x, y: element.y, w: element.width, h: element.height };
    setIsResizing(handle);
  };

  const handleRotateStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!isSelected) selectElement(element.id);
    setIsRotating(true);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging && !isResizing && !isRotating) return;
      if (isRotating && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2, centerY = rect.top + rect.height / 2;
        const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let deg = (rad * (180 / Math.PI)) + 90;
        if (deg < 0) deg += 360;
        updateElement(element.id, { rotation: Math.round(deg) });
        return;
      }
      const dx = (e.clientX - startPos.current.x) / scale;
      const dy = (e.clientY - startPos.current.y) / scale;
      if (isDragging) {
        startPositions.current.forEach(pos => { updateElement(pos.id, { x: pos.x + dx, y: pos.y + dy }); });
      } else if (isResizing) {
        let newX = startElement.current.x, newY = startElement.current.y, newW = startElement.current.w, newH = startElement.current.h;
        if (isResizing.includes('w')) { newX = startElement.current.x + dx; newW = startElement.current.w - dx; }
        if (isResizing.includes('e')) { newW = startElement.current.w + dx; }
        if (isResizing.includes('n')) { newY = startElement.current.y + dy; newH = startElement.current.h - dy; }
        if (isResizing.includes('s')) { newH = startElement.current.h + dy; }
        if (newW >= 2 && newH >= 2) { updateElement(element.id, { x: newX, y: newY, width: newW, height: newH }); }
      }
    };
    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging && !isResizing && !isRotating) return;
      
      const wasDragging = isDragging;
      setIsDragging(false); setIsResizing(null); setIsRotating(false);
      saveHistory();

      if (wasDragging && startPositions.current.length === 1) {
        // Parenting logic
        const wrapper = wrapperRef.current;
        if (wrapper) {
          // Avoid parenting logic if mouse hasn't moved much (simple click)
          const totalMove = Math.sqrt(Math.pow(e.clientX - startPos.current.x, 2) + Math.pow(e.clientY - startPos.current.y, 2));
          if (totalMove < 5) return;

          const oldPointerEvents = wrapper.style.pointerEvents;
          wrapper.style.pointerEvents = 'none';
          const target = document.elementFromPoint(e.clientX, e.clientY);
          wrapper.style.pointerEvents = oldPointerEvents;

          const nodeTarget = target?.closest('.is-node');
          const targetId = nodeTarget?.getAttribute('data-id');

          if (targetId && targetId !== element.id && element.type !== 'node') {
            // Already in this node?
            if (element.parentId === targetId) return;

            const parent = elements.find(el => el.id === targetId);
            if (parent) {
              // Convert current coordinates to ABSOLUTE first if they were relative
              let absX = element.x;
              let absY = element.y;
              if (element.parentId) {
                const oldParent = elements.find(el => el.id === element.parentId);
                if (oldParent) { absX += oldParent.x + 16; absY += oldParent.y + 45 + 16; }
              }
              
              // Now convert absolute to NEW relative
              updateElement(element.id, { 
                parentId: targetId, 
                x: absX - parent.x - 16, 
                y: absY - (parent.y + 45 + 16)
              });
            }
          } else if (!nodeTarget && element.parentId) {
            // Drop outside to root
            const oldParent = elements.find(el => el.id === element.parentId);
            if (oldParent) {
              updateElement(element.id, { 
                parentId: null, 
                x: element.x + oldParent.x + 16, 
                y: element.y + oldParent.y + 45 + 16 
              });
            }
          }
        }
      }
    };
    if (isDragging || isResizing || isRotating) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => { window.removeEventListener('pointermove', handlePointerMove); window.removeEventListener('pointerup', handlePointerUp); };
  }, [isDragging, isResizing, isRotating, element, elements, updateElement, scale, saveHistory]);

  const handlePortDown = (e: React.PointerEvent, port: PortPosition) => { e.stopPropagation(); setConnectingNode({ id: element.id, port }); };
  const handlePortUp = (e: React.PointerEvent, port: PortPosition) => {
    e.stopPropagation();
    if (connectingNode && connectingNode.id !== element.id) { addConnection(connectingNode.id, connectingNode.port, element.id, port); }
    setConnectingNode(null);
  };

  const renderContent = () => {
    const elAny = element as any;
    switch (element.type) {
      case 'text':
        return <div style={{ color: element.color, fontSize: element.fontSize, fontFamily: element.fontFamily, backgroundColor: element.backgroundColor, border: `${element.borderWidth}px solid ${element.borderColor}`, borderRadius: element.borderRadius, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{element.text}</div>;
      case 'button':
        return <div style={{ backgroundColor: element.backgroundColor, color: element.color, fontFamily: element.fontFamily, fontSize: `${elAny.fontSize || 16}px`, borderRadius: element.borderRadius, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{element.text}</div>;
      case 'image':
        const objPos = elAny.objectPosition || '50% 50%';
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {elAny.title && <div className="media-header" style={{ fontSize: `${elAny.fontSize || 11}px` }}>{elAny.title}</div>}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }} onPointerDown={handleFocalPointPointerDown}>
              <div className="media-settings-btn" onClick={(e) => { e.stopPropagation(); setEditingFocalPointId(isEditingFocalPoint ? null : element.id); }} title="Set Focal Point"><Settings size={14} /></div>
              {isEditingFocalPoint && (
                <div className="focal-point-overlay" style={{ cursor: 'move' }}>
                  <div className="focal-point-indicator" style={{ left: objPos.split(' ')[0], top: objPos.split(' ')[1] }} />
                  <div style={{ color: '#fff', fontSize: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', position: 'absolute', bottom: '10px' }}>Drag to pan image</div>
                </div>
              )}
              <img src={element.src} alt={element.alt} style={{ width: '100%', height: '100%', objectFit: element.objectFit, objectPosition: objPos, border: `${element.borderWidth}px solid ${element.borderColor}`, borderRadius: `${element.borderRadius}px`, boxSizing: 'border-box' }} draggable={false} />
            </div>
          </div>
        );
      case 'video':
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
             {elAny.title && <div className="media-header" style={{ fontSize: `${elAny.fontSize || 11}px` }}>{elAny.title}</div>}
             <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }} onPointerDown={handleFocalPointPointerDown}>
               <div className="media-settings-btn" style={{ pointerEvents: 'auto' }} onClick={(e) => { e.stopPropagation(); setEditingFocalPointId(isEditingFocalPoint ? null : element.id); }} title="Set Video Alignment"><Settings size={14} /></div>
               {isEditingFocalPoint && <div className="focal-point-overlay" style={{ cursor: 'move' }}><div style={{ color: '#fff', fontSize: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px' }}>Drag to align video</div></div>}
              <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}><iframe src={element.src} style={{ width: '100%', height: '100%', objectFit: 'cover', border: `${element.borderWidth}px solid ${element.borderColor}`, borderRadius: `${element.borderRadius}px`, boxSizing: 'border-box' }} frameBorder="0" allowFullScreen /></div>
             </div>
          </div>
        );
      case 'shape':
        if (element.shapeType === 'rectangle') return <div style={{ backgroundColor: element.backgroundColor, border: `${element.borderWidth}px solid ${element.borderColor}`, borderRadius: element.borderRadius, width: '100%', height: '100%' }} />;
        if (element.shapeType === 'ellipse') return <div style={{ backgroundColor: element.backgroundColor, border: `${element.borderWidth}px solid ${element.borderColor}`, borderRadius: '50%', width: '100%', height: '100%' }} />;
        const pts = element.shapeType === 'triangle' ? "50,0 100,100 0,100" : "50,0 100,50 50,100 0,50";
        return <svg width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}><polygon points={pts} fill={element.backgroundColor} stroke={element.borderColor} strokeWidth={element.borderWidth} vectorEffect="non-scaling-stroke" /></svg>;
      case 'node':
        return <>{elements.filter(el => el.parentId === element.id).map(child => <ElementWrapper key={child.id} element={child} />)}</>;
      default: return null;
    }
  };

  const isConnectingToThis = connectingNode && connectingNode.id !== element.id;
  const elAny = element as any;
  const isFillParent = elAny.parentId && elAny.fillParent;

  return (
    <div 
      ref={wrapperRef}
      className={`element-wrapper ${element.type === 'node' ? 'is-node' : ''} ${element.type === 'button' ? 'is-button' : ''} ${isSelected ? 'selected' : ''} ${isConnectingToThis ? 'connecting' : ''} ${element.isDisabled ? 'disabled' : ''} ${element.isHidden ? 'is-hidden' : ''}`}
      data-id={element.id}
      style={{ left: isFillParent ? 0 : element.x, top: isFillParent ? 0 : element.y, width: isFillParent ? '100%' : element.width, height: isFillParent ? '100%' : element.height, transform: isFillParent ? 'none' : `rotate(${element.rotation || 0}deg)` }}
      onPointerDown={handlePointerDown}
    >
      {element.type === 'node' && (
        <div className="element-header" style={{ fontFamily: element.fontFamily, fontSize: `${elAny.fontSize || 14}px` }}>
          <Settings size={16} color="#8c8d9c" />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{element.title || 'NODE'}</span>
        </div>
      )}
      <div ref={contentRef} className="element-content">{renderContent()}</div>
      {!element.parentId && !isEditingFocalPoint && (
        <>
          <div className="node-handle top" onPointerDown={(e) => handlePortDown(e, 'top')} onPointerUp={(e) => handlePortUp(e, 'top')} />
          <div className="node-handle right" onPointerDown={(e) => handlePortDown(e, 'right')} onPointerUp={(e) => handlePortUp(e, 'right')} />
          <div className="node-handle bottom" onPointerDown={(e) => handlePortDown(e, 'bottom')} onPointerUp={(e) => handlePortUp(e, 'bottom')} />
          <div className="node-handle left" onPointerDown={(e) => handlePortDown(e, 'left')} onPointerUp={(e) => handlePortUp(e, 'left')} />
        </>
      )}
      {isSelected && !isEditingFocalPoint && (
        <>
          <div className="rotate-handle" onPointerDown={handleRotateStart} onDoubleClick={(e) => { e.stopPropagation(); updateElement(element.id, { rotation: 0 }); }} title="Rotate Element (Double-click to reset)" />
          <div className="resize-handle nw" onPointerDown={(e) => handleResizeStart(e, 'nw')} /><div className="resize-handle ne" onPointerDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="resize-handle sw" onPointerDown={(e) => handleResizeStart(e, 'sw')} /><div className="resize-handle se" onPointerDown={(e) => handleResizeStart(e, 'se')} />
        </>
      )}
    </div>
  );
};
