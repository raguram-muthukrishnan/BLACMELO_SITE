/**
 * Wishlist Management Utility
 * Handles adding, removing, and retrieving wishlist items from localStorage
 */

export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  image?: string;
  availableForSale: boolean;
  vendor?: string;
}

const WISHLIST_STORAGE_KEY = 'blacmelo_wishlist';

/**
 * Get all wishlist items from localStorage
 */
export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as WishlistItem[]) : [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
}

/**
 * Check if a product is in the wishlist
 */
export function isInWishlist(productId: string): boolean {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === productId);
}

/**
 * Add a product to the wishlist
 */
export function addToWishlist(item: WishlistItem): boolean {
  try {
    const wishlist = getWishlist();
    
    // Check if item already exists
    if (wishlist.some(existingItem => existingItem.id === item.id)) {
      return false;
    }
    
    wishlist.push(item);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('wishlistChanged', { 
      detail: { action: 'add', item, count: wishlist.length }
    }));
    
    return true;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
}

/**
 * Remove a product from the wishlist
 */
export function removeFromWishlist(productId: string): boolean {
  try {
    const wishlist = getWishlist();
    const filteredWishlist = wishlist.filter(item => item.id !== productId);
    
    if (filteredWishlist.length === wishlist.length) {
      return false; // Item wasn't in wishlist
    }
    
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(filteredWishlist));
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('wishlistChanged', { 
      detail: { action: 'remove', productId, count: filteredWishlist.length }
    }));
    
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
}

/**
 * Toggle a product in the wishlist
 */
export function toggleWishlist(item: WishlistItem): boolean {
  if (isInWishlist(item.id)) {
    removeFromWishlist(item.id);
    return false;
  } else {
    addToWishlist(item);
    return true;
  }
}

/**
 * Clear the entire wishlist
 */
export function clearWishlist(): void {
  try {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('wishlistChanged', { 
      detail: { action: 'clear', count: 0 }
    }));
  } catch (error) {
    console.error('Error clearing wishlist:', error);
  }
}

/**
 * Get wishlist count
 */
export function getWishlistCount(): number {
  return getWishlist().length;
}
