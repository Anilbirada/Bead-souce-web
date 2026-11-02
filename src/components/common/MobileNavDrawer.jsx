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
        <div className="p-4 bg-[#1C1A17] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#D4AF37] to-[#8C6212] flex items-center justify-center font-serif font-bold text-sm">
              B
            </div>
            <div>
              <p className="font-serif font-bold text-base leading-tight">BEADSSOURCE</p>
              <p className="text-[9px] uppercase tracking-widest text-[#D4AF37]">Wholesale Platform</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card / Login Banner */}
        <div className="p-4 bg-[#FAF7F0] border-b border-[#EAE4D5]">
          {user ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#1A1A1A]">{user.name}</p>
              <p className="text-[11px] text-[#6B6557]">{user.company || user.email}</p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => { onClose(); onNavigate('dashboard'); }}
                  className="text-xs text-[#B38F26] font-semibold hover:underline"
                >
                  My Orders &bull; Dashboard
                </button>
                {isAdmin && (
                  <button
                    onClick={() => { onClose(); onNavigate('admin'); }}
                    className="text-xs text-[#967117] font-bold hover:underline"
                  >
                    Admin Suite
                  </button>
                )}
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="text-xs text-red-600 hover:underline ml-auto"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">Wholesale B2B Account</p>
                <p className="text-[11px] text-[#736B5E]">Access bulk volume discounts</p>
              </div>
              <button
                onClick={() => { onClose(); onOpenAuth(); }}
                className="px-3 py-1.5 bg-[#1C1A17] text-white text-xs font-semibold rounded-lg hover:bg-[#332E26]"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Currency Switcher */}
        <div className="px-4 py-2.5 bg-white border-b border-[#F0EBE1] flex items-center justify-between text-xs">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#C4A052]" />
            <span>Currency:</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 rounded text-xs font-bold ${currency === 'USD' ? 'bg-[#C4A052] text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2 py-0.5 rounded text-xs font-bold ${currency === 'INR' ? 'bg-[#C4A052] text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              INR (₹)
            </button>
          </div>
        </div>

        {/* Main Navigation Links */}
        <div className="py-2 flex-1">
          <button
            onClick={() => { onClose(); onNavigate('home'); }}
            className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#1A1A1A] hover:bg-[#FAF8F5] flex items-center justify-between"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => { onClose(); onNavigate('catalog', { category: 'all' }); }}
            className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#1A1A1A] hover:bg-[#FAF8F5] flex items-center justify-between"
          >
            <span>Complete Wholesale Catalogue</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Categories Accordion */}
          <div>
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#8C6D2B] bg-[#FDFBF7] hover:bg-[#FAF5E8] flex items-center justify-between border-y border-[#F0EBE1]"
            >
              <span>Wholesale Categories (12)</span>
              {categoriesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {categoriesOpen && (
              <div className="bg-[#FAF8F5] py-1 pl-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { onClose(); onNavigate('catalog', { category: cat.id }); }}
                    className="w-full px-4 py-2 text-left text-xs text-[#4A453A] hover:text-[#B38F26] flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => { onClose(); onNavigate('quote'); }}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#967117] hover:bg-[#FDFBF7] flex items-center justify-between mt-1"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C4A052]" />
              <span>Request Wholesale Quotation (RFQ)</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => { onClose(); onNavigate('wishlist'); }}
            className="w-full px-4 py-2.5 text-left text-xs text-[#4A453A] hover:bg-[#FAF8F5] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-gray-400" />
              <span>Saved Wishlist</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => { onClose(); onNavigate('about'); }}
            className="w-full px-4 py-2.5 text-left text-xs text-[#4A453A] hover:bg-[#FAF8F5] flex items-center justify-between"
          >
            <span>Our Heritage (SP Bengaluru)</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => { onClose(); onNavigate('contact'); }}
            className="w-full px-4 py-2.5 text-left text-xs text-[#4A453A] hover:bg-[#FAF8F5] flex items-center justify-between"
          >
            <span>Contact &amp; Showroom</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Footer Contact Info */}
        <div className="p-4 bg-[#F5F2EB] border-t border-[#E8E2D3] text-[11px] text-[#635C4E] space-y-2">
          <p className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#C4A052]" />
            <span>SP Road, Bengaluru, Karnataka, India</span>
          </p>
          <p className="flex items-center gap-1.5 font-medium">
            <Phone className="w-3.5 h-3.5 text-[#C4A052]" />
            <span>+91 98450 12399 &bull; info@beadssource.com</span>
          </p>
          <p className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
            <span>100% Genuine Mineral Certification Guaranteed</span>
          </p>
        </div>
      </div>
    </div>
  );
}
