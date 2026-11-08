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
    supertag: 'Direct Factory Gemstones • Certified Genuine',
    headline: 'Discover the Beauty of Gemstones',
    highlightWord: 'Gemstones',
    description: 'Explore beautiful gemstone collections and find inspiration for your next creation.',
    ctaText: 'Explore Gemstones',
    category: 'natural-gemstone-beads',
    image: 'https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg',
    secondaryImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    tag: 'Flagship Collection',
    pillTitle: 'Natural Turquoise & Agate Strands',
    volumeDiscount: 'Save 30% on 50+ Pack Master Orders'
  },
  {
    id: 'crystals',
    supertag: 'Precision Cut Crystals • AAA Brilliance',
    headline: 'Create Something Brilliant',
    highlightWord: 'Brilliant',
    description: 'Discover crystal collections designed to inspire creativity.',
    ctaText: 'Shop Crystal Beads',
    category: 'crystal-beads',
    image: 'https://beadssource.com/wp-content/uploads/2025/09/DSC_21011-300x300.jpg',
    secondaryImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    tag: 'Micro-Pavé CZ',
    pillTitle: 'Faceted Rondelles & Bicones',
    volumeDiscount: 'Factory Direct Export Pricing'
  },
  {
    id: 'pearls',
    supertag: 'Lustrous Freshwater & Baroque Selection',
    headline: 'Timeless Beauty. Endless Creativity.',
    highlightWord: 'Endless Creativity.',
    description: 'Explore lustrous freshwater and baroque pearl collections designed for heirloom jewelry.',
    ctaText: 'Explore Pearls',
    category: 'natural-gemstone-beads',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://beadssource.com/wp-content/uploads/2025/09/14mm四叶草孔兰扁珠黑色火山石串珠7.5英寸20条-300x300.jpg',
    tag: 'Heirloom Grade',
    pillTitle: 'Freshwater Pearls & Organic Shapes',
    volumeDiscount: 'Certified Lead & Cadmium Safe'
  },
  {
    id: 'findings',
    supertag: '100% Certified Lead-Free Pewter & 18K Plated Brass',
    headline: 'Every Detail Makes a Difference',
    highlightWord: 'Difference',
    description: 'Precision-engineered clasps, micro-pave connectors, and 100% certified lead-free pewter findings.',
    ctaText: 'Shop Findings',
    category: 'jewelry-findings',
    image: 'https://beadssource.com/wp-content/uploads/2025/09/10mm圆14mm长棒子金色-13包-10个每包-300x300.jpg',
    secondaryImage: 'https://beadssource.com/wp-content/uploads/2025/09/il_fullxfull-5-300x300.jpg',
    tag: 'Jewelry Components',
    pillTitle: 'Toggle Clasps & Multi-Strand Links',
    volumeDiscount: 'REACH & CPSIA Compliant (<90ppm)'
  },
  {
    id: 'premium-beads',
    supertag: 'Master Wholesale Lots • Direct Manufacturer Export',
    headline: 'Inspire Your Next Creation',
    highlightWord: 'Creation',
    description: 'Direct factory pricing, master wholesale lots, and bespoke production for jewelry designers worldwide.',
    ctaText: 'Explore Collection',
    category: 'all',
    image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://beadssource.com/wp-content/uploads/2025/09/il_794xN.1715404164_2dhf-1-2-300x300.jpg',
    tag: 'Master Lots',
    pillTitle: 'Curated Designer Strands',
    volumeDiscount: 'Custom RFQ Multi-Product Quotes'
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
      className="relative overflow-hidden bg-[#F8F6F1] border-b border-[#E9E5DC] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#176B68]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#C3A36B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Animated Headlines, Description & CTAs */}
          <div key={`text-${currentIndex}-${keyReset}`} className="lg:col-span-7 space-y-6 text-center lg:text-left animate-slide-up">
            
            {/* Supertag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E9E5DC] text-[#176B68] text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C3A36B]" />
              <span>{currentSlide.supertag}</span>
            </div>

            {/* Slide Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#191F23] tracking-tight leading-[1.12]">
              {currentSlide.headline.split(currentSlide.highlightWord || '').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="italic font-normal text-[#176B68] font-serif">
                      {currentSlide.highlightWord}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#657078] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {currentSlide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('catalog', { category: currentSlide.category || currentSlide.ctaCategory || 'all' })}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#176B68] hover:bg-[#125250] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>{currentSlide.ctaText || 'Explore Collection'}</span>
                <ArrowRight className="w-4 h-4 text-[#C3A36B] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('quote')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#FAF8F5] text-[#191F23] border border-[#E9E5DC] hover:border-[#C3A36B] text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#176B68]" />
                <span>Request Custom Bulk RFQ</span>
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E9E5DC] text-left max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#191F23]">5,000+</p>
                <p className="text-[11px] text-[#657078]">Global Designers &amp; Boutiques</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#191F23]">100%</p>
                <p className="text-[11px] text-[#657078]">Certified Lead-Free Pewter</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#191F23]">3-5 Days</p>
                <p className="text-[11px] text-[#657078]">Worldwide Express Dispatch</p>
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
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-[#E9E5DC] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF4F3] flex items-center justify-center text-[#176B68]">
                    <Gem className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium">{currentSlide.tag || 'Wholesale Selection'}</p>
                    <p className="text-xs font-bold text-[#191F23]">{currentSlide.pillTitle || currentSlide.headline}</p>
                  </div>
                </div>

                {/* Floating Bottom Discount Pill */}
                <div className="absolute bottom-4 right-4 bg-[#191F23]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#2D373E] space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[#C3A36B] text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Wholesale Advantage</span>
                  </div>
                  <p className="text-xs font-semibold text-white">
                    {currentSlide.volumeDiscount || 'Volume Tier Discounts Available'}
                  </p>
                </div>

              </div>

              {/* Decorative Accent Border Frame */}
              <div className="absolute -inset-2 rounded-3xl border border-[#C3A36B]/40 -z-10 rotate-1 pointer-events-none" />

            </div>
          </div>

        </div>

        {/* Carousel Navigation Toolbar & Pagination */}
        <div className="mt-8 pt-6 border-t border-[#E9E5DC] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Slide Indicator & Dots */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#176B68]">
              0{currentIndex + 1}
            </span>
            <div className="flex items-center gap-2">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-[#176B68]' 
                      : 'w-2 bg-[#D1C9BE] hover:bg-[#A3998C]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.headline}`}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-gray-400">
              0{slides.length}
            </span>
          </div>

          {/* Quick Slide Title Buttons */}
          <div className="hidden md:flex items-center gap-1">
            {slides.map((s, idx) => {
              const titles = ['Gemstones', 'Crystal Beads', 'Pearls', 'Findings', 'Master Beads'];
              return (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    currentIndex === idx
                      ? 'bg-[#176B68] text-white font-bold'
                      : 'text-[#657078] hover:text-[#191F23] hover:bg-white'
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
              className="p-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-gray-600 border border-[#E9E5DC] text-xs cursor-pointer shadow-2xs"
              title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
              aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#191F23] border border-[#E9E5DC] hover:border-[#176B68] text-xs cursor-pointer shadow-2xs transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#191F23] border border-[#E9E5DC] hover:border-[#176B68] text-xs cursor-pointer shadow-2xs transition-colors"
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
