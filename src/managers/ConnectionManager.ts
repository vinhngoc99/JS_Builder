// =============================================================================
// ConnectionManager — create/update/remove connections between elements.
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { Connection, PortPosition } from '../types';
import { BuilderDeps } from './BuilderDeps';

export class ConnectionManager {
  constructor(private d: BuilderDeps) {}

  addConnection = (fromId: string, fromPort: PortPosition, toId: string, toPort: PortPosition): void => {
    const { saveHistory, connectionsRef, setConnections } = this.d;
    saveHistory();
    if (fromId === toId) return;
    const exists = connectionsRef.current.find(
      c => c.fromId === fromId && c.toId === toId && c.fromPort === fromPort && c.toPort === toPort
    );
    if (!exists) {
      setConnections(prev => [...prev, { id: uuidv4(), fromId, toId, fromPort, toPort }]);
    }
  };

  removeConnection = (id: string): void => {
    const { saveHistory, setConnections, selectedConnectionId, setSelectedConnectionId } = this.d;
    saveHistory();
    setConnections(prev => prev.filter(c => c.id !== id));
    if (selectedConnectionId === id) setSelectedConnectionId(null);
  };

  updateConnection = (id: string, updates: Partial<Connection>): void => {
    const { setConnections } = this.d;
    setConnections(prev => prev.map(c => c.id === id ? { ...c, ...updates } as Connection : c));
  };
}
