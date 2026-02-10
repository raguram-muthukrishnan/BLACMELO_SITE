/**
 * Utility functions for building header menus from collections with metafields
 * This is a simpler alternative to the metaobject approach
 */

import type {MenuConfigs, MenuSection, MenuItem} from '~/lib/headerMenu';

interface CollectionNode {
  id: string;
  handle: string;
  title: string;
  image?: {
    url: string;
    altText?: string;
  };
  menuCategory?: {
    value: string;
  };
  menuSection?: {
    value: string;
  };
  menuOrder?: {
    value: string;
  };
  isBold?: {
    value: string;
  };
  menuLabel?: {
    value: string;
  };
  menuImage?: {
    reference?: {
      image?: {
        url: string;
        altText?: string;
      };
    };
  };
}

interface CollectionMenuData {
  collections: {
    nodes: CollectionNode[];
  };
}

interface GroupedCollections {
  [category: string]: {
    [section: string]: CollectionNode[];
  };
}

/**
 * Group collections by category and section
 */
function groupCollections(collections: CollectionNode[]): GroupedCollections {
  const grouped: GroupedCollections = {};

  for (const collection of collections) {
    const category = collection.menuCategory?.value;
    const section = collection.menuSection?.value;

    if (!category || !section) continue;

    if (!grouped[category]) {
      grouped[category] = {};
    }

    if (!grouped[category][section]) {
      grouped[category][section] = [];
    }

    grouped[category][section].push(collection);
  }

  // Sort collections within each section by order
  for (const category in grouped) {
    for (const section in grouped[category]) {
      grouped[category][section].sort((a, b) => {
        const orderA = parseInt(a.menuOrder?.value || '999', 10);
        const orderB = parseInt(b.menuOrder?.value || '999', 10);
        return orderA - orderB;
      });
    }
  }

  return grouped;
}

/**
 * Get section label from section key
 */
function getSectionLabel(sectionKey: string): string {
  const labels: {[key: string]: string} = {
    'top': '',
    'featured': 'FEATURED',
    'shop': 'SHOP',
    'exclusive': 'EXCLUSIVE',
    'collections': 'COLLECTIONS',
  };

  return labels[sectionKey] || sectionKey.toUpperCase();
}

/**
 * Check if section should have submenu
 */
function hasSubmenu(sectionKey: string): boolean {
  return sectionKey === 'shop';
}

/**
 * Build menu sections from grouped collections
 */
function buildMenuSections(
  categoryCollections: {[section: string]: CollectionNode[]},
  defaultImage: string
): {sections: MenuSection[]; image: string} {
  const sections: MenuSection[] = [];
  let menuImage = defaultImage;

  // Define section order
  const sectionOrder = ['top', 'featured', 'shop', 'exclusive', 'collections'];
  
  for (const sectionKey of sectionOrder) {
    const collections = categoryCollections[sectionKey];
    if (!collections || collections.length === 0) continue;

    const items: MenuItem[] = collections.map((collection) => ({
      name: collection.menuLabel?.value || collection.title,
      link: `/collections/${collection.handle}`,
    }));

    // Check if any collection in this section is bold
    const isBold = collections.some(
      (c) => c.isBold?.value === 'true' || c.isBold?.value === '1'
    );

    // Use the first collection's link as the section link
    const sectionLink = collections[0] ? `/collections/${collections[0].handle}` : '/collections';

    sections.push({
      label: getSectionLabel(sectionKey),
      link: sectionLink,
      items,
      hasSubmenu: hasSubmenu(sectionKey),
      isBold,
    });

    // Use menu image from first collection if available
    if (!menuImage || menuImage === defaultImage) {
      const firstCollectionImage = collections[0]?.menuImage?.reference?.image?.url;
      if (firstCollectionImage) {
        menuImage = firstCollectionImage;
      }
    }
  }

  return {sections, image: menuImage};
}

/**
 * Parse collections data into menu configs
 */
export function parseCollectionMenus(
  data: CollectionMenuData,
  defaultImages: {
    man: string;
    women: string;
    blacmelo: string;
  }
): MenuConfigs {
  const configs: MenuConfigs = {};

  if (!data?.collections?.nodes) {
    console.warn('⚠️ No collections nodes found in data');
    return configs;
  }

  console.log(`📊 Found ${data.collections.nodes.length} total collections`);
  
  // Log collections with menu metafields
  const collectionsWithMenu = data.collections.nodes.filter(
    c => c.menuCategory?.value && c.menuSection?.value
  );
  console.log(`✓ ${collectionsWithMenu.length} collections have menu metafields`);
  
  collectionsWithMenu.forEach(c => {
    console.log(`  - ${c.title} (${c.handle}): category=${c.menuCategory?.value}, section=${c.menuSection?.value}`);
  });

  const grouped = groupCollections(data.collections.nodes);

  // Build menu for each category
  for (const category of ['man', 'women', 'blacmelo']) {
    if (grouped[category]) {
      const defaultImage = defaultImages[category as keyof typeof defaultImages] || '';
      const {sections, image} = buildMenuSections(grouped[category], defaultImage);
      
      if (sections.length > 0) {
        configs[category] = {
          sections,
          image,
        };
        console.log(`✅ Built menu for "${category}" with ${sections.length} sections`);
      }
    }
  }

  return configs;
}
