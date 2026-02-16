import {redirect, useLoaderData} from 'react-router';
import type {LoaderFunctionArgs, MetaFunction} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {RepresentCollectionPage} from '~/components/RepresentCollectionPage';
// import {CollectionPage} from '~/components/CollectionPage'; // Original style
import collectionStyles from '~/styles/pages/collection.css?url';
import productGridStyles from '~/styles/components/product/product-grid.css?url';
import productCardStyles from '~/styles/components/product/product-card.css?url';
import buttonsStyles from '~/styles/components/buttons.css?url';
import filterPanelStyles from '~/styles/components/filters/filter-panel.css?url';

export const links = () => [
  {rel: 'stylesheet', href: collectionStyles},
  {rel: 'stylesheet', href: productGridStyles},
  {rel: 'stylesheet', href: productCardStyles},
  {rel: 'stylesheet', href: buttonsStyles},
  {rel: 'stylesheet', href: filterPanelStyles},
];

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BLACMELO | ${data?.collection?.title ?? ''}`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page~~
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 30, // Load 30 products per page ~~
  });

  if (!handle) {
    throw redirect('/collections');
  }

  // DEVELOPMENT: Redirect all collections to 'unisex' for now
  const devCollectionHandles = ['man', 'women', 'blacmelo +', 'blacmelo%20+'];
  if (devCollectionHandles.includes(handle.toLowerCase())) {
    const url = new URL(request.url);
    throw redirect(`${url.pathname.replace(/\/collections\/[^/]+/, '/collections/unisex')}${url.search}`);
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
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
  fragment MoneyProductItemCollection on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItemCollection on Product {
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
        ...MoneyProductItemCollection
      }
      maxVariantPrice {
        ...MoneyProductItemCollection
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

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query CollectionPage(
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
          ...ProductItemCollection
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
