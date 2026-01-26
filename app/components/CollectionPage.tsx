import {useState} from 'react';
import {Link} from 'react-router';
import {Pagination} from '@shopify/hydrogen';
import type {ProductCardProduct} from './ProductCard';
import {ProductCard} from './ProductCard';
import logoImage from '~/assets/logos/Logo.avif';

interface CollectionPageProps {
  collection: {
    id: string;
    handle: string;
    title: string;
    description?: string | null;
    products: {
      nodes: ProductCardProduct[];
      pageInfo: {
        hasPreviousPage: boolean;
        hasNextPage: boolean;
        startCursor?: string | null;
        endCursor?: string | null;
      };
    };
  };
}

// View Toggle - 3 box design (filled boxes indicate density)
// 1 filled = less columns, 3 filled = more columns
function ViewToggleBoxes({filledCount}: {filledCount: 1 | 2 | 3}) {
  return (
    <svg width="54" height="18" viewBox="0 0 54 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Box 1 */}
      <rect 
        x="1" y="1" width="14" height="16" 
        fill={filledCount >= 1 ? '#000000' : 'none'} 
        stroke="#000000" 
        strokeWidth="1.5"
      />
      {/* Box 2 */}
      <rect 
        x="20" y="1" width="14" height="16" 
        fill={filledCount >= 2 ? '#000000' : 'none'} 
        stroke="#000000" 
        strokeWidth="1.5"
      />
      {/* Box 3 */}
      <rect 
        x="39" y="1" width="14" height="16" 
        fill={filledCount >= 3 ? '#000000' : 'none'} 
        stroke="#000000" 
        strokeWidth="1.5"
      />
    </svg>
  );
}

// Filter Icon
function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Model Toggle Icons
function ModelOnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 18C4 14.6863 6.68629 12 10 12C13.3137 12 16 14.6863 16 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ModelOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function CollectionPage({collection}: CollectionPageProps) {
  // viewMode: 'small' = 3 cols desktop / 1 col mobile
  // viewMode: 'medium' = 4 cols desktop / 2 cols mobile (default)
  // viewMode: 'large' = 6 cols desktop / 3 cols mobile
  const [viewMode, setViewMode] = useState<'small' | 'medium' | 'large'>('medium');
  const [showDescription, setShowDescription] = useState(false);
  const productCount = collection.products.nodes.length;
  
  // Truncate description
  const maxLength = 200;
  const description = collection.description || '';
  const shouldTruncate = description.length > maxLength;
  const displayDescription = showDescription || !shouldTruncate 
    ? description 
    : description.slice(0, maxLength) + '...';

  return (
    <div className="collection-page">
      {/* Collection Header */}
      <div className="collection-header">
        <div className="collection-header-top">
          <h1 className="collection-title">
            {collection.title}
            <span className="collection-count">{productCount}</span>
          </h1>
        </div>
        
        {description && (
          <div className="collection-description-wrapper">
            <p className="collection-description">
              {displayDescription}
              {shouldTruncate && (
                <button 
                  className="read-more-btn"
                  onClick={() => setShowDescription(!showDescription)}
                >
                  {showDescription ? 'read less' : 'read more'}
                </button>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Collection Controls */}
      <div className="collection-controls">
        <div className="collection-controls-left">
          <div className="view-toggle">
            <span className="view-label">View</span>
            <button 
              className="view-btn-boxes"
              onClick={() => {
                // Cycle through: small -> medium -> large -> small
                if (viewMode === 'small') setViewMode('medium');
                else if (viewMode === 'medium') setViewMode('large');
                else setViewMode('small');
              }}
              aria-label="Change grid view"
            >
              <ViewToggleBoxes filledCount={viewMode === 'small' ? 1 : viewMode === 'medium' ? 2 : 3} />
            </button>
          </div>
        </div>
        
        <button className="filter-btn">
          <span>Filter</span>
          <FilterIcon />
        </button>
      </div>

      {/* Product Grid */}
      <Pagination connection={collection.products}>
        {({nodes, isLoading, NextLink, hasNextPage}) => {
          const currentCount = nodes.length;
          
          return (
            <>
              <div className={`product-grid product-grid-${viewMode}`}>
                {nodes.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    loading={index < 8 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
              
              {/* Load More Section */}
              <div className="load-more-section">
                {hasNextPage ? (
                  <NextLink className="load-more-btn">
                    {isLoading ? 'Loading...' : 'LOAD MORE'}
                  </NextLink>
                ) : (
                  <div className="all-products-logo">
                    <img src={logoImage} alt="BLACMELO" />
                  </div>
                )}
                
                <div className="products-progress">
                  <span className="products-progress-text">
                    Viewing {currentCount} products{hasNextPage ? '' : ' (all)'}
                  </span>
                  <div className="products-progress-bar">
                    <div 
                      className="products-progress-fill" 
                      style={{width: hasNextPage ? '50%' : '100%'}}
                    />
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </Pagination>

      {/* Bottom Breadcrumb */}
      <nav className="collection-breadcrumb collection-breadcrumb-bottom">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">&gt;</span>
        <span>{collection.title}</span>
      </nav>

      {/* Buy Now Pay Later Banner */}
      <div className="buy-now-pay-later">
        <p>Buy now, pay later available with <strong>Klarna</strong>.</p>
      </div>
    </div>
  );
}
