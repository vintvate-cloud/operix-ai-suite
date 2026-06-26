"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Plus, Minus, Trash2, Search, Receipt, Flame, Utensils, Coffee, CheckCircle2, BellRing, Printer, ShoppingBag, X, Send } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

type Product = { id?: string; name: string; price: number; category: string; description?: string };

export default function POSPage() {
  const { user, userData, activeProperty } = useAuth();
  const [menu, setMenu] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [tableOrRoom, setTableOrRoom] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Mobile Ticket Sheet State
  const [mobileTicketOpen, setMobileTicketOpen] = useState(false);

  const role = userData?.role || "Waiter";

  useEffect(() => {
    if (!user) return;
    
    // Fetch Menu from the unified 'menu' collection (used by Menu Editor)
    let qMenu = query(collection(db, "menu"), where("ownerId", "==", user.uid));
    if (activeProperty) {
      qMenu = query(collection(db, "menu"), where("ownerId", "==", user.uid), where("propertyId", "==", activeProperty));
    }
    
    const unsubMenu = onSnapshot(qMenu, (snap) => {
      const items = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          name: data.itemName || data.name || "Unnamed Item",
          price: Number(data.price) || 0,
          category: data.category || "General",
          description: data.description || ""
        } as Product;
      });
      setMenu(items);
    });

    // Fetch active orders for KDS / Waiter notifications
    const qOrders = query(collection(db, "orders"), where("ownerId", "==", user.uid));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      let ords = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (activeProperty) ords = ords.filter(o => !o.propertyId || o.propertyId === activeProperty);
      setOrders(ords.sort((a, b) => b.createdAt - a.createdAt));
    });

    return () => { unsubMenu(); unsubOrders(); };
  }, [user, activeProperty]);

  const categories = ["All", ...Array.from(new Set(menu.map(m => m.category)))];

  const filteredMenu = menu.filter(p => 
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (cat: string) => {
    if (cat?.toLowerCase().includes("drink") || cat?.toLowerCase().includes("beverage")) return Coffee;
    if (cat?.toLowerCase().includes("main") || cat?.toLowerCase().includes("grill")) return Flame;
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

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
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
        roomNumber: tableOrRoom || "Dine-in", // Mapped to roomNumber field so Front Desk billing can capture it
        tableNumber: tableOrRoom || "Counter",
        items: cart.map(c => ({ id: c.product.id, name: c.product.name, price: c.product.price, qty: c.quantity })),
        subtotal, gst, serviceTax, total,
        status: "Preparing", // Sent directly to Chef KDS
        waiterName: userData?.name || role,
        createdAt: Date.now()
      });
      setSuccess(true);
      setTimeout(() => { 
        setSuccess(false); 
        setCart([]); 
        setTableOrRoom(""); 
        setMobileTicketOpen(false);
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const printBill = () => {
    const printContent = document.getElementById('receipt-print-zone');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const readyOrders = orders.filter(o => o.status === "Ready");

  // Reusable Ticket UI for both Desktop Sidebar and Mobile Bottom Sheet
  const TicketContent = () => (
    <div className="flex flex-col h-full bg-foreground text-background">
      <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-wide">Current Order</h2>
          <p className="text-xs text-white/60 mt-0.5">{totalItems} items selected</p>
        </div>
        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="text-rose-400 hover:bg-white/10 p-2 rounded-full transition" title="Clear Ticket">
              <Trash2 className="h-5 w-5" />
            </button>
          )}
          <button onClick={() => setMobileTicketOpen(false)} className="lg:hidden text-white/60 hover:text-white p-2 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/30 text-center py-12">
            <Receipt className="h-12 w-12 mb-3 opacity-40" />
            <p className="text-sm">Tap menu items to add to order</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.product.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 bg-black/40 rounded-xl px-2 py-1 shrink-0">
                <button onClick={() => updateQuantity(item.product.id!, -1)} className="p-1 hover:text-rose-400 transition"><Minus className="h-3.5 w-3.5" /></button>
                <span className="text-sm font-bold w-5 text-center font-mono">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id!, 1)} className="p-1 hover:text-emerald-400 transition"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{item.product.name}</div>
                <div className="text-white/50 text-xs">${item.product.price.toFixed(2)}</div>
              </div>
              <div className="font-bold text-sm font-mono">${(item.product.price * item.quantity).toFixed(2)}</div>
            </div>
          ))
        )}
      </div>

      {/* Checkout Totals */}
      <div className="p-5 sm:p-6 bg-black/20 border-t border-white/10 space-y-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider mb-1 block">Table # / Room #</label>
          <input 
            type="text" 
            placeholder="e.g. Table 4, Poolside, Room 304" 
            value={tableOrRoom} 
            onChange={(e) => setTableOrRoom(e.target.value)} 
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm focus:border-op-purple transition placeholder:text-white/30 font-medium" 
          />
        </div>

        <div className="space-y-1.5 text-xs font-medium pt-2 border-t border-white/5">
          <div className="flex justify-between text-white/60"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-white/60"><span>GST & Taxes (15%)</span><span>${(gst + serviceTax).toFixed(2)}</span></div>
          <div className="flex justify-between text-xl font-display text-white pt-2 border-t border-white/10 mt-1">
            <span>Total</span><span className="font-mono">${total.toFixed(2)}</span>
          </div>
        </div>

        {success ? (
          <div className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="h-5 w-5" /> Fired to Kitchen!
          </div>
        ) : (
          <div className="flex gap-2 pt-2">
            <button onClick={printBill} disabled={cart.length === 0} className="bg-white/10 text-white p-3.5 rounded-xl hover:bg-white/20 transition disabled:opacity-40 shrink-0" title="Print Receipt">
              <Printer className="h-5 w-5" />
            </button>
            <button onClick={handleSendToKitchen} disabled={cart.length === 0 || isProcessing} className="flex-1 bg-op-purple text-foreground py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-40 shadow-lg shadow-op-purple/30">
              <Send className="h-4 w-4" /> {isProcessing ? "Sending..." : "Fire to Kitchen"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] relative pb-20 lg:pb-0">
      <PageHeader eyebrow="Point of Sale" title="Waiter Order Pad" />
      
      {/* Ready Notifications Bar */}
      {readyOrders.length > 0 && (
        <div className="bg-emerald-500 text-white p-4 rounded-2xl mb-6 flex items-center justify-between gap-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 min-w-0">
            <BellRing className="h-6 w-6 animate-bounce shrink-0" />
            <div className="truncate">
              <span className="font-bold block text-sm">Orders Ready for Serving!</span>
              <span className="text-xs opacity-90 truncate">{readyOrders.map(o => `Table ${o.tableNumber}`).join(", ")}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {readyOrders.map(o => (
              <button key={o.id} onClick={() => updateDoc(doc(db, "orders", o.id), { status: "Completed" })} className="bg-white text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition shadow">
                Serve #{o.tableNumber}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Responsive Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT: Menu Items Grid */}
        <div className="flex-1 w-full bg-card rounded-3xl border border-border p-5 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search menu items..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full bg-muted border border-border rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-op-purple transition" 
              />
            </div>
            
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition shrink-0 ${category === c ? "bg-op-purple text-foreground shadow-md shadow-op-purple/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {filteredMenu.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Utensils className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <h3 className="font-display text-2xl text-foreground mb-1">Menu is Empty</h3>
              <p className="text-sm max-w-sm mx-auto">No mock items found! Go to the <b>Menu Editor</b> tab to create your real restaurant dishes and drinks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenu.map(p => {
                const Icon = getIcon(p.category);
                const inCart = cart.find(c => c.product.id === p.id)?.quantity || 0;
                return (
                  <button key={p.id} onClick={() => addToCart(p)} className={`relative bg-background border rounded-2xl p-4 text-left transition-all hover:-translate-y-1 hover:shadow-md flex flex-col h-full group ${inCart > 0 ? "border-op-purple ring-1 ring-op-purple" : "border-border"}`}>
                    {inCart > 0 && (
                      <span className="absolute -top-2 -right-2 bg-op-purple text-foreground font-mono text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center shadow-md">
                        {inCart}
                      </span>
                    )}
                    <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-op-purple/10 text-muted-foreground group-hover:text-op-purple flex items-center justify-center mb-3 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-sm text-foreground line-clamp-1 mb-1">{p.name}</div>
                    {p.description && <div className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{p.description}</div>}
                    <div className="text-op-purple font-mono font-bold text-sm mt-auto pt-2 border-t border-border/50 flex justify-between items-center w-full">
                      <span>${p.price.toFixed(2)}</span>
                      <span className="text-[10px] uppercase font-sans font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">{p.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Desktop Ticket Section */}
        <div className="hidden lg:block w-[400px] xl:w-[440px] bg-foreground text-background rounded-3xl shadow-2xl overflow-hidden sticky top-24 h-[calc(100vh-8rem)] shrink-0">
          <TicketContent />
        </div>

      </div>

      {/* MOBILE FLOATING BOTTOM BAR (< lg) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-foreground text-background rounded-2xl p-4 shadow-2xl border border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-op-purple flex items-center justify-center text-foreground font-bold font-mono">
            {totalItems}
          </div>
          <div>
            <span className="text-xs text-white/60 block">Current Order</span>
            <span className="font-display text-xl font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileTicketOpen(true)}
          className="bg-op-purple text-foreground px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-op-purple/30 active:scale-95 transition flex items-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" /> Open Ticket
        </button>
      </div>

      {/* MOBILE TICKET BOTTOM SHEET DIALOG */}
      {mobileTicketOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full h-[90vh] bg-foreground rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
            <TicketContent />
          </div>
        </div>
      )}

      {/* HIDDEN PRINT RECEIPT ZONE */}
      <div id="receipt-print-zone" className="hidden">
        <div style={{fontFamily: 'monospace', padding: '20px', width: '300px', color: 'black', background: 'white'}}>
          <h2 style={{textAlign:'center', margin:0}}>{userData?.businessName || "HOTEL RESTAURANT"}</h2>
          <p style={{textAlign:'center', fontSize:'12px', color:'#666'}}>Order Slip / Receipt</p>
          <hr style={{borderTop:'1px dashed black'}}/>
          <p style={{fontSize:'12px'}}>Table/Room: <b>{tableOrRoom || "Dine-in"}</b><br/>Date: {new Date().toLocaleString()}</p>
          <hr style={{borderTop:'1px dashed black'}}/>
          <table style={{width:'100%', fontSize:'14px', textAlign:'left'}}>
            <thead><tr><th>Qty</th><th>Item</th><th style={{textAlign:'right'}}>Amt</th></tr></thead>
            <tbody>
              {cart.map(c => (
                <tr key={c.product.id}>
                  <td>{c.quantity}x</td>
                  <td>{c.product.name}</td>
                  <td style={{textAlign:'right'}}>${(c.product.price * c.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr style={{borderTop:'1px dashed black'}}/>
          <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'16px'}}>
            <span>TOTAL:</span><span>${total.toFixed(2)}</span>
          </div>
          <hr style={{borderTop:'1px dashed black'}}/>
          <p style={{textAlign:'center', fontSize:'10px'}}>Thank you!</p>
        </div>
      </div>

    </div>
  );
}
