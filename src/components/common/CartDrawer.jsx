import React, { useState } from 'react';
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
  FileText 
} from 'lucide-react';
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
          <div className="p-4 sm:p-5 bg-[#1C1A17] text-white flex items-center justify-between border-b border-[#38332A]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif font-bold text-lg text-white">Wholesale Cart</h2>
              <span className="text-xs bg-[#302B24] text-[#E6C687] px-2 py-0.5 rounded-full font-semibold">
                {itemsCount} {itemsCount === 1 ? 'pack' : 'packs'}
              </span>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Notification inside drawer */}
          {toastMessage && (
            <div className="bg-[#FAF3E0] border-b border-[#E8DCC0] p-2 text-center text-xs font-semibold text-[#8C6D2B] animate-fade-in">
              {toastMessage}
            </div>
          )}

          {/* Free Shipping Progress Meter */}
          <div className="p-4 bg-[#FAF7F0] border-b border-[#EBE4D5] text-xs">
            <div className="flex items-center justify-between font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-[#363229]">
                <Truck className="w-4 h-4 text-[#C4A052]" />
                {isFreeShipping ? (
                  <span className="text-green-700 font-bold">🎉 FREE Worldwide Express Shipping Unlocked!</span>
                ) : (
                  <span>Add <strong className="text-[#8C6D2B]">{formatPrice(amountToFreeShipping)}</strong> more for Free Worldwide Express Delivery</span>
                )}
              </span>
              <span className="text-gray-500 text-[11px]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#E5DDC9] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-linear-to-r from-[#D4AF37] to-[#8C6212] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Volume Tier Discount Banner */}
          {tierSavings > 0 && (
            <div className="px-4 py-2 bg-[#F3F9EE] border-b border-[#D8ECD0] text-xs flex items-center justify-between text-[#2D5A1E]">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-green-600" />
                <span>Wholesale volume discount applied!</span>
              </span>
              <span className="font-bold">-{formatPrice(tierSavings)}</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#F0EBE1]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F0] flex items-center justify-center text-gray-400 border border-[#EAE4D5]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Your Wholesale Cart is Empty</h3>
                <p className="text-xs text-[#736B5E] max-w-xs">
                  Browse our genuine gemstone beads, lead-free pewter charms, and jewelry findings to build your wholesale order.
                </p>
                <button
                  onClick={() => { closeCartDrawer(); onNavigate('catalog', { category: 'all' }); }}
                  className="px-5 py-2.5 bg-[#1C1A17] text-[#D4AF37] text-xs font-bold rounded-lg hover:bg-[#332E26] transition-colors cursor-pointer mt-2"
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
                    className="w-16 h-16 rounded-lg object-cover border border-[#EAE4D5] bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-[#1A1A1A] line-clamp-2 leading-snug">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedFinish, item.selectedSize)}
                        className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#736B5E] mt-1">
                      <span className="font-mono bg-[#EAE5D8] px-1.5 py-0.5 rounded">{item.sku}</span>
                      <span>{item.selectedFinish}</span>
                      {item.selectedSize && <span>&bull; {item.selectedSize}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Modifiers */}
                      <div className="flex items-center border border-[#DDD6C8] rounded-md bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedFinish, item.selectedSize, item.quantity - 1)}
                          className="p-1 hover:bg-[#EBE5D8] text-gray-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#1A1A1A] min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedFinish, item.selectedSize, item.quantity + 1)}
                          className="p-1 hover:bg-[#EBE5D8] text-gray-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#1A1A1A]">
                          {formatPrice((item.salePrice || item.price) * item.quantity)}
                        </span>
                        <div className="text-[10px] text-gray-500">
                          {formatPrice(item.salePrice || item.price)} / pk
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-[#FAF8F5] border-t border-[#EAE4D5] space-y-3">
              
              {/* Coupon input */}
              {coupon ? (
                <div className="p-2 bg-[#F3F9EE] border border-[#D8ECD0] rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#2D5A1E]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{coupon.code}</strong> applied (-{coupon.discountValue}%)</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-red-600 hover:underline text-[11px] font-semibold"
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
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#DDD6C8] rounded-md focus:outline-none focus:border-[#C4A052] uppercase font-mono"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-3 py-1.5 bg-[#2B2721] text-[#E6C687] text-xs font-bold rounded-md hover:bg-[#3E382E] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#524C40]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#1A1A1A]">{formatPrice(rawSubtotal)}</span>
                </div>
                {tierSavings > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Wholesale Tier Savings:</span>
                    <span className="font-semibold">-{formatPrice(tierSavings)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Coupon Promo:</span>
                    <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Worldwide Express Shipping:</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {isFreeShipping ? <span className="text-green-700 font-bold">FREE</span> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-[#EAE4D5]">
                  <span>Estimated Total:</span>
                  <span className="text-base text-[#1A1A1A]">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout & Quote Conversion Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    closeCartDrawer();
                    onNavigate('checkout');
                  }}
                  className="w-full py-3 bg-[#1C1A17] hover:bg-[#332E26] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Wholesale Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>

                <button
                  onClick={handleConvertToQuote}
                  className="w-full py-2 bg-white hover:bg-[#FAF6ED] text-[#8C6D2B] border border-[#D5C6A3] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Request special custom wholesale rate from Ramesh Sir"
                >
                  <FileText className="w-3.5 h-3.5 text-[#AA771C]" />
                  <span>Convert Cart into Custom RFQ Quote</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
