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
      <div className="bg-[#191919] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#2C2C2C] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C49A3A_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-3xl mx-auto space-y-3 relative z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C49A3A] flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C49A3A]" />
            <span>Master Engineering &bull; International Lapidary Heritage</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
            About BeadsSource &bull; Engineering &amp; Heritage
          </h1>
          <p className="text-xs sm:text-sm text-[#D8D2C4] leading-relaxed max-w-2xl mx-auto">
            A production-ready international wholesale e-commerce platform engineered for high-throughput jewelry component manufacturing, gemstone grading, and global distribution.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        
        {/* Project Genesis & Manufacturing Profile */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E9E3D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#8C6D2B]">
            <Building2 className="w-4 h-4 text-[#C49A3A]" />
            <span>Global Manufacturing &bull; Wholesale Operations</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191919]">
            The BeadsSource Platform &bull; Precision Wholesale Architecture
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#5C5547] leading-relaxed">
            <p>
              Operating as an essential primary manufacturer and wholesale export supplier of natural gemstone bead strands, certified lead-free pewter charms, pavé cubic zirconia findings, and finished artisanal jewelry for more than twenty years, <strong>BeadsSource</strong> delivers factory-direct supplies to professional jewelers and design ateliers worldwide.
            </p>
            <p>
              Under unified executive management, this platform transformation was undertaken to overcome the limitations of legacy e-commerce infrastructure. Guided by streamlined, conversion-optimized wholesale architecture, BeadsSource was rebuilt into an ultra-fast, modern, production-grade e-commerce application designed to serve high-volume B2B jewelers, international designer studios, and boutique chains across 40+ countries.
            </p>
            <p>
              Every genuine product code (e.g. <code>A12502</code>, <code>A5853</code>, <code>A8283</code>, <code>A1016</code>, <code>A912</code>, <code>A39286</code>), original wholesale price tier ($0.30 to $20.00), factory photography asset, and gemstone specification has been migrated and structured into an immutable, searchable catalog schema.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#F0EBE1]">
            <div className="p-4 bg-[#F8F6F1] rounded-2xl border border-[#E9E3D8]">
              <p className="font-serif font-bold text-2xl text-[#191919]">20+ Years</p>
              <p className="text-xs text-gray-500 mt-1">Wholesale Export &amp; Manufacturing</p>
            </div>
            <div className="p-4 bg-[#F8F6F1] rounded-2xl border border-[#E9E3D8]">
              <p className="font-serif font-bold text-2xl text-[#8C6D2B]">5,000+</p>
              <p className="text-xs text-gray-500 mt-1">Verified International Jewelry Buyers</p>
            </div>
            <div className="p-4 bg-[#F8F6F1] rounded-2xl border border-[#E9E3D8]">
              <p className="font-serif font-bold text-2xl text-[#191919]">100%</p>
              <p className="text-xs text-gray-500 mt-1">Certified Lead &amp; Cadmium Free (CPSIA)</p>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E9E3D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#8C6D2B]">
            <Terminal className="w-4 h-4 text-[#C49A3A]" />
            <span>Developer Architecture &bull; Technical Specifications</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191919]">
            Engineered for Sub-Second Performance &amp; Scalability
          </h2>

          <p className="text-xs sm:text-sm text-[#5C5547] leading-relaxed">
            As modern full-stack web architects, we selected a decoupled, high-resilience architecture that guarantees zero hydration lag, instant SKU search, and continuous uptime:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#F8F6F1] border border-[#E9E3D8] space-y-2.5">
              <div className="flex items-center gap-2 text-[#191919] font-bold text-sm">
                <Zap className="w-4 h-4 text-[#C49A3A]" />
                <span>Frontend: React 19 + Vite + Tailwind v4</span>
              </div>
              <p className="text-xs text-[#6E6759] leading-relaxed">
                Lightweight reactive state architecture. Debounced SKU search autocomplete, dynamic tier multiplier calculators, and responsive image galleries.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8F6F1] border border-[#E9E3D8] space-y-2.5">
              <div className="flex items-center gap-2 text-[#191919] font-bold text-sm">
                <Cpu className="w-4 h-4 text-[#C49A3A]" />
                <span>Backend: Node.js Express REST API</span>
              </div>
              <p className="text-xs text-[#6E6759] leading-relaxed">
                High-throughput Express server with role-based access control (RBAC), atomic transaction operations, and comprehensive inventory management.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8F6F1] border border-[#E9E3D8] space-y-2.5">
              <div className="flex items-center gap-2 text-[#191919] font-bold text-sm">
                <Database className="w-4 h-4 text-[#C49A3A]" />
                <span>Data Layer: Atomic JSON Engine</span>
              </div>
              <p className="text-xs text-[#6E6759] leading-relaxed">
                Zero-configuration persistent storage. Complete ACID file write locks, fallback hydration, and seamless portability across hosting providers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8F6F1] border border-[#E9E3D8] space-y-2.5">
              <div className="flex items-center gap-2 text-[#191919] font-bold text-sm">
                <Globe2 className="w-4 h-4 text-[#C49A3A]" />
                <span>International B2B E-Commerce Logic</span>
              </div>
              <p className="text-xs text-[#6E6759] leading-relaxed">
                Real-time currency conversion (USD, EUR, GBP, INR), multi-product RFQ quotation desk, volume discounts, and printable tax commercial invoices.
              </p>
            </div>
          </div>
        </div>

        {/* Quality Assurance & Gemstone Mineral Standards */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E9E3D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#8C6D2B]">
            <Award className="w-4 h-4 text-[#C49A3A]" />
            <span>International Compliance &bull; Quality Assurance</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191919]">
            Strict International Safety &amp; Geological Purity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#524B3E]">
            <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E9E3D8] space-y-1">
              <strong className="block text-[#191919] text-sm">CPSIA &amp; California Prop 65</strong>
              <p className="text-gray-500">
                All pewter findings, spacers, and charms are certified lead-free (&lt;90 ppm) and cadmium-free for fine jewelry manufacturing.
              </p>
            </div>
            <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E9E3D8] space-y-1">
              <strong className="block text-[#191919] text-sm">European REACH Regulation (EC 1907/2006)</strong>
              <p className="text-gray-500">
                Tested free from dangerous nickel release and toxic heavy metal compounds for safe direct skin contact.
              </p>
            </div>
          </div>
        </div>

        {/* Global Operations & Dispatch Hub */}
        <div className="bg-white rounded-3xl p-8 border border-[#E9E3D8] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#191919]">
            Central International Logistics &amp; Operations Center
          </h3>
          <p className="text-xs text-[#6B6557] leading-relaxed">
            Wholesale buyers and jewelry designers are warmly invited to schedule a dedicated consultation with our account specialists to inspect gemstone roughs, calibrated beads, and custom molds.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-3 bg-[#F8F6F1] rounded-xl border border-[#E9E3D8]">
              <strong className="block text-[#191919]">Logistics Facility</strong>
              <span className="text-gray-500">Central Distribution &amp; Sourcing Hub</span>
            </div>
            <div className="p-3 bg-[#F8F6F1] rounded-xl border border-[#E9E3D8]">
              <strong className="block text-[#191919]">International Support Desk</strong>
              <span className="text-gray-500">+1 (800) 555-0199</span>
            </div>
            <div className="p-3 bg-[#F8F6F1] rounded-xl border border-[#E9E3D8]">
              <strong className="block text-[#191919]">Wholesale Inquiries</strong>
              <span className="text-gray-500">wholesale@beadssource.com</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-10 bg-[#191919] text-white rounded-3xl text-center space-y-4">
          <h3 className="font-serif font-bold text-2xl text-white">Partner with BeadsSource Today</h3>
          <p className="text-xs text-[#D8D2C4] max-w-md mx-auto">
            Experience direct factory manufacturing, tiered bulk discounts, and prompt worldwide express air dispatch.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className="px-6 py-3 bg-[#C49A3A] hover:bg-[#A9812A] text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Explore Catalogue
            </button>
            <button
              onClick={() => onNavigate('quote')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors border border-white/20 cursor-pointer"
            >
              Request Custom RFQ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
