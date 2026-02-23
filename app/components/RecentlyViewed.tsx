import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Image } from '@shopify/hydrogen';
import { getRecentlyViewed, type RecentlyViewedProduct } from '~/lib/recentlyViewed';

function SizeBoxes({ sizes }: { sizes: RecentlyViewedProduct['sizes'] }) {
  if (!sizes?.length) return null;
  return (
    <div className="rv-size-boxes">
      {sizes.map((s) => (
        <span
          key={s.label}
          className={`rv-size-box ${!s.available ? 'rv-size-box--oos' : ''}`}
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}

export function RecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
  const [showSizes, setShowSizes] = useState<string | null>(null); // product id
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const recentProducts = getRecentlyViewed();
    setProducts(recentProducts);
  }, []);

  if (products.length === 0) return null;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.querySelector('.recently-viewed-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="section-styled recently-viewed-section">
      <h2 className="section-title">RECENTLY VIEWED</h2>

      <div className="product-grid">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="rv-card group"
            onMouseEnter={() => setShowSizes(product.id)}
            onMouseLeave={() => setShowSizes(null)}
          >
            <Link to={`/products/${product.handle}`} className="rv-card-link">
              <div className="rv-card-image-wrapper">
                {product.image && (
                  <Image
                    data={product.image}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="rv-card-image"
                  />
                )}

                {/* Size boxes — visible on hover (desktop) or toggle tap (mobile) */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className={`rv-sizes-overlay ${showSizes === product.id ? 'visible' : ''}`}>
                    <SizeBoxes sizes={product.sizes} />
                  </div>
                )}
              </div>

              <div className="rv-card-info">
                <div className="rv-card-header">
                  <h3 className="rv-card-title">{product.title}</h3>
                  <div className="rv-card-price">
                    {product.price.currencyCode} {parseFloat(product.price.amount).toFixed(0)}
                  </div>
                </div>
                {product.colorFamily ? (
                  <div className="rv-card-color">{product.colorFamily}</div>
                ) : null}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="recently-viewed-pagination">
          <button className="pagination-btn" onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            PREV
          </button>
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="pagination-btn" onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
            NEXT
          </button>
        </div>
      )}
    </section>
  );
}
