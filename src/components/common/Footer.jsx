import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  Truck, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer({ onNavigate }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#40362F] text-[#EDE5D8] border-t border-[#52463D] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Pillars Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-[#52463D]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#52463D] flex items-center justify-center shrink-0 border border-[#EDE5D8]/20">
              <ShieldCheck className="w-5 h-5 text-[#C6A66B]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FAF8F3]">Direct Factory Sourcing</h4>
              <p className="text-xs text-[#EDE5D8]/80 mt-0.5">True manufacturer pricing with zero middleman markups.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#52463D] flex items-center justify-center shrink-0 border border-[#EDE5D8]/20">
              <Award className="w-5 h-5 text-[#C6A66B]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FAF8F3]">Tested Genuine Minerals</h4>
              <p className="text-xs text-[#EDE5D8]/80 mt-0.5">100% authentic gemstones &amp; certified lead-free pewter.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#52463D] flex items-center justify-center shrink-0 border border-[#EDE5D8]/20">
              <Truck className="w-5 h-5 text-[#C6A66B]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FAF8F3]">Worldwide Fast Dispatch</h4>
              <p className="text-xs text-[#EDE5D8]/80 mt-0.5">Express DHL/FedEx worldwide delivery with tracking.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#52463D] flex items-center justify-center shrink-0 border border-[#EDE5D8]/20">
              <FileText className="w-5 h-5 text-[#C6A66B]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FAF8F3]">Dedicated RFQ Desk</h4>
              <p className="text-xs text-[#EDE5D8]/80 mt-0.5">Custom gemstone cuts, bulk orders &amp; OEM casting.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-[#52463D]">
          
          {/* Col 1: Brand & International Operations */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate && onNavigate('home')}
              className="cursor-pointer inline-block"
            >
              <BrandLogo variant="dark" size="lg" withSubtitle={true} />
            </div>

            <p className="text-xs text-[#EDE5D8]/80 leading-relaxed max-w-sm">
              BeadsSource is an international manufacturer and wholesale exporter of natural gemstone beads, pavé cubic zirconia, lead-free pewter components, and finished artisanal jewelry.
            </p>

            <div className="space-y-2 text-xs text-[#EDE5D8] pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span>Central International Distribution &amp; Sourcing Operations</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span>+1 (800) 555-0199 &bull; Global Wholesale Desk</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span>wholesale@beadssource.com &bull; support@beadssource.com</span>
              </p>
            </div>
          </div>

          {/* Col 2: Wholesale Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#C6A66B]">Product Catalogue</h4>
            <ul className="space-y-2 text-xs text-[#EDE5D8]/80">
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'natural-gemstone-beads' })} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Natural Gemstones
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'turquoise-beads' })} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Turquoise Beads &amp; Slabs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'cubic-zirconia' })} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Micro Pave CZ Spacers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'charms' })} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Lead-Free Pewter Charms
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'jewelry-findings' })} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Lobster Clasps &amp; Findings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'handmade-necklaces' })} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Handmade Knotted Necklaces
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Wholesale B2B Services */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#C6A66B]">Wholesale Desk</h4>
            <ul className="space-y-2 text-xs text-[#EDE5D8]/80">
              <li>
                <button 
                  onClick={() => onNavigate('quote')} 
                  className="hover:text-white transition-colors text-[#C6A66B] font-semibold cursor-pointer"
                >
                  Submit Bulk RFQ Quotation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'all' })} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tiered Volume Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Custom OEM Bead Sourcing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Private Showroom Visits
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Purchase Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#C6A66B]">Wholesale Insider</h4>
            <p className="text-xs text-[#EDE5D8]/80 leading-relaxed">
              Receive priority alerts for new container shipments, rare gemstone arrivals, and private bulk discounts.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#52463D] border border-[#EDE5D8]/30 rounded-xl text-xs text-[#D8C49A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C6A66B]" />
                <span>Thank you! You are subscribed to Wholesale Alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter business email..."
                  className="w-full px-3.5 py-2.5 bg-[#52463D] border border-[#EDE5D8]/30 rounded-xl text-xs text-[#FAF8F3] placeholder-[#EDE5D8]/60 focus:outline-none focus:border-[#C6A66B]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#C6A66B] hover:bg-[#D8C49A] text-[#40362F] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Subscribe for Bulk Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#EDE5D8]/70 gap-4">
          <p>
            &copy; 2026 BeadsSource LLC &bull; All Rights Reserved.
          </p>

          <div className="flex items-center gap-6">
            <span>California Prop 65 Lead-Free</span>
            <span>CPSIA Tested</span>
            <span>US &amp; EU REACH Compliant</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] bg-[#52463D] px-2.5 py-1 rounded-lg border border-[#EDE5D8]/20 text-[#D8C49A]">
              Bank Wire / TT
            </span>
            <span className="text-[11px] bg-[#52463D] px-2.5 py-1 rounded-lg border border-[#EDE5D8]/20 text-[#D8C49A]">
              UPI / Net Banking
            </span>
            <span className="text-[11px] bg-[#52463D] px-2.5 py-1 rounded-lg border border-[#EDE5D8]/20 text-[#D8C49A]">
              DHL / FedEx
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
