import React from 'react';
import { Sparkles, ShieldCheck, Globe, Headphones, ArrowRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export default function AnnouncementBar({ onOpenAuth }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <aside aria-label="Store Announcements" className="bg-[#191919] text-[#F8F6F1] text-[11px] sm:text-xs py-2 px-4 border-b border-[#2C2C2C] font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        
        {/* Left: Approved Business Highlights */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
          <span className="flex items-center gap-1.5 text-[#C49A3A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Genuine Gemstone Collections &bull; Factory Wholesale Pricing</span>
          </span>
          <span className="hidden lg:inline-block text-[#444444]">|</span>
          <span className="hidden lg:flex items-center gap-1.5 text-[#D0C9BD]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C49A3A]" />
            <span>Certified Lead-Free Pewter &amp; 100% Authentic Minerals</span>
          </span>
          <span className="hidden xl:inline-block text-[#444444]">|</span>
          <span className="hidden xl:flex items-center gap-1 text-[#E0DDD5]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
            <span>New 2026 Mineral Shipments Just Arrived</span>
          </span>
        </div>

        {/* Right: Currency Selector & Customer Support */}
        <div className="flex items-center gap-4 sm:gap-5 text-[#D0C9BD]">
          
          {/* Customer Support Desk Link */}
          <span className="hidden sm:flex items-center gap-1.5 text-[#E0DDD5] hover:text-[#C49A3A] transition-colors cursor-pointer">
            <Headphones className="w-3.5 h-3.5 text-[#C49A3A]" />
            <span>International Support Desk</span>
          </span>

          {/* Currency Selector */}
          <div className="flex items-center gap-1.5 bg-[#252525] px-2.5 py-1 rounded-md border border-[#3A3A3A]">
            <Globe className="w-3 h-3 text-[#C49A3A]" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-[#F8F6F1] cursor-pointer focus:outline-none text-[11px] font-semibold"
              aria-label="Select currency"
            >
              <option value="USD" className="bg-[#191919] text-white">USD ($)</option>
              <option value="EUR" className="bg-[#191919] text-white">EUR (€)</option>
              <option value="GBP" className="bg-[#191919] text-white">GBP (£)</option>
              <option value="INR" className="bg-[#191919] text-white">INR (₹)</option>
            </select>
          </div>

          {/* Wholesale B2B Portal Button */}
          <button
            onClick={onOpenAuth}
            className="text-[#C49A3A] hover:text-white transition-colors cursor-pointer font-semibold flex items-center gap-1 text-[11px]"
          >
            <span>B2B Portal</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </aside>
  );
}
