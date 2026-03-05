import { type FetcherWithComponents } from 'react-router';
import { CartForm, type OptimisticCartLineInput, useAnalytics, AnalyticsEvent } from '@shopify/hydrogen';
import { useAside } from '~/components/Aside';
import { useEffect } from 'react';

/**
 * Inner component so hooks (useAside, useAnalytics, useEffect) are called
 * inside a proper React function component rather than inside a render prop.
 */
function CartFormContent({
  fetcher,
  analytics,
  children,
  onClick,
  disabled,
  className,
}: {
  fetcher: FetcherWithComponents<any>;
  analytics?: unknown;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}) {
  const { open } = useAside();
  const { publish, shop } = useAnalytics();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.cart) {
      // Open the cart drawer
      open('cart');

      // Publish product_added_to_cart event if analytics data is available
      if (analytics && typeof analytics === 'object') {
        const data = analytics as any;
        publish(AnalyticsEvent.PRODUCT_ADD_TO_CART, {
          cartId: fetcher.data.cart.id,
          cart: fetcher.data.cart,
          prevCart: null,
          shop,
          ...data,
        });
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <input
        name="analytics"
        type="hidden"
        value={JSON.stringify(analytics)}
      />
      <button
        type="submit"
        onClick={onClick}
        disabled={disabled ?? fetcher.state !== 'idle'}
        className={className}
      >
        {children}
      </button>
    </>
  );
}

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <CartFormContent
          fetcher={fetcher}
          analytics={analytics}
          onClick={onClick}
          disabled={disabled}
          className={className}
        >
          {children}
        </CartFormContent>
      )}
    </CartForm>
  );
}
