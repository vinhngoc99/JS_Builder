import React from 'react';
import { ArrowLeft, ArrowRight, Copy, Eye, EyeOff, Layout, Plus, Trash2 } from 'lucide-react';
import { useBuilder, SlideLayout } from '../BuilderContext';

const layoutLabels: { value: SlideLayout; label: string }[] = [
  { value: 'blank', label: 'Blank' },
  { value: 'title', label: 'Title' },
  { value: 'titleBody', label: 'Title + Body' },
  { value: 'section', label: 'Section' },
  { value: 'media', label: 'Media' },
];

export const SlideNavigator: React.FC = () => {
  const {
    elements,
    selectedIds,
    selectElement,
    removeElement,
    updateElement,
    addSlideNode,
    duplicateSlideNode,
    moveSlideNode,
    setCurrentSlideIndex,
    saveHistory,
  } = useBuilder();
  const [isOpen, setIsOpen] = React.useState(false);
  const [layout, setLayout] = React.useState<SlideLayout>('titleBody');

  const slideNodes = elements
    .filter(el => el.type === 'node')
    .sort((a, b) => a.x - b.x);
  const presentationSlides = slideNodes.filter(el => el.isSlide !== false);

  const selectSlide = (id: string) => {
    selectElement(id, false);
    const presentationIndex = presentationSlides.findIndex(slide => slide.id === id);
    if (presentationIndex >= 0) {
      setCurrentSlideIndex(presentationIndex);
    }
  };

  if (!isOpen) {
    return (
      <button
        className="floating-panel-toggle slide-toggle"
        onClick={() => setIsOpen(true)}
        title="Show slide nodes"
      >
        <Layout size={20} />
      </button>
    );
  }

  return (
    <aside className="slide-navigator" aria-label="Slide nodes">
      <div className="slide-navigator-header">
        <div>
          <div className="slide-navigator-title">Slides</div>
          <div className="slide-navigator-subtitle">Freeform nodes</div>
        </div>
        <button className="slide-icon-btn" onClick={() => addSlideNode(layout)} title="Add slide node">
          <Plus size={16} />
        </button>
        <button className="slide-header-hide" onClick={() => setIsOpen(false)} title="Hide slide nodes">
          Hide
        </button>
      </div>

      <div className="slide-layout-row">
        <select value={layout} onChange={(e) => setLayout(e.target.value as SlideLayout)} title="New slide layout">
          {layoutLabels.map(item => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      <div className="slide-node-list">
        {slideNodes.length === 0 ? (
          <div className="slide-empty-state">No nodes yet</div>
        ) : (
          slideNodes.map((slide, nodeIndex) => {
            const isSelected = selectedIds.includes(slide.id);
            const children = elements.filter(el => el.parentId === slide.id);
            const presentationIndex = presentationSlides.findIndex(item => item.id === slide.id);
            const isIncluded = presentationIndex >= 0;
            return (
              <div
                key={slide.id}
                className={`slide-node-card ${isSelected ? 'active' : ''} ${!isIncluded ? 'excluded' : ''}`}
                onClick={() => selectSlide(slide.id)}
              >
                <div className="slide-node-index">{isIncluded ? presentationIndex + 1 : 'off'}</div>
                <div className="slide-node-thumb">
                  <div className="slide-node-frame">
                    <div className="slide-node-name">{slide.name || `Node ${nodeIndex + 1}`}</div>
                    {children.slice(0, 3).map(child => (
                      <div key={child.id} className={`slide-thumb-line ${child.type}`} />
                    ))}
                  </div>
                </div>
                <div className="slide-node-meta">
                  <span>{Math.round(slide.width)} x {Math.round(slide.height)}</span>
                  <button
                    className="slide-mini-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      saveHistory();
                      updateElement(slide.id, { isSlide: !isIncluded });
                    }}
                    title={isIncluded ? 'Remove from presentation' : 'Restore to presentation'}
                  >
                    {isIncluded ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                </div>
                <div className="slide-node-actions">
                  <button className="slide-mini-btn" onClick={(e) => { e.stopPropagation(); moveSlideNode(slide.id, 'left'); }} disabled={!isIncluded || presentationIndex === 0} title="Move earlier">
                    <ArrowLeft size={12} />
                  </button>
                  <button className="slide-mini-btn" onClick={(e) => { e.stopPropagation(); moveSlideNode(slide.id, 'right'); }} disabled={!isIncluded || presentationIndex === presentationSlides.length - 1} title="Move later">
                    <ArrowRight size={12} />
                  </button>
                  <button className="slide-mini-btn" onClick={(e) => { e.stopPropagation(); duplicateSlideNode(slide.id); }} title="Duplicate slide node">
                    <Copy size={12} />
                  </button>
                  <button className="slide-mini-btn danger" onClick={(e) => { e.stopPropagation(); removeElement(slide.id); }} title="Delete slide node">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
