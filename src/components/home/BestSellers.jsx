import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import ProductCard from '../shop/ProductCard';

export default function BestSellers({ products, onSelectProduct, onQuickView, onNavigate }) {
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);

  return (
    <section className="py-16 bg-[#FAF9F5] border-b border-[#ECE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#B38F26] mb-1.5">
              <Flame className="w-4 h-4 text-[#D4AF37]" />
              <span>International Wholesale Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Best-Selling Wholesale Products
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6759] mt-1 max-w-lg">
              High-velocity jewelry components, lead-free pewter charms, and natural gemstone strands proven to drive retail sales.
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog', { bestSeller: 'true' })}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6D2B] hover:text-[#5E481B] transition-colors cursor-pointer group"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
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
