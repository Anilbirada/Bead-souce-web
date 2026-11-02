import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Wholesale Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      {/* Banner */}
      <div className="bg-[#1C1A17] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#383227] text-center">
        <div className="max-w-3xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            Direct Manufacturer Communication
          </span>
          <h1 className="font-serif text-4xl font-bold text-white">
            Contact BeadsSource Showroom &amp; Export Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#D8D2C4] max-w-lg mx-auto">
            Connect directly with Ramesh Sir and our Bengaluru wholesale representatives.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#1A1A1A] pb-2 border-b border-[#F0EBE1]">
                Bengaluru Showroom &bull; Headquarters
              </h3>
              
              <div className="space-y-4 text-xs text-[#524B3E]">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF5E8] flex items-center justify-center text-[#8C6D2B] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#1A1A1A]">BeadsSource LLC Flagship</strong>
                    <span>SP Road Commercial District, Bengaluru, Karnataka 560002, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF5E8] flex items-center justify-center text-[#8C6D2B] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#1A1A1A]">Direct Wholesale Desk</strong>
                    <span>+91 98450 12399 (WhatsApp &bull; Ramesh Sir)</span>
                    <span className="block text-gray-400 text-[11px]">Showroom: +91 80 2220 8910</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF5E8] flex items-center justify-center text-[#8C6D2B] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#1A1A1A]">Email Support</strong>
                    <span>wholesale@beadssource.com</span>
                    <span className="block text-gray-400 text-[11px]">inquiries@beadssource.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF5E8] flex items-center justify-center text-[#8C6D2B] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#1A1A1A]">Showroom Hours</strong>
                    <span>Monday &ndash; Saturday: 10:00 AM &ndash; 7:30 PM IST</span>
                    <span className="block text-gray-400 text-[11px]">Sunday: Showroom visits by appointment</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#FAF7F0] rounded-3xl border border-[#EBE4D5] text-xs space-y-2 text-[#5A5346]">
              <div className="flex items-center gap-2 text-[#8C6D2B] font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Visiting SP Bengaluru?</span>
              </div>
              <p className="leading-relaxed">
                Wholesale buyers and international designers traveling to Bangalore are warmly invited to inspect raw gemstone roughs, calibrated beads, and pewter molds in person.
              </p>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-6">
              
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#1A1A1A]">Send an Inquiry</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Have a question about custom cuts, shipping freight, or showroom appointments?
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-[#F4F9EE] border border-[#D5EAC8] rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                  <h4 className="font-serif font-bold text-xl text-green-900">Message Received</h4>
                  <p className="text-xs text-green-800 max-w-sm mx-auto">
                    Thank you, <strong>{formData.name}</strong>. Your message has been routed to our SP Bengaluru wholesale desk. We will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', company: '', subject: 'Wholesale Inquiry', message: '' }); }}
                    className="px-4 py-2 bg-white text-green-900 text-xs font-semibold rounded-lg border border-green-300 mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#3D372E] mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#3D372E] mb-1">Company / Studio</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Vance Atelier Jewelry"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#3D372E] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="buyer@brand.com"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#3D372E] mb-1">Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 / +1..."
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3D372E] mb-1">Inquiry Topic</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C4A052]"
                    >
                      <option value="Wholesale Pricing">Bulk Volume Discount Inquiry</option>
                      <option value="Custom OEM Casting">Custom OEM Casting &amp; Tooling</option>
                      <option value="Showroom Visit">Bengaluru SP Road Showroom Appointment</option>
                      <option value="Shipping & Logistics">International Courier &amp; Export Documentation</option>
                      <option value="Other">General Wholesale Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3D372E] mb-1">Message *</label>
                    <textarea
                      rows="4"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify product types, target quantities, or delivery expectations..."
                      className="w-full p-3 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1C1A17] hover:bg-[#332E26] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Transmit Message to Ramesh Sir</span>
                    <Send className="w-4 h-4 text-[#D4AF37]" />
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
