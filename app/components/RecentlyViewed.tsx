import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Image } from '@shopify/hydrogen';
import { getRecentlyViewed, type RecentlyViewedProduct } from '~/lib/recentlyViewed';

export function RecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    // Load recently viewed products from localStorage on mount
    const recentProducts = getRecentlyViewed();
    setProducts(recentProducts.slice(0, 4)); // Show max 4 products
  }, []);

  // Don't render if no products
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="section-styled">
      <h2 className="section-title">RECENTLY VIEWED</h2>

      <div className="product-grid">
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.handle}`} className="product-card">
            <div className="card-image-wrapper">
              {product.image && (
                <Image
                  data={product.image}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="card-image"
                />
              )}
            </div>
            <div className="card-info">
              <h3 className="card-title">{product.title}</h3>
              <div className="card-price">
                {product.price.currencyCode} {product.price.amount}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
