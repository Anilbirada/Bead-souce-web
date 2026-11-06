import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  ArrowRight, 
  ExternalLink, 
  UserCheck, 
  X, 
  ChevronDown, 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FileText, 
  Settings, 
  Store, 
  RotateCcw,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export default function SuperAdminBar({ currentPage, onNavigate }) {
  const { 
    user, 
    isSuperAdmin, 
    isAdmin, 
    impersonatedCustomer, 
    startImpersonating, 
    stopImpersonating, 
    viewMode, 
    setViewMode 
  } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Fetch customers for the quick switcher
  useEffect(() => {
    if (isAdmin || isSuperAdmin) {
      api.getCustomers().then(custs => {
        if (Array.isArray(custs)) setCustomersList(custs);
      }).catch(() => {});
    }
  }, [isAdmin, isSuperAdmin]);

  // Keep selected customer sync
  useEffect(() => {
    if (impersonatedCustomer) {
      setSelectedCustomerId(impersonatedCustomer.id || impersonatedCustomer.email);
    } else {
      setSelectedCustomerId('');
    }
  }, [impersonatedCustomer]);

  // Only show if Super Admin or Admin
  if (!user || (!isSuperAdmin && !isAdmin)) return null;

  const handleCustomerSelect = (e) => {
    const val = e.target.value;
    setSelectedCustomerId(val);
    if (!val) {
      stopImpersonating();
      return;
    }
    const found = customersList.find(c => (c.id === val || c.email === val));
    if (found) {
      startImpersonating(found);
    }
  };

  if (collapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-fade-in select-none">
        <button
          onClick={() => setCollapsed(false)}
          className="bg-[#191919] hover:bg-[#252525] text-white border-2 border-[#C49A3A] px-3.5 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>👑 Super Admin Controls</span>
          {impersonatedCustomer && (
            <span className="bg-[#C49A3A] text-black px-2 py-0.5 rounded-full text-[10px]">
              Viewing as Customer
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <aside 
      aria-label="Super Administrator Toolbar"
      className="bg-[#111111] text-white border-b-2 border-[#C49A3A] text-xs select-none sticky top-0 z-50 shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Super Admin Identity & Status */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#222222] px-2.5 py-1 rounded-md border border-[#383838]">
            <span className="text-[#C49A3A] text-sm">👑</span>
            <span className="font-bold tracking-wide text-xs text-white uppercase">
              {isSuperAdmin ? 'Super Administrator' : 'Administrator'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-300">
            <span>Access:</span>
            <span className="text-[#C49A3A] font-semibold">Entire Website &amp; Customer Views</span>
          </div>
        </div>

        {/* Center: View Switcher & Customer Impersonation */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Quick View Modes */}
          <div className="flex items-center bg-[#1E1E1E] p-0.5 rounded-lg border border-[#333333]">
            <button
              onClick={() => {
                stopImpersonating();
                onNavigate('admin');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                currentPage === 'admin'
                  ? 'bg-[#C49A3A] text-black shadow-xs'
                  : 'text-gray-300 hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Suite</span>
            </button>

            <button
              onClick={() => {
                setViewMode('customer');
                onNavigate('dashboard');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                currentPage === 'dashboard'
                  ? 'bg-[#C49A3A] text-black shadow-xs'
                  : 'text-gray-300 hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                currentPage === 'home' || currentPage === 'catalog'
                  ? 'bg-[#3A3A3A] text-[#C49A3A]'
                  : 'text-gray-300 hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
          </div>

          {/* Customer View Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#1E1E1E] px-2 py-1 rounded-lg border border-[#383838]">
            <Eye className="w-3.5 h-3.5 text-[#C49A3A]" />
            <span className="text-[10px] text-gray-400 font-medium">View As Customer:</span>
            <select
              value={selectedCustomerId}
              onChange={handleCustomerSelect}
              className="bg-[#2A2A2A] text-white text-[11px] font-semibold rounded px-2 py-0.5 border border-[#444444] focus:outline-none focus:border-[#C49A3A] cursor-pointer"
              aria-label="View site as customer"
            >
              <option value="">-- View As Super Admin --</option>
              {customersList.map(cust => (
                <option key={cust.id} value={cust.id}>
                  {cust.name} ({cust.company || 'Wholesale Buyer'})
                </option>
              ))}
            </select>
          </div>

          {/* Active Impersonation Indicator & Reset */}
          {impersonatedCustomer && (
            <div className="flex items-center gap-1 bg-[#C49A3A]/20 border border-[#C49A3A]/50 px-2.5 py-0.5 rounded-lg text-[#F2C96C] text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-[#C49A3A]" />
              <span className="font-semibold truncate max-w-[140px]">
                {impersonatedCustomer.name}
              </span>
              <button
                onClick={stopImpersonating}
                className="ml-1 text-gray-300 hover:text-white p-0.5 rounded cursor-pointer"
                title="Reset to Super Admin view"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick Jump & Collapse */}
        <div className="flex items-center gap-2">
          {/* Quick jump to catalog */}
          <button
            onClick={() => onNavigate('catalog')}
            className="hidden lg:flex items-center gap-1 px-2 py-1 text-[11px] text-gray-300 hover:text-white rounded hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <span>Catalogue</span>
            <ExternalLink className="w-3 h-3 text-[#C49A3A]" />
          </button>

          <button
            onClick={() => onNavigate('quote')}
            className="hidden lg:flex items-center gap-1 px-2 py-1 text-[11px] text-gray-300 hover:text-white rounded hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <span>Wholesale RFQ</span>
          </button>

          {/* Minimize button */}
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#222222] cursor-pointer"
            title="Minimize toolbar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
}
