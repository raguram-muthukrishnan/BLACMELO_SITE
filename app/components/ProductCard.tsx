import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useState} from 'react';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

// Extended product type with images and variants
interface ProductImage {
  id?: string;
  altText?: string | null;
  url: string;
  width?: number;
  height?: number;
}

interface ProductVariant {
  id: string;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface ProductCardProduct {
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

export function ProductCard({product, loading}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get all product images, or use featured image as fallback
  const images = product.images?.nodes || (product.featuredImage ? [product.featuredImage] : []);
  const currentImage = images[currentImageIndex] || product.featuredImage;
  
  // Get product variant info
  const firstVariant = product.variants?.nodes?.[0];
  const variantCount = product.variants?.nodes?.length || 0;
  const hasMultipleColors = variantCount > 1;
  
  const handleMouseEnter = () => {
    // Switch to second image on hover if available
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  };
  
  const handleMouseLeave = () => {
    // Return to first image
    setCurrentImageIndex(0);
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
        {currentImage && (
          <Image
            data={currentImage}
            alt={currentImage.altText || product.title}
            aspectRatio="3/4"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            loading={loading}
          />
        )}
      </div>
      
      <div className="product-card-info">
        <h3 className="product-card-title">{product.title}</h3>
        
        {firstVariant?.selectedOptions && (
          <p className="product-card-variant">
            {firstVariant.selectedOptions
              .filter((option: {name: string; value: string}) => option.name !== 'Title')
              .map((option: {name: string; value: string}) => option.value)
              .join(' · ')}
            {hasMultipleColors && ` · ${variantCount} Colours`}
          </p>
        )}
        
        <div className="product-card-price">
          {product.priceRange?.minVariantPrice && (
            <Money data={product.priceRange.minVariantPrice} />
          )}
        </div>
      </div>
    </Link>
  );
}
