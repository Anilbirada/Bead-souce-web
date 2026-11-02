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
  Sparkles,
  ArrowRight
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
  const { quoteCount } = useQuote();
  const { user, isAdmin, logout } = useAuth();
  const { formatPrice } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
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
    }, 250);

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE6DE] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-[#242424] hover:bg-[#F3EFE6] transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer group flex items-center gap-3 select-none"
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#D4AF37] via-[#AA771C] to-[#8C6212] flex items-center justify-center text-white shadow-sm shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform">
                <span className="font-serif font-bold text-xl tracking-tighter">B</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#B38F26] transition-colors">
                  BEADS<span className="text-[#C4A052]">SOURCE</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#80796B] font-medium -mt-1">
                  Premium Wholesale &bull; Bengaluru
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Product & SKU Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setSearchDropdownOpen(true); }}
                placeholder="Search natural gemstone beads, SKU (e.g. A12502), pave CZ, findings..."
                className="w-full pl-11 pr-10 py-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-full text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8A8477] focus:outline-none focus:border-[#C4A052] focus:ring-2 focus:ring-[#C4A052]/20 focus:bg-white transition-all shadow-inner"
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

            {/* Live Search Autocomplete Dropdown */}
            {searchDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#EBE6DB] overflow-hidden z-50 animate-fade-in max-h-[480px] overflow-y-auto">
                <div className="p-3 bg-[#FAF8F5] border-b border-[#EBE6DB] flex items-center justify-between text-xs text-[#6B6558]">
                  <span>Matching Wholesale Products</span>
                  {isSearching && <span className="animate-pulse text-[#C4A052]">Searching...</span>}
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#8A8477]">
                    No wholesale products found for "{searchQuery}". Try "Turquoise", "Emerald", or "A8283".
                  </div>
                ) : (
                  <div className="divide-y divide-[#F5F2EB]">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item)}
                        className="p-3 hover:bg-[#FBF9F5] cursor-pointer flex items-center gap-3 transition-colors group"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-[#EBE6DB] bg-white group-hover:scale-105 transition-transform" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#1A1A1A] truncate group-hover:text-[#B38F26] transition-colors">
                              {item.name}
                            </span>
                            <span className="text-[10px] bg-[#EAE5D8] px-1.5 py-0.5 rounded text-[#5E594F] font-mono shrink-0">
                              {item.sku}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs mt-0.5">
                            <span className="font-bold text-[#1A1A1A]">
                              {formatPrice(item.salePrice || item.price)}
                              <span className="text-[10px] text-gray-500 font-normal"> / pack</span>
                            </span>
                            <span className="text-[10px] text-green-700 font-medium">
                              In Stock ({item.stock})
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#C4A052] transition-colors" />
                      </div>
                    ))}
                    
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#F3EFE6] text-xs font-semibold text-[#B38F26] text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View all results for "{searchQuery}"</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions (RFQ, Wishlist, User, Cart) */}
          <div className="flex items-center gap-1 sm:gap-3">
            
            {/* Request a Quote (RFQ) quick badge */}
            <button
              onClick={() => onNavigate('quote')}
              className="relative p-2.5 rounded-full text-[#4A453A] hover:text-[#1A1A1A] hover:bg-[#F3EFE6] transition-colors group"
              title="Request a Wholesale Quote"
              aria-label="Wholesale RFQ Quote Builder"
            >
              <FileText className="w-5 h-5 text-[#8C6D2B] group-hover:scale-110 transition-transform" />
              {quoteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8C6D2B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {quoteCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2.5 rounded-full text-[#4A453A] hover:text-[#1A1A1A] hover:bg-[#F3EFE6] transition-colors group"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C4A052] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Account Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  if (!user) {
                    onOpenAuth();
                  } else {
                    setUserMenuOpen(!userMenuOpen);
                  }
                }}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-[#F3EFE6] transition-colors text-[#4A453A] hover:text-[#1A1A1A]"
                aria-label="User Account"
              >
                <div className="w-8 h-8 rounded-full bg-[#EAE5D8] text-[#5A5447] flex items-center justify-center font-bold text-xs border border-[#D5CFC2]">
                  {user ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[10px] text-gray-500 uppercase font-medium leading-tight">
                    {user ? (isAdmin ? 'Admin' : 'Wholesale Buyer') : 'Account'}
                  </span>
                  <span className="text-xs font-semibold text-[#1A1A1A] max-w-[90px] truncate leading-tight">
                    {user ? user.name.split(' ')[0] : 'Sign In'}
                  </span>
                </div>
                {user && <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden xl:block" />}
              </button>

              {/* User Dropdown */}
              {user && userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-[#EAE6DE] py-2 z-50 animate-fade-in text-xs">
                  <div className="px-4 py-3 border-b border-[#F0EBE1] bg-[#FAF8F5]">
                    <p className="font-semibold text-[#1A1A1A] truncate">{user.name}</p>
                    <p className="text-[#7A7468] truncate text-[11px]">{user.email}</p>
                    {user.company && (
                      <span className="inline-block mt-1 bg-[#EBE4D5] text-[#635B4E] px-2 py-0.5 rounded text-[10px] font-medium">
                        {user.company}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => { setUserMenuOpen(false); onNavigate('dashboard'); }}
                    className="w-full px-4 py-2.5 text-left text-[#3D3930] hover:bg-[#F7F4EE] flex items-center gap-2.5 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#C4A052]" />
                    <span>Customer Dashboard &bull; Orders</span>
                  </button>

                  <button
                    onClick={() => { setUserMenuOpen(false); onNavigate('quote'); }}
                    className="w-full px-4 py-2.5 text-left text-[#3D3930] hover:bg-[#F7F4EE] flex items-center gap-2.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-[#C4A052]" />
                    <span>My Quotation Requests</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => { setUserMenuOpen(false); onNavigate('admin'); }}
                      className="w-full px-4 py-2.5 text-left text-[#8C6D2B] bg-[#FDF9EE] hover:bg-[#F8F1DE] font-semibold flex items-center gap-2.5 transition-colors border-y border-[#EBE1C7]"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#AA771C]" />
                      <span>Admin Management Suite</span>
                    </button>
                  )}

                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={openCartDrawer}
              className="flex items-center gap-2.5 bg-[#1C1A17] hover:bg-[#302B24] text-white px-3.5 sm:px-4 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer ml-1"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#E6C687]" />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-[#F0EDE6] hidden sm:inline">
                {formatPrice(tieredSubtotal)}
              </span>
            </button>

          </div>
        </div>

        {/* Secondary Mega Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-[#F0EBE1] py-2.5 text-xs font-medium text-[#4A453A]">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#B38F26] transition-colors py-1 ${currentPage === 'home' ? 'text-[#B38F26] font-bold border-b-2 border-[#B38F26]' : ''}`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className={`hover:text-[#B38F26] transition-colors py-1 flex items-center gap-1 ${currentPage === 'catalog' ? 'text-[#B38F26] font-bold border-b-2 border-[#B38F26]' : ''}`}
            >
              <span>All Wholesale Catalogue</span>
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'natural-gemstone-beads' })}
              className="hover:text-[#B38F26] transition-colors py-1"
            >
              Natural Gemstones
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'turquoise-beads' })}
              className="hover:text-[#B38F26] transition-colors py-1"
            >
              Turquoise Beads
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'cubic-zirconia' })}
              className="hover:text-[#B38F26] transition-colors py-1"
            >
              Cubic Zirconia &amp; Micro Pave
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'charms' })}
              className="hover:text-[#B38F26] transition-colors py-1"
            >
              Lead-Free Pewter Charms
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'jewelry-findings' })}
              className="hover:text-[#B38F26] transition-colors py-1"
            >
              Findings &amp; Clasps
            </button>

            <button
              onClick={() => onNavigate('catalog', { category: 'handmade-necklaces' })}
              className="hover:text-[#B38F26] transition-colors py-1"
            >
              Handmade Jewelry
            </button>

            <button
              onClick={() => onNavigate('quote')}
              className="text-[#967117] font-semibold hover:text-[#6E5311] transition-colors py-1 flex items-center gap-1 bg-[#FDF9EE] px-2.5 py-1 rounded-full border border-[#E9DDC0]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bulk RFQ Builder</span>
            </button>
          </div>

          <div className="flex items-center gap-5 text-[#736D61]">
            <button 
              onClick={() => onNavigate('about')}
              className="hover:text-[#B38F26] transition-colors"
            >
              Our Heritage (SP Bengaluru)
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="hover:text-[#B38F26] transition-colors"
            >
              Contact &amp; Showroom
            </button>
          </div>
        </nav>

      </div>
    </header>
  );
}
