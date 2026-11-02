import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  FileText,
  BadgeCheck
} from 'lucide-react';

export default function WhyChooseSection({ onNavigate }) {
  const reasons = [
    {
      icon: <Building2 className="w-6 h-6 text-[#D4AF37]" />,
      title: "Direct Factory Pricing",
      desc: "Eliminate trading middlemen. Our direct manufacturing relationships give you true wholesale container pricing with transparent volume tier discounts."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />,
      title: "100% Certified Lead-Free Pewter",
      desc: "All metal charms and spacers comply strictly with California Prop 65, US CPSIA, and EU REACH standards for jewelry safety."
    },
    {
      icon: <Scale className="w-6 h-6 text-[#D4AF37]" />,
      title: "Genuine Natural Minerals",
      desc: "We verify every mineral strand. Natural turquoise, amethyst, rose quartz, lapis, and jasper hand-inspected for color, matrix, and calibrated drill sizes."
    },
    {
      icon: <Truck className="w-6 h-6 text-[#D4AF37]" />,
      title: "3-5 Day Worldwide Express Dispatch",
      desc: "Shipments dispatched via DHL Express and FedEx International with live door-to-door tracking. Complimentary shipping on orders above $500."
    },
    {
      icon: <FileText className="w-6 h-6 text-[#D4AF37]" />,
      title: "Custom OEM Casting & RFQ Desk",
      desc: "Have a custom design or need 10,000+ units? Submit your specifications directly to Ramesh Sir for custom casting, plating, and bespoke volume pricing."
    },
    {
      icon: <BadgeCheck className="w-6 h-6 text-[#D4AF37]" />,
      title: "SP Bengaluru Heritage & Showroom",
      desc: "Rooted in Bengaluru's famed jewelry and trade hub on SP Road, offering both physical showroom viewing and seamless international online purchasing."
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-[#ECE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#967117]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The BeadsSource Difference</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Why Wholesale Buyers Trust BeadsSource
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6759]">
            Partnering with over 5,000 professional jewelry designers, boutique chains, and independent studios in 40+ countries.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D5] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-lg space-y-3.5"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE4D5] flex items-center justify-center shadow-xs">
                {item.icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
                {item.title}
              </h3>
              <p className="text-xs text-[#6B6557] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
