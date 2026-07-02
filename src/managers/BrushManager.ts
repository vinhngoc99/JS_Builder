// =============================================================================
// BrushManager — freehand brush strokes: add, erase, clear, and tool settings.
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { BrushStroke } from '../types';
import { GeometryService } from '../services/GeometryService';
import { getDistanceToSegment } from '../services/dom-utils';
import { BuilderDeps } from './BuilderDeps';

export class BrushManager {
  constructor(private d: BuilderDeps) {}

  addBrushStroke = (stroke: BrushStroke): void => {
    const { saveHistory, elementsRef, setBrushStrokes } = this.d;
    saveHistory();
    const attachedNodeId = GeometryService.findBrushAttachmentElementId(stroke.points, elementsRef.current);
    const updatedStroke = { ...stroke, attachedNodeId };
    setBrushStrokes(prev => [...prev, updatedStroke]);
  };

  clearBrush = (): void => {
    this.d.saveHistory();
    this.d.setBrushStrokes([]);
  };

  setBrushMode = (enabled: boolean): void => {
    const { setIsBrushMode, setSelectedIds, setSelectedConnectionId } = this.d;
    setIsBrushMode(enabled);
    if (enabled) {
      setSelectedIds([]);
      setSelectedConnectionId(null);
    }
  };

  setBrushColor = (color: string): void => this.d.setBrushColorVal(color);

  setBrushWidth = (width: number): void => this.d.setBrushWidthVal(width);

  eraseBrushStrokesAt = (
    currentPos: { x: number; y: number },
    lastPos: { x: number; y: number } | null,
    radius: number
  ): void => {
    this.d.setBrushStrokes(prevStrokes => {
      let changed = false;
      const newStrokes: BrushStroke[] = [];
      for (const stroke of prevStrokes) {
        let currentPoints: { x: number; y: number }[] = [];
        for (const p of stroke.points) {
          const dist = lastPos
            ? getDistanceToSegment(p, lastPos, currentPos)
            : Math.hypot(p.x - currentPos.x, p.y - currentPos.y);

          const threshold = radius + stroke.width / 2;
          if (dist <= threshold) {
            if (currentPoints.length > 1) {
              newStrokes.push({
                id: uuidv4(),
                points: currentPoints,
                color: stroke.color,
                width: stroke.width,
                attachedNodeId: stroke.attachedNodeId
              });
            }
            currentPoints = [];
            changed = true;
          } else {
            currentPoints.push(p);
          }
        }
        if (currentPoints.length > 1) {
          newStrokes.push({
            id: stroke.id,
            points: currentPoints,
            color: stroke.color,
            width: stroke.width,
            attachedNodeId: stroke.attachedNodeId
          });
        }
      }
      if (changed) {
        return newStrokes;
      }
      return prevStrokes;
    });
  };
}
