import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { CurrencyCode } from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from './AddToCartButton';
import { ProductCard } from './ProductCard';
import type { ProductCardProduct } from './ProductCard';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Bookmark,
  X,
  Expand,
} from 'lucide-react';
import { toggleWishlist, isInWishlist, type WishlistItem } from '~/lib/wishlist';
import { getColorVariantThumbnails, buildVariantUrl, isColorSelected } from '~/lib/variantHelpers';

// Types
interface ProductImage {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: CurrencyCode;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: CurrencyCode;
  } | null;
  image?: ProductImage;
  availableForSale?: boolean;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
}

interface ProductOption {
  name: string;
  optionValues?: Array<{
    name: string;
    firstSelectableVariant?: {
      availableForSale: boolean;
    };
  }>;
}

interface ProductPageProps {
  product: any;
  selectedVariant: ProductVariant;
  productOptions: ProductOption[];
  recommendations?: ProductCardProduct[];
}

export function ProductPage({
  product,
  selectedVariant,
  productOptions,
  recommendations = [],
}: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
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
  const [activeTab, setActiveTab] = useState('SUGGESTED');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const images = product.images?.nodes || [];
  const totalImages = images.length;
  const currentImage = images[currentImageIndex] || selectedVariant?.image;

  // Extract sizes and colors from options
  const sizeOption = productOptions?.find(opt => opt.name.toLowerCase() === 'size');
  const colorOption = productOptions?.find(opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour');

  const sizes = sizeOption?.optionValues || [];
  const currentColor = selectedVariant?.selectedOptions?.find(
    opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour'
  )?.value || '';

  // Get all color variant thumbnails
  const colorVariants = getColorVariantThumbnails(product, product.handle);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < totalImages - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Image navigation
  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  // Toggle expandable sections
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Check if size is available
  const isSizeAvailable = (sizeName: string) => {
    const sizeValue = sizes.find(s => s.name === sizeName);
    return sizeValue?.firstSelectableVariant?.availableForSale ?? true;
  };

  // Gallery scroll
  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const scrollAmount = 400;
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Handle body scroll when modals are open
  useEffect(() => {
    if (isGalleryOpen || isSizeGuideOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGalleryOpen, isSizeGuideOpen]);

  // Parse description into features
  const parseFeatures = (description: string | undefined) => {
    const defaultFeatures = [
      {
        title: 'Premium Quality',
        description: 'Crafted with signature BLACMELO detail and premium craftsmanship.'
      },
      {
        title: 'Relaxed Fit',
        description: 'Easy fit designed for layering and movement.'
      },
      {
        title: 'Streetwear Aesthetic',
        description: 'Bold graphics and statement designs for the modern wardrobe.'
      },
      {
        title: 'Unisex Design',
        description: 'Designed to be worn by everyone, every day.'
      }
    ];

    if (description && description.length > 50) {
      return [
        {
          title: 'About This Product',
          description: description.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
        },
        ...defaultFeatures.slice(1)
      ];
    }

    return defaultFeatures;
  };

  const features = parseFeatures(product.description);

  return (
    <div className="product-page">
      {/* REPRESENT Style: Full-width vertical image stack + Sticky sidebar */}
      <section className="product-container-represent">

        {/* LEFT: Full-Width Vertical Image Stack (Desktop) / Image Carousel (Mobile) */}
        <div className="product-images-stack">
          {/* Mobile Image Carousel */}
          <div
            className="product-mobile-carousel"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="product-carousel-track" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
              {images.map((image: ProductImage, idx: number) => (
                <div key={image.id || idx} className="product-carousel-slide">
                  <Image
                    data={image}
                    alt={image.altText || `${product.title} - ${idx + 1}`}
                    sizes="100vw"
                    className="product-carousel-img"
                  />
                </div>
              ))}
            </div>
            {/* Pagination Dots */}
            <div className="product-carousel-pagination">
              {images.map((_: any, idx: number) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
            {/* Image Counter */}
            <div className="product-carousel-counter">
              {currentImageIndex + 1} / {totalImages}
            </div>
          </div>

          {/* Desktop Image Stack */}
          {images.map((image: ProductImage, idx: number) => (
            <div key={image.id || idx} className="product-image-wrapper">
              <Image
                data={image}
                alt={image.altText || `${product.title} - ${idx + 1}`}
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="product-stack-img"
              />
            </div>
          ))}
        </div>

        {/* RIGHT: Sticky Product Details Sidebar */}
        <div className="product-sidebar-sticky">
          <div className="product-sidebar-content">

            {/* Title and Price */}
            <div className="product-header-row">
              <h1 className="product-title-main">{product.title}</h1>
              <div className="product-price-main">
                {selectedVariant?.price && <Money data={selectedVariant.price} />}
              </div>
            </div>

            {/* Color Selector - Variant Thumbnails */}
            <div className="product-color-section">
              <div className="product-color-header">
                <div className="product-color-label">
                  Select Colour <sup className="product-option-sup">{colorVariants.length}</sup>
                </div>
                <div className="product-color-current">{currentColor || 'Select a color'}</div>
                <button
                  className={`product-bookmark-btn ${isInWishlistState ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                  aria-label={isInWishlistState ? "Remove from wishlist" : "Save to wishlist"}
                >
                  <Bookmark size={20} strokeWidth={1.5} fill={isInWishlistState ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="product-color-swatches-grid">
                {colorVariants.map((variant) => {
                  const isSelected = isColorSelected(variant.colorValue, selectedVariant);
                  const variantUrl = buildVariantUrl(product.handle, variant.colorValue, colorOption?.name || 'Color');

                  return (
                    <Link
                      key={variant.id}
                      to={variantUrl}
                      className={`product-color-swatch-box ${isSelected ? 'active' : ''} ${!variant.availableForSale ? 'out-of-stock' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(variantUrl, { replace: true });
                        setCurrentImageIndex(0); // Reset to first image
                      }}
                      aria-label={`Select ${variant.colorName} - ${variant.availableForSale ? 'Available' : 'Out of stock'}`}
                    >
                      {variant.image && (
                        <Image
                          data={variant.image}
                          alt={variant.colorName}
                          width={100}
                          height={120}
                          className="product-swatch-image"
                        />
                      )}
                      {!variant.availableForSale && (
                        <div className="product-swatch-overlay">
                          <span className="product-swatch-overlay-text">Out of Stock</span>
                        </div>
                      )}
                      <div className="product-swatch-info">
                        <span className="product-swatch-color-name">{variant.colorName}</span>
                        <span className="product-swatch-price">
                          <Money data={variant.price} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Model Info and Size Guide */}
            <div className="product-info-row">
              <p className="product-model-text">
                Model is 184.5cm and 72kg wearing size M
              </p>
              <button
                className="product-size-guide-link"
                onClick={() => setIsSizeGuideOpen(true)}
              >
                Size & Fit Guide
              </button>
            </div>

            {/* Size Selector Grid */}
            {sizes.length > 0 && (
              <div className="product-size-section">
                <div className="product-size-grid">
                  {sizes.map((size) => {
                    const available = isSizeAvailable(size.name);
                    return (
                      <button
                        key={size.name}
                        className={`product-size-box ${selectedSize === size.name ? 'selected' : ''} ${!available ? 'disabled' : ''}`}
                        onClick={() => available && setSelectedSize(size.name)}
                        disabled={!available}
                      >
                        {size.name}
                      </button>
                    );
                  })}
                </div>
                <button className="product-size-notify-link">
                  Size Not In Stock?
                </button>
              </div>
            )}

            {/* Add to Cart Button */}
            {selectedSize ? (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant?.id,
                    quantity: 1,
                  },
                ]}
                disabled={!selectedVariant?.availableForSale}
              >
                <button className="product-cta-button">
                  {selectedVariant?.availableForSale ? 'SELECT A SIZE' : 'SOLD OUT'}
                </button>
              </AddToCartButton>
            ) : (
              <button className="product-cta-button" disabled>
                SELECT A SIZE
              </button>
            )}

            {/* Benefits List */}
            <div className="product-benefits-list">
              <div className="product-benefit-row">
                <span className="benefit-icon-box">💎</span>
                <span className="benefit-text">EARN 410 PRIVATE ACCESS POINTS</span>
              </div>
              <div className="product-benefit-row">
                <span className="benefit-icon-box">📦</span>
                <span className="benefit-text">FREE SHIPPING</span>
              </div>
              <div className="product-benefit-row">
                <span className="benefit-icon-box">✓</span>
                <span className="benefit-text">IN STOCK</span>
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="product-expandable-sections">
              {/* Product Details */}
              <div className="product-expandable-item">
                <button
                  className="product-expandable-trigger"
                  onClick={() => toggleSection('details')}
                >
                  <Plus size={18} strokeWidth={1.5} className={expandedSections.details ? 'rotated' : ''} />
                  <span>Product Details</span>
                </button>
                {expandedSections.details && (
                  <div className="product-expandable-content">
                    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description || '' }} />
                  </div>
                )}
              </div>

              {/* Fabric Care */}
              {product.metafields?.find((m: any) => m.key === 'fabric_care')?.value && (
                <div className="product-expandable-item">
                  <button
                    className="product-expandable-trigger"
                    onClick={() => toggleSection('fabric_care')}
                  >
                    <Plus size={18} strokeWidth={1.5} className={expandedSections.fabric_care ? 'rotated' : ''} />
                    <span>Fabric Care</span>
                  </button>
                  {expandedSections.fabric_care && (
                    <div className="product-expandable-content">
                      {(() => {
                        const fabricCareValue = product.metafields.find((m: any) => m.key === 'fabric_care')?.value || '';
                        const lines = fabricCareValue.split('\n');
                        return (
                          <div style={{ lineHeight: '1.6' }}>
                            {lines.map((line: string, idx: number) => {
                              const trimmedLine = line.trim();
                              if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                                return <div key={idx} style={{ paddingLeft: '1rem', marginBottom: '0.5rem' }}>{trimmedLine}</div>;
                              }
                              return trimmedLine ? <div key={idx} style={{ marginBottom: '0.5rem' }}>{trimmedLine}</div> : <br key={idx} />;
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Shipping & Returns */}
              <div className="product-expandable-item">
                <button
                  className="product-expandable-trigger"
                  onClick={() => toggleSection('shipping')}
                >
                  <Plus size={18} strokeWidth={1.5} className={expandedSections.shipping ? 'rotated' : ''} />
                  <span>Shipping & Returns</span>
                </button>
                {expandedSections.shipping && (
                  <div className="product-expandable-content">
                    <p><strong>UK SHIPPING</strong></p>
                    <p>• Orders over £120 - FREE (2-3 Business Days)</p>
                    <p>• Orders over £200 - FREE (1-2 Business Days)</p>
                    <p>• Express delivery available</p>
                    <br />
                    <p><strong>UK RETURNS</strong></p>
                    <p>• Free returns within 14 days</p>
                    <p>• Items must be unworn with tags attached</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: Bottom Sticky Bar */}
      <div className="product-mobile-sticky-bar">
        <div className="mobile-bar-content">
          <div className="mobile-bar-price">
            {selectedVariant?.price && <Money data={selectedVariant.price} />}
          </div>
          {selectedSize ? (
            <AddToCartButton
              lines={[
                {
                  merchandiseId: selectedVariant?.id,
                  quantity: 1,
                },
              ]}
              disabled={!selectedVariant?.availableForSale}
            >
              <button className="mobile-bar-btn">
                {selectedVariant?.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
              </button>
            </AddToCartButton>
          ) : (
            <button className="mobile-bar-btn disabled" disabled>
              SELECT A SIZE
            </button>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="product-size-guide-modal">
          <button
            className="product-size-guide-close"
            onClick={() => setIsSizeGuideOpen(false)}
            aria-label="Close size guide"
          >
            <X size={20} strokeWidth={1} />
          </button>
          <div className="product-size-guide-content">
            <h2 className="size-guide-title">Size Guide</h2>
            <p className="size-guide-model">MODEL: MODEL IS 184.5CM AND 72KG WEARING SIZE M</p>
            <div className="size-guide-table-wrapper">
              <table className="size-guide-table">
                <thead>
                  <tr>
                    <th>SIZE</th>
                    <th>CHEST WIDTH</th>
                    <th>SLEEVE LENGTH</th>
                    <th>FRONT LENGTH</th>
                    <th>SHOULDER</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>59.75</td>
                    <td>64</td>
                    <td>69</td>
                    <td>19.45</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>61</td>
                    <td>64.5</td>
                    <td>69.5</td>
                    <td>19.9</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>63.5</td>
                    <td>64.5</td>
                    <td>70.5</td>
                    <td>20.8</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>66.5</td>
                    <td>65</td>
                    <td>72</td>
                    <td>22</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>69.5</td>
                    <td>65.5</td>
                    <td>73.5</td>
                    <td>23.3</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>72.5</td>
                    <td>66</td>
                    <td>75</td>
                    <td>24.4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="product-recommendations">
          <h2 className="product-section-title">YOU MAY ALSO LIKE</h2>
          <div className="product-recommendations-grid">
            {recommendations.slice(0, 4).map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductPage;
