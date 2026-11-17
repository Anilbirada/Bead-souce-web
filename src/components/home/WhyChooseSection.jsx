import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  FileText,
  BadgeCheck,
  Headphones,
  Award
} from 'lucide-react';

export default function WhyChooseSection({ onNavigate }) {
  const reasons = [
    {
      icon: <Award className="w-6 h-6 text-[#C6A66B]" />,
      title: "Premium Product Selection",
      desc: "Curated collection of imperial-grade natural gemstone strands, calibrated African turquoise, lustrous freshwater pearls, and AAA micro-pavé elements selected specifically for professional jewelers."
    },
    {
      icon: <Building2 className="w-6 h-6 text-[#C6A66B]" />,
      title: "Wholesale Purchasing & Factory Pricing",
      desc: "Direct-from-manufacturer wholesale pricing eliminating distributor markups. Transparent volume tiers reward studio growth with discounts reaching up to 30% on master lot purchases."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#C6A66B]" />,
      title: "Quality-Focused Collections & Compliance",
      desc: "100% certified lead-free (<90ppm) and cadmium-free pewter findings compliant with EU REACH and US CPSIA regulations, with mineral strands verified for drill gauge precision and color authenticity."
    },
    {
      icon: <FileText className="w-6 h-6 text-[#C6A66B]" />,
      title: "Bulk Order & Bespoke RFQ Support",
      desc: "Dedicated Request for Quotation desk for custom casting, proprietary plating, master packs, and high-volume production orders with tailored payment and shipping terms."
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#C6A66B]" />,
      title: "Dedicated Customer Assistance & Concierge",
      desc: "White-glove trade support with experienced jewelry supply specialists to assist with custom specifications, sample verification, and rapid door-to-door express delivery across 40+ countries."
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-[#EDE5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#8B8175]">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>The BeadsSource Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292723] tracking-tight">
            Why Wholesale Jewelers Choose BeadsSource
          </h2>
          <p className="text-xs sm:text-sm text-[#8B8175]">
            Partnering with over 5,000 independent jewelry studios, design ateliers, and luxury retail boutiques worldwide.
          </p>
        </div>

        {/* 5 Grid Cards (Spacious layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#FAF8F3] border border-[#EDE5D8] hover:border-[#C6A66B] transition-all duration-300 hover:shadow-xl space-y-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EDE5D8] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-[#292723] group-hover:text-[#C6A66B] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#8B8175] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
