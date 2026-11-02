import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  Package, 
  ShoppingBag, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertTriangle, 
  Truck, 
  Tag, 
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import { api } from '../utils/api';
import { useCurrency } from '../context/CurrencyContext';

export default function AdminDashboardPage({ onNavigate, onRefreshCatalogue }) {
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders', 'quotes', 'coupons'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  // Product Add / Edit Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: 'natural-gemstone-beads',
    price: 3.50,
    salePrice: '',
    stock: 250,
    image: '',
    description: '',
    materials: 'Natural Gemstone',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true
  });

  // Quote Respond Modal State
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [respondingQuote, setRespondingQuote] = useState(null);
  const [quoteResponseForm, setQuoteResponseForm] = useState({
    status: 'Approved',
    counterOffer: '',
    adminNotes: ''
  });

  // Coupon Create Form
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 250,
    description: 'Special wholesale promotion'
  });

  const showAction = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, productsData, ordersData, quotesData, couponsData] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getOrders(),
        api.getQuotes(),
        api.getCoupons()
      ]);
      setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
      setQuotes(quotesData);
      setCoupons(couponsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- PRODUCT ACTIONS ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'natural-gemstone-beads',
      price: 3.50,
      salePrice: '',
      stock: 250,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      description: 'Hand-calibrated gemstone beads with uniform drill holes for jewelry designers.',
      materials: 'Natural Gemstone',
      isBestSeller: false,
      isNewArrival: true,
      isFeatured: true
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      price: prod.price,
      salePrice: prod.salePrice || '',
      stock: prod.stock,
      image: prod.image,
      description: prod.description || '',
      materials: prod.materials || '',
      isBestSeller: Boolean(prod.isBestSeller),
      isNewArrival: Boolean(prod.isNewArrival),
      isFeatured: Boolean(prod.isFeatured)
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm);
        showAction(`Updated "${productForm.name}" successfully!`);
      } else {
        await api.createProduct(productForm);
        showAction(`Created new product "${productForm.name}"!`);
      }
      setProductModalOpen(false);
      loadAllData();
      if (onRefreshCatalogue) onRefreshCatalogue();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      showAction(`Deleted "${name}"`);
      loadAllData();
      if (onRefreshCatalogue) onRefreshCatalogue();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStockAdjust = async (id, newStock) => {
    try {
      await api.updateProduct(id, { stock: Math.max(0, parseInt(newStock) || 0) });
      showAction('Stock adjusted');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- ORDER ACTIONS ---
  const handleUpdateOrderStatus = async (orderId, status, trackingNumber) => {
    try {
      await api.updateOrderStatus(orderId, { status, trackingNumber });
      showAction(`Order #${orderId} updated to ${status}`);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- QUOTE ACTIONS ---
  const handleOpenQuoteResponse = (q) => {
    setRespondingQuote(q);
    setQuoteResponseForm({
      status: q.status || 'Approved',
      counterOffer: q.counterOffer || (q.items && q.items[0]?.targetPrice) || '',
      adminNotes: q.adminNotes || 'Ramesh Sir wholesale volume pricing approved for production.'
    });
    setQuoteModalOpen(true);
  };

  const handleSaveQuoteResponse = async (e) => {
    e.preventDefault();
    try {
      await api.updateQuote(respondingQuote.id, {
        ...quoteResponseForm,
        counterOffer: parseFloat(quoteResponseForm.counterOffer) || null,
        responseSent: true
      });
      showAction(`Responded to Quotation #${respondingQuote.id}`);
      setQuoteModalOpen(false);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- COUPON ACTIONS ---
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    try {
      await api.createCoupon(newCoupon);
      showAction(`Coupon ${newCoupon.code} created!`);
      setNewCoupon({ code: '', discountType: 'percentage', discountValue: 15, minOrder: 250, description: '' });
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      
      {/* Admin Top Bar */}
      <div className="bg-[#141210] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#2D2821]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>SP Bengaluru Flagship Management</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">
              BeadsSource Executive Admin Suite
            </h1>
            <p className="text-xs text-[#B8B2A4] mt-1">
              Store Owner: Ramesh Sir &bull; Production, Orders, Wholesale RFQ, Inventory &amp; Analytics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/20 text-xs flex items-center gap-1.5"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
              <span>Sync</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B38F26] text-black font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Visit Storefront
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div className="bg-[#FAF3E0] border-b border-[#E8DCC0] p-3 text-center text-xs font-bold text-[#8C6D2B] animate-fade-in">
          {actionMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-[#EAE4D5] bg-white rounded-2xl p-1 shadow-xs mb-8 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Sales & KPI Overview', icon: DollarSign },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'quotes', label: `RFQ Quotes (${quotes.length})`, icon: FileText },
            { id: 'coupons', label: `Discount Coupons (${coupons.length})`, icon: Tag }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-[#1C1A17] text-[#D4AF37] font-bold shadow-xs' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 bg-white rounded-3xl border border-[#EAE4D5] shadow-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Gross Wholesale Revenue</span>
                <p className="text-3xl font-serif font-bold text-[#1A1A1A]">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-xs text-green-700 font-medium">From {stats.ordersCount} verified wholesale orders</p>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-[#EAE4D5] shadow-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pending RFQ Quotes</span>
                <p className="text-3xl font-serif font-bold text-[#8C6D2B]">{stats.pendingQuotes}</p>
                <p className="text-xs text-gray-500">Require Ramesh Sir pricing review</p>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-[#EAE4D5] shadow-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Inventory Stock</span>
                <p className="text-3xl font-serif font-bold text-[#1A1A1A]">{stats.totalStockUnits?.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Across {stats.productsCount} active SKUs</p>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-[#EAE4D5] shadow-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Low Stock SKUs (&lt;200)</span>
                <p className="text-3xl font-serif font-bold text-amber-700">{stats.lowStockCount}</p>
                <p className="text-xs text-amber-800 font-medium">Recommend factory re-casting</p>
              </div>

            </div>

            {/* Quick Action Tables: Recent Orders & Pending Quotes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Orders */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Recent Wholesale Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#8C6D2B] font-bold hover:underline">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-[#F5F2EB] text-xs">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#1A1A1A]">Order #{o.id}</p>
                        <p className="text-[11px] text-gray-500">{o.customer?.company || o.customer?.name} &bull; {new Date(o.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm block">{formatPrice(o.total)}</span>
                        <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending RFQ Quotes */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Pending Quotations (RFQ)</h3>
                  <button onClick={() => setActiveTab('quotes')} className="text-xs text-[#8C6D2B] font-bold hover:underline">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-[#F5F2EB] text-xs">
                  {quotes.slice(0, 5).map(q => (
                    <div key={q.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#1A1A1A]">RFQ #{q.id}</p>
                        <p className="text-[11px] text-gray-500">{q.customer?.company || q.customer?.name} &bull; {q.items?.length || 0} product(s)</p>
                      </div>
                      <button
                        onClick={() => handleOpenQuoteResponse(q)}
                        className="px-3 py-1 bg-[#1C1A17] text-[#D4AF37] rounded-lg text-xs font-semibold hover:bg-[#332E26]"
                      >
                        Review &amp; Quote
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EAE4D5]">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">Wholesale Products Catalogue</h3>
                <p className="text-xs text-gray-500">Manage SKUs, prices, stock levels and images</p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 bg-[#1C1A17] hover:bg-[#332E26] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Add New Wholesale Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-[#EAE4D5] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE4D5] text-[#3D372D] font-bold">
                    <tr>
                      <th className="p-3.5">Image &amp; Title</th>
                      <th className="p-3.5">SKU</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5 text-right">Price / pk</th>
                      <th className="p-3.5 text-center">Stock</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE1]">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover bg-white border border-[#EAE4D5] shrink-0" />
                          <div className="min-w-0">
                            <span className="font-semibold text-[#1A1A1A] block line-clamp-1">{prod.name}</span>
                            <span className="text-[10px] text-gray-400">{prod.materials}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-gray-500">{prod.sku}</td>
                        <td className="p-3.5 text-gray-600">{prod.category?.replace(/-/g, ' ')}</td>
                        <td className="p-3.5 text-right font-bold text-[#1A1A1A]">
                          {formatPrice(prod.salePrice || prod.price)}
                        </td>
                        <td className="p-3.5 text-center">
                          <input
                            type="number"
                            min="0"
                            value={prod.stock}
                            onChange={(e) => handleStockAdjust(prod.id, e.target.value)}
                            className="w-16 px-1.5 py-1 text-center font-bold bg-[#FAF8F5] border border-[#DDD6C8] rounded-md text-xs"
                          />
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit product"
                            >
                              <Edit3 className="w-4 h-4 text-[#8C6D2B]" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-[#EAE4D5]">
              <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">Orders &amp; Dispatch Fulfillment</h3>
              <p className="text-xs text-gray-500">Update fulfillment status and assign DHL / FedEx tracking numbers</p>
            </div>

            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-[#1A1A1A]">Order #{order.id}</span>
                        <span className="text-xs bg-[#FAF5E8] text-[#8C6D2B] px-2.5 py-0.5 rounded-full font-bold">
                          {order.paymentMethod} &bull; {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.customer?.company || order.customer?.name} &bull; {order.customer?.email} &bull; {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value, order.trackingNumber)}
                        className="px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs font-bold text-[#1A1A1A] cursor-pointer"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <span className="text-base font-bold text-[#1A1A1A]">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Tracking input */}
                  <div className="flex items-center gap-2 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE4D5]">
                    <Truck className="w-4 h-4 text-[#C4A052]" />
                    <span className="font-semibold text-gray-600">Tracking Code:</span>
                    <input
                      type="text"
                      defaultValue={order.trackingNumber || ''}
                      onBlur={(e) => handleUpdateOrderStatus(order.id, order.status, e.target.value)}
                      placeholder="e.g. DHL-EXP-992014856"
                      className="px-2 py-1 bg-white border border-[#DDD6C8] rounded text-xs font-mono font-bold"
                    />
                    <span className="text-[10px] text-gray-400 ml-auto">Click away to save tracking</span>
                  </div>

                  {/* Items */}
                  <div className="text-xs text-gray-600 space-y-1">
                    {order.items?.map((it, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{it.quantity}x {it.name} ({it.sku})</span>
                        <span className="font-semibold text-black">{formatPrice(it.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: QUOTATIONS (RFQ) MANAGEMENT */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-[#EAE4D5]">
              <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">Wholesale Quotation Requests (RFQ)</h3>
              <p className="text-xs text-gray-500">Respond with Ramesh Sir approved volume discount pricing</p>
            </div>

            <div className="space-y-4">
              {quotes.map(q => (
                <div key={q.id} className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-[#1A1A1A]">Quotation #{q.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          q.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Client: <strong>{q.customer?.name}</strong> &bull; {q.customer?.company} &bull; {q.customer?.country}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenQuoteResponse(q)}
                      className="px-4 py-2 bg-[#1C1A17] hover:bg-[#332E26] text-[#D4AF37] font-bold text-xs rounded-xl transition-colors"
                    >
                      Respond / Approve Quote
                    </button>
                  </div>

                  {/* Target budget & notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE4D5]">
                    <div>
                      <span className="text-gray-500 block">Target Budget:</span>
                      <span className="font-semibold text-black">{q.targetBudget}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Target Delivery Date:</span>
                      <span className="font-semibold text-black">{q.targetDeliveryDate}</span>
                    </div>
                    {q.comments && (
                      <div className="sm:col-span-2 pt-1 border-t border-[#EAE4D5]">
                        <span className="text-gray-500 block">Client Remarks:</span>
                        <p className="italic text-gray-700">{q.comments}</p>
                      </div>
                    )}
                  </div>

                  {/* Line items in RFQ */}
                  <div className="divide-y divide-[#F5F2EB] text-xs">
                    {q.items?.map((it, i) => (
                      <div key={i} className="py-2 flex justify-between">
                        <div>
                          <span className="font-semibold text-black">{it.name}</span>
                          <span className="text-gray-400 font-mono text-[10px] ml-2">SKU: {it.sku}</span>
                        </div>
                        <span className="font-bold">{it.requestedQty} pk @ target ${it.targetPrice || it.catalogPrice}</span>
                      </div>
                    ))}
                  </div>

                  {q.counterOffer && (
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-xs text-green-800">
                      <strong>Approved Counter-Offer:</strong> ${q.counterOffer} / unit &bull; <em>{q.adminNotes}</em>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COUPONS MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            
            {/* Create Coupon Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE4D5] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A] pb-2 border-b border-[#F0EBE1]">
                Create New Wholesale Discount Coupon
              </h3>
              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. EXPORT15"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseFloat(e.target.value) || 10 })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Min Order ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCoupon.minOrder}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: parseFloat(e.target.value) || 100 })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-bold"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1C1A17] hover:bg-[#332E26] text-[#D4AF37] font-bold text-xs rounded-xl"
                  >
                    Activate Coupon
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Coupons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {coupons.map((c, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-[#EAE4D5] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold bg-[#FAF5E8] text-[#8C6D2B] px-2.5 py-1 rounded border border-[#E8DCC0]">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#1A1A1A]">
                    {c.discountType === 'percentage' ? `${c.discountValue}% Off Wholesale` : 'Free Worldwide Shipping'}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Min Order: {formatPrice(c.minOrder)} &bull; {c.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* Product Add / Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setProductModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EAE4D5] p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D5]">
              <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">
                {editingProduct ? 'Edit Wholesale Product' : 'Add New Wholesale Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-medium"
                  >
                    <option value="natural-gemstone-beads">Natural Gemstone Beads</option>
                    <option value="turquoise-beads">Turquoise Beads</option>
                    <option value="crystal-beads">Crystal Beads</option>
                    <option value="cubic-zirconia">Cubic Zirconia (CZ)</option>
                    <option value="jewelry-pendants">Jewelry Pendants</option>
                    <option value="jewelry-connectors">Jewelry Connectors</option>
                    <option value="jewelry-spacers">Jewelry Spacers</option>
                    <option value="jewelry-findings">Jewelry Findings</option>
                    <option value="handmade-necklaces">Handmade Necklaces</option>
                    <option value="handmade-bracelets">Handmade Bracelets</option>
                    <option value="charms">Charms</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Wholesale Price ($/pk) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Sale Price ($/pk, optional)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D372E] mb-1">Inventory Stock (Units) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#3D372E] mb-1">Product Image URL *</label>
                  <input
                    type="url"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#3D372E] mb-1">Description</label>
                  <textarea
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                  />
                  <span>Mark Best Seller</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNewArrival}
                    onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                  />
                  <span>Mark New Arrival</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  />
                  <span>Featured Collection</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#EAE4D5] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1C1A17] hover:bg-[#332E26] text-white font-bold rounded-xl flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>Save Wholesale Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Response Modal */}
      {quoteModalOpen && respondingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setQuoteModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#EAE4D5] p-6 z-10 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D5]">
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
                Respond to RFQ #{respondingQuote.id}
              </h3>
              <button onClick={() => setQuoteModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuoteResponse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D372E] mb-1">Status</label>
                <select
                  value={quoteResponseForm.status}
                  onChange={(e) => setQuoteResponseForm({ ...quoteResponseForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-bold"
                >
                  <option value="Approved">Approved</option>
                  <option value="Counter-Offered">Counter-Offered</option>
                  <option value="In Review">In Review</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#3D372E] mb-1">Approved Unit Rate ($ USD)</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={quoteResponseForm.counterOffer}
                  onChange={(e) => setQuoteResponseForm({ ...quoteResponseForm, counterOffer: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D372E] mb-1">Note from Ramesh Sir / Factory Desk</label>
                <textarea
                  rows="3"
                  required
                  value={quoteResponseForm.adminNotes}
                  onChange={(e) => setQuoteResponseForm({ ...quoteResponseForm, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1C1A17] text-[#D4AF37] font-bold rounded-xl"
                >
                  Transmit Official Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
