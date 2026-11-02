import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Cpu, 
  Layers, 
  Database, 
  Globe2,
  Sparkles,
  Zap,
  Terminal
} from 'lucide-react';

export default function AboutPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      {/* Banner */}
      <div className="bg-[#1C1A17] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#383227] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-3xl mx-auto space-y-3 relative z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C4A052]" />
            <span>Master Engineering &bull; Bengaluru Flagship</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
            About BeadsSource &bull; Engineering &amp; Heritage
          </h1>
          <p className="text-xs sm:text-sm text-[#D8D2C4] leading-relaxed max-w-2xl mx-auto">
            A production-ready international wholesale e-commerce platform built for Ramesh Sir (SP Bengaluru), engineered for high-throughput jewelry component distribution worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        
        {/* Project Genesis & Client Profile */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE4D5] shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#8C6D2B]">
            <Building2 className="w-4 h-4" />
            <span>Project Background &bull; Ramesh Sir (SP Bengaluru)</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            The BeadsSource Redesign &bull; Modernizing a Legacy Wholesale Giant
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#5C5547] leading-relaxed">
            <p>
              Headquartered in Bengaluru's renowned jewelry and electronics commerce nerve center on SP Road, <strong>BeadsSource</strong> has served as an essential primary manufacturer and wholesale export supplier of natural gemstone bead strands, certified lead-free pewter charms, pavé cubic zirconia findings, and finished artisanal jewelry for more than twenty years.
            </p>
            <p>
              Under the direct leadership of <strong>Ramesh Sir</strong>, this platform transformation was undertaken to overcome the limitations of legacy WordPress/WooCommerce infrastructure. Guided by the streamlined, conversion-optimized wholesale architecture of <em>Everful Wholesale</em>, BeadsSource was rebuilt into an ultra-fast, modern, production-grade e-commerce application designed to serve high-volume B2B jewelers, international designer studios, and boutique chains across 40+ countries.
            </p>
            <p>
              Every genuine product code (e.g. <code>A12502</code>, <code>A5853</code>, <code>A8283</code>, <code>A1016</code>, <code>A912</code>, <code>A39286</code>), original wholesale price tier ($0.30 to $20.00), factory photography asset, and gemstone specification has been migrated and structured into an immutable, searchable catalog schema.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#F0EBE1]">
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D5]">
              <p className="font-serif font-bold text-2xl text-[#1A1A1A]">20+ Years</p>
              <p className="text-xs text-gray-500 mt-1">SP Bengaluru Showroom &amp; Export Desk</p>
            </div>
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D5]">
              <p className="font-serif font-bold text-2xl text-[#8C6D2B]">5,000+</p>
              <p className="text-xs text-gray-500 mt-1">Verified International Jewelry Buyers</p>
            </div>
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D5]">
              <p className="font-serif font-bold text-2xl text-[#1A1A1A]">100%</p>
              <p className="text-xs text-gray-500 mt-1">Certified Lead &amp; Cadmium Free (CPSIA)</p>
            </div>
          </div>
        </div>

        {/* Technical Architecture (Expert Developer Breakdown) */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE4D5] shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#8C6D2B]">
            <Terminal className="w-4 h-4" />
            <span>Developer Architecture &bull; Technical Specifications</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Engineered for Sub-Second Performance &amp; Scalability
          </h2>

          <p className="text-xs sm:text-sm text-[#5C5547] leading-relaxed">
            As modern full-stack web architects, we selected a decoupled, high-resilience architecture that guarantees zero hydration lag, instant SKU search, and continuous uptime:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D5] space-y-2.5">
              <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-sm">
                <Code2 className="w-4 h-4 text-[#8C6D2B]" />
                <span>Frontend: React 19 &amp; Vite 8 + Tailwind v4</span>
              </div>
              <p className="text-xs text-[#6B6557] leading-relaxed">
                Harnessing Vite's lightning-fast compilation, native ES modules, and Tailwind CSS v4's modern engine. Zero runtime overhead, instantaneous route transitions, and responsive fluid layouts optimized for mobile, tablet, and desktop viewports.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D5] space-y-2.5">
              <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-sm">
                <Cpu className="w-4 h-4 text-[#8C6D2B]" />
                <span>Backend: Node.js Express REST API</span>
              </div>
              <p className="text-xs text-[#6B6557] leading-relaxed">
                Lightweight, high-concurrency Express REST API operating on port 5000. Provides atomic endpoints for product filtering, wholesale user authentication, coupon validation, inventory decrementing, and quote dispatching.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D5] space-y-2.5">
              <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-sm">
                <Database className="w-4 h-4 text-[#8C6D2B]" />
                <span>Data Layer: Persistent Atomic JSON Store</span>
              </div>
              <p className="text-xs text-[#6B6557] leading-relaxed">
                Self-contained, zero-dependency persistent JSON database architecture residing in <code>server/data/</code>. Delivers instant portability, zero complex database connection setup, and automated local fallback data hydration for offline testing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D5] space-y-2.5">
              <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-sm">
                <Zap className="w-4 h-4 text-[#8C6D2B]" />
                <span>Wholesale Engine &amp; Automatic Tier Algorithm</span>
              </div>
              <p className="text-xs text-[#6B6557] leading-relaxed">
                Custom volume discount pricing matrix applying <strong>15% Off for 10–49 packs</strong> and <strong>30% Off for 50+ packs</strong>. Integrated with live USD/INR currency exchange rate toggles and multi-product RFQ quotation state machines.
              </p>
            </div>

          </div>
        </div>

        {/* Quality Standards & Regulatory Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5E8] flex items-center justify-center text-[#8C6D2B]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">US &amp; EU Regulatory Compliance</h3>
            <p className="text-xs text-[#6B6557] leading-relaxed">
              Every cast pewter spacer, bail, toggle clasp, and finding is certified 100% lead-free (&lt;90 ppm) and cadmium-free. We strictly adhere to California Proposition 65, the US Consumer Product Safety Improvement Act (CPSIA), and European REACH standards (EC 1907/2006).
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5E8] flex items-center justify-center text-[#8C6D2B]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Authentic Natural Minerals</h3>
            <p className="text-xs text-[#6B6557] leading-relaxed">
              We reject synthetic resin and plastic imitations. From Brazilian amethysts and Australian emeralds to African turquoise, our stones are graded, calibrated for uniform 1.0mm–1.5mm bead hole diameters, and stringently inspected for mineral density and polish luster.
            </p>
          </div>
        </div>

        {/* Showroom & Production Hub Details */}
        <div className="bg-white rounded-3xl p-8 border border-[#EAE4D5] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">
            Bengaluru Showroom &amp; Dispatch Facility
          </h3>
          <p className="text-xs text-[#6B6557] leading-relaxed">
            Wholesale buyers and jewelry designers visiting Karnataka are warmly invited to visit our physical showroom on SP Road to inspect gemstone roughs, calibrated beads, and custom pewter molds in person.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5]">
              <strong className="block text-[#1A1A1A]">Physical Address</strong>
              <span className="text-gray-500">SP Road Commercial Center, Bengaluru 560002, India</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5]">
              <strong className="block text-[#1A1A1A]">Direct WhatsApp / Call</strong>
              <span className="text-gray-500">+91 98450 12399 (Ramesh Sir)</span>
            </div>
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5]">
              <strong className="block text-[#1A1A1A]">Export Desk Email</strong>
              <span className="text-gray-500">wholesale@beadssource.com</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-10 bg-[#1C1A17] text-white rounded-3xl text-center space-y-4">
          <h3 className="font-serif font-bold text-2xl text-white">Partner with BeadsSource Today</h3>
          <p className="text-xs text-[#C9C3B4] max-w-md mx-auto">
            Experience direct factory manufacturing, tiered bulk discounts, and prompt worldwide express air dispatch.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#B38F26] text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Explore Catalogue
            </button>
            <button
              onClick={() => onNavigate('quote')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              Request a Bulk Quote
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
