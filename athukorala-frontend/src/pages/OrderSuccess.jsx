import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Download, Share2, Home } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.order || { id: "ATH-PROTO-001", total: 0 };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8 font-sans overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white/[0.02] border border-white/5 p-12 backdrop-blur-3xl relative overflow-hidden"
      >
        {/* GOLD ACCENT BAR */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <div className="text-center space-y-8">
          {/* ANIMATED ICON */}
          <div className="relative inline-block">
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(212,175,55,0.3)]"
            >
              <CheckCircle2 size={48} className="text-black" />
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 bg-[#D4AF37] rounded-full blur-2xl -z-10"
            />
          </div>

          {/* HEADINGS */}
          <div className="space-y-3">
            <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase">Transaction Authenticated</p>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">Order Confirmed</h1>
          </div>

          {/* PROTOCOL DETAILS */}
          <div className="bg-black/40 border border-white/5 p-6 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protocol ID</span>
              <span className="text-xs font-mono font-black text-white">#{orderData.id || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Settlement Amount</span>
              <span className="text-sm font-mono font-black text-[#D4AF37]">LKR {orderData.total?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Logistics Status</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Awaiting Dispatch</span>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-[10px] leading-relaxed uppercase font-bold tracking-widest">
            Your hardware assets have been registered for distribution. <br /> 
            You will receive a notification once the shipment initializes.
          </p>

          {/* ACTION GRID */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            <button className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest">
              <Download size={14} /> Save Invoice
            </button>
            <button className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest">
              <Share2 size={14} /> Share Receipt
            </button>
          </div>

          <button 
            onClick={() => navigate('/customer-dashboard')}
            className="w-full bg-[#D4AF37] text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_10px_40px_rgba(212,175,55,0.1)] flex items-center justify-center gap-3"
          >
            <Home size={16} /> Return to Home Base <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;