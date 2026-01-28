import { redirect, useLoaderData } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import { ProductHero } from '~/components/ProductHero';
import { SplitFeatures } from '~/components/SplitFeatures';
import { GalleryCarousel } from '~/components/GalleryCarousel';
import { ProductGrid } from '~/components/ProductGrid';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Hydrogen | ${data?.product.title ?? ''}` },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, params, request }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle, selectedOptions: getSelectedProductOptions(request) },
  });

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  // Fetch recommendations with actual product ID
  const { productRecommendations: recommendations } = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: { productId: product.id },
  }).catch(() => ({ productRecommendations: [] }));

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: product });

  return {
    product,
    recommendations: recommendations || [],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context, params }: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const { product, recommendations } = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  // Transform recommendations for ProductCard
  const transformedRecommendations = recommendations?.map((rec: any) => ({
    id: rec.id,
    handle: rec.handle,
    title: rec.title,
    vendor: rec.vendor,
    featuredImage: rec.featuredImage,
    images: rec.images,
    priceRange: rec.priceRange,
    compareAtPriceRange: rec.compareAtPriceRange,
    variants: rec.variants,
    options: rec.options,
  })) || [];

  return (
    <>
      <ProductHero
        product={product}
        selectedVariant={selectedVariant}
        productOptions={productOptions}
      />
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />

      <SplitFeatures
        image={product.images?.nodes[1] || product.images?.nodes[0]}
      />

      <GalleryCarousel
        images={product.images?.nodes || []}
      />

      <ProductGrid
        title="STYLE WITH"
        products={transformedRecommendations.slice(0, 4)}
      />

      <ProductGrid
        title="YOU MAY ALSO LIKE"
        products={transformedRecommendations}
        tabs={['SUGGESTED', 'HOODIES', 'PANTS', 'T-SHIRTS']}
      />

      <ProductGrid
        title="RECENTLY VIEWED ITEMS"
        products={transformedRecommendations.slice(0, 4)}
      />


    </>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 20) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query ProductPageRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      id
      handle
      title
      vendor
      featuredImage {
        id
        url
        altText
        width
        height
      }
      images(first: 2) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
      options {
        name
        optionValues {
          name
        }
      }
    }
  }
` as const;
