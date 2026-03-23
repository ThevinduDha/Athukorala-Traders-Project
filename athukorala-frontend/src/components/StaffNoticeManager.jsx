import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, ShieldAlert, Terminal, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StaffNoticeManager = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Encrypting Broadcast Data...");
    try {
      const res = await fetch("http://localhost:8080/api/notices/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Internal Notice Dispatched", { id: loadingToast });
        reset();
      }
    } catch (err) {
      toast.error("Network Failure: Could not reach staff server.", { id: loadingToast });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-10 border border-[#D4AF37]/20 bg-black/40 backdrop-blur-3xl relative overflow-hidden"
    >
      {/* Decorative BG element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full" />

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30">
            <ShieldAlert className="text-[#D4AF37]" size={20} />
          </div>
          <h3 className="text-xs font-black tracking-[0.4em] uppercase text-[#D4AF37]">Staff Broadcast Protocol</h3>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-bold text-gray-600 uppercase tracking-widest">
          <Terminal size={10} /> Secure Encryption: Active
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black block">Notice Designation</label>
          <input 
            {...register("title", { required: true })} 
            required
            placeholder="E.G. EMERGENCY WAREHOUSE AUDIT"
            className="w-full bg-white/[0.03] border border-white/10 p-5 focus:border-[#D4AF37] outline-none text-xs uppercase tracking-widest font-bold placeholder:text-gray-700 transition-all"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black block">Operational Instructions</label>
            <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">Plaintext Transmission</span>
          </div>
          <textarea 
            {...register("message", { required: true })} 
            required
            placeholder="ENTER FULL DETAILS AND REQUIRED STAFF ACTIONS..."
            className="w-full bg-white/[0.03] border border-white/10 p-5 focus:border-[#D4AF37] outline-none text-xs h-40 uppercase leading-relaxed font-medium placeholder:text-gray-800 transition-all resize-none"
          />
        </div>

        <div className="p-4 bg-red-500/5 border border-red-500/10 flex items-center gap-4 mb-2">
           <AlertTriangle size={16} className="text-red-500 shrink-0" />
           <p className="text-[8px] font-bold text-gray-500 uppercase leading-tight tracking-widest">
             Alert: Dispatched notices cannot be recalled. Verify all information before initializing the broadcast.
           </p>
        </div>

        <button className="w-full py-5 bg-[#D4AF37] text-black font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_10px_30px_rgba(212,175,55,0.1)] group">
          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Initialize Broadcast
        </button>
      </form>
    </motion.div>
  );
};

export default StaffNoticeManager;