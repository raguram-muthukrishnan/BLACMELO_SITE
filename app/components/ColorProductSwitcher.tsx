import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';

interface ColorProduct {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {
    id?: string;
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
    }>;
  };
  metafields?: Array<{
    key: string;
    value: string;
    namespace: string;
  }> | null;
}

interface ColorProductSwitcherProps {
  products: ColorProduct[];
  currentProductHandle: string;
  isInWishlistState?: boolean;
  onWishlistToggle?: () => void;
}

export function ColorProductSwitcher({
  products,
  currentProductHandle,
  isInWishlistState = false,
  onWishlistToggle
}: ColorProductSwitcherProps) {
  if (!products || products.length <= 1) {
    return null;
  }

  const otherProducts = products.filter(product => product.handle !== currentProductHandle);
  const currentProduct = products.find(p => p.handle === currentProductHandle) || products[0];

  // Check if any product has stock
  const hasAvailableStock = (product: ColorProduct) => {
    return product.variants?.nodes?.some(v => v.availableForSale) ?? false;
  };

  // Get color name from metafields
  const getColorName = (product: ColorProduct) => {
    try {
      if (!product.metafields || !Array.isArray(product.metafields)) {
        return product.title;
      }

      const colorNameField = product.metafields.find(
        m => m && m.namespace === 'custom' && m.key === 'color_name'
      );
      return colorNameField?.value || product.title;
    } catch (error) {
      console.error('[Color Products] Error getting color name:', error);
      return product.title;
    }
  };

  return (
    <div className="color-product-switcher">
      <div className="color-switcher-header">
        <div className="color-switcher-left-group">
          <span className="color-switcher-label">
            Select Colour <sup className="color-count">{otherProducts.length}</sup>
          </span>
          <span className="color-switcher-current">{getColorName(currentProduct)}</span>
        </div>

        {onWishlistToggle && (
          <button
            className={`bookmark-btn ${isInWishlistState ? 'active' : ''}`}
            onClick={onWishlistToggle}
            aria-label={isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill={isInWishlistState ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="M3 2h10v12l-5-3-5 3V2z" />
            </svg>
          </button>
        )}
      </div>
      <div className="color-product-grid">
        {otherProducts.map((product) => {
          const isAvailable = hasAvailableStock(product);
          const colorName = getColorName(product);

          return (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              prefetch="intent"
              className={`color-product-swatch ${!isAvailable ? 'out-of-stock' : ''}`}
              aria-label={`${colorName} - ${isAvailable ? 'Available' : 'Out of stock'}`}
            >
              {product.featuredImage && (
                <div className="color-swatch-image-wrapper">
                  <Image
                    data={product.featuredImage}
                    alt={colorName}
                    sizes="80px"
                    className="color-swatch-image"
                  />
                  {!isAvailable && (
                    <div className="color-swatch-overlay">
                      <span className="overlay-text">Out of Stock</span>
                    </div>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
