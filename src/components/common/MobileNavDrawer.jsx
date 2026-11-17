import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  FileText, 
  User, 
  Heart, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import BrandLogo from './BrandLogo';

const CATEGORIES = [
  { id: 'natural-gemstone-beads', name: 'Natural Gemstone Beads' },
  { id: 'turquoise-beads', name: 'Turquoise Beads' },
  { id: 'crystal-beads', name: 'Crystal Beads' },
  { id: 'cubic-zirconia', name: 'Cubic Zirconia (CZ)' },
  { id: 'jewelry-pendants', name: 'Jewelry Pendants' },
  { id: 'jewelry-connectors', name: 'Jewelry Connectors' },
  { id: 'jewelry-spacers', name: 'Jewelry Spacers' },
  { id: 'jewelry-findings', name: 'Jewelry Findings' },
  { id: 'handmade-necklaces', name: 'Handmade Necklaces' },
  { id: 'handmade-bracelets', name: 'Handmade Bracelets' },
  { id: 'charms', name: 'Charms & Pendants' },
  { id: 'accessories', name: 'Accessories & Displays' }
];

export default function MobileNavDrawer({ isOpen, onClose, onNavigate, onOpenAuth }) {
  const { user, isAdmin, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-4 bg-[#40362F] text-[#FAF8F3] flex items-center justify-between border-b border-[#52463D]">
          <button 
            onClick={() => { onClose(); onNavigate('home'); }}
            className="text-left focus:outline-none cursor-pointer"
          >
            <BrandLogo variant="dark" size="sm" withSubtitle={true} />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#EDE5D8] hover:text-[#C6A66B] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card / Login Banner */}
        <div className="p-4 bg-[#FAF8F3] border-b border-[#EDE5D8]">
          {user ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#292723]">{user.name || user.company || user.email || 'Customer'}</p>
              <p className="text-[11px] text-[#8B8175]">{user.company || user.email}</p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => { onClose(); onNavigate('dashboard'); }}
                  className="text-xs text-[#C6A66B] font-semibold hover:underline cursor-pointer"
                >
                  My Orders &bull; Dashboard
                </button>
                {isAdmin && (
                  <button
                    onClick={() => { onClose(); onNavigate('admin'); }}
                    className="text-xs text-[#C6A66B] font-bold hover:underline cursor-pointer"
                  >
                    Admin Suite
                  </button>
                )}
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="text-xs text-red-600 hover:underline ml-auto cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#292723]">Wholesale B2B Account</p>
                <p className="text-[11px] text-[#8B8175]">Access bulk volume discounts</p>
              </div>
              <button
                onClick={() => { onClose(); onOpenAuth(); }}
                className="px-3.5 py-1.5 bg-[#40362F] text-[#FAF8F3] text-xs font-bold rounded-xl hover:bg-[#52463D] cursor-pointer shadow-xs"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Currency Switcher */}
        <div className="px-4 py-2.5 bg-white border-b border-[#EDE5D8] flex items-center justify-between text-xs">
          <span className="text-[#8B8175] flex items-center gap-1.5 font-medium">
            <Globe className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Currency:</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${currency === 'USD' ? 'bg-[#C6A66B] text-white shadow-xs' : 'bg-[#FAF8F3] text-[#40362F] border border-[#EDE5D8]'}`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${currency === 'INR' ? 'bg-[#C6A66B] text-white shadow-xs' : 'bg-[#FAF8F3] text-[#40362F] border border-[#EDE5D8]'}`}
            >
              INR (₹)
            </button>
          </div>
        </div>

        {/* Main Navigation Links */}
        <div className="py-2 flex-1">
          <button
            onClick={() => { onClose(); onNavigate('home'); }}
            className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#292723] hover:bg-[#FAF8F3] flex items-center justify-between cursor-pointer"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-[#8B8175]" />
          </button>

          <button
            onClick={() => { onClose(); onNavigate('catalog', { category: 'all' }); }}
            className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#292723] hover:bg-[#FAF8F3] flex items-center justify-between cursor-pointer"
          >
            <span>Complete Wholesale Catalogue</span>
            <ChevronRight className="w-4 h-4 text-[#8B8175]" />
          </button>

          {/* Categories Accordion */}
          <div>
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#C6A66B] bg-[#FAF8F3] hover:bg-[#EDE5D8]/50 flex items-center justify-between border-y border-[#EDE5D8] cursor-pointer"
            >
              <span>Wholesale Categories (12)</span>
              {categoriesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {categoriesOpen && (
              <div className="bg-[#FAF8F3]/60 py-1 pl-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { onClose(); onNavigate('catalog', { category: cat.id }); }}
                    className="w-full px-4 py-2 text-left text-xs text-[#40362F] hover:text-[#C6A66B] flex items-center justify-between cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#EDE5D8]" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => { onClose(); onNavigate('quote'); }}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#C6A66B] hover:bg-[#FAF8F3] flex items-center justify-between mt-1 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C6A66B]" />
              <span>Request Wholesale Quotation (RFQ)</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#8B8175]" />
          </button>

          <button
            onClick={() => { onClose(); onNavigate('wishlist'); }}
            className="w-full px-4 py-2.5 text-left text-xs text-[#40362F] hover:bg-[#FAF8F3] flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#8B8175]" />
              <span>Saved Wishlist</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#8B8175]" />
          </button>

          <button
            onClick={() => { onClose(); onNavigate('about'); }}
            className="w-full px-4 py-2.5 text-left text-xs text-[#40362F] hover:bg-[#FAF8F3] flex items-center justify-between cursor-pointer"
          >
            <span>Our Heritage &amp; Craft</span>
            <ChevronRight className="w-4 h-4 text-[#8B8175]" />
          </button>

          <button
            onClick={() => { onClose(); onNavigate('contact'); }}
            className="w-full px-4 py-2.5 text-left text-xs text-[#40362F] hover:bg-[#FAF8F3] flex items-center justify-between cursor-pointer"
          >
            <span>Contact &amp; Support Desk</span>
            <ChevronRight className="w-4 h-4 text-[#8B8175]" />
          </button>
        </div>

        {/* Footer Contact Info */}
        <div className="p-4 bg-[#FAF8F3] border-t border-[#EDE5D8] text-[11px] text-[#8B8175] space-y-2">
          <p className="flex items-center gap-1.5 font-medium text-[#40362F]">
            <MapPin className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Central International Logistics Center</span>
          </p>
          <p className="flex items-center gap-1.5 font-medium text-[#40362F]">
            <Phone className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>+1 (800) 555-0199 &bull; support@beadssource.com</span>
          </p>
          <p className="flex items-center gap-1.5 text-[10px] text-[#8B8175]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>100% Genuine Mineral Certification Guaranteed</span>
          </p>
        </div>
      </div>
    </div>
  );
}
