// =============================================================================
// GuideManager — canvas alignment guides (persisted immediately).
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { storage } from '../services/StorageService';
import { BuilderDeps } from './BuilderDeps';

export class GuideManager {
  constructor(private d: BuilderDeps) {}

  addGuide = (type: 'horizontal' | 'vertical', position: number, id?: string): void => {
    this.d.setGuides(prev => {
      const next = [...prev, { id: id || uuidv4(), type, position }];
      storage.saveGuides(next);
      return next;
    });
  };

  updateGuide = (id: string, position: number): void => {
    this.d.setGuides(prev => {
      const next = prev.map(g => g.id === id ? { ...g, position } : g);
      storage.saveGuides(next);
      return next;
    });
  };

  removeGuide = (id: string): void => {
    this.d.setGuides(prev => {
      const next = prev.filter(g => g.id !== id);
      storage.saveGuides(next);
      return next;
    });
  };
}
