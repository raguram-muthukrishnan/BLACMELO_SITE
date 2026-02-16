/**
 * Dynamic Header Menu Builder
 * Builds header menu structure from Shopify collections
 */

export type SectionType = 'permanent' | 'category' | 'common';
export type DisplayStyle = 'bold' | 'normal' | 'title-with-items';
export type ItemType = 'permanent' | 'dynamic';

export interface DynamicMenuItem {
  name: string;
  link: string;
  order?: number;
  itemType?: ItemType;
  children?: DynamicMenuItem[]; // Support nested collections
}

export interface DynamicMenuSection {
  label: string;
  link: string;
  items: DynamicMenuItem[];
  isPermanent?: boolean; // Kept for backward compatibility
  sectionType?: SectionType;
  displayStyle?: DisplayStyle;
  order?: number;
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
  menuGender?: {
    value: string;
  };
  menuSectionType?: {
    value: string;
  };
  menuItemType?: {
    value: string;
  };
  menuDisplayStyle?: {
    value: string;
  };
  menuParentCollection?: {
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
  defaultImage?: string,
  gender?: 'men' | 'women'
): DynamicMenuConfig {
  console.log('🔍 parseDynamicHeaderMenu called with:', {
    hasData: !!data,
    collectionsCount: data?.collections?.nodes?.length || 0,
    defaultImage: defaultImage ? 'provided' : 'none',
    gender: gender || 'all',
  });

  const sections: DynamicMenuSection[] = [];

  // Create permanent section as ONE section with items
  const permanentSection: DynamicMenuSection = {
    label: 'PERMANENT_LINKS',
    link: '',
    items: [
      {
        name: 'Shop All',
        link: '/collections/all-products',
        order: 1,
        itemType: 'permanent',
      },
      {
        name: 'Best Seller',
        link: '/collections/bestsellers',
        order: 2,
        itemType: 'permanent',
      },
      {
        name: 'New Arrival',
        link: '/collections/new-arrival',
        order: 3,
        itemType: 'permanent',
      },
    ],
    isPermanent: true, // Kept for backward compatibility
    sectionType: 'permanent',
    displayStyle: 'bold',
    order: 0,
  };

  sections.push(permanentSection);
  console.log('✅ Added permanent section with 3 items');

  // If no data, return permanent section only
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
      menuSectionType: collection.menuSectionType?.value,
      menuItemType: collection.menuItemType?.value,
    });
  });

  // Filter collections that are enabled for menu
  const menuCollections = data.collections.nodes.filter(
    (collection) => {
      const enabledValue = collection.menuEnabled?.value?.toLowerCase();
      const enabled = enabledValue === 'true' || 
                     enabledValue === '1' ||
                     enabledValue === 'yes';
      
      // If gender filter is specified, also check menu_gender metafield
      if (enabled && gender) {
        const collectionGender = collection.menuGender?.value?.toLowerCase();
        // Include collection if it matches the gender filter OR has no gender specified (universal)
        const matchesGender = !collectionGender || collectionGender === gender || collectionGender === 'both' || collectionGender === 'all';
        
        if (!matchesGender) {
          console.log(`✗ Collection "${collection.title}" is enabled but filtered out by gender (has: ${collectionGender}, need: ${gender})`);
          return false;
        }
      }
      
      if (enabled) {
        console.log(`✓ Collection "${collection.title}" is enabled for menu (value: ${collection.menuEnabled?.value})`);
      } else if (collection.menuEnabled?.value) {
        console.log(`✗ Collection "${collection.title}" has menu_enabled="${collection.menuEnabled?.value}" but not recognized as enabled`);
      }
      
      return enabled;
    }
  );

  console.log(`📊 Found ${menuCollections.length} collections enabled for menu out of ${data.collections.nodes.length} total`);

  /**
   * Helper function to build nested collection structure
   * Returns collections with their children nested
   */
  function buildCollectionTree(collections: CollectionNode[]): Map<string, DynamicMenuItem> {
    const collectionMap = new Map<string, DynamicMenuItem>();
    const childCollections: CollectionNode[] = [];
    
    // First pass: create all items and separate parent/child
    collections.forEach((collection) => {
      const item: DynamicMenuItem = {
        name: collection.title,
        link: `/collections/${collection.handle}`,
        order: parseInt(collection.menuOrder?.value || '999', 10),
        itemType: (collection.menuItemType?.value?.toLowerCase() as ItemType) || 'dynamic',
        children: [],
      };
      
      const parentHandle = collection.menuParentCollection?.value;
      if (parentHandle) {
        // This is a child collection
        childCollections.push(collection);
      } else {
        // This is a parent/standalone collection
        collectionMap.set(collection.handle, item);
      }
    });
    
    // Second pass: attach children to their parents
    childCollections.forEach((childCollection) => {
      const parentHandle = childCollection.menuParentCollection?.value;
      if (parentHandle && collectionMap.has(parentHandle)) {
        const parent = collectionMap.get(parentHandle)!;
        const childItem: DynamicMenuItem = {
          name: childCollection.title,
          link: `/collections/${childCollection.handle}`,
          order: parseInt(childCollection.menuOrder?.value || '999', 10),
          itemType: (childCollection.menuItemType?.value?.toLowerCase() as ItemType) || 'dynamic',
        };
        parent.children!.push(childItem);
        console.log(`  🔗 Attached "${childItem.name}" as child of "${parent.name}"`);
      } else {
        console.warn(`⚠️ Child collection "${childCollection.title}" references non-existent parent "${parentHandle}"`);
      }
    });
    
    // Sort children within each parent
    collectionMap.forEach((item) => {
      if (item.children && item.children.length > 0) {
        item.children.sort((a, b) => (a.order || 999) - (b.order || 999));
      }
    });
    
    return collectionMap;
  }
  
  // Build the nested collection tree
  const collectionTree = buildCollectionTree(menuCollections);
  console.log(`🌳 Built collection tree with ${collectionTree.size} top-level items`);

  // Get only parent collections (for section grouping)
  const parentCollections = menuCollections.filter(
    (collection) => !collection.menuParentCollection?.value
  );

  // Separate parent collections by section type
  const commonCollections: CollectionNode[] = [];
  const categoryCollections: CollectionNode[] = [];

  parentCollections.forEach((collection) => {
    const sectionType = collection.menuSectionType?.value?.toLowerCase() || 'category';
    if (sectionType === 'common') {
      commonCollections.push(collection);
    } else {
      categoryCollections.push(collection);
    }
  });

  console.log(`📂 Common items: ${commonCollections.length}, Category items: ${categoryCollections.length}`);

  // Process common section if exists
  if (commonCollections.length > 0) {
    // Sort by order
    commonCollections.sort((a, b) => {
      const orderA = parseInt(a.menuOrder?.value || '999', 10);
      const orderB = parseInt(b.menuOrder?.value || '999', 10);
      return orderA - orderB;
    });

    const commonItems: DynamicMenuItem[] = commonCollections.map((collection) => {
      // Get the item from the tree (includes nested children)
      const treeItem = collectionTree.get(collection.handle);
      if (treeItem) {
        return treeItem;
      }
      // Fallback if not in tree
      const itemType = collection.menuItemType?.value?.toLowerCase() as ItemType || 'dynamic';
      return {
        name: collection.title,
        link: `/collections/${collection.handle}`,
        order: parseInt(collection.menuOrder?.value || '999', 10),
        itemType,
      };
    });

    sections.push({
      label: 'COMMON',
      link: '',
      items: commonItems,
      isPermanent: false,
      sectionType: 'common',
      displayStyle: 'normal',
      order: 1,
    });

    console.log(`➕ Added common section with ${commonItems.length} items`);
  }

  // Group category collections by category
  const collectionsByCategory: { [category: string]: CollectionNode[] } = {};
  
  categoryCollections.forEach((collection) => {
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
  let categoryOrderIndex = 2; // Start after permanent (0) and common (1)
  categoryOrder.forEach((category) => {
    const collections = collectionsByCategory[category];
    if (!collections || collections.length === 0) return;

    // Create items for this category (using tree to include nested children)
    const items: DynamicMenuItem[] = collections.map((collection) => {
      // Get the item from the tree (includes nested children)
      const treeItem = collectionTree.get(collection.handle);
      if (treeItem) {
        return treeItem;
      }
      // Fallback if not in tree
      return {
        name: collection.title,
        link: `/collections/${collection.handle}`,
        order: parseInt(collection.menuOrder?.value || '999', 10),
        itemType: 'dynamic' as ItemType,
      };
    });

    // Add category section
    sections.push({
      label: categoryLabels[category] || category.toUpperCase(),
      link: '', // Category headers don't have links
      items,
      isPermanent: false,
      sectionType: 'category',
      displayStyle: 'title-with-items',
      order: categoryOrderIndex++,
    });

    console.log(`➕ Added category "${category}" with ${items.length} collections`);
  });

  // Add any categories not in the predefined order
  Object.keys(collectionsByCategory).forEach((category) => {
    if (!categoryOrder.includes(category)) {
      const collections = collectionsByCategory[category];
      const items: DynamicMenuItem[] = collections.map((collection) => {
        // Get the item from the tree (includes nested children)
        const treeItem = collectionTree.get(collection.handle);
        if (treeItem) {
          return treeItem;
        }
        // Fallback if not in tree
        return {
          name: collection.title,
          link: `/collections/${collection.handle}`,
          order: parseInt(collection.menuOrder?.value || '999', 10),
          itemType: 'dynamic' as ItemType,
        };
      });

      sections.push({
        label: category.toUpperCase(),
        link: '',
        items,
        isPermanent: false,
        sectionType: 'category',
        displayStyle: 'title-with-items',
        order: categoryOrderIndex++,
      });

      console.log(`➕ Added custom category "${category}" with ${items.length} collections`);
    }
  });

  // Sort sections by order
  sections.sort((a, b) => (a.order || 999) - (b.order || 999));

  console.log(`✅ Built dynamic menu with ${sections.length} sections (1 permanent + ${commonCollections.length > 0 ? '1 common + ' : ''}${sections.length - (commonCollections.length > 0 ? 2 : 1)} category sections)`);

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
        label: 'PERMANENT_LINKS',
        link: '',
        items: [
          {
            name: 'Shop All',
            link: '/collections/all-products',
            order: 1,
            itemType: 'permanent',
          },
          {
            name: 'Best Seller',
            link: '/collections/bestsellers',
            order: 2,
            itemType: 'permanent',
          },
          {
            name: 'New Arrival',
            link: '/collections/new-arrival',
            order: 3,
            itemType: 'permanent',
          },
        ],
        isPermanent: true,
        sectionType: 'permanent',
        displayStyle: 'bold',
        order: 0,
      },
    ],
    image: defaultImage,
  };
}
