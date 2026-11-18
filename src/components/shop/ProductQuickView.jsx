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
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#EDE5D8] overflow-hidden z-10 animate-fade-in max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#8B8175] hover:text-[#292723] flex items-center justify-center shadow-md transition-colors cursor-pointer border border-[#EDE5D8]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Product Images */}
        <div className="w-full md:w-1/2 p-6 bg-[#FAF8F3] border-r border-[#EDE5D8] flex flex-col items-center justify-center">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white border border-[#EDE5D8] shadow-xs relative">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isBestSeller && (
              <span className="absolute top-3 left-3 bg-[#40362F] text-[#D8C49A] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
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
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === img ? 'border-[#C6A66B] scale-105' : 'border-[#EDE5D8] opacity-75'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-[#C6A66B] font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[#40362F]">100% Genuine Mineral &bull; Lead-Free</span>
          </div>
        </div>

        {/* Right: Product Details & Wholesale Tiers */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8B8175]">
                <span className="font-mono bg-[#FAF8F3] border border-[#EDE5D8] text-[#40362F] px-2 py-0.5 rounded-md font-semibold">
                  SKU: {product.sku}
                </span>
                <span>&bull;</span>
                <span className="text-[#C6A66B] font-semibold">{product.stock} units in stock</span>
              </div>
              <h2 className="text-lg font-serif font-bold text-[#292723] mt-1.5 leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Wholesale Price & Tier Table */}
            <div className="bg-[#FAF8F3] p-3.5 rounded-2xl border border-[#EDE5D8]">
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#014b92] bg-[#f0f5fa] border border-[#d2e2f0] px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#014b92]" />
                  <span>Wholesale RFQ &bull; Price on Request</span>
                </div>
                <span className="text-[11px] text-[#8B8175]">MOQ: {product.moq || 5} pk</span>
              </div>

              {/* Tier table */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-[#EDE5D8]">
                  <p className="text-[10px] text-[#8B8175]">1 - 9 pk</p>
                  <p className="font-bold text-[#292723] mt-0.5">Sample Lot</p>
                </div>
                <div className="bg-[#f8faff] p-2 rounded-xl border border-[#d2e2f0]">
                  <p className="text-[10px] text-[#014b92] font-semibold">10 - 49 pk</p>
                  <p className="font-bold text-[#014b92] mt-0.5">15% Discount</p>
                </div>
                <div className="bg-[#FAFDF8] p-2 rounded-xl border border-[#EDE5D8]">
                  <p className="text-[10px] text-emerald-700 font-semibold">50+ pk</p>
                  <p className="font-bold text-emerald-800 mt-0.5">30% Bulk</p>
                </div>
              </div>
            </div>

            {/* Variations: Finish */}
            {product.finish && product.finish.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[#40362F] mb-1.5">
                  Finish / Color: <span className="font-normal text-[#8B8175]">{selectedFinish}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.finish.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFinish(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        selectedFinish === f
                          ? 'bg-[#40362F] text-[#FAF8F3] border-[#52463D]'
                          : 'bg-white text-[#40362F] border-[#EDE5D8] hover:border-[#C6A66B]'
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
                <label className="block text-xs font-semibold text-[#40362F] mb-1.5">
                  Available Size: <span className="font-normal text-[#8B8175]">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#40362F] text-[#FAF8F3] border-[#52463D]'
                          : 'bg-white text-[#40362F] border-[#EDE5D8] hover:border-[#C6A66B]'
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
              <label className="block text-xs font-semibold text-[#40362F] mb-1.5">
                Wholesale Quantity (Packs)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#EDE5D8] rounded-xl bg-[#FAF8F3]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-[#EDE5D8] text-[#40362F] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center text-xs font-bold bg-transparent text-[#292723] focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-[#EDE5D8] text-[#40362F] transition-colors cursor-pointer"
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
                      className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF8F3] hover:bg-[#EDE5D8] border border-[#EDE5D8] rounded-lg text-[#40362F] cursor-pointer"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-[#EDE5D8] space-y-2 mt-4">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-[#014b92] hover:bg-[#003d78] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#003d78]"
              >
                <FileText className="w-4 h-4 text-[#ffd778]" />
                <span>Add {quantity} Packs to Quote</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isSaved ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-[#8B8175] border-[#EDE5D8] hover:text-red-600'
                }`}
                title="Save"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddToQuote}
                className="flex-1 py-2.5 bg-white hover:bg-[#FAF8F3] text-[#C6A66B] border border-[#EDE5D8] hover:border-[#C6A66B] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Request Custom Bulk Quotation</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSelectProduct(product);
                }}
                className="px-4 py-2.5 bg-white hover:bg-[#FAF8F3] border border-[#EDE5D8] text-[#40362F] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
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
