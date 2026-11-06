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
    gemstones: {
      title: "Natural Gemstone Beads",
      featured: [
        { name: "Natural African Turquoise 8mm", sku: "A12502", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80" },
        { name: "Madagascar Rose Quartz 10mm", sku: "A5853", img: "https://images.unsplash.com/photo-1611591475819-79b8b7380962?auto=format&fit=crop&w=600&q=80" }
      ],
      links: [
        { label: "Turquoise Strands & Slabs", category: "turquoise-beads" },
        { label: "Amethyst & Purple Quartz", category: "natural-gemstone-beads" },
        { label: "Jasper & Agate Roughs", category: "natural-gemstone-beads" },
        { label: "Lapis Lazuli Grade AAA", category: "natural-gemstone-beads" }
      ]
    },
    findings: {
      title: "Jewelry Findings & Clasps",
      featured: [
        { name: "Micro Pavé CZ Carabiner Screw Lock", sku: "A1016", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" },
        { name: "Lead-Free Pewter Leaf Charm", sku: "A912", img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80" }
      ],
      links: [
        { label: "Screw Lock Carabiners", category: "jewelry-connectors" },
        { label: "Spacer Beads & Rondelles", category: "jewelry-spacers" },
        { label: "Certified Lead-Free Charms", category: "charms" },
        { label: "Jump Rings & Head Pins", category: "jewelry-findings" }
      ]
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#E9E3D8] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* LEFT: Mobile Toggle & BeadsSource Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-[#191919] hover:bg-[#F8F6F1] transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* BeadsSource Brand Logo */}
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer group flex items-center gap-3 select-none"
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#191919] via-[#2D2A26] to-[#C49A3A] flex items-center justify-center text-white shadow-sm shadow-[#C49A3A]/20 group-hover:scale-105 transition-transform border border-[#C49A3A]/30">
                <span className="font-serif font-bold text-xl tracking-tighter text-[#F8F6F1]">B</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#191919] group-hover:text-[#C49A3A] transition-colors">
                  BEADS<span className="text-[#C49A3A]">SOURCE</span>
                </span>
                <span className="text-[9.5px] uppercase tracking-[0.28em] text-[#78716C] font-semibold -mt-1">
                  Fine Wholesale Jewelry
                </span>
              </div>
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
                className="w-full pl-11 pr-10 py-2.5 bg-[#F8F6F1] border border-[#E9E3D8] rounded-full text-xs sm:text-sm text-[#303030] placeholder-[#8A8477] focus:outline-none focus:border-[#C49A3A] focus:ring-2 focus:ring-[#C49A3A]/20 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-[#8A8477] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#E9E3D8] overflow-hidden z-50 text-xs">
                <div className="p-3 bg-[#F8F6F1] border-b border-[#E9E3D8] flex items-center justify-between text-[#78716C]">
                  <span className="font-medium">Found {searchResults.length} matching products</span>
                  <span className="text-[11px] text-[#C49A3A] font-semibold">Press Enter for full catalog</span>
                </div>

                <div className="divide-y divide-[#F5F2EB] max-h-80 overflow-y-auto">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="p-3 flex items-center gap-3 hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-lg border border-[#E9E3D8] shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-[#EFECE6] text-[#555047] px-1.5 py-0.5 rounded">
                            {item.sku}
                          </span>
                          <span className="text-[10px] text-gray-500 capitalize">{item.category.replace(/-/g, ' ')}</span>
                        </div>
                        <p className="font-semibold text-[#191919] truncate text-xs mt-0.5">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#C49A3A] text-sm">{formatPrice(item.salePrice || item.price)}</p>
                        <p className="text-[10px] text-gray-500">Stock: {item.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-[#FAF8F5] text-center border-t border-[#E9E3D8]">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-[#C49A3A] font-bold text-xs hover:underline cursor-pointer"
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
              className="p-2 rounded-full hover:bg-[#F8F6F1] transition-colors relative text-[#303030] hover:text-[#C49A3A]"
              aria-label="Wishlist"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C49A3A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
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
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full hover:bg-[#F8F6F1] transition-colors text-[#303030] hover:text-[#191919] border border-transparent hover:border-[#E9E3D8]"
                aria-label="User Account"
              >
                <div className="w-8 h-8 rounded-full bg-[#191919] text-[#F8F6F1] flex items-center justify-center font-bold text-xs border border-[#C49A3A]/40">
                  {user ? (isAdmin ? <ShieldCheck className="w-4 h-4 text-[#C49A3A]" /> : ((user?.name && user.name[0]) || user?.email?.[0] || 'U').toUpperCase()) : <User className="w-4 h-4" />}
                </div>

                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[10px] text-gray-500 uppercase font-medium leading-tight">
                    {user ? (isAdmin ? 'Administrator' : 'Customer') : 'Account'}
                  </span>
                  <span className="text-xs font-semibold text-[#191919] max-w-[110px] truncate leading-tight">
                    {user ? (isAdmin ? 'Account Management' : user.company || 'Wholesale Buyer') : 'Sign In'}
                  </span>
                </div>
                {user && <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden xl:block" />}
              </button>

              {/* Account Dropdown Menu */}
              {user && userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E9E3D8] py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
                  
                  {/* Generic Role-based Header */}
                  <div className="px-4 py-3 border-b border-[#F0EBE1] bg-[#F8F6F1]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C49A3A]">
                        {isSuperAdmin ? '👑 Super Admin' : (isAdmin ? '🛡️ Management' : 'Account Type')}
                      </span>
                      <span className="text-[10px] bg-[#EAE4D5] text-[#554F42] px-2 py-0.5 rounded font-semibold capitalize">
                        {user.role?.replace(/_/g, ' ') || 'Customer'}
                      </span>
                    </div>
                    <p className="font-bold text-[#191919] text-sm mt-1">
                      {isSuperAdmin ? 'Super Administrator' : (isAdmin ? 'Administrator' : (user.company || 'Customer'))}
                    </p>
                    <p className="text-[#78716C] truncate text-[11px] mt-0.5">
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
              className="flex items-center gap-2.5 bg-[#191919] hover:bg-[#303030] text-white px-4 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer ml-1 border border-[#303030]"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#C49A3A]" />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C49A3A] text-[#191919] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-[#F8F6F1] hidden sm:inline">
                {formatPrice(tieredSubtotal)}
              </span>
            </button>

          </div>
        </div>

        {/* NAVIGATION CATEGORIES (Desktop Mega Navigation) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-[#E9E3D8] py-2.5 text-xs font-medium text-[#403C35] relative">
          <div className="flex items-center gap-6" ref={megaMenuRef}>
            
            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className={`hover:text-[#C49A3A] transition-colors py-1 font-semibold ${currentPage === 'catalog' ? 'text-[#C49A3A] border-b-2 border-[#C49A3A]' : ''}`}
            >
              Shop All
            </button>

            {/* Gemstone Beads (with Mega Menu preview) */}
            <div className="relative group">
              <button
                onClick={() => onNavigate('catalog', { category: 'natural-gemstone-beads' })}
                onMouseEnter={() => setMegaMenuCategory('gemstones')}
                className="hover:text-[#C49A3A] transition-colors py-1 flex items-center gap-1"
              >
                <span>Gemstone Beads</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('catalog', { category: 'crystal-beads' })}
              className="hover:text-[#C49A3A] transition-colors py-1"
            >
              Crystal &amp; CZ
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'jewelry-pendants' })}
              className="hover:text-[#C49A3A] transition-colors py-1"
            >
              Pendants
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'jewelry-findings' })}
              className="hover:text-[#C49A3A] transition-colors py-1"
            >
              Jewelry Findings
            </button>

            {/* Clasps & Connectors */}
            <div className="relative group">
              <button
                onClick={() => onNavigate('catalog', { category: 'jewelry-connectors' })}
                onMouseEnter={() => setMegaMenuCategory('findings')}
                className="hover:text-[#C49A3A] transition-colors py-1 flex items-center gap-1"
              >
                <span>Clasps &amp; Connectors</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('catalog', { category: 'handmade-necklaces' })}
              className="hover:text-[#C49A3A] transition-colors py-1"
            >
              Handmade Jewelry
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'all', sort: 'newest' })}
              className="hover:text-[#C49A3A] transition-colors py-1 flex items-center gap-1 font-semibold text-[#8C6D2B]"
            >
              <Sparkles className="w-3 h-3 text-[#C49A3A]" />
              <span>New Arrivals</span>
            </button>

            <button
              onClick={() => onNavigate('quote')}
              className="text-[#8C6D2B] font-semibold hover:text-[#5C4515] transition-colors py-1 flex items-center gap-1 bg-[#F8F5EE] px-3 py-1 rounded-full border border-[#E0D7C6]"
            >
              <span>Request a Quote (RFQ)</span>
            </button>
          </div>

          {/* Right Navigation: Contact & Support */}
          <div className="flex items-center gap-5 text-[#6B6557]">
            <button 
              onClick={() => onNavigate('about')}
              className="hover:text-[#C49A3A] transition-colors"
            >
              Our Heritage
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="hover:text-[#C49A3A] transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Contact &amp; Support</span>
            </button>
          </div>

          {/* Mega Menu Dropdown Panel */}
          {megaMenuCategory && megaMenuData[megaMenuCategory] && (
            <div 
              onMouseLeave={() => setMegaMenuCategory(null)}
              className="absolute left-0 top-full mt-1 w-full bg-white rounded-2xl shadow-2xl border border-[#E9E3D8] p-6 z-50 animate-in fade-in"
            >
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-5 space-y-3">
                  <h4 className="font-serif font-bold text-lg text-[#191919]">
                    {megaMenuData[megaMenuCategory].title}
                  </h4>
                  <ul className="space-y-2 text-xs text-[#524B3E]">
                    {megaMenuData[megaMenuCategory].links.map((link, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => {
                            setMegaMenuCategory(null);
                            onNavigate('catalog', { category: link.category });
                          }}
                          className="hover:text-[#C49A3A] flex items-center gap-1.5 transition-colors group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C49A3A] group-hover:scale-125 transition-transform" />
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
                      className="group cursor-pointer rounded-xl overflow-hidden border border-[#E9E3D8] hover:border-[#C49A3A] transition-all bg-[#FAF9F5] p-3 flex items-center gap-3"
                    >
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-14 h-14 object-cover rounded-lg group-hover:scale-105 transition-transform" 
                      />
                      <div>
                        <span className="text-[10px] font-mono text-[#C49A3A] font-bold block">{item.sku}</span>
                        <p className="font-semibold text-xs text-[#191919] group-hover:text-[#C49A3A] transition-colors">{item.name}</p>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <span>View Details</span>
                          <ArrowRight className="w-2.5 h-2.5" />
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
