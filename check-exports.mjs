import fs from 'fs';
import path from 'path';

function checkExports(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      checkExports(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (!content.includes('export default')) {
        console.log('Missing export default in:', fullPath);
        // Let's attempt to auto-fix by looking for a function
        const match = content.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
        if (match) {
          fs.writeFileSync(fullPath, content + `\nexport default ${match[1]};\n`);
          console.log('-> Auto fixed with:', match[1]);
        }
      }
    }
  }
}

checkExports('./src/app');
