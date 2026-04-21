import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Color {
  name: string;
  hex: string;
  stock: number;
  image_url?: string;
}

interface Size {
  name: string;
  stock: number;
}

interface TierPrice {
  minQuantity: number;
  maxQuantity: number | null;
  price: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image_url: string;
  images?: string[];
  status: string;
  colors?: Color[];
  sizes?: Size[];
  discount?: number;
  tierPrices?: TierPrice[];
  created_at: any;
}

interface ProductProps {
  hideSearchbar?: boolean;
  hideFilter?: boolean;
}

const Produkter = ({ hideFilter = false }: ProductProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const [selectedProductColors, setSelectedProductColors] = useState<{[key: string]: string}>({});
  const [currentImageIndices, setCurrentImageIndices] = useState<{[key: string]: number}>({});
  
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  const location = useLocation();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('');
    }
    

  }, [location]);

  useEffect(() => {
    applyFilters();
  }, [products, selectedColors, selectedSizes, inStockOnly, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef);
      const querySnapshot = await getDocs(q);
      
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      
      const activeProducts = productsData
        .filter(p => p.status === 'active')
        .sort((a, b) => {
          const aTime = a.created_at?.seconds ?? 0;
          const bTime = b.created_at?.seconds ?? 0;
          return bTime - aTime;
        });
      
      setProducts(activeProducts);
      extractFilterOptions(activeProducts);
      
      if (activeProducts.length === 0) {
        console.warn('Ingen aktive produkter fundet');
      }
    } catch (err) {
      console.error('Fejl ved indlæsning:', err);
    } finally {
      setLoading(false);
    }
  };

  const extractFilterOptions = (products: Product[]) => {
    const colorsSet = new Set<string>();
    const sizesSet = new Set<string>();

    products.forEach(product => {
      product.colors?.forEach(color => colorsSet.add(color.name.toLowerCase().trim()));
      product.sizes?.forEach(size => sizesSet.add(size.name.toLowerCase().trim()));
    });

    setAvailableColors(Array.from(colorsSet).sort());
    setAvailableSizes(Array.from(sizesSet).sort());
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (inStockOnly) {
      filtered = filtered.filter(product => product.stock > 0);
    }

  if (selectedColors.length > 0) {
    filtered = filtered.filter(product =>
      product.colors?.some(color => 
        selectedColors.includes(color.name.toLowerCase().trim())
      )
    );
  }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes?.some(size => selectedSizes.includes(size.name))
      );
    }

    setFilteredProducts(filtered);
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };;

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const selectProductColor = (productId: string, colorName: string) => {
    const normalized = colorName.toLowerCase().trim();
    setSelectedProductColors(prev => ({
      ...prev,
      [productId]: prev[productId] === normalized ? '' : normalized
    }));
  };

  const getProductImages = (product: Product): string[] => {
    return product.images && product.images.length > 0 
      ? product.images 
      : [product.image_url];
  };

  const getProductImage = (product: Product): string => {
    const selectedColorName = selectedProductColors[product.id];
    if (selectedColorName && product.colors) {
      const colorVariant = product.colors.find(
      c => c.name.toLowerCase().trim() === selectedColorName
      );
      if (colorVariant && colorVariant.image_url) {
        return colorVariant.image_url;
      }
    }
    
    const images = getProductImages(product);
    const currentIndex = currentImageIndices[product.id] || 0;
    return images[currentIndex] || product.image_url;
  };

  const nextProductImage = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = filteredProducts.find(p => p.id === productId);
    if (!product) return;
    
    const images = getProductImages(product);
    setCurrentImageIndices(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % images.length
    }));
  };

  const prevProductImage = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = filteredProducts.find(p => p.id === productId);
    if (!product) return;
    
    const images = getProductImages(product);
    setCurrentImageIndices(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + images.length) % images.length
    }));
  };

  const getPriceRange = (product: Product) => {
    if (!product.tierPrices || product.tierPrices.length === 0) {
      return null;
    }

    const validPrices = product.tierPrices.filter(tp => tp.price > 0).map(tp => tp.price);
    if (validPrices.length === 0) {
      return null;
    }

    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);

    const maxTier = product.tierPrices.find(tp => tp.maxQuantity === null);
    const minTier = product.tierPrices.find(tp => tp.minQuantity === 1);

    return {
      minPrice,
      maxPrice,
      minQty: minTier?.maxQuantity || 10,
      maxQty: maxTier?.minQuantity || 200
    };
  };

  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setSearchTerm('');
    window.history.pushState({}, '', '/produkter');
    setSelectedCategory('');
  };

  const hasActiveFilters = selectedColors.length > 0 || selectedSizes.length > 0 || inStockOnly || selectedCategory || searchTerm;

  const getCategoryDisplayName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      't-shirt': 'T-shirts',
      'polo': 'Polo t-shirts',
      'hoodie': 'Hoodies',
      'lynlas-hoodie': 'Lynlås hoodies'
    };
    return categoryNames[category] || category;
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Produkter - Premium Tøj',
    description: 'Shop vores kollektion af premium t-shirts, hoodies og polo shirts',
    numberOfItems: filteredProducts.length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ isolation: 'isolate' }}>

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <main className="grow bg-white">
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-6">
              <h1 id="produkter" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {selectedCategory ? getCategoryDisplayName(selectedCategory) : 'Vores produkter'}
              </h1>
              <p className="text-lg text-gray-600">
                {selectedCategory 
                  ? `Udforsk vores ${getCategoryDisplayName(selectedCategory).toLowerCase()}`
                  : 'Udforsk vores kollektion af premium tøj til konkurrencedygtige priser'}
              </p>
            </header>

            {selectedCategory && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    window.history.pushState({}, '', '/produkter');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#b5a087] text-white rounded-lg hover:bg-[#a08f76] transition"
                >
                  <X className="w-4 h-4" />
                  Fjern kategorifilter
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside 
              hidden={hideFilter}
              className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
              aria-label="Produkt filtre"
            >
              <div className="bg-white rounded-lg shadow-sm p-6 max-h-[calc(100vh-120px)] overflow-y-auto top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Filtre</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-[#b5a087] hover:text-blue-700 font-medium"
                    >
                      Ryd alle
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-5 h-5 text-[#b5a087] rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 font-medium">Kun på lager</span>
                    </label>
                  </div>

                  {availableColors.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Farver</h3>
                      <div className="space-y-2">
                        {availableColors.map((color) => (
                          <label key={color} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedColors.includes(color)}
                              onChange={() => toggleColor(color)}
                              className="w-5 h-5 text-[#b5a087] rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 capitalize">{color}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableSizes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Størrelser</h3>
                      <div className="flex flex-wrap gap-2">
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                              selectedSizes.includes(size)
                                ? 'bg-[#b5a087] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <section className="flex-1" aria-label="Produktliste">
              <div className="mb-6 flex items-center justify-between">
                <p className="max-sm:hidden text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span>
                  {' '}
                  {filteredProducts.length === 1 ? 'produkt' : 'produkter'} fundet
                </p>

                {showFilters && (
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-600 hover:text-gray-900"
                    aria-label="Luk filtre"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-lg overflow-hidden shadow-sm">
                      <div className="aspect-square bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ingen produkter fundet</h3>
                  <p className="text-gray-600 mb-6">Prøv at justere dine filtre</p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 bg-[#b5a087] text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Ryd alle filtre
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const priceRange = getPriceRange(product);
                    const images = getProductImages(product);
                    const currentIndex = currentImageIndices[product.id] || 0;
                    
                    return (
                      <article
                        key={product.id}
                        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition group"
                        itemScope
                        itemType="https://schema.org/Product"
                      >
                        <a href={`/produkt/${product.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden bg-gray-100">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              loading="lazy"
                              itemProp="image"
                            />
                            
                            {images.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => prevProductImage(product.id, e)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  aria-label="Forrige billede"
                                >
                                  <ChevronLeft className="w-4 h-4 text-gray-900" />
                                </button>
                                <button
                                  onClick={(e) => nextProductImage(product.id, e)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  aria-label="Næste billede"
                                >
                                  <ChevronRight className="w-4 h-4 text-gray-900" />
                                </button>
                                
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                  {images.map((_, idx) => (
                                    <div
                                      key={idx}
                                      className={`w-1.5 h-1.5 rounded-full transition ${
                                        idx === currentIndex
                                          ? 'bg-white w-4'
                                          : 'bg-white/50'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                            
                            {product.stock === 0 ? (
                              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                Udsolgt
                              </div>
                            ) : (
                              <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                På lager
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h2
                              className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#b5a087] transition line-clamp-2"
                              itemProp="name"
                            >
                              {product.name}
                            </h2>
                            
                            <p className="text-sm text-gray-600 mb-3 capitalize">{product.category}</p>

                            {product.colors && product.colors.length > 0 && (
                              <div className="flex gap-2 mb-3 flex-wrap">
                                {product.colors.slice(0, 5).map((color) => (
                                  <button
                                    key={color.name}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      selectProductColor(product.id, color.name);
                                    }}
                                    className={`w-6 h-6 rounded-full border-2 transition ${
                                      selectedProductColors[product.id] === color.name
                                        ? 'border-[#b5a087] ring-2 ring-blue-300'
                                        : 'border-gray-300 hover:border-gray-400'
                                    } ${color.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    style={{ backgroundColor: color.hex }}
                                    title={`${color.name}${color.stock === 0 ? ' (Udsolgt)' : ''}`}
                                    disabled={color.stock === 0}
                                    aria-label={`Vælg farve: ${color.name}`}
                                  />
                                ))}
                                {product.colors.length > 5 && (
                                  <span className="text-xs text-gray-500 self-center">
                                    +{product.colors.length - 5}
                                  </span>
                                )}
                              </div>
                            )}

                            <div
                              className="flex items-center justify-between"
                              itemProp="offers"
                              itemScope
                              itemType="https://schema.org/Offer"
                            >
                              <div>
                                {priceRange ? (
                                  <div>
                                    <p className="text-xl font-bold text-gray-900">
                                      {priceRange.minPrice}-{priceRange.maxPrice} kr
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      ved {priceRange.minQty}-{priceRange.maxQty}+ stk
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-2xl font-bold text-gray-900">
                                    {product.price.toFixed(0)} kr
                                  </p>
                                )}
                              </div>
                              <div className="text-[#b5a087] group-hover:translate-x-1 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </a>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Produkter;