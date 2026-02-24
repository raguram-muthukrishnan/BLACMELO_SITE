import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { useState } from 'react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({ cart, layout }: CartSummaryProps) {
  const [shippingOpen, setShippingOpen] = useState(false);
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  // Get shipping info from first product's metafield
  const firstProduct = cart?.lines?.nodes?.[0]?.merchandise?.product;
  const shippingMetafield = firstProduct?.metafields?.find(
    (field) => field?.key === 'shipping_and_returns'
  );
  const shippingInfo = shippingMetafield?.value ? (
    <>{shippingMetafield.value}</>
  ) : (
    <>
      Free shipping. Returns accepted.{' '}
      <a href="/policies/terms-of-service" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
        Terms and conditions apply
      </a>
    </>
  );

  // Check for discounts
  const hasDiscounts = cart?.discountCodes?.some((code) => code.applicable);
  const discountAmount = cart?.cost?.totalAmount?.amount && cart?.cost?.subtotalAmount?.amount
    ? parseFloat(cart.cost.subtotalAmount.amount) - parseFloat(cart.cost.totalAmount.amount)
    : 0;

  return (
    <div aria-labelledby="cart-summary" className={className}>
      {/* Shipping & Returns Toggle */}
      <button
        className="cart-shipping-toggle"
        onClick={() => setShippingOpen(!shippingOpen)}
      >
        <span>Shipping & Returns</span>
        <span className={`cart-shipping-arrow ${shippingOpen ? 'open' : ''}`}>›</span>
      </button>

      {shippingOpen && (
        <div className="cart-shipping-content">
          <p>{shippingInfo}</p>
        </div>
      )}

      {/* Subtotal */}
      <div className="cart-subtotal-row">
        <span className="cart-subtotal-label">Subtotal</span>
        <span className="cart-subtotal-amount">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>

      {/* Discount Row - Only show if discount is applied */}
      {hasDiscounts && discountAmount > 0 && (
        <div className="cart-discount-row">
          <span className="cart-discount-label">Discount</span>
          <span className="cart-discount-amount">
            -${discountAmount.toFixed(2)}
          </span>
        </div>
      )}

      <p className="cart-tax-note">Gift cards & promotional codes applied at checkout</p>

      {/* Total */}
      <div className="cart-total-row">
        <span className="cart-total-label">TOTAL</span>
        <span className="cart-total-amount">
          {cart?.cost?.totalAmount?.amount ? (
            <Money data={cart?.cost?.totalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>

      {/* Checkout Button */}
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />

      {/* Payment Icons */}
      <div className="cart-payment-icons">
        <span className="payment-icon">VISA</span>
        <span className="payment-icon">MC</span>
        <span className="payment-icon">AMEX</span>
        <span className="payment-icon">DISCOVER</span>
        <span className="payment-icon">PAYPAL</span>
      </div>
    </div>
  );
}

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl?: string }) {
  if (!checkoutUrl) return null;

  return (
    <div className="cart-checkout-actions">
      <a href={checkoutUrl} target="_self" className="cart-checkout-button">
        SECURE CHECKOUT
      </a>
    </div>
  );
}
