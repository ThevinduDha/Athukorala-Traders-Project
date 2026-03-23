import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Clock, User, Activity, 
  LayoutDashboard, Package, Users, Settings, LogOut, Globe, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuditLogView = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Administrator"}');

  useEffect(() => {
    fetch("http://localhost:8080/api/audit/logs")
      .then(res => res.json())
      .then(data => setLogs(Array.isArray(data) ? data : []))
      .catch(err => console.error("Security Archive Offline"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 } // Makes children appear one by one
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ x: -100 }} 
        animate={{ x: 0 }} 
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-10 relative z-50"
      >
        <div className="flex items-center gap-4 px-2">
          <motion.div 
            animate={{ rotate: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="p-2 bg-[#D4AF37] rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            <Activity className="text-black" size={24} />
          </motion.div>
          <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Command Center" onClick={() => navigate('/admin-dashboard')} />
          <NavItem icon={<Package size={18}/>} label="Inventory Stock" onClick={() => navigate('/admin-dashboard')} />
          <NavItem icon={<Users size={18}/>} label="Client Registry" onClick={() => navigate('/admin-dashboard')} />
          <NavItem icon={<ShieldAlert size={18}/>} label="Security Audit" active={true} />
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

      {/* MAIN CONTENT AREA */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-12 overflow-y-auto relative"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full -z-10" />

        <motion.header variants={itemVariants} className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert size={14} className="text-[#D4AF37]" />
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase">Security Protocol</p>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            System <span className="text-transparent stroke-text">Audit Log</span>
          </h1>
        </motion.header>

        {/* SECURITY STATS BAR */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatBox label="Total Actions Logged" val={`${logs.length} EVENTS`} />
          <StatBox label="Current Session" val={user.name} color="text-[#D4AF37]" border="border-l-[#D4AF37]" />
          <StatBox label="System Health" val="Encrypted" color="text-green-500" />
        </motion.div>

        {/* LOG TABLE VIEW */}
        <motion.div variants={itemVariants} className="border border-white/5 bg-white/[0.01] backdrop-blur-md">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 text-[10px] tracking-[0.3em] uppercase text-gray-500 font-bold">
                        <th className="p-6">Protocol / Action</th>
                        <th className="p-6">Operator</th>
                        <th className="p-6">Execution Details</th>
                        <th className="p-6 text-right">Timestamp</th>
                    </tr>
                </thead>
                <tbody className="text-xs">
                    {logs.map((log, index) => (
                        <motion.tr 
                            variants={itemVariants}
                            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)", x: 5 }}
                            key={log.id} 
                            className="border-b border-white/5 transition-all group cursor-default"
                        >
                            <td className="p-6">
                                <div className="flex items-center gap-3">
                                    <Activity size={14} className="text-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <span className="font-black uppercase tracking-widest">{log.action}</span>
                                </div>
                            </td>
                            <td className="p-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                {log.performedBy}
                            </td>
                            <td className="p-6 text-gray-500 italic font-medium">
                                "{log.details}"
                            </td>
                            <td className="p-6 text-right text-gray-600 font-mono text-[10px]">
                                {new Date(log.timestamp).toLocaleString()}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
      </motion.main>

      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

// HELPER COMPONENTS
const StatBox = ({ label, val, color = "text-white", border = "border-white/5" }) => (
  <motion.div 
    whileHover={{ scale: 1.02, backgroundColor: "rgba(212, 175, 55, 0.05)" }}
    className={`bg-white/[0.02] border ${border} p-6 transition-colors`}
  >
    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${color} uppercase`}>{val}</p>
  </motion.div>
);

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-4 transition-all text-[11px] font-bold tracking-[0.2em] uppercase ${active ? 'bg-[#D4AF37] text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

export default AuditLogView;