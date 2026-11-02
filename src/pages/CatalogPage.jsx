import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, 
  ChevronDown, 
  X, 
  Grid3X3, 
  LayoutGrid, 
  SlidersHorizontal, 
  Check, 
  Sparkles, 
  ArrowUpDown, 
  Search 
} from 'lucide-react';
import ProductCard from '../components/shop/ProductCard';
import { useCurrency } from '../context/CurrencyContext';

export default function CatalogPage({ 
  products, 
  categories, 
  initialCategory = 'all', 
  initialSearch = '', 
  onSelectProduct, 
  onQuickView, 
  onNavigate 
}) {
  const { formatPrice } = useCurrency();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(50); // max price filter
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4); // 3 or 4

  // Synchronize when initialCategory changes via navigation
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) setSearchQuery(initialSearch);
  }, [initialSearch]);

  // Extract distinct materials from catalog
  const materialsList = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.materials) {
        p.materials.split(',').forEach(m => set.add(m.trim()));
      }
    });
    return Array.from(set).slice(0, 10);
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.materials && p.materials.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q));
        if (!matches) return false;
      }
      // In-stock filter
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      // Price filter
      const price = p.salePrice || p.price;
      if (price > priceRange) {
        return false;
      }
      // Material filter
      if (selectedMaterial !== 'all') {
        if (!p.materials || !p.materials.toLowerCase().includes(selectedMaterial.toLowerCase())) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, priceRange, selectedMaterial, sortBy]);

  // Find active category info
  const currentCatInfo = categories.find(c => c.id === selectedCategory);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setInStockOnly(false);
    setPriceRange(50);
    setSelectedMaterial('all');
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery || inStockOnly || selectedMaterial !== 'all' || priceRange < 50;

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-20">
      
      {/* Category Banner */}
      <div className="bg-[#1C1A17] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#383227] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                Wholesale Product Catalogue
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-1">
                {currentCatInfo ? currentCatInfo.name : 'All Wholesale Collections'}
              </h1>
              <p className="text-xs sm:text-sm text-[#C9C3B4] mt-2 max-w-2xl leading-relaxed">
                {currentCatInfo 
                  ? currentCatInfo.description 
                  : 'Direct factory pricing across natural gemstone bead strands, turquoise, cubic zirconia components, lead-free pewter charms, and jeweler findings.'}
              </p>
            </div>

            {/* Quick stats pill */}
            <div className="bg-[#2B261F] border border-[#453D30] rounded-2xl p-4 flex items-center gap-6 shrink-0 text-xs">
              <div>
                <p className="text-gray-400 text-[11px]">Displaying</p>
                <p className="text-lg font-serif font-bold text-white">{filteredProducts.length} Items</p>
              </div>
              <div className="h-8 w-px bg-[#453D30]" />
              <div>
                <p className="text-gray-400 text-[11px]">Wholesale Tier</p>
                <p className="text-xs font-bold text-[#E6C687]">Up to 30% Bulk Off</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar & Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Controls: Search, Sort, View, Mobile Filter Trigger */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAE4D5] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search within results */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, stone or SKU..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs focus:outline-none focus:border-[#C4A052] focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-xs font-semibold text-[#3D372D]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C4A052]" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C4A052] cursor-pointer"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="bestseller">Best Selling</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                  <option value="name-asc">Alphabetical (A-Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Grid Column Toggle (Desktop) */}
            <div className="hidden sm:flex items-center gap-1 bg-[#FAF8F5] border border-[#DDD6C8] p-1 rounded-xl">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-lg transition-colors ${gridCols === 3 ? 'bg-white text-black shadow-xs' : 'text-gray-400 hover:text-black'}`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg transition-colors ${gridCols === 4 ? 'bg-white text-black shadow-xs' : 'text-gray-400 hover:text-black'}`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="mb-6 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-gray-500 font-medium">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#DDD6C8] px-2.5 py-1 rounded-full text-[#4A453A]">
                Category: <strong>{currentCatInfo?.name || selectedCategory}</strong>
                <button onClick={() => setSelectedCategory('all')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#DDD6C8] px-2.5 py-1 rounded-full text-[#4A453A]">
                Search: <strong>"{searchQuery}"</strong>
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#DDD6C8] px-2.5 py-1 rounded-full text-[#4A453A]">
                In Stock Only
                <button onClick={() => setInStockOnly(false)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedMaterial !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#DDD6C8] px-2.5 py-1 rounded-full text-[#4A453A]">
                Material: <strong>{selectedMaterial}</strong>
                <button onClick={() => setSelectedMaterial('all')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 font-semibold hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            
            {/* Categories Filter */}
            <div className="bg-white p-5 rounded-2xl border border-[#EAE4D5] shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A] pb-2 border-b border-[#F0EBE1]">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === 'all' ? 'bg-[#1C1A17] text-[#E6C687]' : 'text-[#4A453A] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>All Wholesale Catalogue</span>
                  <span className="text-[10px] opacity-75">{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id 
                        ? 'bg-[#1C1A17] text-[#E6C687] font-bold' 
                        : 'text-[#4A453A] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-400">
                      {products.filter(p => p.category === cat.id).length || cat.itemCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white p-5 rounded-2xl border border-[#EAE4D5] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
                  Max Price / Pack
                </h3>
                <span className="text-xs font-bold text-[#8C6D2B]">{formatPrice(priceRange)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#C4A052] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>{formatPrice(1)}</span>
                <span>{formatPrice(50)}</span>
              </div>
            </div>

            {/* Materials Filter */}
            <div className="bg-white p-5 rounded-2xl border border-[#EAE4D5] shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-sm text-[#1A1A1A] pb-2 border-b border-[#F0EBE1]">
                Gemstones &amp; Materials
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedMaterial('all')}
                  className={`w-full text-left px-2 py-1 rounded text-xs ${
                    selectedMaterial === 'all' ? 'text-[#8C6D2B] font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  All Materials
                </button>
                {materialsList.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`w-full text-left px-2 py-1 rounded text-xs truncate ${
                      selectedMaterial === mat ? 'text-[#8C6D2B] font-bold' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Filter */}
            <div className="bg-white p-5 rounded-2xl border border-[#EAE4D5] shadow-xs">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#3D372D] font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#C4A052] focus:ring-[#C4A052]"
                />
                <span>In-Stock Items Only (Fast Dispatch)</span>
              </label>
            </div>

          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE4D5] shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] mx-auto flex items-center justify-center text-gray-400 border border-[#EAE4D5]">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">No Wholesale Products Found</h3>
                <p className="text-xs text-[#736B5E] max-w-md mx-auto">
                  We could not find items matching your current filters. Try resetting the filters or searching for terms like "Turquoise", "Spacer", or "Pendant".
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-[#1C1A17] text-[#D4AF37] text-xs font-bold rounded-lg hover:bg-[#332E26] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                gridCols === 3 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filters Slide-in Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Filter Catalogue</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase mb-2">Categories</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedCategory('all'); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-2 py-1 text-xs ${selectedCategory === 'all' ? 'font-bold text-[#8C6D2B]' : 'text-gray-600'}`}
                  >
                    All Collections
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.id); setMobileFilterOpen(false); }}
                      className={`w-full text-left px-2 py-1 text-xs truncate ${selectedCategory === c.id ? 'font-bold text-[#8C6D2B]' : 'text-gray-600'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-[#1C1A17] text-white text-xs font-bold rounded-xl mt-6"
            >
              Apply Filters ({filteredProducts.length} items)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
