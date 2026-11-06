import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Award, Globe, Gem, CheckCircle } from 'lucide-react';

export default function HeroBanner({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-[#ECE7DC]">
      {/* Subtle luxury background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4E8D1]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E6DAC3]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Supertag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3ECE0] border border-[#DFCDB2] text-[#8C6D2B] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#C4A052]" />
              <span>International Wholesale Jewellery &bull; Direct Factory Manufacturer</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1A1A] tracking-tight leading-[1.12]">
              The Source for <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#967117] font-serif">Fine Natural Gemstones,</span> <br />
              Pave CZ &amp; Artisan Findings
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-[#615A4D] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Engineered to international fine jewellery standards and delivered worldwide. BeadsSource provides direct manufacturer pricing, certified lead-free components, and flexible wholesale tier discounts for jewelry designers, retail boutiques, and distributors.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('catalog', { category: 'all' })}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#1C1A17] hover:bg-[#332E26] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Explore 2026 Wholesale Catalogue</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('quote')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#FAF7F0] text-[#8C6D2B] border border-[#DACFBA] text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Custom Bulk Quotation</span>
              </button>
            </div>

            {/* Trust Metric Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EAE4D5] text-left max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">5,000+</p>
                <p className="text-[11px] text-[#7A7366]">Designers &amp; Boutiques</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">100%</p>
                <p className="text-[11px] text-[#7A7366]">Certified Lead-Free Pewter</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">3-5 Days</p>
                <p className="text-[11px] text-[#7A7366]">Worldwide Express Dispatch</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Montage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Luxury Hero Frame */}
              <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white relative">
                <img
                  src="https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg"
                  alt="Natural Gemstone Bead Strands Wholesale"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Showcase Pill (Top Left) */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-[#EAE4D5] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF5E8] flex items-center justify-center text-[#B38F26]">
                    <Gem className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium">Flagship Gemstone</p>
                    <p className="text-xs font-bold text-[#1A1A1A]">Natural Turquoise &amp; Agate</p>
                  </div>
                </div>

                {/* Floating Volume Discount Pill (Bottom Right) */}
                <div className="absolute bottom-4 right-4 bg-[#1C1A17]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#3D372E] space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[#E6C687] text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Wholesale Tier Unlocked</span>
                  </div>
                  <p className="text-xs font-semibold text-white">Save 30% on 50+ Pack Orders</p>
                </div>

              </div>

              {/* Decorative Accent Border Frame */}
              <div className="absolute -inset-2 rounded-3xl border border-[#D5C6A3]/60 -z-10 rotate-1 pointer-events-none" />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
