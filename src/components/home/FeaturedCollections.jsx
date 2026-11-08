import React from 'react';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';

const COLLECTIONS = [
  {
    id: 'artisan-minerals',
    title: 'Natural Mineral Agate & Turquoise',
    subtitle: 'Raw beauty, calibrated rondelles, and authentic magnesite matrixes.',
    category: 'natural-gemstone-beads',
    itemCount: '18 Products',
    badge: 'Raw Earth Elements',
    image: 'https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg',
    accentColor: '#176B68'
  },
  {
    id: 'pave-bridal',
    title: 'Micro-Pavé CZ & Bridal Accents',
    subtitle: '18K triple-plated vacuum electroplating with handset AAA cubic zirconia.',
    category: 'cubic-zirconia',
    itemCount: '19 Products',
    badge: 'Couture Sparkle',
    image: 'https://beadssource.com/wp-content/uploads/2025/09/il_fullxfull.1769582423_mqbc-300x300.jpg',
    accentColor: '#C3A36B'
  },
  {
    id: 'artisan-necklaces',
    title: 'Hand-Knotted Designer Strands',
    subtitle: 'Traditional artisanal silk-knotted gemstone necklaces with silver accents.',
    category: 'handmade-necklaces',
    itemCount: '16 Products',
    badge: 'Master Craftsmanship',
    image: 'https://beadssource.com/wp-content/uploads/2025/09/161e2bb10b664305e2d4c95829a6030-1-300x300.jpg',
    accentColor: '#191F23'
  }
];

export default function FeaturedCollections({ onNavigate }) {
  return (
    <section className="py-14 md:py-20 bg-[#F8F6F1] border-b border-[#E9E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E9E5DC] text-[#176B68] text-xs font-semibold shadow-xs mb-3">
            <Layers className="w-3.5 h-3.5 text-[#C3A36B]" />
            <span>Curated Wholesale Showcases</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#191F23]">
            Featured Seasonal Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#657078] mt-2">
            Thematic mineral and component showcases engineered for fine jewelry production lines and designer ateliers.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => onNavigate('catalog', { category: col.category })}
              className="group bg-white rounded-3xl border border-[#E9E5DC] hover:border-[#176B68] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#F4EFE6]">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3 bg-[#191F23]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  {col.badge}
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 text-[#176B68] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {col.itemCount}
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#191F23] group-hover:text-[#176B68] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#657078] mt-1.5 leading-relaxed">
                    {col.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F2EDE4] flex items-center justify-between text-xs font-bold text-[#176B68] group-hover:text-[#125250]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 text-[#C3A36B] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
