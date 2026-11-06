import React from 'react';
import { Gem, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import ProductCard from '../shop/ProductCard';

export default function GemstoneCollection({ products, onSelectProduct, onQuickView, onNavigate }) {
  const gemstoneProducts = products.filter(p => 
    p.category === 'natural-gemstone-beads' || p.category === 'turquoise-beads'
  ).slice(0, 4);

  return (
    <section className="py-20 bg-[#FAF7F2] border-b border-[#ECE7DC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Spotlight Intro Banner */}
        <div className="bg-[#1C1A17] rounded-3xl p-8 sm:p-12 text-white mb-14 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#302B23] border border-[#4D4537] text-[#E6C687] text-xs font-semibold">
              <Gem className="w-3.5 h-3.5" />
              <span>Certified Natural Mineral Sourcing</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Authentic Natural Gemstones &amp; Turquoise Strands
            </h2>

            <p className="text-xs sm:text-sm text-[#D8D2C4] leading-relaxed">
              Every strand is cut from authentic mineral deposits. Hand-knotted on matching silk and nylon cord for superior drape and tensile strength. Calibrated from 4mm to 12mm with uniform center drillings.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#E6C687]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>100% Genuine Minerals</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Calibrated Hole Drills</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Gemological Lab Certified</span>
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('catalog', { category: 'natural-gemstone-beads' })}
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#B38F26] text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Browse All Gemstone Strands</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Luxury background motif */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 hidden md:block">
            <img
              src="https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg"
              alt="Gemstones"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Featured Gemstones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {gemstoneProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
