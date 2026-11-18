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

const MASTER_CATEGORIES = [
  {
    id: 'finished-jewelry',
    name: 'Finished Jewelry',
    subcategories: [
      { id: 'bracelets', name: 'Bracelets' },
      { id: 'necklaces', name: 'Necklaces' },
      { id: 'rings', name: 'Rings' },
      { id: 'earrings', name: 'Earrings' },
      { id: 'jewelry-display', name: 'Jewelry Display' }
    ]
  },
  {
    id: 'beads',
    name: 'Beads',
    subcategories: [
      { id: 'clay-disc', name: 'Clay Disc' },
      { id: 'acrylic-beads', name: 'Acrylic Beads' },
      { id: 'crystal-beads', name: 'Crystal Beads' },
      { id: 'gemstone', name: 'Gemstone' },
      { id: 'large-hole', name: 'Large Hole' },
      { id: 'shell', name: 'Shell' },
      { id: 'pearl-beads', name: 'Pearl Beads' }
    ]
  },
  {
    id: 'pewter',
    name: 'Pewter',
    subcategories: [
      { id: 'crosses', name: 'Crosses' },
      { id: 'religious', name: 'Religious' },
      { id: 'toggles', name: 'Toggles' },
      { id: 'bails-wings', name: 'Bails & Wings' },
      { id: 'butterflies-flowers', name: 'Butterflies & Flowers' },
      { id: 'fleur-de-lis-feathers', name: 'Fleur De Lis / Feathers' },
      { id: 'spacers-daisies', name: 'Spacers & Daisies' },
      { id: 'caps', name: 'Caps & End Caps' },
      { id: 'sports-western', name: 'Sports & Western' },
      { id: 'filler-charms', name: 'Filler Charms' },
      { id: 'animals-ocean-life', name: 'Animals & Ocean Life' }
    ]
  },
  {
    id: 'finding',
    name: 'Finding',
    subcategories: [
      { id: 'chain', name: 'Chain' },
      { id: 'spacer', name: 'Spacer' },
      { id: 'lobster', name: 'Lobster' },
      { id: 'clasps', name: 'Clasps' },
      { id: 'pins', name: 'Pins' },
      { id: 'earring-findings', name: 'Earring Findings' },
      { id: 'end-caps', name: 'End Caps' },
      { id: 'jewelry-wire', name: 'Jewelry Wire' },
      { id: 'jump-split-ring', name: 'Jump / Split Ring' }
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subcategories: [
      { id: 'line', name: 'Line & Cord' },
      { id: 'pave-cz', name: 'Pave CZ' },
      { id: 'pendants', name: 'Pendants' },
      { id: 'flower-charm', name: 'Flower Charm' },
      { id: 'rhinestone', name: 'Rhinestone' },
      { id: 'tassels', name: 'Tassels' }
    ]
  },
  {
    id: 'seasonal-trends',
    name: 'Seasonal Trends',
    subcategories: [
      { id: 'gemstone-jewelry', name: 'Gemstone Jewelry' },
      { id: 'mala-jewelry', name: 'Mala Jewelry' },
      { id: 'rosany-jewelry', name: 'Rosany Jewelry' },
      { id: 'southwestern-jewelry', name: 'Southwestern Jewelry' },
      { id: 'vintage-style', name: 'Vintage Style' },
      { id: 'druzy-jewelry', name: 'Druzy Jewelry' },
      { id: 'crosheted-jewelry', name: 'Crosheted Jewelry' },
      { id: 'layery-jewelry', name: 'Layery Jewelry' }
    ]
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    subcategories: [
      { id: '142-sea-shipment', name: '142 Sea Shipment' },
      { id: '143-sea-shipment', name: '143 Sea Shipment' },
      { id: '144-sea-shipment', name: '144 Sea Shipment' },
      { id: '145-sea-shipment', name: '145 Sea Shipment' },
      { id: '146-sea-shipment', name: '146 Sea Shipment' },
      { id: '147-sea-shipment', name: '147 Sea Shipment' }
    ]
  },
  {
    id: 'best-sellers',
    name: 'Best Sellers',
    subcategories: [
      { id: 'volume-bestsellers', name: 'Volume Bestsellers' },
      { id: 'studio-favorites', name: 'Studio Favorites' }
    ]
  }
];

export default function MobileNavDrawer({ isOpen, onClose, onNavigate, onOpenAuth }) {
  const { user, isAdmin, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [expandedCatId, setExpandedCatId] = useState(null);

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
              <span>Wholesale Master Categories (8)</span>
              {categoriesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {categoriesOpen && (
              <div className="bg-[#FAF8F3]/60 py-1 divide-y divide-[#EDE5D8]/40">
                {MASTER_CATEGORIES.map(cat => {
                  const isExpanded = expandedCatId === cat.id;
                  return (
                    <div key={cat.id} className="text-xs">
                      <div className="flex items-center justify-between px-4 py-2 hover:bg-[#FAF8F3]">
                        <button
                          onClick={() => { onClose(); onNavigate('catalog', { category: cat.id }); }}
                          className="font-medium text-[#40362F] hover:text-[#C6A66B] text-left flex-1"
                        >
                          {cat.name}
                        </button>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCatId(isExpanded ? null : cat.id);
                            }}
                            className="p-1 text-[#8B8175] hover:text-[#C6A66B]"
                            aria-label={`Toggle ${cat.name} subcategories`}
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>

                      {isExpanded && cat.subcategories && (
                        <div className="pl-6 pr-3 py-1 bg-white space-y-1 border-t border-[#EDE5D8]/30">
                          <button
                            onClick={() => { onClose(); onNavigate('catalog', { category: cat.id }); }}
                            className="w-full text-left py-1 text-[11px] font-bold text-[#C6A66B] hover:underline"
                          >
                            &bull; All in {cat.name}
                          </button>
                          {cat.subcategories.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => { onClose(); onNavigate('catalog', { category: cat.id, subcategory: sub.id }); }}
                              className="w-full text-left py-1 text-[11px] text-[#40362F] hover:text-[#C6A66B] flex items-center justify-between"
                            >
                              <span>{sub.name}</span>
                              <ChevronRight className="w-2.5 h-2.5 text-[#EDE5D8]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
