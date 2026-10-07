import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pixiExportPlugin } from './build/pixi-export-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  base: '/JS_Builder/',
  plugins: [react(), pixiExportPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor';
          if (id.includes('node_modules/lucide-react')) return 'icons';
          if (id.includes('node_modules/pixi.js') || id.includes('node_modules/@pixi')) return 'pixi';
          return undefined;
        },
      },
    },
  },
})
