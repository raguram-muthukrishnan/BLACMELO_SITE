import type {Route} from './+types/collections.all';
import {useLoaderData} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {RepresentCollectionPage} from '~/components/RepresentCollectionPage';
import collectionStyles from '~/styles/pages/collection.css?url';
import productGridStyles from '~/styles/components/product/product-grid.css?url';
import productCardStyles from '~/styles/components/product/product-card.css?url';
import buttonsStyles from '~/styles/components/buttons.css?url';
import filterPanelStyles from '~/styles/components/filters/filter-panel.css?url';

export const meta: Route.MetaFunction = () => {
  return [{title: `BLACMELO | All Products`}];
};

export const links = () => [
  {rel: 'stylesheet', href: collectionStyles},
  {rel: 'stylesheet', href: productGridStyles},
  {rel: 'stylesheet', href: productCardStyles},
  {rel: 'stylesheet', href: buttonsStyles},
  {rel: 'stylesheet', href: filterPanelStyles},
];

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 30,
  });

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle: 'all-products', ...paginationVariables},
    }),
  ]);

  // If collection doesn't exist, create a virtual "All Products" collection
  if (!collection) {
    const [{products}] = await Promise.all([
      storefront.query(ALL_PRODUCTS_QUERY, {
        variables: {...paginationVariables},
      }),
    ]);

    // Create a virtual collection object
    return {
      collection: {
        id: 'gid://shopify/Collection/all',
        handle: 'all-products',
        title: 'All Products',
        description: 'Shop all our products',
        image: null,
        products,
      },
    };
  }

  return {collection};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function AllProductsCollection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <>
      <RepresentCollectionPage collection={collection} />
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItemAll on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItemAll on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    variants(first: 100) {
      nodes {
        id
        selectedOptions {
          name
          value
        }
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItemAll
      }
      maxVariantPrice {
        ...MoneyProductItemAll
      }
    }
    metafields(
      identifiers: [
        {namespace: "custom", key: "color_name"}
        {namespace: "custom", key: "color"}
        {namespace: "category", key: "color"}
        {namespace: "category", key: "Color"}
      ]
    ) {
      key
      value
      namespace
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query AllProductsCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItemAll
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItemAll
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
` as const;
