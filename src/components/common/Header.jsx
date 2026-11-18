import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  FileText, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  LayoutDashboard, 
  LogOut, 
  Package,
  Layers,
  Users,
  Settings,
  Archive,
  ArrowRight,
  Globe,
  Sparkles,
  MapPin,
  HelpCircle,
  Eye,
  RotateCcw,
  Store
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useQuote } from '../../context/QuoteContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../utils/api';
import BrandLogo from './BrandLogo';

export default function Header({ 
  currentPage, 
  onNavigate, 
  onOpenMobileMenu, 
  onOpenAuth, 
  onSelectProduct 
}) {
  const { itemsCount, tieredSubtotal, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { 
    user, 
    isAdmin, 
    isSuperAdmin, 
    logout, 
    hasPermission, 
    impersonatedCustomer, 
    stopImpersonating, 
    setViewMode 
  } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [megaMenuCategory, setMegaMenuCategory] = useState(null);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const megaMenuRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setMegaMenuCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search with product & SKU autocomplete
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setSearchDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.getProducts({ search: searchQuery });
        setSearchResults(results.slice(0, 6));
        setSearchDropdownOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchDropdownOpen(false);
      onNavigate('catalog', { search: searchQuery });
    }
  };

  const handleSelectSearchResult = (product) => {
    setSearchDropdownOpen(false);
    setSearchQuery('');
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      onNavigate('product', { product });
    }
  };

  const megaMenuData = {
    categories: {
      title: "Master Wholesale Categories",
      featured: [
        { name: "Sea Sediment Jasper 8mm Stretchy Bracelet", sku: "A39817", img: "/products/catalog/cat-fj-001.png" },
        { name: "Potato Freshwater Pearl Strand 4-5mm", sku: "A43052", img: "/products/catalog/cat-beads-001.png" }
      ],
      links: [
        { label: "Finished Jewelry (Bracelets, Necklaces, Rings)", category: "finished-jewelry" },
        { label: "Beads (Gemstone, Pearl, Crystal, Clay Disc)", category: "beads" },
        { label: "Pewter (Lead-Free Charms, Crosses, Toggles)", category: "pewter" },
        { label: "Findings (Chains, Clasps, Pins, Jump Rings)", category: "finding" },
        { label: "Accessories (Pave CZ, Tassels, Pendants)", category: "accessories" },
        { label: "Seasonal Trends (Mala, Druzy, Southwestern)", category: "seasonal-trends" },
        { label: "New Sea Arrivals (142-147 Container Shipments)", category: "new-arrivals" },
        { label: "Best Sellers (Volume Bestsellers)", category: "best-sellers" }
      ]
    },
    finishedJewelry: {
      title: "Finished Jewelry & Artisan Collections",
      featured: [
        { name: "Dalmatian Jasper 8mm Bead Stretchy Bracelet", sku: "A10311", img: "/products/catalog/cat-fj-002.png" },
        { name: "Sea Sediment Jasper 8mm Bead Stretchy Bracelet", sku: "A39817", img: "/products/catalog/cat-fj-001.png" }
      ],
      links: [
        { label: "Bracelets (Charm, Crystal, Gemstone)", category: "finished-jewelry", subcategory: "bracelets" },
        { label: "Artisan Necklaces", category: "finished-jewelry", subcategory: "necklaces" },
        { label: "Wholesale Rings", category: "finished-jewelry", subcategory: "rings" },
        { label: "Handcrafted Earrings", category: "finished-jewelry", subcategory: "earrings" },
        { label: "Jewelry Display & Stands", category: "finished-jewelry", subcategory: "jewelry-display" }
      ]
    },
    beads: {
      title: "Beads, Strands & Natural Gemstones",
      featured: [
        { name: "White Potato Freshwater Pearl Strand 4-5mm", sku: "A43052", img: "/products/catalog/cat-beads-001.png" },
        { name: "Blue Sea Sediment Jasper Flat Rondelle 3x10mm", sku: "A42228", img: "/products/catalog/cat-beads-002.png" }
      ],
      links: [
        { label: "Natural Gemstone Strands", category: "beads", subcategory: "gemstone" },
        { label: "Freshwater Pearl Beads", category: "beads", subcategory: "pearl-beads" },
        { label: "Crystal Beads & Rondelles", category: "beads", subcategory: "crystal-beads" },
        { label: "Clay Disc Polymer Heishi", category: "beads", subcategory: "clay-disc" },
        { label: "Large Hole Focal Beads", category: "beads", subcategory: "large-hole" },
        { label: "Natural Shell Beads", category: "beads", subcategory: "shell" },
        { label: "Acrylic Designer Beads", category: "beads", subcategory: "acrylic-beads" }
      ]
    },
    pewter: {
      title: "100% Certified Lead-Free Pewter Components",
      featured: [
        { name: "Antique Pewter Cross Charm Component", sku: "A11685", img: "/products/catalog/cat-pewter-001.png" },
        { name: "Antique Silver Pewter Toggle Clasp Set", sku: "A36288", img: "/products/catalog/cat-pewter-002.png" }
      ],
      links: [
        { label: "Crosses & Religious Charms", category: "pewter", subcategory: "crosses" },
        { label: "Toggle Clasps & Toggles", category: "pewter", subcategory: "toggles" },
        { label: "Bails, Wings & Connectors", category: "pewter", subcategory: "bails-wings" },
        { label: "Butterflies & Botanical Flowers", category: "pewter", subcategory: "butterflies-flowers" },
        { label: "Spacers, Daisies & Rondelles", category: "pewter", subcategory: "spacers-daisies" },
        { label: "Bead Caps & End Caps", category: "pewter", subcategory: "caps" },
        { label: "Western, Sports & Ocean Life", category: "pewter", subcategory: "sports-western" }
      ]
    },
    finding: {
      title: "Jewelry Findings, Clasps & Spacers",
      featured: [
        { name: "Gold Micro Pave CZ Toggle Clasp Connector", sku: "A44109", img: "/products/catalog/cat-find-001.png" },
        { name: "18K Gold Plated Brass Wire & Pins", sku: "CZ-TOG-1014", img: "/products/catalog/cat-find-002.png" }
      ],
      links: [
        { label: "Chains (Metal, Crystal, Gemstone)", category: "finding", subcategory: "chain" },
        { label: "Lobster Clasps & Toggle Locks", category: "finding", subcategory: "lobster" },
        { label: "Bead Spacers & Metal Rondelles", category: "finding", subcategory: "spacer" },
        { label: "Earring Findings & Ear Wires", category: "finding", subcategory: "earring-findings" },
        { label: "Head Pins, Eye Pins & Jewelry Wire", category: "finding", subcategory: "pins" },
        { label: "Jump Rings & Split Rings", category: "finding", subcategory: "jump-split-ring" },
        { label: "End Caps & Crimp Findings", category: "finding", subcategory: "end-caps" }
      ]
    },
    trends: {
      title: "Seasonal Trends & Curated Styles",
      featured: [
        { name: "Crosheted & Druzy Artisan Jewelry", sku: "A39817", img: "/products/catalog/cat-fj-001.png" },
        { name: "Southwestern & Vintage Style Lots", sku: "A43052", img: "/products/catalog/cat-beads-001.png" }
      ],
      links: [
        { label: "Gemstone & Pearl Jewelry", category: "seasonal-trends", subcategory: "gemstone-jewelry" },
        { label: "Mala & Rosany Jewelry", category: "seasonal-trends", subcategory: "mala-jewelry" },
        { label: "Southwestern Jewelry", category: "seasonal-trends", subcategory: "southwestern-jewelry" },
        { label: "Vintage Style Collections", category: "seasonal-trends", subcategory: "vintage-style" },
        { label: "Druzy & European Style", category: "seasonal-trends", subcategory: "druzy-jewelry" },
        { label: "Crosheted & Layery Jewelry", category: "seasonal-trends", subcategory: "crosheted-jewelry" }
      ]
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDE5D8] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* LEFT: Mobile Toggle & BeadsSource Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-[#292723] hover:bg-[#FAF8F3] transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Real Official BeadsSource Brand Logo */}
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer group flex items-center select-none py-1"
            >
              <BrandLogo variant="default" size="md" withSubtitle={true} />
            </div>
          </div>

          {/* CENTER: Large Premium Product & SKU Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setSearchDropdownOpen(true); }}
                placeholder="Search natural gemstones, SKU (e.g. A12502), pave CZ, findings..."
                className="w-full pl-11 pr-10 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-full text-xs sm:text-sm text-[#292723] placeholder-[#8B8175] focus:outline-none focus:border-[#C6A66B] focus:ring-2 focus:ring-[#C6A66B]/20 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-[#8B8175] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Live Autocomplete Dropdown Preview */}
            {searchDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#EDE5D8] overflow-hidden z-50 text-xs">
                <div className="p-3 bg-[#FAF8F3] border-b border-[#EDE5D8] flex items-center justify-between text-[#8B8175]">
                  <span className="font-medium">Found {searchResults.length} matching products</span>
                  <span className="text-[11px] text-[#C6A66B] font-semibold">Press Enter for full catalog</span>
                </div>

                <div className="divide-y divide-[#F5F2EB] max-h-80 overflow-y-auto">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="p-3 flex items-center gap-3 hover:bg-[#FAF8F3] cursor-pointer transition-colors"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-lg border border-[#EDE5D8] shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-[#EDE5D8] text-[#40362F] px-1.5 py-0.5 rounded">
                            {item.sku}
                          </span>
                          <span className="text-[10px] text-gray-500 capitalize">{item.category.replace(/-/g, ' ')}</span>
                        </div>
                        <p className="font-semibold text-[#292723] truncate text-xs mt-0.5">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#C6A66B] text-sm">{formatPrice(item.salePrice || item.price)}</p>
                        <p className="text-[10px] text-gray-500">Stock: {item.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-[#FAF8F3] text-center border-t border-[#EDE5D8]">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-[#C6A66B] font-bold text-xs hover:underline cursor-pointer"
                  >
                    View All Matching Results &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Wishlist, Currency, Account Dropdown & Shopping Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#F8F6F1] px-2.5 py-1.5 rounded-full border border-[#E9E3D8] text-xs">
              <Globe className="w-3.5 h-3.5 text-[#C49A3A]" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-[#191919] cursor-pointer focus:outline-none text-xs font-semibold"
                aria-label="Currency"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 rounded-full hover:bg-[#FAF8F3] transition-colors relative text-[#292723] hover:text-[#C6A66B]"
              aria-label="Wishlist"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C6A66B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* ACCOUNT DROPDOWN (Role-based & Sanitized) */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  if (!user) {
                    onOpenAuth();
                  } else {
                    setUserMenuOpen(!userMenuOpen);
                  }
                }}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full hover:bg-[#FAF8F3] transition-colors text-[#292723] hover:text-[#40362F] border border-transparent hover:border-[#EDE5D8]"
                aria-label="User Account"
              >
                <div className="w-8 h-8 rounded-full bg-[#40362F] text-[#FAF8F3] flex items-center justify-center font-bold text-xs border border-[#C6A66B]/40">
                  {user ? (isAdmin ? <ShieldCheck className="w-4 h-4 text-[#C6A66B]" /> : ((user?.name && user.name[0]) || user?.email?.[0] || 'U').toUpperCase()) : <User className="w-4 h-4" />}
                </div>

                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[10px] text-[#8B8175] uppercase font-medium leading-tight">
                    {user ? (isSuperAdmin ? 'Super Admin' : (isAdmin ? 'Store Manager' : 'Buyer Portal')) : 'Account'}
                  </span>
                  <span className="text-xs font-semibold text-[#292723] max-w-[120px] truncate leading-tight">
                    {user ? (isSuperAdmin ? 'Master Control' : (isAdmin ? 'Store Operations' : user.company || user.name || 'Wholesale Buyer')) : 'Sign In'}
                  </span>
                </div>
                {user && <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden xl:block" />}
              </button>

              {/* Account Dropdown Menu */}
              {user && userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#EDE5D8] py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
                  
                  {/* Generic Role-based Header */}
                  <div className="px-4 py-3 border-b border-[#EDE5D8] bg-[#FAF8F3]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A66B]">
                        {isSuperAdmin ? '👑 Super Admin' : (isAdmin ? '💼 Store Management' : '💎 Wholesale Buyer')}
                      </span>
                      <span className="text-[10px] bg-[#EDE5D8] text-[#40362F] px-2 py-0.5 rounded font-semibold capitalize">
                        {isSuperAdmin ? 'Full Access' : (isAdmin ? 'Staff / Manager' : 'Verified B2B')}
                      </span>
                    </div>
                    <p className="font-bold text-[#292723] text-sm mt-1">
                      {isSuperAdmin ? 'Super Administrator' : (isAdmin ? 'Store Administrator' : (user.company || user.name || 'Wholesale Buyer'))}
                    </p>
                    <p className="text-[#8B8175] truncate text-[11px] mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  {/* Active Customer Impersonation Banner */}
                  {impersonatedCustomer && (
                    <div className="m-2 p-2.5 bg-[#FFF9E6] border border-[#ECD9A5] rounded-xl flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] font-bold uppercase text-[#8C6D2B] block">Viewing As Customer:</span>
                        <p className="font-bold text-[#191919] text-xs truncate">{impersonatedCustomer.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{impersonatedCustomer.company || impersonatedCustomer.email}</p>
                      </div>
                      <button
                        onClick={stopImpersonating}
                        className="px-2 py-1 bg-white border border-[#DACFBA] rounded text-[10px] font-bold text-red-600 hover:bg-red-50 shrink-0 cursor-pointer"
                        title="Revert to Super Admin"
                      >
                        Exit View
                      </button>
                    </div>
                  )}

                  {/* SUPER ADMIN / ADMIN SUITE SECTION */}
                  {isAdmin && (
                    <div className="py-1 border-b border-[#F0EBE1]">
                      <div className="px-4 py-1.5 flex items-center justify-between text-[10px] font-bold text-[#78716C] uppercase tracking-wider bg-[#FAF9F5]">
                        <span>Administrative Suite</span>
                        <span className="text-[#C49A3A]">Full Access</span>
                      </div>

                      <button
                        onClick={() => { setUserMenuOpen(false); onNavigate('admin', { tab: 'overview' }); }}
                        className="w-full px-4 py-2 text-left text-[#191919] hover:bg-[#F8F6F1] font-semibold flex items-center gap-2.5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#C49A3A]" />
                        <span>Admin Dashboard</span>
                      </button>

                      {hasPermission('products') && (
                        <button
                          onClick={() => { setUserMenuOpen(false); onNavigate('admin', { tab: 'products' }); }}
                          className="w-full px-4 py-1.5 text-left text-[#444] hover:bg-[#F8F6F1] flex items-center gap-2.5 transition-colors"
                        >
                          <Archive className="w-4 h-4 text-[#78716C]" />
                          <span>Product Management</span>
                        </button>
                      )}

                      {hasPermission('orders') && (
                        <button
                          onClick={() => { setUserMenuOpen(false); onNavigate('admin', { tab: 'orders' }); }}
                          className="w-full px-4 py-1.5 text-left text-[#444] hover:bg-[#F8F6F1] flex items-center gap-2.5 transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#78716C]" />
                          <span>Order Management</span>
                        </button>
                      )}

                      {hasPermission('quotes') && (
                        <button
                          onClick={() => { setUserMenuOpen(false); onNavigate('admin', { tab: 'quotes' }); }}
                          className="w-full px-4 py-1.5 text-left text-[#444] hover:bg-[#F8F6F1] flex items-center gap-2.5 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-[#78716C]" />
                          <span>Wholesale Quotations</span>
                        </button>
                      )}

                      {hasPermission('customers') && (
                        <button
                          onClick={() => { setUserMenuOpen(false); onNavigate('admin', { tab: 'customers' }); }}
                          className="w-full px-4 py-1.5 text-left text-[#444] hover:bg-[#F8F6F1] flex items-center gap-2.5 transition-colors"
                        >
                          <Users className="w-4 h-4 text-[#78716C]" />
                          <span>Customer Database</span>
                        </button>
                      )}

                      {hasPermission('settings') && (
                        <button
                          onClick={() => { setUserMenuOpen(false); onNavigate('admin', { tab: 'settings' }); }}
                          className="w-full px-4 py-1.5 text-left text-[#444] hover:bg-[#F8F6F1] flex items-center gap-2.5 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#78716C]" />
                          <span>Store Settings</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* CUSTOMER PORTAL & EXPERIENCE SECTION (Always available to Super Admin & Customers) */}
                  <div className="py-1">
                    <div className="px-4 py-1.5 flex items-center justify-between text-[10px] font-bold text-[#78716C] uppercase tracking-wider bg-[#FAF9F5]">
                      <span>Customer Experience &amp; Portal</span>
                      {isAdmin && <span className="text-emerald-700 font-bold">Enabled</span>}
                    </div>

                    <button
                      onClick={() => { 
                        setUserMenuOpen(false); 
                        if (isAdmin) setViewMode('customer');
                        onNavigate('dashboard', { tab: 'orders' }); 
                      }}
                      className="w-full px-4 py-2 text-left text-[#303030] hover:bg-[#F8F6F1] flex items-center gap-2.5 transition-colors font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#C49A3A]" />
                      <span>Customer Dashboard</span>
                    </button>

                    <button
                      onClick={() => { 
                        setUserMenuOpen(false); 
                        if (isAdmin) setViewMode('customer');
                        onNavigate('dashboard', { tab: 'orders' }); 
                      }}
                      className="w-full px-4 py-1.5 text-left text-[#444] hover:bg-[#F8F6F1] flex items-center gap-2.5 transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#78716C]" />
                      <span>Customer Order History</span>
                    </button>

                    <button
                      onClick={() => { 
                        setUserMenuOpen(false); 
                        if (isAdmin) setViewMode('customer');
                        onNavigate('dashboard', { tab: 'quotes' }); 
                      }}
                      className="w-full px-4 py-1.5 text-left text-[#444] hover:bg-[#F8F6F1] flex items-center gap-2.5 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-[#78716C]" />
                      <span>Customer RFQ Quotes</span>
                    </button>

                    <button
                      onClick={() => { setUserMenuOpen(false); onNavigate('wishlist'); }}
                      className="w-full px-4 py-1.5 text-left text-[#444] hover:bg-[#F8F6F1] flex items-center gap-2.5 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#78716C]" />
                      <span>Wishlist ({wishlistCount})</span>
                    </button>

                    <button
                      onClick={() => { 
                        setUserMenuOpen(false); 
                        if (isAdmin) setViewMode('customer');
                        onNavigate('dashboard', { tab: 'profile' }); 
                      }}
                      className="w-full px-4 py-1.5 text-left text-[#444] hover:bg-[#F8F6F1] flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#78716C]" />
                      <span>Customer Profile &amp; Address Book</span>
                    </button>
                  </div>

                  {/* STOREFRONT QUICK JUMP (Super Admin & Staff) */}
                  {isAdmin && (
                    <div className="py-1 border-t border-[#F0EBE1]">
                      <div className="px-4 py-1 text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                        Storefront Pages
                      </div>
                      <div className="grid grid-cols-2 gap-1 px-3 py-1">
                        <button
                          onClick={() => { setUserMenuOpen(false); onNavigate('catalog'); }}
                          className="px-2 py-1 text-left text-[11px] text-[#555] hover:bg-[#F8F6F1] rounded"
                        >
                          Shop Catalog
                        </button>
                        <button
                          onClick={() => { setUserMenuOpen(false); onNavigate('quote'); }}
                          className="px-2 py-1 text-left text-[11px] text-[#555] hover:bg-[#F8F6F1] rounded"
                        >
                          Custom RFQ
                        </button>
                        <button
                          onClick={() => { setUserMenuOpen(false); onNavigate('checkout'); }}
                          className="px-2 py-1 text-left text-[11px] text-[#555] hover:bg-[#F8F6F1] rounded"
                        >
                          Checkout
                        </button>
                        <button
                          onClick={() => { setUserMenuOpen(false); onNavigate('contact'); }}
                          className="px-2 py-1 text-left text-[11px] text-[#555] hover:bg-[#F8F6F1] rounded"
                        >
                          Contact Desk
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sign Out */}
                  <div className="border-t border-[#F0EBE1] pt-1 mt-1">
                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* SHOPPING CART BUTTON (Icon, Count, Subtotal) */}
            <button
              onClick={openCartDrawer}
              className="flex items-center gap-2.5 bg-[#40362F] hover:bg-[#52463D] text-[#FAF8F3] px-4 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer ml-1 border border-[#52463D] group"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#C6A66B] group-hover:scale-105 transition-transform" />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C6A66B] text-[#40362F] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {itemsCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-[#FAF8F3] hidden sm:inline">
                {formatPrice(tieredSubtotal)}
              </span>
            </button>

          </div>
        </div>

        {/* NAVIGATION CATEGORIES (Desktop Mega Navigation) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-[#EDE5D8] py-2.5 text-xs font-medium text-[#40362F] relative">
          <div className="flex items-center gap-6" ref={megaMenuRef}>
            
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#C6A66B] transition-colors py-1 font-semibold ${currentPage === 'home' ? 'text-[#C6A66B] border-b-2 border-[#C6A66B]' : ''}`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className={`hover:text-[#C6A66B] transition-colors py-1 font-semibold ${currentPage === 'catalog' ? 'text-[#C6A66B] border-b-2 border-[#C6A66B]' : ''}`}
            >
              Shop
            </button>

            {/* Categories (Master Catalogue Trigger) */}
            <div className="relative group">
              <button
                onClick={() => onNavigate('catalog', { category: 'all' })}
                onMouseEnter={() => setMegaMenuCategory('categories')}
                className="hover:text-[#C6A66B] transition-colors py-1 flex items-center gap-1 font-medium"
              >
                <span>Catalogue</span>
                <ChevronDown className="w-3 h-3 text-[#8B8175]" />
              </button>
            </div>

            {/* Finished Jewelry */}
            <div className="relative group">
              <button
                onClick={() => onNavigate('catalog', { category: 'finished-jewelry' })}
                onMouseEnter={() => setMegaMenuCategory('finishedJewelry')}
                className="hover:text-[#C6A66B] transition-colors py-1 flex items-center gap-1 font-medium"
              >
                <span>Finished Jewelry</span>
                <ChevronDown className="w-3 h-3 text-[#8B8175]" />
              </button>
            </div>

            {/* Beads */}
            <div className="relative group">
              <button
                onClick={() => onNavigate('catalog', { category: 'beads' })}
                onMouseEnter={() => setMegaMenuCategory('beads')}
                className="hover:text-[#C6A66B] transition-colors py-1 flex items-center gap-1 font-medium"
              >
                <span>Beads</span>
                <ChevronDown className="w-3 h-3 text-[#8B8175]" />
              </button>
            </div>

            {/* Pewter */}
            <div className="relative group">
              <button
                onClick={() => onNavigate('catalog', { category: 'pewter' })}
                onMouseEnter={() => setMegaMenuCategory('pewter')}
                className="hover:text-[#C6A66B] transition-colors py-1 flex items-center gap-1 font-medium"
              >
                <span>Pewter</span>
                <ChevronDown className="w-3 h-3 text-[#8B8175]" />
              </button>
            </div>

            {/* Finding */}
            <div className="relative group">
              <button
                onClick={() => onNavigate('catalog', { category: 'finding' })}
                onMouseEnter={() => setMegaMenuCategory('finding')}
                className="hover:text-[#C6A66B] transition-colors py-1 flex items-center gap-1 font-medium"
              >
                <span>Finding</span>
                <ChevronDown className="w-3 h-3 text-[#8B8175]" />
              </button>
            </div>

            {/* Seasonal Trends */}
            <div className="relative group">
              <button
                onClick={() => onNavigate('catalog', { category: 'seasonal-trends' })}
                onMouseEnter={() => setMegaMenuCategory('trends')}
                className="hover:text-[#C6A66B] transition-colors py-1 flex items-center gap-1 font-medium"
              >
                <span>Seasonal Trends</span>
                <ChevronDown className="w-3 h-3 text-[#8B8175]" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('catalog', { category: 'new-arrivals', sort: 'newest' })}
              className="hover:text-[#C6A66B] transition-colors py-1 flex items-center gap-1 font-semibold text-[#8B8175] hover:text-[#C6A66B]"
            >
              <Sparkles className="w-3 h-3 text-[#C6A66B]" />
              <span>New Arrivals</span>
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'best-sellers', sort: 'popular' })}
              className="hover:text-[#C6A66B] transition-colors py-1 font-medium"
            >
              Best Sellers
            </button>

            <button
              onClick={() => onNavigate('quote')}
              className="text-[#40362F] font-semibold hover:text-[#292723] transition-colors py-1 flex items-center gap-1 bg-[#FAF8F3] px-3.5 py-1 rounded-full border border-[#EDE5D8] hover:border-[#C6A66B] shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] animate-pulse" />
              <span>Request a Quote (RFQ)</span>
            </button>
          </div>

          {/* Right Navigation: About & Contact */}
          <div className="flex items-center gap-5 text-[#8B8175]">
            <button 
              onClick={() => onNavigate('about')}
              className="hover:text-[#C6A66B] transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="hover:text-[#C6A66B] transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>Contact</span>
            </button>
          </div>

          {/* Mega Menu Dropdown Panel */}
          {megaMenuCategory && megaMenuData[megaMenuCategory] && (
            <div 
              onMouseLeave={() => setMegaMenuCategory(null)}
              className="absolute left-0 top-full mt-1 w-full bg-white rounded-2xl shadow-2xl border border-[#EDE5D8] p-6 z-50 animate-fade-in"
            >
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-5 space-y-3">
                  <h4 className="font-serif font-bold text-lg text-[#292723]">
                    {megaMenuData[megaMenuCategory].title}
                  </h4>
                  <ul className="space-y-2 text-xs text-[#40362F]">
                    {megaMenuData[megaMenuCategory].links.map((link, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => {
                            setMegaMenuCategory(null);
                            onNavigate('catalog', { category: link.category, subcategory: link.subcategory });
                          }}
                          className="hover:text-[#C6A66B] flex items-center gap-2 transition-colors group py-0.5 text-left"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] group-hover:scale-125 transition-transform" />
                          <span>{link.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-span-7 grid grid-cols-2 gap-4">
                  {megaMenuData[megaMenuCategory].featured.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setMegaMenuCategory(null);
                        onNavigate('catalog', { search: item.sku });
                      }}
                      className="group cursor-pointer rounded-xl overflow-hidden border border-[#EDE5D8] hover:border-[#C6A66B] transition-all bg-[#FAF8F3] p-3 flex items-center gap-3 shadow-xs hover:shadow-md"
                    >
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-14 h-14 object-cover rounded-lg group-hover:scale-105 transition-transform" 
                      />
                      <div>
                        <span className="text-[10px] font-mono text-[#C6A66B] font-bold block">{item.sku}</span>
                        <p className="font-semibold text-xs text-[#292723] group-hover:text-[#C6A66B] transition-colors">{item.name}</p>
                        <span className="text-[10px] text-[#8B8175] flex items-center gap-1 mt-0.5">
                          <span>View Details</span>
                          <ArrowRight className="w-2.5 h-2.5 text-[#C6A66B]" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </nav>

      </div>
    </header>
  );
}
