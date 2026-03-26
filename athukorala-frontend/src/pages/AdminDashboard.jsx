import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, Users, Settings, LogOut, 
  Activity, BarChart3, Bell, Search, ShieldCheck, 
  TrendingUp, ArrowUpRight, Globe, ShieldAlert, Clock,
  Percent, Tag 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddProductModal from './AddProductModal';
import InventoryList from './InventoryList';
import LowStockWidget from '../components/LowStockWidget';
import ClientRegistry from './ClientRegistry';
import StaffNoticeManager from '../components/StaffNoticeManager';
import DiscountSuggestionPanel from '../components/DiscountSuggestionPanel'; 
import PromotionManager from '../components/PromotionManager';
import ActivePromotionList from '../components/ActivePromotionList'; // Import the List component

// --- NEW COMPONENT: LIVE AUDIT FEED WIDGET ---
const AuditPreviewWidget = () => {
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = () => {
      fetch("http://localhost:8080/api/audit/logs")
        .then(res => res.json())
        .then(data => setRecentLogs(Array.isArray(data) ? data.slice(0, 4) : []))
        .catch(err => console.error("Audit Stream Offline"));
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 border border-white/5 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group min-h-[400px]">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37] opacity-30 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xs font-black tracking-[0.4em] uppercase text-gray-400">System Integrity • Live Feed</h3>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-green-500 tracking-widest uppercase">Live Data</span>
        </div>
      </div>
      <div className="space-y-6 text-left">
        {recentLogs.length > 0 ? recentLogs.map(log => (
          <div key={log.id} className="flex justify-between items-center border-b border-white/5 pb-4 group cursor-pointer hover:border-[#D4AF37]/30 transition-all">
            <div className="flex gap-5 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
              <div>
                <p className="text-sm font-bold tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors">{log.action}</p>
                <p className="text-[9px] text-gray-600 font-bold tracking-widest uppercase">{log.performedBy} — {log.details}</p>
              </div>
            </div>
            <span className="text-[9px] font-mono text-gray-500 uppercase">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        )) : (
            <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center py-20">Monitoring encrypted streams...</p>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('command'); 
  // TRIGGER FOR SYNCING MANAGER AND LIST
  const [promoRefreshTrigger, setPromoRefreshTrigger] = useState(0); 
  
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Administrator"}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const containerVars = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden text-left">
      
      {/* --- SIDEBAR --- */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-10 relative z-50"
      >
        <div className="flex items-center gap-4 px-2">
          <div className="p-2 bg-[#D4AF37] rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <Activity className="text-black" size={24} />
          </div>
          <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem 
            icon={<LayoutDashboard size={18}/>} 
            label="Command Center" 
            active={activeTab === 'command'} 
            onClick={() => setActiveTab('command')}
          />
          <NavItem 
            icon={<Package size={18}/>} 
            label="Inventory Stock" 
            active={activeTab === 'inventory'} 
            onClick={() => setActiveTab('inventory')}
          />
          <NavItem 
            icon={<Tag size={18}/>} 
            label="Promotions & Deals" 
            active={activeTab === 'promotions'} 
            onClick={() => setActiveTab('promotions')}
          />
          <NavItem 
            icon={<Users size={18}/>} 
            label="Client Registry" 
            active={activeTab === 'clients'} 
            onClick={() => setActiveTab('clients')}
          />
          <NavItem 
            icon={<ShieldAlert size={18}/>} 
            label="Security Audit" 
            onClick={() => navigate('/admin/audit-logs')}
          />
          <NavItem icon={<BarChart3 size={18}/>} label="Financials" />
          <NavItem icon={<Globe size={18}/>} label="Logistics" />
          <NavItem icon={<Settings size={18}/>} label="System Config" />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-gray-500 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-widest group">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Terminate Session
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN INTERFACE --- */}
      <main className="flex-1 p-12 overflow-y-auto relative text-left">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full -z-10" />

        <header className="flex justify-between items-start mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={14} className="text-[#D4AF37]" />
              <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase">Auth Level: Senior Admin</p>
            </div>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
              {activeTab === 'promotions' ? 'Promotion' : 'Welcome,'} <span className="text-transparent stroke-text">{activeTab === 'promotions' ? 'Registry' : user.name}</span>
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input type="text" placeholder="SEARCH REGISTRY..." className="bg-white/5 border border-white/10 py-3 pl-10 pr-6 text-[10px] tracking-widest outline-none focus:border-[#D4AF37]/50 transition-all w-64 uppercase font-bold" />
            </div>
            <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-[#D4AF37]/20 transition-all">
              <Bell size={20} className="text-[#D4AF37]" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#050505] rounded-full"></div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'command' && (
            <motion.div 
              key="command"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <motion.div variants={containerVars} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard icon={<Package/>} label="Active Inventory" val="14,208" sub="Units in stock" trend="+12.5%" />
                <StatCard icon={<TrendingUp/>} label="Daily Revenue" val="LKR 425K" sub="Verified Transactions" trend="+8.2%" />
                <StatCard icon={<Users/>} label="Total Clients" val="2,148" sub="Database Entries" trend="+4%" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <DiscountSuggestionPanel />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                <div className="lg:col-span-2 space-y-8">
                  <AuditPreviewWidget />
                  <StaffNoticeManager />
                </div>

                <div className="flex flex-col gap-8">
                  <LowStockWidget />
                  <div className="p-10 border border-white/5 bg-[#D4AF37]/5 backdrop-blur-md flex flex-col justify-between text-left">
                    <h3 className="text-xs font-black tracking-[0.4em] uppercase text-[#D4AF37] mb-8">Quick Operations</h3>
                    <div className="space-y-4">
                      <ActionButton label="Add New Product" onClick={() => setIsModalOpen(true)} />
                      <ActionButton label="Generate Report" onClick={() => navigate('/admin/reports')} />
                      <ActionButton label="Stock Audit View" onClick={() => navigate('/admin/audit-logs')} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: PROMOTION MANAGEMENT CRUD */}
          {activeTab === 'promotions' && (
            <motion.div 
              key="promotions" 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -30 }} 
              className="space-y-12"
            >
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <div className="xl:col-span-7">
                   {/* ON SUCCESS, TRIGGER REFRESH OF THE LIST */}
                   <PromotionManager onSuccess={() => setPromoRefreshTrigger(prev => prev + 1)} />
                </div>
                <div className="xl:col-span-5 bg-white/[0.02] border border-white/5 p-10 backdrop-blur-xl text-left">
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-8">Active Protocols</h3>
                   <div className="space-y-6">
                      <ActivePromotionList refreshTrigger={promoRefreshTrigger} />
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <InventoryList />
            </motion.div>
          )}

          {activeTab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ClientRegistry />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <AddProductModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-4 transition-all text-[11px] font-bold tracking-[0.2em] uppercase ${active ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

const StatCard = ({ icon, label, val, sub, trend }) => (
  <motion.div whileHover={{ y: -5, borderColor: 'rgba(212, 175, 55, 0.4)' }} className="p-10 border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-all group relative text-left">
    <div className="absolute top-8 right-8 text-[#D4AF37]/10 group-hover:text-[#D4AF37]/30 transition-colors">
      {React.cloneElement(icon, { size: 48 })}
    </div>
    <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">{label}</p>
    <h3 className="text-5xl font-black tracking-tighter mb-2">{val}</h3>
    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-6">{sub}</p>
    <div className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] bg-[#D4AF37]/5 w-fit px-3 py-1 border border-[#D4AF37]/10">
      <ArrowUpRight size={12} /> {trend}
    </div>
  </motion.div>
);

const ActionButton = ({ label, onClick }) => (
  <button onClick={onClick} className="w-full py-4 px-6 border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all text-left text-[10px] font-bold uppercase tracking-[0.2em] flex justify-between items-center group">
    {label} <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
  </button>
);

export default AdminDashboard;