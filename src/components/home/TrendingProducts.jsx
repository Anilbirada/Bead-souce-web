import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import ProductCard from '../shop/ProductCard';

export default function TrendingProducts({ 
  products = [], 
  onSelectProduct, 
  onQuickView, 
  onNavigate 
}) {
  // Select top trending products (rating >= 4.8 or high reviews)
  const trending = products
    .filter(p => (p.rating || 5) >= 4.8)
    .slice(0, 4);

  if (!trending.length) return null;

  return (
    <section className="py-14 md:py-20 bg-white border-b border-[#E9E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5E8] border border-[#E9DCBF] text-[#176B68] text-xs font-semibold mb-2.5">
              <Flame className="w-3.5 h-3.5 text-[#C3A36B]" />
              <span>In-Demand Wholesale Selections</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#191F23]">
              Trending Wholesale Essentials
            </h2>
            <p className="text-xs sm:text-sm text-[#657078] mt-1 max-w-xl">
              High-volume restocks favored by international jewelry brands, master ateliers, and retail boutiques.
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog', { sort: 'rating' })}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#176B68] hover:text-[#125250] transition-colors group self-start md:self-auto cursor-pointer"
          >
            <span>View All Trending Items</span>
            <ArrowRight className="w-4 h-4 text-[#C3A36B] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trending.map(product => (
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
