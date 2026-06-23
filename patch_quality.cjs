const fs = require('fs');

// 1. Patch ElementWrapper.tsx
let ewPath = 'src/components/ElementWrapper.tsx';
let ewCode = fs.readFileSync(ewPath, 'utf-8');
const ewRegex = /const displaySrc = element\.src && element\.src\.includes\('lh3\.googleusercontent\.com'\) && element\.src\.endsWith\('=s0'\) \? element\.src\.replace\('=s0', '=s2048'\) : element\.src;/;
const ewNew = `const displaySrc = (() => {
          if (!element.src || !element.src.includes('lh3.googleusercontent.com')) return element.src;
          const q = (element as any).imageQuality;
          if (q === undefined) return element.src;
          const baseSrc = element.src.replace(/=s\\d+$/, '');
          return q === 100 ? \`\${baseSrc}=s0\` : \`\${baseSrc}=s\${Math.round(40 * q)}\`;
        })();`;
ewCode = ewCode.replace(ewRegex, ewNew);
fs.writeFileSync(ewPath, ewCode);

// 2. Patch BuilderContext.tsx
let bcPath = 'src/BuilderContext.tsx';
let bcCode = fs.readFileSync(bcPath, 'utf-8');
const bcRegex = /const sizeParam = Math\.round\(Math\.max\(el\.width, el\.height\) \* 2\);\s*const exportSrc = el\.src && el\.src\.includes\('lh3\.googleusercontent\.com'\) && el\.src\.endsWith\('=s0'\) \? el\.src\.replace\('=s0', \`=s\$\{sizeParam\}\`\) : el\.src;/;
const bcNew = `const exportSrc = (() => {
              if (!el.src || !el.src.includes('lh3.googleusercontent.com')) return el.src;
              const q = (el as any).imageQuality;
              if (q === undefined) return el.src;
              const baseSrc = el.src.replace(/=s\\d+$/, '');
              return q === 100 ? \`\${baseSrc}=s0\` : \`\${baseSrc}=s\${Math.round(40 * q)}\`;
            })();`;
bcCode = bcCode.replace(bcRegex, bcNew);
fs.writeFileSync(bcPath, bcCode);

// 3. Patch PropertiesPanel.tsx
let ppPath = 'src/components/PropertiesPanel.tsx';
let ppCode = fs.readFileSync(ppPath, 'utf-8');
const ppRegex = /<input\s+type="text"\s+value=\{el\.src \|\| ''\}\s+onChange=\{\(e\) => \{[\s\S]*?\}\}\s+style=\{\{ width: '100%' \}\}\s+placeholder="https:\/\/..."\s+\/>/;
const ppNew = `<input 
                type="text" 
                value={el.src || ''} 
                onChange={(e) => {
                  const val = e.target.value;
                  const driveMatch = val.match(/drive\\.google\\.com\\/file\\/d\\/([a-zA-Z0-9_-]+)/) || val.match(/drive\\.google\\.com\\/open\\?id=([a-zA-Z0-9_-]+)/);
                  let finalVal = val;
                  if (driveMatch && driveMatch[1]) {
                    if (selectedElement!.type === 'image') finalVal = \`https://lh3.googleusercontent.com/d/\${driveMatch[1]}\`;
                    else if (selectedElement!.type === 'video') finalVal = \`https://drive.google.com/file/d/\${driveMatch[1]}/preview\`;
                  }
                  if (selectedElement!.type === 'image') {
                    void updateSelectedImageSource(finalVal);
                  } else {
                    handlePanelChange({ src: finalVal });
                  }
                }} 
                style={{ width: '100%' }}
                placeholder="https://..."
              />
              {selectedElement!.type === 'image' && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#8c8d9c', width: '70px' }}>Quality</div>
                  <NumberInput 
                    value={(selectedElement! as any).imageQuality || 100} 
                    onChange={(v: number) => handlePanelChange({ imageQuality: Math.max(1, Math.min(100, v)) })} 
                    style={{ flex: 1, padding: '4px' }}
                    min={1}
                    max={100}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>%</span>
                  <button onClick={() => handlePanelChange({ imageQuality: 100 })} style={{ padding: '2px 6px', fontSize: '10px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Max</button>
                </div>
              )}`;
ppCode = ppCode.replace(ppRegex, ppNew);
fs.writeFileSync(ppPath, ppCode);
