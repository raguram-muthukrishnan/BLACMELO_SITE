/**
 * Dynamic Header Menu Builder
 * Builds header menu structure from Shopify collections
 */

import { getHardcodedLinksForCategory } from '~/config/categoryHardcodedLinks';

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
  const sections: DynamicMenuSection[] = [];

  // If no data, return empty sections
  if (!data?.collections?.nodes) {
    return { sections, image: defaultImage };
  }

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
          return false;
        }
      }
      
      return enabled;
    }
  );

  /**
   * Helper function to build collection links and handle aliases
   */
  function getCollectionLink(handle: string): string {
    const finalHandle = handle === 'w-tops' ? 'tshirts' : handle;
    return `/collections/${finalHandle}`;
  }

  /**
   * Helper function to build nested collection structure
   * Returns collections with their children nested
   * NOTE: Collections can appear BOTH as standalone items AND as nested children
   */
  function buildCollectionTree(collections: CollectionNode[]): Map<string, DynamicMenuItem> {
    const collectionMap = new Map<string, DynamicMenuItem>();
    const childCollections: CollectionNode[] = [];
    
    // First pass: create items for ALL collections (both parent and child)
    collections.forEach((collection) => {
      const item: DynamicMenuItem = {
        name: collection.title,
        link: getCollectionLink(collection.handle),
        order: parseInt(collection.menuOrder?.value || '999', 10),
        itemType: (collection.menuItemType?.value?.toLowerCase() as ItemType) || 'dynamic',
        children: [],
      };
      
      // Add ALL collections to the map (allows them to appear as standalone items)
      collectionMap.set(collection.handle, item);
      
      const parentHandle = collection.menuParentCollection?.value;
      if (parentHandle) {
        // Track this as a child collection for nesting purposes
        childCollections.push(collection);
      }
    });
    
    // Second pass: attach children to their parents
    childCollections.forEach((childCollection) => {
      const parentHandle = childCollection.menuParentCollection?.value;
      if (parentHandle && collectionMap.has(parentHandle)) {
        const parent = collectionMap.get(parentHandle)!;
        const childItem: DynamicMenuItem = {
          name: childCollection.title,
          link: getCollectionLink(childCollection.handle),
          order: parseInt(childCollection.menuOrder?.value || '999', 10),
          itemType: (childCollection.menuItemType?.value?.toLowerCase() as ItemType) || 'dynamic',
        };
        parent.children!.push(childItem);
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

  // Include ALL collections for section grouping (allows items to appear in multiple places)
  const allCollections = menuCollections;

  // Separate all collections by section type
  const commonCollections: CollectionNode[] = [];
  const categoryCollections: CollectionNode[] = [];

  allCollections.forEach((collection) => {
    const sectionType = collection.menuSectionType?.value?.toLowerCase() || 'category';
    if (sectionType === 'common') {
      commonCollections.push(collection);
    } else {
      categoryCollections.push(collection);
    }
  });

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
        link: getCollectionLink(collection.handle),
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

  // Sort collections within each category by menu order
  Object.keys(collectionsByCategory).forEach((category) => {
    collectionsByCategory[category].sort((a, b) => {
      const orderA = parseInt(a.menuOrder?.value || '999', 10);
      const orderB = parseInt(b.menuOrder?.value || '999', 10);
      return orderA - orderB;
    });
  });

  // Define category display order and labels
  const categoryOrder = ['featured', 'shop', 'explore', 'clothing', 'accessories', 'seasonal', 'uncategorized'];
  const categoryLabels: { [key: string]: string } = {
    featured: 'FEATURED',
    shop: 'SHOP',
    explore: 'EXPLORE',
    clothing: 'CLOTHING',
    accessories: 'ACCESSORIES',
    seasonal: 'SEASONAL',
    uncategorized: 'MORE',
  };

  // Add sections for each category
  let categoryOrderIndex = 2; // Start after permanent (0) and common (1)
  categoryOrder.forEach((category) => {
    const collections = collectionsByCategory[category] || [];
    const hardcodedLinks = getHardcodedLinksForCategory(category);
    
    // Skip if category has no collections AND no hardcoded links
    if (collections.length === 0 && hardcodedLinks.length === 0) return;

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
        link: getCollectionLink(collection.handle),
        order: parseInt(collection.menuOrder?.value || '999', 10),
        itemType: 'dynamic' as ItemType,
      };
    });

    // Inject hardcoded links for this category
    if (hardcodedLinks.length > 0) {
      hardcodedLinks.forEach((link) => {
        items.push({
          name: link.name,
          link: link.link,
          order: link.order,
          itemType: link.itemType || 'dynamic',
        });
      });
    }

    // Sort items by order (so hardcoded links appear in correct position)
    items.sort((a, b) => (a.order || 999) - (b.order || 999));

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
          link: getCollectionLink(collection.handle),
          order: parseInt(collection.menuOrder?.value || '999', 10),
          itemType: 'dynamic' as ItemType,
        };
      });

      // Inject hardcoded links for this category
      const hardcodedLinks = getHardcodedLinksForCategory(category);
      if (hardcodedLinks.length > 0) {
        hardcodedLinks.forEach((link) => {
          items.push({
            name: link.name,
            link: link.link,
            order: link.order,
            itemType: link.itemType || 'dynamic',
          });
        });
      }

      // Sort items by order
      items.sort((a, b) => (a.order || 999) - (b.order || 999));

      sections.push({
        label: category.toUpperCase(),
        link: '',
        items,
        isPermanent: false,
        sectionType: 'category',
        displayStyle: 'title-with-items',
        order: categoryOrderIndex++,
      });
    }
  });

  // Sort sections by order
  sections.sort((a, b) => (a.order || 999) - (b.order || 999));

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
    sections: [],
    image: defaultImage,
  };
}
