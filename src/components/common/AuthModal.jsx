import React, { useState } from 'react';
import { X, Lock, Mail, Building2, User, Phone, FileBadge, ArrowRight, ShieldCheck } from 'lucide-react';
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
  const [error, setError] = useState(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (authModalMode === 'login') {
      const res = await login(formData.email, formData.password);
      if (!res.success) setError(res.error || 'Login failed. Please check credentials.');
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields.');
        return;
      }
      const res = await register(formData);
      if (!res.success) setError(res.error || 'Registration failed.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setAuthModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#EDE5D8] overflow-hidden z-10 animate-fade-in">
        
        {/* Top Header */}
        <div className="bg-[#40362F] p-6 text-[#FAF8F3] relative border-b border-[#52463D]">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 text-[#EDE5D8] hover:text-[#C6A66B] p-1.5 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-[#C6A66B]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-semibold">BeadsSource B2B Portal</span>
          </div>

          <h2 className="text-xl font-serif font-bold text-[#FAF8F3]">
            {authModalMode === 'login' ? 'Wholesale Buyer Sign In' : 'Register Wholesale Business'}
          </h2>
          <p className="text-xs text-[#EDE5D8] mt-1">
            {authModalMode === 'login' 
              ? 'Access wholesale tier pricing, order tracking, and custom quotations.' 
              : 'Direct manufacturer pricing for retail jewelers, studios, and distributors.'}
          </p>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="bg-[#FAF8F3] px-6 py-3 border-b border-[#EDE5D8] flex items-center justify-between text-xs">
          <span className="text-[#8B8175] font-medium text-[11px]">Quick 1-Click Login:</span>
          <div className="flex gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="px-2.5 py-1 bg-white border border-[#EDE5D8] hover:border-[#C6A66B] rounded-lg text-[10px] font-bold text-[#C6A66B] cursor-pointer shadow-xs transition-colors"
            >
              <span>👑 Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('manager')}
              className="px-2.5 py-1 bg-white border border-[#EDE5D8] hover:border-[#C6A66B] rounded-lg text-[10px] font-bold text-[#40362F] cursor-pointer shadow-xs transition-colors"
            >
              Store Manager
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('buyer')}
              className="px-2.5 py-1 bg-white border border-[#EDE5D8] hover:border-[#C6A66B] rounded-lg text-[10px] font-bold text-[#40362F] cursor-pointer shadow-xs transition-colors"
            >
              Wholesale Customer
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#40362F] mb-1">Full Contact Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8B8175] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Authorized Business Representative"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#40362F] mb-1">Company / Studio Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#8B8175] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Artisan Gems & Boutiques"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#40362F] mb-1">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#8B8175] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91..."
                      className="w-full pl-8 pr-2.5 py-2 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#40362F] mb-1">GSTIN / Resale Tax ID</label>
                  <div className="relative">
                    <FileBadge className="w-3.5 h-3.5 text-[#8B8175] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="Optional"
                      className="w-full pl-8 pr-2.5 py-2 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#40362F] mb-1">Business Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8B8175] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="buyer@yourjewelrybrand.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#40362F] mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8B8175] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B] focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#40362F] hover:bg-[#52463D] text-[#FAF8F3] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-sm border border-[#52463D]"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{authModalMode === 'login' ? 'Sign In to Wholesale Portal' : 'Create Wholesale Account'}</span>
                <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="p-4 bg-[#FAF8F3] border-t border-[#EDE5D8] text-center text-xs text-[#8B8175]">
          {authModalMode === 'login' ? (
            <p>
              New wholesale buyer?{' '}
              <button
                type="button"
                onClick={() => { setError(null); setAuthModalMode('register'); }}
                className="text-[#C6A66B] font-bold hover:underline cursor-pointer"
              >
                Create a Wholesale Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setError(null); setAuthModalMode('login'); }}
                className="text-[#C6A66B] font-bold hover:underline cursor-pointer"
              >
                Sign In here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
