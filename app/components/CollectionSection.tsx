import { useState } from 'react';
import { Link } from 'react-router';
import { ProductCard, type ProductCardProduct } from './ProductCard';

interface MenuItem {
  id: string;
  title: string;
  url: string;
  items?: MenuItem[];
}

interface CollectionSectionProps {
  collection: {
    id: string;
    title: string;
    handle: string;
    products: {
      nodes: ProductCardProduct[];
    };
  };
  productMenu?: {
    items: MenuItem[];
  } | null;
}

export function CollectionSection({ collection, productMenu }: CollectionSectionProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [showMenu, setShowMenu] = useState(false);
  const products = collection.products.nodes;
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, products.length));
  };

  const toggleMenu = () => {
    setShowMenu(prev => !prev);
  };

  if (!products || products.length === 0) return null;

  // Get menu items from product menu
  const menuItems = productMenu?.items || [];

  return (
    <section className="collection-section">
      <h2 className="collection-section-title">{collection.title}</h2>
      
      <div className="collection-section-grid">
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            loading="lazy"
          />
        ))}
      </div>

      <div className="collection-section-actions">
        {hasMore ? (
          <button 
            onClick={handleLoadMore}
            className="load-more-btn"
          >
            LOAD MORE
          </button>
        ) : (
          <div 
            className="view-all-dropdown"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <button
              onClick={toggleMenu}
              className="view-all-btn view-all-btn-toggle"
            >
              SEE COLLECTIONS
              <span className={`dropdown-arrow ${showMenu ? 'open' : ''}`}>▼</span>
            </button>
            
            {menuItems.length > 0 && showMenu && (
              <div className="view-all-menu">
                {menuItems.map((item) => (
                  <div key={item.id} className="view-all-menu-item">
                    <Link to={item.url} className="view-all-menu-link">
                      {item.title}
                    </Link>
                    {item.items && item.items.length > 0 && (
                      <div className="view-all-submenu">
                        {item.items.map((subItem) => (
                          <Link 
                            key={subItem.id} 
                            to={subItem.url} 
                            className="view-all-submenu-link"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
