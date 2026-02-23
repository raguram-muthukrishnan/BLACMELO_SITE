import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import { Image, Money, Pagination } from '@shopify/hydrogen';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { scrollToTop, getLenisInstance } from '~/lib/lenis';
import type { ProductCardProduct } from './ProductCard';
import { Slider } from '~/components/ui/slider';

// Import banner images for conditional hero
import ss26Banner from '~/assets/home_page_banners/ss26.jpeg';
import archiveBanner from '~/assets/home_page_banners/bl_archive.jpeg';
import originalsBanner from '~/assets/home_page_banners/bl_originals.jpeg';

const COLOR_HEX_MAP: { [key: string]: string } = {
  white: '#FFFFFF',
  black: '#000000',
  grey: '#808080',
  gray: '#808080',
  brown: '#8B4513',
  cream: '#FFFDD0',
  blue: '#0000FF',
  green: '#008000',
  pink: '#FFC0CB',
  yellow: '#FFFF00',
  red: '#FF0000',
  navy: '#000080',
  beige: '#F5F5DC',
  ivory: '#FFFFF0',
  sand: '#C2B280',
  khaki: '#F0E68C',
  olive: '#808000',
  maroon: '#800000',
  purple: '#800080',
  orange: '#FFA500',
  charcoal: '#36454F',
  silver: '#C0C0C0',
  gold: '#FFD700',
  tan: '#D2B48C',
  camel: '#C19A6B',
  stone: '#877F7D',
};

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RepresentCollectionPageProps {
  collection: {
    id: string;
    handle: string;
    title: string;
    description?: string | null;
    image?: {
      url: string;
      altText?: string | null;
    } | null;
    products: {
      nodes: ProductCardProduct[];
      pageInfo: {
        hasPreviousPage: boolean;
        hasNextPage: boolean;
        startCursor?: string | null;
        endCursor?: string | null;
      };
    };
  };
}

// Grid Icon
function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// List Icon
function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Filter Icon
function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function RepresentCollectionPage({ collection }: RepresentCollectionPageProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModel, setShowModel] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter states
  const [sortBy, setSortBy] = useState<string>('latest');
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [coloursOpen, setColoursOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1930 });

  // Prevent body scroll when filter is open
  useEffect(() => {
    const lenis = getLenisInstance();

    if (filterOpen) {
      // Stop Lenis smooth scroll
      if (lenis) {
        lenis.stop();
      }
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restart Lenis smooth scroll
      if (lenis) {
        lenis.start();
      }
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      // Cleanup: restore scroll on unmount
      if (lenis) {
        lenis.start();
      }
      document.body.style.overflow = '';
    };
  }, [filterOpen]);

  // Extract dynamic filters from all products
  const dynamicFilterData = useMemo(() => {
    const products = collection.products.nodes;

    const categories = new Set<string>();
    const colors = new Set<string>();
    const vendors = new Set<string>();
    const sizes = {
      Tops: new Set<string>(),
      Bottoms: new Set<string>(),
      Denim: new Set<string>(),
      Footwear: new Set<string>(),
      Accessories: new Set<string>(),
    };

    products.forEach(product => {
      // Categories from productType
      if (product.productType) categories.add(product.productType);

      // Vendor/Collection
      if (product.vendor) vendors.add(product.vendor);

      // Extract colors and sizes from variants
      product.variants?.nodes?.forEach(variant => {
        variant.selectedOptions.forEach(option => {
          const name = option.name.toLowerCase();
          const value = option.value;

          if (name === 'color' || name === 'colour') {
            colors.add(value);
          }

          if (name === 'size') {
            const type = product.productType?.toLowerCase() || '';
            if (type.includes('pant') || type.includes('short')) {
              sizes.Bottoms.add(value);
            } else if (type.includes('denim') || type.includes('jeans')) {
              sizes.Denim.add(value);
            } else if (type.includes('shoe') || type.includes('footwear')) {
              sizes.Footwear.add(value);
            } else if (type.includes('accessory') || type.includes('socks') || type.includes('cap') || type.includes('hat')) {
              sizes.Accessories.add(value);
            } else {
              sizes.Tops.add(value);
            }
          }
        });
      });
    });

    return {
      categories: Array.from(categories).sort(),
      colors: Array.from(colors).sort(),
      vendors: Array.from(vendors).sort(),
      sizes: {
        all: sizes,
        Tops: Array.from(sizes.Tops).sort(),
        Bottoms: Array.from(sizes.Bottoms).sort(),
        Denim: Array.from(sizes.Denim).sort(),
        Footwear: Array.from(sizes.Footwear).sort(),
        Accessories: Array.from(sizes.Accessories).sort(),
      }
    };
  }, [collection.products.nodes]);

  // Filter and sort products
  const getFilteredAndSortedProducts = (products: ProductCardProduct[]) => {
    let filtered = [...products];

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = parseFloat(product.priceRange?.minVariantPrice?.amount || '0');
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => {
        return selectedCategories.includes(product.productType || '');
      });
    }

    // Filter by size
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => {
        const productSizes = product.variants?.nodes?.map(v =>
          v.selectedOptions?.find(opt => opt.name.toLowerCase() === 'size')?.value
        ).filter(Boolean) || [];
        return selectedSizes.some(size => productSizes.includes(size));
      });
    }

    // Filter by colour
    if (selectedColours.length > 0) {
      filtered = filtered.filter(product => {
        const productColours = product.variants?.nodes?.map(v =>
          v.selectedOptions?.find(opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour')?.value
        ).filter(Boolean) || [];
        return selectedColours.some(colour =>
          productColours.some(pc => pc?.toLowerCase().includes(colour.toLowerCase()))
        );
      });
    }

    // Filter by collection (vendor)
    if (selectedCollections.length > 0) {
      filtered = filtered.filter(product => {
        return selectedCollections.includes(product.vendor || '');
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
          const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
          return priceB - priceA;
        });
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
          const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
          return priceA - priceB;
        });
        break;
      case 'popular':
        // For now, keep original order (you can add popularity logic later)
        break;
      case 'latest':
      default:
        // Keep original order (assuming products are already sorted by latest)
        break;
    }

    return filtered;
  };

  // Reset scroll position when component mounts
  useEffect(() => {
    scrollToTop(true);
  }, []);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import video on client side only
    import('~/assets/banner images/vid 1.mp4').then((module) => {
      setVideoSrc(module.default);
    });
  }, []);

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, user interaction required
      });
    }
  }, [videoSrc]);

  useEffect(() => {
    if (!isClient || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.represent-product-card');

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isClient, collection.products.nodes]);

  // Get all products for filtering (including pagination)
  const allProducts = collection.products.nodes;
  const filteredProducts = getFilteredAndSortedProducts(allProducts);
  const productCount = filteredProducts.length;

  // Count active filters
  const activeFilterCount = selectedSizes.length + selectedColours.length + selectedCategories.length + selectedCollections.length + (sortBy !== 'latest' ? 1 : 0);

  return (
    <div className="represent-collection-page">
      {/* 1. Clean Hero Banner with Video */}
      <header className="represent-hero">
        {isClient && (
          (() => {
            const handle = collection.handle.toLowerCase();
            let displayImage = null;

            if (handle.includes('spring-summer')) {
              displayImage = ss26Banner;
            } else if (handle.includes('archive')) {
              displayImage = archiveBanner;
            } else if (handle.includes('originals')) {
              displayImage = originalsBanner;
            }

            if (displayImage) {
              const handleLower = handle.toLowerCase();
              const heroClass = (handleLower.includes('spring-summer') || handleLower.includes('ss26')) ? 'ss26-hero' :
                handleLower.includes('archive') ? 'archive-hero' :
                  (handleLower.includes('blacmelo') || handleLower.includes('originals')) ? 'originals-hero' : '';
              return (
                <img
                  src={displayImage}
                  alt={collection.title}
                  className={`represent-hero-image ${heroClass}`}
                />
              );
            }

            return videoSrc ? (
              <video
                ref={videoRef}
                className="represent-hero-video"
                loop
                muted
                playsInline
                autoPlay
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            ) : (
              <div className="represent-hero-placeholder" />
            );
          })()
        )}
      </header>

      {/* 2. Collection Info Bar */}
      <div className="represent-collection-info">
        <h1 className="represent-collection-title">{collection.title}</h1>
        <span className="represent-product-count">{productCount}</span>
      </div>

      {/* 3. Controls Bar - View Toggle, Model Toggle, Filter */}
      <nav className="represent-controls-bar">
        <div className="represent-controls-left">
          {/* View Toggle */}
          <div className="represent-view-toggle">
            <button
              className={`represent-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <GridIcon />
            </button>
            <button
              className={`represent-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <ListIcon />
            </button>
          </div>

          {/* Model Toggle */}
          <button
            className={`represent-model-toggle ${showModel ? 'active' : ''}`}
            onClick={() => setShowModel(!showModel)}
          >
            Model
          </button>
        </div>

        <div className="represent-controls-right">
          <button
            className="represent-filter-btn"
            onClick={() => setFilterOpen(true)}
          >
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
            <FilterIcon />
          </button>
        </div>
      </nav>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="filter-overlay" onClick={() => setFilterOpen(false)}>
          <div
            className="filter-panel"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="filter-header">
              <h3 className="filter-title">Filter</h3>
              <button
                className="filter-close"
                onClick={() => setFilterOpen(false)}
                aria-label="Close filter"
              >
                ✕
              </button>
            </div>

            {/* Filter Content */}
            <div className="filter-content" data-lenis-prevent>
              {/* Sort By */}
              <div className="filter-section">
                <h3 className="filter-section-title">Sort By</h3>
                <div className="filter-options">
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="sort"
                      value="latest"
                      checked={sortBy === 'latest'}
                      onChange={(e) => setSortBy(e.target.value)}
                    />
                    <span>Latest/Newest</span>
                  </label>
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="sort"
                      value="popular"
                      checked={sortBy === 'popular'}
                      onChange={(e) => setSortBy(e.target.value)}
                    />
                    <span>Most Popular</span>
                  </label>
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="sort"
                      value="price-high"
                      checked={sortBy === 'price-high'}
                      onChange={(e) => setSortBy(e.target.value)}
                    />
                    <span>Price: High to low</span>
                  </label>
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="sort"
                      value="price-low"
                      checked={sortBy === 'price-low'}
                      onChange={(e) => setSortBy(e.target.value)}
                    />
                    <span>Price: Low to high</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-section filter-collapsible">
                <button
                  className="filter-section-header"
                  onClick={() => setPriceRangeOpen(!priceRangeOpen)}
                >
                  <span>Price Range</span>
                  <svg
                    className={`filter-chevron ${priceRangeOpen ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {priceRangeOpen && (
                  <div className="filter-collapse-content">
                    <div className="price-range-display">
                      <span>${priceRange.min}</span>
                      <span>${priceRange.max}</span>
                    </div>
                    <div className="price-range-slider-wrapper">
                      <Slider
                        value={[priceRange.min, priceRange.max]}
                        onValueChange={(values) => {
                          setPriceRange({ min: values[0], max: values[1] });
                        }}
                        min={0}
                        max={1930}
                        step={10}
                        className="price-range-slider"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Product Category */}
              <div className="filter-section filter-collapsible">
                <button
                  className="filter-section-header"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                >
                  <span>Product Category</span>
                  <svg
                    className={`filter-chevron ${categoryOpen ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {categoryOpen && (
                  <div className="filter-collapse-content">
                    <div className="filter-checkboxes">
                      {dynamicFilterData.categories.map((category) => (
                        <label key={category} className="filter-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, category]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== category));
                              }
                            }}
                          />
                          <span>{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Size */}
              <div className="filter-section filter-collapsible">
                <button
                  className="filter-section-header"
                  onClick={() => setSizeOpen(!sizeOpen)}
                >
                  <span>Size</span>
                  <svg
                    className={`filter-chevron ${sizeOpen ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {sizeOpen && (
                  <div className="filter-collapse-content">
                    {/* Dynamic Sizes grouped by category */}
                    {Object.entries(dynamicFilterData.sizes.all).map(([groupName, sizeSet]) => {
                      const sizes = Array.from(sizeSet).sort();
                      if (sizes.length === 0) return null;

                      return (
                        <div key={groupName} className="size-category">
                          <h4 className="size-category-title">{groupName}</h4>
                          <div className="size-grid">
                            {sizes.map((size) => (
                              <button
                                key={`${groupName}-${size}`}
                                className={`size-button ${selectedSizes.includes(size) ? 'active' : ''}`}
                                onClick={() => {
                                  if (selectedSizes.includes(size)) {
                                    setSelectedSizes(selectedSizes.filter(s => s !== size));
                                  } else {
                                    setSelectedSizes([...selectedSizes, size]);
                                  }
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Colours */}
              <div className="filter-section filter-collapsible">
                <button
                  className="filter-section-header"
                  onClick={() => setColoursOpen(!coloursOpen)}
                >
                  <span>Colours</span>
                  <svg
                    className={`filter-chevron ${coloursOpen ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {coloursOpen && (
                  <div className="filter-collapse-content">
                    <div className="color-grid">
                      {dynamicFilterData.colors.map((colorName) => {
                        const hexValue = COLOR_HEX_MAP[colorName.toLowerCase()] || '#EEEEEE';
                        return (
                          <label key={colorName} className="color-option">
                            <input
                              type="checkbox"
                              checked={selectedColours.includes(colorName)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedColours([...selectedColours, colorName]);
                                } else {
                                  setSelectedColours(selectedColours.filter(c => c !== colorName));
                                }
                              }}
                            />
                            <span className="color-swatch" style={{ background: hexValue }}></span>
                            <span className="color-name">{colorName}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Collection */}
              <div className="filter-section filter-collapsible">
                <button
                  className="filter-section-header"
                  onClick={() => setCollectionOpen(!collectionOpen)}
                >
                  <span>Collection</span>
                  <svg
                    className={`filter-chevron ${collectionOpen ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {collectionOpen && (
                  <div className="filter-collapse-content">
                    <div className="filter-checkboxes">
                      {dynamicFilterData.vendors.map((vendor) => (
                        <label key={vendor} className="filter-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedCollections.includes(vendor)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCollections([...selectedCollections, vendor]);
                              } else {
                                setSelectedCollections(selectedCollections.filter(c => c !== vendor));
                              }
                            }}
                          />
                          <span>{vendor}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="filter-footer">
              <button
                className="filter-clear-btn"
                onClick={() => {
                  setSortBy('latest');
                  setSelectedSizes([]);
                  setSelectedColours([]);
                  setSelectedCategories([]);
                  setSelectedCollections([]);
                  setPriceRange({ min: 0, max: 1930 });
                }}
              >
                CLEAR SELECTION
              </button>
              <button
                className="filter-apply-btn"
                onClick={() => setFilterOpen(false)}
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Product Grid */}
      <Pagination connection={collection.products}>
        {({ nodes, isLoading, NextLink, hasNextPage }) => {
          const filteredProducts = getFilteredAndSortedProducts(nodes);

          return (
            <>
              <main ref={gridRef} className={`represent-product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <RepresentProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))
                ) : (
                  <div className="no-products-message">
                    <p>No products match your filters. Try adjusting your selection.</p>
                  </div>
                )}
              </main>

              {/* Load More */}
              {hasNextPage && (
                <div className="represent-load-more">
                  <NextLink className="represent-load-more-btn">
                    {isLoading ? 'Loading...' : 'Load More'}
                  </NextLink>
                </div>
              )}
            </>
          );
        }}
      </Pagination>
    </div>
  );
}

// Represent-style Product Card with Image Swap
function RepresentProductCard({ product, viewMode }: { product: ProductCardProduct; viewMode: 'grid' | 'list' }) {
  const images = product.images?.nodes || (product.featuredImage ? [product.featuredImage] : []);
  const image1 = images[0] || product.featuredImage;
  const image2 = images[1];

  // Get product variant info - extract color and size from options
  const firstVariant = product.variants?.nodes?.[0];

  // Get color value from first variant
  const colorOption = firstVariant?.selectedOptions?.find(
    (opt: { name: string; value: string }) => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour'
  );
  const colorValue = colorOption?.value || '';

  // Get proper color name from metafield if available
  // Check multiple possible metafield locations with null safety
  const colorMetafield = product.metafields?.filter(Boolean).find(
    (m) => m && (m.key === 'color_name' || m.key === 'color' || m.key === 'Color') &&
      (m.namespace === 'custom' || m.namespace === 'category' || m.namespace?.includes('tshirt'))
  );
  const displayColorName = colorMetafield?.value || colorValue;

  // Count unique colors from variants
  const uniqueColors = new Set(
    product.variants?.nodes?.map(v =>
      v.selectedOptions?.find(
        (opt: { name: string; value: string }) => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour'
      )?.value
    ).filter(Boolean)
  );
  const colorCount = uniqueColors.size;
  const hasMultipleColors = colorCount > 1;

  return (
    <Link to={`/products/${product.handle}`} className="represent-product-card group">
      <div className="represent-card-image-wrapper">
        {/* Primary Image */}
        {image1 && (
          <Image
            data={image1}
            alt={image1.altText || product.title}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            loading="lazy"
            className="represent-card-image represent-card-image-primary"
          />
        )}

        {/* Secondary Image (Hover) */}
        {image2 && (
          <Image
            data={image2}
            alt={image2.altText || product.title}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            loading="lazy"
            className="represent-card-image represent-card-image-secondary"
          />
        )}
      </div>

      <div className="represent-card-info">
        <div className="represent-card-info-row">
          <div className="represent-card-info-left">
            <h3 className="represent-card-title">{product.title}</h3>
            {displayColorName && (
              <p className="represent-card-variant">
                {displayColorName}
                {hasMultipleColors && <span className="represent-card-colors"> {colorCount} Colours</span>}
              </p>
            )}
          </div>
          <div className="represent-card-info-right">
            {product.priceRange?.minVariantPrice && (
              <span className="represent-card-price">
                <Money data={product.priceRange.minVariantPrice} />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
