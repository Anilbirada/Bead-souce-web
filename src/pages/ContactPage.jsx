import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare,
  Building2,
  Globe2
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: 'Wholesale Catalog Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      {/* Banner */}
      <div className="bg-[#191919] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#2C2C2C] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-3 relative z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C49A3A] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Manufacturer Assistance</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Wholesale Customer Support &amp; Consultation
          </h1>
          <p className="text-xs sm:text-sm text-[#D8D2C4] max-w-lg mx-auto">
            Connect directly with our international wholesale support representatives and component specialists.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-[#E9E3D8] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#191919] pb-2 border-b border-[#F0EBE1]">
                International Operations &amp; Headquarters
              </h3>
              
              <div className="space-y-4 text-xs text-[#524B3E]">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-[#8C6D2B] shrink-0 border border-[#E9E3D8]">
                    <Building2 className="w-4 h-4 text-[#C49A3A]" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#191919]">BeadsSource Wholesale LLC</strong>
                    <span>Central International Logistics &amp; Distribution Operations</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-[#8C6D2B] shrink-0 border border-[#E9E3D8]">
                    <Phone className="w-4 h-4 text-[#C49A3A]" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#191919]">Direct Wholesale Desk</strong>
                    <span>+1 (800) 555-0199 (Toll-Free International Support)</span>
                    <span className="block text-gray-400 text-[11px]">Support Desk: orders@beadssource.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-[#8C6D2B] shrink-0 border border-[#E9E3D8]">
                    <Mail className="w-4 h-4 text-[#C49A3A]" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#191919]">Email Support</strong>
                    <span>wholesale@beadssource.com</span>
                    <span className="block text-gray-400 text-[11px]">inquiries@beadssource.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-[#8C6D2B] shrink-0 border border-[#E9E3D8]">
                    <Clock className="w-4 h-4 text-[#C49A3A]" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#191919]">Support Operating Hours</strong>
                    <span>Monday &ndash; Friday: 8:00 AM &ndash; 6:00 PM EST</span>
                    <span className="block text-gray-400 text-[11px]">24/7 Priority Email Assistance for Verified Wholesale Accounts</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#F8F6F1] rounded-3xl border border-[#E9E3D8] text-xs space-y-2 text-[#5A5346]">
              <div className="flex items-center gap-2 text-[#8C6D2B] font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#C49A3A]" />
                <span>Wholesale Account Sourcing</span>
              </div>
              <p className="leading-relaxed">
                Wholesale buyers and international designers are warmly invited to schedule a dedicated B2B account consultation with our gemstone and component sourcing specialists.
              </p>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-[#E9E3D8] shadow-xs space-y-6">
              
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#191919]">Send an Official Inquiry</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Our wholesale export specialists review all inquiries and respond within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-[#F8F6F1] rounded-2xl border border-[#E9E3D8] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-[#191919]">Inquiry Received</h4>
                  <p className="text-xs text-[#6B6557] max-w-sm mx-auto leading-relaxed">
                    Thank you. Your message has been routed to our B2B export desk. A representative will contact you with product specifications and price lists.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        subject: 'Wholesale Catalog Inquiry',
                        message: ''
                      });
                    }}
                    className="mt-3 px-4 py-2 bg-[#191919] text-white text-xs font-semibold rounded-xl"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#303030] mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Authorized Contact"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C49A3A] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#303030] mb-1">Company / Studio Name</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Fine Jewelry Atelier LLC"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C49A3A] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#303030] mb-1">Business Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="purchasing@company.com"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C49A3A] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#303030] mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C49A3A] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#303030] mb-1">Inquiry Topic</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C49A3A] focus:bg-white cursor-pointer"
                    >
                      <option value="Wholesale Catalog Inquiry">Wholesale Catalog &amp; Pricing Request</option>
                      <option value="Custom RFQ Quotation">Custom Production &amp; Tooling RFQ</option>
                      <option value="Order Tracking & Logistics">Order Tracking &amp; Air Courier Status</option>
                      <option value="Material & Compliance Verification">CPSIA / REACH Compliance Certificate Inquiry</option>
                      <option value="General Business Partnership">General Wholesale Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#303030] mb-1">Detailed Message *</label>
                    <textarea
                      rows="4"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please mention specific product SKUs, target volumes, or custom specification requirements..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C49A3A] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#191919] hover:bg-[#303030] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#191919]"
                  >
                    <Send className="w-4 h-4 text-[#C49A3A]" />
                    <span>{loading ? 'Transmitting...' : 'Submit Wholesale Inquiry'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
