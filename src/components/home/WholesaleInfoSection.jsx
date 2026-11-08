import React from 'react';
import { 
  DollarSign, 
  FileText, 
  Truck, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Percent
} from 'lucide-react';

export default function WholesaleInfoSection({ onNavigate }) {
  return (
    <section className="py-14 md:py-20 bg-[#F8F6F1] border-b border-[#E9E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E9E5DC] text-[#176B68] text-xs font-semibold shadow-xs mb-3">
            <Percent className="w-3.5 h-3.5 text-[#C3A36B]" />
            <span>International Wholesale Purchasing Program</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#191F23]">
            Engineered for Designers, Ateliers &amp; Commercial Brands
          </h2>
          <p className="text-xs sm:text-sm text-[#657078] mt-2 leading-relaxed">
            Direct factory manufacturing, transparent volume tier pricing, and streamlined RFQ negotiation workflows built for enterprise jewelry production.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Pillar 1: Automatic Volume Discounts */}
          <div className="bg-white rounded-3xl p-6 border border-[#E9E5DC] shadow-xs hover:border-[#176B68] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF4F3] flex items-center justify-center text-[#176B68] mb-5">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#191F23] mb-2">
              Automated Volume Tiers
            </h3>
            <p className="text-xs text-[#657078] leading-relaxed mb-4">
              Tier discounts apply automatically in your cart: save 15% on 10–49 packs, and unlock a full 30% discount on 50+ pack master production orders.
            </p>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E9E5DC] text-[11px] font-semibold text-[#176B68] flex items-center justify-between">
              <span>50+ Packs</span>
              <span className="font-bold text-[#C3A36B]">30% Off Automatically</span>
            </div>
          </div>

          {/* Pillar 2: Custom Multi-Product RFQ */}
          <div className="bg-white rounded-3xl p-6 border border-[#E9E5DC] shadow-xs hover:border-[#176B68] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5E8] flex items-center justify-center text-[#C3A36B] mb-5">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#191F23] mb-2">
              Multi-Product RFQ Builder
            </h3>
            <p className="text-xs text-[#657078] leading-relaxed mb-4">
              Request bespoke custom carving, specialized plating finishes, or large container lot discounts with direct 24-hour turnaround from our factory production desk.
            </p>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E9E5DC] text-[11px] font-semibold text-[#191F23] flex items-center justify-between">
              <span>Response SLA</span>
              <span className="font-bold text-[#176B68]">Within 24 Hours</span>
            </div>
          </div>

          {/* Pillar 3: Fast Global Express Dispatch */}
          <div className="bg-white rounded-3xl p-6 border border-[#E9E5DC] shadow-xs hover:border-[#176B68] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF4F3] flex items-center justify-center text-[#176B68] mb-5">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#191F23] mb-2">
              Worldwide Express Courier
            </h3>
            <p className="text-xs text-[#657078] leading-relaxed mb-4">
              Orders dispatched from central inventory within 24 to 48 hours via DHL Express Worldwide, FedEx Priority, and air cargo with real-time tracking numbers.
            </p>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E9E5DC] text-[11px] font-semibold text-[#176B68] flex items-center justify-between">
              <span>Global Transit</span>
              <span className="font-bold text-[#C3A36B]">3–5 Business Days</span>
            </div>
          </div>

          {/* Pillar 4: Certified Lead-Free & REACH Compliant */}
          <div className="bg-white rounded-3xl p-6 border border-[#E9E5DC] shadow-xs hover:border-[#176B68] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5E8] flex items-center justify-center text-[#C3A36B] mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#191F23] mb-2">
              CPSIA &amp; REACH Certified
            </h3>
            <p className="text-xs text-[#657078] leading-relaxed mb-4">
              Every pewter finding, clasp, and charm is certified lead-free (&lt;90 ppm) and cadmium-free, verified for commercial export into North America and the EU.
            </p>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E9E5DC] text-[11px] font-semibold text-[#191F23] flex items-center justify-between">
              <span>Lab Compliance</span>
              <span className="font-bold text-emerald-700">100% Certified Safe</span>
            </div>
          </div>

        </div>

        {/* CTA Bar */}
        <div className="bg-[#191F23] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#C3A36B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready to Scale Your Jewelry Production?</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Open a Verified Wholesale Business Account
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Access tiered pricing catalogs, dedicated account executives, sample packs, and commercial Net 30 invoicing terms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate('quote')}
              className="px-6 py-3.5 bg-[#176B68] hover:bg-[#125250] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Multi-Product RFQ</span>
              <ArrowRight className="w-4 h-4 text-[#C3A36B]" />
            </button>
            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className="px-6 py-3.5 bg-white hover:bg-[#FAF8F5] text-[#191F23] text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Browse 2026 Catalogue</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
