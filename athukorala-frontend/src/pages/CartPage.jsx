import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShieldCheck, Box, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8080/api/cart/user/${user.id}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Registry Sync Failed");
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // --- UPDATED: REFINED UPDATE QUANTITY LOGIC ---
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return; 

    try {
      // Logic: Path variable {id} followed by Query Parameter ?quantity=
      const res = await fetch(`http://localhost:8080/api/cart/update-quantity/${id}?quantity=${newQuantity}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        // Optimistic UI Update
        setCartItems(prev => prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        const msg = await res.text();
        toast.error(msg || "STOCK DEPLETED");
      }
    } catch (err) {
      toast.error("COMMUNICATION ERROR");
    }
  };

  const removeItem = async (id) => {
    const loading = toast.loading("Updating Registry...");
    try {
      const res = await fetch(`http://localhost:8080/api/cart/remove/${id}`, { 
        method: 'DELETE' 
      });
      
      if (res.ok) {
        setCartItems(prev => prev.filter(item => item.id !== id));
        toast.success("Asset Excised Successfully", { id: loading });
      } else {
        toast.error("Deletion Protocol Failed", { id: loading });
      }
    } catch (err) {
      toast.error("Connection Error: Registry Unreachable", { id: loading });
    }
  };

  const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const proceedToCheckout = () => {
    localStorage.setItem("lastCartTotal", total);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 font-sans selection:bg-[#D4AF37]">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4">Industrial Logistics</p>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Your <span className="text-transparent stroke-text">Manifest</span></h1>
          </motion.div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 border-b border-white/5 pb-2 transition-all">
            <ArrowLeft size={14} /> Resume Catalog Browsing
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode='popLayout'>
              {cartItems.length > 0 ? cartItems.map((item) => (
                <motion.div 
                  key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="group relative flex items-center gap-8 p-8 bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-[#D4AF37]/20 transition-all overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="w-24 h-24 bg-black border border-white/10 flex-shrink-0 relative overflow-hidden">
                    <img src={item.product.imageUrl || "https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png"} className="w-full h-full object-cover opacity-80" alt="" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-[8px] font-black text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 uppercase tracking-tighter">ID: {item.product.id}</span>
                       <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{item.product.category}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight truncate">{item.product.name}</h3>
                    <p className="text-gray-500 font-mono text-xs mt-1">UNIT PRICE: LKR {item.product.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-6 pr-8">
                     {/* PREMIUM QUANTITY CONTROLS */}
                     <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2 rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-red-500 transition-colors px-1"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-mono font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-[#D4AF37] hover:text-white transition-colors px-1"
                        >
                          <Plus size={14} />
                        </button>
                     </div>

                     <div className="text-right min-w-[120px]">
                        <p className="text-[9px] text-gray-600 font-bold uppercase mb-1">Line Total</p>
                        <p className="text-lg font-mono font-bold text-white">LKR {(item.product.price * item.quantity).toLocaleString()}</p>
                     </div>
                     <button onClick={() => removeItem(item.id)} className="p-4 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm">
                        <Trash2 size={16} />
                     </button>
                  </div>
                </motion.div>
              )) : (
                <div className="h-64 border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center gap-4 border-dashed">
                   <Box className="text-gray-800" size={48} />
                   <p className="text-[10px] font-black tracking-[0.4em] text-gray-600 uppercase">Registry Is Empty</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-10 sticky top-20">
               <h3 className="text-xs font-black tracking-[0.4em] uppercase text-[#D4AF37] mb-10 border-b border-[#D4AF37]/10 pb-6 flex justify-between">
                 Registry Summary <Zap size={14} />
               </h3>
               
               <div className="space-y-6 mb-12">
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <span>Active Entries</span>
                    <span className="text-white">{cartItems.length} Items</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <span>Total Payload Value</span>
                    <span className="text-white">LKR {total.toLocaleString()}</span>
                 </div>
               </div>

               <div className="mb-12">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-2">Final Authorized Amount</p>
                  <h2 className="text-5xl font-black tracking-tighter">LKR {total.toLocaleString()}</h2>
               </div>

               <button 
                 onClick={proceedToCheckout}
                 disabled={cartItems.length === 0}
                 className="w-full py-6 bg-[#D4AF37] text-black font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#E5C158] transition-all disabled:opacity-30 disabled:grayscale shadow-[0_20px_50px_rgba(212,175,55,0.15)]"
               >
                 <CreditCard size={18} /> Initialize Checkout Protocol
               </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.3); color: transparent; }`}</style>
    </div>
  );
};

export default CartPage;