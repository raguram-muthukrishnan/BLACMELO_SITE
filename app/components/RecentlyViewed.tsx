import { useEffect, useState, useRef } from 'react';
import { Link, useFetcher } from 'react-router';
import { Image } from '@shopify/hydrogen';
import { getRecentlyViewed, type RecentlyViewedProduct } from '~/lib/recentlyViewed';
import { sortSizeLabels } from '~/lib/sortSizes';

const FIRST_VISIT_KEY = 'blacmelo_has_browsed';

function SizeBoxes({ sizes }: { sizes: RecentlyViewedProduct['sizes'] }) {
  if (!sizes?.length) return null;
  const sorted = sortSizeLabels(sizes);
  return (
    <div className="rv-size-boxes">
      {sorted.map((s) => (
        <span
          key={s.label}
          className={`rv-size-box ${!s.available ? 'rv-size-box--oos' : ''}`}
        >
          {s.label === '2XL' ? 'XXL' : s.label}
        </span>
      ))}
    </div>
  );
}

/** First-time visitor placeholder — shown instead of the section */
function FirstVisitFallback() {
  return (
    <section className="section-styled recently-viewed-section recently-viewed-first-visit">
      <h2 className="section-title">RECENTLY VIEWED</h2>
      <div className="rv-first-visit-body">
        <p className="rv-first-visit-text">
          Products you browse will appear here for quick access.
        </p>
        <Link to="/collections/all" className="rv-first-visit-btn">
          VIEW PRODUCTS
        </Link>
      </div>
    </section>
  );
}

export function RecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [livePrices, setLivePrices] = useState<Record<string, { amount: string; currencyCode: string }>>({});
  const [showSizes, setShowSizes] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Fetcher for live prices (Bug 7)
  const fetcher = useFetcher<{ prices: Record<string, { amount: string; currencyCode: string }> }>();
  const fetchedRef = useRef(false);

  useEffect(() => {
    const recentProducts = getRecentlyViewed();

    // Bug 6: Check first visit via sessionStorage cookie-like flag
    const hasBrowsed = sessionStorage.getItem(FIRST_VISIT_KEY);
    if (!hasBrowsed) {
      // Mark as visited from now on
      sessionStorage.setItem(FIRST_VISIT_KEY, '1');
      setIsFirstVisit(true);
      return;
    }

    setProducts(recentProducts);

    // Bug 7: Fetch live prices once for all recently viewed products
    if (recentProducts.length > 0 && !fetchedRef.current) {
      fetchedRef.current = true;
      const ids = recentProducts.map((p) => p.id).join(',');
      fetcher.load(`/api/recently-viewed-prices?ids=${encodeURIComponent(ids)}`);
    }
  }, []);

  // Apply live prices when they arrive
  useEffect(() => {
    if (fetcher.data?.prices) {
      setLivePrices(fetcher.data.prices);
    }
  }, [fetcher.data]);

  if (isFirstVisit) return <FirstVisitFallback />;
  if (products.length === 0) return null;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.querySelector('.recently-viewed-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getPrice = (product: RecentlyViewedProduct) => {
    const live = livePrices[product.id];
    const priceData = live ?? product.price;
    const amount = parseFloat(priceData.amount);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: priceData.currencyCode,
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return formatted;
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

                {/* Mobile: tap + to reveal sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <button
                    className={`rv-quick-add-btn ${showSizes === product.id ? 'rv-quick-add-btn--hidden' : ''}`}
                    aria-label="Show sizes"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowSizes(showSizes === product.id ? null : product.id);
                    }}
                  >
                    +
                  </button>
                )}

                {/* Size boxes — visible on hover (desktop) or + tap (mobile) */}
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
                    {fetcher.state === 'loading' ? (
                      <span className="rv-price-loading">—</span>
                    ) : (
                      getPrice(product)
                    )}
                  </div>
                </div>
                {(() => {
                  if (product.colorFamily) {
                    return <div className="rv-card-color">{product.colorFamily}</div>;
                  }
                  if (product.colorCount && product.colorCount > 0) {
                    return (
                      <div className="rv-card-color">
                        {product.colorCount} {product.colorCount === 1 ? 'Color' : 'Colors'}
                      </div>
                    );
                  }
                  return null;
                })()}
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
