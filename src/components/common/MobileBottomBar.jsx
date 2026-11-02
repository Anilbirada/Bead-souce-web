import React from 'react';
import { Home, Grid, FileText, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useQuote } from '../../context/QuoteContext';

export default function MobileBottomBar({ currentPage, onNavigate }) {
  const { itemsCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { quoteCount } = useQuote();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D3] py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentPage === 'home' ? 'text-[#B38F26] font-bold' : 'text-gray-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Catalog */}
        <button
          onClick={() => onNavigate('catalog', { category: 'all' })}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentPage === 'catalog' ? 'text-[#B38F26] font-bold' : 'text-gray-500'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Shop</span>
        </button>

        {/* RFQ Quote */}
        <button
          onClick={() => onNavigate('quote')}
          className={`relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentPage === 'quote' ? 'text-[#B38F26] font-bold' : 'text-gray-500'
          }`}
        >
          <div className="relative">
            <FileText className="w-5 h-5" />
            {quoteCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#8C6D2B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {quoteCount}
              </span>
            )}
          </div>
          <span>RFQ Quote</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => onNavigate('wishlist')}
          className={`relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentPage === 'wishlist' ? 'text-[#B38F26] font-bold' : 'text-gray-500'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C4A052] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>

        {/* Cart */}
        <button
          onClick={openCartDrawer}
          className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-[#1A1A1A] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#C4A052]" />
            {itemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#1C1A17] text-[#D4AF37] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </div>
          <span className="font-semibold">Cart</span>
        </button>
      </div>
    </div>
  );
}
