import {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {ProductCard} from './ProductCard';
import type {ProductCardProduct} from './ProductCard';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Bookmark,
  X,
  Expand,
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('SUGGESTED');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const galleryRef = useRef<HTMLDivElement>(null);
  
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

  // Image navigation
  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  // Toggle expandable sections
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
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
        
        {/* LEFT: Full-Width Vertical Image Stack */}
        <div className="product-images-stack">
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

            {/* Color Selector */}
            <div className="product-color-section">
              <div className="product-color-header">
                <div className="product-color-label">
                  Select Colour <sup className="product-option-sup">2</sup>
                </div>
                <div className="product-color-current">{currentColor || 'Washed Black'}</div>
                <button className="product-bookmark-btn" aria-label="Save to wishlist">
                  <Bookmark size={20} strokeWidth={1.5} />
                </button>
              </div>
              <div className="product-color-swatches-grid">
                <button className="product-color-swatch-box active">
                  {selectedVariant?.image && (
                    <Image
                      data={selectedVariant.image}
                      alt={currentColor}
                      width={100}
                      height={120}
                      className="product-swatch-image"
                    />
                  )}
                </button>
                {images[1] && (
                  <button className="product-color-swatch-box">
                    <Image
                      data={images[1]}
                      alt="Alternative color"
                      width={100}
                      height={120}
                      className="product-swatch-image"
                    />
                  </button>
                )}
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
                <span className="benefit-text">EARN 410 PRESTIGE POINTS</span>
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
                    <div dangerouslySetInnerHTML={{__html: product.descriptionHtml || product.description || ''}} />
                  </div>
                )}
              </div>

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
