import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../shop/ProductCard';

export default function NewArrivals({ products, onSelectProduct, onQuickView, onNavigate }) {
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 8);

  return (
    <section className="py-16 bg-white border-b border-[#ECE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#B38F26] mb-1.5">
              <Sparkles className="w-4 h-4 text-[#C4A052]" />
              <span>Fresh Factory Production Runs</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              New Wholesale Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6759] mt-1 max-w-lg">
              Fresh container shipments of gemstone perfume bottle pendants, carved ovals, and pave connectors.
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog', { sort: 'newest' })}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6D2B] hover:text-[#5E481B] transition-colors cursor-pointer group"
          >
            <span>Explore All New Arrivals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
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
