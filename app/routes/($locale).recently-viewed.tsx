import { useEffect, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { getRecentlyViewed, type RecentlyViewedProduct } from '~/lib/recentlyViewed';
import { RepresentCollectionPage } from '~/components/RepresentCollectionPage';
import collectionStyles from '~/styles/pages/collection.css?url';
import productGridStyles from '~/styles/components/product/product-grid.css?url';
import productCardStyles from '~/styles/components/product/product-card.css?url';
import buttonsStyles from '~/styles/components/buttons.css?url';
import filterPanelStyles from '~/styles/components/filters/filter-panel.css?url';

export const meta: MetaFunction = () => {
  return [{ title: `BLACMELO | Recently Viewed` }];
};

export const links = () => [
  { rel: 'stylesheet', href: collectionStyles },
  { rel: 'stylesheet', href: productGridStyles },
  { rel: 'stylesheet', href: productCardStyles },
  { rel: 'stylesheet', href: buttonsStyles },
  { rel: 'stylesheet', href: filterPanelStyles },
];

// Add a simple loader to ensure route is recognized
export async function loader() {
  return {};
}

export default function RecentlyViewedPage() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const recentProducts = getRecentlyViewed();
    setProducts(recentProducts);
  }, []);

  // Transform recently viewed products to match collection format
  const transformedCollection = {
    id: 'recently-viewed',
    handle: 'recently-viewed',
    title: 'RECENTLY VIEWED',
    description: 'Your recently viewed products',
    image: null,
    products: {
      nodes: products.map((product) => ({
        id: product.id,
        handle: product.handle,
        title: product.title,
        vendor: null,
        productType: null,
        featuredImage: product.image ? {
          id: product.image.url,
          url: product.image.url,
          altText: product.image.altText || product.title,
          width: product.image.width || 800,
          height: product.image.height || 1000,
        } : null,
        images: product.image ? {
          nodes: [{
            id: product.image.url,
            url: product.image.url,
            altText: product.image.altText || product.title,
            width: product.image.width || 800,
            height: product.image.height || 1000,
          }]
        } : { nodes: [] },
        priceRange: {
          minVariantPrice: {
            amount: product.price.amount,
            currencyCode: product.price.currencyCode,
          },
          maxVariantPrice: {
            amount: product.price.amount,
            currencyCode: product.price.currencyCode,
          },
        },
        variants: {
          nodes: product.sizes?.map((size, index) => ({
            id: `${product.id}-${size.label}`,
            availableForSale: size.available,
            selectedOptions: [
              { name: 'Size', value: size.label }
            ],
            price: {
              amount: product.price.amount,
              currencyCode: product.price.currencyCode,
            },
          })) || [],
        },
      })),
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: null,
        endCursor: null,
      },
    },
  };

  if (!isClient) {
    return (
      <div className="represent-collection-page">
        <div className="represent-collection-info">
          <h1 className="represent-collection-title">RECENTLY VIEWED</h1>
          <span className="represent-product-count">0</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="represent-collection-page">
        <div className="represent-collection-info">
          <h1 className="represent-collection-title">RECENTLY VIEWED</h1>
          <span className="represent-product-count">0</span>
        </div>
        <div className="no-products-message" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p>You haven't viewed any products yet.</p>
        </div>
      </div>
    );
  }

  return <RepresentCollectionPage collection={transformedCollection as any} />;
}
