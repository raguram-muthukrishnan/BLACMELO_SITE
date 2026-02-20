import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { MetaFunction } from 'react-router';
import { getWishlist, removeFromWishlist, type WishlistItem } from '~/lib/wishlist';
import wishlistStyles from '~/styles/pages/wishlist.css?url';

export const links = () => [
  { rel: 'stylesheet', href: wishlistStyles },
];

export const meta: MetaFunction = () => {
  return [
    { title: 'My Wishlist | REPRESENT' },
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
      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <p className="wishlist-empty-text">Your wishlist is empty</p>
          <Link to="/collections/all" className="wishlist-continue-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map((item) => (
            <WishlistItemCard 
              key={item.id} 
              item={item} 
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: (productId: string) => void;
}

function WishlistItemCard({ item, onRemove }: WishlistItemCardProps) {
  return (
    <div className="wishlist-item">
      <div className="wishlist-item-image-container">
        <Link to={`/products/${item.handle}`}>
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.title}
              className="wishlist-item-image"
              loading="lazy"
            />
          ) : (
            <div className="wishlist-item-image-placeholder" />
          )}
        </Link>
      </div>

      <div className="wishlist-item-details">
        <Link to={`/products/${item.handle}`} className="wishlist-item-title">
          {item.title}
        </Link>
        
        {item.vendor && (
          <p className="wishlist-item-vendor">{item.vendor}</p>
        )}

        <div className="wishlist-item-price-container">
          <span className="wishlist-item-price">{item.price}</span>
          {item.compareAtPrice && (
            <span className="wishlist-item-compare-price">{item.compareAtPrice}</span>
          )}
        </div>

        <div className="wishlist-item-actions">
          {item.availableForSale ? (
            <Link 
              to={`/products/${item.handle}`}
              className="wishlist-item-add-to-cart"
            >
              ADD TO CART
            </Link>
          ) : (
            <button 
              className="wishlist-item-add-to-cart disabled"
              disabled
            >
              OUT OF STOCK
            </button>
          )}
          
          <button
            className="wishlist-item-remove"
            onClick={() => onRemove(item.id)}
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
}
