import type { MetaFunction, LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Form, NavLink } from 'react-router';
import { Analytics, Pagination, getPaginationVariables } from '@shopify/hydrogen';
import privateAccessStyles from '~/styles/pages/private-access.css?url';
import collectionStyles from '~/styles/pages/collection.css?url';
import productGridStyles from '~/styles/components/product/product-grid.css?url';
import productCardStyles from '~/styles/components/product/product-card.css?url';
import filterPanelStyles from '~/styles/components/filters/filter-panel.css?url';
import overlayStyles from '~/styles/layout/overlay.css?url';
import bannerImage from '~/assets/banner_images/2.jpeg';
import heroBanner from '~/assets/final_banners/the_signature_jacket_desktop.jpeg';
import { RepresentProductCard, RepresentCollectionPage } from '~/components/RepresentCollectionPage';

export const links = () => [
    { rel: 'stylesheet', href: privateAccessStyles },
    { rel: 'stylesheet', href: collectionStyles },
    { rel: 'stylesheet', href: productGridStyles },
    { rel: 'stylesheet', href: productCardStyles },
    { rel: 'stylesheet', href: filterPanelStyles },
    { rel: 'stylesheet', href: overlayStyles },
];

const FORCE_VISIBLE_STYLE = `
  .represent-product-card { 
    opacity: 1 !important; 
    transform: none !important;
    visibility: visible !important;
  }
`;

export const meta: MetaFunction = () => {
    return [
        { title: `BLACMELO | The Private Access` },
        {
            name: 'description',
            content: 'The Private Access — Log in or sign up to access exclusive items.',
        },
    ];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
    const { customerAccount, storefront } = context;
    
    let isLoggedIn = false;
    let collection: any = null;

    try {
        isLoggedIn = await customerAccount.isLoggedIn();
        
        if (isLoggedIn) {
            const paginationVariables = getPaginationVariables(request, {
                pageBy: 20,
            });
            
            const { collection: privateCollection } = await storefront.query(PRIVATE_COLLECTION_QUERY, {
                variables: {
                    handle: 'private-access',
                    ...paginationVariables,
                },
            });
            
            collection = privateCollection;
        }
    } catch (error) {
        console.error('Error in private-access loader:', error);
        // Fail gracefully
    }

    return Response.json(
        { isLoggedIn, collection },
    );
}

interface PrivateAccessData {
    isLoggedIn: boolean;
    collection: any;
}

export default function PrivateAccess() {
    const { isLoggedIn, collection } = useLoaderData<PrivateAccessData>();

    if (isLoggedIn) {
        return (
            <div className="represent-collection-page private-access-page authenticated">
                <style dangerouslySetInnerHTML={{ __html: FORCE_VISIBLE_STYLE }} />

                {/* Hero Banner — same structure as collection pages */}
                <header className="represent-hero">
                    <img
                        src={heroBanner}
                        alt="The Private Access"
                        className="represent-hero-image private-access-hero"
                    />
                    <div className="represent-hero-title-overlay">
                        <h1 className="represent-hero-overlay-text">The Private Access</h1>
                    </div>
                </header>

                {/* Collection info bar */}
                <div className="represent-collection-info">
                    <span className="represent-collection-title">Private Access</span>
                    {collection && (
                        <span className="represent-product-count">
                            {collection.products?.nodes?.length ?? 0}
                        </span>
                    )}
                </div>

                <RepresentCollectionPage
                    collection={collection}
                    hideHero={true}
                    hideInfo={true}
                />

                {collection && (
                    <Analytics.CollectionView
                        data={{
                            collection: {
                                id: collection.id,
                                handle: collection.handle,
                            },
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="private-access-page">
            <section
                className="private-access-hero-banner"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bannerImage})` }}
            >
                <div className="private-access-hero-overlay flex flex-col items-center justify-center text-center">
                    <h1 className="private-access-hero-title mb-8">THE PRIVATE ACCESS</h1>

                    {/* SHOPIFY AUTH SECTION */}
                    <div className="private-access-auth-container mt-4 flex flex-col items-center w-full max-w-lg px-6 py-10">
                        <div className="private-access-hero-actions flex gap-6">
                        <NavLink 
                            to="/account/login" 
                            className="private-access-btn !w-auto !px-12 flex items-center justify-center"
                        >
                            Access Now
                        </NavLink>
                    </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItemPrivate on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItemPrivate on Product {
    id
    handle
    title
    productType
    vendor
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
        availableForSale
        selectedOptions {
          name
          value
        }
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItemPrivate
      }
      maxVariantPrice {
        ...MoneyProductItemPrivate
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

const PRIVATE_COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query PrivateCollection(
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
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItemPrivate
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
