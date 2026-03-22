import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const LowStockWidget = () => {
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products/low-stock")
      .then(res => res.json())
      .then(data => setLowStockItems(data))
      .catch(err => console.error("Alert System Offline"));
  }, []);

  if (lowStockItems.length === 0) return (
    <div className="p-8 border border-white/5 bg-green-500/5 text-green-500 text-[10px] font-bold uppercase tracking-widest text-center">
      All Systems Nominal: Stock Levels Sufficient [cite: 536]
    </div>
  );

  return (
    <div className="p-8 border border-red-500/20 bg-red-500/5 backdrop-blur-md relative overflow-hidden group">
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }} 
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-red-500/5 pointer-events-none" 
      />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 animate-pulse" />
          <h3 className="text-xs font-black tracking-[0.4em] uppercase text-red-500">Critical Stock Alerts [cite: 847]</h3>
        </div>
        <span className="text-[10px] font-mono text-red-500/50">{lowStockItems.length} ASSETS AT RISK</span>
      </div>

      <div className="space-y-4 relative z-10">
        {lowStockItems.map((item) => (
          <div key={item.id} className="p-4 bg-black/40 border border-white/5 hover:border-red-500/30 transition-all group/item">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-white/10 overflow-hidden">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-tight">{item.name}</p>
                  <p className="text-[9px] text-red-500 font-mono font-bold">CURRENT: {item.stockQuantity} UNITS </p>
                </div>
              </div>
              <button className="p-2 bg-white/5 hover:bg-red-500 hover:text-white transition-all text-red-500 rounded-sm">
                <ArrowRight size={14} />
              </button>
            </div>

            {/* AI PREDICTION PLACEHOLDER (Ready for Python Integration) [cite: 887, 889] */}
            <div className="pt-4 border-t border-white/5 flex justify-between items-center opacity-60 group-hover/item:opacity-100 transition-opacity">
               <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  <TrendingUp size={12} className="text-[#D4AF37]" />
                  AI Forecast: <span className="text-white">Calculating...</span> 
               </div>
               <span className="text-[9px] text-[#D4AF37] font-bold uppercase">View Analysis</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockWidget;