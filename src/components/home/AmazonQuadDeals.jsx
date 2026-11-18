import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Star } from 'lucide-react';

export default function AmazonQuadDeals({ onNavigate, onSelectProduct }) {
  const quadCards = [
    {
      title: 'Trending Natural Gemstones',
      subtitle: 'Imperial grade calibrated mineral strands',
      category: 'natural-gemstone-beads',
      items: [
        {
          name: 'African Turquoise Rondelles',
          caption: 'Best for ateliers',
          image: 'https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg'
        },
        {
          name: 'Volcanic Lava Rock Strands',
          caption: '7.5" wholesale lot',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/14mm四叶草孔兰扁珠黑色火山石串珠7.5英寸20条-300x300.jpg'
        },
        {
          name: 'Freshwater Baroque Pearls',
          caption: 'Organic luster',
          image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Imperial Agate Rounds',
          caption: 'AAA calibrated',
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80'
        }
      ]
    },
    {
      title: 'Lead-Free Pewter Components',
      subtitle: 'REACH & CPSIA certified safe (<90ppm)',
      category: 'jewelry-findings',
      items: [
        {
          name: 'Artisan Daisy Spacers',
          caption: '18-20 pk sets',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/6mm厚2mmA8283古金18包-古银20包-150x150.jpg'
        },
        {
          name: 'Bails, Wings & Toggles',
          caption: 'Direct casting',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/10mm圆14mm长棒子金色-13包-10个每包-300x300.jpg'
        },
        {
          name: 'Fleur De Lis Connectors',
          caption: 'Vintage bronze',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/13mm扁圆微镶A8301古银15包-150x150.jpg'
        },
        {
          name: 'Religious Cross Charms',
          caption: 'Casting master lot',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/il_fullxfull-5-300x300.jpg'
        }
      ]
    },
    {
      title: 'Haute Joaillerie Necklaces',
      subtitle: 'Silk-knotted artisan statement pieces',
      category: 'handmade-necklaces',
      items: [
        {
          name: 'Silk-Knotted Gemstone Chokers',
          caption: 'Ready to retail',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/161e2bb10b664305e2d4c95829a6030-1-300x300.jpg'
        },
        {
          name: 'Beaded Drop Ensembles',
          caption: 'Artisan handcraft',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/il_794xN.1715404164_2dhf-1-2-300x300.jpg'
        },
        {
          name: 'Layered Mineral Necklaces',
          caption: 'Boutique exclusive',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/403487c6-0046-4654-8c4d-cf964fcfe69e.jpg'
        },
        {
          name: 'Crystal Pavé Statement Lines',
          caption: 'Bridal collections',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/DSC_21011-300x300.jpg'
        }
      ]
    },
    {
      title: 'Express Atelier Packages',
      subtitle: 'In-stock factory lots ready for DHL dispatch',
      category: 'all',
      items: [
        {
          name: '18K Gold Vacuum Toggle Clasps',
          caption: 'Tarnish-resistant',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/10mm圆14mm长棒子金色-13包-10个每包-300x300.jpg'
        },
        {
          name: 'AAA Micro-Pavé Carabiners',
          caption: 'Handset CZ',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/il_fullxfull-5-300x300.jpg'
        },
        {
          name: 'Lobster Claw Findings Assortment',
          caption: 'Precision spring',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/6mm厚2mmA8283古金18包-古银20包-150x150.jpg'
        },
        {
          name: 'Wholesale Sample Packets',
          caption: 'Production review',
          image: 'https://beadssource.com/wp-content/uploads/2025/09/DSC_2159-300x300.jpg'
        }
      ]
    }
  ];

  return (
    <section className="py-8 bg-[#F4F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Amazon-style 4-Card Multi-Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quadCards.map((card, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#EDE5D8] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#292723] leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs text-[#8B8175] mt-0.5 line-clamp-1 mb-4">
                  {card.subtitle}
                </p>

                {/* 2x2 Product Thumbnail Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {card.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx}
                      onClick={() => onNavigate('catalog', { category: card.category })}
                      className="group/item cursor-pointer space-y-1"
                    >
                      <div className="aspect-square bg-[#FAF8F3] rounded-xl overflow-hidden border border-[#EDE5D8] group-hover/item:border-[#014b92] transition-colors relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover/item:scale-108 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors" />
                      </div>
                      <p className="text-[11px] font-bold text-[#292723] group-hover/item:text-[#014b92] truncate leading-tight transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#8B8175] truncate">
                        {item.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Explore Link */}
              <div className="pt-4 mt-4 border-t border-[#EDE5D8]">
                <button
                  onClick={() => onNavigate('catalog', { category: card.category })}
                  className="text-xs font-bold text-[#014b92] hover:text-[#012d59] flex items-center gap-1.5 transition-colors cursor-pointer group/link"
                >
                  <span>Explore complete collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
