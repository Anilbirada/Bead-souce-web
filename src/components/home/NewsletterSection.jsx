import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Tag, ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid wholesale business email address.');
      return;
    }
    setError('');
    setIsSubmitted(true);
  };

  return (
    <section className="py-14 md:py-20 bg-white border-b border-[#E9E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-[#F8F6F1] to-[#EFEBE1] rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#E9E5DC] shadow-sm relative overflow-hidden">
          
          {/* Subtle accent circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#176B68]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#C3A36B]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center relative z-10 space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E9E5DC] text-[#176B68] text-xs font-semibold shadow-xs">
              <Tag className="w-3.5 h-3.5 text-[#C3A36B]" />
              <span>VIP Wholesale Access • Instant 10% Coupon</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#191F23]">
              Subscribe to the BeadsSource Trade Gazette
            </h2>

            <p className="text-xs sm:text-sm text-[#657078] leading-relaxed">
              Receive advance notifications on newly cut natural gemstone lots, factory production overruns, container discounts, and seasonal color forecasts.
            </p>

            {isSubmitted ? (
              <div className="p-6 bg-white rounded-2xl border border-emerald-200 shadow-sm space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#191F23]">
                  Welcome to BeadsSource Trade Network!
                </h3>
                <p className="text-xs text-[#657078]">
                  Your VIP subscription has been confirmed for <strong>{email}</strong>. Use your instant welcome coupon code during checkout:
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] border border-dashed border-[#C3A36B] rounded-xl text-sm font-mono font-bold text-[#176B68]">
                  <span>WHOLESALE10</span>
                  <span className="text-[10px] text-gray-500 font-sans font-normal">(10% off any catalog order)</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="pt-4 max-w-md mx-auto space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter business email address..."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#DDD6C8] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#176B68] shadow-xs"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#176B68] hover:bg-[#125250] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4 text-[#C3A36B]" />
                  </button>
                </div>

                {error && (
                  <p className="text-[11px] text-red-600 font-medium">{error}</p>
                )}

                <p className="text-[11px] text-[#8A8172]">
                  We respect your privacy. No spam. You may unsubscribe at any time with one click.
                </p>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
