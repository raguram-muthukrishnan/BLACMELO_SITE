import type { LoaderFunctionArgs } from 'react-router';

/**
 * GET /api/recently-viewed-prices?ids=gid://shopify/Product/1,gid://shopify/Product/2
 *
 * Returns live min-variant prices for the requested Shopify product GIDs.
 * Used by RecentlyViewed component to show current prices.
 */
export async function loader({ request, context }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const idsParam = url.searchParams.get('ids') ?? '';
    const ids = idsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    if (ids.length === 0) {
        return { prices: {} };
    }

    const { storefront } = context;

    // Shopify Storefront API supports up to 250 products per query
    const query = `#graphql
    query RecentlyViewedPrices($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

    try {
        const data = await storefront.query(query, {
            variables: { ids },
        });

        const prices: Record<string, { amount: string; currencyCode: string }> = {};

        for (const node of (data?.nodes ?? [])) {
            if (node && node.id && node.priceRange?.minVariantPrice) {
                prices[node.id] = node.priceRange.minVariantPrice;
            }
        }

        return { prices };
    } catch (err) {
        // Silently fail - component will fall back to cached localStorage price
        console.error('[recently-viewed-prices] Failed to fetch prices:', err);
        return { prices: {} };
    }
}
