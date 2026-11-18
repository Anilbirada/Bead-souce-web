import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  ExternalLink, 
  UserCheck, 
  X, 
  LayoutDashboard, 
  Store, 
  Users,
  Briefcase,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export default function SuperAdminBar({ currentPage, onNavigate }) {
  const { 
    user, 
    isSuperAdmin, 
    isAdmin, 
    isStoreManager,
    isCustomer,
    userRole,
    switchRole,
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

  // Always show toolbar if admin, super_admin, impersonating, or if signed in as demo role
  if (!user) return null;

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

  const handleRoleChange = async (e) => {
    const target = e.target.value;
    if (target && target !== userRole) {
      await switchRole(target);
      if (target === 'super_admin' || target === 'store_manager') {
        onNavigate('admin');
      } else {
        onNavigate('home');
      }
    }
  };

  if (collapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-fade-in select-none">
        <button
          onClick={() => setCollapsed(false)}
          className="bg-[#292723] hover:bg-[#352D26] text-[#FAF8F3] border border-[#C6A66B]/80 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold transition-all cursor-pointer hover:scale-102"
        >
          <span className="w-2 h-2 rounded-full bg-[#C6A66B] animate-pulse" />
          <span>
            {isSuperAdmin ? '👑 Super Admin' : (isStoreManager ? '💼 Store Manager' : '💎 Customer')} Controls
          </span>
          {impersonatedCustomer && (
            <span className="bg-[#C6A66B] text-[#292723] px-2 py-0.5 rounded-full text-[10px] font-bold">
              Viewing as Customer
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <aside 
      aria-label="Role & Access Control Toolbar"
      className="bg-[#292723] text-[#FAF8F3] border-b border-[#C6A66B]/30 text-xs select-none sticky top-0 z-50 shadow-md backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Role Identity Badge & Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Active Role Badge */}
          <div className="flex items-center gap-1.5 bg-[#40362F] px-2.5 py-1 rounded-md border border-[#C6A66B]/40 shadow-xs">
            {isSuperAdmin && <span className="text-[#C6A66B] text-xs">👑</span>}
            {!isSuperAdmin && isStoreManager && <Briefcase className="w-3.5 h-3.5 text-[#C6A66B]" />}
            {!isSuperAdmin && !isStoreManager && <span className="text-[#C6A66B] text-xs">💎</span>}
            <span className="font-bold tracking-wide text-[11px] text-[#FAF8F3] uppercase">
              {isSuperAdmin ? 'Super Administrator' : (isStoreManager ? 'Store Management' : 'Wholesale Buyer')}
            </span>
          </div>

          {/* Quick RBAC Role Switcher */}
          <div className="flex items-center gap-1.5 bg-[#382F27] px-2 py-0.5 rounded-md border border-[#52463D]">
            <span className="text-[10px] text-[#EDE5D8]/80 font-medium">Role:</span>
            <select
              value={isSuperAdmin ? 'super_admin' : (isStoreManager ? 'store_manager' : 'customer')}
              onChange={handleRoleChange}
              className="bg-[#292723] text-[#FAF8F3] text-[11px] font-semibold rounded px-1.5 py-0.5 border border-[#52463D] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
              aria-label="Switch RBAC Role"
            >
              <option value="super_admin">👑 Super Admin</option>
              <option value="store_manager">💼 Store Manager</option>
              <option value="customer">💎 Wholesale Customer</option>
            </select>
          </div>
        </div>

        {/* Center: View Switcher & Customer Impersonation */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Quick View Modes */}
          <div className="flex items-center bg-[#382F27] p-0.5 rounded-lg border border-[#52463D]">
            {/* Admin Suite shortcut (only available for Super Admin and Store Management) */}
            {(isSuperAdmin || isStoreManager) && (
              <button
                onClick={() => {
                  stopImpersonating();
                  onNavigate('admin');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentPage === 'admin'
                    ? 'bg-[#C6A66B] text-[#292723] shadow-xs'
                    : 'text-[#EDE5D8] hover:text-[#FAF8F3] hover:bg-[#40362F]'
                }`}
                title="Open Administrative Suite"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Suite</span>
              </button>
            )}

            <button
              onClick={() => {
                setViewMode('customer');
                onNavigate('dashboard');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentPage === 'dashboard'
                  ? 'bg-[#C6A66B] text-[#292723] shadow-xs'
                  : 'text-[#EDE5D8] hover:text-[#FAF8F3] hover:bg-[#40362F]'
              }`}
              title="Open Wholesale Customer Portal"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentPage === 'home' || currentPage === 'catalog'
                  ? 'bg-[#40362F] text-[#C6A66B]'
                  : 'text-[#EDE5D8] hover:text-[#FAF8F3] hover:bg-[#40362F]'
              }`}
              title="Browse Luxury Storefront"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
          </div>

          {/* Customer View Switcher Dropdown (for Super Admin & Store Manager) */}
          {(isSuperAdmin || isStoreManager) && (
            <div className="flex items-center gap-1.5 bg-[#382F27] px-2 py-1 rounded-lg border border-[#52463D]">
              <Eye className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span className="text-[10px] text-[#EDE5D8]/80 font-medium hidden md:inline">Impersonate:</span>
              <select
                value={selectedCustomerId}
                onChange={handleCustomerSelect}
                className="bg-[#292723] text-[#FAF8F3] text-[11px] font-medium rounded px-2 py-0.5 border border-[#52463D] focus:outline-none focus:border-[#C6A66B] cursor-pointer max-w-[170px] truncate"
                aria-label="View site as customer"
              >
                <option value="">-- View As {isSuperAdmin ? 'Super Admin' : 'Manager'} --</option>
                {customersList.map(cust => (
                  <option key={cust.id} value={cust.id}>
                    {cust.name} ({cust.company || 'Buyer'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Active Impersonation Indicator & Reset */}
          {impersonatedCustomer && (
            <div className="flex items-center gap-1 bg-[#C6A66B]/20 border border-[#C6A66B]/60 px-2.5 py-0.5 rounded-lg text-[#F5E6C8] text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span className="font-semibold truncate max-w-[120px]">
                {impersonatedCustomer.name}
              </span>
              <button
                onClick={stopImpersonating}
                className="ml-1 text-[#EDE5D8] hover:text-[#FAF8F3] p-0.5 rounded cursor-pointer"
                title="Reset to Admin view"
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
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-[11px] text-[#EDE5D8] hover:text-[#FAF8F3] rounded hover:bg-[#40362F] transition-colors cursor-pointer"
          >
            <span>Catalogue</span>
            <ExternalLink className="w-3 h-3 text-[#C6A66B]" />
          </button>

          <button
            onClick={() => onNavigate('quote')}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-[11px] text-[#EDE5D8] hover:text-[#FAF8F3] rounded hover:bg-[#40362F] transition-colors cursor-pointer"
          >
            <span>Wholesale RFQ</span>
          </button>

          {/* Minimize button */}
          <button
            onClick={() => setCollapsed(true)}
            className="text-[#EDE5D8]/70 hover:text-[#FAF8F3] p-1 rounded hover:bg-[#40362F] cursor-pointer transition-colors"
            title="Minimize toolbar"
            aria-label="Minimize toolbar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
}
