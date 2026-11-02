import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function WishlistPage({ onNavigate, onSelectProduct }) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const handleMoveToCart = (item) => {
    addToCart(item, item.moq || 5);
    removeFromWishlist(item.id);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      {/* Banner */}
      <div className="bg-[#1C1A17] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#383227]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold mb-1">
              <Heart className="w-4 h-4 fill-current" />
              <span>Personal Wholesale Catalog Curation</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">
              Saved Wholesale Wishlist ({wishlist.length})
            </h1>
          </div>
          <button
            onClick={() => onNavigate('catalog', { category: 'all' })}
            className="text-xs text-[#E6C687] hover:underline"
          >
            Continue Browsing
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#EAE4D5] shadow-xs max-w-lg mx-auto space-y-4">
            <Heart className="w-16 h-16 text-gray-300 mx-auto" />
            <h2 className="font-serif font-bold text-2xl text-[#1A1A1A]">Your Wishlist is Empty</h2>
            <p className="text-xs text-gray-500">
              Save favorite gemstone strands, lead-free pewter charms, and findings while browsing our catalogue.
            </p>
            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className="px-6 py-3 bg-[#1C1A17] text-[#D4AF37] text-xs font-bold rounded-xl hover:bg-[#332E26] transition-colors"
            >
              Explore Wholesale Catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-[#EAE4D5] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-[#FAF8F5] cursor-pointer" onClick={() => onSelectProduct(item)}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFromWishlist(item.id); }}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-white rounded-full text-red-600 shadow-md transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-gray-500 bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#EAE4D5]">
                      {item.sku}
                    </span>
                    <h3 
                      onClick={() => onSelectProduct(item)}
                      className="font-semibold text-xs text-[#1A1A1A] hover:text-[#8C6D2B] line-clamp-2 mt-1.5 cursor-pointer"
                    >
                      {item.name}
                    </h3>
                    <p className="font-bold text-sm text-[#1A1A1A] mt-2">
                      {formatPrice(item.salePrice || item.price)}
                      <span className="text-[10px] text-gray-500 font-normal"> / pack</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0EBE1] mt-3">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="w-full py-2 bg-[#1C1A17] hover:bg-[#332E26] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Move to Cart ({item.moq || 5} pk)</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
