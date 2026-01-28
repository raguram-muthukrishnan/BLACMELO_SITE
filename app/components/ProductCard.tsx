import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useState} from 'react';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

// Extended product type with images and variants
interface ProductImage {
  id?: string | null;
  altText?: string | null;
  url: string;
  width?: number | null;
  height?: number | null;
}

interface ProductVariant {
  id: string;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export interface ProductCardProduct {
  id: string;
  handle: string;
  title: string;
  featuredImage?: ProductImage | null;
  images?: {
    nodes: ProductImage[];
  };
  variants?: {
    nodes: ProductVariant[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: CurrencyCode;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: CurrencyCode;
    };
  };
}

interface ProductCardProps {
  product: ProductCardProduct;
  loading?: 'eager' | 'lazy';
}

// Plus icon for quick add
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function ProductCard({product, loading}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  
  // Get all product images, or use featured image as fallback
  const images = product.images?.nodes || (product.featuredImage ? [product.featuredImage] : []);
  const currentImage = images[currentImageIndex] || product.featuredImage;
  
  // Get product variant info - extract color and size from options
  const firstVariant = product.variants?.nodes?.[0];
  const variantCount = product.variants?.nodes?.length || 0;
  
  // Get color value from first variant
  const colorOption = firstVariant?.selectedOptions?.find(
    (opt: {name: string; value: string}) => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour'
  );
  const colorValue = colorOption?.value || '';
  const hasMultipleColors = variantCount > 1;
  
  // Get available sizes from variants
  const availableSizes = product.variants?.nodes
    ?.map(v => v.selectedOptions?.find(
      (opt: {name: string; value: string}) => opt.name.toLowerCase() === 'size'
    )?.value)
    .filter((size, index, arr) => size && arr.indexOf(size) === index) || [];
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    // Switch to second image on hover if available
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowSizes(false);
    // Return to first image
    setCurrentImageIndex(0);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (availableSizes.length > 0) {
      setShowSizes(!showSizes);
    } else {
      // Direct add to cart if no sizes
      console.log('Quick add:', product.handle);
    }
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Add to cart with selected size
    console.log('Add to cart:', product.handle, 'Size:', size);
    setShowSizes(false);
  };
  
  return (
    <Link
      to={`/products/${product.handle}`}
      className="product-card"
      prefetch="intent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="product-card-image">
        {/* Primary Image (first) */}
        {images[0] && (
          <Image
            data={images[0]}
            alt={images[0].altText || product.title}
            sizes="(min-width: 1200px) 16vw, (min-width: 768px) 25vw, 50vw"
            loading={loading}
            className={`product-card-img product-card-img-primary ${isHovered && images.length > 1 ? 'fade-out' : ''}`}
          />
        )}
        
        {/* Secondary Image (hover) */}
        {images[1] && (
          <Image
            data={images[1]}
            alt={images[1].altText || product.title}
            sizes="(min-width: 1200px) 16vw, (min-width: 768px) 25vw, 50vw"
            loading="lazy"
            className={`product-card-img product-card-img-secondary ${isHovered ? 'fade-in' : ''}`}
          />
        )}
        
        {/* Size Selector - center bottom of card */}
        {showSizes && availableSizes.length > 0 && (
          <div className="product-card-sizes">
            {availableSizes.map((size) => (
              <button
                key={size}
                className="product-card-size-btn"
                onClick={(e) => handleSizeSelect(e, size as string)}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        
        {/* Plus Icon - bottom right */}
        <button 
          className={`product-card-quick-add ${isHovered ? 'visible' : ''}`}
          onMouseEnter={() => availableSizes.length > 0 && setShowSizes(true)}
          onMouseLeave={() => setShowSizes(false)}
          onClick={handleQuickAddClick}
          aria-label="Quick add to cart"
        >
          <PlusIcon />
        </button>
      </div>
      
      <div className="product-card-info">
        <div className="product-card-info-row">
          <div className="product-card-info-left">
            <h3 className="product-card-title">{product.title}</h3>
            <p className="product-card-variant">
              {colorValue}
              {hasMultipleColors && <span className="product-card-colors">{variantCount} Colours</span>}
            </p>
          </div>
          <div className="product-card-info-right">
            {product.priceRange?.minVariantPrice && (
              <span className="product-card-price">
                <Money data={product.priceRange.minVariantPrice} />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
