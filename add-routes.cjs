const fs = require('fs');

const file = 'src/components/dashboard-shell.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Kitchen to "Operate"
content = content.replace(
  '{ icon: UtensilsCrossed, label: "Restaurant POS", to: "/dashboard/pos" },',
  '{ icon: UtensilsCrossed, label: "Restaurant POS", to: "/dashboard/pos" },\n      { icon: ChefHat, label: "Kitchen Display", to: "/dashboard/kitchen" },\n      { icon: Settings, label: "Menu Editor", to: "/dashboard/menu" },'
);

// 2. Add ChefHat to Lucide imports
if (!content.includes('ChefHat,')) {
  content = content.replace('import {', 'import { ChefHat,');
}

fs.writeFileSync(file, content);
console.log('Updated NavList with Menu and Kitchen routes.');
