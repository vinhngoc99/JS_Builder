import React from 'react';
import { useBuilder } from '../../BuilderContext';
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from 'lucide-react';

interface ArrangePanelProps {
  elementIds: string[];
}

export const ArrangePanel: React.FC<ArrangePanelProps> = ({ elementIds }) => {
  const {
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    alignElements,
    distributeElements,
  } = useBuilder();

  const handleArrange = (action: 'front' | 'back' | 'forward' | 'backward') => {
    elementIds.forEach((id) => {
      if (action === 'front') bringToFront(id);
      else if (action === 'back') sendToBack(id);
      else if (action === 'forward') bringForward(id);
      else if (action === 'backward') sendBackward(id);
    });
  };

  const isMultiSelect = elementIds.length > 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Layer Ordering (Z-Index) */}
      <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>
        Order Layer
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
        <button
          onClick={() => handleArrange('front')}
          className="btn"
          style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
          title="Bring to Front"
        >
          <ChevronsUp size={16} />
          <span style={{ fontSize: '9px' }}>Front</span>
        </button>
        <button
          onClick={() => handleArrange('forward')}
          className="btn"
          style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
          title="Bring Forward"
        >
          <ArrowUp size={16} />
          <span style={{ fontSize: '9px' }}>Forward</span>
        </button>
        <button
          onClick={() => handleArrange('backward')}
          className="btn"
          style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
          title="Send Backward"
        >
          <ArrowDown size={16} />
          <span style={{ fontSize: '9px' }}>Backwd</span>
        </button>
        <button
          onClick={() => handleArrange('back')}
          className="btn"
          style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
          title="Send to Back"
        >
          <ChevronsDown size={16} />
          <span style={{ fontSize: '9px' }}>Back</span>
        </button>
      </div>

      {/* Align Selected (Only if multiple selected) */}
      {isMultiSelect && (
        <>
          <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600, textTransform: 'uppercase', marginTop: '10px', marginBottom: '2px' }}>
            Align Selected
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button className="btn" onClick={() => alignElements('left')} style={{ padding: '6px 4px', fontSize: '10px' }} title="Align left edges">Left</button>
            <button className="btn" onClick={() => alignElements('center')} style={{ padding: '6px 4px', fontSize: '10px' }} title="Align centers horizontally">Center</button>
            <button className="btn" onClick={() => alignElements('right')} style={{ padding: '6px 4px', fontSize: '10px' }} title="Align right edges">Right</button>
            <button className="btn" onClick={() => alignElements('top')} style={{ padding: '6px 4px', fontSize: '10px' }} title="Align top edges">Top</button>
            <button className="btn" onClick={() => alignElements('middle')} style={{ padding: '6px 4px', fontSize: '10px' }} title="Align centers vertically">Middle</button>
            <button className="btn" onClick={() => alignElements('bottom')} style={{ padding: '6px 4px', fontSize: '10px' }} title="Align bottom edges">Bottom</button>
          </div>

          <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600, textTransform: 'uppercase', marginTop: '10px', marginBottom: '2px' }}>
            Distribute Selected
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button className="btn" onClick={() => distributeElements('horizontal')} style={{ padding: '6px 4px', fontSize: '10px' }} title="Distribute centers horizontally">Horizontal</button>
            <button className="btn" onClick={() => distributeElements('vertical')} style={{ padding: '6px 4px', fontSize: '10px' }} title="Distribute centers vertically">Vertical</button>
          </div>
        </>
      )}
    </div>
  );
};
