import { useOptimisticCart, Image } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';
import { Link } from 'react-router';
import { useAside } from './Aside';
import { useState } from 'react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
  newProducts?: NewProduct[];
};

export type NewProduct = {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({ layout, cart: originalCart, newProducts = [] }: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const [recsOpen, setRecsOpen] = useState(false);

  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      <CartEmpty hidden={cartHasItems} layout={layout} />
      {cartHasItems ? (
        <div className="cart-details">
          {/* Cart Items */}
          <div className="cart-items-container" aria-labelledby="cart-lines">
            <ul className="cart-items-list">
              {(cart?.lines?.nodes ?? []).map((line) => (
                <CartLineItem key={line.id} line={line} layout={layout} />
              ))}
            </ul>
          </div>

          {/* Others Also Bought Section - Collapsible in Aside */}
          {newProducts.length > 0 && (
            <div className="cart-recommendations">
              <button
                className="cart-recommendations-toggle"
                onClick={() => setRecsOpen(!recsOpen)}
              >
                <h3 className="cart-recommendations-title">OTHERS ALSO BOUGHT</h3>
                <span className={`cart-recommendations-arrow ${recsOpen ? 'open' : ''}`}>›</span>
              </button>

              {recsOpen && (
                <div className="cart-recommendations-scroll">
                  {newProducts.slice(0, 4).map((product) => (
                    <CartRecommendationItem key={product.id} product={product} layout={layout} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cart Summary */}
          <CartSummary cart={cart} layout={layout} />
        </div>
      ) : null}
    </div>
  );
}

function CartRecommendationItem({ product, layout }: { product: NewProduct; layout: CartLayout }) {
  const { close } = useAside();
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);

  const handleNavigate = () => {
    if (layout === 'aside') close();
    window.location.href = `/products/${product.handle}`;
  };

  return (
    <div
      className="cart-rec-item"
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleNavigate(); }}
      aria-label={`View ${product.title}`}
    >
      <div className="cart-rec-image">
        {product.featuredImage ? (
          <Image
            data={product.featuredImage}
            alt={product.featuredImage.altText || product.title}
            width={120}
            height={150}
            sizes="120px"
          />
        ) : (
          <div className="cart-rec-image-placeholder" />
        )}
      </div>
      <div className="cart-rec-info">
        <span className="cart-rec-price">{formattedPrice}</span>
        <span className="cart-rec-add" aria-label={`View ${product.title}`}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  if (hidden) return null;

  return (
    <div className="cart-empty">
      <p className="cart-empty-message">Your cart is empty.</p>
      <a href="/collections/new-arrival" className="cart-empty-button">
        BROWSE PRODUCTS
      </a>
    </div>
  );
}
