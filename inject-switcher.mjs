import fs from 'fs';

const filePath = 'src/components/dashboard-shell.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Firebase imports
content = content.replace(
  'import { useAuth } from "@/lib/auth-context";',
  'import { useAuth } from "@/lib/auth-context";\nimport { db } from "@/lib/firebase";\nimport { collection, query, where, onSnapshot } from "firebase/firestore";'
);

// 2. Add Building2 to Lucide imports if not present
if (!content.includes('Building2,')) {
  content = content.replace('import {', 'import { Building2,');
}

// 3. Inject PropertySwitcher
const propertySwitcherStr = `
function PropertySwitcher() {
  const { user, activeProperty, setActiveProperty } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "properties"), where("ownerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const props = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProperties(props);
      if (props.length > 0 && !activeProperty) {
        setActiveProperty(props[0].id);
      }
    });
    return unsub;
  }, [user]);

  const active = properties.find(p => p.id === activeProperty);

  if (properties.length === 0) return null;

  return (
    <div className="relative mb-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-op-purple/20 text-op-purple hover:bg-op-purple/30 rounded-xl px-3 py-2.5 text-xs transition border border-op-purple/20"
      >
        <span className="flex items-center gap-2 font-bold truncate">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{active ? active.name : "Select Property"}</span>
        </span>
        <ChevronDown className="h-3 w-3 shrink-0" />
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-foreground border border-white/10 rounded-xl p-1 max-h-64 overflow-auto z-10 shadow-2xl">
          {properties.map((p) => (
            <button
              key={p.id}
              onClick={() => { setActiveProperty(p.id); setOpen(false); }}
              className={\`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 \${
                p.id === activeProperty ? "text-op-purple font-bold" : "text-background/80"
              }\`}
            >
              {p.name}
            </button>
          ))}
          <Link href="/dashboard/properties" onClick={() => setOpen(false)} className="w-full flex justify-center px-3 py-2 text-xs rounded-lg hover:bg-white/10 text-background/50 mt-1 border-t border-white/5">
            + Manage Properties
          </Link>
        </div>
      )}
    </div>
  );
}

function SidebarInner() {`;

content = content.replace('function SidebarInner() {', propertySwitcherStr);

// 4. Inject into SidebarInner
content = content.replace(
  '<RoleSwitcher />',
  '<PropertySwitcher />\n        <RoleSwitcher />'
);

fs.writeFileSync(filePath, content);
console.log('Successfully injected PropertySwitcher.');
