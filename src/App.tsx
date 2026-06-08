import React from 'react';
import { BuilderProvider, useBuilder } from './BuilderContext';
import { TopHeader } from './components/TopHeader';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import './App.css';

function AppContent() {
  const { theme, isPresenting } = useBuilder();
  return (
    <div className={`app-container ${theme}-theme ${isPresenting ? 'is-presenting' : ''}`}>
      {!isPresenting && <TopHeader />}
      <div className="editor-workspace">
        {!isPresenting && <Toolbar />}
        <Canvas />
        {!isPresenting && <PropertiesPanel />}
      </div>
    </div>
  );
}

function App() {
  return (
    <BuilderProvider>
      <AppContent />
    </BuilderProvider>
  );
}

export default App;
