import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-[#0A0A0A] border border-red-500/20 p-10 relative shadow-[0_0_50px_rgba(239,68,68,0.1)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <AlertTriangle className="text-red-500" size={32} />
          </div>

          <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-white">Confirm Deletion</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed mb-10">
            You are about to permanently remove <span className="text-white font-bold">"{itemName}"</span> from the inventory registry. This action cannot be undone.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button 
              onClick={onClose}
              className="py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={14} /> Purge Asset
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmModal;