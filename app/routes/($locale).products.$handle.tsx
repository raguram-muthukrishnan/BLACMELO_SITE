import { redirect, useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useEffect } from 'react';
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
import { Breadcrumb } from '~/components/Breadcrumb';
import { ProductFeatureHero } from '~/components/ProductFeatureHero';
import { GalleryCarousel } from '~/components/GalleryCarousel';
import { ProductGrid } from '~/components/ProductGrid';
import { CollectionSection } from '~/components/CollectionSection';
import { RecentlyViewed } from '~/components/RecentlyViewed';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { addToRecentlyViewed } from '~/lib/recentlyViewed';

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

  // Fetch specific collections for "You May Also Like" section
  const collectionHandles = ['bestseller', 'new-in', 'bottoms', 'tops'];
  
  const collectionsData = await Promise.all(
    collectionHandles.map(collectionHandle =>
      storefront.query(COLLECTION_BY_HANDLE_QUERY, {
        variables: { handle: collectionHandle }
      }).catch(() => ({ collection: null }))
    )
  );

  // Filter out null collections
  const collections = collectionsData
    .map(data => data.collection)
    .filter(Boolean);

  // Fetch product menu
  const { menu: productMenu } = await storefront.query(PRODUCT_MENU_QUERY, {
    variables: { handle: 'product-menu' }
  }).catch(() => ({ menu: null }));

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: product });

  return {
    product,
    recommendations: recommendations || [],
    collections,
    productMenu,
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
  const { product, recommendations, collections, productMenu } = useLoaderData<typeof loader>();

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

  // Track recently viewed products
  useEffect(() => {
    if (product && selectedVariant) {
      addToRecentlyViewed({
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: {
          amount: selectedVariant.price.amount,
          currencyCode: selectedVariant.price.currencyCode,
        },
        image: product.featuredImage || product.images?.nodes[0],
      });
    }
  }, [product, selectedVariant]);

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

  // Build breadcrumb items dynamically based on product collections
  const buildBreadcrumbItems = () => {
    const items = [{ label: 'Home', href: '/' }];
    
    // Get the first collection (primary collection)
    const primaryCollection = product.collections?.nodes?.[0];
    
    if (primaryCollection) {
      const collectionHandle = primaryCollection.handle.toLowerCase();
      const collectionTitle = primaryCollection.title;
      
      // Check if collection is gender-specific (men/women)
      if (collectionHandle.includes('men') && !collectionHandle.includes('women')) {
        items.push({ label: 'Men', href: '/collections/men' });
        // If it's a subcategory (not just "men"), add it
        if (collectionHandle !== 'men') {
          items.push({
            label: collectionTitle,
            href: `/collections/${primaryCollection.handle}`,
          });
        }
      } else if (collectionHandle.includes('women')) {
        items.push({ label: 'Women', href: '/collections/women' });
        // If it's a subcategory (not just "women"), add it
        if (collectionHandle !== 'women') {
          items.push({
            label: collectionTitle,
            href: `/collections/${primaryCollection.handle}`,
          });
        }
      } else {
        // Regular collection (not gender-specific)
        items.push({
          label: collectionTitle,
          href: `/collections/${primaryCollection.handle}`,
        });
      }
    } else {
      // Fallback to "All Products" if no collection
      items.push({
        label: 'All Products',
        href: '/collections/all',
      });
    }
    
    // Add current product (no href)
    items.push({ label: product.title });
    
    return items;
  };

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

      <Breadcrumb items={buildBreadcrumbItems()} />

      {/* Product Feature Hero - Second Image with Features */}
      {product.images?.nodes?.[1] && (
        <ProductFeatureHero
          image={product.images.nodes[1]}
          title={product.title}
          product={product}
        />
      )}

      <GalleryCarousel
        images={product.images?.nodes || []}
      />

      <ProductGrid
        title="STYLE WITH"
        products={transformedRecommendations.slice(0, 4)}
      />

      {/* Display each collection as a separate section */}
      {collections && collections.map((collection) => (
        <CollectionSection
          key={collection.id}
          collection={collection}
          productMenu={productMenu}
        />
      ))}

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
    metafields(identifiers: [
      {namespace: "custom", key: "second_description"}
      {namespace: "custom", key: "fit"}
      {namespace: "custom", key: "fabric_care"}
      {namespace: "custom", key: "shipping_returns"}
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

const COLLECTION_BY_HANDLE_QUERY = `#graphql
  fragment CollectionWithProducts on Collection {
    id
    title
    handle
    products(first: 12) {
      nodes {
        id
        title
        handle
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
        variants(first: 100) {
          nodes {
            id
            selectedOptions {
              name
              value
            }
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
  query CollectionByHandle($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...CollectionWithProducts
    }
  }
` as const;

const PRODUCT_MENU_QUERY = `#graphql
  fragment MenuItem on MenuItem {
    id
    title
    url
    type
    items {
      id
      title
      url
      type
    }
  }
  query ProductMenu($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    menu(handle: $handle) {
      id
      items {
        ...MenuItem
      }
    }
  }
` as const;
