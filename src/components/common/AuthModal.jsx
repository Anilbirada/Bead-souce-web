import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Building2, 
  User, 
  Phone, 
  FileBadge, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Gem,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    register, 
    loading 
  } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    phone: '',
    taxId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const [error, setError] = useState(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (authModalMode === 'login') {
      const res = await login(formData.email, formData.password);
      if (!res.success) setError(res.error || 'Invalid credentials. Please verify your email and password.');
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please complete all required fields marked with *');
        return;
      }
      const res = await register(formData);
      if (!res.success) setError(res.error || 'Registration could not be completed. Please try again.');
    }
  };

  const fillQuickDemo = (role) => {
    setError(null);
    setAuthModalMode('login');
    if (role === 'admin') {
      setFormData({
        email: 'admin@beadssource.com',
        password: 'admin',
        name: '',
        company: '',
        phone: '',
        taxId: ''
      });
    } else if (role === 'manager') {
      setFormData({
        email: 'manager@beadssource.com',
        password: 'manager',
        name: '',
        company: '',
        phone: '',
        taxId: ''
      });
    } else {
      setFormData({
        email: 'buyer@boutiquejewels.com',
        password: 'buyer',
        name: '',
        company: '',
        phone: '',
        taxId: ''
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto font-['Manrope',sans-serif]">
      {/* Backdrop with frosted blur */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={() => setAuthModalOpen(false)}
      />

      {/* Modern Two-Column Luxury Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#EDE5D8] overflow-hidden z-10 animate-fade-in my-auto">
        
        {/* Floating Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-[#F0E8D9] text-[#40362F] hover:text-[#C6A66B] flex items-center justify-center transition-all shadow-xs cursor-pointer border border-[#EDE5D8]"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-12 min-h-[580px]">
          
          {/* LEFT COLUMN: Atelier Brand Storytelling & B2B VIP Perks (5 Cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#1C1815] via-[#2A231E] to-[#141210] text-[#FAF8F3] p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            
            {/* Ambient Background Glow Elements */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#C6A66B]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Block */}
            <div className="relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C6A66B] to-[#B99A5B] flex items-center justify-center text-[#1C1815] font-serif font-bold text-lg shadow-sm">
                  B
                </div>
                <div>
                  <span className="font-serif font-bold text-lg tracking-wider text-[#FAF8F3] block leading-none">
                    BEADSSOURCE
                  </span>
                  <span className="text-[10px] tracking-widest text-[#C6A66B] uppercase font-semibold">
                    Wholesale Atelier
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C6A66B]/20 border border-[#C6A66B]/40 text-[#C6A66B] text-[10.5px] font-bold uppercase tracking-wider mt-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified B2B Trade Portal</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF8F3] mt-4 leading-snug">
                Direct Manufacturer Wholesale Sourcing
              </h2>
              <p className="text-xs text-[#EDE5D8]/80 mt-2 leading-relaxed">
                Reserved exclusively for retail jewelers, independent designers, studios, and international wholesale distributors.
              </p>

              {/* VIP Benefits Checklist */}
              <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
                <div className="flex items-start gap-2.5 text-xs text-[#EDE5D8]">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">Tier Volume Discounts:</strong>
                    <span className="text-white/70 block text-[11.5px]">Save up to 30% on bulk lots and manufacturer cartons.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-[#EDE5D8]">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">Certified Natural Minerals:</strong>
                    <span className="text-white/70 block text-[11.5px]">Genuine gemstones, turquoise, and lead-free pewter charms.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-[#EDE5D8]">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">Fast Bespoke RFQ Quotations:</strong>
                    <span className="text-white/70 block text-[11.5px]">Submit custom quantity requests with formal 24h review.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security / Trust Footer */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 text-[11px] text-[#EDE5D8]/70 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#C6A66B]" />
                ISO-9001 Certified Supplier
              </span>
              <span>🔒 256-Bit SSL</span>
            </div>

          </div>

          {/* RIGHT COLUMN: Modern, Streamlined Auth Form (7 Cols) */}
          <div className="md:col-span-7 bg-[#FAF8F3] p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            
            <div>
              {/* Header Tab Switcher */}
              <div className="flex items-center gap-6 border-b border-[#EDE5D8] pb-3 mb-6">
                <button
                  type="button"
                  onClick={() => { setError(null); setAuthModalMode('login'); }}
                  className={`text-sm font-bold tracking-wide transition-all relative pb-3 -mb-3 cursor-pointer ${
                    authModalMode === 'login'
                      ? 'text-[#1C1815] border-b-2 border-[#C6A66B]'
                      : 'text-[#766D62] hover:text-[#1C1815]'
                  }`}
                >
                  Wholesale Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setError(null); setAuthModalMode('register'); }}
                  className={`text-sm font-bold tracking-wide transition-all relative pb-3 -mb-3 cursor-pointer ${
                    authModalMode === 'register'
                      ? 'text-[#1C1815] border-b-2 border-[#C6A66B]'
                      : 'text-[#766D62] hover:text-[#1C1815]'
                  }`}
                >
                  Create B2B Account
                </button>
              </div>

              {/* Form Title & Subtitle */}
              <div className="mb-5">
                <h3 className="text-lg font-serif font-bold text-[#1C1815]">
                  {authModalMode === 'login' ? 'Welcome Back to Your Wholesale Portal' : 'Register Your Jewelry Business'}
                </h3>
                <p className="text-xs text-[#766D62] mt-0.5">
                  {authModalMode === 'login'
                    ? 'Enter your registered email and password to access trade pricing.'
                    : 'Fill out your business details for instant wholesale catalogue access.'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Registration Fields */}
                {authModalMode === 'register' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#40362F] mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#766D62] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Authorized Buyer Name"
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EDE5D8] rounded-xl text-xs text-[#1C1815] placeholder-[#766D62]/60 focus:outline-none focus:border-[#C6A66B] focus:ring-2 focus:ring-[#C6A66B]/20 transition-all shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#40362F] mb-1">
                          Company / Brand Name
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-[#766D62] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Jewelry Brand or Boutique"
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EDE5D8] rounded-xl text-xs text-[#1C1815] placeholder-[#766D62]/60 focus:outline-none focus:border-[#C6A66B] focus:ring-2 focus:ring-[#C6A66B]/20 transition-all shadow-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#40362F] mb-1">
                          Phone / WhatsApp
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#766D62] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EDE5D8] rounded-xl text-xs text-[#1C1815] placeholder-[#766D62]/60 focus:outline-none focus:border-[#C6A66B] focus:ring-2 focus:ring-[#C6A66B]/20 transition-all shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#40362F] mb-1">
                          Tax ID / Resale License
                        </label>
                        <div className="relative">
                          <FileBadge className="w-4 h-4 text-[#766D62] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={formData.taxId}
                            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                            placeholder="Optional resale number"
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EDE5D8] rounded-xl text-xs text-[#1C1815] placeholder-[#766D62]/60 focus:outline-none focus:border-[#C6A66B] focus:ring-2 focus:ring-[#C6A66B]/20 transition-all shadow-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-[#40362F] mb-1">
                    Business Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#766D62] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="buyer@yourjewelrybrand.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EDE5D8] rounded-xl text-xs text-[#1C1815] placeholder-[#766D62]/60 focus:outline-none focus:border-[#C6A66B] focus:ring-2 focus:ring-[#C6A66B]/20 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-[#40362F] mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#766D62] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#EDE5D8] rounded-xl text-xs text-[#1C1815] placeholder-[#766D62]/60 focus:outline-none focus:border-[#C6A66B] focus:ring-2 focus:ring-[#C6A66B]/20 transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#766D62] hover:text-[#1C1815] p-1 cursor-pointer transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Help Options */}
                {authModalMode === 'login' && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-[#766D62] hover:text-[#1C1815]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-[#EDE5D8] text-[#C6A66B] focus:ring-[#C6A66B]"
                      />
                      <span>Remember credentials</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        alert('Password reset instructions will be sent to your registered business email address.');
                      }}
                      className="text-[#C6A66B] hover:text-[#B99A5B] font-semibold transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#1C1815] via-[#2A231E] to-[#1C1815] hover:from-[#2E2823] hover:to-[#1C1815] text-[#FAF8F3] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-3 border border-[#40362F]/40"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#C6A66B] border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Wholesale Account...</span>
                    </div>
                  ) : (
                    <>
                      <span>{authModalMode === 'login' ? 'Sign In to Wholesale Portal' : 'Submit Wholesale Application'}</span>
                      <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Section: Discreet Demo Quick-Fill Drawer for Testing & Mode Toggle */}
            <div className="pt-4 mt-4 border-t border-[#EDE5D8]">
              
              {/* Bottom Mode Switch Link */}
              <div className="text-center text-xs text-[#766D62] mb-3">
                {authModalMode === 'login' ? (
                  <span>
                    New wholesale buyer?{' '}
                    <button
                      type="button"
                      onClick={() => { setError(null); setAuthModalMode('register'); }}
                      className="text-[#C6A66B] hover:text-[#B99A5B] font-bold underline cursor-pointer ml-1"
                    >
                      Create a Wholesale Account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered with us?{' '}
                    <button
                      type="button"
                      onClick={() => { setError(null); setAuthModalMode('login'); }}
                      className="text-[#C6A66B] hover:text-[#B99A5B] font-bold underline cursor-pointer ml-1"
                    >
                      Sign In Here
                    </button>
                  </span>
                )}
              </div>

              {/* Discreet Collapsible Demo Roles (Preserves 1-click test fill without cluttering user interface) */}
              <div className="bg-white rounded-xl border border-[#EDE5D8] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                  className="w-full px-3 py-2 flex items-center justify-between text-[11px] text-[#766D62] hover:text-[#1C1815] hover:bg-[#F0E8D9]/40 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3 h-3 text-[#C6A66B]" />
                    <span>Demo &amp; Testing Accounts Quick-Fill</span>
                  </span>
                  {showDemoCredentials ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#766D62]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#766D62]" />
                  )}
                </button>

                {showDemoCredentials && (
                  <div className="p-2.5 pt-0 border-t border-[#EDE5D8]/60 bg-[#FAF8F3]/60 flex flex-wrap gap-2 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => fillQuickDemo('buyer')}
                      className="px-2.5 py-1 bg-white border border-[#EDE5D8] hover:border-[#C6A66B] rounded-lg text-[10.5px] font-semibold text-[#40362F] hover:text-[#C6A66B] cursor-pointer shadow-xs transition-colors"
                    >
                      💎 Wholesale Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => fillQuickDemo('admin')}
                      className="px-2.5 py-1 bg-white border border-[#EDE5D8] hover:border-[#C6A66B] rounded-lg text-[10.5px] font-semibold text-[#C6A66B] cursor-pointer shadow-xs transition-colors"
                    >
                      👑 Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillQuickDemo('manager')}
                      className="px-2.5 py-1 bg-white border border-[#EDE5D8] hover:border-[#C6A66B] rounded-lg text-[10.5px] font-semibold text-[#40362F] hover:text-[#C6A66B] cursor-pointer shadow-xs transition-colors"
                    >
                      🏢 Store Manager
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
