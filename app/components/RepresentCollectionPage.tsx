import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';
import {scrollToTop} from '~/lib/lenis';
import type {ProductCardProduct} from './ProductCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RepresentCollectionPageProps {
  collection: {
    id: string;
    handle: string;
    title: string;
    description?: string | null;
    image?: {
      url: string;
      altText?: string | null;
    } | null;
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

// Grid Icon
function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

// List Icon
function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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

export function RepresentCollectionPage({collection}: RepresentCollectionPageProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModel, setShowModel] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>('');

  // Reset scroll position when component mounts
  useEffect(() => {
    scrollToTop(true);
  }, []);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import video on client side only
    import('~/assets/banner images/vid 1.mp4').then((module) => {
      setVideoSrc(module.default);
    });
  }, []);

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, user interaction required
      });
    }
  }, [videoSrc]);

  useEffect(() => {
    if (!isClient || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.represent-product-card');
    
    gsap.fromTo(
      cards,
      {opacity: 0, y: 30},
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isClient, collection.products.nodes]);

  const productCount = collection.products.nodes.length;

  return (
    <div className="represent-collection-page">
      {/* 1. Clean Hero Banner with Video */}
      <header className="represent-hero">
        {isClient && videoSrc && (
          <video
            ref={videoRef}
            className="represent-hero-video"
            loop
            muted
            playsInline
            autoPlay
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </header>

      {/* 2. Collection Info Bar */}
      <div className="represent-collection-info">
        <h1 className="represent-collection-title">{collection.title}</h1>
        <span className="represent-product-count">{productCount}</span>
      </div>

      {/* 3. Controls Bar - View Toggle, Model Toggle, Filter */}
      <nav className="represent-controls-bar">
        <div className="represent-controls-left">
          {/* View Toggle */}
          <div className="represent-view-toggle">
            <button 
              className={`represent-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <GridIcon />
            </button>
            <button 
              className={`represent-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <ListIcon />
            </button>
          </div>

          {/* Model Toggle */}
          <button 
            className={`represent-model-toggle ${showModel ? 'active' : ''}`}
            onClick={() => setShowModel(!showModel)}
          >
            Model
          </button>
        </div>

        <div className="represent-controls-right">
          <button className="represent-filter-btn">
            <span>Filter</span>
            <FilterIcon />
          </button>
        </div>
      </nav>

      {/* 4. Product Grid */}
      <Pagination connection={collection.products}>
        {({nodes, isLoading, NextLink, hasNextPage}) => (
          <>
            <main ref={gridRef} className={`represent-product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {nodes.map((product) => (
                <RepresentProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </main>

            {/* Load More */}
            {hasNextPage && (
              <div className="represent-load-more">
                <NextLink className="represent-load-more-btn">
                  {isLoading ? 'Loading...' : 'Load More'}
                </NextLink>
              </div>
            )}
          </>
        )}
      </Pagination>
    </div>
  );
}

// Represent-style Product Card with Image Swap
function RepresentProductCard({product, viewMode}: {product: ProductCardProduct; viewMode: 'grid' | 'list'}) {
  const images = product.images?.nodes || (product.featuredImage ? [product.featuredImage] : []);
  const image1 = images[0] || product.featuredImage;
  const image2 = images[1];

  return (
    <Link to={`/products/${product.handle}`} className="represent-product-card group">
      <div className="represent-card-image-wrapper">
        {/* Primary Image */}
        {image1 && (
          <Image
            data={image1}
            alt={image1.altText || product.title}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            loading="lazy"
            className="represent-card-image represent-card-image-primary"
          />
        )}
        
        {/* Secondary Image (Hover) */}
        {image2 && (
          <Image
            data={image2}
            alt={image2.altText || product.title}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            loading="lazy"
            className="represent-card-image represent-card-image-secondary"
          />
        )}
      </div>

      <div className="represent-card-info">
        <h3 className="represent-card-title">{product.title}</h3>
        {product.priceRange?.minVariantPrice && (
          <p className="represent-card-price">
            <Money data={product.priceRange.minVariantPrice} />
          </p>
        )}
      </div>
    </Link>
  );
}
