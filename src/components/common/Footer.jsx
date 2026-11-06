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
    <footer className="bg-[#141210] text-[#D8D2C4] border-t border-[#2D2821] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Pillars Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-[#2B2620]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#242019] flex items-center justify-center shrink-0 border border-[#3D372D]">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Direct Factory Sourcing</h4>
              <p className="text-xs text-[#9E9789] mt-0.5">True manufacturer pricing with zero middleman markups.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#242019] flex items-center justify-center shrink-0 border border-[#3D372D]">
              <Award className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Tested Genuine Minerals</h4>
              <p className="text-xs text-[#9E9789] mt-0.5">100% authentic gemstones & certified lead-free pewter.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#242019] flex items-center justify-center shrink-0 border border-[#3D372D]">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Worldwide Fast Dispatch</h4>
              <p className="text-xs text-[#9E9789] mt-0.5">Express DHL/FedEx worldwide delivery with tracking.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#242019] flex items-center justify-center shrink-0 border border-[#3D372D]">
              <FileText className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Dedicated RFQ Desk</h4>
              <p className="text-xs text-[#9E9789] mt-0.5">Custom gemstone cuts, bulk orders & OEM casting.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-[#2B2620]">
          
          {/* Col 1: Brand & Bengaluru Flagship */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#D4AF37] to-[#8C6212] flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
                B
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                BEADS<span className="text-[#C49A3A]">SOURCE</span>
              </span>
            </div>

            <p className="text-xs text-[#9E9789] leading-relaxed max-w-sm">
              BeadsSource is an international manufacturer and wholesale exporter of natural gemstone beads, pavé cubic zirconia, lead-free pewter components, and finished artisanal jewelry.
            </p>

            <div className="space-y-2 text-xs text-[#B8B2A4] pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C49A3A] shrink-0" />
                <span>Central International Distribution &amp; Sourcing Operations</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C49A3A] shrink-0" />
                <span>+1 (800) 555-0199 &bull; Global Wholesale Desk</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C49A3A] shrink-0" />
                <span>wholesale@beadssource.com &bull; support@beadssource.com</span>
              </p>
            </div>
          </div>

          {/* Col 2: Wholesale Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#E6C687]">Product Catalogue</h4>
            <ul className="space-y-2 text-xs text-[#A8A193]">
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'natural-gemstone-beads' })} 
                  className="hover:text-white transition-colors"
                >
                  Natural Gemstones
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'turquoise-beads' })} 
                  className="hover:text-white transition-colors"
                >
                  Turquoise Beads &amp; Slabs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'cubic-zirconia' })} 
                  className="hover:text-white transition-colors"
                >
                  Micro Pave CZ Spacers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'charms' })} 
                  className="hover:text-white transition-colors"
                >
                  Lead-Free Pewter Charms
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'jewelry-findings' })} 
                  className="hover:text-white transition-colors"
                >
                  Lobster Clasps &amp; Findings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'handmade-necklaces' })} 
                  className="hover:text-white transition-colors"
                >
                  Handmade Knotted Necklaces
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Wholesale B2B Services */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#E6C687]">Wholesale Desk</h4>
            <ul className="space-y-2 text-xs text-[#A8A193]">
              <li>
                <button 
                  onClick={() => onNavigate('quote')} 
                  className="hover:text-white transition-colors text-[#D4AF37] font-semibold"
                >
                  Submit Bulk RFQ Quotation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('catalog', { category: 'all' })} 
                  className="hover:text-white transition-colors"
                >
                  Tiered Volume Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-white transition-colors"
                >
                  Custom OEM Bead Sourcing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-white transition-colors"
                >
                  Private Showroom Visits
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="hover:text-white transition-colors"
                >
                  Track Purchase Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#E6C687]">Wholesale Insider</h4>
            <p className="text-xs text-[#9E9789]">
              Receive priority alerts for new container shipments, rare gemstone arrivals, and private bulk discounts.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#24211A] border border-[#3E382D] rounded-lg text-xs text-[#E6C687] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
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
                  className="w-full px-3 py-2 bg-[#201D18] border border-[#383227] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#D4AF37] hover:bg-[#AA771C] text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Subscribe for Bulk Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#80796C] gap-4">
          <p>
            &copy; 2026 BeadsSource LLC &bull; All Rights Reserved.
          </p>

          <div className="flex items-center gap-6">
            <span>California Prop 65 Lead-Free</span>
            <span>CPSIA Tested</span>
            <span>US &amp; EU REACH Compliant</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-[#221F19] px-2 py-0.5 rounded border border-[#383227]">
              Bank Wire / TT
            </span>
            <span className="text-[11px] bg-[#221F19] px-2 py-0.5 rounded border border-[#383227]">
              UPI / Net Banking
            </span>
            <span className="text-[11px] bg-[#221F19] px-2 py-0.5 rounded border border-[#383227]">
              DHL / FedEx
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
