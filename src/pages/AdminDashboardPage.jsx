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
  ExternalLink,
  Users,
  Layers,
  Settings,
  HelpCircle,
  BarChart2,
  List,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Menu,
  Download,
  Filter,
  Save,
  MessageSquare,
  Lock,
  Archive,
  Star,
  Activity,
  Globe
} from 'lucide-react';
import { api } from '../utils/api';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage({ onNavigate, onRefreshCatalogue, initialTab = 'overview' }) {
  const { formatPrice } = useCurrency();
  const { user, userRole, isSuperAdmin, hasPermission, startImpersonating, setViewMode } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Data
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);
  const [siteContent, setSiteContent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: 'natural-gemstone-beads',
    price: 3.50,
    salePrice: '',
    stock: 250,
    lowStockThreshold: 200,
    status: 'published',
    image: '',
    images: [''],
    description: '',
    materials: 'Natural Gemstone',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    itemCount: 0
  });

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [respondingQuote, setRespondingQuote] = useState(null);
  const [quoteResponseForm, setQuoteResponseForm] = useState({
    status: 'Approved',
    counterOffer: '',
    adminNotes: ''
  });

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusForm, setOrderStatusForm] = useState({
    status: 'Processing',
    paymentStatus: 'Paid',
    trackingNumber: '',
    courierName: 'DHL Express Worldwide',
    internalNotes: ''
  });

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    company: '',
    phone: '',
    taxId: '',
    status: 'active',
    wholesaleApproved: true
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 250,
    description: 'Wholesale promotion'
  });

  // Help topic selection
  const [selectedHelpTopic, setSelectedHelpTopic] = useState('overview');

  const showAction = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        statsData, 
        productsData, 
        categoriesData, 
        ordersData, 
        quotesData, 
        customersData,
        couponsData,
        reviewsData,
        logsData,
        settingsData,
        contentData
      ] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getQuotes(),
        api.getUsers(),
        api.getCoupons(),
        api.getReviews(),
        api.getAuditLogs(),
        api.getSettings(),
        api.getContent()
      ]);

      setStats(statsData);
      setProducts(productsData);
      setCategories(categoriesData);
      setOrders(ordersData);
      setQuotes(quotesData);
      setCustomers(customersData);
      setCoupons(couponsData);
      setReviews(reviewsData);
      setAuditLogs(logsData);
      setStoreSettings(settingsData);
      setSiteContent(contentData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- PRODUCT MANAGEMENT ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'natural-gemstone-beads',
      price: 3.50,
      salePrice: '',
      stock: 250,
      lowStockThreshold: 200,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
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
      lowStockThreshold: prod.lowStockThreshold || 200,
      status: prod.status || 'published',
      image: prod.image,
      images: prod.images || [prod.image],
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
        showAction(`Product "${productForm.name}" updated successfully!`);
      } else {
        await api.createProduct(productForm);
        showAction(`Created new product "${productForm.name}"!`);
      }
      setProductModalOpen(false);
      loadAllData();
      if (onRefreshCatalogue) onRefreshCatalogue();
    } catch (err) {
      alert(err.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (prodId, prodName) => {
    if (window.confirm(`Are you sure you want to permanently delete "${prodName}"?`)) {
      try {
        await api.deleteProduct(prodId);
        showAction(`Deleted "${prodName}" from catalogue`);
        loadAllData();
        if (onRefreshCatalogue) onRefreshCatalogue();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  // --- CATEGORY MANAGEMENT ---
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      description: 'Fine wholesale category',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      itemCount: 0
    });
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug || cat.id,
      description: cat.description || '',
      image: cat.image || '',
      itemCount: cat.itemCount || 0
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, categoryForm);
        showAction(`Category "${categoryForm.name}" updated!`);
      } else {
        await api.createCategory(categoryForm);
        showAction(`Category "${categoryForm.name}" created!`);
      }
      setCategoryModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Error saving category');
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      try {
        await api.deleteCategory(catId);
        showAction(`Deleted category "${catName}"`);
        loadAllData();
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  // --- INVENTORY STOCK UPDATE ---
  const handleUpdateStockQuick = async (prodId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await api.updateInventory(prodId, { stock: newStock });
      setProducts(prev => prev.map(p => p.id === prodId ? { ...p, stock: newStock } : p));
      showAction(`Stock adjusted to ${newStock} units`);
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  // --- ORDER MANAGEMENT ---
  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order);
    setOrderStatusForm({
      status: order.status || 'Processing',
      paymentStatus: order.paymentStatus || 'Paid',
      trackingNumber: order.trackingNumber || '',
      courierName: order.courierName || 'DHL Express Worldwide',
      internalNotes: order.internalNotes || ''
    });
    setOrderModalOpen(true);
  };

  const handleSaveOrderStatus = async (e) => {
    e.preventDefault();
    try {
      await api.updateOrderStatus(selectedOrder.id, orderStatusForm);
      showAction(`Order ${selectedOrder.id} updated!`);
      setOrderModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // --- QUOTATION MANAGEMENT ---
  const handleOpenQuoteModal = (q) => {
    setRespondingQuote(q);
    setQuoteResponseForm({
      status: q.status || 'Approved',
      counterOffer: q.counterOffer || (q.items && q.items[0]?.targetPrice) || '',
      adminNotes: q.adminNotes || 'Wholesale volume pricing approved for production.'
    });
    setQuoteModalOpen(true);
  };

  const handleSaveQuoteResponse = async (e) => {
    e.preventDefault();
    try {
      await api.updateQuote(respondingQuote.id, {
        status: quoteResponseForm.status,
        counterOffer: parseFloat(quoteResponseForm.counterOffer) || null,
        adminNotes: quoteResponseForm.adminNotes,
        responseSent: true
      });
      showAction(`Responded to RFQ ${respondingQuote.id}!`);
      setQuoteModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Failed to update quotation');
    }
  };

  // --- CUSTOMER & USER MANAGEMENT ---
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'customer',
      company: '',
      phone: '',
      taxId: '',
      status: 'active',
      wholesaleApproved: true
    });
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setUserForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      company: u.company || '',
      phone: u.phone || '',
      taxId: u.taxId || '',
      status: u.status || 'active',
      wholesaleApproved: Boolean(u.wholesaleApproved)
    });
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, userForm);
        showAction(`Updated user account ${userForm.email}`);
      } else {
        await api.createUser(userForm);
        showAction(`Created new user ${userForm.email}`);
      }
      setUserModalOpen(false);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Error saving user');
    }
  };

  // --- REVIEWS MANAGEMENT ---
  const handleToggleReviewStatus = async (reviewId, newStatus) => {
    try {
      await api.updateReviewStatus(reviewId, newStatus);
      showAction(`Review status set to ${newStatus}`);
      loadAllData();
    } catch (err) {
      alert('Failed to update review status');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Delete this product review?')) {
      try {
        await api.deleteReview(reviewId);
        showAction('Review removed');
        loadAllData();
      } catch (err) {
        alert('Failed to delete review');
      }
    }
  };

  // --- STORE SETTINGS SAVE ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(storeSettings);
      showAction('Store settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  // --- CONTENT / CMS SAVE ---
  const handleSaveContent = async (e) => {
    e.preventDefault();
    try {
      await api.updateContent(siteContent);
      showAction('Website content and announcements updated!');
    } catch (err) {
      alert('Failed to save content');
    }
  };

  // --- COUPON CREATE ---
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    try {
      await api.createCoupon(newCoupon);
      showAction(`Coupon code ${newCoupon.code} created!`);
      setNewCoupon({
        code: '',
        discountType: 'percentage',
        discountValue: 15,
        minOrder: 250,
        description: 'Wholesale promotion'
      });
      loadAllData();
    } catch (err) {
      alert('Failed to create coupon');
    }
  };

  // Export CSV Helper
  const handleExportCSV = (dataType) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (dataType === 'orders') {
      csvContent += "Order ID,Date,Customer,Email,Total,Payment Status,Order Status,Tracking\n";
      orders.forEach(o => {
        csvContent += `"${o.id}","${o.date}","${o.customer?.name || ''}","${o.customer?.email || ''}","${o.total}","${o.paymentStatus}","${o.status}","${o.trackingNumber}"\n`;
      });
    } else if (dataType === 'products') {
      csvContent += "ID,SKU,Name,Category,Price,Sale Price,Stock,Materials\n";
      products.forEach(p => {
        csvContent += `"${p.id}","${p.sku}","${p.name.replace(/"/g, '""')}","${p.category}","${p.price}","${p.salePrice || ''}","${p.stock}","${p.materials || ''}"\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `beadssource_${dataType}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: <BarChart2 className="w-4 h-4" />, perm: 'dashboard' },
    { id: 'products', label: 'Products', icon: <Archive className="w-4 h-4" />, count: products.length, perm: 'products' },
    { id: 'categories', label: 'Categories', icon: <List className="w-4 h-4" />, count: categories.length, perm: 'categories' },
    { id: 'inventory', label: 'Inventory', icon: <Layers className="w-4 h-4" />, alert: stats?.lowStockCount, perm: 'inventory' },
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" />, count: orders.length, perm: 'orders' },
    { id: 'quotes', label: 'Quotations', icon: <FileText className="w-4 h-4" />, alert: stats?.pendingQuotes, perm: 'quotes' },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" />, count: customers.length, perm: 'customers' },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" />, count: reviews.length, perm: 'reviews' },
    { id: 'content', label: 'Content (CMS)', icon: <Globe className="w-4 h-4" />, perm: 'content' },
    { id: 'coupons', label: 'Promotions', icon: <Tag className="w-4 h-4" />, count: coupons.length, perm: 'orders' },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart2 className="w-4 h-4" />, perm: 'reports' },
    { id: 'users', label: 'Roles & Staff', icon: <ShieldCheck className="w-4 h-4" />, perm: 'roles' },
    { id: 'settings', label: 'Store Settings', icon: <Settings className="w-4 h-4" />, perm: 'settings' },
    { id: 'audit', label: 'Activity Logs', icon: <Activity className="w-4 h-4" />, perm: 'audit' },
    { id: 'help', label: 'System Guide', icon: <HelpCircle className="w-4 h-4" />, perm: 'help' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="bg-[#191919] text-white px-4 sm:px-6 py-3.5 border-b border-[#2C2C2C] flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2C2C2C] transition-colors"
            title="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#191919] via-[#2A2A2A] to-[#C49A3A] flex items-center justify-center font-serif font-bold text-sm text-[#F8F6F1] border border-[#C49A3A]/40">
              B
            </div>
            <div>
              <span className="font-serif font-bold text-sm tracking-tight text-white block">
                BeadsSource <span className="text-[#C49A3A]">Admin Management</span>
              </span>
              <span className="text-[10px] text-gray-400 block -mt-0.5">Enterprise Administration Suite</span>
            </div>
          </div>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 text-[#D0C9BD] bg-[#252525] px-3 py-1.5 rounded-full border border-[#3A3A3A]">
            <span className="text-[#C49A3A] font-bold">👑</span>
            <span>Role: <strong className="text-white capitalize">{userRole.replace(/_/g, ' ')}</strong></span>
          </div>

          <button
            onClick={() => {
              setViewMode('customer');
              onNavigate('dashboard');
            }}
            className="px-3 py-1.5 bg-[#252525] hover:bg-[#353535] text-[#D0C9BD] hover:text-white rounded-lg transition-colors border border-[#3A3A3A] flex items-center gap-1.5 cursor-pointer"
            title="Inspect Customer Experience & Orders"
          >
            <Users className="w-3.5 h-3.5 text-[#C49A3A]" />
            <span className="hidden md:inline">Customer Portal View</span>
          </button>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="p-2 bg-[#252525] hover:bg-[#353535] text-[#D0C9BD] hover:text-white rounded-lg transition-colors border border-[#3A3A3A] cursor-pointer"
            title="Sync live data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="px-3.5 py-1.5 bg-[#C49A3A] hover:bg-[#A9812A] text-black font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#191919] text-[#D0C9BD] border-r border-[#2C2C2C] flex flex-col shrink-0 transition-all duration-200 hidden md:flex select-none`}>
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            {sidebarItems.map(item => {
              if (!hasPermission(item.perm)) return null;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSearchFilter(''); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#C49A3A] text-black shadow-sm font-bold' 
                      : 'hover:bg-[#282828] hover:text-white text-[#D0C9BD]'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={isActive ? 'text-black' : 'text-[#C49A3A]'}>{item.icon}</span>
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!sidebarCollapsed && (
                    <div className="flex items-center gap-1.5">
                      {item.alert !== undefined && item.alert > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-black text-[#C49A3A]' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {item.alert}
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-black/20 text-black' : 'text-gray-400'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {!sidebarCollapsed && (
            <div className="p-4 border-t border-[#2C2C2C] text-[11px] text-gray-400 space-y-1">
              <p className="font-semibold text-white">Administrator Access</p>
              <p className="truncate">Active Session &bull; RBAC Protected</p>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Breadcrumb Navigation & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3D8]">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('overview')}>Admin</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[#191919] font-bold capitalize">{activeTab.replace(/_/g, ' ')}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191919] capitalize">
                {activeTab === 'overview' ? 'Executive Dashboard & KPIs' : `${activeTab.replace(/_/g, ' ')} Management`}
              </h2>
            </div>

            {/* Global Flash Action Message */}
            {actionMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium shadow-sm animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionMessage}</span>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* TAB 1: EXECUTIVE DASHBOARD OVERVIEW */}
          {/* ========================================================= */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8">
              
              {/* Primary KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E9E3D8] shadow-xs space-y-1.5">
                  <div className="flex justify-between items-center text-gray-500">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Gross Wholesale Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#C49A3A]" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-[#191919]">{formatPrice(stats.totalRevenue)}</p>
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                    <span>+18.4%</span> &bull; <span>From verified B2B orders</span>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E3D8] shadow-xs space-y-1.5">
                  <div className="flex justify-between items-center text-gray-500">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Total Purchase Orders</span>
                    <Package className="w-4 h-4 text-[#C49A3A]" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-[#191919]">{stats.ordersCount}</p>
                  <p className="text-[11px] text-amber-700 font-semibold">
                    {stats.pendingOrders || 0} currently processing
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E3D8] shadow-xs space-y-1.5">
                  <div className="flex justify-between items-center text-gray-500">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Pending RFQ Quotes</span>
                    <FileText className="w-4 h-4 text-[#C49A3A]" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-[#8C6D2B]">{stats.pendingQuotes}</p>
                  <p className="text-[11px] text-gray-500">
                    Require administrator pricing review
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E3D8] shadow-xs space-y-1.5">
                  <div className="flex justify-between items-center text-gray-500">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Total Inventory Stock</span>
                    <Layers className="w-4 h-4 text-[#C49A3A]" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-[#191919]">{stats.totalStockUnits?.toLocaleString()}</p>
                  <p className="text-[11px] text-gray-500">Across {stats.productsCount} catalog SKUs</p>
                </div>
              </div>

              {/* Secondary Metric Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E9E3D8] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500 block">Low Stock Alerts (&lt;200 units)</span>
                    <strong className="text-lg text-red-600">{stats.lowStockCount} SKUs</strong>
                  </div>
                  <button 
                    onClick={() => setActiveTab('inventory')}
                    className="px-3 py-1.5 bg-white border border-[#E9E3D8] rounded-xl font-semibold text-xs hover:bg-[#F8F6F1]"
                  >
                    View Low Stock &rarr;
                  </button>
                </div>

                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E9E3D8] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500 block">Registered Customers</span>
                    <strong className="text-lg text-[#191919]">{stats.usersCount} B2B Accounts</strong>
                  </div>
                  <button 
                    onClick={() => setActiveTab('customers')}
                    className="px-3 py-1.5 bg-white border border-[#E9E3D8] rounded-xl font-semibold text-xs hover:bg-[#F8F6F1]"
                  >
                    Manage Users &rarr;
                  </button>
                </div>

                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E9E3D8] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500 block">Active Promotions &amp; Coupons</span>
                    <strong className="text-lg text-[#8C6D2B]">{coupons.length} Active Codes</strong>
                  </div>
                  <button 
                    onClick={() => setActiveTab('coupons')}
                    className="px-3 py-1.5 bg-white border border-[#E9E3D8] rounded-xl font-semibold text-xs hover:bg-[#F8F6F1]"
                  >
                    View Coupons &rarr;
                  </button>
                </div>
              </div>

              {/* Recent Orders & Quotations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Recent Orders */}
                <div className="bg-white rounded-3xl p-6 border border-[#E9E3D8] shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#F0EBE1]">
                    <h3 className="font-serif font-bold text-lg text-[#191919]">Recent Purchase Orders</h3>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#C49A3A] hover:underline"
                    >
                      View All Orders ({orders.length}) &rarr;
                    </button>
                  </div>

                  <div className="divide-y divide-[#F5F2EB]">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#191919]">{o.id}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {o.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{o.customer?.company || o.customer?.name} &bull; {o.items?.length || 0} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#191919]">{formatPrice(o.total)}</p>
                          <p className="text-[10px] text-gray-400">{new Date(o.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Quotation Requests */}
                <div className="bg-white rounded-3xl p-6 border border-[#E9E3D8] shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#F0EBE1]">
                    <h3 className="font-serif font-bold text-lg text-[#191919]">Pending Quotation RFQs</h3>
                    <button 
                      onClick={() => setActiveTab('quotes')}
                      className="text-xs font-semibold text-[#C49A3A] hover:underline"
                    >
                      View All RFQs ({quotes.length}) &rarr;
                    </button>
                  </div>

                  <div className="divide-y divide-[#F5F2EB]">
                    {quotes.slice(0, 5).map(q => (
                      <div key={q.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#191919]">{q.id}</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              {q.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{q.customer?.company || q.customer?.name} &bull; {q.items?.length || 0} items</p>
                        </div>
                        <button
                          onClick={() => handleOpenQuoteModal(q)}
                          className="px-3 py-1 bg-[#191919] text-white text-[11px] font-semibold rounded-lg hover:bg-[#303030]"
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

          {/* ========================================================= */}
          {/* TAB 2: PRODUCT MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E9E3D8]">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter products by name, SKU, or materials..."
                    className="w-full pl-9 pr-3 py-2 bg-[#F8F6F1] border border-[#E9E3D8] rounded-xl text-xs focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportCSV('products')}
                    className="px-3 py-2 bg-[#F8F6F1] hover:bg-[#EAE4D5] text-[#303030] text-xs font-semibold rounded-xl border border-[#E9E3D8] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 bg-[#191919] hover:bg-[#303030] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#C49A3A]" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Product Data Table */}
              <div className="bg-white rounded-3xl border border-[#E9E3D8] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F6F1] border-b border-[#E9E3D8] text-gray-600 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Product / SKU</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Wholesale Price</th>
                        <th className="py-3 px-4">Stock Level</th>
                        <th className="py-3 px-4">Badges</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE1]">
                      {products
                        .filter(p => !searchFilter || p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.sku.toLowerCase().includes(searchFilter.toLowerCase()))
                        .map(prod => (
                          <tr key={prod.id} className="hover:bg-[#FAF8F5] transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-lg border border-[#E9E3D8] shrink-0" />
                                <div>
                                  <p className="font-semibold text-[#191919] text-xs max-w-xs truncate">{prod.name}</p>
                                  <span className="font-mono text-[10px] bg-[#EFECE6] text-[#555047] px-1.5 py-0.5 rounded font-bold">
                                    {prod.sku}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 capitalize">
                              {prod.category.replace(/-/g, ' ')}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-[#191919]">{formatPrice(prod.price)}</p>
                              {prod.salePrice && <span className="text-[10px] text-red-600">Sale: {formatPrice(prod.salePrice)}</span>}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`font-bold ${prod.stock < (prod.lowStockThreshold || 200) ? 'text-red-600' : 'text-emerald-700'}`}>
                                {prod.stock} packs
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1 flex-wrap">
                                {prod.isBestSeller && <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Best</span>}
                                {prod.isNewArrival && <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">New</span>}
                                {prod.isFeatured && <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">Featured</span>}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-1.5 text-gray-600 hover:text-[#C49A3A] hover:bg-[#F8F6F1] rounded-lg transition-colors cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Product"
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

          {/* ========================================================= */}
          {/* TAB 3: CATEGORY MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#E9E3D8]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#191919]">Wholesale Product Categories</h3>
                  <p className="text-xs text-gray-500">Manage catalogue taxonomy, banners, and descriptions</p>
                </div>
                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-[#191919] hover:bg-[#303030] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C49A3A]" />
                  <span>Create Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white rounded-3xl border border-[#E9E3D8] overflow-hidden shadow-xs hover:border-[#C49A3A] transition-all space-y-3">
                    <img src={cat.image} alt={cat.name} className="w-full h-36 object-cover" />
                    <div className="p-5 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-base text-[#191919]">{cat.name}</h4>
                        <span className="text-[10px] bg-[#F8F6F1] px-2 py-0.5 rounded font-mono text-gray-500">{cat.slug}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{cat.description || 'Premium wholesale category'}</p>
                      
                      <div className="pt-3 border-t border-[#F0EBE1] flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-medium">Catalog items: {products.filter(p => p.category === cat.slug || p.category === cat.id).length}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditCategory(cat)}
                            className="p-1 text-gray-600 hover:text-[#C49A3A]"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: INVENTORY MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E9E3D8]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#191919]">Warehouse Stock Levels &amp; Low-Stock Alerts</h3>
                  <p className="text-xs text-gray-500">Real-time SKU quantities with restock multipliers</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{stats?.lowStockCount || 0} Low Stock Items</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#E9E3D8] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F6F1] border-b border-[#E9E3D8] text-gray-600 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">SKU / Component</th>
                        <th className="py-3 px-4">Current Stock</th>
                        <th className="py-3 px-4">Threshold Alert</th>
                        <th className="py-3 px-4">Stock Status</th>
                        <th className="py-3 px-4 text-right">Quick Restock Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE1]">
                      {products.map(prod => {
                        const isLow = prod.stock < (prod.lowStockThreshold || 200);
                        return (
                          <tr key={prod.id} className="hover:bg-[#FAF8F5]">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-[#E9E3D8]" />
                                <div>
                                  <strong className="block text-[#191919]">{prod.name}</strong>
                                  <span className="font-mono text-[10px] text-gray-500">{prod.sku}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-sm">
                              {prod.stock} pk
                            </td>
                            <td className="py-3 px-4 text-gray-500">
                              {prod.lowStockThreshold || 200} pk
                            </td>
                            <td className="py-3 px-4">
                              {isLow ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                                  Low Stock Warning
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  Adequate
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleUpdateStockQuick(prod.id, prod.stock, 50)}
                                  className="px-2.5 py-1 bg-[#F8F6F1] hover:bg-[#EAE4D5] text-[#303030] text-[11px] font-bold rounded-lg border border-[#E9E3D8]"
                                >
                                  +50
                                </button>
                                <button
                                  onClick={() => handleUpdateStockQuick(prod.id, prod.stock, 200)}
                                  className="px-2.5 py-1 bg-[#191919] hover:bg-[#303030] text-white text-[11px] font-bold rounded-lg"
                                >
                                  +200
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: ORDER MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E9E3D8]">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by Order ID, buyer email, company..."
                    className="w-full pl-9 pr-3 py-2 bg-[#F8F6F1] border border-[#E9E3D8] rounded-xl text-xs focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportCSV('orders')}
                    className="px-3 py-2 bg-[#F8F6F1] hover:bg-[#EAE4D5] text-[#303030] text-xs font-semibold rounded-xl border border-[#E9E3D8] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#E9E3D8] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F6F1] border-b border-[#E9E3D8] text-gray-600 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Order ID &amp; Date</th>
                        <th className="py-3 px-4">Customer / Studio</th>
                        <th className="py-3 px-4">Items / Units</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Fulfillment Status</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE1]">
                      {orders
                        .filter(o => !searchFilter || o.id.toLowerCase().includes(searchFilter.toLowerCase()) || o.customer?.email?.toLowerCase().includes(searchFilter.toLowerCase()) || o.customer?.company?.toLowerCase().includes(searchFilter.toLowerCase()))
                        .map(order => (
                          <tr key={order.id} className="hover:bg-[#FAF8F5]">
                            <td className="py-3 px-4">
                              <strong className="block text-[#191919]">{order.id}</strong>
                              <span className="text-[10px] text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-[#191919]">{order.customer?.company || order.customer?.name}</p>
                              <span className="text-[10px] text-gray-500">{order.customer?.email}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-gray-600">{order.items?.length || 0} line items</span>
                            </td>
                            <td className="py-3 px-4 font-bold text-[#191919]">
                              {formatPrice(order.total)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.status === 'Delivered' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[11px] font-medium text-gray-700">{order.paymentStatus || 'Paid'}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleOpenOrderModal(order)}
                                className="px-3 py-1 bg-[#191919] hover:bg-[#303030] text-white text-[11px] font-semibold rounded-lg cursor-pointer"
                              >
                                Manage Order
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: QUOTATION MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-[#E9E3D8]">
                <h3 className="font-serif font-bold text-lg text-[#191919]">Wholesale Quotation Requests (RFQ)</h3>
                <p className="text-xs text-gray-500">Review buyer requested unit rates and respond with counter-offers</p>
              </div>

              <div className="space-y-4">
                {quotes.map(q => (
                  <div key={q.id} className="bg-white rounded-3xl p-6 border border-[#E9E3D8] shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-base font-serif text-[#191919]">{q.id}</strong>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            {q.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Buyer: <strong>{q.customer?.name}</strong> &bull; {q.customer?.company} ({q.customer?.email})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenQuoteModal(q)}
                          className="px-4 py-2 bg-[#191919] hover:bg-[#303030] text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Respond with Counter-Offer
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F8F6F1] p-3.5 rounded-2xl border border-[#E9E3D8]">
                      <div>
                        <span className="text-gray-500 block">Target Budget:</span>
                        <strong className="text-[#191919]">{q.targetBudget}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Target Delivery:</span>
                        <strong className="text-[#191919]">{q.targetDeliveryDate}</strong>
                      </div>
                    </div>

                    <div className="divide-y divide-[#F5F2EB]">
                      {q.items?.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-[#191919]">{item.name}</p>
                            <span className="text-[10px] text-gray-500 font-mono">SKU: {item.sku} &bull; Qty: {item.quantity} packs</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-500 text-[10px] block">Buyer Target Unit Rate</span>
                            <span className="font-bold text-[#8C6D2B]">{formatPrice(item.targetPrice)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: CUSTOMER MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#E9E3D8]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#191919]">Registered B2B Customers</h3>
                  <p className="text-xs text-gray-500">Verified wholesale accounts, GSTIN/Tax credentials and status</p>
                </div>
                <button
                  onClick={handleOpenAddUser}
                  className="px-4 py-2 bg-[#191919] hover:bg-[#303030] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C49A3A]" />
                  <span>Register Customer</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-[#E9E3D8] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F6F1] border-b border-[#E9E3D8] text-gray-600 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Contact &amp; Studio</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Resale Tax ID</th>
                        <th className="py-3 px-4">Account Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE1]">
                      {customers.map(cust => (
                        <tr key={cust.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-3 px-4">
                            <strong className="block text-[#191919]">{cust.name}</strong>
                            <span className="text-[10px] text-gray-500">{cust.company || 'Direct Buyer'}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{cust.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAE4D5] text-[#554F42] uppercase">
                              {cust.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-gray-600">{cust.taxId || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cust.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {cust.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  startImpersonating(cust);
                                  onNavigate('dashboard');
                                }}
                                className="p-1.5 text-gray-600 hover:text-[#C49A3A] hover:bg-[#F0EBE1] rounded-lg transition-colors cursor-pointer"
                                title={`Inspect Customer Portal as ${cust.name}`}
                              >
                                <Eye className="w-4 h-4 text-[#8C6D2B]" />
                              </button>
                              <button
                                onClick={() => handleOpenEditUser(cust)}
                                className="p-1.5 text-gray-600 hover:text-[#C49A3A] hover:bg-[#F0EBE1] rounded-lg transition-colors cursor-pointer"
                                title="Edit Account"
                              >
                                <Edit3 className="w-4 h-4" />
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

          {/* ========================================================= */}
          {/* TAB 8: REVIEWS MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-[#E9E3D8]">
                <h3 className="font-serif font-bold text-lg text-[#191919]">Product Reviews &amp; Testimonials</h3>
                <p className="text-xs text-gray-500">Moderate customer ratings and verified client feedback</p>
              </div>

              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="bg-white p-5 rounded-3xl border border-[#E9E3D8] shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-semibold text-[#191919]">{rev.title}</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rev.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">By {rev.customerName} ({rev.customerCompany}) &bull; Product: {rev.productName}</p>
                      </div>

                      <div className="flex gap-1 text-[#C49A3A]">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#554F42] leading-relaxed bg-[#F8F6F1] p-3 rounded-xl border border-[#E9E3D8]">
                      "{rev.comment}"
                    </p>

                    <div className="flex justify-end gap-2 pt-1">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleToggleReviewStatus(rev.id, 'approved')}
                          className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
                        >
                          Approve Review
                        </button>
                      )}
                      {rev.status === 'approved' && (
                        <button
                          onClick={() => handleToggleReviewStatus(rev.id, 'pending')}
                          className="px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-lg hover:bg-gray-700"
                        >
                          Unapprove
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: CONTENT MANAGEMENT (CMS) */}
          {/* ========================================================= */}
          {activeTab === 'content' && siteContent && (
            <div className="bg-white rounded-3xl p-8 border border-[#E9E3D8] shadow-xs space-y-6 max-w-4xl">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#191919]">Homepage Banners &amp; Announcements</h3>
                <p className="text-xs text-gray-500">Configure global announcement bars, hero text, and FAQ database</p>
              </div>

              <form onSubmit={handleSaveContent} className="space-y-6 text-xs">
                {/* Announcement Bar */}
                <div className="space-y-3 pb-6 border-b border-[#F0EBE1]">
                  <h4 className="font-bold text-[#191919] uppercase text-[11px] tracking-wider">Top Announcement Bar</h4>
                  <div>
                    <label className="block text-gray-600 mb-1">Announcement Text</label>
                    <input
                      type="text"
                      value={siteContent.announcement?.text || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        announcement: { ...siteContent.announcement, text: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                </div>

                {/* Hero Section */}
                <div className="space-y-3 pb-6 border-b border-[#F0EBE1]">
                  <h4 className="font-bold text-[#191919] uppercase text-[11px] tracking-wider">Hero Section Headlines</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1">Supertag Badge</label>
                      <input
                        type="text"
                        value={siteContent.hero?.supertag || ''}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, supertag: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Hero Title Line</label>
                      <input
                        type="text"
                        value={siteContent.hero?.titleLine1 || ''}
                        onChange={(e) => setSiteContent({
                          ...siteContent,
                          hero: { ...siteContent.hero, titleLine1: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Hero Subtext</label>
                    <textarea
                      rows="3"
                      value={siteContent.hero?.subtext || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        hero: { ...siteContent.hero, subtext: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#C49A3A]" />
                  <span>Save CMS Content</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: PROMOTIONS & COUPONS */}
          {/* ========================================================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Create Coupon Card */}
                <div className="bg-white p-6 rounded-3xl border border-[#E9E3D8] shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#191919]">Create Promo Coupon</h3>
                  <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#303030] mb-1">Promo Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. WHOLESALE15"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-mono uppercase focus:outline-none focus:border-[#C49A3A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-[#303030] mb-1">Discount %</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="90"
                          value={newCoupon.discountValue}
                          onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#303030] mb-1">Min Order ($)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={newCoupon.minOrder}
                          onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#303030] mb-1">Description</label>
                      <input
                        type="text"
                        value={newCoupon.description}
                        onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl cursor-pointer mt-2"
                    >
                      Publish Promo Code
                    </button>
                  </form>
                </div>

                {/* Active Coupons List */}
                <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-[#E9E3D8] shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#191919]">Active Wholesale Coupons</h3>
                  <div className="divide-y divide-[#F0EBE1]">
                    {coupons.map((c, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#8C6D2B] bg-[#FAF5E8] px-2 py-0.5 rounded border border-[#E8DCC4] text-xs">
                            {c.code}
                          </span>
                          <p className="text-gray-500 text-[11px] mt-1">{c.description} &bull; Min Order: ${c.minOrder}</p>
                        </div>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs">
                          {c.discountValue}% OFF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 11: REPORTS & ANALYTICS */}
          {/* ========================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#E9E3D8]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#191919]">Wholesale Sales Performance &amp; Reports</h3>
                  <p className="text-xs text-gray-500">Gross transaction analytics, category distribution and fulfillment velocity</p>
                </div>

                <button
                  onClick={() => handleExportCSV('orders')}
                  className="px-4 py-2 bg-[#191919] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#C49A3A]" />
                  <span>Download Full Financial CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-[#E9E3D8] shadow-xs space-y-4">
                  <h4 className="font-serif font-bold text-base text-[#191919]">Catalogue Category Distribution</h4>
                  <div className="space-y-3">
                    {categories.map(cat => {
                      const count = products.filter(p => p.category === cat.slug || p.category === cat.id).length;
                      const percentage = Math.round((count / (products.length || 1)) * 100);
                      return (
                        <div key={cat.id} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span>{cat.name}</span>
                            <span>{count} items ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-[#F0EBE1] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#C49A3A] h-full rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#E9E3D8] shadow-xs space-y-4">
                  <h4 className="font-serif font-bold text-base text-[#191919]">Order Fulfillment Velocity</h4>
                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-[#F8F6F1] rounded-2xl border border-[#E9E3D8] flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 block">Average Order Value</span>
                        <strong className="text-xl text-[#191919] font-serif font-bold">
                          {formatPrice(orders.length ? (orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length) : 0)}
                        </strong>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">High B2B Ticket</span>
                    </div>

                    <div className="p-4 bg-[#F8F6F1] rounded-2xl border border-[#E9E3D8] flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 block">Average Courier Dispatch Time</span>
                        <strong className="text-xl text-[#191919] font-serif font-bold">24 &ndash; 36 Hours</strong>
                      </div>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">DHL / FedEx Express</span>
                    </div>

                    <div className="p-4 bg-[#F8F6F1] rounded-2xl border border-[#E9E3D8] flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 block">Quotation Conversion Rate</span>
                        <strong className="text-xl text-[#191919] font-serif font-bold">78.5%</strong>
                      </div>
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded">High Intent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 12: USER & ROLE MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#E9E3D8]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#191919]">Role-Based Access Control (RBAC)</h3>
                  <p className="text-xs text-gray-500">Super Administrator, Store Administrator, Product Manager, Order Manager &amp; Support</p>
                </div>
                <button
                  onClick={handleOpenAddUser}
                  className="px-4 py-2 bg-[#191919] hover:bg-[#303030] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C49A3A]" />
                  <span>Add Staff Account</span>
                </button>
              </div>

              {/* RBAC Role Permissions Matrix Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#E9E3D8] shadow-xs space-y-4">
                <h4 className="font-serif font-bold text-base text-[#191919]">System Role Matrix &amp; Operational Scopes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E9E3D8] space-y-1.5">
                    <strong className="block text-[#191919] font-bold">1. Super Administrator</strong>
                    <p className="text-gray-500 text-[11px]">Unrestricted system control, role assignments, financial audit logs, and global store settings.</p>
                  </div>
                  <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E9E3D8] space-y-1.5">
                    <strong className="block text-[#191919] font-bold">2. Store Administrator</strong>
                    <p className="text-gray-500 text-[11px]">Comprehensive operations across products, categories, orders, quotes, inventory, CMS, and coupons.</p>
                  </div>
                  <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E9E3D8] space-y-1.5">
                    <strong className="block text-[#191919] font-bold">3. Product &amp; Inventory Managers</strong>
                    <p className="text-gray-500 text-[11px]">Catalog curation, pricing adjustments, variations, SKU creation, and warehouse stock reconciliation.</p>
                  </div>
                </div>
              </div>

              {/* Staff Accounts Table */}
              <div className="bg-white rounded-3xl border border-[#E9E3D8] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F6F1] border-b border-[#E9E3D8] text-gray-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Staff Member</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Assigned Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1]">
                    {customers.map(u => (
                      <tr key={u.id} className="hover:bg-[#FAF8F5]">
                        <td className="py-3 px-4 font-semibold text-[#191919]">{u.name}</td>
                        <td className="py-3 px-4 text-gray-600">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] font-bold bg-[#EAE4D5] text-[#554F42] px-2 py-0.5 rounded capitalize">
                            {u.role.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {u.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1.5 text-gray-600 hover:text-[#C49A3A]"
                            title="Edit Permissions"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 13: STORE SETTINGS & CONFIGURATION */}
          {/* ========================================================= */}
          {activeTab === 'settings' && storeSettings && (
            <div className="bg-white rounded-3xl p-8 border border-[#E9E3D8] shadow-xs space-y-6 max-w-4xl">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#191919]">Centralized Store Configuration</h3>
                <p className="text-xs text-gray-500">Website branding, tax calculation, shipping methods, and email alerts</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
                
                {/* General Branding */}
                <div className="space-y-3 pb-6 border-b border-[#F0EBE1]">
                  <h4 className="font-bold text-[#191919] uppercase text-[11px] tracking-wider">General Branding &amp; Contact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1">Store Legal Name</label>
                      <input
                        type="text"
                        value={storeSettings.general?.storeName || ''}
                        onChange={(e) => setStoreSettings({
                          ...storeSettings,
                          general: { ...storeSettings.general, storeName: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={storeSettings.general?.supportEmail || ''}
                        onChange={(e) => setStoreSettings({
                          ...storeSettings,
                          general: { ...storeSettings.general, supportEmail: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Tax & Financials */}
                <div className="space-y-3 pb-6 border-b border-[#F0EBE1]">
                  <h4 className="font-bold text-[#191919] uppercase text-[11px] tracking-wider">Tax &amp; Compliance Configuration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1">Wholesale Tax Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={storeSettings.tax?.taxRatePercent || 5.0}
                        onChange={(e) => setStoreSettings({
                          ...storeSettings,
                          tax: { ...storeSettings.tax, taxRatePercent: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Tax Registration Code</label>
                      <input
                        type="text"
                        value={storeSettings.tax?.taxIdentificationNumber || ''}
                        onChange={(e) => setStoreSettings({
                          ...storeSettings,
                          tax: { ...storeSettings.tax, taxIdentificationNumber: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Free Threshold */}
                <div className="space-y-3 pb-6 border-b border-[#F0EBE1]">
                  <h4 className="font-bold text-[#191919] uppercase text-[11px] tracking-wider">Free Shipping Rule</h4>
                  <div>
                    <label className="block text-gray-600 mb-1">Free Shipping Order Threshold ($)</label>
                    <input
                      type="number"
                      value={storeSettings.shipping?.freeShippingThreshold || 500}
                      onChange={(e) => setStoreSettings({
                        ...storeSettings,
                        shipping: { ...storeSettings.shipping, freeShippingThreshold: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4 text-[#C49A3A]" />
                  <span>Save Configuration</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 14: ACTIVITY LOGS & AUDIT TRAIL */}
          {/* ========================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-[#E9E3D8]">
                <h3 className="font-serif font-bold text-lg text-[#191919]">Administrative Activity Logs &amp; Audit Trail</h3>
                <p className="text-xs text-gray-500">Immutable chronological record of administrator actions, stock adjustments, and order state transitions</p>
              </div>

              <div className="bg-white rounded-3xl border border-[#E9E3D8] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F6F1] border-b border-[#E9E3D8] text-gray-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor / Role</th>
                      <th className="py-3 px-4">Action Type</th>
                      <th className="py-3 px-4">Target Resource</th>
                      <th className="py-3 px-4">Event Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1]">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-[#FAF8F5]">
                        <td className="py-3 px-4 font-mono text-gray-500 text-[11px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <strong className="block text-[#191919]">{log.actor}</strong>
                          <span className="text-[10px] text-gray-400 capitalize">{log.role.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] font-bold bg-[#FAF5E8] text-[#8C6D2B] px-2 py-0.5 rounded border border-[#E8DCC4]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-700">{log.resource}</td>
                        <td className="py-3 px-4 text-gray-600 leading-relaxed">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 15: ADMIN HELP & SYSTEM GUIDE */}
          {/* ========================================================= */}
          {activeTab === 'help' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Help Topic Navigation Sidebar */}
              <div className="lg:col-span-4 bg-white p-4 rounded-3xl border border-[#E9E3D8] shadow-xs space-y-1">
                <h3 className="font-serif font-bold text-base text-[#191919] px-3 py-2 border-b border-[#F0EBE1]">
                  System Operation Guides (15)
                </h3>
                
                {[
                  { id: 'overview', title: '1. Dashboard Overview' },
                  { id: 'add-product', title: '2. Add a New Product' },
                  { id: 'categories', title: '3. Manage Categories' },
                  { id: 'pricing', title: '4. Update Prices & Tiers' },
                  { id: 'inventory', title: '5. Manage Stock & Alerts' },
                  { id: 'orders', title: '6. Process Orders & Couriers' },
                  { id: 'quotes', title: '7. Handle RFQ Quotations' },
                  { id: 'customers', title: '8. Manage Customer Accounts' },
                  { id: 'banners', title: '9. Manage Website Banners' },
                  { id: 'content', title: '10. Manage Website Content' },
                  { id: 'payments', title: '11. Configure Payments' },
                  { id: 'shipping', title: '12. Configure Shipping' },
                  { id: 'roles', title: '13. Manage Admin Roles' },
                  { id: 'reports', title: '14. View Sales Reports' },
                  { id: 'audit', title: '15. Monitor Activity Logs' }
                ].map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedHelpTopic(topic.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedHelpTopic === topic.id 
                        ? 'bg-[#191919] text-[#C49A3A] font-bold shadow-xs' 
                        : 'text-gray-600 hover:bg-[#F8F6F1] hover:text-[#191919]'
                    }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>

              {/* Guide Content Display */}
              <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-[#E9E3D8] shadow-xs space-y-6 text-xs leading-relaxed text-[#554F42]">
                
                {selectedHelpTopic === 'overview' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 1: Administrator Dashboard Overview</h3>
                    <p>
                      The BeadsSource Executive Dashboard provides a centralized, real-time snapshot of the entire wholesale operation. Key performance indicators (KPIs) include:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Gross Wholesale Revenue:</strong> Calculated dynamically from all paid and approved purchase orders.</li>
                      <li><strong>Total Orders:</strong> Real-time count of active, processing, and completed B2B orders.</li>
                      <li><strong>Pending RFQ Quotations:</strong> Multi-product quotation requests awaiting counter-offers.</li>
                      <li><strong>Low Stock Alert Threshold:</strong> Flags any SKU where available packs dip below 200 units.</li>
                    </ul>
                  </div>
                )}

                {selectedHelpTopic === 'add-product' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 2: How to Add a New Product</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Click on <strong>Products</strong> in the admin sidebar.</li>
                      <li>Click the black <strong>+ Add New Product</strong> button in the top right.</li>
                      <li>Enter the Product Name, unique factory SKU (e.g. <code>A12502</code>), select the Category, Base Price, and initial Stock Quantity.</li>
                      <li>Paste high-resolution product photography URLs (Unsplash or factory CDN).</li>
                      <li>Toggle badges: <em>Featured</em>, <em>Best Seller</em>, or <em>New Arrival</em>.</li>
                      <li>Click <strong>Save Product</strong> to publish immediately to the live wholesale storefront.</li>
                    </ol>
                  </div>
                )}

                {selectedHelpTopic === 'categories' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 3: How to Manage Categories</h3>
                    <p>
                      Organize products into intuitive wholesale collections. Use the <strong>Categories</strong> tab to create new categories, edit category descriptions, assign hero banners, and customize URL slugs.
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'pricing' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 4: How to Update Product Prices &amp; Tiers</h3>
                    <p>
                      Base prices are entered per pack. The platform automatically applies standardized wholesale bulk multipliers:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Tier 1 (1–9 packs): Standard base wholesale rate</li>
                      <li>Tier 2 (10–49 packs): <strong>15% Volume Discount</strong></li>
                      <li>Tier 3 (50+ packs): <strong>30% Master Bulk Discount</strong></li>
                    </ul>
                  </div>
                )}

                {selectedHelpTopic === 'inventory' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 5: How to Manage Inventory &amp; Low Stock Alerts</h3>
                    <p>
                      Use the <strong>Inventory</strong> tab to monitor warehouse counts. Use the quick-restock buttons (<code>+50</code>, <code>+200</code>) to instantly update inventory levels after receiving container shipments.
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'orders' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 6: How to Process Customer Orders</h3>
                    <p>
                      When a wholesale customer checks out, the order appears with status <code>Processing</code>. Click <strong>Manage Order</strong> to update the courier name (DHL, FedEx, UPS), assign tracking numbers, and view the printable commercial invoice.
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'quotes' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 7: How to Handle RFQ Quotations</h3>
                    <p>
                      Review incoming customer quote requests in the <strong>Quotations</strong> tab. Input approved target rates and official response notes, then submit to notify the buyer in their customer dashboard.
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'customers' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 8: How to Manage Customer Accounts</h3>
                    <p>
                      Inspect registered B2B buyers, verify their resale tax certificates/GSTIN, and manage account status (Active or Suspended).
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'banners' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 9: How to Manage Website Banners</h3>
                    <p>
                      Update the slim top announcement bar text and promotional badges under the <strong>Content (CMS)</strong> tab.
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'content' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 10: How to Manage Website Content</h3>
                    <p>
                      Configure homepage hero copy, editorial collection highlights, and frequently asked questions (FAQs).
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'payments' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 11: How to Configure Payments &amp; Currencies</h3>
                    <p>
                      Manage currency conversions (USD, EUR, GBP, INR) and corporate wire transfer instructions.
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'shipping' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 12: How to Configure Shipping Methods</h3>
                    <p>
                      Set international courier rates (DHL Express, FedEx International Priority) and adjust the free shipping minimum threshold (default: $500).
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'roles' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 13: How to Manage Administrator Roles</h3>
                    <p>
                      Enforce strict Role-Based Access Control. Super Administrators can assign specialized operational roles: Store Administrator, Product Manager, Order Manager, Inventory Manager, and Customer Support.
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'reports' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 14: How to View Reports &amp; Export Data</h3>
                    <p>
                      Analyze gross sales volume, average order values, and category turnover. Export complete CSV spreadsheets for bookkeeping.
                    </p>
                  </div>
                )}

                {selectedHelpTopic === 'audit' && (
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl text-[#191919]">Guide 15: How to Monitor Administrative Activity Logs</h3>
                    <p>
                      Review the tamper-evident audit trail tracking every catalog modification, price update, stock adjustment, and staff login.
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {/* ========================================================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E9E3D8] w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-[#191919] text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {editingProduct ? `Edit Product: ${editingProduct.sku}` : 'Add New Wholesale Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Factory SKU *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-mono focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug || c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Sale Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Optional"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Stock Quantity (Packs)</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#303030] mb-1">Description</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl focus:outline-none focus:border-[#C49A3A]"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNewArrival}
                    onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  />
                  <span>Featured Product</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#F0EBE1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-[#F8F6F1] text-[#303030] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: MANAGE ORDER STATUS */}
      {/* ========================================================= */}
      {orderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E9E3D8] w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 bg-[#191919] text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Manage Order #{selectedOrder.id}</h3>
              <button onClick={() => setOrderModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveOrderStatus} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Fulfillment Status</label>
                  <select
                    value={orderStatusForm.status}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Payment Status</label>
                  <select
                    value={orderStatusForm.paymentStatus}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#303030] mb-1">Air Courier Name</label>
                <input
                  type="text"
                  value={orderStatusForm.courierName}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, courierName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#303030] mb-1">International Tracking Number</label>
                <input
                  type="text"
                  value={orderStatusForm.trackingNumber}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, trackingNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#303030] mb-1">Internal Fulfillment Notes</label>
                <textarea
                  rows="2"
                  value={orderStatusForm.internalNotes}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, internalNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                  placeholder="Notes visible only to administrators..."
                />
              </div>

              <div className="pt-4 border-t border-[#F0EBE1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="px-4 py-2 bg-[#F8F6F1] text-[#303030] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl"
                >
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: RESPOND TO QUOTATION */}
      {/* ========================================================= */}
      {quoteModalOpen && respondingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E9E3D8] w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 bg-[#191919] text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Respond to RFQ #{respondingQuote.id}</h3>
              <button onClick={() => setQuoteModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveQuoteResponse} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#303030] mb-1">Quotation Status</label>
                <select
                  value={quoteResponseForm.status}
                  onChange={(e) => setQuoteResponseForm({ ...quoteResponseForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                >
                  <option value="Approved">Approved</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#303030] mb-1">Approved Counter-Offer Unit Rate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={quoteResponseForm.counterOffer}
                  onChange={(e) => setQuoteResponseForm({ ...quoteResponseForm, counterOffer: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-bold text-[#8C6D2B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#303030] mb-1">Official Administrator Response Note</label>
                <textarea
                  rows="3"
                  required
                  value={quoteResponseForm.adminNotes}
                  onChange={(e) => setQuoteResponseForm({ ...quoteResponseForm, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                />
              </div>

              <div className="pt-4 border-t border-[#F0EBE1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="px-4 py-2 bg-[#F8F6F1] text-[#303030] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl"
                >
                  Transmit Quote Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: USER / STAFF EDIT */}
      {/* ========================================================= */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E9E3D8] w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 bg-[#191919] text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {editingUser ? `Edit Account: ${editingUser.email}` : 'Add New Account'}
              </h3>
              <button onClick={() => setUserModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    disabled={Boolean(editingUser)}
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                  />
                </div>
              </div>

              {!editingUser && (
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Initial Password</label>
                  <input
                    type="password"
                    required
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Operational Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                  >
                    <option value="customer">Customer / Buyer</option>
                    <option value="admin">Store Administrator</option>
                    <option value="product_manager">Product Manager</option>
                    <option value="order_manager">Order Manager</option>
                    <option value="inventory_manager">Inventory Manager</option>
                    <option value="support">Customer Support</option>
                    {isSuperAdmin && <option value="super_admin">Super Administrator</option>}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Account Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Company / Studio</label>
                  <input
                    type="text"
                    value={userForm.company}
                    onChange={(e) => setUserForm({ ...userForm, company: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#303030] mb-1">Tax ID / GSTIN</label>
                  <input
                    type="text"
                    value={userForm.taxId}
                    onChange={(e) => setUserForm({ ...userForm, taxId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0EBE1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 bg-[#F8F6F1] text-[#303030] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: ADD / EDIT CATEGORY */}
      {/* ========================================================= */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E9E3D8] w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 bg-[#191919] text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Category'}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#303030] mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#303030] mb-1">Slug Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. gemstone-strands"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#303030] mb-1">Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#303030] mb-1">Description</label>
                <textarea
                  rows="3"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl"
                />
              </div>

              <div className="pt-4 border-t border-[#F0EBE1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 bg-[#F8F6F1] text-[#303030] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#191919] hover:bg-[#303030] text-white font-bold rounded-xl"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
