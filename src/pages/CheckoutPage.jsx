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
      <div className="min-h-screen bg-[#FAF8F3] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Success Banner */}
          <div className="bg-white rounded-3xl p-8 border border-[#EDE5D8] shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-[#FAF8F3] text-[#C6A66B] rounded-full flex items-center justify-center mx-auto border border-[#EDE5D8]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C6A66B]">
                Order Confirmed &bull; Invoice Generated
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#292723] mt-1.5">
                Thank you for your Wholesale Order!
              </h1>
              <p className="text-xs text-[#8B8175] mt-2">
                Order confirmation and commercial export invoice have been sent to <strong className="text-[#292723]">{completedOrder.customer?.email}</strong>.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-3 bg-[#FAF8F3] hover:bg-[#EDE5D8] text-[#40362F] border border-[#EDE5D8] text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#C6A66B]" />
                <span>Print Official Commercial Invoice</span>
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-3 bg-[#40362F] hover:bg-[#52463D] text-[#FAF8F3] text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                View in Customer Dashboard
              </button>
            </div>
          </div>

          {/* Official Commercial Invoice Sheet */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE5D8] shadow-sm space-y-8 print:p-0 print:border-none">
            
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#EDE5D8]">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-full bg-[#40362F] text-[#C6A66B] flex items-center justify-center font-serif font-bold text-sm">
                    B
                  </div>
                  <span className="font-serif text-xl font-bold text-[#292723]">
                    BEADS<span className="text-[#C6A66B]">SOURCE</span> LLC
                  </span>
                </div>
                <p className="text-xs text-[#8B8175]">Central International Logistics &amp; Fulfillment Center</p>
                <p className="text-xs text-[#8B8175]">Export Registration: EXP-INT-998241 &bull; IEC: 0714018291</p>
                <p className="text-xs text-[#8B8175]">Toll-Free: +1 (800) 555-0199 &bull; orders@beadssource.com</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-[#C6A66B] bg-[#FAF8F3] border border-[#EDE5D8] px-3 py-1 rounded-full uppercase">
                  {completedOrder.status || 'Processing'}
                </span>
                <p className="font-serif font-bold text-xl text-[#292723] mt-2">
                  Invoice #{completedOrder.id}
                </p>
                <p className="text-xs text-[#8B8175]">
                  Date: {new Date(completedOrder.date).toLocaleDateString()}
                </p>
                <p className="text-xs font-mono text-[#C6A66B] font-semibold">
                  Tracking: {completedOrder.trackingNumber}
                </p>
              </div>
            </div>

            {/* Bill To & Ship To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#40362F]">
              <div className="p-4 bg-[#FAF8F3] rounded-2xl border border-[#EDE5D8] space-y-1">
                <p className="font-bold text-[#8B8175] uppercase text-[10px] tracking-wider">
                  Wholesale Buyer Details
                </p>
                <p className="font-bold text-sm text-[#292723]">{completedOrder.customer?.name}</p>
                <p>{completedOrder.customer?.company}</p>
                <p>{completedOrder.customer?.email}</p>
                <p>{completedOrder.customer?.phone}</p>
                {completedOrder.customer?.taxId && <p>Tax ID / GSTIN: {completedOrder.customer?.taxId}</p>}
              </div>

              <div className="p-4 bg-[#FAF8F3] rounded-2xl border border-[#EDE5D8] space-y-1">
                <p className="font-bold text-[#8B8175] uppercase text-[10px] tracking-wider">
                  Shipping Destination
                </p>
                <p className="font-semibold text-[#292723]">{completedOrder.customer?.address}</p>
                <p>{completedOrder.customer?.city}, {completedOrder.customer?.state} {completedOrder.customer?.zip}</p>
                <p>{completedOrder.customer?.country}</p>
                <p className="font-semibold text-[#C6A66B] pt-1">
                  Courier: DHL Express Worldwide Priority
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-[#EDE5D8] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] border-b border-[#EDE5D8] text-[#292723] font-bold">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Product Description</th>
                    <th className="p-3 text-center">Qty (pk)</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE5D8]">
                  {completedOrder.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F3]">
                      <td className="p-3 font-mono text-[11px] text-[#8B8175]">{item.sku}</td>
                      <td className="p-3 font-medium text-[#292723]">{item.name}</td>
                      <td className="p-3 text-center font-bold text-[#292723]">{item.quantity}</td>
                      <td className="p-3 text-right text-[#8B8175]">{formatPrice(item.price)}</td>
                      <td className="p-3 text-right font-bold text-[#292723]">{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end text-xs text-[#40362F]">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#292723]">{formatPrice(completedOrder.subtotal)}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#C6A66B]">
                    <span>Coupon ({completedOrder.couponCode}):</span>
                    <span className="font-semibold">-{formatPrice(completedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Worldwide Courier:</span>
                  <span className="font-semibold text-[#292723]">
                    {completedOrder.shipping === 0 ? 'FREE' : formatPrice(completedOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#292723] pt-2 border-t border-[#EDE5D8]">
                  <span>Total Amount:</span>
                  <span className="font-serif">{formatPrice(completedOrder.total)}</span>
                </div>
                <div className="text-[10px] text-[#8B8175] text-right">
                  Payment: {completedOrder.paymentMethod} ({completedOrder.paymentStatus})
                </div>
              </div>
            </div>

            {/* Wire Transfer instructions if applicable */}
            <div className="p-4 bg-[#FAF8F3] rounded-2xl border border-[#EDE5D8] text-xs space-y-1.5 text-[#40362F]">
              <p className="font-bold text-[#292723]">Bank Remittance / TT Instructions for BeadsSource Export:</p>
              <p>Bank: International Commercial Banking Corporation &bull; Global Treasury Branch</p>
              <p>Beneficiary: BeadsSource Wholesale LLC Export Account &bull; Account No: 382910481920</p>
              <p>Routing / Swift Code: BSNUS33NYC</p>
              <p className="text-[10px] text-[#8B8175] pt-1">
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
    <div className="min-h-screen bg-[#FAF8F3] pb-24">
      
      {/* Banner */}
      <div className="bg-[#40362F] text-[#FAF8F3] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#52463D]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#C6A66B] font-semibold mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypted 256-Bit B2B Wholesale Checkout</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#FAF8F3]">
              Secure Wholesale Checkout
            </h1>
          </div>
          <button
            onClick={() => onNavigate('catalog', { category: 'all' })}
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#D8C49A] hover:text-[#C6A66B] transition-colors cursor-pointer"
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
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3.5 border-b border-[#EDE5D8]">
                <div className="w-8 h-8 rounded-full bg-[#40362F] text-[#C6A66B] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#292723]">
                    Wholesale Business &amp; Contact Information
                  </h3>
                  <p className="text-xs text-[#8B8175]">Invoices and tracking numbers will be issued to this business profile</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#40362F] mb-1">Authorized Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Authorized Purchasing Agent"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#40362F] mb-1">Company / Studio Name *</label>
                  <input
                    type="text"
                    required
                    value={customer.company}
                    onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                    placeholder="e.g. Vance Atelier Jewelry"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#40362F] mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="buyer@vanceatelier.com"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#40362F] mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="+1 (415) 890-2341"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#40362F] mb-1">GSTIN / Resale Certificate / Tax ID</label>
                  <input
                    type="text"
                    value={customer.taxId}
                    onChange={(e) => setCustomer({ ...customer, taxId: e.target.value })}
                    placeholder="e.g. EIN-94-382910 or 29AABCU9603R1ZX"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3.5 border-b border-[#EDE5D8]">
                <div className="w-8 h-8 rounded-full bg-[#40362F] text-[#C6A66B] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#292723]">
                    Shipping Destination Address
                  </h3>
                  <p className="text-xs text-[#8B8175]">Provide complete street address for DHL / FedEx air freight dispatch</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#40362F] mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="452 Post Street, Suite 4B"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#40362F] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="San Francisco"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#40362F] mb-1">State / Province *</label>
                    <input
                      type="text"
                      required
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      placeholder="CA"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-[#40362F] mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={customer.zip}
                      onChange={(e) => setCustomer({ ...customer, zip: e.target.value })}
                      placeholder="94102"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#40362F] mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={customer.country}
                    onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                    placeholder="United States / India / France"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3.5 border-b border-[#EDE5D8]">
                <div className="w-8 h-8 rounded-full bg-[#40362F] text-[#C6A66B] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#292723]">
                    Wholesale Payment Method
                  </h3>
                  <p className="text-xs text-[#8B8175]">Select preferred B2B settlement method</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {/* Option 1: Wire Transfer */}
                <label className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-colors ${
                  paymentMethod === 'wire_transfer' ? 'bg-[#FAF8F3] border-[#C6A66B]' : 'bg-white border-[#EDE5D8]'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="wire_transfer"
                    checked={paymentMethod === 'wire_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-[#C6A66B] focus:ring-[#C6A66B]"
                  />
                  <div>
                    <span className="font-bold text-[#292723] block text-sm">International Bank Wire / TT</span>
                    <span className="text-[#8B8175] text-[11px] block mt-0.5">
                      Direct telegraphic wire transfer to our international export account. Wire instructions generated on invoice.
                    </span>
                  </div>
                </label>

                {/* Option 2: UPI / Domestic Net Banking */}
                <label className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-colors ${
                  paymentMethod === 'upi' ? 'bg-[#FAF8F3] border-[#C6A66B]' : 'bg-white border-[#EDE5D8]'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-[#C6A66B] focus:ring-[#C6A66B]"
                  />
                  <div>
                    <span className="font-bold text-[#292723] block text-sm">UPI / Domestic Net Banking (India)</span>
                    <span className="text-[#8B8175] text-[11px] block mt-0.5">
                      Instant zero-surcharge settlement via Google Pay, PhonePe, Paytm or NEFT/RTGS.
                    </span>
                  </div>
                </label>

                {/* Option 3: Credit Card */}
                <label className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-colors ${
                  paymentMethod === 'card' ? 'bg-[#FAF8F3] border-[#C6A66B]' : 'bg-white border-[#EDE5D8]'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-[#C6A66B] focus:ring-[#C6A66B]"
                  />
                  <div>
                    <span className="font-bold text-[#292723] block text-sm">Visa / Mastercard / Amex (Secure B2B)</span>
                    <span className="text-[#8B8175] text-[11px] block mt-0.5">
                      Instant card verification through 3D Secure 2.0 encrypted merchant gateway.
                    </span>
                  </div>
                </label>
              </div>

              {/* Order Notes */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#40362F] mb-1">
                  Packing &amp; Dispatch Remarks (Optional)
                </label>
                <textarea
                  rows="2"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please label bags with SKU stickers or package for air shipment."
                  className="w-full p-3 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B] resize-none"
                />
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary & Confirmation Button */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#292723] pb-3.5 border-b border-[#EDE5D8]">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items scroll */}
              <div className="max-h-60 overflow-y-auto divide-y divide-[#EDE5D8] space-y-3 pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-white border border-[#EDE5D8] shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-[#292723] line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-[#8B8175] font-mono">
                        SKU: {item.sku} &bull; Qty: {item.quantity} pk
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#292723]">
                      {formatPrice((item.salePrice || item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations Breakdown */}
              <div className="pt-4 border-t border-[#EDE5D8] space-y-2 text-xs text-[#8B8175]">
                <div className="flex justify-between">
                  <span>Catalog Subtotal:</span>
                  <span className="font-semibold text-[#292723]">{formatPrice(rawSubtotal)}</span>
                </div>

                {tierSavings > 0 && (
                  <div className="flex justify-between text-[#C6A66B]">
                    <span>Wholesale Volume Tier Savings:</span>
                    <span className="font-bold">-{formatPrice(tierSavings)}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#C6A66B]">
                    <span>Coupon ({coupon?.code}):</span>
                    <span className="font-bold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Worldwide Courier Dispatch:</span>
                  <span className="font-semibold text-[#292723]">
                    {isFreeShipping ? <span className="text-[#C6A66B] font-bold">FREE</span> : formatPrice(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#292723] pt-3 border-t border-[#EDE5D8]">
                  <span>Total Due:</span>
                  <span className="text-lg font-serif">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#40362F] hover:bg-[#52463D] text-[#FAF8F3] text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4 border border-[#52463D]"
              >
                {loading ? (
                  <span>Generating Commercial Invoice...</span>
                ) : (
                  <>
                    <span>Confirm Wholesale Order &bull; {formatPrice(finalTotal)}</span>
                    <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
                  </>
                )}
              </button>

              <div className="pt-2 text-[11px] text-[#8B8175] text-center space-y-1">
                <p className="flex items-center justify-center gap-1.5 text-[#C6A66B] font-semibold">
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
