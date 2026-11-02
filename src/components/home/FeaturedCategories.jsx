import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedCategories({ categories, onSelectCategory }) {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#ECE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#967117] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wholesale Catalogue Architecture</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Curated Wholesale Categories
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6759] mt-1 max-w-lg">
              Explore our master catalogue of natural gemstones, certified lead-free pewter charms, and jeweler findings.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6D2B] hover:text-[#5E481B] transition-colors cursor-pointer group"
          >
            <span>View All 12 Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid (12 items) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#EAE4D5] hover:border-[#C4A052] transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between"
            >
              {/* Category Image */}
              <div className="aspect-4/3 overflow-hidden bg-white">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Text Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A] group-hover:text-[#B38F26] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#736B5E] line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#EAE4D5] flex items-center justify-between text-xs">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    {cat.itemCount || 20}+ items
                  </span>
                  <span className="text-[#8C6D2B] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
