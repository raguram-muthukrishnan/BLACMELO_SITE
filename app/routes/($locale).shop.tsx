import {useLoaderData, type MetaFunction} from 'react-router';
import type {Route} from './+types/shop';
import {getPaginationVariables} from '@shopify/hydrogen';
import {ProductCard} from '~/components/ui/ProductCard';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: 'Shop All Products'}];
};

export async function loader(args: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(args.request, {
    pageBy: 12,
  });

  const {storefront} = args.context;

  const {products} = await storefront.query(SHOP_QUERY, {
    variables: {
      ...paginationVariables,
    },
  });

  return {products};
}

export default function Shop() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="shop-page">
      <h1>Shop All Products</h1>
      <div className="products-grid">
        {products.nodes.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const SHOP_QUERY = `#graphql
  query ShopProducts(
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        handle
        featuredImage {
          id
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
