import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, 
  Tag, Truck, Sparkles, ChevronUp, ChevronDown 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import SupplierContactCard from '../components/SupplierContactCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [gallery, setGallery] = useState([]);

  // Retrieve User Identity from local storage
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Guest"}');

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        // Sync gallery with the main image
        setGallery([data.imageUrl, data.imageUrl, data.imageUrl]);
      })
      .catch(err => toast.error("Hardware registry sync failed"));
  }, [id]);

  // --- NEW: PURCHASE INITIALIZATION PROTOCOL ---
  const handleInitializePurchase = async () => {
    if (user.name === "Guest") {
      toast.error("AUTHENTICATION REQUIRED: LOG IN TO PROCEED");
      return;
    }

    const loadingToast = toast.loading("Syncing with Purchase Registry...");
    try {
      const response = await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          productId: product.id, 
          quantity: 1 
        }),
      });

      if (response.ok) {
        toast.success("Asset Verified. Redirecting to Payment...", { id: loadingToast });
        // Redirecting to payment/checkout page as requested
        setTimeout(() => navigate('/checkout'), 1000);
      } else {
        toast.error("Registry Refused Purchase Data", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Connection Failed: Backend Offline", { id: loadingToast });
    }
  };

  if (!product) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#D4AF37] tracking-[0.5em] uppercase text-[10px] font-black">
      Decoding Asset Protocol...
    </div>
  );

  const hasDiscount = product?.discountedPrice && product.discountedPrice < product.price;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 font-sans text-left relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[180px] rounded-full -z-10 pointer-events-none" />

      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-3 text-gray-500 hover:text-[#D4AF37] transition-all mb-16 uppercase text-[10px] font-black tracking-[0.4em] group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
        Return to Catalog Registry
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* SIDE SLIDE BAR (THUMBNAILS) */}
        <div className="hidden lg:flex lg:col-span-1 flex-col gap-4 items-center">
          <button className="text-gray-700 hover:text-[#D4AF37] transition-colors"><ChevronUp size={20}/></button>
          <div className="flex flex-col gap-5">
            {gallery.map((img, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveImg(idx)}
                className={`w-20 h-20 border bg-black cursor-pointer transition-all duration-500 p-2 overflow-hidden flex items-center justify-center ${activeImg === idx ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/5 opacity-30 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-contain" alt={`View ${idx}`} />
              </motion.div>
            ))}
          </div>
          <button className="text-gray-700 hover:text-[#D4AF37] transition-colors"><ChevronDown size={20}/></button>
        </div>

        {/* MAIN VISUAL CANVAS */}
        <div className="lg:col-span-5 relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeImg}
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="aspect-square bg-white/[0.01] border border-white/5 p-12 relative overflow-hidden group shadow-2xl backdrop-blur-sm"
            >
              {hasDiscount && (
                <div className="absolute top-0 left-0 bg-[#D4AF37] text-black px-6 py-3 font-black uppercase tracking-widest text-[10px] z-10 flex items-center gap-2">
                  <Sparkles size={14} className="animate-pulse" /> Promotion Active
                </div>
              )}
              <img 
                src={gallery[activeImg]} 
                alt={product.name} 
                className="w-full h-full object-contain grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" 
              />
            </motion.div>
          </AnimatePresence>

          <div className="hidden lg:block mt-12">
            <div className="flex items-center gap-3 mb-6">
              <Truck size={14} className="text-[#D4AF37]" />
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-500 opacity-60">Logistics Source</h3>
            </div>
            <div className="bg-[#080808] border border-white/5 p-8 shadow-xl hover:border-[#D4AF37]/20 transition-colors">
              <SupplierContactCard supplier={product.supplier} />
            </div>
          </div>
        </div>

        {/* DATA ARCHITECTURE & SPECS */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#D4AF37] text-black px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter">Verified Asset</span>
              <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase">{product.category}</p>
            </div>
            <h1 className="text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-12">
              {product.name}
            </h1>
            
            <div className="p-10 border border-white/5 bg-white/[0.01] relative shadow-2xl overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37] opacity-20 group-hover:opacity-100 transition-opacity" />
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4">Industrial Valuation Protocol</p>
              <div className="flex items-baseline gap-8">
                <span className="text-6xl font-mono font-black text-white tracking-tighter">
                  LKR {hasDiscount ? product.discountedPrice.toLocaleString() : product.price?.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-2xl font-mono text-gray-700 line-through decoration-[#D4AF37]/40 decoration-2 italic">
                    LKR {product.price?.toLocaleString()}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <div className="mt-6 inline-flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] px-4 py-2 font-black uppercase tracking-widest">
                  <Tag size={12} /> Verified Protocol Discount Applied
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-12 mb-16">
            <div className="text-left">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Registry Description</p>
              <p className="text-gray-400 leading-relaxed text-sm max-w-xl font-medium border-l border-white/10 pl-6 italic">
                {product.description || "Technical registry data for this asset is currently being verified."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-[#080808] border border-white/5 flex flex-col gap-2">
                <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">Registry Status</p>
                <p className={`text-[11px] font-black uppercase tracking-widest ${product.stockQuantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} Units Secured` : 'Asset Depleted'}
                </p>
              </div>
              <div className="p-6 bg-[#080808] border border-white/5 flex flex-col gap-2">
                <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">Authenticity</p>
                <p className="text-[11px] font-black uppercase text-white flex items-center gap-2 tracking-widest">
                  <ShieldCheck size={14} className="text-[#D4AF37]" /> Athukorala Certified
                </p>
              </div>
            </div>
          </motion.div>

          {/* INITIALIZE PURCHASE BUTTON (NOW FUNCTIONAL) */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-auto flex gap-5">
            <button 
              onClick={handleInitializePurchase}
              className="flex-1 bg-[#D4AF37] text-black py-7 font-black uppercase tracking-[0.5em] text-[11px] flex items-center justify-center gap-4 hover:bg-white hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)] transition-all group"
            >
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" /> Initialize Purchase
            </button>
            <button className="px-12 border border-white/10 text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all bg-white/[0.02]">
                <Tag size={24} />
            </button>
          </motion.div>
        </div>
      </div>
      
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
    </div>
  );
};

export default ProductDetail;