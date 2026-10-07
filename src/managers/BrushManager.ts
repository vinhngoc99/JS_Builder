// =============================================================================
// BrushManager — freehand brush strokes: add, erase, clear, and tool settings.
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { BrushStroke } from '../types';
import { GeometryService } from '../services/GeometryService';
import { BrushGeometry } from '../workspace/BrushGeometry';
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
    this.d.setBrushStrokes(strokes => BrushGeometry.erase(strokes, currentPos, lastPos, radius, uuidv4));
  };
}
