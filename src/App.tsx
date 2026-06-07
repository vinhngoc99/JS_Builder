import React from 'react';
import { BuilderProvider } from './BuilderContext';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import './App.css';

function App() {
  return (
    <BuilderProvider>
      <div className="app-container">
        <Toolbar />
        <Canvas />
        <PropertiesPanel />
      </div>
    </BuilderProvider>
  );
}

export default App;
