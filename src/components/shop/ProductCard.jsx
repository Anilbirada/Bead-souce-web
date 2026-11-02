import React from 'react';
import { Heart, ShoppingBag, Eye, FileText, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useQuote } from '../../context/QuoteContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function ProductCard({ 
  product, 
  onSelectProduct, 
  onQuickView 
}) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToQuote } = useQuote();
  const { formatPrice } = useCurrency();

  const isSaved = isInWishlist(product.id);
  const basePrice = product.salePrice || product.price;
  const tier3Price = (basePrice * 0.70).toFixed(2); // 30% off for 50+ bulk

  return (
    <div className="group bg-white rounded-2xl border border-[#EAE6DE] hover:border-[#D5C6A3] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col relative">
      
      {/* Thumbnail Container */}
      <div className="relative aspect-square overflow-hidden bg-[#FAF8F5] cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-[#1C1A17] text-[#E6C687] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#B38F26] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
              New Arrival
            </span>
          )}
          {product.salePrice && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md ${
              isSaved 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'bg-white/90 text-[#4A453A] hover:text-red-600 hover:bg-white'
            }`}
            title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-600' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 text-[#4A453A] hover:text-[#1A1A1A] hover:bg-white flex items-center justify-center transition-colors shadow-md"
            title="Quick Preview"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToQuote(product, 50, basePrice, 'Wholesale RFQ Inquiry');
            }}
            className="w-8 h-8 rounded-full bg-white/90 text-[#8C6D2B] hover:text-white hover:bg-[#8C6D2B] flex items-center justify-center transition-colors shadow-md"
            title="Add to Bulk RFQ Quotation"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>

        {/* Stock Pill */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] bg-white/85 backdrop-blur-xs px-2 py-1 rounded-md border border-white/60">
          <span className="font-mono text-gray-600 font-semibold">{product.sku}</span>
          <span className="text-green-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>{product.stock} in stock</span>
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category breadcrumb */}
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E9585]">
            {product.category?.replace(/-/g, ' ')}
          </span>

          {/* Product Name */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-xs sm:text-sm font-semibold text-[#1A1A1A] hover:text-[#B38F26] line-clamp-2 mt-1 cursor-pointer transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base font-bold text-[#1A1A1A]">
              {formatPrice(basePrice)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-[10px] text-gray-500">/ pack</span>
          </div>

          {/* Wholesale Volume Tier Hint */}
          <div className="mt-1 flex items-center gap-1 text-[11px] text-[#2F6122] font-semibold">
            <Sparkles className="w-3 h-3 text-[#589B42]" />
            <span>50+ packs: {formatPrice(tier3Price)}</span>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-4 pt-3 border-t border-[#F2EDE4] flex items-center gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            className="flex-1 py-2 bg-[#1C1A17] hover:bg-[#332E26] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={() => onSelectProduct(product)}
            className="px-2.5 py-2 border border-[#DDD6C8] hover:bg-[#FAF7F0] text-[#4A453A] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="View Specifications & Wholesale Tiers"
          >
            Details
          </button>
        </div>

      </div>

    </div>
  );
}
