import React from 'react';
import { ArrowRight, Sparkles, Scissors } from 'lucide-react';
import ProductCard from '../shop/ProductCard';

export default function HandmadeJewelleryShowcase({ products, onSelectProduct, onQuickView, onNavigate }) {
  const handmadeProducts = products.filter(p => 
    p.category === 'handmade-necklaces' || p.category === 'handmade-bracelets'
  ).slice(0, 4);

  return (
    <section className="py-20 bg-[#FAF8F5] border-b border-[#ECE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#B38F26] mb-1.5">
              <Scissors className="w-4 h-4 text-[#C4A052]" />
              <span>Artisan Workshop Creation</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Handcrafted Wholesale Jewelry
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6759] mt-1 max-w-lg">
              Double-knotted long silk necklaces, natural baroque pearl bracelets, and lava stone aromatherapy designs crafted for ready-to-sell retail margins.
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog', { category: 'handmade-necklaces' })}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6D2B] hover:text-[#5E481B] transition-colors cursor-pointer group"
          >
            <span>View All Finished Jewelry</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {handmadeProducts.map((product) => (
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
