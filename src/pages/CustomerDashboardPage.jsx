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
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../utils/api';

export default function CustomerDashboardPage({ onNavigate, initialTab = 'orders' }) {
  const { user, isAdmin, updateUser } = useAuth();
  const { formatPrice } = useCurrency();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState(initialTab); // 'orders', 'quotes', 'profile', 'addresses'
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    company: user?.company || '',
    phone: user?.phone || '',
    taxId: user?.taxId || '',
    newPassword: '',
    confirmPassword: ''
  });

  // Address Form State
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: user?.shippingAddress?.addressLine1 || '450 Fashion Avenue, Suite 1200',
    city: user?.shippingAddress?.city || 'New York',
    state: user?.shippingAddress?.state || 'NY',
    postalCode: user?.shippingAddress?.postalCode || '10018',
    country: user?.shippingAddress?.country || 'United States'
  });

  const [billingAddress, setBillingAddress] = useState({
    addressLine1: user?.billingAddress?.addressLine1 || '450 Fashion Avenue, Suite 1200',
    city: user?.billingAddress?.city || 'New York',
    state: user?.billingAddress?.state || 'NY',
    postalCode: user?.billingAddress?.postalCode || '10018',
    country: user?.billingAddress?.country || 'United States'
  });

  const [saveMessage, setSaveMessage] = useState(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersData, quotesData] = await Promise.all([
          api.getOrders(user?.email),
          api.getQuotes(user?.email)
        ]);
        setOrders(ordersData);
        setQuotes(quotesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError(null);
    setSaveMessage(null);

    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setSaveError('Passwords do not match');
      return;
    }

    try {
      const payload = {
        name: profileForm.name,
        company: profileForm.company,
        phone: profileForm.phone,
        taxId: profileForm.taxId
      };
      if (profileForm.newPassword) payload.password = profileForm.newPassword;

      await api.updateProfile(payload);
      updateUser(payload);
      setSaveMessage('Profile information successfully updated!');
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err) {
      setSaveError(err.message || 'Failed to save profile');
    }
  };

  const handleSaveAddresses = async (e) => {
    e.preventDefault();
    setSaveError(null);
    setSaveMessage(null);
    try {
      await api.updateProfile({ shippingAddress, billingAddress });
      updateUser({ shippingAddress, billingAddress });
      setSaveMessage('Shipping and billing address book updated!');
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err) {
      setSaveError(err.message || 'Failed to save addresses');
    }
  };

  const pendingOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#191919] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#2C2C2C]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#C49A3A] font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Wholesale Customer Portal &bull; Account Management</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">
              {user ? `Welcome back, ${user.company || 'Wholesale Buyer'}` : 'Customer Dashboard'}
            </h1>
            <p className="text-xs text-[#D0C9BD] mt-1">
              Account ID: {user?.id || 'usr-guest'} &bull; Contact: {user?.email || 'buyer@boutiquejewels.com'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2.5 bg-[#C49A3A] hover:bg-[#A9812A] text-black font-bold text-xs rounded-xl transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Suite</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors border border-white/20 cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#C49A3A]" />
              <span>Order More Products</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#E9E3D8] shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Orders</span>
            <p className="text-2xl font-serif font-bold text-[#191919]">{orders.length}</p>
            <p className="text-xs text-gray-400">All lifetime purchases</p>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-[#E9E3D8] shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Active Orders</span>
            <p className="text-2xl font-serif font-bold text-[#8C6D2B]">{pendingOrdersCount}</p>
            <p className="text-xs text-gray-400">Processing or in-transit</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E9E3D8] shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">RFQ Quotations</span>
            <p className="text-2xl font-serif font-bold text-[#191919]">{quotes.length}</p>
            <p className="text-xs text-gray-400">Custom volume inquiries</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E9E3D8] shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Saved Wishlist</span>
            <p className="text-2xl font-serif font-bold text-[#C49A3A]">{wishlistCount}</p>
            <p className="text-xs text-gray-400">Bookmarked components</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E9E3D8] bg-white rounded-2xl p-1 shadow-xs mb-8 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-[#191919] text-[#C49A3A] font-bold shadow-xs' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'quotes' 
                ? 'bg-[#191919] text-[#C49A3A] font-bold shadow-xs' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quotation Requests ({quotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-[#191919] text-[#C49A3A] font-bold shadow-xs' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'addresses' 
                ? 'bg-[#191919] text-[#C49A3A] font-bold shadow-xs' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Address Book</span>
          </button>
        </div>

        {/* Global Alert Messages */}
        {saveMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}
        {saveError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E9E3D8] space-y-4">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-[#191919]">No Orders Placed Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Browse our natural gemstones, pave cubic zirconia, and lead-free pewter charms to place your first wholesale order.
                </p>
                <button
                  onClick={() => onNavigate('catalog', { category: 'all' })}
                  className="px-6 py-2.5 bg-[#191919] text-white text-xs font-bold rounded-xl hover:bg-[#303030]"
                >
                  Browse Wholesale Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-2xl border border-[#E9E3D8] p-5 shadow-xs hover:border-[#C49A3A]/60 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#191919]">{order.id}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            order.status === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Placed on: {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">Total Amount</span>
                          <span className="font-bold text-sm text-[#191919]">{formatPrice(order.total)}</span>
                        </div>
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="px-3 py-1.5 bg-[#F8F6F1] hover:bg-[#EAE4D5] text-[#303030] text-xs font-semibold rounded-lg border border-[#E9E3D8] flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C49A3A]" />
                          <span>View Invoice</span>
                        </button>
                      </div>
                    </div>

                    {/* Logistics tracking */}
                    <div className="flex flex-wrap items-center justify-between text-xs bg-[#F8F6F1] p-3 rounded-xl border border-[#E9E3D8] gap-2">
                      <div className="flex items-center gap-2 text-[#554F42]">
                        <Truck className="w-4 h-4 text-[#C49A3A]" />
                        <span>Courier: <strong>{order.courierName || 'DHL Express Worldwide'}</strong></span>
                      </div>
                      <div className="font-mono text-gray-600">
                        Tracking: <strong>{order.trackingNumber || 'EXP-98210491'}</strong>
                      </div>
                      <div className="text-[#8C6D2B] font-semibold text-[11px]">
                        Payment: {order.paymentStatus || 'Paid'} ({order.paymentMethod})
                      </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-[#F5F2EB]">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-10 h-10 object-cover rounded-lg border border-[#E9E3D8]" 
                            />
                            <div>
                              <p className="font-semibold text-[#191919]">{item.name}</p>
                              <p className="text-[10px] text-gray-500 font-mono">SKU: {item.sku} &bull; Qty: {item.quantity} packs</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#191919]">{formatPrice(item.price * (item.quantity || 1))}</span>
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

        {/* TAB 2: QUOTATION REQUESTS */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            {quotes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E9E3D8] space-y-4">
                <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-[#191919]">No Active Quotation Requests</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Need 500+ strands or bespoke casting? Submit custom target prices through our wholesale RFQ builder.
                </p>
                <button
                  onClick={() => onNavigate('quote')}
                  className="px-6 py-2.5 bg-[#191919] text-white text-xs font-bold rounded-xl hover:bg-[#303030]"
                >
                  Create Custom RFQ Quote
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div 
                    key={quote.id} 
                    className="bg-white rounded-2xl border border-[#E9E3D8] p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#191919]">{quote.id}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            quote.status === 'Approved' || quote.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {quote.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Requested on: {new Date(quote.date).toLocaleDateString()} &bull; Target Delivery: {quote.targetDeliveryDate}
                        </p>
                      </div>

                      {quote.counterOffer && (
                        <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E9E3D8] text-right">
                          <span className="text-[10px] text-gray-500 block">Administrator Approved Unit Rate</span>
                          <span className="text-base font-bold text-[#8C6D2B]">
                            {formatPrice(quote.counterOffer)} / unit
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Official Administrator Response Note */}
                    {quote.adminNotes && (
                      <div className="p-3.5 bg-[#F8F6F1] rounded-xl border border-[#E9E3D8] text-xs">
                        <span className="font-bold text-[#191919] block mb-0.5">Official Administrator Response Note:</span>
                        <p className="text-[#554F42] leading-relaxed">{quote.adminNotes}</p>
                      </div>
                    )}

                    {/* Requested Items */}
                    <div className="divide-y divide-[#F5F2EB]">
                      {quote.items?.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-[#191919]">{item.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono">
                              SKU: {item.sku} &bull; Requested Qty: {item.quantity} packs
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-500 block text-[10px]">Target Rate</span>
                            <span className="font-bold text-[#191919]">{formatPrice(item.targetPrice)} / unit</span>
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

        {/* TAB 3: PROFILE & CREDENTIALS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-8 border border-[#E9E3D8] shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#191919]">Wholesale Account Credentials</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your business contact details, resale certificates, and access credentials.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#303030] mb-1">Business Contact Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Company / Studio Legal Name</label>
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Resale Tax ID / GSTIN</label>
                  <input
                    type="text"
                    value={profileForm.taxId}
                    onChange={(e) => setProfileForm({ ...profileForm, taxId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#303030] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                />
              </div>

              <div className="pt-4 border-t border-[#F0EBE1] space-y-3">
                <span className="font-bold text-[#191919] block">Update Security Password (Optional)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={profileForm.newPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={profileForm.confirmPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4 text-[#C49A3A]" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: ADDRESS BOOK */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Default Shipping Address */}
            <div className="bg-white rounded-3xl p-7 border border-[#E9E3D8] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0EBE1]">
                <Truck className="w-4 h-4 text-[#C49A3A]" />
                <h3 className="font-serif font-bold text-lg text-[#191919]">Default Shipping Address</h3>
              </div>

              <form onSubmit={handleSaveAddresses} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#303030] mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#303030] mb-1">State / Province</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#303030] mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#303030] mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl transition-all cursor-pointer mt-2"
                >
                  Update Shipping Address
                </button>
              </form>
            </div>

            {/* Default Billing Address */}
            <div className="bg-white rounded-3xl p-7 border border-[#E9E3D8] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0EBE1]">
                <Building2 className="w-4 h-4 text-[#C49A3A]" />
                <h3 className="font-serif font-bold text-lg text-[#191919]">Commercial Billing Address</h3>
              </div>

              <form onSubmit={handleSaveAddresses} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Billing Street Address</label>
                  <input
                    type="text"
                    required
                    value={billingAddress.addressLine1}
                    onChange={(e) => setBillingAddress({ ...billingAddress, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#303030] mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#303030] mb-1">State / Province</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#303030] mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.postalCode}
                      onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#303030] mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl transition-all cursor-pointer mt-2"
                >
                  Update Billing Address
                </button>
              </form>
            </div>

          </div>
        )}

      </div>

      {/* INVOICE VIEW MODAL */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E9E3D8] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-[#191919] text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg">Commercial Tax Invoice</h3>
                <p className="text-xs text-[#C49A3A]">Order #{selectedOrderForInvoice.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="flex justify-between items-start pb-4 border-b border-[#E9E3D8]">
                <div>
                  <strong className="block text-sm text-[#191919]">BeadsSource Wholesale LLC</strong>
                  <span className="text-gray-500">Central International Logistics Center</span>
                  <span className="block text-gray-500">Export Registration: EXP-INT-998241</span>
                </div>
                <div className="text-right">
                  <p>Date: {new Date(selectedOrderForInvoice.date).toLocaleDateString()}</p>
                  <p>Status: <strong className="text-emerald-700">{selectedOrderForInvoice.status}</strong></p>
                  <p>Tracking: <strong className="font-mono">{selectedOrderForInvoice.trackingNumber}</strong></p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {selectedOrderForInvoice.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between">
                    <div>
                      <p className="font-semibold text-[#191919]">{item.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">SKU: {item.sku} &bull; Qty: {item.quantity} pk</p>
                    </div>
                    <p className="font-bold">{formatPrice(item.price * (item.quantity || 1))}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E9E3D8] space-y-1 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrderForInvoice.subtotal)}</span>
                </div>
                {selectedOrderForInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatPrice(selectedOrderForInvoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Worldwide Courier:</span>
                  <span>{formatPrice(selectedOrderForInvoice.shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#191919] pt-2 border-t border-[#E9E3D8]">
                  <span>Total Amount:</span>
                  <span>{formatPrice(selectedOrderForInvoice.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F8F6F1] border-t border-[#E9E3D8] flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white border border-[#E9E3D8] text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#C49A3A]" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-5 py-2 bg-[#191919] text-white text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
