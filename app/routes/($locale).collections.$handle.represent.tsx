import {redirect, useLoaderData} from 'react-router';
import type {LoaderFunctionArgs, MetaFunction} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {RepresentCollectionPage} from '~/components/RepresentCollectionPage';
import collectionStyles from '~/styles/pages/collection.css?url';
import productGridStyles from '~/styles/components/product/product-grid.css?url';
import productCardStyles from '~/styles/components/product/product-card.css?url';
import buttonsStyles from '~/styles/components/buttons.css?url';
import filterPanelStyles from '~/styles/components/filters/filter-panel.css?url';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BLACMELO | ${data?.collection?.title ?? ''}`}];
};

export const links = () => [
  {rel: 'stylesheet', href: collectionStyles},
  {rel: 'stylesheet', href: productGridStyles},
  {rel: 'stylesheet', href: productCardStyles},
  {rel: 'stylesheet', href: buttonsStyles},
  {rel: 'stylesheet', href: filterPanelStyles},
];

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 30,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function CollectionRepresent() {
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
  fragment MoneyProductItemRepresent on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItemRepresent on Product {
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
    variants(first: 10) {
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
        ...MoneyProductItemRepresent
      }
      maxVariantPrice {
        ...MoneyProductItemRepresent
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query CollectionRepresentPage(
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
          ...ProductItemRepresent
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
