const fs = require('fs');
const file = 'src/app/dashboard/pos/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the action buttons (Edit Menu, Kitchen View) from PageHeader
content = content.replace(/action=\{\s*<div className="flex gap-2">[\s\S]*?<\/div>\s*\}/, '');

// 2. Remove the KITCHEN block
content = content.replace(/\/\/ --- KITCHEN DISPLAY SYSTEM VIEW ---[\s\S]*?\/\/ --- MENU EDITOR VIEW ---/, '// --- MENU EDITOR VIEW ---');

// 3. Remove the MENU_EDIT block
content = content.replace(/\/\/ --- MENU EDITOR VIEW ---[\s\S]*?\/\/ --- WAITER \/ POS VIEW ---/, '// --- WAITER / POS VIEW ---');

fs.writeFileSync(file, content);
console.log('Stripped extra views from POS page.');
