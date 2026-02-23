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
  const getMetafieldValue = (namespaceKey: string, defaultText: string = '') => {
    const parts = namespaceKey.split('.');
    const namespace = parts.length > 1 ? parts[0] : 'custom';
    const key = parts.length > 1 ? parts[1] : parts[0];

    const metafield = product.metafields?.find((m: any) =>
      m?.namespace === namespace && m?.key === key
    );
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
        <div className="fullscreen-gallery" data-lenis-prevent>
          <button
            className="fullscreen-close"
            onClick={() => setIsFullscreenGallery(false)}
            aria-label="Close gallery"
          >
            ✕
          </button>

          <div className="fullscreen-image-container">
            {images.map((image: any, idx: number) => (
              <div
                key={image.id || idx}
                className="fullscreen-image-wrapper"
                id={`fullscreen-img-${idx}`}
              >
                <Image
                  data={image}
                  sizes="100vw"
                  loading={idx < 2 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="mobile-only">
            <button
              className="fullscreen-nav fullscreen-prev"
              onClick={(e) => {
                e.stopPropagation();
                const container = document.querySelector('.fullscreen-image-container');
                if (container) container.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              className="fullscreen-nav fullscreen-next"
              onClick={(e) => {
                e.stopPropagation();
                const container = document.querySelector('.fullscreen-image-container');
                if (container) container.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      )}

      <section className="hero-product">
        <div className="hero-left">
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
          <div className="hero-right-content">
            {/* Desktop-Only Takeover View */}
            {openSection && (
              <div className="hero-expanded-view desktop-only">
                <div className="hero-expanded-header">
                  <h3 className="hero-title">
                    {openSection === 'description' && 'Product Details'}
                    {openSection === 'fit' && 'Fit'}
                    {openSection === 'fabric' && 'Fabric Care'}
                    {openSection === 'shipping' && 'Shipping & Returns'}
                    {openSection === 'sizechart' && 'Size Guide'}
                  </h3>
                  <button className="hero-expanded-close" onClick={() => setOpenSection(null)}>✕</button>
                </div>
                <div className="hero-expanded-content">
                  {openSection === 'description' && (
                    <div className="inner-padding" style={{ whiteSpace: 'pre-line' }}>{secondDescription}</div>
                  )}
                  {openSection === 'fit' && (
                    <div className="inner-padding" style={{ whiteSpace: 'pre-line' }}>{fitInfo}</div>
                  )}
                  {openSection === 'fabric' && (
                    <div className="inner-padding" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                      {fabricCare.split('\n').map((line: string, idx: number) => {
                        const trimmedLine = line.trim();
                        if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                          return <div key={idx} style={{ paddingLeft: '1rem', marginBottom: '0.4rem' }}>{trimmedLine}</div>;
                        }
                        return trimmedLine ? <div key={idx} style={{ marginBottom: '0.4rem' }}>{trimmedLine}</div> : <br key={idx} />;
                      })}
                    </div>
                  )}
                  {openSection === 'shipping' && (
                    <div className="inner-padding" style={{ whiteSpace: 'pre-line' }}>{shippingReturns}</div>
                  )}
                  {openSection === 'sizechart' && (
                    <div className="inner-padding">
                      <div className="size-chart-unit-toggle">
                        <button className="unit-btn active">CM</button>
                        <button className="unit-btn">INCH</button>
                      </div>
                      <div className="size-chart-table-wrapper">
                        <table className="size-chart-table">
                          <thead>
                            <tr>
                              <th>Size</th>
                              <th>Chest</th>
                              <th>Waist</th>
                              <th>Length</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>XS</td><td>86-91</td><td>71-76</td><td>68</td></tr>
                            <tr><td>S</td><td>91-96</td><td>76-81</td><td>70</td></tr>
                            <tr><td>M</td><td>96-101</td><td>81-86</td><td>72</td></tr>
                            <tr><td>L</td><td>101-106</td><td>86-91</td><td>74</td></tr>
                            <tr><td>XL</td><td>106-111</td><td>91-96</td><td>76</td></tr>
                            <tr><td>XXL</td><td>111-116</td><td>96-101</td><td>78</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Main Product Info - Always visible on mobile, hidden on desktop during takeover */}
            <div className={`hero-main-info ${openSection ? 'desktop-hide' : ''}`}>
              <div className="hero-header">
                <div>
                  <h1 className="hero-title">{product.title}</h1>
                  <p className="hero-category">
                    {getMetafieldValue('shopify.category') ||
                      product.productType ||
                      product.collections?.nodes?.[0]?.title ||
                      ''}
                  </p>
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

              {/* Color section logic */}
              {(() => {
                const colorOptionName = colorOption?.name || 'Color';
                const colorMetafield = getMetafieldValue('color_name');
                let currentColor = currentOptions[colorOptionName] || colorMetafield;

                if (!currentColor && product.title.includes(' - ')) {
                  currentColor = product.title.split(' - ').pop();
                }

                if (!currentColor) currentColor = 'Standard';

                if (relatedColorProducts && relatedColorProducts.length > 0) {
                  return (
                    <ColorProductSwitcher
                      products={relatedColorProducts}
                      currentProductHandle={product.handle}
                      isInWishlistState={isInWishlistState}
                      onWishlistToggle={handleWishlistToggle}
                    />
                  );
                }

                const colorValues = colorOption?.optionValues || [];
                const hasMultipleColors = colorValues.length > 1;

                return (
                  <div className="hero-colour">
                    <div className="colour-header">
                      <div className="colour-header-left">
                        <span>Colour {hasMultipleColors && <sup className="color-count">{colorValues.length}</sup>}</span>
                        <span className="colour-name">{currentColor}</span>
                      </div>
                      <button className={`bookmark-btn ${isInWishlistState ? 'active' : ''}`} onClick={handleWishlistToggle}>
                        <svg width="18" height="18" viewBox="0 0 16 16" fill={isInWishlistState ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 2h10v12l-5-3-5 3V2z" />
                        </svg>
                      </button>
                    </div>
                    {hasMultipleColors && (
                      <div className="swatches">
                        {colorValues.map((value) => {
                          const isSelected = currentOptions[colorOptionName] === value.name;
                          const swatchUrl = value.swatch?.image?.previewImage?.url;
                          const swatchColor = value.swatch?.color;
                          return (
                            <div key={value.name} className={`swatch-wrapper ${isSelected ? 'active' : ''}`} onClick={() => handleOptionChange(colorOptionName, value.name)}>
                              {swatchUrl ? <img src={swatchUrl} alt={value.name} className="swatch-image" /> : swatchColor ? <div className="swatch-image" style={{ backgroundColor: swatchColor }} /> : <div className="swatch-image" style={{ background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{value.name}</div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {sizeOption && (
                <div style={{ marginBottom: '2rem' }}>
                  <div className="size-header">
                    <span>Select Size</span>
                    <button className="size-guide-btn" onClick={() => toggleSection('sizechart')} type="button">Size Guide</button>
                  </div>
                  <div className="hero-sizes">
                    {sizeOption.optionValues.map((value) => {
                      const isSelected = currentOptions[sizeOption.name] === value.name;
                      const available = isOptionAvailable(sizeOption.name, value.name);
                      return (
                        <button key={value.name} className={`size-btn ${isSelected ? 'selected' : ''} ${!available ? 'disabled' : ''}`} onClick={() => available && handleOptionChange(sizeOption.name, value.name)} disabled={!available}>
                          {value.name}
                        </button>
                      );
                    })}
                  </div>
                  <div className="hero-size-note"><a href="#">Size Not In Stock?</a></div>
                </div>
              )}

              {/* Add To Cart */}
              <div className="hero-cart-container">
                <AddToCartButton
                  lines={selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1 }] : []}
                  disabled={!selectedVariant || !selectedVariant.availableForSale || !currentOptions[sizeOption?.name || '']}
                  analytics={{ products: [{ productGid: product.id, variantGid: selectedVariant?.id, name: product.title, variantName: selectedVariant?.title, brand: product.vendor, price: selectedVariant?.price.amount, quantity: 1 }], totalValue: parseFloat(selectedVariant?.price.amount || '0') }}
                >
                  <div className={`hero-cta ${!selectedVariant?.availableForSale ? 'disabled' : ''}`}>
                    {!selectedVariant?.availableForSale ? 'SOLD OUT' : !currentOptions[sizeOption?.name || ''] ? 'SELECT A SIZE' : 'ADD TO CART'}
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

              {/* Expandable Sections (Accordion for Mobile) */}
              <div className="hero-expandable-sections">
                <div className={`accordion-item ${openSection === 'description' ? 'active' : ''}`}>
                  <button className="expandable-section-btn" onClick={() => toggleSection('description')} type="button">
                    <span className="expandable-title">Product Details</span>
                    <span className="expandable-icon">{openSection === 'description' ? '−' : '+'}</span>
                  </button>
                  <div className="accordion-content mobile-only">
                    <div className="inner-padding">{secondDescription}</div>
                  </div>
                </div>

                <div className={`accordion-item ${openSection === 'fit' ? 'active' : ''}`}>
                  <button className="expandable-section-btn" onClick={() => toggleSection('fit')} type="button">
                    <span className="expandable-title">Fit</span>
                    <span className="expandable-icon">{openSection === 'fit' ? '−' : '+'}</span>
                  </button>
                  <div className="accordion-content mobile-only">
                    <div className="inner-padding">{fitInfo}</div>
                  </div>
                </div>

                <div className={`accordion-item ${openSection === 'fabric' ? 'active' : ''}`}>
                  <button className="expandable-section-btn" onClick={() => toggleSection('fabric')} type="button">
                    <span className="expandable-title">Fabric Care</span>
                    <span className="expandable-icon">{openSection === 'fabric' ? '−' : '+'}</span>
                  </button>
                  <div className="accordion-content mobile-only">
                    <div className="inner-padding" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                      {fabricCare.split('\n').map((line: string, idx: number) => (
                        <div key={idx} style={{ marginBottom: '0.4rem' }}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`accordion-item ${openSection === 'shipping' ? 'active' : ''}`}>
                  <button className="expandable-section-btn" onClick={() => toggleSection('shipping')} type="button">
                    <span className="expandable-title">Shipping & Returns</span>
                    <span className="expandable-icon">{openSection === 'shipping' ? '−' : '+'}</span>
                  </button>
                  <div className="accordion-content mobile-only">
                    <div className="inner-padding">{shippingReturns}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}

export default ProductHero;
