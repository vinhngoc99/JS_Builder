import React from 'react';
import { CanvasElement, ElementAnimation } from '../../types';
import { Play, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useBuilder } from '../../BuilderContext';

interface AnimationPanelProps {
  element: CanvasElement;
  onChange: (updates: { animations: ElementAnimation[] }) => void;
}

export const AnimationPanel: React.FC<AnimationPanelProps> = ({ element, onChange }) => {
  const animations = element.animations || [];
  const { setPreviewAnimationId } = useBuilder();

  const handleAddAnimation = () => {
    const newAnim: ElementAnimation = {
      id: uuidv4(),
      trigger: 'onClick',
      type: 'entrance',
      effect: 'fadeIn',
      duration: 500,
      delay: 0,
      easing: 'ease',
      order: animations.length + 1,
    };
    onChange({ animations: [...animations, newAnim] });
  };

  const handleUpdateAnimation = (id: string, key: keyof ElementAnimation, value: any) => {
    const newAnimations = animations.map((anim) => {
      if (anim.id !== id) return anim;
      const updated = { ...anim, [key]: value };
      
      // Auto-set sensible default effects when changing type
      if (key === 'type') {
        if (value === 'entrance') updated.effect = 'fadeIn';
        else if (value === 'exit') updated.effect = 'fadeOut';
        else if (value === 'emphasis') updated.effect = 'pulse';
      }
      
      return updated;
    });
    onChange({ animations: newAnimations });
  };

  const handleRemoveAnimation = (id: string) => {
    onChange({ animations: animations.filter((anim) => anim.id !== id) });
  };

  const handlePreviewAnimation = (anim: ElementAnimation) => {
    setPreviewAnimationId(null);
    requestAnimationFrame(() => {
      setPreviewAnimationId(anim.id);
      window.setTimeout(() => {
        setPreviewAnimationId(null);
      }, anim.delay + anim.duration + 150);
    });
  };

  const entranceEffects = [
    { value: 'fadeIn', label: 'Fade In' },
    { value: 'slideInLeft', label: 'Fly In from Left' },
    { value: 'slideInRight', label: 'Fly In from Right' },
    { value: 'slideInTop', label: 'Fly In from Top' },
    { value: 'slideInBottom', label: 'Fly In from Bottom' },
    { value: 'zoomIn', label: 'Zoom In' },
    { value: 'bounceIn', label: 'Bounce In' },
  ];

  const exitEffects = [
    { value: 'fadeOut', label: 'Fade Out' },
    { value: 'slideOutLeft', label: 'Fly Out to Left' },
    { value: 'slideOutRight', label: 'Fly Out to Right' },
    { value: 'slideOutTop', label: 'Fly Out to Top' },
    { value: 'slideOutBottom', label: 'Fly Out to Bottom' },
    { value: 'zoomOut', label: 'Zoom Out' },
  ];

  const emphasisEffects = [
    { value: 'pulse', label: 'Pulse' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'shake', label: 'Shake' },
    { value: 'spin', label: 'Spin' },
    { value: 'grow', label: 'Grow' },
    { value: 'shrink', label: 'Shrink' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '11px', color: '#8c8d9c', fontWeight: 600, textTransform: 'uppercase' }}>
          Animations
        </div>
        <button
          onClick={handleAddAnimation}
          className="btn"
          style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', background: '#3a3c50', color: '#fff' }}
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {animations.length === 0 ? (
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '6px', border: '1px dashed var(--border-color)' }}>
          No animations added
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {animations.map((anim, idx) => (
            <div
              key={anim.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative',
              }}
            >
              {/* Header / Delete */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Animation {idx + 1}
                </span>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button
                    onClick={() => handlePreviewAnimation(anim)}
                    style={{ background: 'none', border: 'none', color: '#4caf50', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    title="Preview Animation"
                  >
                    <Play size={12} />
                  </button>
                  <button
                    onClick={() => handleRemoveAnimation(anim.id)}
                    style={{ background: 'none', border: 'none', color: '#ef5350', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    title="Remove Animation"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Type */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: '#8c8d9c', width: '50px' }}>Type</div>
                <select
                  value={anim.type}
                  onChange={(e) => handleUpdateAnimation(anim.id, 'type', e.target.value)}
                  style={{ flex: 1, padding: '3px', fontSize: '11px' }}
                >
                  <option value="entrance">Entrance</option>
                  <option value="exit">Exit</option>
                  <option value="emphasis">Emphasis</option>
                </select>
              </div>

              {/* Effect */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: '#8c8d9c', width: '50px' }}>Effect</div>
                <select
                  value={anim.effect}
                  onChange={(e) => handleUpdateAnimation(anim.id, 'effect', e.target.value)}
                  style={{ flex: 1, padding: '3px', fontSize: '11px' }}
                >
                  {anim.type === 'entrance' && entranceEffects.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                  {anim.type === 'exit' && exitEffects.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                  {anim.type === 'emphasis' && emphasisEffects.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>

              {/* Trigger */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: '#8c8d9c', width: '50px' }}>Trigger</div>
                <select
                  value={anim.trigger}
                  onChange={(e) => handleUpdateAnimation(anim.id, 'trigger', e.target.value)}
                  style={{ flex: 1, padding: '3px', fontSize: '11px' }}
                >
                  <option value="onClick">On Click</option>
                  <option value="withPrevious">With Previous</option>
                  <option value="afterPrevious">After Previous</option>
                  <option value="onEnter">On Slide Enter</option>
                </select>
              </div>

              {/* Duration / Delay */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '9px', color: '#8c8d9c', marginBottom: '2px' }}>Duration (ms)</div>
                  <input
                    type="number"
                    value={anim.duration}
                    onChange={(e) => handleUpdateAnimation(anim.id, 'duration', Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ width: '100%', padding: '3px', fontSize: '11px' }}
                    min={0}
                    step={100}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '9px', color: '#8c8d9c', marginBottom: '2px' }}>Delay (ms)</div>
                  <input
                    type="number"
                    value={anim.delay}
                    onChange={(e) => handleUpdateAnimation(anim.id, 'delay', Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ width: '100%', padding: '3px', fontSize: '11px' }}
                    min={0}
                    step={100}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
