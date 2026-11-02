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
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../utils/api';

export default function CustomerDashboardPage({ onNavigate }) {
  const { user, isAdmin } = useAuth();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'quotes', 'profile'
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#1C1A17] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#383227]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Wholesale Buyer Portal &bull; SP Bengaluru</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">
              {user ? `Welcome, ${user.name}` : 'Customer Dashboard'}
            </h1>
            <p className="text-xs text-[#C9C3B4] mt-1">
              {user?.company || 'Verified Wholesale Account'} &bull; {user?.email || 'buyer@boutiquejewels.com'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#AA771C] text-black font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Go to Admin Suite
              </button>
            )}
            <button
              onClick={() => onNavigate('catalog', { category: 'all' })}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors border border-white/20"
            >
              Order More Products
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-[#EAE4D5] bg-white rounded-2xl p-1 shadow-xs mb-8 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'orders' 
                ? 'bg-[#1C1A17] text-[#D4AF37] font-bold shadow-xs' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'quotes' 
                ? 'bg-[#1C1A17] text-[#D4AF37] font-bold shadow-xs' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>RFQ Quotations ({quotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'profile' 
                ? 'bg-[#1C1A17] text-[#D4AF37] font-bold shadow-xs' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Business Profile &bull; Tax Info</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#EAE4D5] shadow-xs space-y-3">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">No Orders Found</h3>
                <p className="text-xs text-gray-500">You haven't placed any wholesale orders yet.</p>
                <button
                  onClick={() => onNavigate('catalog', { category: 'all' })}
                  className="px-5 py-2.5 bg-[#1C1A17] text-[#D4AF37] text-xs font-bold rounded-xl"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-3xl p-6 border border-[#EAE4D5] shadow-xs hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0EBE1] gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-[#1A1A1A]">
                          Order #{order.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === 'Shipped' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : (order.status === 'Delivered' 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200')
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Placed on {new Date(order.date).toLocaleDateString()} &bull; Payment: {order.paymentMethod} ({order.paymentStatus})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-bold text-[#1A1A1A] block">
                          {formatPrice(order.total)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {order.items?.length || 0} product(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tracking info */}
                  {order.trackingNumber && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#C4A052]" />
                        <span className="font-semibold text-[#1A1A1A]">Courier Tracking Number:</span>
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#DDD6C8] font-bold text-[#8C6D2B]">
                          {order.trackingNumber}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500">DHL Express / FedEx Air Priority</span>
                    </div>
                  )}

                  {/* Items list */}
                  <div className="divide-y divide-[#F5F2EB]">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center gap-3 text-xs">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-white border border-[#EAE4D5]" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1A1A1A] truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            SKU: {item.sku} {item.finish && `• ${item.finish}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#1A1A1A]">{item.quantity} pk</span>
                          <p className="text-[10px] text-gray-500">{formatPrice(item.price)}/pk</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: RFQ Quotations */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            {quotes.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#EAE4D5] shadow-xs space-y-3">
                <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">No Quotation Requests</h3>
                <p className="text-xs text-gray-500">You haven't requested any custom bulk quotations yet.</p>
                <button
                  onClick={() => onNavigate('quote')}
                  className="px-5 py-2.5 bg-[#1C1A17] text-[#D4AF37] text-xs font-bold rounded-xl"
                >
                  Open RFQ Builder
                </button>
              </div>
            ) : (
              quotes.map((quote) => (
                <div 
                  key={quote.id} 
                  className="bg-white rounded-3xl p-6 border border-[#EAE4D5] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-[#1A1A1A]">
                          Quotation Request #{quote.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          quote.status === 'Approved' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {quote.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Requested: {new Date(quote.date).toLocaleDateString()} &bull; Target Delivery: {quote.targetDeliveryDate}
                      </p>
                    </div>

                    {quote.counterOffer && (
                      <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#DACFBA] text-right">
                        <span className="text-[10px] text-gray-500 block">Ramesh Sir Approved Rate</span>
                        <span className="text-base font-bold text-[#8C6D2B]">
                          {formatPrice(quote.counterOffer)} / unit
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Admin Note if responded */}
                  {quote.adminNotes && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D5] text-xs">
                      <span className="font-bold text-[#1A1A1A] block mb-0.5">Note from SP Bengaluru Desk:</span>
                      <p className="text-[#554F42]">{quote.adminNotes}</p>
                    </div>
                  )}

                  {/* Items in quote */}
                  <div className="divide-y divide-[#F5F2EB]">
                    {quote.items?.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            SKU: {item.sku} &bull; Target Rate: ${item.targetPrice || item.catalogPrice}
                          </p>
                        </div>
                        <span className="font-bold text-gray-700">{item.requestedQty} packs requested</span>
                      </div>
                    ))}
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Business Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-8 border border-[#EAE4D5] shadow-xs max-w-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A] pb-3 border-b border-[#F0EBE1]">
              Wholesale Business Profile
            </h3>

            <div className="space-y-3 text-xs text-[#524B3E]">
              <div className="flex justify-between py-2 border-b border-[#FAF7F0]">
                <span className="text-gray-500">Contact Name:</span>
                <span className="font-bold text-[#1A1A1A]">{user?.name || 'Authorized Buyer'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#FAF7F0]">
                <span className="text-gray-500">Company Name:</span>
                <span className="font-bold text-[#1A1A1A]">{user?.company || 'Boutique Studios LLC'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#FAF7F0]">
                <span className="text-gray-500">Business Email:</span>
                <span className="font-bold text-[#1A1A1A]">{user?.email || 'buyer@boutiquejewels.com'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#FAF7F0]">
                <span className="text-gray-500">Tax ID / GSTIN / Resale:</span>
                <span className="font-bold text-[#8C6D2B]">{user?.taxId || '29AABCU9603R1ZX'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#FAF7F0]">
                <span className="text-gray-500">Wholesale Tier Status:</span>
                <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                  Verified Tier 1 Manufacturer Partner
                </span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-[11px] text-gray-500">
                To update your tax exemption certificate or add authorized studio purchasers, please email wholesale@beadssource.com.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
