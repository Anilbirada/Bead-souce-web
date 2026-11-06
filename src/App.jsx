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
  const [catalogFilters, setCatalogFilters] = useState({ category: 'all', search: '', sort: '' });

  // Load live products and categories on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        if (Array.isArray(prods) && prods.length > 0) setProducts(prods);
        if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
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
        <div className="min-h-screen bg-[#191919] text-white flex items-center justify-center p-6 text-center select-none">
          <div className="bg-[#242424] p-8 sm:p-12 rounded-3xl border border-[#383838] max-w-md space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-white">Administrator Access Required</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              This area is strictly restricted to authorized BeadsSource management and staff members. Ordinary customer accounts cannot view administrative workflows.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={openLogin}
                className="w-full py-3 bg-[#C49A3A] hover:bg-[#A9812A] text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Sign In with Administrator Credentials
              </button>
              <button
                onClick={() => handleNavigate('home')}
                className="w-full py-2.5 bg-transparent hover:bg-white/5 text-gray-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Storefront</span>
              </button>
            </div>
          </div>
          <AuthModal />
        </div>
      );
    }

    // Render Dedicated Admin Suite
    return (
      <div className="min-h-screen bg-[#FAF9F5] selection:bg-[#C49A3A]/30 flex flex-col">
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
    <div className="flex flex-col min-h-screen selection:bg-[#E9E3D8] selection:text-[#191919] bg-[#FFFFFF] text-[#303030]">
      
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
