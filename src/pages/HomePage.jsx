import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import FeaturedCategories from '../components/home/FeaturedCategories';
import BestSellers from '../components/home/BestSellers';
import NewArrivals from '../components/home/NewArrivals';
import GemstoneCollection from '../components/home/GemstoneCollection';
import CrystalCZCollection from '../components/home/CrystalCZCollection';
import HandmadeJewelleryShowcase from '../components/home/HandmadeJewelleryShowcase';
import WhyChooseSection from '../components/home/WhyChooseSection';
import TestimonialsSection from '../components/home/TestimonialsSection';

export default function HomePage({ 
  products, 
  categories, 
  onSelectProduct, 
  onQuickView, 
  onNavigate 
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      {/* 1. Hero Banner */}
      <HeroBanner onNavigate={onNavigate} />

      {/* 2. Featured Categories (12) */}
      <FeaturedCategories 
        categories={categories} 
        onSelectCategory={(catId) => onNavigate('catalog', { category: catId })} 
      />

      {/* 3. Best-Selling Products */}
      <BestSellers 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 4. Natural Gemstone Collection Spotlight */}
      <GemstoneCollection 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 5. New Arrivals */}
      <NewArrivals 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 6. Crystal and CZ Collection */}
      <CrystalCZCollection 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 7. Handmade Jewellery Showcase */}
      <HandmadeJewelleryShowcase 
        products={products} 
        onSelectProduct={onSelectProduct} 
        onQuickView={onQuickView} 
        onNavigate={onNavigate} 
      />

      {/* 8. Why Choose BeadsSource */}
      <WhyChooseSection onNavigate={onNavigate} />

      {/* 9. Customer Testimonials */}
      <TestimonialsSection />
    </div>
  );
}
