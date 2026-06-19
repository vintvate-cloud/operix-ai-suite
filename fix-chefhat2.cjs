const fs = require('fs');
const file = 'src/components/dashboard-shell.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import {', 'import { ChefHat,');

fs.writeFileSync(file, content);
console.log('Forcefully added ChefHat to dashboard-shell.tsx imports.');
