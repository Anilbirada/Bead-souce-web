import React from 'react';
import { Sparkles, Gem, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function CategoryIconBar({ onSelectCategory }) {
  const categories = [
    {
      id: 'natural-gemstone-beads',
      name: 'Gemstone Beads',
      badge: 'Bestseller',
      badgeColor: 'bg-amber-500',
      image: 'https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg'
    },
    {
      id: 'crystal-beads',
      name: 'Crystal & CZ',
      badge: 'Trending',
      badgeColor: 'bg-blue-600',
      image: 'https://beadssource.com/wp-content/uploads/2025/09/DSC_21011-300x300.jpg'
    },
    {
      id: 'jewelry-findings',
      name: 'Pewter Findings',
      badge: 'Lead-Free',
      badgeColor: 'bg-emerald-600',
      image: 'https://beadssource.com/wp-content/uploads/2025/09/10mm圆14mm长棒子金色-13包-10个每包-300x300.jpg'
    },
    {
      id: 'natural-gemstone-beads',
      name: 'Natural Pearls',
      badge: 'Cultured',
      badgeColor: 'bg-purple-600',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'jewelry-findings',
      name: 'Clasps & Toggles',
      badge: '18K Plated',
      badgeColor: 'bg-[#C6A66B]',
      image: 'https://beadssource.com/wp-content/uploads/2025/09/6mm厚2mmA8283古金18包-古银20包-150x150.jpg'
    },
    {
      id: 'handmade-necklaces',
      name: 'Finished Jewelry',
      badge: 'Handmade',
      badgeColor: 'bg-rose-600',
      image: 'https://beadssource.com/wp-content/uploads/2025/09/161e2bb10b664305e2d4c95829a6030-1-300x300.jpg'
    },
    {
      id: 'jewelry-connectors',
      name: 'Carabiners & Links',
      badge: 'Micro-Pavé',
      badgeColor: 'bg-sky-600',
      image: 'https://beadssource.com/wp-content/uploads/2025/09/il_fullxfull-5-300x300.jpg'
    },
    {
      id: 'all',
      name: 'All Wholesale Lots',
      badge: 'Save 30%',
      badgeColor: 'bg-[#cb0000]',
      image: 'https://beadssource.com/wp-content/uploads/2025/09/DSC_2159-300x300.jpg'
    }
  ];

  return (
    <div className="bg-white border-b border-[#EDE5D8] shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat, idx) => (
            <button
              key={`${cat.name}-${idx}`}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 px-2 sm:px-3 py-1 group cursor-pointer hover:-translate-y-1 transition-all duration-200"
            >
              {/* Circular Avatar / Image Container */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 border-2 border-transparent group-hover:border-[#014b92] transition-colors shadow-xs group-hover:shadow-md bg-gradient-to-tr from-[#FAF8F3] to-white">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {cat.badge && (
                  <span className={`absolute -bottom-1 -right-1 text-[9px] font-bold text-white px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-xs ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <span className="text-[11px] sm:text-xs font-bold text-[#292723] group-hover:text-[#014b92] text-center whitespace-nowrap transition-colors max-w-[85px] truncate">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
