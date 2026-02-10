import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
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

          {/* Others Also Bought Section */}
          <div className="cart-recommendations">
            <h3 className="cart-recommendations-title">OTHERS ALSO BOUGHT</h3>
            <div className="cart-recommendations-grid">
              {/* Placeholder for recommended products */}
            </div>
          </div>

          {/* Cart Summary */}
          <CartSummary cart={cart} layout={layout} />
        </div>
      ) : null}
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
