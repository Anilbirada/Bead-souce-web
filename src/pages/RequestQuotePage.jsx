import React, { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  Plus, 
  Send, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  PackageSearch
} from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function RequestQuotePage({ onNavigate }) {
  const { quoteItems, removeFromQuote, updateQuoteItem, clearQuote, submitQuote } = useQuote();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [customer, setCustomer] = useState({
    name: user ? user.name : '',
    company: user ? user.company : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    country: 'United States',
    taxId: user ? user.taxId : '',
    businessType: 'Jewelry Designer / Studio'
  });

  const [targetDeliveryDate, setTargetDeliveryDate] = useState('');
  const [targetBudget, setTargetBudget] = useState('');
  const [comments, setComments] = useState('');
  const [submittedQuote, setSubmittedQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quoteItems.length === 0) {
      setError('Please add at least one wholesale product to your quotation request.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await submitQuote({
      customer,
      targetDeliveryDate: targetDeliveryDate || 'Flexible',
      targetBudget: targetBudget || 'Competitive Wholesale',
      comments
    });

    setLoading(false);

    if (res.success) {
      setSubmittedQuote(res.quote);
    } else {
      setError(res.error || 'Failed to submit quotation. Please check details.');
    }
  };

  if (submittedQuote) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE4D5] shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D2B]">
              RFQ Request Received
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-1">
              Quotation Request #{submittedQuote.id}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6557] mt-2 max-w-md mx-auto">
              Thank you, <strong>{customer.name}</strong>. Your quotation request has been forwarded directly to Ramesh Sir and our SP Bengaluru wholesale desk.
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE4D5] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Company:</span>
              <span className="font-semibold">{customer.company || 'Artisan Studio'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Products Included:</span>
              <span className="font-semibold">{submittedQuote.items?.length || 0} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Target Delivery:</span>
              <span className="font-semibold">{targetDeliveryDate || 'Within 30 Days'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="font-bold text-[#967117] bg-[#FDF9EE] px-2 py-0.5 rounded border border-[#E9DDC0]">
                Under Review
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Our team typically reviews and replies with custom wholesale volume pricing within 12-24 business hours.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 bg-[#1C1A17] text-white text-xs font-bold rounded-xl hover:bg-[#332E26] transition-colors"
            >
              View in My Dashboard
            </button>
            <button
              onClick={() => { setSubmittedQuote(null); onNavigate('catalog', { category: 'all' }); }}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      
      {/* Banner */}
      <div className="bg-[#1C1A17] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#383327]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#302B23] border border-[#4D4537] text-[#E6C687] text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Dedicated Wholesale RFQ System</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Request a Wholesale Bulk Quotation
          </h1>
          <p className="text-xs sm:text-sm text-[#C9C3B4] mt-2 max-w-2xl leading-relaxed">
            Need customized gemstone specifications, special drill hole sizes, OEM casting, or container-level volume pricing? Add items to your quotation list and our SP Bengaluru team will provide a tailored quote.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Products in Quotation */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#1A1A1A]">
                    Quotation Line Items ({quoteItems.length})
                  </h2>
                  <p className="text-xs text-[#736B5E]">Adjust target quantities and desired wholesale unit prices</p>
                </div>
                {quoteItems.length > 0 && (
                  <button
                    type="button"
                    onClick={clearQuote}
                    className="text-xs text-red-600 font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {quoteItems.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#FAF8F5] mx-auto flex items-center justify-center text-gray-400 border border-[#EAE4D5]">
                    <PackageSearch className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">No Products in RFQ Builder</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Browse our catalogue and click "Request a Quote" on any product to add it to this quotation builder.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('catalog', { category: 'all' })}
                    className="px-5 py-2.5 bg-[#1C1A17] text-[#D4AF37] text-xs font-bold rounded-xl hover:bg-[#332E26] transition-colors mt-2"
                  >
                    Browse Wholesale Catalogue
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#F2ECE1] space-y-4 pt-1">
                  {quoteItems.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-white border border-[#EAE4D5] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-[#1A1A1A] line-clamp-1">{item.name}</h4>
                            <button
                              type="button"
                              onClick={() => removeFromQuote(item.id)}
                              className="text-gray-400 hover:text-red-600 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="font-mono text-[10px] text-gray-500">SKU: {item.sku}</p>
                          <p className="text-[11px] text-gray-600">
                            Standard Catalog Price: <strong>{formatPrice(item.catalogPrice)}</strong> / pk
                          </p>
                        </div>
                      </div>

                      {/* Line Item Inputs: Target Qty & Target Price */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE4D5] text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">
                            Target Quantity (pk) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.requestedQty}
                            onChange={(e) => updateQuoteItem(item.id, 'requestedQty', parseInt(e.target.value) || 1)}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#DDD6C8] rounded-lg text-xs font-bold focus:outline-none focus:border-[#C4A052]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">
                            Target Price / pk ($)
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            value={item.targetPrice || ''}
                            onChange={(e) => updateQuoteItem(item.id, 'targetPrice', parseFloat(e.target.value) || item.catalogPrice)}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#DDD6C8] rounded-lg text-xs font-bold focus:outline-none focus:border-[#C4A052]"
                          />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">
                            Remarks / Finish
                          </label>
                          <input
                            type="text"
                            value={item.notes || ''}
                            onChange={(e) => updateQuoteItem(item.id, 'notes', e.target.value)}
                            placeholder="e.g. Antique Silver"
                            className="w-full px-2.5 py-1.5 bg-white border border-[#DDD6C8] rounded-lg text-xs focus:outline-none focus:border-[#C4A052]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Notes / Specific requirements */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
                Additional Project Remarks &amp; Specifications
              </h3>
              <textarea
                rows="4"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Mention any OEM casting requirements, specific Pantone mineral colors, custom packaging or delivery urgency..."
                className="w-full p-3 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
              />
            </div>

          </div>

          {/* Right Column: Customer Details & Submission Form */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
              <div className="pb-3 border-b border-[#F0EBE1]">
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
                  Wholesale Buyer Credentials
                </h3>
                <p className="text-xs text-[#736B5E]">Your contact details for the formal price quotation</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Ramesh Sir / Eleanor Vance"
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Company / Studio Name *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customer.company}
                      onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                      placeholder="e.g. Vance Atelier Jewelry"
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#3D372E] mb-1">Email *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="buyer@brand.com"
                        className="w-full pl-8 pr-2 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3D372E] mb-1">Phone / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+1 / +91..."
                        className="w-full pl-8 pr-2 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#3D372E] mb-1">Country</label>
                    <input
                      type="text"
                      value={customer.country}
                      onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3D372E] mb-1">GSTIN / Tax ID</label>
                    <input
                      type="text"
                      value={customer.taxId}
                      onChange={(e) => setCustomer({ ...customer, taxId: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-[#3D372E] mb-1">Target Delivery Date</label>
                    <input
                      type="date"
                      value={targetDeliveryDate}
                      onChange={(e) => setTargetDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3D372E] mb-1">Target Total Budget</label>
                    <input
                      type="text"
                      value={targetBudget}
                      onChange={(e) => setTargetBudget(e.target.value)}
                      placeholder="e.g. $2,500 USD"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || quoteItems.length === 0}
                  className="w-full py-4 bg-[#1C1A17] hover:bg-[#332E26] disabled:opacity-50 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {loading ? (
                    <span>Submitting Quotation Request...</span>
                  ) : (
                    <>
                      <span>Submit Request for Quotation ({quoteItems.length} Items)</span>
                      <Send className="w-4 h-4 text-[#D4AF37]" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-500 text-center pt-2">
                  🔒 Strictly confidential. Your quotation request is sent directly to Ramesh Sir's export desk.
                </p>
              </div>

            </div>

            {/* Help Callout */}
            <div className="p-5 bg-[#FAF7F0] rounded-3xl border border-[#EBE4D5] text-xs text-[#5C5547] space-y-2">
              <div className="flex items-center gap-2 text-[#8C6D2B] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Need Urgent Assistance?</span>
              </div>
              <p className="leading-relaxed">
                For immediate large container orders or custom casting tooling questions, contact Ramesh Sir directly at our SP Road Bengaluru showroom:
              </p>
              <p className="font-bold text-[#1A1A1A]">
                WhatsApp / Call: +91 98450 12399 &bull; info@beadssource.com
              </p>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
