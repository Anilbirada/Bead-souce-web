import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import FeaturedCategories from '../components/home/FeaturedCategories';
import TrendingProducts from '../components/home/TrendingProducts';
import BestSellers from '../components/home/BestSellers';
import NewArrivals from '../components/home/NewArrivals';
import FeaturedCollections from '../components/home/FeaturedCollections';
import GemstoneCollection from '../components/home/GemstoneCollection';
import CrystalCZCollection from '../components/home/CrystalCZCollection';
import JewelleryFindingsCollection from '../components/home/JewelleryFindingsCollection';
import HandmadeJewelleryShowcase from '../components/home/HandmadeJewelleryShowcase';
import WhyChooseSection from '../components/home/WhyChooseSection';
import WholesaleInfoSection from '../components/home/WholesaleInfoSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import NewsletterSection from '../components/home/NewsletterSection';

export default function HomePage({ 
  products = [], 
  categories = [], 
  siteContent = null,
  onSelectProduct, 
  onQuickView, 
  onNavigate 
}) {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      
      {/* 5. Animated Hero Carousel (5 Collection Slides) */}
      <HeroBanner 
        onNavigate={onNavigate} 
        dynamicSlides={siteContent?.heroSlides}
      />

      {/* 6. Shop by Categories (12 Categories with counts & imagery) */}
      <FeaturedCategories 
        categories={categories} 
        onSelectCategory={(catId) => onNavigate('catalog', { category: catId })} 
      />

      {/* 7. Trending Products (In-Demand Selections) */}
      <TrendingProducts 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 8. Best-Selling Products */}
      <BestSellers 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 9. New Arrivals */}
      <NewArrivals 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 10. Featured Collections (Curated Editorial Grids) */}
      <FeaturedCollections 
        onNavigate={onNavigate} 
      />

      {/* 11. Natural Gemstone Collection Spotlight */}
      <GemstoneCollection 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 12. Crystal and CZ Collection */}
      <CrystalCZCollection 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 13. Jewellery Findings Collection (Clasps, Connectors, Lead-Free Pewter) */}
      <JewelleryFindingsCollection 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 14. Handmade Jewellery Showcase (Artisan Necklaces & Bracelets) */}
      <HandmadeJewelleryShowcase 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 15. Why Choose BeadsSource (4 Pillars of Excellence) */}
      <WhyChooseSection 
        onNavigate={onNavigate} 
      />

      {/* 16. Wholesale Purchasing Information (Tiers, RFQ, Dispatch, Compliance) */}
      <WholesaleInfoSection 
        onNavigate={onNavigate} 
      />

      {/* 17. Customer Testimonials (Verified Wholesale Partners) */}
      <TestimonialsSection />

      {/* 18. Newsletter Subscription (VIP Trade Network & Instant Coupon) */}
      <NewsletterSection />

    </div>
  );
}
