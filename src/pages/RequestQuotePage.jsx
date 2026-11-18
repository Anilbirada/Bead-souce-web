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
      <div className="min-h-screen bg-[#FAF8F3] py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#EDE5D8] shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#FAF8F3] border border-[#EDE5D8] text-[#C6A66B] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A66B]">
              RFQ Request Received &bull; Under Review
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#292723] mt-2">
              Quotation Request #{submittedQuote.id}
            </h1>
            <p className="text-xs sm:text-sm text-[#8B8175] mt-2.5 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-[#292723]">{customer.name}</strong>. Your wholesale quotation request has been forwarded directly to our Senior Sourcing &amp; Production Desk.
            </p>
          </div>

          <div className="bg-[#FAF8F3] p-6 rounded-2xl border border-[#EDE5D8] text-left text-xs space-y-3">
            <div className="flex justify-between">
              <span className="text-[#8B8175]">Company:</span>
              <span className="font-semibold text-[#292723]">{customer.company || 'Artisan Studio'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B8175]">Products Included:</span>
              <span className="font-semibold text-[#292723]">{submittedQuote.items?.length || 0} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B8175]">Target Delivery:</span>
              <span className="font-semibold text-[#292723]">{targetDeliveryDate || 'Within 30 Days'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8B8175]">Status:</span>
              <span className="font-bold text-[#C6A66B] bg-white px-2.5 py-0.5 rounded-full border border-[#EDE5D8] text-[11px]">
                Under Review
              </span>
            </div>
          </div>

          <p className="text-xs text-[#8B8175]">
            Our team typically reviews and replies with custom wholesale volume pricing within 12-24 business hours.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 bg-[#40362F] hover:bg-[#52463D] text-[#FAF8F3] text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              View in My Dashboard
            </button>
            <button
              onClick={() => { setSubmittedQuote(null); onNavigate('catalog', { category: 'all' }); }}
              className="px-6 py-3.5 bg-white text-[#40362F] border border-[#EDE5D8] hover:border-[#C6A66B] text-xs font-semibold rounded-xl hover:bg-[#FAF8F3] transition-colors cursor-pointer"
            >
              Back to Catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] pb-24">
      
      {/* Banner */}
      <div className="bg-[#40362F] text-[#FAF8F3] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#52463D]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#52463D] border border-[#EDE5D8]/20 text-[#D8C49A] text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Dedicated Wholesale RFQ System</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF8F3]">
            Request a Wholesale Bulk Quotation
          </h1>
          <p className="text-xs sm:text-sm text-[#EDE5D8] mt-2.5 max-w-2xl leading-relaxed">
            Need customized gemstone specifications, special drill hole sizes, OEM casting, or container-level volume pricing? Add items to your quotation list and our wholesale sourcing team will provide a tailored quote.
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
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-[#EDE5D8]">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#292723]">
                    Quotation Line Items ({quoteItems.length})
                  </h2>
                  <p className="text-xs text-[#8B8175]">Adjust target quantities and desired wholesale unit prices</p>
                </div>
                {quoteItems.length > 0 && (
                  <button
                    type="button"
                    onClick={clearQuote}
                    className="text-xs text-red-600 font-semibold hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {quoteItems.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#FAF8F3] mx-auto flex items-center justify-center text-[#8B8175] border border-[#EDE5D8]">
                    <PackageSearch className="w-8 h-8 text-[#C6A66B]" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#292723]">No Products in RFQ Builder</h3>
                  <p className="text-xs text-[#8B8175] max-w-sm mx-auto">
                    Browse our catalogue and click "Request a Quote" on any product to add it to this quotation builder.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('catalog', { category: 'all' })}
                    className="px-6 py-3 bg-[#40362F] text-[#FAF8F3] text-xs font-bold rounded-xl hover:bg-[#52463D] transition-colors mt-2 cursor-pointer shadow-sm"
                  >
                    Browse Wholesale Catalogue
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#EDE5D8] space-y-4 pt-1">
                  {quoteItems.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-white border border-[#EDE5D8] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-[#292723] line-clamp-1">{item.name}</h4>
                            <button
                              type="button"
                              onClick={() => removeFromQuote(item.id)}
                              className="text-[#8B8175] hover:text-red-600 p-1 cursor-pointer transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="font-mono text-[10px] text-[#8B8175]">SKU: {item.sku}</p>
                          <p className="text-[11px] text-[#014b92] font-semibold">
                            Wholesale Component &bull; Custom Target Rate on RFQ
                          </p>
                        </div>
                      </div>

                      {/* Line Item Inputs: Target Qty & Target Price */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-[#FAF8F3] p-3.5 rounded-2xl border border-[#EDE5D8] text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-[#8B8175] uppercase tracking-wider mb-1">
                            Target Quantity (pk) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.requestedQty}
                            onChange={(e) => updateQuoteItem(item.id, 'requestedQty', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 bg-white border border-[#EDE5D8] rounded-xl text-xs font-bold text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#8B8175] uppercase tracking-wider mb-1">
                            Target Price / pk ($)
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            value={item.targetPrice || ''}
                            onChange={(e) => updateQuoteItem(item.id, 'targetPrice', parseFloat(e.target.value) || item.catalogPrice)}
                            className="w-full px-3 py-2 bg-white border border-[#EDE5D8] rounded-xl text-xs font-bold text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                          />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-bold text-[#8B8175] uppercase tracking-wider mb-1">
                            Remarks / Finish
                          </label>
                          <input
                            type="text"
                            value={item.notes || ''}
                            onChange={(e) => updateQuoteItem(item.id, 'notes', e.target.value)}
                            placeholder="e.g. Antique Silver"
                            className="w-full px-3 py-2 bg-white border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Notes / Specific requirements */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-base text-[#292723]">
                Additional Project Remarks &amp; Specifications
              </h3>
              <textarea
                rows="4"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Mention any OEM casting requirements, specific Pantone mineral colors, custom packaging or delivery urgency..."
                className="w-full p-3.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-2xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B] resize-none"
              />
            </div>

          </div>

          {/* Right Column: Customer Details & Submission Form */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-4">
              <div className="pb-3.5 border-b border-[#EDE5D8]">
                <h3 className="font-serif font-bold text-lg text-[#292723]">
                  Wholesale Buyer Credentials
                </h3>
                <p className="text-xs text-[#8B8175]">Your contact details for the formal price quotation</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#40362F] mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8B8175] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Authorized Business Representative"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#40362F] mb-1">Company / Studio Name *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#8B8175] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customer.company}
                      onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                      placeholder="e.g. Vance Atelier Jewelry"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#40362F] mb-1">Email *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-[#8B8175] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="buyer@brand.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#40362F] mb-1">Phone / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-[#8B8175] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+1 / +91..."
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#40362F] mb-1">Country</label>
                    <input
                      type="text"
                      value={customer.country}
                      onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#40362F] mb-1">GSTIN / Tax ID</label>
                    <input
                      type="text"
                      value={customer.taxId}
                      onChange={(e) => setCustomer({ ...customer, taxId: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-[#40362F] mb-1">Target Delivery Date</label>
                    <input
                      type="date"
                      value={targetDeliveryDate}
                      onChange={(e) => setTargetDeliveryDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#40362F] mb-1">Target Total Budget</label>
                    <input
                      type="text"
                      value={targetBudget}
                      onChange={(e) => setTargetBudget(e.target.value)}
                      placeholder="e.g. $2,500 USD"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || quoteItems.length === 0}
                  className="w-full py-4 bg-[#40362F] hover:bg-[#52463D] disabled:opacity-50 text-[#FAF8F3] text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4 border border-[#52463D]"
                >
                  {loading ? (
                    <span>Submitting Quotation Request...</span>
                  ) : (
                    <>
                      <span>Submit Request for Quotation ({quoteItems.length} Items)</span>
                      <Send className="w-4 h-4 text-[#C6A66B]" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#8B8175] text-center pt-2">
                  🔒 Strictly confidential. Your quotation request is reviewed exclusively by our verified B2B wholesale management.
                </p>
              </div>

            </div>

            {/* Help Callout */}
            <div className="p-6 bg-[#FAF8F3] rounded-3xl border border-[#EDE5D8] text-xs text-[#8B8175] space-y-2">
              <div className="flex items-center gap-2 text-[#C6A66B] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Need Urgent Assistance?</span>
              </div>
              <p className="leading-relaxed text-[#40362F]">
                For immediate large container inquiries or custom casting tooling specifications, contact our wholesale support desk:
              </p>
              <p className="font-bold text-[#292723]">
                Toll-Free Support: +1 (800) 555-0199 &bull; wholesale@beadssource.com
              </p>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
