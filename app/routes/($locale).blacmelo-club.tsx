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
        { title: `BLACMELO | Blacmelo Club` },
        { name: 'description', content: 'Exclusive collection for Blacmelo Club members.' },
    ];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
    const { customerAccount, storefront } = context;
    const isLoggedIn = await customerAccount.isLoggedIn();
    
    let collection: any = null;
    if (isLoggedIn) {
        const paginationVariables = getPaginationVariables(request, {
            pageBy: 20,
        });
        
        const { collection: clubCollection } = await storefront.query(CLUB_COLLECTION_QUERY, {
            variables: {
                handle: 'blacmelo-club',
                ...paginationVariables,
            },
        });
        
        collection = clubCollection;
    }

    return Response.json(
        { isLoggedIn, collection },
    );
}

interface BlacmeloClubData {
    isLoggedIn: boolean;
    collection: any;
}

export default function BlacmeloClub() {
    const { isLoggedIn, collection } = useLoaderData<BlacmeloClubData>();

    if (isLoggedIn) {
        return (
            <div className="represent-collection-page private-access-page authenticated">
                <style dangerouslySetInnerHTML={{ __html: FORCE_VISIBLE_STYLE }} />
                
                <div className="private-access-header py-24 px-6 text-center bg-black text-white">
                    <h1 className="text-[40px] md:text-[60px] font-bold tracking-[-0.04em] uppercase mb-0 leading-none">
                        Blacmelo Club
                    </h1>
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
                    <h1 className="private-access-hero-title mb-8">BLACMELO CLUB</h1>

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

const CLUB_COLLECTION_QUERY = `#graphql
  query BlacmeloClubCollection(
    $handle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) {
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
          id
          title
          handle
          vendor
          productType
          tags
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
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
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
          metafields(
            identifiers: [
              {namespace: "custom", key: "color_name"}
              {namespace: "custom", key: "color"}
              {namespace: "category", key: "color"}
              {namespace: "category", key: "Color"}
            ]
          ) {
            id
            namespace
            key
            value
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
  }
`;
