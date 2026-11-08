import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Pin, 
  Eye, 
  ShoppingBag, 
  FileText, 
  ArrowRight, 
  Bookmark, 
  Heart, 
  Share2, 
  ExternalLink,
  Layers,
  Check
} from 'lucide-react';
import { api } from '../../utils/api';
import { useCart } from '../../context/CartContext';

const DEFAULT_PINS = [
  {
    id: "camp-001",
    title: "Natural Gemstone Symphony",
    subtitle: "Hand-calibrated turquoise nuggets, smooth ovals, and multi-stone strands for high-end studio jewelers.",
    badge: "Artisan Spotlight",
    tag: "Gemstones",
    image: "https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg",
    cardSize: "tall",
    productId: "bs-011",
    categorySlug: "natural-gemstone-beads",
    ctaText: "Explore Gemstones",
    active: true
  },
  {
    id: "camp-002",
    title: "Micro-Pavé CZ Bridal Clasps",
    subtitle: "18K Gold triple-plated vacuum finish with handset AAA cubic zirconia for bespoke bridal creations.",
    badge: "Couture Component",
    tag: "Connectors",
    image: "https://beadssource.com/wp-content/uploads/2025/09/10mm圆14mm长棒子金色-13包-10个每包-300x300.jpg",
    cardSize: "standard",
    productId: "bs-001",
    categorySlug: "jewelry-connectors",
    ctaText: "Shop Toggle Clasps",
    active: true
  },
  {
    id: "camp-003",
    title: "Lead-Free Pewter Antique Spacers",
    subtitle: "Certified lead-free (<90ppm) and cadmium-free antique gold and silver spacers for CPSIA & REACH compliance.",
    badge: "Certified Safe",
    tag: "Findings",
    image: "https://beadssource.com/wp-content/uploads/2025/09/6mm厚2mmA8283古金18包-古银20包-150x150.jpg",
    cardSize: "standard",
    productId: "bs-004",
    categorySlug: "jewelry-spacers",
    ctaText: "View Pewter Spacers",
    active: true
  },
  {
    id: "camp-004",
    title: "Artisan Agate Slice Pendants",
    subtitle: "Electroplated 24K gold edged natural Brazilian agate slices with pre-soldered bail ring ready for cord assembly.",
    badge: "Statement Focal",
    tag: "Pendants",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    cardSize: "tall",
    productId: "bs-003",
    categorySlug: "gemstone-pendants",
    ctaText: "Discover Agates",
    active: true
  },
  {
    id: "camp-005",
    title: "Factory Master Lot: Sterling Clasps",
    subtitle: "Direct foundry production run: 250 pcs pre-packaged 925 sterling silver lobster clasps with anti-tarnish dip.",
    badge: "Master Lot &bull; 40% Off",
    tag: "Wholesale Master Lot",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    cardSize: "standard",
    productId: "bs-002",
    categorySlug: "jewelry-findings",
    ctaText: "Request Lot Pricing",
    active: true
  },
  {
    id: "camp-006",
    title: "Faceted Rondelle Crystal Strands",
    subtitle: "Precision-machine diamond cut optical crystal rondelles with high refractive AB iridescent rainbow coating.",
    badge: "Best Seller",
    tag: "Crystals",
    image: "https://images.unsplash.com/photo-1611591475152-47eac9c5bdfa?auto=format&fit=crop&w=800&q=80",
    cardSize: "standard",
    productId: "bs-007",
    categorySlug: "crystal-cz-beads",
    ctaText: "Shop Crystal Rondelles",
    active: true
  }
];

export default function PinterestDiscoverySection({ onNavigate, onSelectProduct, onQuickView }) {
  const [pins, setPins] = useState(DEFAULT_PINS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedPins, setSavedPins] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    api.getCampaigns()
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setPins(data.filter(c => c.active !== false));
        }
      })
      .catch(err => {
        console.warn('Using default visual discovery pins:', err);
      });
    return () => { isMounted = false; };
  }, []);

  const handleTrack = (id, eventType) => {
    api.trackCampaign(id, eventType).catch(() => {});
  };

  const handlePinAction = (pin) => {
    handleTrack(pin.id, 'click');
    if (pin.productId && onSelectProduct) {
      onSelectProduct(pin.productId);
    } else if (pin.categorySlug && onNavigate) {
      onNavigate('catalog', { category: pin.categorySlug });
    } else if (onNavigate) {
      onNavigate('catalog');
    }
  };

  const toggleSavePin = (e, pinId) => {
    e.stopPropagation();
    setSavedPins(prev => {
      const next = { ...prev, [pinId]: !prev[pinId] };
      return next;
    });
  };

  const handleSharePin = (e, pin) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#pin-${pin.id}`);
      setCopiedId(pin.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filters = [
    { id: 'all', label: 'All Inspiration & Pins' },
    { id: 'Gemstones', label: 'Natural Gemstones' },
    { id: 'Connectors', label: 'Micro-Pavé Clasps' },
    { id: 'Findings', label: 'Lead-Free Findings' },
    { id: 'Pendants', label: 'Focal Pendants' },
    { id: 'Wholesale Master Lot', label: 'Master Lots' }
  ];

  const filteredPins = activeFilter === 'all' 
    ? pins 
    : pins.filter(p => p.tag === activeFilter || p.categorySlug?.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <section className="py-20 bg-[#FAF9F5] border-t border-[#E9E3D8] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C49A3A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#191919]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDD6C8] shadow-xs mb-4">
            <Sparkles className="w-4 h-4 text-[#C49A3A]" />
            <span className="text-[11px] font-bold tracking-widest text-[#191919] uppercase">
              Pinterest &bull; Visual Inspiration Gallery
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#191919] tracking-tight mb-4">
            DISCOVER YOUR NEXT CREATION
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-sans">
            Explore curated design pairings, artisan moodboards, and direct factory wholesale components. 
            Click any pin to inspect verified specs, calculate bulk tiered volume, or request sample lots.
          </p>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeFilter === f.id
                    ? 'bg-[#191919] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-[#E9E3D8] hover:border-[#191919] hover:text-[#191919]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pinterest-Style Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-6 space-y-6">
          {filteredPins.map((pin) => {
            const isSaved = !!savedPins[pin.id];
            const isTall = pin.cardSize === 'tall';

            return (
              <div
                key={pin.id}
                onClick={() => handlePinAction(pin)}
                className="break-inside-avoid group bg-white rounded-3xl overflow-hidden border border-[#E9E3D8] hover:border-[#C49A3A] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col relative"
              >
                {/* Visual Pin Canvas */}
                <div className={`relative overflow-hidden bg-gray-100 ${isTall ? 'h-96' : 'h-64'}`}>
                  <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#191919] font-bold text-[10px] uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1.5 border border-white/40">
                      <Sparkles className="w-3 h-3 text-[#C49A3A]" />
                      <span dangerouslySetInnerHTML={{ __html: pin.badge || 'Curated Pin' }} />
                    </span>

                    {/* Action icons (Save & Share) */}
                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleSharePin(e, pin)}
                        title="Share Pin Link"
                        className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black shadow-sm transition-transform hover:scale-110"
                      >
                        {copiedId === pin.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => toggleSavePin(e, pin.id)}
                        title={isSaved ? 'Saved to Moodboard' : 'Save to Moodboard'}
                        className={`p-2 rounded-full shadow-sm transition-transform hover:scale-110 ${
                          isSaved ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white text-gray-700 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-x-4 bottom-4 z-10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                    {onQuickView && pin.productId && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrack(pin.id, 'click');
                          onQuickView(pin.productId);
                        }}
                        className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-[#191919] text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick Look</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePinAction(pin);
                      }}
                      className="flex-1 py-2 px-3 bg-[#191919] hover:bg-[#C49A3A] text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>{pin.ctaText || 'View Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pin Card Metadata Footer */}
                <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-[#C49A3A] tracking-wider uppercase font-mono">
                        {pin.tag || 'Design Idea'}
                      </span>
                      <span className="text-[10px] text-gray-600 flex items-center gap-1">
                        <Pin className="w-2.5 h-2.5 text-[#C49A3A]" />
                        <span>Idea Board</span>
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#191919] group-hover:text-[#C49A3A] transition-colors leading-snug line-clamp-1 mb-1.5">
                      {pin.title}
                    </h3>

                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                      {pin.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-semibold text-gray-500">
                    <span className="group-hover:text-[#191919] transition-colors flex items-center gap-1">
                      <span>Explore Component</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] text-gray-600 bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E9E3D8]">
                      B2B Direct
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action Banner */}
        <div className="mt-16 bg-[#191919] text-white rounded-3xl p-8 sm:p-10 border border-[#2C2C2C] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold text-[#C49A3A] uppercase tracking-widest">
              Custom Jewelry Production &amp; Material Sourcing
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Looking for a custom gemstone cut or proprietary metal finding?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Submit your CAD drawings, reference images, or Pinterest moodboards directly to our factory sourcing engineers for wholesale sample production.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('quote')}
              className="px-6 py-3 bg-[#C49A3A] hover:bg-[#b0872e] text-[#191919] font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Submit RFQ Moodboard</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('catalog')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors"
            >
              Browse Full Catalog
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
