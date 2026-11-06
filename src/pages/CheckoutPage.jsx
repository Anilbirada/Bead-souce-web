import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Building2, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Printer, 
  FileText, 
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../utils/api';

export default function CheckoutPage({ onNavigate }) {
  const { 
    cart, 
    rawSubtotal, 
    tieredSubtotal, 
    tierSavings, 
    coupon, 
    couponDiscount, 
    shippingFee, 
    isFreeShipping, 
    finalTotal, 
    clearCart 
  } = useCart();

  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [customer, setCustomer] = useState({
    name: user ? user.name : '',
    company: user ? user.company : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    address: '452 Post Street, Suite 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
    taxId: user ? user.taxId : ''
  });

  const [shippingMethod, setShippingMethod] = useState('dhl_express');
  const [paymentMethod, setPaymentMethod] = useState('wire_transfer');
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [error, setError] = useState(null);

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#EAE4D5] shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-2xl text-[#1A1A1A]">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500">
            Please add wholesale products before proceeding to checkout.
          </p>
          <button
            onClick={() => onNavigate('catalog', { category: 'all' })}
            className="px-6 py-3 bg-[#1C1A17] text-[#D4AF37] text-xs font-bold rounded-xl"
          >
            Explore Catalogue
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.address) {
      setError('Please fill in all required shipping and contact details.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        customer,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          price: item.salePrice || item.price,
          quantity: item.quantity,
          finish: item.selectedFinish,
          size: item.selectedSize,
          total: (item.salePrice || item.price) * item.quantity,
          image: item.image
        })),
        subtotal: tieredSubtotal,
        discount: couponDiscount,
        couponCode: coupon?.code || null,
        shipping: shippingFee,
        tax: 0,
        total: finalTotal,
        paymentMethod: paymentMethod === 'wire_transfer' ? 'Wire Transfer / TT' : (paymentMethod === 'upi' ? 'UPI / Net Banking' : 'Credit Card (Stripe Verified)'),
        notes: orderNotes
      };

      const res = await api.createOrder(orderData);
      setCompletedOrder(res);
      clearCart();
    } catch (err) {
      setError(err.message || 'Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- ORDER SUCCESS CONFIRMATION & COMMERCIAL INVOICE SCREEN ---
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Success Banner */}
          <div className="bg-white rounded-3xl p-8 border border-[#EAE4D5] shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D2B]">
                Order Confirmed &bull; Invoice Generated
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-1">
                Thank you for your Wholesale Order!
              </h1>
              <p className="text-xs text-[#6B6557] mt-1.5">
                Order confirmation and commercial export invoice have been sent to <strong>{completedOrder.customer?.email}</strong>.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-[#FAF7F0] hover:bg-[#F3EFE6] text-[#8C6D2B] border border-[#DACFBA] text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#AA771C]" />
                <span>Print Official Commercial Invoice</span>
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 bg-[#1C1A17] hover:bg-[#332E26] text-white text-xs font-bold rounded-xl transition-colors"
              >
                View in Customer Dashboard
              </button>
            </div>
          </div>

          {/* Official Commercial Invoice Sheet */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE4D5] shadow-sm space-y-8 print:p-0 print:border-none">
            
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#EAE4D5]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#1C1A17] text-[#D4AF37] flex items-center justify-center font-serif font-bold text-sm">
                    B
                  </div>
                  <span className="font-serif text-xl font-bold text-[#1A1A1A]">
                    BEADS<span className="text-[#C4A052]">SOURCE</span> LLC
                  </span>
                </div>
                <p className="text-xs text-gray-500">Central International Logistics &amp; Fulfillment Center</p>
                <p className="text-xs text-gray-500">Export Registration: EXP-INT-998241 &bull; IEC: 0714018291</p>
                <p className="text-xs text-gray-500">Toll-Free: +1 (800) 555-0199 &bull; orders@beadssource.com</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full uppercase">
                  {completedOrder.status || 'Processing'}
                </span>
                <p className="font-serif font-bold text-xl text-[#1A1A1A] mt-2">
                  Invoice #{completedOrder.id}
                </p>
                <p className="text-xs text-gray-500">
                  Date: {new Date(completedOrder.date).toLocaleDateString()}
                </p>
                <p className="text-xs font-mono text-[#8C6D2B]">
                  Tracking: {completedOrder.trackingNumber}
                </p>
              </div>
            </div>

            {/* Bill To & Ship To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#524B3E]">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D5] space-y-1">
                <p className="font-bold text-[#1A1A1A] uppercase text-[10px] tracking-wider text-gray-500">
                  Wholesale Buyer Details
                </p>
                <p className="font-bold text-sm text-[#1A1A1A]">{completedOrder.customer?.name}</p>
                <p>{completedOrder.customer?.company}</p>
                <p>{completedOrder.customer?.email}</p>
                <p>{completedOrder.customer?.phone}</p>
                {completedOrder.customer?.taxId && <p>Tax ID / GSTIN: {completedOrder.customer?.taxId}</p>}
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D5] space-y-1">
                <p className="font-bold text-[#1A1A1A] uppercase text-[10px] tracking-wider text-gray-500">
                  Shipping Destination
                </p>
                <p className="font-semibold text-[#1A1A1A]">{completedOrder.customer?.address}</p>
                <p>{completedOrder.customer?.city}, {completedOrder.customer?.state} {completedOrder.customer?.zip}</p>
                <p>{completedOrder.customer?.country}</p>
                <p className="font-semibold text-[#8C6D2B] pt-1">
                  Courier: DHL Express Worldwide Priority
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-[#EAE4D5] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#EAE4D5] text-[#3D372D] font-bold">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Product Description</th>
                    <th className="p-3 text-center">Qty (pk)</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {completedOrder.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-[11px] text-gray-500">{item.sku}</td>
                      <td className="p-3 font-medium text-[#1A1A1A]">{item.name}</td>
                      <td className="p-3 text-center font-bold">{item.quantity}</td>
                      <td className="p-3 text-right">{formatPrice(item.price)}</td>
                      <td className="p-3 text-right font-bold">{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end text-xs text-[#524B3E]">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#1A1A1A]">{formatPrice(completedOrder.subtotal)}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Coupon ({completedOrder.couponCode}):</span>
                    <span className="font-semibold">-{formatPrice(completedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Worldwide Courier:</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {completedOrder.shipping === 0 ? 'FREE' : formatPrice(completedOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-2 border-t border-[#EAE4D5]">
                  <span>Total Amount:</span>
                  <span>{formatPrice(completedOrder.total)}</span>
                </div>
                <div className="text-[10px] text-gray-400 text-right">
                  Payment: {completedOrder.paymentMethod} ({completedOrder.paymentStatus})
                </div>
              </div>
            </div>

            {/* Wire Transfer instructions if applicable */}
            <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#EBE4D5] text-xs space-y-1.5 text-[#5C5547]">
              <p className="font-bold text-[#1A1A1A]">Bank Remittance / TT Instructions for BeadsSource Export:</p>
              <p>Bank: International Commercial Banking Corporation &bull; Global Treasury Branch</p>
              <p>Beneficiary: BeadsSource Wholesale LLC Export Account &bull; Account No: 382910481920</p>
              <p>Routing / Swift Code: BSNUS33NYC</p>
              <p className="text-[10px] text-gray-500 pt-1">
                Kindly quote your Invoice #{completedOrder.id} in your wire transfer narration.
              </p>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // --- CHECKOUT FORM ---
  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      
      {/* Banner */}
      <div className="bg-[#1C1A17] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#383327]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypted 256-Bit B2B Wholesale Checkout</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">
              Secure Wholesale Checkout
            </h1>
          </div>
          <button
            onClick={() => onNavigate('catalog', { category: 'all' })}
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#E6C687] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Customer, Shipping & Payment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Wholesale Business & Contact Information */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBE1]">
                <div className="w-8 h-8 rounded-full bg-[#1C1A17] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
                    Wholesale Business &amp; Contact Information
                  </h3>
                  <p className="text-xs text-gray-500">Invoices and tracking numbers will be issued to this business profile</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Authorized Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Authorized Purchasing Agent"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Company / Studio Name *</label>
                  <input
                    type="text"
                    required
                    value={customer.company}
                    onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                    placeholder="e.g. Vance Atelier Jewelry"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="buyer@vanceatelier.com"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="+1 (415) 890-2341"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#3D372E] mb-1">GSTIN / Resale Certificate / Tax ID</label>
                  <input
                    type="text"
                    value={customer.taxId}
                    onChange={(e) => setCustomer({ ...customer, taxId: e.target.value })}
                    placeholder="e.g. EIN-94-382910 or 29AABCU9603R1ZX"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBE1]">
                <div className="w-8 h-8 rounded-full bg-[#1C1A17] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
                    Shipping Destination Address
                  </h3>
                  <p className="text-xs text-gray-500">Provide complete street address for DHL / FedEx air freight dispatch</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="452 Post Street, Suite 4B"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#3D372E] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="San Francisco"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3D372E] mb-1">State / Province *</label>
                    <input
                      type="text"
                      required
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      placeholder="CA"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-[#3D372E] mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={customer.zip}
                      onChange={(e) => setCustomer({ ...customer, zip: e.target.value })}
                      placeholder="94102"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={customer.country}
                    onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                    placeholder="United States / India / France"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBE1]">
                <div className="w-8 h-8 rounded-full bg-[#1C1A17] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
                    Wholesale Payment Method
                  </h3>
                  <p className="text-xs text-gray-500">Select preferred B2B settlement method</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {/* Option 1: Wire Transfer */}
                <label className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  paymentMethod === 'wire_transfer' ? 'bg-[#FDFBF7] border-[#8C6D2B]' : 'bg-[#FAF8F5] border-[#EAE4D5]'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="wire_transfer"
                    checked={paymentMethod === 'wire_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-[#8C6D2B] focus:ring-[#8C6D2B]"
                  />
                  <div>
                    <span className="font-bold text-[#1A1A1A] block text-sm">International Bank Wire / TT</span>
                    <span className="text-gray-500 text-[11px] block mt-0.5">
                      Direct telegraphic wire transfer to our State Bank of India export account. Wire instructions generated on invoice.
                    </span>
                  </div>
                </label>

                {/* Option 2: UPI / Domestic Net Banking */}
                <label className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  paymentMethod === 'upi' ? 'bg-[#FDFBF7] border-[#8C6D2B]' : 'bg-[#FAF8F5] border-[#EAE4D5]'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-[#8C6D2B] focus:ring-[#8C6D2B]"
                  />
                  <div>
                    <span className="font-bold text-[#1A1A1A] block text-sm">UPI / Domestic Net Banking (India)</span>
                    <span className="text-gray-500 text-[11px] block mt-0.5">
                      Instant zero-surcharge settlement via Google Pay, PhonePe, Paytm or NEFT/RTGS.
                    </span>
                  </div>
                </label>

                {/* Option 3: Credit Card */}
                <label className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  paymentMethod === 'card' ? 'bg-[#FDFBF7] border-[#8C6D2B]' : 'bg-[#FAF8F5] border-[#EAE4D5]'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-[#8C6D2B] focus:ring-[#8C6D2B]"
                  />
                  <div>
                    <span className="font-bold text-[#1A1A1A] block text-sm">Visa / Mastercard / Amex (Secure B2B)</span>
                    <span className="text-gray-500 text-[11px] block mt-0.5">
                      Instant card verification through 3D Secure 2.0 encrypted merchant gateway.
                    </span>
                  </div>
                </label>
              </div>

              {/* Order Notes */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#3D372E] mb-1">
                  Packing &amp; Dispatch Remarks (Optional)
                </label>
                <textarea
                  rows="2"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please label bags with SKU stickers or package for air shipment."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
                />
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary & Confirmation Button */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A] pb-3 border-b border-[#F0EBE1]">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items scroll */}
              <div className="max-h-60 overflow-y-auto divide-y divide-[#F2ECE1] space-y-3 pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-white border border-[#EAE4D5] shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-[#1A1A1A] line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        SKU: {item.sku} &bull; Qty: {item.quantity} pk
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#1A1A1A]">
                      {formatPrice((item.salePrice || item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations Breakdown */}
              <div className="pt-4 border-t border-[#F0EBE1] space-y-2 text-xs text-[#524B3E]">
                <div className="flex justify-between">
                  <span>Catalog Subtotal:</span>
                  <span className="font-semibold text-[#1A1A1A]">{formatPrice(rawSubtotal)}</span>
                </div>

                {tierSavings > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Wholesale Volume Tier Savings:</span>
                    <span className="font-bold">-{formatPrice(tierSavings)}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Coupon ({coupon?.code}):</span>
                    <span className="font-bold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Worldwide Courier Dispatch:</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {isFreeShipping ? <span className="text-green-700 font-bold">FREE</span> : formatPrice(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-3 border-t border-[#EAE4D5]">
                  <span>Total Due:</span>
                  <span className="text-lg text-[#1A1A1A]">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#1C1A17] hover:bg-[#332E26] text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loading ? (
                  <span>Generating Commercial Invoice...</span>
                ) : (
                  <>
                    <span>Confirm Wholesale Order &bull; {formatPrice(finalTotal)}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </>
                )}
              </button>

              <div className="pt-2 text-[11px] text-gray-500 text-center space-y-1">
                <p className="flex items-center justify-center gap-1.5 text-green-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Guaranteed Genuine &bull; Official Tax Invoice Issued</span>
                </p>
                <p>No credit card required upfront for Wire Transfer / TT orders.</p>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
