import React from 'react';
import { ArrowRight, Sparkles, Gem } from 'lucide-react';

export default function FeaturedCategories({ categories = [], onSelectCategory }) {
  // Curated list ensuring all 7 requested luxury categories are covered
  const displayCategories = categories && categories.length > 0 ? categories : [
    { id: 'natural-gemstone-beads', name: 'Gemstone Beads', description: 'Calibrated African turquoise, lapis lazuli, rose quartz, and natural mineral roughs.', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', itemCount: 18 },
    { id: 'crystal-beads', name: 'Crystal Beads', description: 'AAA faceted rondelles, precision cut bicones, and high-brilliance chandelier elements.', image: 'https://beadssource.com/wp-content/uploads/2025/09/DSC_21011-300x300.jpg', itemCount: 14 },
    { id: 'natural-pearls', name: 'Natural Pearls', description: 'Lustrous cultured freshwater pearls, baroque nuggets, and organic heirloom drops.', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80', itemCount: 16 },
    { id: 'glass-beads', name: 'Glass & Ceramic Beads', description: 'Artisanal lampwork beads, Venetian-style rounds, and glazed ceramic spacers.', image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80', itemCount: 12 },
    { id: 'jewelry-findings', name: 'Metal Findings', description: 'Certified lead-free (<90ppm) pewter clasps, head pins, jump rings, and wire.', image: 'https://beadssource.com/wp-content/uploads/2025/09/6mm厚2mmA8283古金18包-古银20包-150x150.jpg', itemCount: 24 },
    { id: 'jewelry-connectors', name: 'Jewellery Accessories', description: 'Micro-pavé CZ carabiners, 18K gold plated toggle clasps, and multi-strand links.', image: 'https://beadssource.com/wp-content/uploads/2025/09/10mm圆14mm长棒子金色-13包-10个每包-300x300.jpg', itemCount: 19 },
    { id: 'all', name: 'Premium Collections', description: 'Silk-knotted natural gemstone necklaces and ready-to-retail designer master lots.', image: 'https://beadssource.com/wp-content/uploads/2025/09/161e2bb10b664305e2d4c95829a6030-1-300x300.jpg', itemCount: 28 }
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#EDE5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#8B8175] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>Wholesale Catalogue Architecture</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292723] tracking-tight">
              Featured Luxury Categories
            </h2>
            <p className="text-xs sm:text-sm text-[#8B8175] mt-1.5 max-w-lg">
              Explore our master wholesale portfolio of imperial natural gemstones, certified lead-free pewter, and jeweler findings.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#C6A66B] hover:text-[#B89354] transition-colors cursor-pointer group"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === 'natural-pearls' ? 'natural-gemstone-beads' : (cat.id === 'glass-beads' ? 'crystal-beads' : cat.id))}
              className="group relative bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200 hover:border-[#014b92] transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between"
            >
              {/* Category Image */}
              <div className="aspect-4/3 overflow-hidden bg-white relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Text Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#292723] group-hover:text-[#C6A66B] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C554E] line-clamp-2 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDE5D8] flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-xs font-semibold text-[#8B8175] uppercase tracking-wider">
                    {cat.itemCount || 15}+ items
                  </span>
                  <span className="text-[#C6A66B] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
