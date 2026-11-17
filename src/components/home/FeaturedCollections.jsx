import React, { useState } from 'react';
import { Sparkles, ArrowRight, Layers, Gem, Flame, Clock, Award, Star } from 'lucide-react';

const EDITORIAL_COLLECTIONS = [
  {
    id: 'trending-now',
    tabName: 'Trending Now',
    icon: Flame,
    title: 'Trending Calibrated Minerals & Magnesite Turquoise',
    subtitle: 'High-demand stabilized turquoise rondelles, smooth ovals, and multi-stone mixes favored by studio jewelers.',
    category: 'turquoise-beads',
    itemCount: '18 Products',
    badge: 'Trending Now',
    image: 'https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg',
    accent: '#C6A66B'
  },
  {
    id: 'exclusive-collections',
    tabName: 'Exclusive Collections',
    icon: Award,
    title: 'Micro-Pavé CZ Bridal Clasps & 18K Vacuum Plated Links',
    subtitle: 'Triple-plated 18K vacuum electroplating with handset AAA cubic zirconia for bespoke couture collections.',
    category: 'cubic-zirconia',
    itemCount: '19 Products',
    badge: 'Couture Exclusive',
    image: 'https://beadssource.com/wp-content/uploads/2025/09/il_fullxfull.1769582423_mqbc-300x300.jpg',
    accent: '#40362F'
  },
  {
    id: 'new-arrivals',
    tabName: 'New Arrivals',
    icon: Clock,
    title: 'Freshwater Baroque Pearls & Cultured Nacre Strands',
    subtitle: 'Newly arrived organic baroque pearls, iridescent drops, and calibrated potato shapes with rich luster.',
    category: 'natural-gemstone-beads',
    itemCount: '16 Products',
    badge: '2026 Import',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80',
    accent: '#8B8175'
  },
  {
    id: 'best-sellers',
    tabName: 'Best Sellers',
    icon: Star,
    title: 'Certified Lead-Free Pewter Antique Spacers & Clasps',
    subtitle: 'Proven high-volume antique gold and silver spacers certified lead-free (<90ppm) for REACH & CPSIA compliance.',
    category: 'jewelry-findings',
    itemCount: '24 Products',
    badge: 'Top Volume Bestseller',
    image: 'https://beadssource.com/wp-content/uploads/2025/09/6mm厚2mmA8283古金18包-古银20包-150x150.jpg',
    accent: '#C6A66B'
  },
  {
    id: 'premium-gemstones',
    tabName: 'Premium Gemstones',
    icon: Gem,
    title: 'Artisan Silk-Knotted Natural Gemstone Necklaces',
    subtitle: 'Finished statement jewelry ready for boutique showcase, featuring genuine stones and silver findings.',
    category: 'handmade-necklaces',
    itemCount: '16 Products',
    badge: 'Master Craftsmanship',
    image: 'https://beadssource.com/wp-content/uploads/2025/09/161e2bb10b664305e2d4c95829a6030-1-300x300.jpg',
    accent: '#40362F'
  }
];

export default function FeaturedCollections({ onNavigate }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-16 md:py-24 bg-[#FAF8F3] border-b border-[#EDE5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#EDE5D8] text-[#8B8175] text-xs font-semibold shadow-xs mb-3">
            <Layers className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Curated Editorial Showcases</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292723] tracking-tight">
            Trending &amp; Editorial Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#8B8175] mt-2">
            Thematic mineral and component showcases engineered for high-end jewelry production and designer ateliers.
          </p>
        </div>

        {/* Editorial Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 select-none">
          {EDITORIAL_COLLECTIONS.map((col, idx) => {
            const Icon = col.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={col.id}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#40362F] text-[#FAF8F3] shadow-md border border-[#52463D]'
                    : 'bg-white text-[#8B8175] hover:text-[#292723] border border-[#EDE5D8] hover:border-[#C6A66B]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C6A66B]' : 'text-[#8B8175]'}`} />
                <span>{col.tabName}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Editorial Spotlight Banner */}
        {EDITORIAL_COLLECTIONS[activeTab] && (
          <div 
            onClick={() => onNavigate('catalog', { category: EDITORIAL_COLLECTIONS[activeTab].category })}
            className="group relative bg-white rounded-3xl border border-[#EDE5D8] hover:border-[#C6A66B] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer mb-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F3] border border-[#EDE5D8] text-[10px] font-bold uppercase tracking-wider text-[#C6A66B]">
                  <span>{EDITORIAL_COLLECTIONS[activeTab].badge}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#292723] group-hover:text-[#C6A66B] transition-colors leading-snug">
                  {EDITORIAL_COLLECTIONS[activeTab].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8B8175] leading-relaxed max-w-xl">
                  {EDITORIAL_COLLECTIONS[activeTab].subtitle}
                </p>
                <div className="pt-4 flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#C6A66B] group-hover:bg-[#B89354] text-white text-xs font-bold rounded-xl transition-all shadow-md">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-xs text-[#8B8175] font-semibold">
                    {EDITORIAL_COLLECTIONS[activeTab].itemCount} Available
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 aspect-16/10 lg:aspect-square overflow-hidden bg-[#FAF8F3]">
                <img
                  src={EDITORIAL_COLLECTIONS[activeTab].image}
                  alt={EDITORIAL_COLLECTIONS[activeTab].title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        )}

        {/* Collections Secondary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {EDITORIAL_COLLECTIONS.slice(0, 3).map((col) => (
            <div
              key={col.id}
              onClick={() => onNavigate('catalog', { category: col.category })}
              className="group bg-white rounded-3xl border border-[#EDE5D8] hover:border-[#C6A66B] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[#FAF8F3]">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#40362F]/90 text-[#FAF8F3] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  {col.badge}
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 text-[#40362F] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {col.itemCount}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#292723] group-hover:text-[#C6A66B] transition-colors leading-snug">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#8B8175] mt-1.5 leading-relaxed line-clamp-2">
                    {col.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EDE5D8] flex items-center justify-between text-xs font-bold text-[#C6A66B]">
                  <span>Discover Pieces</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
