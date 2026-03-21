import React from 'react';
import { Hammer, Facebook, Instagram } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <Hammer className="text-[#D4AF37] group-hover:rotate-12 transition-transform" size={24} />
          <span className="text-lg font-black tracking-tighter text-white uppercase">
            Athukorala <span className="text-[#D4AF37]">Traders</span>
          </span>
        </div>

        {/* Social Links - New Addition */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 border-r border-white/10 pr-6 mr-2">
            <a 
              href="https://www.facebook.com/p/Athukorala-Traders-Pvt-Ltd-100050930484929/" 
              target="_blank" 
              rel="noreferrer"
              className="text-gray-400 hover:text-[#1877F2] transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a 
              href="https://www.instagram.com/officialthenx03/" 
              target="_blank" 
              rel="noreferrer"
              className="text-gray-400 hover:text-[#E4405F] transition-colors"
            >
              <Instagram size={20} />
            </a>
          </div>
          
          <button className="bg-[#D4AF37] text-black px-6 py-2 rounded-none font-black text-xs tracking-widest hover:bg-white transition-all">
            STAFF PORTAL
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;