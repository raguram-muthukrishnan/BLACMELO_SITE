# Header Menu Quick Reference

## Collection Metafields Setup

### Required Metafields (Shopify Admin → Settings → Custom Data → Collections)

| Metafield | Namespace.Key | Type | Example Values |
|-----------|---------------|------|----------------|
| Menu Category | `menu.category` | Single line text | `man`, `women`, `blacmelo` |
| Menu Section | `menu.section` | Single line text | `top`, `featured`, `shop` |
| Menu Order | `menu.order` | Integer | `1`, `2`, `3` |
| Display Bold | `menu.is_bold` | True/False | `true`, `false` |
| Menu Label | `menu.label` | Single line text | Custom name (optional) |

## Section Types

| Section Key | Label Displayed | Description | Has Submenu |
|-------------|----------------|-------------|-------------|
| `top` | (none) | Bold items at top | No |
| `featured` | FEATURED | Featured collections | No |
| `shop` | SHOP | Main categories | Yes |
| `exclusive` | EXCLUSIVE | Exclusive items | No |
| `collections` | COLLECTIONS | Special collections | No |

## Menu Categories

| Category | Description |
|----------|-------------|
| `man` | Men's menu |
| `women` | Women's menu |
| `blacmelo` | Blacmelo+ menu |

## Example Collection Configuration

### New Arrivals (Top Section)
```
menu.category: man
menu.section: top
menu.order: 1
menu.is_bold: true
menu.label: (empty - uses collection title)
```

### Fall Winter '25 (Featured Section)
```
menu.category: man
menu.section: featured
menu.order: 1
menu.is_bold: false
menu.label: Fall Winter '25
```

### Clothing (Shop Section)
```
menu.category: man
menu.section: shop
menu.order: 1
menu.is_bold: false
menu.label: (empty)
```

## Code Changes Required

### 1. Update root.tsx imports
```typescript
import {COLLECTION_MENU_QUERY} from '~/graphql/CollectionMenuQuery';
import {parseCollectionMenus} from '~/lib/collectionMenu';
```

### 2. Update loadCriticalData function
Replace the menuMetaobjects query with:
```typescript
const [header, collectionMenuData] = await Promise.all([
  storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu',
    },
  }),
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

const menuConfigs = collectionMenuData 
  ? parseCollectionMenus(collectionMenuData, {
      man: menuManImage,
      women: menuWomanImage,
      blacmelo: menuManImage,
    })
  : null;

return {header, menuConfigs};
```

## Testing Checklist

- [ ] Metafields created in Shopify
- [ ] Collections configured with metafields
- [ ] Code updated in root.tsx
- [ ] Dev server restarted
- [ ] Header displays collections correctly
- [ ] Menu items link to correct collections
- [ ] Bold styling applied correctly
- [ ] Section labels display correctly
- [ ] Fallback menus work if metafields missing

## Common Issues

| Issue | Solution |
|-------|----------|
| Menus not showing | Check metafield namespace is exactly `menu` |
| Wrong order | Verify `menu.order` values (1, 2, 3...) |
| Collections missing | Ensure `menu.category` and `menu.section` are set |
| Links broken | Check collection handles are correct |
| No fallback | Verify fallback configs in headerMenu.ts |

## File Locations

- **GraphQL Query:** `app/graphql/CollectionMenuQuery.ts`
- **Parser Logic:** `app/lib/collectionMenu.ts`
- **Fallback Configs:** `app/lib/headerMenu.ts`
- **Root Loader:** `app/root.tsx`
- **Header Component:** `app/components/layout/Header.tsx`
- **Page Layout:** `app/components/PageLayout.tsx`

## Support

For detailed instructions, see:
- `DYNAMIC-HEADER-MENU-GUIDE.md` - Complete implementation guide
- `DYNAMIC-HEADER-MENU-SIMPLE.md` - Collection metafields approach
- `DYNAMIC-HEADER-MENU-SETUP.md` - Metaobject approach
