import React, { useState, useEffect } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { QuoteProvider } from './context/QuoteContext';

import AnnouncementBar from './components/common/AnnouncementBar';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import MobileNavDrawer from './components/common/MobileNavDrawer';
import MobileBottomBar from './components/common/MobileBottomBar';
import AuthModal from './components/common/AuthModal';
import CartDrawer from './components/common/CartDrawer';
import ProductQuickView from './components/shop/ProductQuickView';
import SuperAdminBar from './components/common/SuperAdminBar';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import RequestQuotePage from './pages/RequestQuotePage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import initialProducts from './data/products.json';
import initialCategories from './data/categories.json';
import { api } from './utils/api';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

function MainApp() {
  const { user, isAdmin, isSuperAdmin, openLogin } = useAuth();

  const [currentPage, setCurrentPage] = useState('home');
  const [adminInitialTab, setAdminInitialTab] = useState('overview');
  const [customerInitialTab, setCustomerInitialTab] = useState('orders');
  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [catalogFilters, setCatalogFilters] = useState({ category: 'all', subcategory: 'all', search: '', sort: '' });
  const [siteContent, setSiteContent] = useState(null);

  // Load live products, categories, and content on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const [prods, cats, content] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getContent().catch(() => null)
        ]);
        if (Array.isArray(prods) && prods.length > 0) setProducts(prods);
        if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
        if (content) setSiteContent(content);
      } catch (err) {
        console.warn('API sync fallback active:', err);
      }
    };
    initData();
  }, []);

  const handleNavigate = (page, params = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);

    if (page === 'catalog') {
      setCatalogFilters({
        category: params.category || 'all',
        subcategory: params.subcategory || 'all',
        search: params.search || '',
        sort: params.sort || ''
      });
    }

    if (page === 'product' && params.product) {
      setSelectedProduct(params.product);
    }

    if (page === 'admin' && params.tab) {
      setAdminInitialTab(params.tab);
    }

    if (page === 'dashboard' && params.tab) {
      setCustomerInitialTab(params.tab);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // SEPARATE DEDICATED ADMIN LAYOUT
  // =========================================================================
  if (currentPage === 'admin') {
    // Role & Authorization Check
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#FAF8F3] text-[#292723] flex flex-col">
          <SuperAdminBar currentPage={currentPage} onNavigate={handleNavigate} />
          <div className="flex-1 flex items-center justify-center p-6 text-center select-none">
            <div className="bg-[#40362F] text-[#FAF8F3] p-8 sm:p-12 rounded-3xl border border-[#52463D] max-w-md space-y-5 shadow-2xl animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#C6A66B]/15 border border-[#C6A66B]/30 text-[#C6A66B] flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#FAF8F3]">Store Management Access Required</h2>
              <p className="text-xs text-[#EDE5D8] leading-relaxed">
                This management suite is restricted to authorized BeadsSource administrators and store managers. Ordinary customer accounts cannot view administrative workflows.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={openLogin}
                  className="w-full py-3 bg-[#C6A66B] hover:bg-[#B39358] text-[#292723] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Sign In with Administrator / Manager Credentials
                </button>
                <button
                  onClick={() => handleNavigate('home')}
                  className="w-full py-2.5 bg-transparent hover:bg-white/10 text-[#EDE5D8] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#52463D]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Storefront</span>
                </button>
              </div>
            </div>
          </div>
          <AuthModal />
        </div>
      );
    }

    // Render Dedicated Admin Suite
    return (
      <div className="min-h-screen bg-[#FAF8F3] selection:bg-[#C6A66B]/20 flex flex-col">
        <SuperAdminBar currentPage={currentPage} onNavigate={handleNavigate} />
        <AdminDashboardPage
          initialTab={adminInitialTab}
          onNavigate={handleNavigate}
          onRefreshCatalogue={async () => {
            const fresh = await api.getProducts();
            setProducts(fresh);
          }}
        />
        <AuthModal />
      </div>
    );
  }

  // =========================================================================
  // STANDARD LUXURY STOREFRONT LAYOUT
  // =========================================================================
  return (
    <div className="flex flex-col min-h-screen selection:bg-[#C6A66B]/20 selection:text-[#292723] bg-[#FAF8F3] text-[#292723]">
      
      {/* 0. Omnipresent Super Admin Controls */}
      <SuperAdminBar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* 1. Slim Announcement Bar */}
      <AnnouncementBar onOpenAuth={openLogin} />

      {/* 2. Premium Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenAuth={openLogin}
        onSelectProduct={handleSelectProduct}
      />

      {/* 3. Main Dynamic Route View */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            products={products}
            categories={categories}
            siteContent={siteContent}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            products={products}
            categories={categories}
            initialCategory={catalogFilters.category}
            initialSubcategory={catalogFilters.subcategory}
            initialSearch={catalogFilters.search}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'quote' && (
          <RequestQuotePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'wishlist' && (
          <WishlistPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'dashboard' && (
          <CustomerDashboardPage 
            initialTab={customerInitialTab}
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* 4. Complete Premium Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 5. Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleNavigate}
        onOpenAuth={openLogin}
      />

      {/* 6. Mobile Persistent Bottom Navigation Bar */}
      <MobileBottomBar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* 7. Slide-over Cart Drawer */}
      <CartDrawer onNavigate={handleNavigate} />

      {/* 8. Quick View Lightbox Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {/* 9. Global B2B Auth Modal */}
      <AuthModal />

    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <QuoteProvider>
              <MainApp />
            </QuoteProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </CurrencyProvider>
  );
}
