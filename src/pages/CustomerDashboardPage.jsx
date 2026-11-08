import React, { useState, useEffect } from 'react';
import { 
  Package, 
  FileText, 
  User, 
  Building2, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Printer, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ShoppingBag,
  MapPin,
  Key,
  Save,
  AlertCircle,
  Eye,
  Heart,
  Users,
  RotateCcw,
  CreditCard,
  DollarSign,
  Receipt,
  Download,
  Check,
  X,
  MessageSquare,
  Search,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../utils/api';

export default function CustomerDashboardPage({ onNavigate, initialTab = 'overview' }) {
  const { 
    user, 
    effectiveUser, 
    isAdmin, 
    isSuperAdmin, 
    impersonatedCustomer, 
    startImpersonating, 
    stopImpersonating, 
    updateUser 
  } = useAuth();
  const { formatPrice } = useCurrency();
  const { wishlistCount } = useWishlist();

  const activeCustomer = impersonatedCustomer || effectiveUser || user;

  const [activeTab, setActiveTab] = useState(initialTab); 
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // Modals for Quote Acceptance & Revision
  const [acceptingQuote, setAcceptingQuote] = useState(null);
  const [revisingQuote, setRevisingQuote] = useState(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  // Load customer list for Super Admin
  useEffect(() => {
    if (isAdmin || isSuperAdmin) {
      api.getCustomers().then(custs => {
        if (Array.isArray(custs)) setCustomersList(custs);
      }).catch(() => {});
    }
  }, [isAdmin, isSuperAdmin]);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: activeCustomer?.name || '',
    company: activeCustomer?.company || '',
    phone: activeCustomer?.phone || '',
    taxId: activeCustomer?.taxId || '',
    newPassword: '',
    confirmPassword: ''
  });

  // Keep form updated if active customer changes
  useEffect(() => {
    if (activeCustomer) {
      setProfileForm(prev => ({
        ...prev,
        name: activeCustomer.name || '',
        company: activeCustomer.company || '',
        phone: activeCustomer.phone || '',
        taxId: activeCustomer.taxId || ''
      }));
    }
  }, [activeCustomer]);

  // Address Form State
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: activeCustomer?.shippingAddress?.addressLine1 || '450 Fashion Avenue, Suite 1200',
    city: activeCustomer?.shippingAddress?.city || 'New York',
    state: activeCustomer?.shippingAddress?.state || 'NY',
    postalCode: activeCustomer?.shippingAddress?.postalCode || '10018',
    country: activeCustomer?.shippingAddress?.country || 'United States'
  });

  const [billingAddress, setBillingAddress] = useState({
    addressLine1: activeCustomer?.billingAddress?.addressLine1 || '450 Fashion Avenue, Suite 1200',
    city: activeCustomer?.billingAddress?.city || 'New York',
    state: activeCustomer?.billingAddress?.state || 'NY',
    postalCode: activeCustomer?.billingAddress?.postalCode || '10018',
    country: activeCustomer?.billingAddress?.country || 'United States'
  });

  const [saveMessage, setSaveMessage] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let emailFilter = null;
      if (impersonatedCustomer) {
        emailFilter = impersonatedCustomer.email;
      } else if (!isAdmin && user?.email) {
        emailFilter = user.email;
      }

      const [ordersData, quotesData] = await Promise.all([
        api.getOrders(emailFilter),
        api.getQuotes(emailFilter)
      ]);
      setOrders(ordersData);
      setQuotes(quotesData);
    } catch (err) {
      console.warn('Dashboard data fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [impersonatedCustomer, user]);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setSaveError(msg);
      setSaveMessage(null);
    } else {
      setSaveMessage(msg);
      setSaveError(null);
    }
    setTimeout(() => {
      setSaveMessage(null);
      setSaveError(null);
    }, 4500);
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      showNotification('New passwords do not match.', true);
      return;
    }

    try {
      const payload = {
        name: profileForm.name,
        company: profileForm.company,
        phone: profileForm.phone,
        taxId: profileForm.taxId
      };
      if (profileForm.newPassword) {
        payload.password = profileForm.newPassword;
      }

      const updated = await api.updateProfile(payload);
      if (updateUser) updateUser(updated);
      showNotification('Wholesale business profile updated successfully.');
      setProfileForm(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (err) {
      showNotification(err.message || 'Error updating profile', true);
    }
  };

  // Address Save
  const handleSaveAddresses = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateProfile({
        shippingAddress,
        billingAddress
      });
      if (updateUser) updateUser(updated);
      showNotification('Shipping and billing address book updated.');
    } catch (err) {
      showNotification('Failed to save addresses', true);
    }
  };

  // Accept Quotation & Convert to Order
  const handleConfirmAcceptQuote = async () => {
    if (!acceptingQuote) return;
    setSubmittingAction(true);
    try {
      const result = await api.acceptQuote(acceptingQuote.id);
      showNotification(result.message || `Quotation ${acceptingQuote.id} accepted! Order ${result.order?.id} created.`);
      setAcceptingQuote(null);
      await fetchData();
      setActiveTab('orders'); // Jump directly to orders
    } catch (err) {
      showNotification(err.message || 'Failed to accept quotation', true);
    } finally {
      setSubmittingAction(false);
    }
  };

  // Submit Revision Request
  const handleConfirmRevision = async () => {
    if (!revisingQuote) return;
    if (!revisionNotes.trim()) {
      showNotification('Please enter details of your requested changes.', true);
      return;
    }
    setSubmittingAction(true);
    try {
      const result = await api.requestQuoteRevision(revisingQuote.id, {
        revisionNotes,
        proposedTargetPrice: proposedPrice ? parseFloat(proposedPrice) : null
      });
      showNotification(result.message || 'Revision request submitted to management desk.');
      setRevisingQuote(null);
      setRevisionNotes('');
      setProposedPrice('');
      await fetchData();
    } catch (err) {
      showNotification(err.message || 'Failed to submit revision', true);
    } finally {
      setSubmittingAction(false);
    }
  };

  // Calculated Metrics
  const totalSpend = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeQuotesCount = quotes.filter(q => q.status !== 'Accepted' && q.status !== 'Rejected').length;

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Wholesale Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DC] shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#176B68]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-4 sm:gap-6 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#EBF4F3] border border-[#CADEDD] text-[#176B68] flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shadow-inner">
              {((activeCustomer?.name && activeCustomer.name[0]) || activeCustomer?.email?.[0] || 'C').toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#191F23]">
                  {activeCustomer?.company || activeCustomer?.name || 'Wholesale Client'}
                </h1>
                <span className="bg-[#EBF4F3] text-[#176B68] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-[#CADEDD]">
                  <ShieldCheck className="w-3 h-3 text-[#176B68]" />
                  <span>Verified B2B Wholesale Tier</span>
                </span>
                {impersonatedCustomer && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    Staff View Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#657078]">
                {activeCustomer?.email} &bull; Tax/Resale ID: <span className="font-mono text-[#191F23]">{activeCustomer?.taxId || 'TAX-8921094'}</span>
              </p>
              <p className="text-[11px] text-[#8C7E6C]">
                Corporate Status: <span className="text-emerald-700 font-semibold">Active Net 30 Terms Approved</span> &bull; CPSIA &amp; REACH Compliant
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={() => onNavigate('quote')}
              className="px-4 py-2.5 bg-[#176B68] hover:bg-[#125250] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#C3A36B]" />
              <span>Create Custom RFQ</span>
            </button>
            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className="px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#EAE4D5] text-[#191F23] border border-[#E9E5DC] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <span>Catalog</span>
            </button>
          </div>
        </div>

        {/* Impersonation Banner for Super Admin */}
        {(isAdmin || isSuperAdmin) && (
          <div className="mb-8 p-4 bg-[#FAF5E8] border border-[#E8DAB7] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#8C6D2B] font-semibold">
              <Users className="w-4 h-4 text-[#176B68]" />
              <span>
                Administrative Client Inspection: Switch between wholesale customer accounts to review specific quotes and orders.
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={impersonatedCustomer?.id || ''}
                onChange={(e) => {
                  const target = customersList.find(c => c.id === e.target.value);
                  if (target) startImpersonating(target);
                }}
                className="bg-white border border-[#DDD6C8] px-3 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-[#176B68]"
              >
                <option value="">-- Inspect Customer Account --</option>
                {customersList.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.company || c.name} ({c.email})
                  </option>
                ))}
              </select>

              {impersonatedCustomer && (
                <button
                  onClick={stopImpersonating}
                  className="px-3 py-1.5 bg-[#191F23] hover:bg-[#303030] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Exit View</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Global Alert Messages */}
        {saveMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}
        {saveError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-center gap-2 font-medium animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="bg-white p-1.5 rounded-2xl border border-[#E9E5DC] shadow-xs mb-8 flex overflow-x-auto gap-1 text-xs">
          {[
            { id: 'overview', label: 'Executive Overview', icon: Sparkles },
            { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
            { id: 'quotes', label: `Quotation RFQs (${quotes.length})`, icon: FileText },
            { id: 'invoices', label: `Invoices (${orders.length})`, icon: Receipt },
            { id: 'payments', label: 'Payment Terms & TT', icon: CreditCard },
            { id: 'addresses', label: 'Address Book', icon: MapPin },
            { id: 'profile', label: 'Profile & Security', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-[#176B68] text-white font-bold shadow-xs' 
                    : 'text-[#657078] hover:text-[#191F23] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C3A36B]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-3xl border border-[#E9E5DC] shadow-xs space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#657078] font-bold block">
                  Confirmed Orders
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-[#191F23]">{orders.length}</span>
                  <Package className="w-5 h-5 text-[#176B68]" />
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">All orders tracked via DHL</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E9E5DC] shadow-xs space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#657078] font-bold block">
                  Active Quotations
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-[#191F23]">{activeQuotesCount}</span>
                  <FileText className="w-5 h-5 text-[#C3A36B]" />
                </div>
                <p className="text-[11px] text-gray-500">24-hour turnaround SLA</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E9E5DC] shadow-xs space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#657078] font-bold block">
                  Saved Wishlist Items
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-[#191F23]">{wishlistCount}</span>
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-[11px] text-gray-500">Fast one-click cart transfer</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E9E5DC] shadow-xs space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#657078] font-bold block">
                  Total Wholesale Volume
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-[#191F23]">{formatPrice(totalSpend)}</span>
                  <DollarSign className="w-5 h-5 text-[#176B68]" />
                </div>
                <p className="text-[11px] text-[#8C6D2B] font-semibold">Tier 3 (30% off) Qualified</p>
              </div>
            </div>

            {/* Quick Actions & Recent Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Recent Orders Overview */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DC] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#E9E5DC]">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#191F23]">Recent Wholesale Orders</h3>
                    <p className="text-xs text-gray-500">Latest shipments and tracking status</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#176B68] hover:text-[#125250] flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Orders</span>
                    <ChevronRight className="w-4 h-4 text-[#C3A36B]" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-gray-500 py-8 text-center">No orders placed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9E5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#191F23]">{order.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-gray-500 text-[11px] mt-0.5">
                            {new Date(order.date).toLocaleDateString()} &bull; {order.items?.length || 0} item lines
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-[#191F23]">{formatPrice(order.total)}</span>
                          <button
                            onClick={() => setSelectedOrderForInvoice(order)}
                            className="px-3 py-1.5 bg-white border border-[#E9E5DC] hover:border-[#176B68] rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Wholesale Benefits & Direct Shortcuts */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#191F23] text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
                  <div className="flex items-center gap-2 text-[#C3A36B] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Commercial Account</span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-white">
                    Direct Factory Benefits
                  </h4>
                  <ul className="text-xs text-gray-300 space-y-2.5">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C3A36B] shrink-0" />
                      <span>Automatic 15% - 30% volume discounts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C3A36B] shrink-0" />
                      <span>Net 30 commercial invoicing on approved credit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C3A36B] shrink-0" />
                      <span>Direct 24-hr multi-product RFQ counter offers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C3A36B] shrink-0" />
                      <span>CPSIA &amp; REACH compliance certificates provided</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => onNavigate('quote')}
                    className="w-full py-2.5 bg-[#176B68] hover:bg-[#125250] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Launch New RFQ Builder</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C3A36B]" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ORDER HISTORY */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E9E5DC] space-y-4">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-[#191F23]">No Wholesale Orders Placed Yet</h3>
                <p className="text-xs text-[#657078] max-w-sm mx-auto">
                  Browse our natural gemstones, pave cubic zirconia, and certified lead-free pewter charms to place your first wholesale order.
                </p>
                <button
                  onClick={() => onNavigate('catalog', { category: 'all' })}
                  className="px-6 py-2.5 bg-[#176B68] text-white text-xs font-bold rounded-xl hover:bg-[#125250] cursor-pointer"
                >
                  Browse Wholesale Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-2xl border border-[#E9E5DC] p-5 shadow-xs hover:border-[#176B68] transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#191F23]">{order.id}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            order.status === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {order.status}
                          </span>
                          {order.quoteId && (
                            <span className="bg-[#EBF4F3] text-[#176B68] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#CADEDD]">
                              RFQ: {order.quoteId}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Placed: {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">Total Order</span>
                          <span className="font-bold text-base text-[#191F23]">{formatPrice(order.total)}</span>
                        </div>
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="px-3.5 py-2 bg-[#F8F6F1] hover:bg-[#EAE4D5] text-[#191F23] text-xs font-semibold rounded-xl border border-[#E9E5DC] flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Receipt className="w-3.5 h-3.5 text-[#176B68]" />
                          <span>View Invoice</span>
                        </button>
                      </div>
                    </div>

                    {/* Logistics tracking */}
                    <div className="flex flex-wrap items-center justify-between text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#E9E5DC] gap-2">
                      <div className="flex items-center gap-2 text-[#554F42]">
                        <Truck className="w-4 h-4 text-[#176B68]" />
                        <span>Courier: <strong>{order.courierName || 'DHL Express Worldwide'}</strong></span>
                      </div>
                      <div className="font-mono text-gray-600">
                        Tracking: <strong>{order.trackingNumber || 'EXP-98210491'}</strong>
                      </div>
                      <div className="text-[#176B68] font-semibold text-[11px]">
                        Payment: {order.paymentStatus || 'Paid'} ({order.paymentMethod})
                      </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-[#F5F2EB]">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image || 'https://beadssource.com/wp-content/uploads/DSC_2552-scaled-1-1536x1025-1-300x300.jpg'} 
                              alt={item.name} 
                              className="w-10 h-10 object-cover rounded-lg border border-[#E9E5DC]" 
                            />
                            <div>
                              <p className="font-semibold text-[#191F23]">{item.name}</p>
                              <p className="text-[10px] text-gray-500 font-mono">SKU: {item.sku} &bull; Qty: {item.quantity} packs</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#191F23]">{formatPrice(item.price * (item.quantity || 1))}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: QUOTATION REQUESTS & APPROVAL WORKFLOW */}
        {/* ========================================================= */}
        {activeTab === 'quotes' && (
          <div className="space-y-6 animate-fade-in">
            {quotes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E9E5DC] space-y-4">
                <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-[#191F23]">No Active RFQ Quotations</h3>
                <p className="text-xs text-[#657078] max-w-sm mx-auto">
                  Need 500+ strands or bespoke casting? Submit target unit rates through our wholesale RFQ builder for 24-hr management review.
                </p>
                <button
                  onClick={() => onNavigate('quote')}
                  className="px-6 py-2.5 bg-[#176B68] text-white text-xs font-bold rounded-xl hover:bg-[#125250] cursor-pointer"
                >
                  Create Custom RFQ
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {quotes.map((quote) => {
                  const isReadyToAccept = (quote.status === 'Approved' || quote.status === 'Quoted' || quote.status === 'Revised') && !quote.orderId;
                  const isAccepted = quote.status === 'Accepted' || Boolean(quote.orderId);

                  return (
                    <div 
                      key={quote.id} 
                      className="bg-white rounded-2xl border border-[#E9E5DC] p-5 sm:p-6 shadow-xs space-y-4 hover:border-[#176B68] transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-base text-[#191F23]">{quote.id}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              isAccepted
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : isReadyToAccept
                                  ? 'bg-[#EBF4F3] text-[#176B68] border border-[#CADEDD]'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {quote.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Submitted: {new Date(quote.date).toLocaleDateString()} &bull; Target Delivery: {quote.targetDeliveryDate || 'Flexible'}
                          </p>
                        </div>

                        {quote.counterOffer && (
                          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E9E5DC] text-right">
                            <span className="text-[10px] text-[#657078] block">Administrator Approved Unit Rate</span>
                            <span className="text-base font-bold text-[#176B68]">
                              {formatPrice(quote.counterOffer)} / unit
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Official Administrator Response Note */}
                      {quote.adminNotes && (
                        <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E9E5DC] text-xs">
                          <span className="font-bold text-[#191F23] block mb-0.5">Administrator Response Note:</span>
                          <p className="text-[#657078] leading-relaxed">{quote.adminNotes}</p>
                        </div>
                      )}

                      {/* Customer Revision Note if requested */}
                      {quote.revisionNotes && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                          <span className="font-bold text-amber-900 block mb-0.5">Your Revision Request:</span>
                          <p className="text-amber-800 leading-relaxed">{quote.revisionNotes}</p>
                        </div>
                      )}

                      {/* Requested Line Items */}
                      <div className="divide-y divide-[#F5F2EB]">
                        {quote.items?.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-semibold text-[#191F23]">{item.name}</p>
                              <p className="text-[10px] text-gray-500 font-mono">
                                SKU: {item.sku} &bull; Requested Qty: {item.requestedQty || item.quantity} packs
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-gray-500 block text-[10px]">Target Rate</span>
                              <span className="font-bold text-[#191F23]">{formatPrice(item.targetPrice || item.catalogPrice)} / unit</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* QUOTATION WORKFLOW ACTIONS */}
                      <div className="pt-4 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-3">
                        <div>
                          {isAccepted ? (
                            <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Quotation accepted and converted to Confirmed Order <strong>{quote.orderId}</strong>.</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">
                              Terms: Net 30 Commercial Invoice &bull; DHL Express Worldwide
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isAccepted && (
                            <button
                              onClick={() => {
                                const matchedOrder = orders.find(o => o.id === quote.orderId);
                                if (matchedOrder) setSelectedOrderForInvoice(matchedOrder);
                                else setActiveTab('orders');
                              }}
                              className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#EAE4D5] text-[#191F23] border border-[#E9E5DC] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#176B68]" />
                              <span>View Generated Order</span>
                            </button>
                          )}

                          {isReadyToAccept && (
                            <>
                              <button
                                onClick={() => {
                                  setRevisingQuote(quote);
                                  setRevisionNotes('');
                                  setProposedPrice('');
                                }}
                                className="px-4 py-2 bg-white hover:bg-[#FAF8F5] text-[#191F23] border border-[#E9E5DC] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                              >
                                Request Revision
                              </button>

                              <button
                                onClick={() => setAcceptingQuote(quote)}
                                className="px-5 py-2 bg-[#176B68] hover:bg-[#125250] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-4 h-4 text-[#C3A36B]" />
                                <span>Accept Quotation &amp; Create Order</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: COMMERCIAL INVOICES */}
        {/* ========================================================= */}
        {activeTab === 'invoices' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DC] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E9E5DC] gap-2">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#191F23]">Wholesale Commercial Invoices</h3>
                  <p className="text-xs text-[#657078]">Download and print official export documentation with tax ID</p>
                </div>
                <span className="text-xs text-gray-500 font-mono">
                  {orders.length} Invoices Available
                </span>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-gray-500 py-8 text-center">No invoices issued yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E9E5DC] text-[#657078] font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">Invoice #</th>
                        <th className="py-3 px-3">Order Ref</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Payment Terms</th>
                        <th className="py-3 px-3 text-right">Amount</th>
                        <th className="py-3 px-3 text-center">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F2EB]">
                      {orders.map((order, idx) => (
                        <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-[#176B68]">
                            INV-2026-{1000 + idx}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-gray-600">
                            {order.id}
                          </td>
                          <td className="py-3.5 px-3 text-gray-600">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-3 text-gray-600">
                            {order.paymentMethod || 'Wire Transfer / Net 30'}
                          </td>
                          <td className="py-3.5 px-3 text-right font-bold text-[#191F23]">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {order.paymentStatus || 'Paid'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedOrderForInvoice(order)}
                              className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE4D5] text-[#191F23] border border-[#E9E5DC] rounded-lg font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#176B68]" />
                              <span>View / Print</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: WHOLESALE PAYMENT TERMS & TT INSTRUCTIONS */}
        {/* ========================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DC] shadow-xs space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF4F3] text-[#176B68] text-xs font-semibold mb-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#176B68]" />
                  <span>Approved Commercial B2B Payment Methods</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#191F23]">
                  Commercial Settlement &amp; Wire Transfer Details
                </h3>
                <p className="text-xs text-[#657078] mt-1">
                  BeadsSource provides direct corporate settlement options with zero surcharge for international bank wire transfers and commercial terms.
                </p>
              </div>

              {/* Wire Details Box */}
              <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E9E5DC] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DC]">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#191F23]">
                    Official Telegraphic Transfer (TT) Wire Routing
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Verified Global Corporate Account
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">Beneficiary Name</span>
                    <strong className="text-[#191F23]">BeadsSource Wholesale Global Operations Ltd.</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Bank Institution</span>
                    <strong className="text-[#191F23]">Standard Chartered International Banking Corp.</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">SWIFT / BIC Code</span>
                    <strong className="font-mono text-[#176B68]">SCBLUS33XXX</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Account / IBAN Number</span>
                    <strong className="font-mono text-[#176B68]">US89 0001 2345 6789 0123 45</strong>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 pt-2 border-t border-[#E9E5DC]">
                  Please reference your <strong>Order Number (e.g., ORD-2026-XXXX)</strong> or <strong>Quotation ID</strong> in the wire transfer description for automatic same-day reconciliation.
                </p>
              </div>

              {/* Net 30 Terms Status */}
              <div className="p-5 bg-white rounded-2xl border border-[#E9E5DC] flex items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-[#191F23]">Net 30 Commercial Trade Credit</h4>
                  <p className="text-gray-500">
                    Your wholesale account has an approved credit limit of <strong>$15,000 USD</strong> for eligible custom orders.
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 shrink-0">
                  Net 30 Active
                </span>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: ADDRESS BOOK */}
        {/* ========================================================= */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DC] shadow-xs max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#191F23]">Wholesale Address Book</h3>
              <p className="text-xs text-[#657078] mt-0.5">
                Maintain certified shipping destinations and official billing addresses for commercial customs documentation.
              </p>
            </div>

            <form onSubmit={handleSaveAddresses} className="space-y-8 text-xs">
              
              {/* Shipping Address */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#191F23]">
                  <Truck className="w-4 h-4 text-[#176B68]" />
                  <span>Primary Factory Dispatch / Shipping Address</span>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Street Address &amp; Suite</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">State / Province</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-3 pt-6 border-t border-[#F0EBE1]">
                <div className="flex items-center gap-2 text-sm font-bold text-[#191F23]">
                  <Building2 className="w-4 h-4 text-[#C3A36B]" />
                  <span>Official Corporate Billing Address (for Customs Invoices)</span>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={billingAddress.addressLine1}
                    onChange={(e) => setBillingAddress({ ...billingAddress, addressLine1: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.postalCode}
                      onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#176B68] hover:bg-[#125250] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4 text-[#C3A36B]" />
                <span>Save Address Book</span>
              </button>

            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: PROFILE & SECURITY */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DC] shadow-xs max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#191F23]">Wholesale Business Credentials</h3>
              <p className="text-xs text-[#657078] mt-0.5">
                Manage your business contact details, resale certificates, and access credentials.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#191F23] mb-1">Business Contact Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#191F23] mb-1">Company / Studio Legal Name</label>
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#191F23] mb-1">Resale Tax ID / GSTIN / VAT</label>
                  <input
                    type="text"
                    value={profileForm.taxId}
                    onChange={(e) => setProfileForm({ ...profileForm, taxId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#191F23] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                />
              </div>

              <div className="pt-4 border-t border-[#F0EBE1] space-y-3">
                <span className="font-bold text-[#191F23] block">Update Security Password (Optional)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={profileForm.newPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={profileForm.confirmPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#176B68] hover:bg-[#125250] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs mt-2"
              >
                <Save className="w-4 h-4 text-[#C3A36B]" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ACCEPT QUOTATION & CREATE ORDER CONFIRMATION */}
      {/* ========================================================= */}
      {acceptingQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#E9E5DC] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DC]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#176B68]" />
                <h3 className="font-serif text-lg font-bold text-[#191F23]">
                  Accept Quotation {acceptingQuote.id}
                </h3>
              </div>
              <button 
                onClick={() => setAcceptingQuote(null)} 
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#657078]">
              <p>
                You are about to accept the administrator-approved unit rate of{' '}
                <strong className="text-[#176B68] font-bold text-sm">
                  {formatPrice(acceptingQuote.counterOffer || acceptingQuote.items?.[0]?.targetPrice)} / unit
                </strong>.
              </p>
              
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E9E5DC] space-y-1">
                <span className="font-bold text-[#191F23] block">Quotation Summary:</span>
                <p>&bull; Requested Item Lines: {acceptingQuote.items?.length || 0}</p>
                <p>&bull; Courier: DHL Express Worldwide ($35.00 flat export rate)</p>
                <p>&bull; Payment Terms: Net 30 Commercial Invoice</p>
              </div>

              <p className="text-[11px] text-gray-500">
                Clicking confirm will automatically generate a confirmed order, allocate factory inventory, and issue an official commercial invoice.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E5DC]">
              <button
                onClick={() => setAcceptingQuote(null)}
                className="px-4 py-2 border border-[#E9E5DC] text-gray-700 text-xs font-semibold rounded-xl hover:bg-[#FAF8F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAcceptQuote}
                disabled={submittingAction}
                className="px-5 py-2.5 bg-[#176B68] hover:bg-[#125250] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {submittingAction ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#C3A36B]" />
                    <span>Confirm &amp; Generate Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: REQUEST QUOTATION REVISION */}
      {/* ========================================================= */}
      {revisingQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#E9E5DC] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DC]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#176B68]" />
                <h3 className="font-serif text-lg font-bold text-[#191F23]">
                  Request Quotation Revision ({revisingQuote.id})
                </h3>
              </div>
              <button 
                onClick={() => setRevisingQuote(null)} 
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#191F23] mb-1">
                  Proposed Target Price (USD / unit)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder="e.g. 13.80"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#191F23] mb-1">
                  Revision Request Notes / Quantity Adjustment *
                </label>
                <textarea
                  rows={4}
                  required
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Explain your proposed quantity adjustments, target delivery changes, or custom finishing requirements..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#176B68]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E5DC]">
              <button
                onClick={() => setRevisingQuote(null)}
                className="px-4 py-2 border border-[#E9E5DC] text-gray-700 text-xs font-semibold rounded-xl hover:bg-[#FAF8F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevision}
                disabled={submittingAction}
                className="px-5 py-2.5 bg-[#176B68] hover:bg-[#125250] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {submittingAction ? <span>Submitting...</span> : <span>Send Revision to Management</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: OFFICIAL COMMERCIAL INVOICE VIEW & PRINT */}
      {/* ========================================================= */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 border border-[#E9E5DC] shadow-2xl my-8 space-y-6">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E5DC] print:hidden">
              <span className="text-xs text-gray-500 font-mono">
                Official Commercial Invoice Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-[#176B68] hover:bg-[#125250] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C3A36B]" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="p-2 text-gray-400 hover:text-black rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Printable Body */}
            <div className="space-y-6 text-xs text-[#191F23]">
              
              {/* Header with BeadsSource Branding */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#E9E5DC]">
                <div>
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-[#176B68]">
                    BEADSSOURCE
                  </h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                    Wholesale Fine Jewellery &amp; Gemstone Export
                  </p>
                  <p className="text-gray-500 mt-1">Direct Factory Export Division</p>
                  <p className="text-gray-500">support@beadssource.com &bull; +1 (800) 555-0199</p>
                </div>

                <div className="sm:text-right space-y-0.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider inline-block">
                    {selectedOrderForInvoice.paymentStatus || 'Commercial Invoice'}
                  </span>
                  <p className="font-mono text-sm font-bold text-[#191F23] mt-1">
                    Invoice: INV-2026-{selectedOrderForInvoice.id.replace('ORD-2026-', '')}
                  </p>
                  <p className="text-gray-500">Order Ref: {selectedOrderForInvoice.id}</p>
                  <p className="text-gray-500">
                    Date: {new Date(selectedOrderForInvoice.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Bill To & Ship To Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E9E5DC]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
                    Bill To (Registered Wholesale Client):
                  </span>
                  <strong className="block text-sm text-[#191F23]">
                    {selectedOrderForInvoice.customer?.company || selectedOrderForInvoice.customer?.name || 'Wholesale Client'}
                  </strong>
                  <p className="text-gray-600">{selectedOrderForInvoice.customer?.email}</p>
                  <p className="text-gray-600">Tax / Resale ID: {selectedOrderForInvoice.customer?.taxId || 'TAX-8921094'}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
                    Shipment Delivery Destination:
                  </span>
                  <p className="text-gray-700 font-medium">
                    {selectedOrderForInvoice.shippingAddress?.addressLine1 || '450 Fashion Avenue, Suite 1200'}
                  </p>
                  <p className="text-gray-700">
                    {selectedOrderForInvoice.shippingAddress?.city || 'New York'}, {selectedOrderForInvoice.shippingAddress?.state || 'NY'} {selectedOrderForInvoice.shippingAddress?.postalCode || '10018'}
                  </p>
                  <p className="text-gray-700">{selectedOrderForInvoice.shippingAddress?.country || 'United States'}</p>
                  <p className="text-gray-500 font-mono mt-0.5">
                    Courier: {selectedOrderForInvoice.courierName || 'DHL Express Worldwide'} &bull; Tracking: {selectedOrderForInvoice.trackingNumber}
                  </p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E9E5DC] text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-2">Line Item Description</th>
                      <th className="py-2.5 px-2">SKU</th>
                      <th className="py-2.5 px-2 text-right">Qty (Packs)</th>
                      <th className="py-2.5 px-2 text-right">Unit Price</th>
                      <th className="py-2.5 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F2EB]">
                    {selectedOrderForInvoice.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-2 font-semibold text-[#191F23]">
                          {item.name}
                        </td>
                        <td className="py-3 px-2 font-mono text-gray-500">
                          {item.sku || 'WH-GEM-01'}
                        </td>
                        <td className="py-3 px-2 text-right font-medium">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-2 text-right font-medium">
                          {formatPrice(item.price)}
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-[#191F23]">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="pt-4 border-t border-[#E9E5DC] flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrderForInvoice.subtotal)}</span>
                  </div>
                  {selectedOrderForInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Volume Discount:</span>
                      <span>-{formatPrice(selectedOrderForInvoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>International Express Freight:</span>
                    <span>{formatPrice(selectedOrderForInvoice.shipping || 35.00)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Export Tax (Exempt B2B):</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E9E5DC] font-bold text-sm text-[#191F23]">
                    <span>Total Amount Due:</span>
                    <span className="text-[#176B68]">{formatPrice(selectedOrderForInvoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Legal & Compliance Notice */}
              <div className="pt-6 border-t border-[#E9E5DC] text-[10px] text-gray-500 space-y-1 text-center sm:text-left">
                <p>
                  <strong>Lead-Free Certification:</strong> All pewter charms and findings in this shipment comply with US CPSIA Sec 101, California Prop 65, and EU REACH Regulation (EC) No 1907/2006 for lead and cadmium safety.
                </p>
                <p>
                  Payment terms: {selectedOrderForInvoice.paymentMethod || 'Net 30 Commercial Invoice'}. Wire remittance to Standard Chartered Bank (SWIFT: SCBLUS33XXX).
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
