import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Bell, ClipboardList, CheckCircle, Clock, 
  LayoutDashboard, Activity, LogOut, ChevronRight 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const StaffDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Staff Member"}');

  useEffect(() => {
    fetch("http://localhost:8080/api/notices/staff")
      .then(res => res.json())
      .then(data => {
        setNotices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Notice system unreachable.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Animation Variants
  const containerVars = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-10 relative z-50 hidden md:flex"
      >
        <div className="flex items-center gap-4 px-2">
          <div className="p-2 bg-[#D4AF37] rounded-sm">
            <Activity className="text-black" size={24} />
          </div>
          <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Operational Portal" active={true} />
          <NavItem icon={<Package size={18}/>} label="Inventory Control" onClick={() => navigate('/staff/adjust-stock')} />
          <NavItem icon={<ClipboardList size={18}/>} label="Order Queue" onClick={() => navigate('/admin/orders')} />
          <NavItem icon={<Bell size={18}/>} label="Internal Notices" />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-gray-500 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-widest group">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Terminate Session
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN INTERFACE --- */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full -z-10" />

        <header className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4">Operational Portal</p>
            <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">
              Welcome, <br /> <span className="text-transparent stroke-text">{user.name.split(' ')[0]}</span>
            </h1>
          </motion.div>

          <div className="text-right pb-2">
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-2">Shift Status</p>
            <div className="flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-6 py-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Active Session</span>
            </div>
          </div>
        </header>

        <motion.div 
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* LEFT: MANAGEMENT NOTICES */}
          <motion.div variants={itemVars} className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-[#D4AF37]" size={16} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Management Notices</h3>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="h-20 bg-white/5 animate-pulse border border-white/5" />
              ) : notices.length > 0 ? notices.map((notice) => (
                <div key={notice.id} className="p-6 bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-[#D4AF37] opacity-50" />
                  <h4 className="text-[#D4AF37] text-[11px] font-black uppercase mb-2 tracking-widest">{notice.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">{notice.message}</p>
                  <button className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-gray-500 group-hover:text-white transition-colors">
                    <CheckCircle size={12} /> Acknowledge Receipt
                  </button>
                </div>
              )) : (
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest border border-dashed border-white/10 p-10 text-center">No active broadcasts.</p>
              )}
            </div>
          </motion.div>

          {/* RIGHT: OPERATIONAL TOOLS */}
          <motion.div variants={itemVars} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <OpCard 
              icon={<Package size={32}/>} 
              title="Inventory Control" 
              desc="Update stock quantities, register hardware assets, and sync warehouse registries." 
              action="Manage Stock"
              onClick={() => navigate('/staff/adjust-stock')}
            />
            <OpCard 
              icon={<ClipboardList size={32}/>} 
              title="Order Processing" 
              desc="Monitor active customer settlements and manage deployment statuses." 
              action="View Queue"
              onClick={() => navigate('/admin/orders')}
            />
          </motion.div>
        </motion.div>

        <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-4 transition-all text-[11px] font-bold tracking-[0.2em] uppercase ${active ? 'bg-[#D4AF37] text-black shadow-[0_10px_30px_rgba(212,175,55,0.15)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

const OpCard = ({ icon, title, desc, action, onClick }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-10 bg-white/[0.01] border border-white/5 hover:bg-[#D4AF37]/5 transition-all group flex flex-col items-start"
  >
    <div className="text-[#D4AF37] mb-8 p-4 bg-black border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors">
      {icon}
    </div>
    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{title}</h3>
    <p className="text-xs text-gray-500 mb-10 leading-relaxed">{desc}</p>
    <button 
      onClick={onClick}
      className="w-full py-4 border border-[#D4AF37]/30 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-2"
    >
      {action} <ChevronRight size={14} />
    </button>
  </motion.div>
);

export default StaffDashboard;