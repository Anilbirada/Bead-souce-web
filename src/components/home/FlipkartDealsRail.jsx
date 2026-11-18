import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Star, 
  FileText, 
  Heart, 
  Sparkles,
  Zap,
  ShieldCheck 
} from 'lucide-react';
import { useQuote } from '../../context/QuoteContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function FlipkartDealsRail({ products = [], onSelectProduct, onNavigate }) {
  const scrollRef = useRef(null);
  const { addToQuote } = useQuote();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Simulated live countdown timer matching Flipkart / Amazon flash sale urgency
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  const dealProducts = products.length > 0 ? products.slice(0, 10) : [];

  return (
    <section className="py-8 bg-white border-y border-[#EDE5D8] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Deal Header Banner with Flipkart/Amazon Urgency Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EDE5D8]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-xs font-black rounded-lg uppercase tracking-wider shadow-xs">
              <Flame className="w-4 h-4 fill-current animate-bounce" />
              <span>Deals of the Day</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#40362F] bg-[#FAF8F3] px-3 py-1 rounded-lg border border-[#EDE5D8]">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>Wholesale Batch Closes in:</span>
              <span className="font-mono font-bold text-red-600">
                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className="px-4 py-1.5 bg-[#014b92] hover:bg-[#003d78] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Scroll Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full border border-[#EDE5D8] bg-[#FAF8F3] hover:bg-white text-[#40362F] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full border border-[#EDE5D8] bg-[#FAF8F3] hover:bg-white text-[#40362F] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Rail */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none py-5 scroll-smooth"
        >
          {dealProducts.map((p) => {
            const isSaved = isInWishlist(p.id);
            return (
              <div
                key={p.id}
                className="w-60 sm:w-64 shrink-0 bg-white rounded-2xl border border-[#EDE5D8] hover:border-[#014b92] p-3 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
              >
                {/* Thumbnail */}
                <div 
                  onClick={() => onSelectProduct(p)}
                  className="aspect-square bg-[#FAF8F3] rounded-xl overflow-hidden relative cursor-pointer"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Flipkart Assured style badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                    Factory Deal
                  </span>

                  {/* Wishlist toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p);
                    }}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-colors ${
                      isSaved ? 'bg-red-50 text-red-600' : 'bg-white/90 text-[#8B8175] hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-red-600' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="pt-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[#8B8175] font-semibold">{p.sku}</span>
                      <div className="flex items-center text-amber-500 font-bold gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <h4 
                      onClick={() => onSelectProduct(p)}
                      className="text-xs sm:text-sm font-bold text-[#292723] hover:text-[#014b92] line-clamp-2 mt-1 cursor-pointer transition-colors leading-snug"
                    >
                      {p.name}
                    </h4>
                  </div>

                  <div>
                    {/* B2B Wholesale Pricing Notice */}
                    <div className="mt-2 py-1 px-2 rounded-lg bg-[#f0f5fa] border border-[#d2e2f0] text-[11px] font-bold text-[#014b92] flex items-center justify-between">
                      <span>Wholesale RFQ</span>
                      <span className="text-[10px] text-[#557a99] font-normal">Direct Factory</span>
                    </div>

                    {/* Quick Add to Quote Button */}
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="w-full mt-2.5 py-2 bg-[#014b92] hover:bg-[#003d78] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#ffd778]" />
                      <span>Add to Quote</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
