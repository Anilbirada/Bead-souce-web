import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Share2, 
  Check, 
  ZoomIn, 
  X,
  Scale,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useQuote } from '../context/QuoteContext';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/shop/ProductCard';

export default function ProductDetailPage({ 
  product, 
  allProducts = [], 
  onNavigate, 
  onSelectProduct, 
  onQuickView 
}) {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToQuote } = useQuote();
  const { formatPrice } = useCurrency();

  const [selectedImage, setSelectedImage] = useState(
    product.images && product.images.length > 0 ? product.images[0] : product.image
  );
  const [selectedFinish, setSelectedFinish] = useState(
    product.finish && product.finish[0] ? product.finish[0] : 'Standard'
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes[0] ? product.sizes[0] : 'Standard'
  );
  const [quantity, setQuantity] = useState(product.moq || 5);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'shipping', 'care'
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteQty, setQuoteQty] = useState(quantity);
  const [copiedLink, setCopiedLink] = useState(false);

  const isSaved = isInWishlist(product.id);
  const basePrice = product.salePrice || product.price;

  // Wholesale Tiers
  const tier1Price = basePrice;
  const tier2Price = Number((basePrice * 0.85).toFixed(2)); // 10-49 pk
  const tier3Price = Number((basePrice * 0.70).toFixed(2)); // 50+ pk

  // Smart Dynamic Recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [bundleAdded, setBundleAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (product?.id) {
      api.getProductRecommendations(product.id)
        .then(data => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setRecommendations(data);
          }
        })
        .catch(() => {});
    }
    return () => { isMounted = false; };
  }, [product?.id]);

  // Fallback to related category products if needed
  const displayRecommendations = recommendations.length > 0 
    ? recommendations 
    : allProducts.filter(p => p.id !== product.id).slice(0, 4);

  // Frequently Bought Together Bundle Product
  const bundleProduct = displayRecommendations[0];
  const bundleTotalPrice = bundleProduct 
    ? (basePrice * (product.moq || 5)) + ((bundleProduct.salePrice || bundleProduct.price) * (bundleProduct.moq || 5))
    : null;

  const handleAddBundleToCart = () => {
    if (!bundleProduct) return;
    addToCart(product, product.moq || 5, selectedFinish, selectedSize);
    addToCart(bundleProduct, bundleProduct.moq || 5, 'Standard', 'Standard');
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 3000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedFinish, selectedSize);
  };

  const handleDirectQuoteSubmit = (e) => {
    e.preventDefault();
    addToQuote(product, quoteQty, basePrice, quoteNotes || `Selected Finish: ${selectedFinish}, Size: ${selectedSize}`);
    setQuoteModalOpen(false);
    onNavigate('quote');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      
      {/* Breadcrumbs & Navigation Bar */}
      <div className="bg-white border-b border-[#EAE4D5] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#7A7366]">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
            <button 
              onClick={() => onNavigate('home')} 
              className="hover:text-black transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button 
              onClick={() => onNavigate('catalog', { category: 'all' })} 
              className="hover:text-black transition-colors"
            >
              Wholesale Catalogue
            </button>
            <span>/</span>
            <button 
              onClick={() => onNavigate('catalog', { category: product.category })} 
              className="hover:text-black transition-colors uppercase tracking-wider text-[11px]"
            >
              {product.category?.replace(/-/g, ' ')}
            </button>
            <span>/</span>
            <span className="font-semibold text-[#1A1A1A] truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <button
            onClick={() => onNavigate('catalog', { category: product.category })}
            className="hidden sm:flex items-center gap-1.5 text-[#8C6D2B] hover:text-[#5E481B] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Category</span>
          </button>
        </div>
      </div>

      {/* Main Product Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Product Image Gallery & Zoom */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Stage Image with Zoom Button */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-[#EAE4D5] shadow-sm group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                onClick={() => setZoomModalOpen(true)}
              />

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setZoomModalOpen(true)}
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2.5 rounded-full shadow-lg border border-gray-200 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Open Zoom Lightbox"
              >
                <ZoomIn className="w-4 h-4 text-[#8C6D2B]" />
                <span className="hidden sm:inline">Zoom</span>
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isBestSeller && (
                  <span className="bg-[#1C1A17] text-[#E6C687] text-[10px] font-bold px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">
                    Best Seller
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="bg-[#B38F26] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">
                    New Arrival
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                      selectedImage === img ? 'border-[#C4A052] scale-105 shadow-md' : 'border-[#EAE4D5] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Seals */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#524B3E]">
              <div className="p-3 bg-white rounded-xl border border-[#EAE4D5] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-green-700 shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A1A1A]">100% Lead-Free Pewter</p>
                  <p className="text-[10px] text-gray-500">CPSIA &amp; REACH Compliant</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#EAE4D5] flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-[#C4A052] shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Authentic Mineral</p>
                  <p className="text-[10px] text-gray-500">Calibrated Sizing &bull; Lab Verified</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Product Details, Wholesale Pricing, Options, CTAs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-[#EAE5D8] text-[#554F42] text-xs px-2.5 py-0.5 rounded font-bold">
                    SKU: {product.sku}
                  </span>
                  <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>In Stock ({product.stock} units)</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-white text-gray-500 hover:text-black border border-transparent hover:border-[#DDD6C8] transition-colors"
                    title="Share product link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-full border transition-colors ${
                      isSaved ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-500 border-[#DDD6C8] hover:text-red-600'
                    }`}
                    title={isSaved ? "Remove from Saved" : "Save to Wishlist"}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-2.5 leading-snug">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#61594B] mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Wholesale Tiered Pricing Table */}
            <div className="bg-white p-5 rounded-2xl border border-[#EAE4D5] shadow-xs space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                    {formatPrice(basePrice)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1.5 font-medium">/ wholesale pack</span>
                </div>
                {product.salePrice && (
                  <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                    Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </span>
                )}
              </div>

              {/* Wholesale volume tier table */}
              <div className="border border-[#EAE4D5] rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-3 bg-[#FAF8F5] p-2 font-bold text-center border-b border-[#EAE4D5] text-[#3D372D]">
                  <div>Tier 1 (1-9 pk)</div>
                  <div className="text-green-800">Tier 2 (10-49 pk)</div>
                  <div className="text-green-800">Tier 3 (50+ pk)</div>
                </div>
                <div className="grid grid-cols-3 p-3 text-center bg-white divide-x divide-[#F0EBE1]">
                  <div>
                    <span className="font-bold text-[#1A1A1A]">{formatPrice(tier1Price)}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">Base Rate</p>
                  </div>
                  <div className="bg-[#FAFDF8]">
                    <span className="font-bold text-green-700">{formatPrice(tier2Price)}</span>
                    <p className="text-[10px] text-green-600 mt-0.5">15% Discount</p>
                  </div>
                  <div className="bg-[#F5FAF1]">
                    <span className="font-bold text-green-800">{formatPrice(tier3Price)}</span>
                    <p className="text-[10px] text-green-700 font-semibold mt-0.5">30% Bulk Discount</p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#7A7366] italic">
                *Discounts apply automatically at checkout based on total quantity ordered across all sizes.
              </p>
            </div>

            {/* Variations: Finish / Color */}
            {product.finish && product.finish.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#3D372E]">
                  Available Finish: <span className="font-normal text-gray-500">{selectedFinish}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.finish.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFinish(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedFinish === f
                          ? 'bg-[#1C1A17] text-[#E6C687] border-[#1C1A17] shadow-sm'
                          : 'bg-white text-[#4A453A] border-[#DDD6C8] hover:border-gray-400'
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
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#3D372E]">
                  Select Dimension / Pack Size: <span className="font-normal text-gray-500">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedSize === s
                          ? 'bg-[#1C1A17] text-[#E6C687] border-[#1C1A17] shadow-sm'
                          : 'bg-white text-[#4A453A] border-[#DDD6C8] hover:border-gray-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wholesale Quantity Picker & Preset Increments */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#3D372E]">Order Quantity (Packs):</span>
                <span className="text-[#8C6D2B] font-semibold">
                  Total: {formatPrice((quantity >= 50 ? tier3Price : (quantity >= 10 ? tier2Price : tier1Price)) * quantity)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-[#DDD6C8] rounded-xl bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-[#FAF8F5] text-gray-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center text-sm font-bold bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-[#FAF8F5] text-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Preset Increments */}
                <div className="flex items-center gap-1.5">
                  {[10, 25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setQuantity(preset)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${
                        quantity === preset 
                          ? 'bg-[#8C6D2B] text-white border-[#8C6D2B]' 
                          : 'bg-white hover:bg-[#FAF7F0] text-[#4A453A] border-[#DDD6C8]'
                      }`}
                    >
                      {preset} pk
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Request a Quote */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#1C1A17] hover:bg-[#332E26] text-white text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                <span>Add {quantity} Packs to Order &bull; {formatPrice((quantity >= 50 ? tier3Price : (quantity >= 10 ? tier2Price : tier1Price)) * quantity)}</span>
              </button>

              <button
                onClick={() => setQuoteModalOpen(true)}
                className="w-full py-3.5 bg-white hover:bg-[#FAF7F0] text-[#8C6D2B] border border-[#D5C6A3] text-xs font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4 text-[#AA771C]" />
                <span>Request a Custom Bulk Quote (RFQ)</span>
              </button>
            </div>

            {/* Express Dispatch Note */}
            <div className="p-4 bg-[#FAF7F0] border border-[#EBE4D5] rounded-2xl flex items-center gap-3 text-xs text-[#635B4E]">
              <Truck className="w-5 h-5 text-[#C4A052] shrink-0" />
              <div>
                <p className="font-semibold text-[#1A1A1A]">Worldwide Courier Dispatch in 24-48 Hours</p>
                <p className="text-[11px] text-gray-500">DHL Express / FedEx tracking provided. Free shipping over $500.</p>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Specifications & Shipping Section */}
        <div className="mt-16 bg-white rounded-3xl border border-[#EAE4D5] shadow-xs overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-[#EAE4D5] bg-[#FAF8F5] text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 transition-colors ${
                activeTab === 'specs' 
                  ? 'bg-white text-[#8C6D2B] border-b-2 border-[#8C6D2B] font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Product Specifications &bull; Technical Details
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-4 transition-colors ${
                activeTab === 'shipping' 
                  ? 'bg-white text-[#8C6D2B] border-b-2 border-[#8C6D2B] font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Wholesale Shipping &amp; Packaging
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`px-6 py-4 transition-colors ${
                activeTab === 'care' 
                  ? 'bg-white text-[#8C6D2B] border-b-2 border-[#8C6D2B] font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Material Compliance &amp; Care
            </button>
          </div>

          {/* Tab 1: Product Specifications */}
          {activeTab === 'specs' && (
            <div className="p-8">
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-4">
                Detailed Product Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5]">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Base Material</span>
                  <span className="font-semibold text-[#1A1A1A] text-sm mt-0.5 block">{product.materials || 'Hypoallergenic Jewelry Metal / Natural Stone'}</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5]">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Hole Drill Size</span>
                  <span className="font-semibold text-[#1A1A1A] text-sm mt-0.5 block">{product.holeSize || 'Standard 1.0mm - 1.5mm'}</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5]">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Available Finishes</span>
                  <span className="font-semibold text-[#1A1A1A] text-sm mt-0.5 block">{product.finish ? product.finish.join(', ') : 'Antique Gold, Antique Silver'}</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5]">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Minimum Wholesale Order (MOQ)</span>
                  <span className="font-semibold text-[#1A1A1A] text-sm mt-0.5 block">{product.moq || 1} Pack(s)</span>
                </div>
              </div>

              {/* Dynamic specs if available */}
              {product.specs && (
                <div className="mt-6 pt-6 border-t border-[#F0EBE1]">
                  <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-3">
                    Factory Technical Specs
                  </h4>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1.5 border-b border-[#F5F2EB]">
                        <dt className="text-gray-500">{key}:</dt>
                        <dd className="font-semibold text-[#1A1A1A]">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Wholesale Shipping & Packaging */}
          {activeTab === 'shipping' && (
            <div className="p-8 space-y-4 text-xs text-[#524B3E] leading-relaxed">
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
                Wholesale Shipping, Packaging &amp; Customs
              </h3>
              <p>
                All orders are inspected and packed with shock-resistant export bubble wraps and sealed polyethylene bags to guarantee intact delivery of delicate gemstone beads and pave crystals.
              </p>
              <ul className="space-y-2 pl-4 list-disc">
                <li><strong>Dispatch Hub:</strong> Central International Logistics Center.</li>
                <li><strong>International Couriers:</strong> DHL Express Worldwide, FedEx International Priority, and UPS Air Freight.</li>
                <li><strong>Transit Times:</strong> 3-5 business days to North America, Europe, Australia, and Middle East.</li>
                <li><strong>Regional Deliveries:</strong> Express air couriers and warehouse distribution pickup.</li>
                <li><strong>Free Shipping:</strong> Automatically activated on all wholesale purchases over $500 USD.</li>
              </ul>
            </div>
          )}

          {/* Tab 3: Care & Compliance */}
          {activeTab === 'care' && (
            <div className="p-8 space-y-4 text-xs text-[#524B3E] leading-relaxed">
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
                Safety Testing &amp; Component Care
              </h3>
              <p>
                Our pewter charms, spacers, and findings are 100% certified lead-free and cadmium-free, meeting the stringent standards of the US Consumer Product Safety Improvement Act (CPSIA) and California Proposition 65.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5]">
                  <h4 className="font-bold text-[#1A1A1A] mb-1">Cubic Zirconia &amp; Plating Care</h4>
                  <p className="text-[11px] text-gray-600">Store in dry containers. Avoid direct contact with harsh perfumes, chlorine, and chemical cleaners to preserve high-luster electroplating.</p>
                </div>
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5]">
                  <h4 className="font-bold text-[#1A1A1A] mb-1">Natural Gemstone Preservation</h4>
                  <p className="text-[11px] text-gray-600">Clean natural stones gently with a soft microfiber cloth. Do not use ultrasonic baths on porous minerals like turquoise or howlite.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* FREQUENTLY BOUGHT TOGETHER / BUNDLE PAIRING */}
        {/* ========================================================= */}
        {bundleProduct && (
          <div className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4D5] shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#C49A3A]" />
              <span className="text-[11px] uppercase font-bold text-[#C49A3A] tracking-wider">
                Wholesale Perfect Pairings
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#191919] mb-6">
              Frequently Bought Together
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Visual bundle items */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Current Item */}
                <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D5]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-500 font-mono">This Item</span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#191919] max-w-[180px] line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs font-bold text-[#C49A3A] mt-0.5">
                      {formatPrice(basePrice)} <span className="text-[10px] text-gray-500 font-normal">/ pk (MOQ: {product.moq || 5})</span>
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD6C8] flex items-center justify-center font-bold text-gray-600">
                  +
                </div>

                {/* Paired Cross-Sell Item */}
                <div 
                  onClick={() => onSelectProduct && onSelectProduct(bundleProduct.id)}
                  className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D5] hover:border-[#C49A3A] cursor-pointer transition-colors"
                >
                  <img
                    src={bundleProduct.image}
                    alt={bundleProduct.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#C49A3A] font-mono">Recommended Pairing</span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#191919] max-w-[180px] line-clamp-1">
                      {bundleProduct.name}
                    </h4>
                    <p className="text-xs font-bold text-[#C49A3A] mt-0.5">
                      {formatPrice(bundleProduct.salePrice || bundleProduct.price)}{' '}
                      <span className="text-[10px] text-gray-500 font-normal">/ pk (MOQ: {bundleProduct.moq || 5})</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bundle Pricing & 1-Click Action */}
              <div className="w-full lg:w-auto p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D5] flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-4 text-center lg:text-right">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500">Combined Wholesale Total</span>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-[#191919]">
                    {formatPrice(bundleTotalPrice)}
                  </div>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Includes factory MOQs &bull; Tier discounts applied
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddBundleToCart}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                    bundleAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#191919] hover:bg-[#303030] text-white hover:scale-102'
                  }`}
                >
                  {bundleAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added Both to Order!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#C49A3A]" />
                      <span>Add Both to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SMART PRODUCT RECOMMENDATIONS & YOU MAY ALSO LIKE */}
        {/* ========================================================= */}
        {displayRecommendations.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase font-bold text-[#8C6D2B] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Smart Recommendation Engine</span>
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-1">
                  You May Also Like &bull; Complete Your Collection
                </h3>
              </div>
              <button
                onClick={() => onNavigate('catalog', { category: product.category })}
                className="text-xs font-bold text-[#8C6D2B] hover:underline flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {displayRecommendations.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onSelectProduct={onSelectProduct}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Full-Screen Image Zoom Lightbox Modal */}
      {zoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setZoomModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* Dedicated Bulk Quotation (RFQ) Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setQuoteModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EAE4D5] p-6 z-10 animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D5]">
              <div className="flex items-center gap-2 text-[#8C6D2B]">
                <FileText className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Request a Bulk Quotation (RFQ)</h3>
              </div>
              <button onClick={() => setQuoteModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE4D5]">
              <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover bg-white" />
              <div className="text-xs">
                <p className="font-semibold text-[#1A1A1A]">{product.name}</p>
                <p className="font-mono text-gray-500 text-[10px]">SKU: {product.sku}</p>
                <p className="text-gray-500 text-[11px]">Catalog Price: {formatPrice(basePrice)} / pack</p>
              </div>
            </div>

            <form onSubmit={handleDirectQuoteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D372E] mb-1">Requested Quantity (Packs)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quoteQty}
                  onChange={(e) => setQuoteQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D372E] mb-1">Target Price per Pack (USD / Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. $1.20"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D372E] mb-1">Specific Customization / Remarks</label>
                <textarea
                  rows="3"
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="Mention finish preferences, plating thickness, packaging or delivery timeline..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1C1A17] hover:bg-[#332E26] text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <span>Submit to RFQ Builder</span>
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
