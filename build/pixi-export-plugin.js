import { build } from 'esbuild';
import { resolve } from 'node:path';

export function pixiExportPlugin() {
  const id = 'virtual:pixi-export-runtime';
  const entry = resolve('src/export/entry.ts');
  return {
    name: 'pixi-export-runtime',
    resolveId(source) { return source === id ? `\0${id}` : null; },
    async load(source) {
      if (source !== `\0${id}`) return;
      const result = await build({ entryPoints: [entry], bundle: true, format: 'iife', platform: 'browser', target: 'es2022', write: false, minify: true, metafile: true });
      for (const input of Object.keys(result.metafile.inputs)) this.addWatchFile(resolve(input));
      return `export default ${JSON.stringify(result.outputFiles[0].text)};`;
    },
    handleHotUpdate(context) {
      if (/src[/\\](workspace|export|animations|models)[/\\]/.test(context.file)) {
        const module = context.server.moduleGraph.getModuleById(`\0${id}`);
        if (module) { context.server.moduleGraph.invalidateModule(module); return [...context.modules, module]; }
      }
    },
  };
}
