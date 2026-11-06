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
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E9E3D8] overflow-hidden z-10 animate-fade-in">
        
        {/* Top Header */}
        <div className="bg-[#191919] p-6 text-white relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-[#C49A3A]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-semibold">BeadsSource B2B Portal</span>
          </div>

          <h2 className="text-xl font-serif font-bold text-white">
            {authModalMode === 'login' ? 'Wholesale Buyer Sign In' : 'Register Wholesale Business'}
          </h2>
          <p className="text-xs text-[#D8D2C4] mt-1">
            {authModalMode === 'login' 
              ? 'Access wholesale tier pricing, order tracking, and custom quotations.' 
              : 'Direct manufacturer pricing for retail jewelers, studios, and distributors.'}
          </p>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="bg-[#F8F6F1] px-6 py-2.5 border-b border-[#E9E3D8] flex items-center justify-between text-xs">
          <span className="text-[#696253] font-medium text-[11px]">Quick 1-Click Login:</span>
          <div className="flex gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="px-2 py-1 bg-white border border-[#DACFBA] rounded text-[10px] font-bold text-[#8C6D2B] hover:bg-[#F3EFE6]"
            >
              Administrator
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('manager')}
              className="px-2 py-1 bg-white border border-[#DACFBA] rounded text-[10px] font-bold text-[#554F42] hover:bg-[#F3EFE6]"
            >
              Store Manager
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('buyer')}
              className="px-2 py-1 bg-white border border-[#DACFBA] rounded text-[10px] font-bold text-[#3B372F] hover:bg-[#F3EFE6]"
            >
              Customer
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#3D382E] mb-1">Full Contact Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Authorized Business Representative"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-lg text-xs focus:outline-none focus:border-[#C4A052] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D382E] mb-1">Company / Studio Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Artisan Gems & Boutiques"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-lg text-xs focus:outline-none focus:border-[#C4A052] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3D382E] mb-1">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91..."
                      className="w-full pl-8 pr-2 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-lg text-xs focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3D382E] mb-1">GSTIN / Resale Tax ID</label>
                  <div className="relative">
                    <FileBadge className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="Optional"
                      className="w-full pl-8 pr-2 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-lg text-xs focus:outline-none focus:border-[#C4A052]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#3D382E] mb-1">Business Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="buyer@yourjewelrybrand.com"
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-lg text-xs focus:outline-none focus:border-[#C4A052] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3D382E] mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-lg text-xs focus:outline-none focus:border-[#C4A052] focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#1C1A17] hover:bg-[#332E26] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{authModalMode === 'login' ? 'Sign In to Wholesale Portal' : 'Create Wholesale Account'}</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#EAE4D5] text-center text-xs text-[#635C4E]">
          {authModalMode === 'login' ? (
            <p>
              New wholesale buyer?{' '}
              <button
                type="button"
                onClick={() => { setError(null); setAuthModalMode('register'); }}
                className="text-[#967117] font-bold hover:underline"
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
                className="text-[#967117] font-bold hover:underline"
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
