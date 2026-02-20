/**
 * Category Hardcoded Links Configuration
 * 
 * Define hardcoded links that should appear within specific category sections.
 * These are NOT Shopify collections but permanent links that get injected into categories.
 * 
 * Usage:
 * - Add links to any category by using the category key (lowercase)
 * - Order determines position (lower = appears first)
 * - Use high order numbers (998, 999) to appear at the end of the category
 * - itemType can be 'permanent' (bold) or 'dynamic' (normal)
 */

export interface HardcodedLink {
  name: string;
  link: string;
  order: number;
  itemType?: 'permanent' | 'dynamic';
}

export const categoryHardcodedLinks: Record<string, HardcodedLink[]> = {
  // Shop category - add Gift cards and Recently Viewed at the end
  shop: [
    {
      name: 'Gift cards',
      link: '/products/gift-card',
      order: 998,
      itemType: 'dynamic',
    },
    {
      name: 'Recently Viewed',
      link: '/account/recently-viewed',
      order: 999,
      itemType: 'dynamic',
    },
  ],

  // Explore category - fully hardcoded category with custom links
  explore: [
    {
      name: 'The Prestige',
      link: '/the-prestige',
      order: 1,
      itemType: 'dynamic',
    },
    {
      name: 'The Vault',
      link: '/the-vault',
      order: 2,
      itemType: 'dynamic',
    },
    {
      name: 'Blacmelo Club',
      link: '/pages/blacmelo-club',
      order: 3,
      itemType: 'dynamic',
    },
    {
      name: 'Lookbooks',
      link: '/pages/lookbooks',
      order: 4,
      itemType: 'dynamic',
    },
  ],

  // Example: Add more hardcoded links to other categories
  // featured: [
  //   {
  //     name: 'Sale',
  //     link: '/collections/sale',
  //     order: 100,
  //     itemType: 'permanent',
  //   },
  // ],

  // seasonal: [
  //   {
  //     name: 'Holiday Gift Guide',
  //     link: '/pages/gift-guide',
  //     order: 1,
  //     itemType: 'permanent',
  //   },
  // ],
};

/**
 * Get hardcoded links for a specific category
 */
export function getHardcodedLinksForCategory(category: string): HardcodedLink[] {
  const normalizedCategory = category.toLowerCase();
  return categoryHardcodedLinks[normalizedCategory] || [];
}
