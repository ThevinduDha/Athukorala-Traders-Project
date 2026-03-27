import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Eye, Home, Package, Heart, 
  User, Activity, LogOut, X, Trash2, Plus, Minus, 
  CreditCard, Tag, Sparkles, LayoutGrid, ShieldCheck, Layers
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import CustomerAnnouncement from '../components/CustomerAnnouncement'; 

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Authorized Guest"}');

  // --- 1. INITIAL FETCH PROTOCOLS ---
  useEffect(() => {
    fetchProducts();
    if (user.id) fetchCart();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:8080/api/products/all")
      .then(res => res.json())
      .then(data => {
        setProducts(data || []);
        setFilteredProducts(data || []);
      })
      .catch(err => toast.error("Hardware Registry Offline"));
  };

  const fetchCart = async () => {
    if (!user.id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/cart/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error("Cart Sync Failure"); }
  };

  // --- 2. FILTERING ENGINE ---
  useEffect(() => {
    let result = Array.isArray(products) ? products : [];
    if (category !== "ALL") {
      result = result.filter(p => p.category?.toUpperCase() === category);
    }
    if (searchTerm) {
      result = result.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [category, searchTerm, products]);

  // --- 3. CART OPERATIONS (RESTORED ALL ORIGINAL LOGIC) ---
  const handleAddToCart = async (product) => {
    if (user.name.includes("Guest")) {
      toast.error("Authentication Required for Purchase");
      return;
    }
    if (product.stockQuantity <= 0) {
      toast.error("ASSET DEPLETED");
      return;
    }

    const loading = toast.loading("Syncing Cart Registry...");
    try {
      const res = await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1 }),
      });
      if (res.ok) {
        toast.success(`${product.name} Registered`, { id: loading });
        await fetchCart();
        setIsCartOpen(true);
      }
    } catch (err) { toast.error("Connection Failed", { id: loading }); }
  };

  const updateCartQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(`http://localhost:8080/api/cart/update-quantity/${itemId}?quantity=${newQty}`, {
        method: "PATCH"
      });
      if (res.ok) fetchCart();
    } catch (err) { toast.error("Update Failed"); }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/cart/remove/${itemId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Removed from registry");
        fetchCart();
      }
    } catch (err) { toast.error("Removal Failed"); }
  };

  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((acc, item) => {
      const price = item?.product?.discountedPrice || item?.product?.price || 0;
      return acc + (price * (item?.quantity || 0));
    }, 0);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* PREMIUM UNIFIED SLIDE BAR */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-12 relative z-50 hidden xl:flex h-screen sticky top-0"
      >
        <div className="flex items-center gap-4 px-2">
          <div className="p-2.5 bg-[#D4AF37] rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Activity className="text-black" size={22} />
          </div>
          <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
        </div>

        <nav className="flex flex-col gap-3">
          <NavItem icon={<LayoutGrid size={18}/>} label="Market Registry" active={true} />
          <NavItem icon={<Package size={18}/>} label="Order History" onClick={() => navigate('/order-history')} />
          <NavItem icon={<Heart size={18}/>} label="Curated List" />
          <NavItem icon={<User size={18}/>} label="Account Config" />
        </nav>

        <div className="mt-auto p-6 bg-white/[0.02] border border-white/5 rounded-sm mb-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Authenticated Identity</p>
          <p className="text-xs font-bold uppercase truncate text-[#D4AF37]">{user.name}</p>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-[0.3em] group">
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Terminate Session
        </button>
      </motion.aside>

      {/* MAIN INTERFACE */}
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto relative text-left">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[180px] rounded-full -z-10 pointer-events-none" />

        <CustomerAnnouncement />

        <header className="flex flex-col 2xl:flex-row justify-between items-start mb-24 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase">Auth Status: Secure Session</p>
            </div>
            <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-4">
              Premium <br /> <span className="text-transparent stroke-text">Industrial</span> Assets
            </h1>
            <p className="text-gray-500 max-w-lg text-sm tracking-wide uppercase font-medium">Standard and Promotional Hardware Frameworks.</p>
          </motion.div>

          <div className="flex flex-col gap-8 w-full 2xl:w-auto items-end">
            <div className="flex items-center gap-6">
              <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                  <input 
                      type="text" placeholder="QUERY REGISTRY..." 
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/5 border border-white/10 py-5 pl-12 pr-8 text-[11px] tracking-[0.2em] outline-none focus:border-[#D4AF37] w-full lg:w-[450px] uppercase font-bold transition-all shadow-2xl"
                  />
              </div>
              <button onClick={() => setIsCartOpen(true)} className="relative p-5 bg-[#D4AF37]/5 border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black transition-all">
                  <ShoppingCart size={20} />
                  <AnimatePresence>
                      {cartItems.length > 0 && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-5 h-5 bg-white text-black text-[9px] font-black flex items-center justify-center shadow-2xl border border-black">
                            {cartItems.length}
                        </motion.div>
                      )}
                  </AnimatePresence>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {["ALL", "ELECTRICAL", "PLUMBING", "TOOLS", "PAINTS"].map((cat) => (
                <button 
                  key={cat} onClick={() => setCategory(cat)}
                  className={`px-8 py-3 text-[10px] font-black tracking-[0.2em] uppercase border transition-all ${category === cat ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* PRODUCT GRID - STAGGERED ENTRANCE */}
        <motion.div 
          initial="initial" animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12"
        >
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} navigate={navigate} onAddToCart={() => handleAddToCart(product)} />
          ))}
        </motion.div>
      </main>

      {/* CART OVERLAY - TOTAL SYNCED & RESTORED */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#080808] border-l border-white/10 z-[101] flex flex-col shadow-2xl"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center text-left">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-[0.2em]">Cart Registry</h2>
                  <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em] mt-1">Industrial Purchase Framework</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-white/5 text-gray-400 border border-white/10"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-20"><ShoppingCart size={120} strokeWidth={1}/><p className="font-black uppercase tracking-[0.5em] mt-8">Empty Registry</p></div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-8 group border-b border-white/5 pb-10">
                      <div className="w-24 h-24 bg-black border border-white/5 p-4 shrink-0 shadow-inner group-hover:border-[#D4AF37]/30 transition-all">
                         <img src={item.product?.imageUrl} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-start mb-2 text-left">
                            <h4 className="text-sm font-black uppercase tracking-widest truncate pr-6">{item.product?.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        </div>
                        <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-4">{item.product?.category}</p>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 border border-white/10 shadow-lg">
                              <Minus size={12} className="cursor-pointer hover:text-[#D4AF37]" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} />
                              <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                              <Plus size={12} className="cursor-pointer hover:text-[#D4AF37]" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} />
                            </div>
                            <p className="font-mono text-base font-black">LKR {((item.product?.discountedPrice || item.product?.price) * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-10 bg-white/[0.02] border-t border-white/10 text-left">
                <div className="flex justify-between items-end mb-10">
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-3">Grand Total Valuation</p>
                    <p className="text-5xl font-black text-[#D4AF37] tracking-tighter">LKR {calculateTotal().toLocaleString()}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <ShieldCheck size={24} className="text-green-500 mb-2" />
                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">Authorized Secure</p>
                  </div>
                </div>
                <button onClick={() => { localStorage.setItem("lastCartTotal", calculateTotal()); navigate('/checkout'); }} className="w-full bg-[#D4AF37] text-black py-6 text-xs font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-xl flex items-center justify-center gap-4">
                  <CreditCard size={18} /> Initialize Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-5 px-8 py-5 transition-all text-[11px] font-black tracking-[0.3em] uppercase group ${active ? 'bg-[#D4AF37] text-black shadow-2xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
      <span className={active ? 'text-black' : 'group-hover:text-[#D4AF37]'}>{icon}</span> {label}
    </button>
);

const ProductCard = ({ product, navigate, onAddToCart }) => {
  const hasDiscount = product?.discountedPrice && product.discountedPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0;

  return (
    <motion.div 
      variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
      whileHover={{ y: -12, borderColor: 'rgba(212, 175, 55, 0.4)' }}
      className="group relative bg-[#080808] border border-white/5 p-0 flex flex-col h-full overflow-hidden shadow-2xl"
    >
      <div className="relative aspect-[4/5] bg-black border-b border-white/5 overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-0 left-0 z-20 bg-[#D4AF37] text-black px-5 py-3 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={14} className="animate-pulse" /> -{discountPercent}% OFF
          </div>
        )}
        <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" alt="" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-5">
           <button onClick={() => navigate(`/product/${product.id}`)} className="p-5 bg-white/10 hover:bg-[#D4AF37] hover:text-black border border-white/20 transition-all rounded-full"><Eye size={22}/></button>
           <button onClick={onAddToCart} className="p-5 bg-white/10 hover:bg-[#D4AF37] hover:text-black border border-white/20 transition-all rounded-full"><ShoppingCart size={22}/></button>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1 text-left">
        <div className="mb-6">
            <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase mb-2 opacity-60 flex items-center gap-2"><Layers size={12} /> {product.category}</p>
            <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">{hasDiscount ? "Special Protocol Pricing" : "Registry Asset Valuation"}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-mono font-black tracking-tighter text-white">
              LKR {hasDiscount ? product.discountedPrice.toLocaleString() : product.price.toLocaleString()}
            </span>
            {hasDiscount && <span className="text-xs text-gray-700 line-through font-mono">{product.price.toLocaleString()}</span>}
          </div>
        </div>

        <button onClick={onAddToCart} className="w-full mt-8 py-4 bg-white/5 border border-white/10 group-hover:bg-[#D4AF37] group-hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
          <Plus size={14} /> ADD TO CART
        </button>
      </div>
    </motion.div>
  );
};

export default CustomerDashboard;