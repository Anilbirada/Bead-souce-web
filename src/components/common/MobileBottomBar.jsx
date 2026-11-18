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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EDE5D8] py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
            currentPage === 'home' ? 'text-[#C6A66B] font-bold' : 'text-[#8B8175]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Catalog */}
        <button
          onClick={() => onNavigate('catalog', { category: 'all' })}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
            currentPage === 'catalog' ? 'text-[#C6A66B] font-bold' : 'text-[#8B8175]'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Shop</span>
        </button>

        {/* RFQ Quote */}
        <button
          onClick={() => onNavigate('quote')}
          className={`relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
            currentPage === 'quote' ? 'text-[#C6A66B] font-bold' : 'text-[#8B8175]'
          }`}
        >
          <div className="relative">
            <FileText className="w-5 h-5" />
            {quoteCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#40362F] text-[#C6A66B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {quoteCount}
              </span>
            )}
          </div>
          <span>RFQ Quote</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => onNavigate('wishlist')}
          className={`relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
            currentPage === 'wishlist' ? 'text-[#C6A66B] font-bold' : 'text-[#8B8175]'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C6A66B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>

        {/* Quote List */}
        <button
          onClick={openCartDrawer}
          className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-[#014b92] transition-colors cursor-pointer"
        >
          <div className="relative">
            <FileText className="w-5 h-5 text-[#014b92]" />
            {itemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#cb0000] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </div>
          <span className="font-bold">Quote List</span>
        </button>
      </div>
    </div>
  );
}
