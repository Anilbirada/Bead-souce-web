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
      className="bg-[#40362F] text-[#FAF8F3] text-[11px] sm:text-xs py-2 px-4 border-b border-[#52463D] font-medium tracking-wide select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        
        {/* Left: Rotating Sophisticated Luxury Message */}
        <div className="flex items-center gap-3 justify-center md:justify-start min-h-[22px]">
          <div className="flex items-center gap-2 transition-all duration-500 animate-fade-in key={currentIdx}">
            <span className="w-5 h-5 rounded-full bg-[#C6A66B]/20 flex items-center justify-center text-[#C6A66B]">
              <IconComponent className="w-3 h-3" />
            </span>
            <span className="font-medium text-[#FAF8F3]">
              {activeAnnouncement.text}
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#C6A66B]/15 text-[#D8C49A] text-[10px] font-semibold uppercase tracking-wider border border-[#C6A66B]/30">
              {activeAnnouncement.tag}
            </span>
          </div>
        </div>

        {/* Right: Currency Selector, Support Desk & B2B Portal */}
        <div className="flex items-center gap-4 sm:gap-6 text-[#EDE5D8]">
          
          {/* Customer Support Desk Link */}
          <span className="hidden sm:flex items-center gap-1.5 text-[#EDE5D8] hover:text-[#C6A66B] transition-colors cursor-pointer text-[11px]">
            <Headphones className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Atelier Concierge: +1 (800) 555-0199</span>
          </span>

          {/* Currency Selector */}
          <div className="flex items-center gap-1.5 bg-[#4F433A] px-2.5 py-1 rounded-md border border-[#63554A]">
            <Globe className="w-3 h-3 text-[#C6A66B]" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-[#FAF8F3] cursor-pointer focus:outline-none text-[11px] font-semibold"
              aria-label="Select currency"
            >
              <option value="USD" className="bg-[#40362F] text-[#FAF8F3]">USD ($)</option>
              <option value="EUR" className="bg-[#40362F] text-[#FAF8F3]">EUR (€)</option>
              <option value="GBP" className="bg-[#40362F] text-[#FAF8F3]">GBP (£)</option>
              <option value="INR" className="bg-[#40362F] text-[#FAF8F3]">INR (₹)</option>
            </select>
          </div>

          {/* Wholesale B2B Portal Button */}
          <button
            onClick={onOpenAuth}
            className="text-[#C6A66B] hover:text-[#FAF8F3] transition-colors cursor-pointer font-semibold flex items-center gap-1 text-[11px] group"
          >
            <span>B2B Wholesale Portal</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </aside>
  );
}
