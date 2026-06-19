const fs = require('fs');
const file = 'src/components/dashboard-shell.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('ChefHat,')) {
  content = content.replace('import {', 'import { ChefHat,');
  fs.writeFileSync(file, content);
  console.log('Added ChefHat to dashboard-shell.tsx imports.');
} else {
  console.log('ChefHat already exists.');
}
