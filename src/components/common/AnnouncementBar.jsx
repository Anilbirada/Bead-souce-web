import React from 'react';
import { Phone, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export default function AnnouncementBar({ onOpenAuth }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="bg-[#1C1A17] text-[#D8D2C4] text-[11px] sm:text-xs py-2 px-4 border-b border-[#38332B] font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Wholesale value highlights */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
          <span className="flex items-center gap-1.5 text-[#E6C687]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>International Wholesale Pricing &bull; Tier Discounts up to 30% Off</span>
          </span>
          <span className="hidden lg:inline-block text-[#5A5449]">|</span>
          <span className="hidden lg:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C4A052]" />
            <span>Certified Lead-Free &amp; 100% Genuine Gemstones</span>
          </span>
        </div>

        {/* Right: Contact, Currency Toggle & B2B Portal */}
        <div className="flex items-center gap-5 text-[#B8B2A4]">
          <a 
            href="tel:+919845012399" 
            className="hidden sm:flex items-center gap-1.5 hover:text-[#E6C687] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#C4A052]" />
            <span>SP Bengaluru: +91 98450 12399</span>
          </a>

          {/* Currency Switcher */}
          <div className="flex items-center gap-1.5 bg-[#2B2721] px-2 py-0.5 rounded border border-[#3E382E]">
            <Globe className="w-3 h-3 text-[#C4A052]" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-[#E6C687] cursor-pointer focus:outline-none text-[11px] font-semibold"
              aria-label="Select currency"
            >
              <option value="USD" className="bg-[#2B2721] text-white">USD ($)</option>
              <option value="INR" className="bg-[#2B2721] text-white">INR (₹)</option>
            </select>
          </div>

          <button
            onClick={onOpenAuth}
            className="text-[#E6C687] hover:underline hover:text-white transition-colors cursor-pointer font-semibold"
          >
            Wholesale B2B Login
          </button>
        </div>
      </div>
    </div>
  );
}
