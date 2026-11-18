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
  initialSubcategory = 'all',
  initialSearch = '', 
  onSelectProduct, 
  onQuickView, 
  onNavigate 
}) {
  const { formatPrice } = useCurrency();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory || 'all');
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(50); // max price filter
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4); // 3 or 4

  // Synchronize when initialCategory or initialSubcategory changes via navigation
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialSubcategory !== undefined) setSelectedSubcategory(initialSubcategory);
  }, [initialSubcategory]);

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
      // Category filter (supports master category and legacyCategory)
      if (selectedCategory !== 'all') {
        const catMatch = p.category === selectedCategory || p.legacyCategory === selectedCategory;
        if (!catMatch) return false;
      }
      // Subcategory filter
      if (selectedSubcategory !== 'all') {
        if (p.subcategory !== selectedSubcategory) return false;
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
  }, [products, selectedCategory, selectedSubcategory, searchQuery, inStockOnly, priceRange, selectedMaterial, sortBy]);

  // Find active category info
  const currentCatInfo = categories.find(c => c.id === selectedCategory);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setInStockOnly(false);
    setPriceRange(50);
    setSelectedMaterial('all');
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedSubcategory !== 'all' || searchQuery || inStockOnly || selectedMaterial !== 'all' || priceRange < 50;

  return (
    <div className="min-h-screen bg-[#FAF8F3] pb-24">
      
      {/* Category Banner: Signature Royal Navy & Gold Wholesale Header */}
      <div className="bg-gradient-to-r from-[#012d59] via-[#014b92] to-[#012140] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#013567] relative overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#ffd778]">
                Wholesale Product Catalogue &bull; Gemstones &amp; Findings
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2">
                {currentCatInfo ? currentCatInfo.name : 'All Wholesale Collections'}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-2.5 max-w-2xl leading-relaxed">
                {currentCatInfo 
                  ? currentCatInfo.description 
                  : 'Direct factory pricing across natural gemstone bead strands, imperial turquoise, cubic zirconia components, lead-free pewter charms, and jeweler findings.'}
              </p>
            </div>

            {/* Quick stats pill */}
            <div className="bg-[#013567]/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-6 shrink-0 text-xs shadow-md">
              <div>
                <p className="text-white/70 text-[11px] font-medium">Displaying</p>
                <p className="text-xl font-serif font-bold text-white">{filteredProducts.length} Items</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <p className="text-white/70 text-[11px] font-medium">Wholesale Policy</p>
                <p className="text-xs font-bold text-[#ffd778]">Direct Factory RFQ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar & Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Controls: Search, Sort, View, Mobile Filter Trigger */}
        <div className="bg-white p-4 rounded-2xl border border-[#EDE5D8] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search within results */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8B8175] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, stone or SKU..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl text-xs text-[#292723] focus:outline-none focus:border-[#C6A66B] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B8175] hover:text-[#292723] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 bg-[#FAF8F3] border border-[#EDE5D8] hover:border-[#C6A66B] rounded-xl text-xs font-semibold text-[#40362F] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C6A66B]" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8B8175] hidden sm:inline font-medium">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#FAF8F3] border border-[#EDE5D8] rounded-xl pl-3.5 pr-8 py-2.5 text-xs font-semibold text-[#292723] focus:outline-none focus:border-[#014b92] cursor-pointer"
                >
                  <option value="featured">Featured Wholesale Picks</option>
                  <option value="bestseller">Best Selling Lots</option>
                  <option value="newest">New Sea Arrivals</option>
                  <option value="rating">Top Customer Rated</option>
                  <option value="name-asc">Alphabetical (A-Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8B8175] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Grid Column Toggle (Desktop) */}
            <div className="hidden sm:flex items-center gap-1 bg-[#FAF8F3] border border-[#EDE5D8] p-1 rounded-xl">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${gridCols === 3 ? 'bg-white text-[#40362F] shadow-xs' : 'text-[#8B8175] hover:text-[#292723]'}`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${gridCols === 4 ? 'bg-white text-[#40362F] shadow-xs' : 'text-[#8B8175] hover:text-[#292723]'}`}
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
            <span className="text-[#8B8175] font-medium">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#EDE5D8] px-3 py-1.5 rounded-full text-[#40362F] shadow-xs">
                Category: <strong className="text-[#292723]">{currentCatInfo?.name || selectedCategory}</strong>
                <button onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#EDE5D8] px-3 py-1.5 rounded-full text-[#40362F] shadow-xs">
                Subcategory: <strong className="text-[#292723]">{selectedSubcategory.replace(/-/g, ' ')}</strong>
                <button onClick={() => setSelectedSubcategory('all')} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#EDE5D8] px-3 py-1.5 rounded-full text-[#40362F] shadow-xs">
                Search: <strong className="text-[#292723]">"{searchQuery}"</strong>
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#EDE5D8] px-3 py-1.5 rounded-full text-[#40362F] shadow-xs">
                In Stock Only
                <button onClick={() => setInStockOnly(false)} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedMaterial !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#EDE5D8] px-3 py-1.5 rounded-full text-[#40362F] shadow-xs">
                Material: <strong className="text-[#292723]">{selectedMaterial}</strong>
                <button onClick={() => setSelectedMaterial('all')} className="hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 font-semibold hover:underline ml-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            
            {/* Categories Filter */}
            <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-sm text-[#292723] pb-2.5 border-b border-[#EDE5D8]">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === 'all' ? 'bg-[#40362F] text-[#FAF8F3]' : 'text-[#40362F] hover:bg-[#FAF8F3]'
                  }`}
                >
                  <span>All Wholesale Catalogue</span>
                  <span className="text-[10px] opacity-75 font-mono">{products.length}</span>
                </button>
                {categories.map((cat) => {
                  const isCatSelected = selectedCategory === cat.id;
                  const catProducts = products.filter(p => p.category === cat.id || p.legacyCategory === cat.id);
                  return (
                    <div key={cat.id} className="space-y-0.5">
                      <button
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSelectedSubcategory('all');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isCatSelected 
                            ? 'bg-[#40362F] text-[#FAF8F3] font-bold' 
                            : 'text-[#40362F] hover:bg-[#FAF8F3]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className={`text-[10px] font-mono ${isCatSelected ? 'text-[#C6A66B]' : 'text-[#8B8175]'}`}>
                          {catProducts.length || cat.itemCount}
                        </span>
                      </button>

                      {/* Expandable Subcategories when category is selected */}
                      {isCatSelected && cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-3 pr-1 py-1 space-y-0.5 border-l-2 border-[#C6A66B]/50 ml-3 my-1">
                          <button
                            onClick={() => setSelectedSubcategory('all')}
                            className={`w-full text-left px-2.5 py-1 rounded-lg text-[11px] cursor-pointer flex items-center justify-between ${
                              selectedSubcategory === 'all'
                                ? 'text-[#C6A66B] font-bold bg-[#FAF8F3]'
                                : 'text-[#5C554E] hover:text-[#292723]'
                            }`}
                          >
                            <span>&bull; All {cat.name}</span>
                            <span className="text-[10px] opacity-70 font-mono">{catProducts.length}</span>
                          </button>
                          {cat.subcategories.map((sub) => {
                            const subCount = catProducts.filter(p => p.subcategory === sub.id).length;
                            const isSubSelected = selectedSubcategory === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setSelectedSubcategory(sub.id)}
                                className={`w-full text-left px-2.5 py-1 rounded-lg text-[11px] cursor-pointer flex items-center justify-between transition-colors ${
                                  isSubSelected
                                    ? 'text-[#C6A66B] font-bold bg-[#FAF8F3]'
                                    : 'text-[#5C554E] hover:text-[#292723]'
                                }`}
                              >
                                <span className="truncate">{sub.name}</span>
                                {subCount > 0 && (
                                  <span className="text-[10px] font-mono opacity-70">{subCount}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wholesale Policy & Pricing Notice */}
            <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-sm text-[#292723] pb-2.5 border-b border-[#EDE5D8]">
                Wholesale Sourcing
              </h3>
              <div className="space-y-2 text-xs text-[#40362F]">
                <div className="flex items-center gap-2 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold">Factory Direct Inventory</span>
                </div>
                <p className="text-[11px] text-[#8B8175] leading-relaxed">
                  Confidential wholesale pricing and freight quotes provided upon RFQ quotation submission.
                </p>
              </div>
            </div>

            {/* Materials Filter */}
            <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-sm text-[#292723] pb-2.5 border-b border-[#EDE5D8]">
                Gemstones &amp; Materials
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedMaterial('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs cursor-pointer ${
                    selectedMaterial === 'all' ? 'text-[#C6A66B] font-bold' : 'text-[#8B8175] hover:text-[#292723]'
                  }`}
                >
                  All Materials
                </button>
                {materialsList.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs truncate cursor-pointer ${
                      selectedMaterial === mat ? 'text-[#C6A66B] font-bold' : 'text-[#8B8175] hover:text-[#292723]'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Filter */}
            <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#40362F] font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#C6A66B] focus:ring-[#C6A66B]"
                />
                <span>In-Stock Items Only (Fast Dispatch)</span>
              </label>
            </div>

          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EDE5D8] shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F3] mx-auto flex items-center justify-center text-[#8B8175] border border-[#EDE5D8]">
                  <Search className="w-8 h-8 text-[#C6A66B]" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#292723]">No Wholesale Products Found</h3>
                <p className="text-xs text-[#8B8175] max-w-md mx-auto">
                  We could not find items matching your current filters. Try resetting the filters or searching for terms like "Turquoise", "Spacer", or "Pendant".
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-[#40362F] text-[#FAF8F3] text-xs font-bold rounded-xl hover:bg-[#52463D] transition-colors cursor-pointer"
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
          <div className="fixed inset-0 bg-[#292723]/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between border-r border-[#EDE5D8]">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE5D8]">
                <h3 className="font-serif font-bold text-base text-[#292723]">Filter Catalogue</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 cursor-pointer">
                  <X className="w-5 h-5 text-[#8B8175] hover:text-[#292723]" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <p className="text-xs font-bold text-[#8B8175] uppercase tracking-wider mb-2">Categories</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedCategory('all'); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${selectedCategory === 'all' ? 'font-bold text-[#C6A66B] bg-[#FAF8F3]' : 'text-[#40362F]'}`}
                  >
                    All Collections
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.id); setMobileFilterOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs truncate cursor-pointer ${selectedCategory === c.id ? 'font-bold text-[#C6A66B] bg-[#FAF8F3]' : 'text-[#40362F]'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div>
                <label className="flex items-center gap-2 text-xs text-[#40362F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#C6A66B] focus:ring-[#C6A66B]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3.5 bg-[#40362F] hover:bg-[#52463D] text-[#FAF8F3] text-xs font-bold rounded-xl mt-6 cursor-pointer transition-colors shadow-sm"
            >
              Apply Filters ({filteredProducts.length} items)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
