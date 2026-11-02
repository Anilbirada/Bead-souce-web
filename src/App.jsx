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

import { api } from './utils/api';

function MainApp() {
  const { openLogin } = useAuth();

  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [catalogFilters, setCatalogFilters] = useState({ category: 'all', search: '' });

  // Load products and categories on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Initialization error:', err);
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
        search: params.search || ''
      });
    }

    if (page === 'product' && params.product) {
      setSelectedProduct(params.product);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-[#EBE2D0] selection:text-[#1A1A1A]">
      
      {/* 1. Announcement Bar */}
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
          <CustomerDashboardPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage
            onNavigate={handleNavigate}
            onRefreshCatalogue={async () => {
              const fresh = await api.getProducts();
              setProducts(fresh);
            }}
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
