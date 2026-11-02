import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '../shop/ProductCard';

export default function CrystalCZCollection({ products, onSelectProduct, onQuickView, onNavigate }) {
  const czProducts = products.filter(p => 
    p.category === 'cubic-zirconia' || p.category === 'crystal-beads' || p.category === 'jewelry-connectors'
  ).slice(0, 4);

  return (
    <section className="py-20 bg-white border-b border-[#ECE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#B38F26] mb-1.5">
              <Sparkles className="w-4 h-4 text-[#C4A052]" />
              <span>Micro Pavé Engineering</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Micro Pavé Cubic Zirconia &amp; Fine Crystals
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6759] mt-1 max-w-lg">
              Prong-set AAA grade zirconia in 18K gold and rhodium plated brass cores. High brilliance disco spacers, clover connectors, and crosses.
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog', { category: 'cubic-zirconia' })}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6D2B] hover:text-[#5E481B] transition-colors cursor-pointer group"
          >
            <span>View All CZ &amp; Crystal Elements</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {czProducts.map((product) => (
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
