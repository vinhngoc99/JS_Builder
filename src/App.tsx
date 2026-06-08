import React from 'react';
import { BuilderProvider, useBuilder } from './BuilderContext';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import './App.css';

function AppContent() {
  const { theme } = useBuilder();
  return (
    <div className={`app-container ${theme}-theme`}>
      <Toolbar />
      <Canvas />
      <PropertiesPanel />
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
