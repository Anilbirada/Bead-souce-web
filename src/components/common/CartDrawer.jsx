import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  Tag, 
  FileText,
  Check
} from 'lucide-react';
import { api } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useQuote } from '../../context/QuoteContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function CartDrawer({ onNavigate }) {
  const { 
    cart, 
    isCartDrawerOpen, 
    closeCartDrawer, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    addToCart,
    itemsCount,
    rawSubtotal,
    tieredSubtotal,
    tierSavings,
    coupon,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    shippingFee,
    isFreeShipping,
    finalTotal,
    freeShippingProgress,
    amountToFreeShipping,
    toastMessage
  } = useCart();

  const { addToQuote } = useQuote();
  const { formatPrice } = useCurrency();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [addedRecomId, setAddedRecomId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (isCartDrawerOpen && cart.length > 0) {
      const excludeIds = cart.map(i => i.id).join(',');
      api.getRecommendations({ excludeIds, limit: 3 })
        .then(data => {
          if (isMounted && Array.isArray(data)) {
            setRecommendations(data);
          }
        })
        .catch(() => {});
    }
    return () => { isMounted = false; };
  }, [isCartDrawerOpen, cart.length]);

  const handleAddRecom = (prod) => {
    addToCart(prod, prod.moq || 5, 'Standard', 'Standard');
    setAddedRecomId(prod.id);
    setTimeout(() => setAddedRecomId(null), 2000);
  };

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput);
    setCouponLoading(false);
    setCouponInput('');
  };

  const handleConvertToQuote = () => {
    cart.forEach(item => {
      addToQuote({
        id: item.id,
        name: item.name,
        sku: item.sku,
        price: item.price,
        salePrice: item.salePrice,
        image: item.image
      }, item.quantity, item.salePrice || item.price, `Finish: ${item.selectedFinish}, Size: ${item.selectedSize}`);
    });
    closeCartDrawer();
    onNavigate('quote');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#40362F] text-[#FAF8F3] flex items-center justify-between border-b border-[#52463D]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C6A66B]" />
              <h2 className="font-serif font-bold text-lg text-[#FAF8F3]">Wholesale Cart</h2>
              <span className="text-xs bg-[#52463D] text-[#D8C49A] px-2.5 py-0.5 rounded-full font-semibold">
                {itemsCount} {itemsCount === 1 ? 'pack' : 'packs'}
              </span>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 text-[#EDE5D8] hover:text-[#C6A66B] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Notification inside drawer */}
          {toastMessage && (
            <div className="bg-[#FAF8F3] border-b border-[#EDE5D8] p-2 text-center text-xs font-semibold text-[#C6A66B] animate-fade-in">
              {toastMessage}
            </div>
          )}

          {/* Free Shipping Progress Meter */}
          <div className="p-4 bg-[#FAF8F3] border-b border-[#EDE5D8] text-xs">
            <div className="flex items-center justify-between font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-[#40362F]">
                <Truck className="w-4 h-4 text-[#C6A66B]" />
                {isFreeShipping ? (
                  <span className="text-[#C6A66B] font-bold">🎉 FREE Worldwide Express Shipping Unlocked!</span>
                ) : (
                  <span>Add <strong className="text-[#C6A66B] font-bold">{formatPrice(amountToFreeShipping)}</strong> more for Free Worldwide Express Delivery</span>
                )}
              </span>
              <span className="text-[#8B8175] text-[11px] font-bold">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#EDE5D8] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#C6A66B] to-[#D8C49A] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Volume Tier Discount Banner */}
          {tierSavings > 0 && (
            <div className="px-4 py-2.5 bg-[#FAF8F3] border-b border-[#EDE5D8] text-xs flex items-center justify-between text-[#40362F]">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span className="text-[#292723]">Wholesale volume discount applied!</span>
              </span>
              <span className="font-bold text-[#C6A66B]">-{formatPrice(tierSavings)}</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#EDE5D8]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F3] flex items-center justify-center text-[#8B8175] border border-[#EDE5D8]">
                  <ShoppingBag className="w-8 h-8 text-[#C6A66B]" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#292723]">Your Wholesale Cart is Empty</h3>
                <p className="text-xs text-[#8B8175] max-w-xs">
                  Browse our genuine gemstone beads, lead-free pewter charms, and jewelry findings to build your wholesale order.
                </p>
                <button
                  onClick={() => { closeCartDrawer(); onNavigate('catalog', { category: 'all' }); }}
                  className="px-5 py-2.5 bg-[#40362F] text-[#FAF8F3] hover:bg-[#52463D] text-xs font-bold rounded-xl transition-colors cursor-pointer mt-2 shadow-sm"
                >
                  Explore Wholesale Catalogue
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.id}-${item.selectedFinish}-${item.selectedSize}`} className="py-3.5 flex gap-3 group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#EDE5D8] bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-[#292723] line-clamp-2 leading-snug">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedFinish, item.selectedSize)}
                        className="text-[#8B8175] hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#8B8175] mt-1">
                      <span className="font-mono bg-[#FAF8F3] border border-[#EDE5D8] px-1.5 py-0.5 rounded text-[#40362F] font-bold">{item.sku}</span>
                      <span>{item.selectedFinish}</span>
                      {item.selectedSize && <span>&bull; {item.selectedSize}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Modifiers */}
                      <div className="flex items-center border border-[#EDE5D8] rounded-lg bg-[#FAF8F3]">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedFinish, item.selectedSize, item.quantity - 1)}
                          className="p-1 hover:bg-[#EDE5D8] text-[#40362F] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#292723] min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedFinish, item.selectedSize, item.quantity + 1)}
                          className="p-1 hover:bg-[#EDE5D8] text-[#40362F] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#292723]">
                          {formatPrice((item.salePrice || item.price) * item.quantity)}
                        </span>
                        <div className="text-[10px] text-[#8B8175]">
                          {formatPrice(item.salePrice || item.price)} / pk
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Pair With Your Order Cross-Sell Recommendations */}
            {cart.length > 0 && recommendations.length > 0 && (
              <div className="pt-4 mt-4 border-t border-[#EDE5D8] space-y-2.5">
                <div className="flex items-center gap-1.5 text-[#C6A66B]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#292723]">
                    Pair With Your Order (Wholesale Components)
                  </span>
                </div>
                
                <div className="space-y-2">
                  {recommendations.slice(0, 2).map(recom => (
                    <div key={recom.id} className="p-2.5 bg-[#FAF8F3] rounded-xl border border-[#EDE5D8] flex items-center justify-between gap-3">
                      <img
                        src={recom.image}
                        alt={recom.name}
                        className="w-11 h-11 rounded-lg object-cover bg-white shrink-0 border border-[#EDE5D8]"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif font-bold text-xs text-[#292723] truncate">{recom.name}</h5>
                        <p className="text-[10px] text-[#8B8175] font-mono">MOQ: {recom.moq || 5} pk &bull; {formatPrice(recom.salePrice || recom.price)}/pk</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddRecom(recom)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          addedRecomId === recom.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#40362F] hover:bg-[#52463D] text-[#FAF8F3]'
                        }`}
                        title="Add recommended item to cart"
                      >
                        {addedRecomId === recom.id ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-[#FAF8F3] border-t border-[#EDE5D8] space-y-3">
              
              {/* Coupon input */}
              {coupon ? (
                <div className="p-2.5 bg-white border border-[#EDE5D8] rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#C6A66B]">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="text-[#292723]">Coupon <strong>{coupon.code}</strong> applied (-{coupon.discountValue}%)</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-red-600 hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. WHOLESALE10)"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-[#EDE5D8] rounded-xl focus:outline-none focus:border-[#C6A66B] uppercase font-mono text-[#292723]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-3 py-2 bg-[#40362F] text-[#FAF8F3] text-xs font-bold rounded-xl hover:bg-[#52463D] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#8B8175]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#292723]">{formatPrice(rawSubtotal)}</span>
                </div>
                {tierSavings > 0 && (
                  <div className="flex justify-between text-[#C6A66B]">
                    <span>Wholesale Tier Savings:</span>
                    <span className="font-semibold">-{formatPrice(tierSavings)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#C6A66B]">
                    <span>Coupon Promo:</span>
                    <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Worldwide Express Shipping:</span>
                  <span className="font-semibold text-[#292723]">
                    {isFreeShipping ? <span className="text-[#C6A66B] font-bold">FREE</span> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#292723] pt-2 border-t border-[#EDE5D8]">
                  <span>Estimated Total:</span>
                  <span className="text-base text-[#292723] font-serif">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout & Quote Conversion Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    closeCartDrawer();
                    onNavigate('checkout');
                  }}
                  className="w-full py-3.5 bg-[#40362F] hover:bg-[#52463D] text-[#FAF8F3] text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#52463D]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      closeCartDrawer();
                      onNavigate('catalog');
                    }}
                    className="py-2.5 bg-white hover:bg-[#FAF8F3] text-[#40362F] border border-[#EDE5D8] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>Continue Shopping</span>
                  </button>

                  <button
                    onClick={handleConvertToQuote}
                    className="py-2.5 bg-white hover:bg-[#FAF8F3] text-[#C6A66B] border border-[#EDE5D8] hover:border-[#C6A66B] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Request special custom wholesale rate for bulk production"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C6A66B]" />
                    <span>Convert to RFQ</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
