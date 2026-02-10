/**
 * Utility functions for parsing and transforming header menu metaobject data
 */

export interface MenuItem {
  name: string;
  link: string;
}

export interface MenuSection {
  label: string;
  link: string;
  items?: MenuItem[];
  hasSubmenu?: boolean;
  isBold?: boolean;
}

export interface MenuConfig {
  sections: MenuSection[];
  image: string;
}

export interface MenuConfigs {
  [key: string]: MenuConfig;
}

interface MetaobjectNode {
  id: string;
  handle: string;
  type?: string;
  field?: {
    value: string;
  };
  title?: {
    value: string;
  };
  sections?: {
    value: string;
  };
  image?: {
    reference?: {
      image?: {
        url: string;
        altText?: string | null;
      };
    };
  };
  defaultCollection?: {
    reference?: {
      handle: string;
    };
  } | null;
}

/**
 * Parse a menu config metaobject (simplified structure)
 */
function parseMenuConfigSimplified(configNode: MetaobjectNode): { key: string; config: MenuConfig } | null {
  const menuKey = configNode.field?.value;
  if (!menuKey) {
    console.warn('Menu config missing menu_key field:', configNode.handle);
    return null;
  }
  
  // Get image
  const image = configNode.image?.reference?.image?.url || '';
  
  // For now, return empty sections since we need to query the sections separately
  // This is a limitation of the Storefront API - we can't deeply nest metaobject queries
  return {
    key: menuKey,
    config: {
      sections: [],
      image,
    },
  };
}

/**
 * Transform metaobjects response into menu configs
 */
export function parseHeaderMenus(metaobjectsData: any): MenuConfigs {
  const configs: MenuConfigs = {};
  
  if (!metaobjectsData?.metaobjects?.nodes) {
    console.warn('No metaobjects nodes found in data');
    return configs;
  }
  
  const menuMetaobjects = metaobjectsData.metaobjects.nodes;
  console.log(`Found ${menuMetaobjects.length} menu config(s)`);
  
  for (const metaobject of menuMetaobjects) {
    const parsed = parseMenuConfigSimplified(metaobject);
    if (parsed) {
      console.log(`✓ Parsed menu: ${parsed.key}`);
      configs[parsed.key] = parsed.config;
    }
  }
  
  return configs;
}

/**
 * Get fallback menu configs (used when metaobjects are not set up)
 */
export function getFallbackMenuConfigs(menuImages: {
  man: string;
  women: string;
  blacmelo: string;
}): MenuConfigs {
  return {
    man: {
      sections: [
        {
          label: '',
          link: '/collections/unisex',
          items: [
            {name: 'New Arrivals', link: '/collections/unisex'},
            {name: 'Bestsellers', link: '/collections/unisex'},
            {name: 'Restocked', link: '/collections/unisex'},
            {name: 'Shop All', link: '/collections/unisex'}
          ],
          hasSubmenu: false,
          isBold: true
        },
        {
          label: 'FEATURED',
          link: '/collections/unisex',
          items: [
            {name: 'Fall Winter \'25', link: '/collections/unisex'},
            {name: 'Owners Club', link: '/collections/unisex'},
            {name: '247', link: '/collections/unisex'},
            {name: 'Initial', link: '/collections/unisex'}
          ],
          hasSubmenu: false,
          isBold: false
        },
        {
          label: 'SHOP',
          link: '/collections/unisex',
          items: [
            {name: 'Clothing', link: '/collections/unisex'},
            {name: 'Footwear', link: '/collections/unisex'},
            {name: 'Accessories', link: '/collections/unisex'}
          ],
          hasSubmenu: true,
          isBold: false
        }
      ],
      image: menuImages.man,
    },
    women: {
      sections: [
        {
          label: '',
          link: '/collections/unisex',
          items: [
            {name: 'New Arrivals', link: '/collections/unisex'},
            {name: 'Bestsellers', link: '/collections/unisex'},
            {name: 'Restocked', link: '/collections/unisex'},
            {name: 'Shop All', link: '/collections/unisex'}
          ],
          hasSubmenu: false,
          isBold: true
        },
        {
          label: 'FEATURED',
          link: '/collections/unisex',
          items: [
            {name: 'Fall Winter \'25', link: '/collections/unisex'},
            {name: 'Woman', link: '/collections/unisex'},
            {name: 'Unisex', link: '/collections/unisex'}
          ],
          hasSubmenu: false,
          isBold: false
        },
        {
          label: 'SHOP',
          link: '/collections/unisex',
          items: [
            {name: 'Clothing', link: '/collections/unisex'},
            {name: 'Footwear', link: '/collections/unisex'},
            {name: 'Accessories', link: '/collections/unisex'}
          ],
          hasSubmenu: true,
          isBold: false
        }
      ],
      image: menuImages.women,
    },
    blacmelo: {
      sections: [
        {
          label: '',
          link: '/collections/unisex',
          items: [
            {name: 'Owners Club', link: '/collections/unisex'},
            {name: 'Join Now', link: '/collections/unisex'},
            {name: 'Benefits', link: '/collections/unisex'}
          ],
          hasSubmenu: false,
          isBold: true
        },
        {
          label: 'EXCLUSIVE',
          link: '/collections/unisex',
          items: [
            {name: 'Early Access', link: '/collections/unisex'},
            {name: 'VIP Events', link: '/collections/unisex'},
            {name: 'Personal Styling', link: '/collections/unisex'},
            {name: 'Priority Support', link: '/collections/unisex'}
          ],
          hasSubmenu: false,
          isBold: false
        },
        {
          label: 'COLLECTIONS',
          link: '/collections/unisex',
          items: [
            {name: 'Members Only', link: '/collections/unisex'},
            {name: 'Limited Editions', link: '/collections/unisex'},
            {name: 'Collaborations', link: '/collections/unisex'}
          ],
          hasSubmenu: false,
          isBold: false
        }
      ],
      image: menuImages.blacmelo,
    },
  };
}
