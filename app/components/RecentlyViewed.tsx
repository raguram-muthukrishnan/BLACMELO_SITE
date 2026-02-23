import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Image } from '@shopify/hydrogen';
import { getRecentlyViewed, type RecentlyViewedProduct } from '~/lib/recentlyViewed';

export function RecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    // Load all recently viewed products
    const recentProducts = getRecentlyViewed();
    setProducts(recentProducts);
  }, []);

  // Don't render if no products
  if (products.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of section
    const section = document.querySelector('.recently-viewed-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="section-styled recently-viewed-section">
      <h2 className="section-title">RECENTLY VIEWED</h2>

      <div className="product-grid">
        {currentProducts.map((product) => (
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

      {totalPages > 1 && (
        <div className="recently-viewed-pagination">
          <button
            className="pagination-btn"
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
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

          <button
            className="pagination-btn"
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            NEXT
          </button>
        </div>
      )}
    </section>
  );
}
