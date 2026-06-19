import fs from 'fs';
import path from 'path';

const srcRoutes = './src/routes';
const srcApp = './src/app';

// Create app directory
if (!fs.existsSync(srcApp)) {
  fs.mkdirSync(srcApp, { recursive: true });
}

function processContent(content, isLayout = false) {
  let newContent = content;

  // 1. Remove TanStack imports
  newContent = newContent.replace(/import\s+\{([^}]*)\}\s+from\s+['"]@tanstack\/react-router['"];/g, (match, imports) => {
    let replacements = [];
    if (imports.includes('Link')) replacements.push(`import Link from "next/link";`);
    if (imports.includes('useNavigate')) replacements.push(`import { useRouter } from "next/navigation";`);
    if (imports.includes('useRouterState')) replacements.push(`import { usePathname } from "next/navigation";`);
    if (imports.includes('Outlet')) {
      if (!isLayout) replacements.push(`// OUTLET REMOVED`);
    }
    return replacements.join('\n');
  });

  // 2. Remove createFileRoute
  newContent = newContent.replace(/export\s+const\s+Route\s*=\s*createFileRoute[^\(]*\([^\)]*\)\(\{[^}]*\}\);/g, '');
  newContent = newContent.replace(/export\s+const\s+Route\s*=\s*createFileRoute.*?}\);/gs, '');

  // 3. Replace Outlet with children (only for layouts)
  if (isLayout) {
    newContent = newContent.replace(/<Outlet\s*\/?>/g, '{children}');
  }

  // 4. Update useNavigate to useRouter
  newContent = newContent.replace(/const\s+navigate\s*=\s*useNavigate\(\)/g, 'const router = useRouter()');
  newContent = newContent.replace(/navigate\(\{.*?to:\s*['"](.*?)['"].*?\}\)/g, 'router.push("$1")');

  // 5. Convert component to default export if it isn't
  // Most components are named Page, Overview, SignUp, etc.
  // We'll just export default the main function.
  // First, look for the component mapped in Route (e.g. component: SignUp)
  const compMatch = content.match(/component:\s*([A-Za-z0-9_]+)/);
  if (compMatch) {
    const compName = compMatch[1];
    // If the function is not exported by default, append export default
    if (!newContent.includes(`export default function ${compName}`) && !newContent.includes(`export default ${compName}`)) {
      newContent += `\nexport default ${compName};\n`;
    }
  } else {
    // Fallback: Make the first function starting with a capital letter the default export
    const fallbackMatch = newContent.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
    if (fallbackMatch) {
       newContent += `\nexport default ${fallbackMatch[1]};\n`;
    }
  }

  return newContent;
}

// Map files
const files = fs.readdirSync(srcRoutes);
for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  
  const oldPath = path.join(srcRoutes, file);
  let content = fs.readFileSync(oldPath, 'utf-8');

  if (file === '__root.tsx') {
    // Skip root, we'll create layout manually
    continue; 
  } else if (file === 'index.tsx') {
    fs.mkdirSync(path.join(srcApp), { recursive: true });
    fs.writeFileSync(path.join(srcApp, 'page.tsx'), processContent(content));
  } else if (file === 'dashboard.tsx') {
    fs.mkdirSync(path.join(srcApp, 'dashboard'), { recursive: true });
    // This is the dashboard layout
    let layoutContent = processContent(content, true);
    // Add children prop to DashboardShell wrapper
    layoutContent = layoutContent.replace(/function RouteComponent\(\)\s*\{/, 'export default function DashboardLayout({ children }: { children: React.ReactNode }) {');
    layoutContent = layoutContent.replace(/component:\s*\(\)\s*=>\s*\(/, 'export default function DashboardLayout({ children }: { children: React.ReactNode }) { return (');
    fs.writeFileSync(path.join(srcApp, 'dashboard', 'layout.tsx'), layoutContent);
  } else if (file === 'dashboard.index.tsx') {
    fs.mkdirSync(path.join(srcApp, 'dashboard'), { recursive: true });
    fs.writeFileSync(path.join(srcApp, 'dashboard', 'page.tsx'), processContent(content));
  } else if (file.startsWith('dashboard.')) {
    const route = file.replace('dashboard.', '').replace('.tsx', '');
    fs.mkdirSync(path.join(srcApp, 'dashboard', route), { recursive: true });
    fs.writeFileSync(path.join(srcApp, 'dashboard', route, 'page.tsx'), processContent(content));
  } else {
    // Normal route e.g. sign-in.tsx -> sign-in/page.tsx
    const route = file.replace('.tsx', '');
    fs.mkdirSync(path.join(srcApp, route), { recursive: true });
    fs.writeFileSync(path.join(srcApp, route, 'page.tsx'), processContent(content));
  }
}

// Create root layout
const rootLayout = `
import { AuthProvider } from "@/lib/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles.css";

export const metadata = {
  title: "OPERIX — The AI Operating System for Hospitality",
  description: "Run your entire hotel from one AI operating system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
            <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-op-purple/30">
              {children}
            </div>
        </AuthProvider>
      </body>
    </html>
  );
}
`;
fs.writeFileSync(path.join(srcApp, 'layout.tsx'), rootLayout);

console.log('Migration structure created in src/app!');
