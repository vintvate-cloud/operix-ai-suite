"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, where, updateDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { Plus, Minus, CreditCard, Trash2, Search, Receipt, Flame, Utensils, Coffee, CheckCircle2, ChefHat, BellRing, Settings, Printer } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

type Product = { id?: string; name: string; price: number; category: string };

const DEFAULT_MENU = [
  { name: "Classic Cheeseburger", price: 14.50, category: "Mains" },
  { name: "Truffle Fries", price: 8.00, category: "Sides" },
  { name: "Margherita Pizza", price: 18.00, category: "Mains" },
  { name: "Craft Beer", price: 7.50, category: "Drinks" }
];

export default function POSPage() {
  const { user, userData, activeProperty } = useAuth();
  const [menu, setMenu] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState<"POS" | "KITCHEN" | "MENU_EDIT">("POS");
  
  const [newMenuItem, setNewMenuItem] = useState({ name: "", price: "", category: "Mains" });

  const role = userData?.role || "Super Admin";

  useEffect(() => {
    if (!user) return;
    
    // Fetch Menu
    const qMenu = query(collection(db, "menuItems"), where("ownerId", "==", user.uid));
    const unsubMenu = onSnapshot(qMenu, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setMenu(items);
      // Auto-populate default menu if empty and user is admin
      if (items.length === 0 && role === "Super Admin") {
        DEFAULT_MENU.forEach(item => {
          addDoc(collection(db, "menuItems"), { ...item, ownerId: user.uid, propertyId: activeProperty || null });
        });
      }
    });

    // Fetch active orders for KDS / Waiter
    const qOrders = query(collection(db, "orders"), where("ownerId", "==", user.uid));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      let ords = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (activeProperty) ords = ords.filter(o => !o.propertyId || o.propertyId === activeProperty);
      setOrders(ords.sort((a, b) => b.createdAt - a.createdAt));
    });

    return () => { unsubMenu(); unsubOrders(); };
  }, [user, activeProperty, role]);

  const categories = ["All", ...Array.from(new Set(menu.map(m => m.category)))];

  const filteredMenu = menu.filter(p => 
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (cat: string) => {
    if (cat === "Drinks") return Coffee;
    if (cat === "Mains") return Flame;
    return Utensils;
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const gst = subtotal * 0.05; // 5% GST
  const serviceTax = subtotal * 0.10; // 10% Service Tax
  const total = subtotal + gst + serviceTax;

  const handleSendToKitchen = async () => {
    if (!user || cart.length === 0) return;
    setIsProcessing(true);
    try {
      await addDoc(collection(db, "orders"), {
        ownerId: user.uid,
        propertyId: activeProperty || null,
        items: cart.map(c => ({ id: c.product.id, name: c.product.name, price: c.product.price, qty: c.quantity })),
        subtotal, gst, serviceTax, total,
        status: "Preparing", // Kitchen needs to prepare it
        createdAt: Date.now()
      });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setCart([]); }, 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const printBill = (order?: any) => {
    const printContent = document.getElementById('receipt-print-zone');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore React bindings
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await addDoc(collection(db, "menuItems"), {
      ownerId: user.uid,
      propertyId: activeProperty || null,
      name: newMenuItem.name,
      price: parseFloat(newMenuItem.price),
      category: newMenuItem.category
    });
    setNewMenuItem({ name: "", price: "", category: "Mains" });
  };

  // --- WAITER / POS VIEW ---
  const readyOrders = orders.filter(o => o.status === "Ready");

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col relative">
      <PageHeader 
        eyebrow="Operations" 
        title="Restaurant POS" 
        
      />
      
      {/* Ready Notifications for Waiter */}
      {readyOrders.length > 0 && (
        <div className="bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 p-4 rounded-2xl mt-4 flex items-center gap-4 overflow-x-auto">
          <div className="font-bold shrink-0 flex items-center gap-2"><BellRing className="h-5 w-5 animate-pulse"/> Ready for pickup:</div>
          {readyOrders.map(o => (
            <button key={o.id} onClick={() => updateDoc(doc(db, "orders", o.id), { status: "Completed" })} className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap shadow-md hover:bg-emerald-600">
              Order #{o.id.substring(0, 5).toUpperCase()} &rarr; Complete
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 flex gap-6 mt-4 min-h-0">
        {/* MENU GRID */}
        <div className="flex-1 flex flex-col min-w-0 bg-card rounded-3xl border border-border p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="text" placeholder="Search menu..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-muted/50 border border-border rounded-full pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-op-purple transition" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition ${category === c ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {filteredMenu.map(p => {
              const Icon = getIcon(p.category);
              return (
                <button key={p.id} onClick={() => addToCart(p)} className="bg-muted/30 hover:bg-muted/60 border border-border rounded-2xl p-4 text-left transition-all hover:scale-[1.02] active:scale-95 flex flex-col">
                  <div className="h-12 w-12 rounded-xl bg-op-purple/10 text-op-purple flex items-center justify-center mb-4"><Icon className="h-6 w-6" /></div>
                  <div className="font-semibold text-sm mb-1">{p.name}</div>
                  <div className="text-muted-foreground text-sm font-medium mt-auto">${p.price.toFixed(2)}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* TICKET SECTION */}
        <div className="w-[400px] flex flex-col bg-foreground text-background rounded-3xl shadow-2xl overflow-hidden shrink-0">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-wide">Current Ticket</h2>
            {cart.length > 0 && <button onClick={() => setCart([])} className="text-white/50 hover:text-white transition p-2 rounded-full hover:bg-white/10"><Trash2 className="h-5 w-5" /></button>}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-white/30 text-center">
                <Receipt className="h-12 w-12 mb-4 opacity-50" />
                <p>Tap items to build order</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="flex flex-col gap-2 bg-white/10 rounded-xl p-1 shrink-0">
                    <button onClick={() => updateQuantity(item.product.id!, 1)} className="p-1 hover:bg-white/20 rounded-md transition"><Plus className="h-4 w-4" /></button>
                    <div className="text-center text-sm font-bold">{item.quantity}</div>
                    <button onClick={() => updateQuantity(item.product.id!, -1)} className="p-1 hover:bg-white/20 rounded-md transition"><Minus className="h-4 w-4" /></button>
                  </div>
                  <div className="flex-1 py-1">
                    <div className="font-semibold text-sm leading-tight mb-1">{item.product.name}</div>
                    <div className="text-white/50 text-xs">${item.product.price.toFixed(2)} each</div>
                  </div>
                  <div className="font-bold py-1">${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Totals */}
          <div className="p-6 bg-white/5 border-t border-white/10">
            <div className="space-y-2 mb-6 text-sm font-medium">
              <div className="flex justify-between text-white/60"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-white/60"><span>GST (5%)</span><span>${gst.toFixed(2)}</span></div>
              <div className="flex justify-between text-white/60"><span>Service Tax (10%)</span><span>${serviceTax.toFixed(2)}</span></div>
              <div className="flex justify-between text-2xl font-bold text-white pt-3 border-t border-white/10 mt-2">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>

            {success ? (
              <div className="w-full bg-op-success text-emerald-950 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"><CheckCircle2 className="h-5 w-5" /> Order Sent to Kitchen!</div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => printBill()} disabled={cart.length === 0} className="bg-white/10 text-white p-4 rounded-2xl hover:bg-white/20 transition disabled:opacity-50" title="Print Bill"><Printer className="h-6 w-6" /></button>
                <button onClick={handleSendToKitchen} disabled={cart.length === 0 || isProcessing} className="flex-1 bg-op-purple text-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-op-purple/90 transition disabled:opacity-50">
                  {isProcessing ? "Processing..." : "Send to Kitchen"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HIDDEN PRINTABLE RECEIPT */}
      <div id="receipt-print-zone" className="hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * { visibility: hidden; }
            #receipt-print-zone, #receipt-print-zone * { visibility: visible; }
            #receipt-print-zone { position: absolute; left: 0; top: 0; width: 300px; padding: 20px; font-family: monospace; color: black; background: white; }
            .r-bold { font-weight: bold; }
            .r-center { text-align: center; }
            .r-divider { border-bottom: 1px dashed black; margin: 10px 0; }
            .r-flex { display: flex; justify-content: space-between; }
            .r-header { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 5px; }
            .r-sub { text-align: center; font-size: 12px; margin-bottom: 20px; }
          }
        `}} />
        <div className="r-header">{userData?.businessName || "RESTAURANT"}</div>
        <div className="r-sub">Receipt / Tax Invoice<br/>Date: {new Date().toLocaleString()}<br/>Served by: {userData?.name || role}</div>
        <div className="r-divider"></div>
        <table style={{width: '100%', fontSize: '14px', marginBottom: '10px'}}>
          <thead style={{borderBottom: '1px dashed black'}}>
            <tr><th style={{textAlign: 'left'}}>Item</th><th>Qty</th><th style={{textAlign: 'right'}}>Amt</th></tr>
          </thead>
          <tbody>
            {cart.map(c => (
              <tr key={c.product.id}>
                <td style={{paddingTop:'5px'}}>{c.product.name}</td>
                <td style={{textAlign: 'center', paddingTop:'5px'}}>{c.quantity}</td>
                <td style={{textAlign: 'right', paddingTop:'5px'}}>${(c.product.price * c.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="r-divider"></div>
        <div className="r-flex"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="r-flex"><span>GST (5%)</span><span>${gst.toFixed(2)}</span></div>
        <div className="r-flex"><span>Service Tax (10%)</span><span>${serviceTax.toFixed(2)}</span></div>
        <div className="r-divider"></div>
        <div className="r-flex r-bold" style={{fontSize: '18px'}}><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
        <div className="r-divider"></div>
        <div className="r-center" style={{marginTop: '20px', fontSize: '12px'}}>Thank you for dining with us!</div>
      </div>

    </div>
  );
}
