import { useState, useEffect, useMemo } from 'react';
import { Image, Money } from '@shopify/hydrogen';
import { useSearchParams, useLocation, useNavigate } from 'react-router';
import { AddToCartButton } from './AddToCartButton';
import { StarRating } from './StarRating';
import { JudgemeAllReviewsRating, JudgemeAllReviewsCount } from '@judgeme/shopify-hydrogen';
import { toggleWishlist, isInWishlist, type WishlistItem } from '~/lib/wishlist';
import { ColorProductSwitcher } from './ColorProductSwitcher';
import type { CurrencyCode } from '@shopify/hydrogen/storefront-api-types';

interface ProductImage {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

interface ProductVariant {
  id: string;
  title: string;
  availableForSale?: boolean;
  price: {
    amount: string;
    currencyCode: CurrencyCode;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: CurrencyCode;
  } | null;
  image?: ProductImage | null;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
}

interface ProductOption {
  name: string;
  optionValues: Array<{
    name: string;
    firstSelectableVariant?: {
      availableForSale: boolean;
    } | null;
    swatch?: {
      color?: string;
      image?: {
        previewImage?: {
          url: string;
        };
      };
    } | null;
  }>;
}

interface ProductHeroProps {
  product: any;
  selectedVariant: ProductVariant;
  productOptions: ProductOption[];
  relatedColorProducts?: any[];
}

export function ProductHero({ product, selectedVariant, productOptions, relatedColorProducts = [] }: ProductHeroProps) {
  const images = product.images?.nodes || [];
  const [params, setParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [hasReviews, setHasReviews] = useState(false);
  const [isInWishlistState, setIsInWishlistState] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsInWishlistState(isInWishlist(product.id));
    }

    // Listen for wishlist changes
    const handleWishlistChange = () => {
      setIsInWishlistState(isInWishlist(product.id));
    };

    window.addEventListener('wishlistChanged', handleWishlistChange);
    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange);
    };
  }, [product.id]);

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    const wishlistItem: WishlistItem = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      price: `$${selectedVariant.price.amount}`,
      compareAtPrice: selectedVariant.compareAtPrice 
        ? `$${selectedVariant.compareAtPrice.amount}`
        : undefined,
      image: selectedVariant.image?.url || images[0]?.url,
      availableForSale: selectedVariant.availableForSale ?? true,
      vendor: product.vendor,
    };
    
    toggleWishlist(wishlistItem);
    setIsInWishlistState(!isInWishlistState);
  };

  // Check if product has reviews
  useEffect(() => {
    const checkReviews = () => {
      const ratingElement = document.querySelector('.jdgm-all-reviews-rating');
      const countElement = document.querySelector('.jdgm-all-reviews-count');
      
      if (ratingElement && countElement) {
        const countText = countElement.textContent || '0';
        const reviewCount = parseInt(countText.replace(/\D/g, '')) || 0;
        setHasReviews(reviewCount > 0);
      } else {
        setHasReviews(false);
      }
    };

    // Check immediately
    checkReviews();

    // Check after delays to allow Judge.me to load
    const timer1 = setTimeout(checkReviews, 500);
    const timer2 = setTimeout(checkReviews, 1500);
    const timer3 = setTimeout(checkReviews, 3000);

    // Watch for DOM changes
    const observer = new MutationObserver(checkReviews);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
    };
  }, [product.id]);

  // Sync active image with selected variant
  useEffect(() => {
    if (selectedVariant?.image) {
      const idx = images.findIndex((img: any) => img.id === selectedVariant.image?.id);
      if (idx >= 0) {
        setActiveIndex(idx);
      }
    }
  }, [selectedVariant, images]);

  const handleOptionChange = (name: string, value: string) => {
    const newParams = new URLSearchParams(params);
    newParams.set(name, value);
    setParams(newParams, { preventScrollReset: true, replace: true });
  };

  const currentOptions = useMemo(() => {
    return selectedVariant?.selectedOptions?.reduce((acc, opt) => {
      acc[opt.name] = opt.value;
      return acc;
    }, {} as Record<string, string>) || {};
  }, [selectedVariant]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Helper to get metafield value or default text
  const getMetafieldValue = (key: string, defaultText: string) => {
    const metafield = product.metafields?.find((m: any) => m?.key === key);
    return metafield?.value || defaultText;
  };

  // Get metafield values with defaults
  const secondDescription = getMetafieldValue(
    'second_description',
    product.description || 'Discover the perfect blend of style and comfort with this premium piece.'
  );
  
  const fitInfo = getMetafieldValue(
    'fit',
    'Model wears size M. Designed for a relaxed, slightly oversized fit.'
  );
  
  const fabricCare = getMetafieldValue(
    'fabric_care',
    'Professional grade cloth only. Do not machine wash. Avoid prolonged exposure to moisture or sunlight.'
  );
  
  const shippingReturns = getMetafieldValue(
    'shipping_returns',
    'Standard Shipping (3-5 Business Days)\nExpress Shipping (1-2 Business Days)\n\n14 day return policy for unused items with original tags.'
  );

  // Helper to find specific options
  const colorOption = productOptions.find(o => o.name === 'Color' || o.name === 'Colour');
  const sizeOption = productOptions.find(o => o.name === 'Size');

  const isOptionAvailable = (optionName: string, value: string) => {
    const option = productOptions.find(o => o.name === optionName);
    const val = option?.optionValues.find(v => v.name === value);
    return val?.firstSelectableVariant?.availableForSale ?? true;
  };

  return (
    <>
      {isFullscreenGallery && (
        <div className="fullscreen-gallery">
          <button
            className="fullscreen-close"
            onClick={() => setIsFullscreenGallery(false)}
            aria-label="Close gallery"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="fullscreen-image-container">
            <Image
              data={images[activeIndex]}
              sizes="100vw"
              style={{ maxHeight: '100vh', width: 'auto' }}
            />
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
            {images.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                style={{ width: 10, height: 10, borderRadius: '50%', background: idx === activeIndex ? 'white' : 'gray', border: 'none' }}
              />
            ))}
          </div>
        </div>
      )}

      <section className="hero-product">
        <div className="hero-left">
          {/* Thumbnails (Desktop) */}
          <div className="hero-thumbnails">
            {images.map((image: any, index: number) => (
              <div
                key={image.id || index}
                className={`hero-thumbnail-item ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  data={image}
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  sizes="100px"
                />
              </div>
            ))}
          </div>

          {/* Main Stage */}
          <div className="hero-image-container">
            {images.map((image: any, index: number) => (
              <div
                key={image.id || index}
                className={`hero-image-layer ${index === activeIndex ? 'active' : ''}`}
              >
                <Image
                  data={image}
                  alt={image.altText || product.title}
                  className="hero-image"
                  sizes="(min-width: 1024px) 70vw, 100vw"
                />
              </div>
            ))}

            <button className="hero-nav hero-prev" onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}>
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button className="hero-nav hero-next" onClick={() => setActiveIndex((i) => (i + 1) % images.length)}>
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>

            <button
              className="hero-nav"
              style={{ top: 'auto', bottom: '1rem', right: '1rem' }}
              onClick={() => setIsFullscreenGallery(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            </button>
          </div>
        </div>

        <div className="hero-right">
          {openSection ? (
            // Expanded Content View
            <div className="hero-expanded-view">
              <div className="hero-expanded-header">
                <h2 className="hero-expanded-title">
                  {openSection === 'description' ? 'Product Details' : 
                   openSection === 'fit' ? 'Fit' : 
                   openSection === 'fabric' ? 'Fabric Care' : 
                   openSection === 'sizechart' ? 'Size Guide' :
                   'Shipping & Returns'}
                </h2>
                <button 
                  className="hero-expanded-close"
                  onClick={() => setOpenSection(null)}
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="hero-expanded-content">
                {openSection === 'description' && (
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {secondDescription}
                  </div>
                )}
                {openSection === 'fit' && (
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {fitInfo}
                  </div>
                )}
                {openSection === 'fabric' && (
                  <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {fabricCare.split('\n').map((line: string, idx: number) => {
                      const trimmedLine = line.trim();
                      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                        return <div key={idx} style={{ paddingLeft: '1rem', marginBottom: '0.5rem' }}>{trimmedLine}</div>;
                      }
                      return trimmedLine ? <div key={idx} style={{ marginBottom: '0.5rem' }}>{trimmedLine}</div> : <br key={idx} />;
                    })}
                  </div>
                )}
                {openSection === 'sizechart' && (
                  <div className="size-chart-container">
                    <img 
                      src="/app/assets/size_chart.jpeg" 
                      alt="Size Chart" 
                      className="size-chart-image"
                    />
                  </div>
                )}
                {openSection === 'shipping' && (
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {shippingReturns}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Normal Form View
            <>
            <div className="hero-header">
              <div>
                <h1 className="hero-title">{product.title}</h1>
                <p className="hero-category">THE BLACMELO ORIGINALS</p>
              </div>
              <div className="hero-price">
                {selectedVariant?.price && <Money data={selectedVariant.price} />}
              </div>
            </div>

            {/* Star Rating */}
            {hasReviews && (
              <div className="hero-rating">
                <div className="hero-rating-judgeme">
                  <JudgemeAllReviewsRating />
                  <JudgemeAllReviewsCount />
                </div>
              </div>
            )}

            {/* Color Product Switcher - Product-level colors */}
            {relatedColorProducts && relatedColorProducts.length > 0 && (
              <ColorProductSwitcher 
                products={relatedColorProducts}
                currentProductHandle={product.handle}
              />
            )}

            {/* Variant Thumbnails - Only if no color products */}
            {(!relatedColorProducts || relatedColorProducts.length === 0) && product.variants?.nodes && (
              <div className="variant-thumbnails">
                {product.variants.nodes
                  .filter((variant: any) => variant.image)
                  .map((variant: any) => {
                    const isSelected = variant.id === selectedVariant.id;
                    return (
                      <div
                        key={variant.id}
                        className={`variant-thumb ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          const params = new URLSearchParams();
                          variant.selectedOptions?.forEach((opt: any) => {
                            params.set(opt.name, opt.value);
                          });
                          setParams(params, { preventScrollReset: true, replace: true });
                        }}
                      >
                        <Image
                          data={variant.image}
                          alt={variant.title}
                          sizes="60px"
                        />
                      </div>
                    );
                  })}
              </div>
            )}

              {/* Color Selector - Only show if no related color products */}
              {!relatedColorProducts?.length && colorOption && (
                <div className="hero-colour">
                  <div className="colour-header">
                    <div className="colour-header-left">
                      <span>Select {colorOption.name}</span>
                      <span className="colour-name">{currentOptions[colorOption.name]}</span>
                    </div>
                    <button 
                      className={`bookmark-btn ${isInWishlistState ? 'active' : ''}`}
                      onClick={handleWishlistToggle}
                      aria-label={isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill={isInWishlistState ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 2h10v12l-5-3-5 3V2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="swatches">
                    {colorOption.optionValues.map((value) => {
                      const isSelected = currentOptions[colorOption.name] === value.name;
                      const swatchUrl = value.swatch?.image?.previewImage?.url;
                      const swatchColor = value.swatch?.color;

                      return (
                        <div
                          key={value.name}
                          className={`swatch-wrapper ${isSelected ? 'active' : ''}`}
                          onClick={() => handleOptionChange(colorOption.name, value.name)}
                        >
                          {swatchUrl ? (
                            <img src={swatchUrl} alt={value.name} className="swatch-image" />
                          ) : swatchColor ? (
                            <div className="swatch-image" style={{ backgroundColor: swatchColor }} />
                          ) : (
                            <button
                              className={`size-btn ${isSelected ? 'selected' : ''}`}
                              style={{ width: 'auto', padding: '0 15px' }}
                            >
                              {value.name}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {sizeOption && (
                <div style={{ marginBottom: '2rem' }}>
                  <div className="size-header">
                    <span>Select Size</span>
                    <button 
                      className="size-guide-btn"
                      onClick={() => toggleSection('sizechart')}
                      type="button"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="hero-sizes">
                    {sizeOption.optionValues.map((value) => {
                      const isSelected = currentOptions[sizeOption.name] === value.name;
                      const available = isOptionAvailable(sizeOption.name, value.name);

                      return (
                        <button
                          key={value.name}
                          className={`size-btn ${isSelected ? 'selected' : ''} ${!available ? 'disabled' : ''}`}
                          onClick={() => available && handleOptionChange(sizeOption.name, value.name)}
                          disabled={!available}
                        >
                          {value.name}
                        </button>
                      );
                    })}
                  </div>
                  <div className="hero-size-note">
                    <a href="#" style={{ fontSize: '11px', textDecoration: 'underline', color: '#666' }}>Size Not In Stock?</a>
                  </div>
                </div>
              )}

              {/* Add To Cart - Full Width */}
              <div className="hero-cart-container">
                <AddToCartButton
                  lines={selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1 }] : []}
                  disabled={!selectedVariant || !selectedVariant.availableForSale || !currentOptions[sizeOption?.name || '']}
                  analytics={{
                    products: [
                      {
                        productGid: product.id,
                        variantGid: selectedVariant?.id,
                        name: product.title,
                        variantName: selectedVariant?.title,
                        brand: product.vendor,
                        price: selectedVariant?.price.amount,
                        quantity: 1,
                      },
                    ],
                    totalValue: parseFloat(selectedVariant?.price.amount || '0'),
                  }}
                >
                  <div className={`hero-cta ${!selectedVariant?.availableForSale ? 'disabled' : ''}`}>
                    {!selectedVariant?.availableForSale 
                      ? 'SOLD OUT' 
                      : !currentOptions[sizeOption?.name || ''] 
                        ? 'SELECT A SIZE' 
                        : 'ADD TO CART'
                    }
                  </div>
                </AddToCartButton>
              </div>

              {/* Benefits */}
              <div className="hero-benefits">
                <div className="benefit-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  <span>EARN POINTS</span>
                </div>
                <div className="benefit-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  <span>FREE SHIPPING OVER $300</span>
                </div>
                <div className="benefit-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  <span>LIMITED STOCK</span>
                </div>
              </div>

              {/* Expandable Sections - 2x2 Grid Layout */}
              <div className="hero-expandable-sections">
                <button 
                  className="expandable-section-btn"
                  onClick={() => toggleSection('description')}
                  type="button"
                >
                  <span className="expandable-icon">+</span>
                  <span className="expandable-title">Product Details</span>
                </button>

                <button 
                  className="expandable-section-btn"
                  onClick={() => toggleSection('fit')}
                  type="button"
                >
                  <span className="expandable-icon">+</span>
                  <span className="expandable-title">Fit</span>
                </button>

                <button 
                  className="expandable-section-btn"
                  onClick={() => toggleSection('fabric')}
                  type="button"
                >
                  <span className="expandable-icon">+</span>
                  <span className="expandable-title">Fabric Care</span>
                </button>

                <button 
                  className="expandable-section-btn"
                  onClick={() => toggleSection('shipping')}
                  type="button"
                >
                  <span className="expandable-icon">+</span>
                  <span className="expandable-title">Shipping & Returns</span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default ProductHero;
