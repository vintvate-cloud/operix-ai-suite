import fs from 'fs';
import path from 'path';

function fixLinks(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixLinks(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      if (content.includes('@tanstack/react-router')) {
        content = content.replace(/import\s+\{\s*Link[^\}]*\}\s+from\s+['"]@tanstack\/react-router['"];?/g, 'import Link from "next/link";');
        changed = true;
      }
      
      // Fix Link to= -> Link href=
      if (content.includes('<Link') && content.includes('to=')) {
        content = content.replace(/<Link([^>]*?)to=/g, '<Link$1href=');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fixLinks('./src');
console.log('Fixed Links!');
