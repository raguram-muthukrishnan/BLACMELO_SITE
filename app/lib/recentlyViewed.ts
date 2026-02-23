/**
 * Recently Viewed Products - Client-side cache management
 */

const STORAGE_KEY = 'blacmelo_recently_viewed';
const MAX_ITEMS = 8;

export interface RecentlyViewedProduct {
  id: string;
  handle: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  /** Available size labels, e.g. ["XS","S","M","L"] */
  sizes?: Array<{ label: string; available: boolean }>;
  /** Color family name or color count display */
  colorFamily?: string;
  /** Number of color variants */
  colorCount?: number;
  viewedAt: number;
}

/**
 * Get recently viewed products from localStorage
 */
export function getRecentlyViewed(): RecentlyViewedProduct[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const items = JSON.parse(stored) as RecentlyViewedProduct[];
    // Sort by most recent first
    return items.sort((a, b) => b.viewedAt - a.viewedAt);
  } catch (error) {
    console.error('Error reading recently viewed:', error);
    return [];
  }
}

/**
 * Add a product to recently viewed
 */
export function addToRecentlyViewed(product: Omit<RecentlyViewedProduct, 'viewedAt'>): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getRecentlyViewed();

    // Remove if already exists
    const filtered = existing.filter(item => item.id !== product.id);

    // Add to beginning with current timestamp
    const updated = [
      { ...product, viewedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_ITEMS); // Keep only MAX_ITEMS

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recently viewed:', error);
  }
}

/**
 * Clear all recently viewed products
 */
export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
}

/**
 * Get recently viewed product IDs for GraphQL query
 */
export function getRecentlyViewedIds(): string[] {
  return getRecentlyViewed().map(item => item.id);
}
