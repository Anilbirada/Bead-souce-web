import React from 'react';
import { ShieldCheck, Truck, Gem, Award, Headphones, Sparkles, CheckCircle2 } from 'lucide-react';

export default function BeadsSourceAssuredBanner() {
  const pillars = [
    {
      icon: <Award className="w-6 h-6 text-[#014b92]" />,
      title: 'BeadsSource Assured',
      subtitle: '100% genuine tested minerals & lead-free pewter (<90ppm).'
    },
    {
      icon: <Truck className="w-6 h-6 text-[#014b92]" />,
      title: 'DHL Express Dispatch',
      subtitle: 'Fast 3-5 business day priority air freight worldwide with tracking.'
    },
    {
      icon: <Gem className="w-6 h-6 text-[#014b92]" />,
      title: 'Factory-Direct Rates',
      subtitle: 'Zero retail markup. Volume tiered quotation savings up to 30%.'
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#014b92]" />,
      title: 'Dedicated RFQ Desk',
      subtitle: 'Custom calibrated cuts, OEM castings, and bespoke atelier runs.'
    }
  ];

  return (
    <div className="bg-[#012d59] text-white py-5 select-none border-y border-[#012140]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((item, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-white/10 backdrop-blur-xs transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1">
                  <span>{item.title}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </h4>
                <p className="text-[11px] text-blue-100 line-clamp-1 leading-snug mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
