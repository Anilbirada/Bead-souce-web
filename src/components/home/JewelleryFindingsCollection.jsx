import React from 'react';
import { ShieldCheck, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import ProductCard from '../shop/ProductCard';

export default function JewelleryFindingsCollection({ 
  products = [], 
  onSelectProduct, 
  onQuickView, 
  onNavigate 
}) {
  // Filter products in jewelry-findings, jewelry-connectors, or jewelry-spacers
  const findingsProducts = products
    .filter(p => 
      p.category === 'jewelry-findings' || 
      p.category === 'jewelry-connectors' || 
      p.category === 'jewelry-spacers' ||
      p.category === 'charms'
    )
    .slice(0, 4);

  if (!findingsProducts.length) return null;

  return (
    <section className="py-14 md:py-20 bg-white border-b border-[#E9E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with Certification Notice */}
        <div className="bg-[#FAF8F5] border border-[#E9E5DC] rounded-3xl p-6 sm:p-8 mb-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF4F3] border border-[#CADEDD] text-[#176B68] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#176B68]" />
              <span>Certified CPSIA &amp; REACH Compliant Lead-Free Pewter (&lt;90ppm)</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191F23]">
              Precision Jewellery Findings &amp; Connectors
            </h2>
            <p className="text-xs sm:text-sm text-[#657078] max-w-2xl">
              Micro-pavé toggle clasps, antique bronze connectors, lead-free daisy spacers, and vacuum-electroplated 18K gold links designed for fine commercial jewelry manufacturing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate('catalog', { category: 'jewelry-findings' })}
              className="px-6 py-3 bg-[#176B68] hover:bg-[#125250] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Findings ({products.filter(p => p.category === 'jewelry-findings' || p.category === 'jewelry-connectors').length}+)</span>
              <ArrowRight className="w-4 h-4 text-[#C3A36B]" />
            </button>
            <button
              onClick={() => onNavigate('quote')}
              className="px-5 py-3 bg-white hover:bg-[#FAF8F5] text-[#191F23] border border-[#E9E5DC] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Custom Casting RFQ</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {findingsProducts.map(product => (
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
