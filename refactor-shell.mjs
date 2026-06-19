import fs from 'fs';

const file = 'src/components/dashboard-shell.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove RoleContext creation
content = content.replace(/export const RoleContext = createContext<[^>]+>\(\{[\s\S]*?\}\);\s*/, '');

// 2. Remove ROLES array
content = content.replace(/const ROLES = \[\s*([\s\S]*?)\s*\];\s*/, '');

// 3. Remove RoleSwitcher component completely
content = content.replace(/function RoleSwitcher\(\) \{[\s\S]*?(?=function PropertySwitcher)/, '');
// Also remove it if it was defined after PropertySwitcher:
content = content.replace(/function RoleSwitcher\(\) \{[\s\S]*?(?=function SidebarInner)/, '');

// 4. Remove <RoleSwitcher /> usage from SidebarInner
content = content.replace(/\s*<RoleSwitcher \/>\s*/g, '\n');

// 5. Update NavList to use userData.role instead of RoleContext
content = content.replace(/const \{ role \} = useContext\(RoleContext\);/, 'const role = userData?.role || "Super Admin";');

// 6. Update DashboardShell props/provider
content = content.replace(/const \[role, setRole\] = useState\("General Manager"\);/, '');
content = content.replace(/<RoleContext\.Provider value=\{\{ role, setRole \}\}>/g, '');
content = content.replace(/<\/RoleContext\.Provider>/g, '');

fs.writeFileSync(file, content);
console.log('Refactored Dashboard Shell successfully.');
