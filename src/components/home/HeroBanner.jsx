import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  ShieldCheck, 
  Gem, 
  FileText,
  Clock,
  Award
} from 'lucide-react';

const DEFAULT_SLIDES = [
  {
    id: 'gemstones',
    supertag: 'Imperial Grade Gemstones • Certified Genuine Minerals',
    headline: 'Imperial Natural Gemstones & Calibrated Strands',
    highlightWord: 'Gemstones',
    description: 'Direct factory export of genuine African turquoise, calibrated rondelles, faceted rubies, and premium mineral strands for international jewelry ateliers.',
    ctaText: 'Shop Collection',
    secondaryCtaText: 'Explore Products',
    category: 'natural-gemstone-beads',
    image: 'https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg',
    secondaryImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    tag: 'Imperial Mineral Selection',
    pillTitle: 'African Turquoise & Agate Strands',
    volumeDiscount: 'Save 30% on Master Atelier Orders'
  },
  {
    id: 'crystals',
    supertag: 'Precision Cut Crystals • AAA Micro-Pavé Brilliance',
    headline: 'Precision Faceted Crystals & AAA Pavé Radiance',
    highlightWord: 'Radiance',
    description: 'Triple-plated 18K vacuum electroplated findings with handset cubic zirconia and brilliant cut crystal rondelles engineered for bespoke bridal and couture designs.',
    ctaText: 'Shop Collection',
    secondaryCtaText: 'Explore Products',
    category: 'crystal-beads',
    image: 'https://beadssource.com/wp-content/uploads/2025/09/DSC_21011-300x300.jpg',
    secondaryImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    tag: 'Couture Pavé Elements',
    pillTitle: 'Faceted Rondelles & Bicones',
    volumeDiscount: 'Direct Factory Export Pricing'
  },
  {
    id: 'pearls',
    supertag: 'Heirloom Cultured Selection • Organic Baroque Luster',
    headline: 'Lustrous Freshwater & Baroque Pearl Strands',
    highlightWord: 'Luster',
    description: 'Hand-selected cultured freshwater pearls, baroque drops, and organic nugget strands featuring thick nacre and iridescent orient for heirloom jewelry lines.',
    ctaText: 'Shop Collection',
    secondaryCtaText: 'Explore Products',
    category: 'natural-gemstone-beads',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://beadssource.com/wp-content/uploads/2025/09/14mm四叶草孔兰扁珠黑色火山石串珠7.5英寸20条-300x300.jpg',
    tag: 'Heirloom Cultured Pearls',
    pillTitle: 'Freshwater Baroque Strands',
    volumeDiscount: 'Certified Lead & Cadmium Safe'
  },
  {
    id: 'findings',
    supertag: '100% Certified Lead-Free Pewter • REACH & CPSIA Compliant',
    headline: 'Certified Lead-Free Pewter & Handcrafted Connectors',
    highlightWord: 'Connectors',
    description: 'Precision-cast lead-free (<90ppm) pewter clasps, toggle sets, artisan spacers, and screw-lock carabiners manufactured for rigorous international compliance.',
    ctaText: 'Shop Collection',
    secondaryCtaText: 'Explore Products',
    category: 'jewelry-findings',
    image: 'https://beadssource.com/wp-content/uploads/2025/09/10mm圆14mm长棒子金色-13包-10个每包-300x300.jpg',
    secondaryImage: 'https://beadssource.com/wp-content/uploads/2025/09/il_fullxfull-5-300x300.jpg',
    tag: 'Certified Pewter Components',
    pillTitle: 'Toggle Clasps & Multi-Strand Links',
    volumeDiscount: 'REACH & CPSIA Tested (<90ppm)'
  },
  {
    id: 'artisan-collections',
    supertag: 'Bespoke Haute Joaillerie • Finished Wholesale Ensembles',
    headline: 'Haute Joaillerie & Curated B2B Designer Ensembles',
    highlightWord: 'Ensembles',
    description: 'Silk-knotted natural gemstone necklaces, sterling silver accented chokers, and ready-to-retail artisan statement jewelry for luxury retail boutiques worldwide.',
    ctaText: 'Shop Collection',
    secondaryCtaText: 'Explore Products',
    category: 'handmade-necklaces',
    image: 'https://beadssource.com/wp-content/uploads/2025/09/161e2bb10b664305e2d4c95829a6030-1-300x300.jpg',
    secondaryImage: 'https://beadssource.com/wp-content/uploads/2025/09/il_794xN.1715404164_2dhf-1-2-300x300.jpg',
    tag: 'Haute Joaillerie Lines',
    pillTitle: 'Silk-Knotted Gemstone Necklaces',
    volumeDiscount: 'Custom Volume RFQ Negotiation'
  }
];

export default function HeroBanner({ onNavigate, dynamicSlides = null }) {
  const slides = (dynamicSlides && dynamicSlides.length > 0) ? dynamicSlides : DEFAULT_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [keyReset, setKeyReset] = useState(0); // Trigger re-animation of text

  const currentSlide = slides[currentIndex] || slides[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setKeyReset((prev) => prev + 1);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setKeyReset((prev) => prev + 1);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setKeyReset((prev) => prev + 1);
  };

  // Auto-play timer (6 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  return (
    <section 
      aria-label="Featured Wholesale Collections Carousel"
      className="relative overflow-hidden bg-[#FAF8F3] border-b border-[#EDE5D8] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#EDE5D8]/60 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Animated Headlines, Description & CTAs */}
          <div key={`text-${currentIndex}-${keyReset}`} className="lg:col-span-7 space-y-6 text-center lg:text-left animate-slide-up">
            
            {/* Supertag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EDE5D8] text-[#8B8175] text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>{currentSlide.supertag}</span>
            </div>

            {/* Slide Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#292723] tracking-tight leading-[1.12]">
              {currentSlide.headline.split(currentSlide.highlightWord || '').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="italic font-normal text-[#C6A66B] font-serif">
                      {currentSlide.highlightWord}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#8B8175] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {currentSlide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('catalog', { category: currentSlide.category || currentSlide.ctaCategory || 'all' })}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#C6A66B] hover:bg-[#B89354] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>{currentSlide.ctaText || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('catalog', { category: 'all' })}
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-[#FAF8F3] text-[#40362F] border border-[#EDE5D8] hover:border-[#C6A66B] text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>{currentSlide.secondaryCtaText || 'Explore Products'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8B8175] group-hover:text-[#C6A66B] group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EDE5D8] text-left max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#292723]">5,000+</p>
                <p className="text-[11px] text-[#8B8175]">Global Designers &amp; Boutiques</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#292723]">100%</p>
                <p className="text-[11px] text-[#8B8175]">Certified Genuine Minerals</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#292723]">3-5 Days</p>
                <p className="text-[11px] text-[#8B8175]">Worldwide Express Dispatch</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase with Cinematic Motion */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Luxury Frame */}
              <div 
                key={`img-${currentIndex}`}
                className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white relative group animate-fade-in"
              >
                <img
                  src={currentSlide.image}
                  alt={currentSlide.headline}
                  className="w-full h-full object-cover animate-ken-burns transition-transform duration-700"
                />

                {/* Subtle dark gradient overlay on bottom for badge legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Top Showcase Pill */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-[#EDE5D8] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] flex items-center justify-center text-[#C6A66B]">
                    <Gem className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8B8175] font-medium">{currentSlide.tag || 'Wholesale Selection'}</p>
                    <p className="text-xs font-bold text-[#292723]">{currentSlide.pillTitle || currentSlide.headline}</p>
                  </div>
                </div>

                {/* Floating Bottom Discount Pill */}
                <div className="absolute bottom-4 right-4 bg-[#40362F]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#52463D] space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[#C6A66B] text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Wholesale Advantage</span>
                  </div>
                  <p className="text-xs font-semibold text-[#FAF8F3]">
                    {currentSlide.volumeDiscount || 'Volume Tier Discounts Available'}
                  </p>
                </div>

              </div>

              {/* Decorative Accent Border Frame */}
              <div className="absolute -inset-2 rounded-3xl border border-[#C6A66B]/30 -z-10 rotate-1 pointer-events-none" />

            </div>
          </div>

        </div>

        {/* Carousel Navigation Toolbar & Pagination */}
        <div className="mt-8 pt-6 border-t border-[#EDE5D8] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Slide Indicator & Dots */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#C6A66B]">
              0{currentIndex + 1}
            </span>
            <div className="flex items-center gap-2">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-[#C6A66B]' 
                      : 'w-2 bg-[#D8C49A] hover:bg-[#C6A66B]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.headline}`}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-[#8B8175]">
              0{slides.length}
            </span>
          </div>

          {/* Quick Slide Title Buttons */}
          <div className="hidden md:flex items-center gap-1">
            {slides.map((s, idx) => {
              const titles = ['Gemstones', 'Crystals & CZ', 'Natural Pearls', 'Findings', 'Handmade Lines'];
              return (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    currentIndex === idx
                      ? 'bg-[#C6A66B] text-white font-bold'
                      : 'text-[#8B8175] hover:text-[#292723] hover:bg-white'
                  }`}
                >
                  {titles[idx] || `Collection ${idx + 1}`}
                </button>
              );
            })}
          </div>

          {/* Arrow Buttons & Pause/Play */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-white hover:bg-[#FAF8F3] text-[#8B8175] hover:text-[#40362F] border border-[#EDE5D8] text-xs cursor-pointer shadow-2xs"
              title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
              aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white hover:bg-[#FAF8F3] text-[#40362F] border border-[#EDE5D8] hover:border-[#C6A66B] text-xs cursor-pointer shadow-2xs transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white hover:bg-[#FAF8F3] text-[#40362F] border border-[#EDE5D8] hover:border-[#C6A66B] text-xs cursor-pointer shadow-2xs transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
