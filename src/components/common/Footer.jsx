import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  Truck, 
  FileText,
  ArrowRight, 
  CheckCircle2 
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
    <footer className="bg-[#FAF8F3] text-[#292723] border-t border-[#EDE5D8] pt-16 pb-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Pillars Banner in High-Legibility Luxury Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pb-14 border-b border-[#EDE5D8]">
          <div className="bg-white p-5 rounded-2xl border border-[#EDE5D8] shadow-xs hover:border-[#C6A66B]/60 hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F3] flex items-center justify-center shrink-0 border border-[#EDE5D8]">
              <ShieldCheck className="w-6 h-6 text-[#C6A66B]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#292723]">Direct Factory Sourcing</h4>
              <p className="text-sm text-[#5C554E] leading-relaxed mt-1">True manufacturer pricing with zero middleman markups.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDE5D8] shadow-xs hover:border-[#C6A66B]/60 hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F3] flex items-center justify-center shrink-0 border border-[#EDE5D8]">
              <Award className="w-6 h-6 text-[#C6A66B]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#292723]">Tested Genuine Minerals</h4>
              <p className="text-sm text-[#5C554E] leading-relaxed mt-1">100% authentic gemstones &amp; certified lead-free pewter.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDE5D8] shadow-xs hover:border-[#C6A66B]/60 hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F3] flex items-center justify-center shrink-0 border border-[#EDE5D8]">
              <Truck className="w-6 h-6 text-[#C6A66B]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#292723]">Worldwide Fast Dispatch</h4>
              <p className="text-sm text-[#5C554E] leading-relaxed mt-1">Express DHL/FedEx worldwide delivery with live tracking.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDE5D8] shadow-xs hover:border-[#C6A66B]/60 hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F3] flex items-center justify-center shrink-0 border border-[#EDE5D8]">
              <FileText className="w-6 h-6 text-[#C6A66B]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#292723]">Dedicated RFQ Desk</h4>
              <p className="text-sm text-[#5C554E] leading-relaxed mt-1">Custom gemstone cuts, bulk orders &amp; OEM casting.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-[#EDE5D8]">
          
          {/* Col 1: Brand & International Operations */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate && onNavigate('home')}
              className="cursor-pointer inline-block"
            >
              <BrandLogo variant="default" size="lg" withSubtitle={true} />
            </div>

            <p className="text-sm text-[#4A453F] leading-relaxed max-w-sm pt-1">
              BeadsSource is an international manufacturer and wholesale exporter of natural gemstone beads, pavé cubic zirconia, lead-free pewter components, and finished artisanal jewelry.
            </p>

            <div className="space-y-2.5 text-sm text-[#292723] pt-3">
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span className="font-medium">Central International Distribution &amp; Sourcing Operations</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span className="font-medium">+1 (800) 555-0199 &bull; Global Wholesale Desk</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span className="font-medium">wholesale@beadssource.com &bull; support@beadssource.com</span>
              </p>
            </div>
          </div>

          {/* Col 2: Wholesale Categories */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase font-bold tracking-wider text-[#A9812A]">Product Catalogue</h4>
            <ul className="space-y-2.5 text-sm text-[#4A453F]">
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'finished-jewelry' })} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium text-left"
                >
                  Finished Jewelry
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'beads' })} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium text-left"
                >
                  Beads &amp; Mineral Strands
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'pewter' })} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium text-left"
                >
                  Lead-Free Pewter
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'finding' })} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium text-left"
                >
                  Findings &amp; Clasps
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'accessories' })} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium text-left"
                >
                  Accessories &amp; Pavé CZ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'seasonal-trends' })} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium text-left"
                >
                  Seasonal Trends
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'new-arrivals' })} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium text-left"
                >
                  New Sea Arrivals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'best-sellers' })} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium text-left"
                >
                  Volume Best Sellers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Wholesale B2B Services */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase font-bold tracking-wider text-[#A9812A]">Wholesale Desk</h4>
            <ul className="space-y-2.5 text-sm text-[#4A453F]">
              <li>
                <button 
                  onClick={() => onNavigate('quote')} 
                  className="hover:text-[#8D6B23] transition-colors text-[#A9812A] font-bold cursor-pointer flex items-center gap-1"
                >
                  <span>Submit Bulk RFQ Quotation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'all' })} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium"
                >
                  Tiered Volume Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium"
                >
                  Custom OEM Bead Sourcing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium"
                >
                  Private Showroom Visits
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="hover:text-[#292723] hover:translate-x-1 transition-all cursor-pointer font-medium"
                >
                  Track Purchase Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase font-bold tracking-wider text-[#A9812A]">Wholesale Insider</h4>
            <p className="text-sm text-[#5C554E] leading-relaxed">
              Receive priority alerts for new container shipments, rare gemstone arrivals, and private bulk discounts.
            </p>
            {subscribed ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! You are subscribed to Wholesale Alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter business email..."
                  className="w-full px-4 py-3 bg-white border border-[#EDE5D8] rounded-xl text-sm text-[#292723] placeholder-[#8B8175] focus:outline-none focus:border-[#C6A66B] shadow-xs"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#C6A66B] hover:bg-[#B39358] text-[#292723] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>Subscribe for Bulk Alerts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-[#5C554E] gap-4">
          <p className="font-medium">
            &copy; 2026 BeadsSource LLC &bull; All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-medium text-xs sm:text-sm">
            <span>California Prop 65 Lead-Free</span>
            <span className="hidden sm:inline">&bull;</span>
            <span>CPSIA Tested</span>
            <span className="hidden sm:inline">&bull;</span>
            <span>US &amp; EU REACH Compliant</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-white px-3.5 py-1.5 rounded-lg border border-[#EDE5D8] text-[#292723] font-bold shadow-xs flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>DHL Express Worldwide</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
