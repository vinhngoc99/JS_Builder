import React, { useRef, useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useBuilder, getAdaptedTextColor, getAdaptedBorderColor, getAdaptedBgColor } from '../BuilderContext';
import { CanvasElement, PortPosition } from '../types';

interface ElementWrapperProps {
  element: CanvasElement;
}

export const ElementWrapper: React.FC<ElementWrapperProps> = ({ element }) => {
  const { 
    elements, selectedIds, selectElement, updateElement, setConnectingNode, connectingNode, 
    addConnection, scale, editingFocalPointId, setEditingFocalPointId, saveHistory, isSnapEnabled, guides,
    isPresenting, currentSlideIndex, setCurrentSlideIndex, revealDownstream
  } = useBuilder();
  const isSelected = selectedIds.includes(element.id);
  const isEditingFocalPoint = editingFocalPointId === element.id;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  
  const startPos = useRef({ x: 0, y: 0 });
  const startElement = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const startPositions = useRef<{ id: string, x: number, y: number }[]>([]);
  const startBox = useRef<{ x: number, y: number, w: number, h: number } | null>(null);
  const startElementsRelative = useRef<{ id: string, relX: number, relY: number, relW: number, relH: number }[]>([]);
  const startRotations = useRef<{ id: string, rotation: number }[]>([]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPresenting) return;
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
      .filter(el => !el.parentId || !currentSelected.includes(el.parentId))
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
    
    const currentSelected = selectedIds.includes(element.id) ? selectedIds : [...selectedIds, element.id];
    const selectedElements = elements.filter(el => currentSelected.includes(el.id));
    const minX = Math.min(...selectedElements.map(el => el.x));
    const minY = Math.min(...selectedElements.map(el => el.y));
    const maxX = Math.max(...selectedElements.map(el => el.x + el.width));
    const maxY = Math.max(...selectedElements.map(el => el.y + el.height));
    const boxW = maxX - minX;
    const boxH = maxY - minY;
    
    startBox.current = { x: minX, y: minY, w: boxW, h: boxH };
    startElementsRelative.current = selectedElements.map(el => ({
      id: el.id,
      relX: boxW > 0 ? (el.x - minX) / boxW : 0,
      relY: boxH > 0 ? (el.y - minY) / boxH : 0,
      relW: boxW > 0 ? el.width / boxW : 1,
      relH: boxH > 0 ? el.height / boxH : 1
    }));

    startPos.current = { x: e.clientX, y: e.clientY };
    startElement.current = { x: element.x, y: element.y, w: element.width, h: element.height };
    setIsResizing(handle);
  };

  const handleRotateStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!isSelected) selectElement(element.id);
    
    const currentSelected = selectedIds.includes(element.id) ? selectedIds : [...selectedIds, element.id];
    startRotations.current = elements
      .filter(el => currentSelected.includes(el.id))
      .map(el => ({ id: el.id, rotation: el.rotation || 0 }));

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
        deg = Math.round(deg);
        
        const primaryStartRot = startRotations.current.find(r => r.id === element.id)?.rotation || 0;
        const deltaRot = deg - primaryStartRot;

        startRotations.current.forEach(r => {
          updateElement(r.id, { rotation: (r.rotation + deltaRot) % 360 });
        });
        return;
      }
      
      const dx = (e.clientX - startPos.current.x) / scale;
      const dy = (e.clientY - startPos.current.y) / scale;

      if (isDragging) {
        let snapX: number | null = null;
        let snapY: number | null = null;
        let finalDx = dx;
        let finalDy = dy;

        if (isSnapEnabled && !e.shiftKey) {
          const rawX = startElement.current.x + dx;
          const rawY = startElement.current.y + dy;
          const w = element.width;
          const h = element.height;

          const snapXCandidates: { val: number; diff: number }[] = [];
          const snapYCandidates: { val: number; diff: number }[] = [];

          elements.forEach(other => {
            if (selectedIds.includes(other.id) || other.parentId === element.id || other.id === element.id) return;
            const ox = other.x;
            const oy = other.y;
            const ow = other.width;
            const oh = other.height;

            [ox, ox + ow / 2, ox + ow].forEach(targetX => {
              [rawX, rawX + w / 2, rawX + w].forEach(sourceX => {
                const diff = targetX - sourceX;
                if (Math.abs(diff) < 8) {
                  const offset = sourceX - rawX;
                  snapXCandidates.push({ val: targetX - offset, diff: Math.abs(diff) });
                }
              });
            });

            [oy, oy + oh / 2, oy + oh].forEach(targetY => {
              [rawY, rawY + h / 2, rawY + h].forEach(sourceY => {
                const diff = targetY - sourceY;
                if (Math.abs(diff) < 8) {
                  const offset = sourceY - rawY;
                  snapYCandidates.push({ val: targetY - offset, diff: Math.abs(diff) });
                }
              });
            });
          });

          guides.forEach(guide => {
            if (guide.type === 'vertical') {
              [rawX, rawX + w / 2, rawX + w].forEach(sourceX => {
                const diff = guide.position - sourceX;
                if (Math.abs(diff) < 8) {
                  const offset = sourceX - rawX;
                  snapXCandidates.push({ val: guide.position - offset, diff: Math.abs(diff) });
                }
              });
            } else {
              [rawY, rawY + h / 2, rawY + h].forEach(sourceY => {
                const diff = guide.position - sourceY;
                if (Math.abs(diff) < 8) {
                  const offset = sourceY - rawY;
                  snapYCandidates.push({ val: guide.position - offset, diff: Math.abs(diff) });
                }
              });
            }
          });

          if (snapXCandidates.length > 0) {
            snapXCandidates.sort((a, b) => a.diff - b.diff);
            const bestSnapX = snapXCandidates[0].val;
            finalDx = bestSnapX - startElement.current.x;
            snapX = bestSnapX;
          }
          if (snapYCandidates.length > 0) {
            snapYCandidates.sort((a, b) => a.diff - b.diff);
            const bestSnapY = snapYCandidates[0].val;
            finalDy = bestSnapY - startElement.current.y;
            snapY = bestSnapY;
          }
        }

        const setSnapGuides = (window as any).setSnapGuides;
        if (setSnapGuides) {
          let guideLineX: number | null = null;
          let guideLineY: number | null = null;
          const w = element.width;
          const h = element.height;

          if (snapX !== null) {
            const targetCoordsX = [
              ...elements.filter(o => !selectedIds.includes(o.id) && o.parentId !== element.id && o.id !== element.id).flatMap(o => [o.x, o.x + o.width/2, o.x + o.width]),
              ...guides.filter(g => g.type === 'vertical').map(g => g.position)
            ];
            const closestX = targetCoordsX.find(tx => Math.abs(tx - (snapX! + w/2)) < 2 || Math.abs(tx - snapX!) < 2 || Math.abs(tx - (snapX! + w)) < 2);
            if (closestX !== undefined) guideLineX = closestX;
          }
          if (snapY !== null) {
            const targetCoordsY = [
              ...elements.filter(o => !selectedIds.includes(o.id) && o.parentId !== element.id && o.id !== element.id).flatMap(o => [o.y, o.y + o.height/2, o.y + o.height]),
              ...guides.filter(g => g.type === 'horizontal').map(g => g.position)
            ];
            const closestY = targetCoordsY.find(ty => Math.abs(ty - (snapY! + h/2)) < 2 || Math.abs(ty - snapY!) < 2 || Math.abs(ty - (snapY! + h)) < 2);
            if (closestY !== undefined) guideLineY = closestY;
          }
          setSnapGuides({ x: guideLineX, y: guideLineY });
        }

        startPositions.current.forEach(pos => { updateElement(pos.id, { x: pos.x + finalDx, y: pos.y + finalDy }); });
      } else if (isResizing && startBox.current) {
        let finalDx = dx;
        let finalDy = dy;
        let snapX: number | null = null;
        let snapY: number | null = null;

        if (isSnapEnabled && !e.shiftKey && !e.altKey) {
          const snapXCandidates: { val: number; diff: number }[] = [];
          const snapYCandidates: { val: number; diff: number }[] = [];

          elements.forEach(other => {
            if (selectedIds.includes(other.id) || other.parentId === element.id || other.id === element.id) return;
            const ox = other.x;
            const oy = other.y;
            const ow = other.width;
            const oh = other.height;

            const otherEdgesX = [ox, ox + ow / 2, ox + ow];
            const otherEdgesY = [oy, oy + oh / 2, oy + oh];

            if (isResizing.includes('e')) {
              const rawRight = startElement.current.x + startElement.current.w + dx;
              otherEdgesX.forEach(tx => {
                const diff = tx - rawRight;
                if (Math.abs(diff) < 8) snapXCandidates.push({ val: tx, diff: Math.abs(diff) });
              });
            } else if (isResizing.includes('w')) {
              const rawLeft = startElement.current.x + dx;
              otherEdgesX.forEach(tx => {
                const diff = tx - rawLeft;
                if (Math.abs(diff) < 8) snapXCandidates.push({ val: tx, diff: Math.abs(diff) });
              });
            }

            if (isResizing.includes('s')) {
              const rawBottom = startElement.current.y + startElement.current.h + dy;
              otherEdgesY.forEach(ty => {
                const diff = ty - rawBottom;
                if (Math.abs(diff) < 8) snapYCandidates.push({ val: ty, diff: Math.abs(diff) });
              });
            } else if (isResizing.includes('n')) {
              const rawTop = startElement.current.y + dy;
              otherEdgesY.forEach(ty => {
                const diff = ty - rawTop;
                if (Math.abs(diff) < 8) snapYCandidates.push({ val: ty, diff: Math.abs(diff) });
              });
            }
          });

          guides.forEach(guide => {
            if (guide.type === 'vertical') {
              if (isResizing.includes('e')) {
                const rawRight = startElement.current.x + startElement.current.w + dx;
                const diff = guide.position - rawRight;
                if (Math.abs(diff) < 8) snapXCandidates.push({ val: guide.position, diff: Math.abs(diff) });
              } else if (isResizing.includes('w')) {
                const rawLeft = startElement.current.x + dx;
                const diff = guide.position - rawLeft;
                if (Math.abs(diff) < 8) snapXCandidates.push({ val: guide.position, diff: Math.abs(diff) });
              }
            } else {
              if (isResizing.includes('s')) {
                const rawBottom = startElement.current.y + startElement.current.h + dy;
                const diff = guide.position - rawBottom;
                if (Math.abs(diff) < 8) snapYCandidates.push({ val: guide.position, diff: Math.abs(diff) });
              } else if (isResizing.includes('n')) {
                const rawTop = startElement.current.y + dy;
                const diff = guide.position - rawTop;
                if (Math.abs(diff) < 8) snapYCandidates.push({ val: guide.position, diff: Math.abs(diff) });
              }
            }
          });

          if (snapXCandidates.length > 0) {
            snapXCandidates.sort((a, b) => a.diff - b.diff);
            snapX = snapXCandidates[0].val;
            if (isResizing.includes('e')) {
              finalDx = snapX - (startElement.current.x + startElement.current.w);
            } else if (isResizing.includes('w')) {
              finalDx = snapX - startElement.current.x;
            }
          }
          if (snapYCandidates.length > 0) {
            snapYCandidates.sort((a, b) => a.diff - b.diff);
            snapY = snapYCandidates[0].val;
            if (isResizing.includes('s')) {
              finalDy = snapY - (startElement.current.y + startElement.current.h);
            } else if (isResizing.includes('n')) {
              finalDy = snapY - startElement.current.y;
            }
          }
        }

        const setSnapGuides = (window as any).setSnapGuides;
        if (setSnapGuides) {
          setSnapGuides({ x: snapX, y: snapY });
        }

        const ratio = startElement.current.w / startElement.current.h;
        let newW = startElement.current.w;
        let newH = startElement.current.h;
        let newX = startElement.current.x;
        let newY = startElement.current.y;

        if (e.altKey) {
          const dragX = isResizing.includes('w') ? -finalDx : finalDx;
          const dragY = isResizing.includes('n') ? -finalDy : finalDy;
          if (Math.abs(dragX) > Math.abs(dragY)) {
            newW = startElement.current.w + dragX;
            newH = newW / ratio;
          } else {
            newH = startElement.current.h + dragY;
            newW = newH * ratio;
          }
        } else {
          if (isResizing.includes('w')) {
            newW = startElement.current.w - finalDx;
          } else if (isResizing.includes('e')) {
            newW = startElement.current.w + finalDx;
          }
          if (isResizing.includes('n')) {
            newH = startElement.current.h - finalDy;
          } else if (isResizing.includes('s')) {
            newH = startElement.current.h + finalDy;
          }
        }

        if (isResizing.includes('w')) {
          newX = startElement.current.x + (startElement.current.w - newW);
        }
        if (isResizing.includes('n')) {
          newY = startElement.current.y + (startElement.current.h - newH);
        }

        if (newW >= 2 && newH >= 2) {
          const scaleW = newW / startElement.current.w;
          const scaleH = newH / startElement.current.h;
          const box = startBox.current;
          let newBoxW = box.w * scaleW;
          let newBoxH = box.h * scaleH;
          let newBoxX = box.x;
          let newBoxY = box.y;

          if (isResizing.includes('w')) {
            newBoxX = box.x + box.w - newBoxW;
          }
          if (isResizing.includes('n')) {
            newBoxY = box.y + box.h - newBoxH;
          }

          startElementsRelative.current.forEach(item => {
            updateElement(item.id, {
              x: newBoxX + item.relX * newBoxW,
              y: newBoxY + item.relY * newBoxH,
              width: Math.max(2, item.relW * newBoxW),
              height: Math.max(2, item.relH * newBoxH)
            });
          });
        }
      }
    };
    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging && !isResizing && !isRotating) return;
      
      const setSnapGuides = (window as any).setSnapGuides;
      if (setSnapGuides) setSnapGuides({ x: null, y: null });

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
        if (isEditingText) {
          return (
            <textarea
              value={element.text}
              autoFocus
              onChange={(e) => updateElement(element.id, { text: e.target.value })}
              onBlur={() => setIsEditingText(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  setIsEditingText(false);
                }
              }}
              style={{
                color: getAdaptedTextColor(element.color),
                fontSize: `${element.fontSize}px`,
                fontFamily: element.fontFamily,
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid #4caf50',
                borderRadius: `${element.borderRadius}px`,
                width: '100%',
                height: '100%',
                textAlign: 'center',
                resize: 'none',
                boxSizing: 'border-box',
                outline: 'none',
                padding: '8px'
              }}
              onFocus={(e) => e.target.select()}
            />
          );
        }
        return <div onDoubleClick={() => setIsEditingText(true)} style={{ color: getAdaptedTextColor(element.color), fontSize: element.fontSize, fontFamily: element.fontFamily, backgroundColor: element.backgroundColor, border: `${element.borderWidth}px solid ${getAdaptedBorderColor(element.borderColor)}`, borderRadius: element.borderRadius, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{element.text}</div>;
      case 'button':
        if (isEditingText) {
          return (
            <input
              type="text"
              value={element.text}
              autoFocus
              onChange={(e) => updateElement(element.id, { text: e.target.value })}
              onBlur={() => setIsEditingText(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingText(false);
                }
              }}
              style={{
                color: getAdaptedTextColor(element.color),
                fontSize: `${elAny.fontSize || 16}px`,
                fontFamily: element.fontFamily,
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid #4caf50',
                borderRadius: `${element.borderRadius}px`,
                width: '100%',
                height: '100%',
                textAlign: 'center',
                boxSizing: 'border-box',
                outline: 'none',
                fontWeight: 'bold'
              }}
              onFocus={(e) => e.target.select()}
            />
          );
        }
        return (
          <button 
            onDoubleClick={(e) => {
              if (isPresenting) return;
              setIsEditingText(true);
            }}
            onClick={(e) => {
              if (!isPresenting) return;
              e.stopPropagation();
              
              const action = element.actionType;
              const target = element.actionTarget;
              
              if (action === 'alert') {
                alert(target || 'Button clicked!');
              } else if (action === 'link') {
                if (element.link) {
                  window.open(element.link, '_blank', 'noopener,noreferrer');
                }
              } else if (action === 'toggleDisabled') {
                if (target) {
                  const targetEl = elements.find(el => el.id === target);
                  if (targetEl) {
                    updateElement(target, { isDisabled: !targetEl.isDisabled });
                  }
                }
              } else if (action === 'toggleVisibility') {
                if (target) {
                  const targetEl = elements.find(el => el.id === target);
                  if (targetEl) {
                    updateElement(target, { isHidden: !targetEl.isHidden });
                  }
                }
              } else if (action === 'triggerFlow') {
                if (target) {
                  revealDownstream(target);
                }
              } else if (action === 'nextSlide') {
                const slides = elements.filter(el => el.type === 'node').sort((a, b) => a.x - b.x);
                if (currentSlideIndex < slides.length - 1) {
                  setCurrentSlideIndex(currentSlideIndex + 1);
                }
              } else if (action === 'prevSlide') {
                if (currentSlideIndex > 0) {
                  setCurrentSlideIndex(currentSlideIndex - 1);
                }
              } else if (action === 'goToSlide') {
                if (target) {
                  const slides = elements.filter(el => el.type === 'node').sort((a, b) => a.x - b.x);
                  const targetIdx = slides.findIndex(s => s.id === target);
                  if (targetIdx !== -1) {
                    setCurrentSlideIndex(targetIdx);
                  }
                }
              }
            }}
            disabled={element.isDisabled}
            style={{ 
              backgroundColor: element.backgroundColor, 
              color: getAdaptedTextColor(element.color), 
              fontFamily: element.fontFamily, 
              fontSize: `${elAny.fontSize || 16}px`, 
              borderRadius: `${element.borderRadius}px`, 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold',
              border: 'none',
              cursor: isPresenting ? 'pointer' : 'default',
              pointerEvents: 'auto',
              transition: 'opacity 0.2s, transform 0.1s'
            }}
          >
            {element.text}
          </button>
        );
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
      case 'shape': {
        const shapeText = elAny.text || '';
        let shapeTextOverlay = null;

        if (isEditingText) {
          shapeTextOverlay = (
            <textarea
              value={shapeText}
              autoFocus
              onChange={(e) => updateElement(element.id, { text: e.target.value })}
              onBlur={() => setIsEditingText(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  setIsEditingText(false);
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                color: getAdaptedTextColor(elAny.color),
                fontSize: `${elAny.fontSize || 14}px`,
                fontFamily: elAny.fontFamily || 'sans-serif',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid #4caf50',
                borderRadius: `${element.borderRadius || 0}px`,
                textAlign: 'center',
                resize: 'none',
                boxSizing: 'border-box',
                outline: 'none',
                padding: '8px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onFocus={(e) => e.target.select()}
            />
          );
        } else if (shapeText) {
          shapeTextOverlay = (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: getAdaptedTextColor(elAny.color), fontSize: `${elAny.fontSize || 14}px`, fontFamily: elAny.fontFamily || 'sans-serif', pointerEvents: 'none', padding: '8px', boxSizing: 'border-box', textAlign: 'center', overflow: 'hidden', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {shapeText}
            </div>
          );
        }

        if (element.shapeType === 'line') {
          return (
            <div 
              style={{ position: 'relative', width: '100%', height: '100%' }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <line x1="0" y1="0" x2={element.width} y2={element.height} stroke={getAdaptedBorderColor(element.borderColor)} strokeWidth={element.borderWidth} />
              </svg>
              {shapeTextOverlay}
            </div>
          );
        }
        if (element.shapeType === 'arrow') {
          const markerId = `arrowhead-${element.id}`;
          return (
            <div 
              style={{ position: 'relative', width: '100%', height: '100%' }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <marker 
                    id={markerId} 
                    viewBox="0 0 10 10" 
                    refX="6" 
                    refY="5" 
                    markerWidth="8" 
                    markerHeight="8" 
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill={getAdaptedBorderColor(element.borderColor)} />
                  </marker>
                </defs>
                <line 
                  x1="0" 
                  y1="0" 
                  x2={element.width} 
                  y2={element.height} 
                  stroke={getAdaptedBorderColor(element.borderColor)} 
                  strokeWidth={element.borderWidth} 
                  markerEnd={`url(#${markerId})`} 
                />
              </svg>
              {shapeTextOverlay}
            </div>
          );
        }
        if (element.shapeType === 'elbow') {
          const halfWidth = element.width / 2;
          const d = `M 0 0 L ${halfWidth} 0 L ${halfWidth} ${element.height} L ${element.width} ${element.height}`;
          return (
            <div 
              style={{ position: 'relative', width: '100%', height: '100%' }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <path d={d} fill="none" stroke={getAdaptedBorderColor(element.borderColor)} strokeWidth={element.borderWidth} />
              </svg>
              {shapeTextOverlay}
            </div>
          );
        }

        if (element.shapeType === 'rectangle') {
          return (
            <div 
              style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: element.backgroundColor, border: `${element.borderWidth}px solid ${getAdaptedBorderColor(element.borderColor)}`, borderRadius: element.borderRadius }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              {shapeTextOverlay}
            </div>
          );
        }
        if (element.shapeType === 'ellipse') {
          return (
            <div 
              style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: element.backgroundColor, border: `${element.borderWidth}px solid ${getAdaptedBorderColor(element.borderColor)}`, borderRadius: '50%' }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              {shapeTextOverlay}
            </div>
          );
        }

        const ptsMap = {
          triangle: "50,0 100,100 0,100",
          rightTriangle: "0,0 100,100 0,100",
          diamond: "50,0 100,50 50,100 0,50",
          pentagon: "50,0 100,38 82,100 18,100 0,38",
          hexagon: "50,0 100,25 100,75 50,100 0,75 0,25",
          parallelogram: "25,0 100,0 75,100 0,100",
          trapezoid: "20,0 80,0 100,100 0,100",
          star: "50,0 63,38 100,38 69,59 82,100 50,75 18,100 31,59 0,38 37,38",
          arrowRight: "0,30 60,30 60,10 100,50 60,90 60,70 0,70",
          arrowLeft: "100,30 40,30 40,10 0,50 40,90 40,70 100,70",
          arrowUp: "30,100 30,40 10,40 50,0 90,40 70,40 70,100",
          arrowDown: "30,0 30,60 10,60 50,100 90,60 70,60 70,0"
        };
        const shapePts = (ptsMap as any)[element.shapeType] || ptsMap.triangle;

        return (
          <div 
            style={{ position: 'relative', width: '100%', height: '100%' }}
            onDoubleClick={() => setIsEditingText(true)}
          >
            <svg width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <polygon points={shapePts} fill={element.backgroundColor} stroke={getAdaptedBorderColor(element.borderColor)} strokeWidth={element.borderWidth} vectorEffect="non-scaling-stroke" />
            </svg>
            {shapeTextOverlay}
          </div>
        );
      }
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
      style={{ left: isFillParent ? 0 : element.x, top: isFillParent ? 0 : element.y, width: isFillParent ? '100%' : element.width, height: isFillParent ? '100%' : element.height, transform: isFillParent ? 'none' : `rotate(${element.rotation || 0}deg)`, backgroundColor: element.type === 'node' ? getAdaptedBgColor('node', element.backgroundColor) : undefined }}
      onPointerDown={handlePointerDown}
    >
      {element.type === 'node' && (
        <div className="element-header" style={{ fontFamily: element.fontFamily, fontSize: `${elAny.fontSize || 14}px` }}>
          <Settings size={16} color="#8c8d9c" />
          {isEditingText ? (
            <input
              type="text"
              value={element.title || ''}
              autoFocus
              onChange={(e) => updateElement(element.id, { title: e.target.value })}
              onBlur={() => setIsEditingText(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingText(false);
                }
              }}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid #4caf50',
                color: getAdaptedTextColor(element.color),
                outline: 'none',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
              onFocus={(e) => e.target.select()}
            />
          ) : (
            <span 
              style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: getAdaptedTextColor(element.color) }}
              onDoubleClick={() => setIsEditingText(true)}
            >
              {element.title || 'NODE'}
            </span>
          )}
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
