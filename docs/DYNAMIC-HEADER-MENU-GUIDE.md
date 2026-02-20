# Dynamic Header Menu Implementation Guide

This guide provides two approaches to make your header menus dynamic based on Shopify data.

## Overview

Your header currently has hardcoded menu items. We'll make it dynamic so you can manage menus directly from Shopify without code changes.

## Two Approaches

### Approach 1: Metaobjects (More Flexible)
- **Best for:** Complex menu structures, non-collection items, custom hierarchies
- **Setup complexity:** Medium
- **Flexibility:** High
- **See:** `DYNAMIC-HEADER-MENU-SETUP.md`

### Approach 2: Collection Metafields (Simpler)
- **Best for:** Collection-focused menus, quick setup
- **Setup complexity:** Low
- **Flexibility:** Medium
- **See:** `DYNAMIC-HEADER-MENU-SIMPLE.md`

## Quick Start - Collection Metafields Approach (Recommended)

This is the simpler approach and works great for most use cases.

### Step 1: Add Metafields to Collections

1. Go to **Shopify Admin → Settings → Custom Data → Collections**
2. Click **Add definition** and create these metafields:

**Metafield 1: Menu Category**
```
Namespace and key: menu.category
Name: Menu Category
Type: Single line text
Description: Which menu this appears in (man, women, blacmelo)
```

**Metafield 2: Menu Section**
```
Namespace and key: menu.section
Name: Menu Section
Type: Single line text
Description: Section within the menu (top, featured, shop)
```

**Metafield 3: Menu Order**
```
Namespace and key: menu.order
Name: Menu Order
Type: Integer
Description: Display order (1, 2, 3, etc.)
```

**Metafield 4: Display Bold**
```
Namespace and key: menu.is_bold
Name: Display Bold
Type: True/False
Description: Show in bold font
```

**Metafield 5: Menu Label (Optional)**
```
Namespace and key: menu.label
Name: Menu Label
Type: Single line text
Description: Custom label (if different from collection title)
```

### Step 2: Configure Your Collections

For each collection you want in the menu:

1. Go to the collection in Shopify Admin
2. Scroll to **Metafields** section
3. Fill in the values

**Example: "New Arrivals" Collection**
- Menu Category: `man`
- Menu Section: `top`
- Menu Order: `1`
- Display Bold: `true`
- Menu Label: (leave empty to use collection title)

**Example: "Fall Winter 25" Collection**
- Menu Category: `man`
- Menu Section: `featured`
- Menu Order: `1`
- Display Bold: `false`

**Example: "Clothing" Collection**
- Menu Category: `man`
- Menu Section: `shop`
- Menu Order: `1`
- Display Bold: `false`

### Step 3: Update Your Code

Update `hydrogen-storefront/app/root.tsx` to use the collection-based approach:

```typescript
// In loadCriticalData function, replace the menuMetaobjects query with:
const [header, collectionMenuData] = await Promise.all([
  storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu',
    },
  }),
  // Fetch collections with menu metafields
  storefront.query(COLLECTION_MENU_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      first: 50,
    },
  }).catch((error: Error) => {
    console.error('Error fetching collection menu data:', error);
    return null;
  }),
]);

// Parse collection menu data
const menuConfigs = collectionMenuData 
  ? parseCollectionMenus(collectionMenuData, {
      man: menuManImage,
      women: menuWomanImage,
      blacmelo: menuManImage,
    })
  : null;

return {header, menuConfigs};
```

And update the imports:
```typescript
import {COLLECTION_MENU_QUERY} from '~/graphql/CollectionMenuQuery';
import {parseCollectionMenus} from '~/lib/collectionMenu';
```

### Step 4: Test

1. Save your changes
2. Restart your dev server
3. The header should now display collections based on your metafield configuration
4. If no metafields are set, it will use the fallback hardcoded menus

## Menu Sections Explained

### Section Keys

- **`top`**: Items displayed at the top in bold (New Arrivals, Bestsellers, etc.)
- **`featured`**: Featured collections section
- **`shop`**: Main shopping categories (Clothing, Footwear, Accessories)
- **`exclusive`**: Exclusive items (for Blacmelo+ menu)
- **`collections`**: Special collections section

### Section Labels

The system automatically converts section keys to labels:
- `top` → (no label, items appear bold at top)
- `featured` → "FEATURED"
- `shop` → "SHOP"
- `exclusive` → "EXCLUSIVE"
- `collections` → "COLLECTIONS"

## Menu Categories

- **`man`**: Men's menu
- **`women`**: Women's menu
- **`blacmelo`**: Blacmelo+ menu

## Example Menu Structure

Here's how to set up a complete "Man" menu:

### Top Section (Bold Items)
1. **New Arrivals** - category: `man`, section: `top`, order: `1`, bold: `true`
2. **Bestsellers** - category: `man`, section: `top`, order: `2`, bold: `true`
3. **Shop All** - category: `man`, section: `top`, order: `3`, bold: `true`

### Featured Section
1. **Fall Winter '25** - category: `man`, section: `featured`, order: `1`
2. **Owners Club** - category: `man`, section: `featured`, order: `2`
3. **247** - category: `man`, section: `featured`, order: `3`

### Shop Section
1. **Clothing** - category: `man`, section: `shop`, order: `1`
2. **Footwear** - category: `man`, section: `shop`, order: `2`
3. **Accessories** - category: `man`, section: `shop`, order: `3`

## Troubleshooting

### Menus not updating?
- Clear your browser cache
- Check that metafields are saved correctly in Shopify
- Verify the collection handles are correct
- Check browser console for errors

### Collections not appearing?
- Ensure `menu.category` and `menu.section` are set
- Check that collections are published
- Verify metafield namespace is exactly `menu`

### Wrong order?
- Check `menu.order` values (1, 2, 3, etc.)
- Lower numbers appear first

## Benefits

✅ **No code changes** needed to update menus  
✅ **Manage from Shopify** admin interface  
✅ **Automatic sync** with your collections  
✅ **Easy to maintain** - just update metafields  
✅ **Fallback support** - uses hardcoded menus if metafields aren't set  

## Next Steps

1. Set up metafields in Shopify
2. Configure your collections
3. Update the code as shown above
4. Test and verify
5. Add more collections as needed

For the more advanced metaobject approach, see `DYNAMIC-HEADER-MENU-SETUP.md`.
