import { redirect, useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useEffect, useMemo } from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  Money,
} from '@shopify/hydrogen';
import { ProductHero } from '~/components/ProductHero';
import { ProductFeatureHero } from '~/components/ProductFeatureHero';
import { Breadcrumb } from '~/components/Breadcrumb';
import { ProductGrid } from '~/components/ProductGrid';
import { RecentlyViewed } from '~/components/RecentlyViewed';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { addToRecentlyViewed } from '~/lib/recentlyViewed';
import productPageStyles from '~/styles/pages/product.css?url';
import productHeroStyles from '~/styles/components/product/product-hero.css?url';
import productHeroInfoStyles from '~/styles/components/product/product-hero-info.css?url';
import productFeatureHeroStyles from '~/styles/components/product/product-feature-hero.css?url';
import breadcrumbStyles from '~/styles/components/breadcrumb.css?url';
import productGridStyles from '~/styles/components/product/product-grid.css?url';
import productCardStyles from '~/styles/components/product/product-card.css?url';
import buttonsStyles from '~/styles/components/buttons.css?url';
import colorProductSwitcherStyles from '~/styles/components/color-product-switcher.css?url';
import sizeGuideStyles from '~/styles/components/modals/size-guide-modal.css?url';

export const links = () => [
  { rel: 'stylesheet', href: productPageStyles },
  { rel: 'stylesheet', href: productHeroStyles },
  { rel: 'stylesheet', href: productHeroInfoStyles },
  { rel: 'stylesheet', href: productFeatureHeroStyles },
  { rel: 'stylesheet', href: breadcrumbStyles },
  { rel: 'stylesheet', href: productGridStyles },
  { rel: 'stylesheet', href: productCardStyles },
  { rel: 'stylesheet', href: buttonsStyles },
  { rel: 'stylesheet', href: colorProductSwitcherStyles },
  { rel: 'stylesheet', href: sizeGuideStyles },
];

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product.title ?? ''} | BLACMELO | The Missing Piece of Luxury` },
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

  // Get color_family metafield to fetch related color products
  // Safely find color_family metafield with null checks
  let colorFamily: string | undefined;

  if (Array.isArray(product.metafields)) {
    const colorFamilyField = product.metafields.find(
      (m: any) => {
        if (!m) return false;
        return m.namespace === 'custom' && m.key === 'color_family';
      }
    );

    colorFamily = colorFamilyField?.value;
  }

  let relatedColorProducts: any[] = [];

  // If color_family exists, fetch all products with the same family
  if (colorFamily) {
    try {
      // Escape special characters in the search query
      const escapedColorFamily = colorFamily.replace(/[:"]/g, '\\$&');

      const result = await storefront.query(COLOR_FAMILY_PRODUCTS_QUERY, {
        variables: {
          query: `metafields.custom.color_family:"${escapedColorFamily}"`,
          first: 20
        },
      });

      relatedColorProducts = result?.products?.nodes || [];

      // Additional filter to ensure exact match (Shopify search can be fuzzy)
      relatedColorProducts = relatedColorProducts.filter((p: any) => {
        const pColorFamily = p.metafields?.find(
          (m: any) => m && m.namespace === 'custom' && m.key === 'color_family'
        )?.value;
        return pColorFamily === colorFamily;
      });
    } catch (error) {
      console.error('[Color Products] Error fetching related products:', error);
      relatedColorProducts = [];
    }
  }

  // Fetch recommendations with actual product ID
  const { productRecommendations: recommendations } = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: { productId: product.id },
  }).catch(() => ({ productRecommendations: [] }));

  // Fetch best sellers collection - try multiple possible handles
  let bestSellersCollection = null;
  const possibleHandles = ['best-seller', 'best-sellers', 'bestseller', 'bestsellers'];

  for (const handle of possibleHandles) {
    try {
      const result = await storefront.query(BEST_SELLERS_QUERY, {
        variables: { handle },
      });
      if (result?.collection?.products?.nodes?.length) {
        bestSellersCollection = result.collection;
        console.log(`[Best Sellers] Found collection with handle: ${handle}, products:`, result.collection.products.nodes.length);
        break;
      }
    } catch (error) {
      console.error(`[Best Sellers] Error fetching collection with handle ${handle}:`, error);
    }
  }

  const bestSellers = bestSellersCollection?.products?.nodes || [];
  console.log('[Best Sellers] Final bestSellers array:', bestSellers.length, bestSellers);

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: product });

  return {
    product,
    relatedColorProducts,
    recommendations: recommendations || [],
    bestSellers,
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
  const { product, relatedColorProducts, recommendations, bestSellers } = useLoaderData<typeof loader>();

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

  // Track recently viewed products and determine primary collection for breadcrumbs
  useEffect(() => {
    if (product && selectedVariant) {
      // Build sizes list from variants
      const sizes = (product.variants?.nodes || [])
        .map((v: any) => {
          const sizeOpt = v.selectedOptions?.find((o: any) => o.name.toLowerCase() === 'size');
          if (!sizeOpt) return null;
          return { label: sizeOpt.value, available: v.availableForSale ?? true };
        })
        .filter(Boolean) as Array<{ label: string; available: boolean }>;

      addToRecentlyViewed({
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: {
          amount: selectedVariant.price.amount,
          currencyCode: selectedVariant.price.currencyCode,
        },
        image: (product.featuredImage || product.images?.nodes[0]) as any,
        sizes: sizes.length > 0 ? sizes : undefined,
      });
    }
  }, [product, selectedVariant]);

  // Determine the best collection for breadcrumbs
  const primaryCollection = useMemo(() => {
    if (!product.collections?.nodes?.length) return null;

    // Prioritize collections that aren't 'all' or 'best-sellers'
    const curatedCollections = product.collections.nodes.filter(
      (c: any) => !['all', 'best-sellers', 'new-arrivals', 'frontpage'].includes(c.handle)
    );

    return curatedCollections[0] || product.collections.nodes[0];
  }, [product.collections]);

  // Transform best sellers for ProductCard
  const transformedBestSellers = bestSellers?.map((product: any) => ({
    id: product.id,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    featuredImage: product.featuredImage,
    images: product.images,
    priceRange: product.priceRange,
    compareAtPriceRange: product.compareAtPriceRange,
    variants: product.variants,
    options: product.options,
  })) || [];

  console.log('[Product Page] bestSellers:', bestSellers);
  console.log('[Product Page] transformedBestSellers:', transformedBestSellers);

  return (
    <>
      <ProductHero
        product={product}
        selectedVariant={selectedVariant}
        productOptions={productOptions as any}
        relatedColorProducts={relatedColorProducts}
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

      {/* Product Feature Hero - Second Image with Features */}
      {product.images?.nodes?.[1] && (
        <ProductFeatureHero
          image={product.images.nodes[1]}
          title={product.title}
          product={product}
        />
      )}

      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/collections/all' },
        ...(primaryCollection ? [{
          label: primaryCollection.title,
          href: `/collections/${primaryCollection.handle}`
        }] : []),
        { label: product.title }
      ]} />

      <ProductGrid
        title="SIMILAR PRODUCTS"
        products={recommendations?.map((product: any) => ({
          id: product.id,
          handle: product.handle,
          title: product.title,
          vendor: product.vendor,
          featuredImage: product.featuredImage,
          images: product.images,
          priceRange: product.priceRange,
          compareAtPriceRange: product.compareAtPriceRange,
          variants: product.variants,
          options: product.options,
        })) || []}
        horizontalScroll={true}
        showViewMore={true}
      />

      <RecentlyViewed />

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
    productType
    encodedVariantExistence
    encodedVariantAvailability
    featuredImage {
      url
      altText
      width
      height
    }
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
    variants(first: 100) {
      nodes {
        ...ProductVariant
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
    metafields(identifiers: [
      {namespace: "custom", key: "second_description"}
      {namespace: "custom", key: "fit"}
      {namespace: "custom", key: "fabric_care"}
      {namespace: "custom", key: "shipping_returns"}
      {namespace: "custom", key: "color_family"}
      {namespace: "custom", key: "color_name"}
      {namespace: "shopify", key: "category"}
      {namespace: "custom", key: "product_type"}
      {namespace: "custom", key: "product_category"}
    ]) {
      key
      value
      namespace
      type
    }
    collections(first: 5) {
      nodes {
        id
        title
        handle
      }
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
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
      options {
        name
        optionValues {
          name
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
  }
` as const;

const BEST_SELLERS_QUERY = `#graphql
  query BestSellersCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      products(first: 8) {
        nodes {
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
          variants(first: 100) {
            nodes {
              id
              availableForSale
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
            }
          }
          options {
            name
            optionValues {
              name
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
      }
    }
  }
` as const;

const COLOR_FAMILY_PRODUCTS_QUERY = `#graphql
  query ColorFamilyProducts(
    $query: String!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query) {
      nodes {
        id
        handle
        title
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
        variants(first: 1) {
          nodes {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
        metafields(
          identifiers: [
            {namespace: "custom", key: "color_name"}
            {namespace: "custom", key: "color_family"}
          ]
        ) {
          key
          value
          namespace
        }
      }
    }
  }
` as const;
