const fs = require('fs');
const path = 'src/components/PropertiesPanel.tsx';
let code = fs.readFileSync(path, 'utf-8');

// Replace the grid block entirely using regex to ignore line ending issues
const gridRegex = /<div style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(4, 1fr\)', gap: '6px', marginTop: '4px' \}\}>[\s\S]*?<\/div>\s*<\/div>/;

const gridNew = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '4px' }}>
              <NumberInput label="X" value={selectedElement!.x} onChange={(v) => handlePanelChange({ x: v })} disabled={!!selectedElement!.fillParent} style={{ width: '100%', boxSizing: 'border-box', padding: '4px 2px', textAlign: 'center' }} />
              <NumberInput label="Y" value={selectedElement!.y} onChange={(v) => handlePanelChange({ y: v })} disabled={!!selectedElement!.fillParent} style={{ width: '100%', boxSizing: 'border-box', padding: '4px 2px', textAlign: 'center' }} />
              <NumberInput label="W" value={selectedElement!.width} onChange={(v) => handlePanelChange({ width: v })} disabled={!!selectedElement!.fillParent} min={10} style={{ width: '100%', boxSizing: 'border-box', padding: '4px 2px', textAlign: 'center' }} />
              <NumberInput label="H" value={selectedElement!.height} onChange={(v) => handlePanelChange({ height: v })} disabled={!!selectedElement!.fillParent} min={10} style={{ width: '100%', boxSizing: 'border-box', padding: '4px 2px', textAlign: 'center' }} />
            </div>`;

code = code.replace(gridRegex, gridNew);

const rotationRegex = /<div style=\{\{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' \}\}>[\s\S]*?Rotation[\s\S]*?<input[\s\S]*?type="number"[\s\S]*?value=\{selectedElement!\.rotation \|\| 0\}[\s\S]*?onChange=\{\(e\) => handlePanelChange\(\{ rotation: parseInt\(e\.target\.value\) \|\| 0 \}\)\}[\s\S]*?style=\{\{ flex: 1 \}\}[\s\S]*?\/>[\s\S]*?<span[\s\S]*?°<\/span>\s*<\/div>/;

const rotationNew = `<div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <div style={{ fontSize: '11px', color: '#8c8d9c', width: '50px' }}>Rotation</div>
              <NumberInput 
                value={selectedElement!.rotation || 0} 
                onChange={(v) => handlePanelChange({ rotation: v })} 
                style={{ flex: 1, padding: '4px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>°</span>
            </div>`;

code = code.replace(rotationRegex, rotationNew);

fs.writeFileSync(path, code);
