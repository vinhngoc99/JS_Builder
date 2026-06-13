import React, { useEffect, useRef, useState } from 'react';
import { Plus, Upload, Download, Play, Eye, X, Edit3 } from 'lucide-react';
import { useBuilder } from '../BuilderContext';
import { createPortal } from 'react-dom';

export const TopHeader: React.FC = () => {
  const {
    variants,
    activeVariantId,
    switchVariant,
    addVariant,
    deleteVariant,
    renameVariant,
    importHTML,
    exportHTML,
    setIsPresenting,
    showConfirm
  } = useBuilder();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!modalOpen || !previewMode || !htmlCode) {
      setPreviewUrl('');
      return;
    }

    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [htmlCode, modalOpen, previewMode]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleStartRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (editValue.trim()) {
      renameVariant(id, editValue.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = importHTML(text);
      if (success) {
        showToast('HTML imported successfully!', 'success');
      } else {
        showToast('Failed to import: Invalid builder state.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  const handleExportClick = () => {
    try {
      const code = exportHTML();
      setHtmlCode(code);
      setPreviewMode(false);
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to export HTML', error);
      showToast('Failed to export HTML. Check the console for details.', 'error');
    }
  };

  const handlePreviewClick = () => {
    try {
      const code = exportHTML();
      setHtmlCode(code);
      setPreviewMode(true);
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to preview HTML', error);
      showToast('Failed to preview HTML. Check the console for details.', 'error');
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Find active variant name for file name
    const activeVar = variants.find(v => v.id === activeVariantId);
    const fileName = activeVar ? `${activeVar.name.toLowerCase().replace(/\s+/g, '_')}.html` : 'export.html';
    
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Download started!', 'success');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    showToast('Code copied to clipboard!', 'success');
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="logo-container">
          <span className="logo-text">Academy Tool</span>
          <span className="logo-badge">v2.0</span>
        </div>
      </div>

      <div className="header-middle">
        <div className="variant-tabs">
          {variants.map((v) => {
            const isActive = v.id === activeVariantId;
            const isEditing = editingId === v.id;

            return (
              <div
                key={v.id}
                className={`variant-tab ${isActive ? 'active' : ''}`}
                onClick={() => !isEditing && switchVariant(v.id)}
              >
                {isEditing ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSaveRename(v.id)}
                    onKeyDown={(e) => handleKeyDown(e, v.id)}
                    autoFocus
                    className="tab-rename-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <span 
                      className="tab-name"
                      onDoubleClick={(e) => handleStartRename(v.id, v.name, e)}
                    >
                      {v.name}
                    </span>
                    <button
                      className="tab-action-btn edit-btn"
                      onClick={(e) => handleStartRename(v.id, v.name, e)}
                      title="Rename page"
                    >
                      <Edit3 size={12} />
                    </button>
                    {variants.length > 1 && (
                      <button
                        className="tab-action-btn delete-btn"
                          onClick={async (e) => {
                          e.stopPropagation();
                          const confirmed = await showConfirm(`Are you sure you want to delete page "${v.name}"?`, 'Confirm Delete');
                          if (confirmed) {
                            deleteVariant(v.id);
                          }
                        }}
                        title="Delete page"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {variants.length < 5 && (
            <button
              className="add-variant-btn"
              onClick={addVariant}
              title="Add variant page (Max 5)"
            >
              <Plus size={16} />
              <span>Add Variant</span>
            </button>
          )}
        </div>
      </div>

      <div className="header-right">
        <button className="header-action-btn" onClick={handleImportClick} title="Import HTML">
          <Upload size={16} />
          <span>Import</span>
        </button>
        
        <button className="header-action-btn" onClick={handlePreviewClick} title="Live Preview Code">
          <Eye size={16} />
          <span>Preview</span>
        </button>

        <button className="header-action-btn primary" onClick={handleExportClick} title="Export HTML">
          <Download size={16} />
          <span>Export</span>
        </button>

        <div className="divider" />

        <button 
          className="presentation-trigger-btn" 
          onClick={() => setIsPresenting(true)} 
          title="Play presentation slideshow"
        >
          <Play size={16} fill="currentColor" />
          <span>Present</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".html"
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`editor-toast ${toastType}`}>
          <div className="toast-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {toastType === 'success' ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              )}
            </svg>
          </div>
          <span className="toast-message">{toastMessage}</span>
        </div>
      )}

      {/* Export & Preview Modal */}
      {modalOpen && createPortal(
        <div className="editor-modal-overlay">
          <div className={`editor-modal-container ${previewMode ? 'large' : ''}`}>
            <div className="editor-modal-header">
              <span className="modal-title">{previewMode ? 'Live Preview' : 'Export HTML Code'}</span>
              <div className="modal-actions">
                {previewMode && (
                  <button className="modal-btn" onClick={() => setPreviewMode(false)}>
                    Show Code
                  </button>
                )}
                <button className="modal-btn close" onClick={() => setModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="editor-modal-body">
              {previewMode ? (
                <div className="modal-preview-frame">
                  <iframe
                    key={previewUrl}
                    src={previewUrl}
                    title="Live Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              ) : (
                <div className="modal-export-content">
                  <p className="modal-desc">
                    Here is the complete HTML page code. You can download the file directly or copy the embed code below.
                  </p>
                  <textarea
                    readOnly
                    value={htmlCode}
                    className="modal-code-area"
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                  />
                  <div className="modal-buttons-row">
                    <button className="modal-btn secondary" onClick={handleCopyCode}>
                      Copy Code
                    </button>
                    <button className="modal-btn primary" onClick={handleDownloadFile}>
                      Download HTML File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
