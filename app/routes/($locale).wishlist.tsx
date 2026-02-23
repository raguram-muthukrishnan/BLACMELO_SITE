import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { MetaFunction } from 'react-router';
import { getWishlist, removeFromWishlist, type WishlistItem } from '~/lib/wishlist';
import { ProductCard } from '~/components/ProductCard';
import wishlistStyles from '~/styles/pages/wishlist.css?url';
import productCardStyles from '~/styles/components/product/product-card.css?url';

export const links = () => [
  { rel: 'stylesheet', href: wishlistStyles },
  { rel: 'stylesheet', href: productCardStyles },
];

export const meta: MetaFunction = () => {
  return [
    { title: 'My Wishlist | BLACMELO' },
    { description: 'View your saved items' },
  ];
};

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load wishlist on client-side only
  useEffect(() => {
    setIsClient(true);
    setWishlistItems(getWishlist());

    // Listen for wishlist changes
    const handleWishlistChange = () => {
      setWishlistItems(getWishlist());
    };

    window.addEventListener('wishlistChanged', handleWishlistChange);
    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange);
    };
  }, []);

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    setWishlistItems(getWishlist());
  };

  if (!isClient) {
    return (
      <div className="wishlist-container">
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">MY WISHLIST</h1>
        <span className="wishlist-count">{wishlistItems.length} {wishlistItems.length === 1 ? 'ITEM' : 'ITEMS'}</span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <p className="wishlist-empty-text">Your wishlist is empty</p>
          <Link to="/collections/all" className="wishlist-continue-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => {
            // Transform wishlist item to product format for ProductCard
            const transformedProduct = {
              id: item.id,
              handle: item.handle,
              title: item.title,
              vendor: item.vendor,
              featuredImage: item.image ? {
                url: item.image,
                altText: item.title,
              } : null,
              images: item.image ? {
                nodes: [{
                  url: item.image,
                  altText: item.title,
                }]
              } : { nodes: [] },
              selectedOrFirstAvailableVariant: {
                nodes: [{
                  price: {
                    amount: item.price.replace(/[^0-9.]/g, ''),
                    currencyCode: 'USD',
                  },
                  compareAtPrice: item.compareAtPrice ? {
                    amount: item.compareAtPrice.replace(/[^0-9.]/g, ''),
                    currencyCode: 'USD',
                  } : null,
                  availableForSale: item.availableForSale,
                }]
              },
              variants: {
                nodes: [{
                  id: item.id,
                  availableForSale: item.availableForSale,
                  selectedOptions: [],
                  price: {
                    amount: item.price.replace(/[^0-9.]/g, ''),
                    currencyCode: 'USD',
                  },
                }]
              },
            };

            return (
              <div key={item.id} className="wishlist-item-wrapper">
                <ProductCard product={transformedProduct} />
                <button
                  className="wishlist-remove-btn"
                  onClick={() => handleRemove(item.id)}
                  aria-label="Remove from wishlist"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
