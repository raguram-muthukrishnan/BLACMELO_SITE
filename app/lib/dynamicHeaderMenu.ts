/**
 * Dynamic Header Menu Builder
 * Builds header menu structure from Shopify collections
 */

export interface DynamicMenuItem {
  name: string;
  link: string;
  order?: number;
}

export interface DynamicMenuSection {
  label: string;
  link: string;
  items: DynamicMenuItem[];
  isPermanent?: boolean;
}

export interface DynamicMenuConfig {
  sections: DynamicMenuSection[];
  image?: string;
}

interface CollectionNode {
  id: string;
  handle: string;
  title: string;
  image?: {
    url: string;
    altText?: string;
  };
  menuEnabled?: {
    value: string;
  };
  menuCategory?: {
    value: string;
  };
  menuOrder?: {
    value: string;
  };
}

interface DynamicHeaderMenuData {
  collections: {
    nodes: CollectionNode[];
  };
}

/**
 * Parse collections data into dynamic menu config with category grouping
 */
export function parseDynamicHeaderMenu(
  data: DynamicHeaderMenuData | null,
  defaultImage?: string
): DynamicMenuConfig {
  console.log('🔍 parseDynamicHeaderMenu called with:', {
    hasData: !!data,
    collectionsCount: data?.collections?.nodes?.length || 0,
    defaultImage: defaultImage ? 'provided' : 'none',
  });

  const sections: DynamicMenuSection[] = [];

  // Add permanent sections first - using actual collection handles
  sections.push(
    {
      label: 'Shop All',
      link: '/collections/all-products',
      items: [],
      isPermanent: true,
    },
    {
      label: 'Best Seller',
      link: '/collections/bestsellers',
      items: [],
      isPermanent: true,
    },
    {
      label: 'New Arrival',
      link: '/collections/new-arrival',
      items: [],
      isPermanent: true,
    }
  );

  console.log('✅ Added 3 permanent sections');

  // If no data, return permanent sections only
  if (!data?.collections?.nodes) {
    console.warn('⚠️ No collections data found for dynamic menu');
    return { sections, image: defaultImage };
  }

  console.log('📦 Processing collections:', data.collections.nodes.length);

  // Log ALL collections to see their metafield values
  console.log('🔍 All collections with their metafields:');
  data.collections.nodes.forEach((collection, idx) => {
    console.log(`  ${idx + 1}. ${collection.title} (${collection.handle}):`, {
      menuEnabled: collection.menuEnabled?.value,
      menuOrder: collection.menuOrder?.value,
      menuCategory: collection.menuCategory?.value,
    });
  });

  // Filter collections that are enabled for menu
  const menuCollections = data.collections.nodes.filter(
    (collection) => {
      const enabledValue = collection.menuEnabled?.value?.toLowerCase();
      const enabled = enabledValue === 'true' || 
                     enabledValue === '1' ||
                     enabledValue === 'yes';
      
      if (enabled) {
        console.log(`✓ Collection "${collection.title}" is enabled for menu (value: ${collection.menuEnabled?.value})`);
      } else if (collection.menuEnabled?.value) {
        console.log(`✗ Collection "${collection.title}" has menu_enabled="${collection.menuEnabled?.value}" but not recognized as enabled`);
      }
      
      return enabled;
    }
  );

  console.log(`📊 Found ${menuCollections.length} collections enabled for menu out of ${data.collections.nodes.length} total`);

  // Group collections by category
  const collectionsByCategory: { [category: string]: CollectionNode[] } = {};
  
  menuCollections.forEach((collection) => {
    const category = collection.menuCategory?.value || 'uncategorized';
    if (!collectionsByCategory[category]) {
      collectionsByCategory[category] = [];
    }
    collectionsByCategory[category].push(collection);
  });

  console.log('📂 Collections grouped by category:', Object.keys(collectionsByCategory));

  // Sort collections within each category by menu order
  Object.keys(collectionsByCategory).forEach((category) => {
    collectionsByCategory[category].sort((a, b) => {
      const orderA = parseInt(a.menuOrder?.value || '999', 10);
      const orderB = parseInt(b.menuOrder?.value || '999', 10);
      return orderA - orderB;
    });
  });

  // Define category display order and labels
  const categoryOrder = ['featured', 'clothing', 'accessories', 'seasonal', 'uncategorized'];
  const categoryLabels: { [key: string]: string } = {
    featured: 'FEATURED',
    clothing: 'CLOTHING',
    accessories: 'ACCESSORIES',
    seasonal: 'SEASONAL',
    uncategorized: 'MORE',
  };

  // Add sections for each category
  categoryOrder.forEach((category) => {
    const collections = collectionsByCategory[category];
    if (!collections || collections.length === 0) return;

    // Create items for this category
    const items: DynamicMenuItem[] = collections.map((collection) => ({
      name: collection.title,
      link: `/collections/${collection.handle}`,
      order: parseInt(collection.menuOrder?.value || '999', 10),
    }));

    // Add category section
    sections.push({
      label: categoryLabels[category] || category.toUpperCase(),
      link: '', // Category headers don't have links
      items,
      isPermanent: false,
    });

    console.log(`➕ Added category "${category}" with ${items.length} collections`);
  });

  // Add any categories not in the predefined order
  Object.keys(collectionsByCategory).forEach((category) => {
    if (!categoryOrder.includes(category)) {
      const collections = collectionsByCategory[category];
      const items: DynamicMenuItem[] = collections.map((collection) => ({
        name: collection.title,
        link: `/collections/${collection.handle}`,
        order: parseInt(collection.menuOrder?.value || '999', 10),
      }));

      sections.push({
        label: category.toUpperCase(),
        link: '',
        items,
        isPermanent: false,
      });

      console.log(`➕ Added custom category "${category}" with ${items.length} collections`);
    }
  });

  console.log(`✅ Built dynamic menu with ${sections.length} sections (3 permanent + ${sections.length - 3} category sections)`);

  return {
    sections,
    image: defaultImage,
  };
}

/**
 * Get fallback menu config when no data is available
 */
export function getFallbackDynamicMenu(defaultImage?: string): DynamicMenuConfig {
  return {
    sections: [
      {
        label: 'Shop All',
        link: '/collections/all-products', // All Products collection
        items: [],
        isPermanent: true,
      },
      {
        label: 'Best Seller',
        link: '/collections/bestsellers', // Changed to match Shopify handle
        items: [],
        isPermanent: true,
      },
      {
        label: 'New Arrival',
        link: '/collections/new-arrival',
        items: [],
        isPermanent: true,
      },
    ],
    image: defaultImage,
  };
}
