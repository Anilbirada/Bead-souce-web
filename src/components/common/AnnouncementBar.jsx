import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Globe, Headphones, ArrowRight, Gem } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const LUXURY_ANNOUNCEMENTS = [
  {
    icon: Gem,
    text: 'Premium Wholesale Beads & Jewellery Supplies',
    tag: 'Direct Manufacturer Export'
  },
  {
    icon: Sparkles,
    text: 'Discover Exclusive Collections • Certified Genuine Minerals',
    tag: 'Artisan Quality'
  },
  {
    icon: ShieldCheck,
    text: 'Bulk Orders and Wholesale Enquiries Welcome • Tier Discounts up to 30%',
    tag: 'B2B Trade Network'
  }
];

export default function AnnouncementBar({ onOpenAuth }) {
  const { currency, setCurrency } = useCurrency();
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % LUXURY_ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeAnnouncement = LUXURY_ANNOUNCEMENTS[currentIdx];
  const IconComponent = activeAnnouncement.icon;

  return (
    <aside 
      aria-label="Store Announcements" 
      className="bg-[#292723] text-[#FAF8F3] text-xs sm:text-sm py-2 px-4 border-b border-[#3d3832] font-medium tracking-wide select-none font-['Manrope',sans-serif]"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Rotating Sophisticated Luxury Message */}
        <div className="flex items-center gap-3 justify-center md:justify-start min-h-[24px]">
          <div className="flex items-center gap-2.5 transition-all duration-500 animate-fade-in key={currentIdx}">
            <span className="w-5 h-5 rounded-full bg-[#C6A66B]/20 flex items-center justify-center text-[#C6A66B]">
              <IconComponent className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium text-[#FAF8F3] text-xs sm:text-sm">
              {activeAnnouncement.text}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#C6A66B]/20 text-[#C6A66B] text-xs font-bold uppercase tracking-wider border border-[#C6A66B]/30">
              {activeAnnouncement.tag}
            </span>
          </div>
        </div>

        {/* Right: Currency Selector, Support Desk & B2B Portal */}
        <div className="flex items-center gap-4 sm:gap-6 text-[#EDE5D8]">
          
          {/* Customer Support Desk Link */}
          <span className="hidden sm:flex items-center gap-1.5 text-[#EDE5D8] hover:text-[#C6A66B] transition-colors cursor-pointer text-xs">
            <Headphones className="w-4 h-4 text-[#C6A66B]" />
            <span>Atelier Concierge: +1 (800) 555-0199</span>
          </span>

          {/* Currency Display (USD Only) */}
          <div className="flex items-center gap-1.5 bg-[#1f1d1a] px-2.5 py-1 rounded-md border border-[#4d443b]">
            <Globe className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span className="text-[#FAF8F3] text-xs font-bold tracking-wide">USD ($)</span>
          </div>

          {/* Wholesale B2B Portal Button */}
          <button
            onClick={onOpenAuth}
            className="text-[#C6A66B] hover:text-white transition-colors cursor-pointer font-bold flex items-center gap-1 text-[11px] group"
          >
            <span>B2B Wholesale Portal</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </aside>
  );
}
