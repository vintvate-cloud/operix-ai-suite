import fs from 'fs';
import path from 'path';

function addUseClient(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      addUseClient(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      if (file === 'layout.tsx' || file === 'firebase.ts') continue;
      
      let content = fs.readFileSync(fullPath, 'utf-8');
      if (!content.includes('"use client"') && !content.includes("'use client'")) {
        fs.writeFileSync(fullPath, '"use client";\n' + content);
      }
    }
  }
}

addUseClient('./src/app');
addUseClient('./src/components');
addUseClient('./src/lib');
console.log('Added "use client" to files.');
