import { useState } from 'react';
import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { CurrencyCode } from '@shopify/hydrogen/storefront-api-types';

interface Product {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: CurrencyCode;
    };
  };
  featuredImage?: {
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  images?: {
    nodes: Array<{
      id: string;
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    }>;
  };
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  products: {
    nodes: Product[];
  };
}

interface CollectionTabsProps {
  collections: Collection[];
  title?: string;
}

export function CollectionTabs({ collections, title = 'SHOP BY COLLECTION' }: CollectionTabsProps) {
  const [activeTab, setActiveTab] = useState(collections[0]?.handle || '');

  const activeCollection = collections.find(c => c.handle === activeTab);
  const displayProducts = activeCollection?.products.nodes.slice(0, 4) || [];

  // Map collection handles to display names
  const getDisplayName = (handle: string) => {
    const nameMap: Record<string, string> = {
      'bestseller': 'BESTSELLER',
      'new-in': 'NEW IN',
      'bottoms': 'BOTTOMS',
      'tops': 'TOPS',
    };
    return nameMap[handle] || handle.toUpperCase();
  };

  return (
    <section className="section-styled">
      {title && <h2 className="section-title">{title}</h2>}

      {collections.length > 1 && (
        <div className="tabs-header">
          {collections.map((collection) => (
            <button
              key={collection.handle}
              className={`tab-btn ${activeTab === collection.handle ? 'active' : ''}`}
              onClick={() => setActiveTab(collection.handle)}
            >
              {getDisplayName(collection.handle)}
            </button>
          ))}
        </div>
      )}

      <div className="product-grid">
        {displayProducts.map((product) => {
          const image = product.featuredImage || product.images?.nodes[0];

          return (
            <Link key={product.id} to={`/products/${product.handle}`} className="product-card">
              <div className="card-image-wrapper">
                {image && (
                  <Image
                    data={image}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="card-image"
                  />
                )}
              </div>
              <div className="card-info">
                <h3 className="card-title">{product.title}</h3>
                <div className="card-price">
                  <Money data={product.priceRange.minVariantPrice} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {activeCollection && (
        <Link to={`/collections/${activeCollection.handle}`} className="load-more-btn">
          VIEW ALL {getDisplayName(activeCollection.handle)}
        </Link>
      )}
    </section>
  );
}
