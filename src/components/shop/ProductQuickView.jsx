import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Plus, 
  Minus,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useQuote } from '../../context/QuoteContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function ProductQuickView({ product, onClose, onSelectProduct }) {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToQuote } = useQuote();
  const { formatPrice } = useCurrency();

  const [quantity, setQuantity] = useState(product.moq || 5);
  const [selectedFinish, setSelectedFinish] = useState(
    product.finish && product.finish[0] ? product.finish[0] : 'Standard'
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes[0] ? product.sizes[0] : 'Standard'
  );
  const [selectedImage, setSelectedImage] = useState(product.image);

  const isSaved = isInWishlist(product.id);
  const basePrice = product.salePrice || product.price;

  // Calculate tier pricing
  const tier1 = basePrice;
  const tier2 = (basePrice * 0.85).toFixed(2);
  const tier3 = (basePrice * 0.70).toFixed(2);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedFinish, selectedSize);
    onClose();
  };

  const handleAddToQuote = () => {
    addToQuote(product, quantity, basePrice, `Selected Finish: ${selectedFinish}, Size: ${selectedSize}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#EAE4D5] overflow-hidden z-10 animate-fade-in max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-black flex items-center justify-center shadow-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Product Images */}
        <div className="w-full md:w-1/2 p-6 bg-[#FAF8F5] border-r border-[#EAE4D5] flex flex-col items-center justify-center">
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-[#EAE4D5] shadow-xs relative">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isBestSeller && (
              <span className="absolute top-3 left-3 bg-[#1C1A17] text-[#E6C687] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                Best Seller
              </span>
            )}
          </div>

          {/* Thumbnails if multiple */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto w-full">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-[#C4A052] scale-105' : 'border-[#EAE4D5] opacity-75'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-green-700 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Genuine Mineral &bull; Lead-Free</span>
          </div>
        </div>

        {/* Right: Product Details & Wholesale Tiers */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8A8477]">
                <span className="font-mono bg-[#EAE5D8] text-[#554F42] px-2 py-0.5 rounded font-semibold">
                  SKU: {product.sku}
                </span>
                <span>&bull;</span>
                <span className="text-green-700 font-semibold">{product.stock} units in stock</span>
              </div>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A] mt-1.5 leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Wholesale Price & Tier Table */}
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE4D5]">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xl font-bold text-[#1A1A1A]">
                  {formatPrice(basePrice)}
                </span>
                <span className="text-xs text-gray-500">/ wholesale pack</span>
              </div>

              {/* Tier table */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-[#EAE4D5]">
                  <p className="text-[10px] text-gray-500">1 - 9 packs</p>
                  <p className="font-bold text-[#1A1A1A] mt-0.5">{formatPrice(tier1)}</p>
                </div>
                <div className="bg-[#F6FAF2] p-2 rounded-lg border border-[#D8ECD0]">
                  <p className="text-[10px] text-green-700 font-semibold">10 - 49 pk (-15%)</p>
                  <p className="font-bold text-green-800 mt-0.5">{formatPrice(tier2)}</p>
                </div>
                <div className="bg-[#F0F7EB] p-2 rounded-lg border border-[#C6E4BA]">
                  <p className="text-[10px] text-green-700 font-semibold">50+ pk (-30%)</p>
                  <p className="font-bold text-green-800 mt-0.5">{formatPrice(tier3)}</p>
                </div>
              </div>
            </div>

            {/* Variations: Finish */}
            {product.finish && product.finish.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[#3D382E] mb-1.5">
                  Finish / Color: <span className="font-normal text-gray-500">{selectedFinish}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.finish.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFinish(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedFinish === f
                          ? 'bg-[#1C1A17] text-[#E6C687] border-[#1C1A17]'
                          : 'bg-white text-gray-700 border-[#DDD6C8] hover:border-gray-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variations: Size / Length */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[#3D382E] mb-1.5">
                  Available Size: <span className="font-normal text-gray-500">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedSize === s
                          ? 'bg-[#1C1A17] text-[#E6C687] border-[#1C1A17]'
                          : 'bg-white text-gray-700 border-[#DDD6C8] hover:border-gray-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector with quick presets */}
            <div>
              <label className="block text-xs font-semibold text-[#3D382E] mb-1.5">
                Wholesale Quantity (Packs)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#DDD6C8] rounded-lg bg-[#FAF8F5]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-[#EBE5D8] text-gray-600 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center text-xs font-bold bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-[#EBE5D8] text-gray-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Add Presets */}
                <div className="flex items-center gap-1.5">
                  {[10, 25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setQuantity(preset)}
                      className="px-2 py-1 text-[11px] font-semibold bg-[#FAF7F0] hover:bg-[#F3EFE6] border border-[#DDD6C8] rounded text-[#4A453A]"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-[#EAE4D5] space-y-2 mt-4">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-[#1C1A17] hover:bg-[#332E26] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>Add {quantity} packs to Order</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isSaved ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-500 border-[#DDD6C8] hover:text-red-600'
                }`}
                title="Save"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddToQuote}
                className="flex-1 py-2.5 bg-[#FAF7F0] hover:bg-[#F3EFE6] text-[#8C6D2B] border border-[#DACFBA] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#AA771C]" />
                <span>Request Custom Bulk Quotation</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSelectProduct(product);
                }}
                className="px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
              >
                <span>Full Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
