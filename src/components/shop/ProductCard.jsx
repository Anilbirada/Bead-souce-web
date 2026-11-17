import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, FileText, Sparkles, Star } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

  const isSaved = isInWishlist(product.id);
  const basePrice = product.salePrice || product.price;
  const tier3Price = (basePrice * 0.70).toFixed(2); // 30% off for 50+ bulk master lots

  // Secondary image on hover if available
  const displayImage = isHovered && product.images && product.images.length > 1 
    ? product.images[1] 
    : product.image;

  return (
    <div 
      className="group bg-white rounded-2xl border border-[#EDE5D8] hover:border-[#C6A66B] overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Thumbnail Container */}
      <div 
        className="relative aspect-square overflow-hidden bg-[#FAF8F3] cursor-pointer" 
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-[#40362F] text-[#C6A66B] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider border border-[#52463D]">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#C6A66B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
              New Arrival
            </span>
          )}
          {product.salePrice && (
            <span className="bg-[#9E4929] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
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
                : 'bg-white/95 text-[#8B8175] hover:text-red-600 hover:bg-white'
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
            className="w-8 h-8 rounded-full bg-white/95 text-[#8B8175] hover:text-[#C6A66B] hover:bg-white flex items-center justify-center transition-colors shadow-md"
            title="Quick Preview"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToQuote(product, 50, basePrice, 'Wholesale RFQ Inquiry');
            }}
            className="w-8 h-8 rounded-full bg-white/95 text-[#40362F] hover:text-white hover:bg-[#C6A66B] flex items-center justify-center transition-colors shadow-md"
            title="Add to Bulk RFQ Quotation"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>

        {/* Stock & SKU Pill */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#EDE5D8]">
          <span className="font-mono text-[#8B8175] font-semibold">{product.sku}</span>
          <span className="text-emerald-800 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{product.stock} in stock</span>
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="uppercase font-bold tracking-widest text-[#8B8175]">
              {product.category?.replace(/-/g, ' ')}
            </span>
            <div className="flex items-center gap-1 text-[#C6A66B]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-bold text-[#292723]">{product.rating || '4.9'}</span>
              <span className="text-[#8B8175]">({product.reviewsCount || '28'})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-xs sm:text-sm font-semibold text-[#292723] hover:text-[#C6A66B] line-clamp-2 mt-1.5 cursor-pointer transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base font-bold text-[#292723]">
              {formatPrice(basePrice)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-[10px] text-[#8B8175]">/ wholesale pack</span>
          </div>

          {/* Wholesale Volume Tier Hint */}
          <div className="mt-1 flex items-center gap-1 text-[11px] text-[#8B8175] font-medium">
            <Sparkles className="w-3 h-3 text-[#C6A66B]" />
            <span>50+ packs: <strong className="text-[#C6A66B]">{formatPrice(tier3Price)}</strong> (-30%)</span>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-4 pt-3 border-t border-[#EDE5D8] flex items-center gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            className="flex-1 py-2 bg-[#40362F] hover:bg-[#52463D] text-[#FAF8F3] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-[#52463D] group"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C6A66B] group-hover:scale-110 transition-transform" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={() => onSelectProduct(product)}
            className="px-3 py-2 border border-[#EDE5D8] hover:border-[#C6A66B] hover:bg-[#FAF8F3] text-[#40362F] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="View Specifications & Wholesale Tiers"
          >
            Details
          </button>
        </div>

      </div>

    </div>
  );
}
