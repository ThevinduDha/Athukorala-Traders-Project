import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Package, User, Heart, LogOut, Activity, 
  ArrowLeft, Clock, MapPin, ChevronRight, X, Info 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for Detail Modal
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Guest"}');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/orders/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        toast.error("Failed to retrieve transaction archives");
      } finally {
        setLoading(false);
      }
    };
    if (user.id) fetchOrders();
  }, [user.id]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-10 relative z-50 hidden md:flex"
      >
        <div className="flex items-center gap-4 px-2">
          <Activity className="text-[#D4AF37]" size={24} />
          <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={<Home size={18}/>} label="Home Catalog" onClick={() => navigate('/customer-dashboard')} />
          <NavItem icon={<Package size={18}/>} label="My Orders" active={true} />
          <NavItem icon={<Heart size={18}/>} label="Wishlist" />
          <NavItem icon={<User size={18}/>} label="Profile Settings" />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-gray-500 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-widest group">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Terminate Session
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto relative text-left">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full -z-10" />

        <header className="mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase mb-4">Transaction Archives</p>
            <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">
              Order <br /> <span className="text-transparent stroke-text">History</span>
            </h1>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20 text-[#D4AF37]"><Clock className="animate-spin" /></div>
        ) : (
          <motion.div 
            initial="initial" animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6 max-w-5xl"
          >
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onOpenDetails={() => setSelectedOrder(order)} />
            ))}
          </motion.div>
        )}

        {/* --- ORDER DETAIL MODAL --- */}
        <AnimatePresence>
          {selectedOrder && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 z-[101] p-10 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
                
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase mb-2">Detailed Specification</p>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">ATH-{selectedOrder.id}</h2>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-white/5 transition-colors text-gray-500 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8 mb-12">
                  <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-8">
                    <div>
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">{selectedOrder.status || 'PENDING'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Deployment Date</p>
                      <p className="text-[10px] font-black uppercase tracking-widest">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Package size={12} className="text-[#D4AF37]" /> Asset Manifest
                    </p>
                    <div className="max-h-48 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                      {/* Note: This assumes you have OrderItems mapped in your Order entity */}
                      {selectedOrder.orderItems?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-4">
                           <p className="text-[11px] font-bold uppercase tracking-tight">{item.productName} (x{item.quantity})</p>
                           <p className="text-[10px] font-mono text-gray-400">LKR {item.price?.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Grand Valuation</p>
                    <h3 className="text-3xl font-black text-[#D4AF37]">LKR {selectedOrder.total?.toLocaleString()}</h3>
                  </div>
                  <button className="px-8 py-4 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-2">
                    Generate Receipt
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; } .custom-scrollbar::-webkit-scrollbar { width: 2px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4AF37; }`}</style>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 px-6 py-4 transition-all text-[11px] font-bold tracking-[0.2em] uppercase ${active ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    {icon} {label}
  </button>
);

const OrderCard = ({ order, onOpenDetails }) => (
  <motion.div 
    variants={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } }}
    whileHover={{ x: 10 }}
    className="group relative bg-white/[0.02] border border-white/5 p-8 transition-all hover:bg-white/[0.04] hover:border-[#D4AF37]/30 flex flex-col md:flex-row justify-between items-center gap-8"
  >
    <div className="flex gap-10 items-center w-full md:w-auto">
      <div>
        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2"># Protocol ID</p>
        <h3 className="text-xl font-black font-mono tracking-tighter">ATH-{order.id}</h3>
      </div>
      <div className={`px-4 py-2 border ${order.status === 'COMPLETED' ? 'border-green-500/30 text-green-500' : 'border-[#D4AF37]/30 text-[#D4AF37]'} bg-black flex items-center gap-2`}>
        <Clock size={12} />
        <span className="text-[9px] font-black uppercase tracking-widest">{order.status || 'PENDING'}</span>
      </div>
    </div>
    <div className="flex-1 space-y-2 text-left">
      <div className="flex items-center gap-2 text-gray-400">
        <Activity size={14} className="text-[#D4AF37]" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Deployment: {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <MapPin size={14} />
        <p className="text-[9px] font-medium uppercase truncate max-w-xs">{order.address}</p>
      </div>
    </div>
    <div className="text-right w-full md:w-auto">
      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Authorized Total</p>
      <p className="text-2xl font-black text-[#D4AF37] tracking-tighter mb-4">LKR {order.total?.toLocaleString()}</p>
      <button onClick={onOpenDetails} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#D4AF37] transition-colors ml-auto">
        Details <ChevronRight size={14} />
      </button>
    </div>
  </motion.div>
);

export default OrderHistory;