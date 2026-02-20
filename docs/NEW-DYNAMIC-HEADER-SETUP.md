# New Dynamic Header Menu Setup Guide

## Overview

The new header implementation features:
- **Simplified Header Left**: Only "Shop" and "Blacmelo Club" menu items
- **Unchanged Header Right**: About us, Contact us, FAQ, and Account icon
- **Dynamic Hover Menu**: Automatically populated from Shopify collections
  - 3 Permanent sections: Shop All, Best Seller, New Arrival
  - Dynamic sections based on collections you create in Shopify

## Architecture

### Components
1. **Header.tsx** - Main header component with simplified left navigation
2. **DynamicHoverMenu.tsx** - Hover menu that displays collection-based sections
3. **dynamicHeaderMenu.ts** - Utility functions for parsing collection data
4. **DynamicHeaderMenuQuery.ts** - GraphQL query to fetch collections

### Data Flow
```
Shopify Collections (with metafields)
  ↓
GraphQL Query (DynamicHeaderMenuQuery)
  ↓
root.tsx loader (parseDynamicHeaderMenu)
  ↓
PageLayout → Header → DynamicHoverMenu
```

## Shopify Setup

### Step 1: Create Metafield Definitions

Go to **Shopify Admin → Settings → Custom Data → Collections**

Create these metafield definitions:

#### 1. Menu Enabled
- **Namespace and key**: `custom.menu_enabled`
- **Name**: Menu Enabled
- **Type**: True or false
- **Description**: Enable this collection in the header menu

#### 2. Menu Category
- **Namespace and key**: `custom.menu_category`
- **Name**: Menu Category
- **Type**: Single line text
- **Description**: Category for grouping (optional, for future use)

#### 3. Menu Order
- **Namespace and key**: `custom.menu_order`
- **Name**: Menu Order
- **Type**: Integer
- **Description**: Order in menu (lower numbers appear first)

### Step 2: Configure Collections

For each collection you want in the menu:

1. Go to **Products → Collections**
2. Select or create a collection
3. Scroll to **Metafields** section
4. Set the metafields:
   - **Menu Enabled**: ✓ (checked)
   - **Menu Order**: Enter a number (e.g., 1, 2, 3...)
   - **Menu Category**: (optional) e.g., "featured", "seasonal"

### Step 3: Create Required Collections

Make sure these collections exist (they're permanent in the menu):
- **all** - Shop All collection
- **best-seller** - Best Seller collection
- **new-arrival** - New Arrival collection

## Menu Structure

### Permanent Sections (Always Visible)
1. Shop All → `/collections/all`
2. Best Seller → `/collections/best-seller`
3. New Arrival → `/collections/new-arrival`

### Dynamic Sections (From Shopify)
Any collection with `menu_enabled = true` will appear after the permanent sections, sorted by `menu_order`.

## Example Configuration

### Collection: "Summer Collection"
- **Handle**: `summer-collection`
- **Menu Enabled**: ✓
- **Menu Order**: 1
- **Result**: Appears as 4th item in menu (after 3 permanent sections)

### Collection: "Winter Sale"
- **Handle**: `winter-sale`
- **Menu Enabled**: ✓
- **Menu Order**: 2
- **Result**: Appears as 5th item in menu

## Comparison: Metafields vs Shopify Menus

### Metafields Approach (Current Implementation) ✅

**Pros:**
- Direct control over menu structure
- No need to create separate menu in Shopify admin
- Easier to manage programmatically
- Collection data and menu config in one place
- Better for dynamic, collection-driven menus

**Cons:**
- Requires metafield setup
- Less visual in Shopify admin

### Shopify Menus Approach

**Pros:**
- Visual drag-and-drop interface
- Built-in Shopify feature
- Can include non-collection links

**Cons:**
- Requires manual menu creation
- Less flexible for dynamic content
- Harder to sync with collection changes
- Need to maintain separate menu structure

**Recommendation**: The metafields approach is better for this use case because:
1. Menu is entirely collection-based
2. Automatic updates when collections change
3. Simpler data flow
4. Less maintenance overhead

## Testing

### 1. Check Data Loading
Look for console logs in browser:
```
📊 Found X collections enabled for menu
✅ Built dynamic menu with Y sections (3 permanent + Z dynamic)
```

### 2. Verify Menu Display
- Hover over "Shop" → Menu should appear
- Hover over "Blacmelo Club" → Same menu should appear
- Menu should show 3 permanent sections + your dynamic sections

### 3. Test Collection Links
Click each menu item to verify it navigates to the correct collection page.

## Troubleshooting

### Menu shows only 3 sections
- Check that collections have `menu_enabled = true`
- Verify metafield namespace is `custom` not `menu`
- Check browser console for errors

### Collections not appearing in order
- Verify `menu_order` values are set correctly
- Lower numbers appear first

### Menu not appearing on hover
- Check CSS classes are intact
- Verify `DynamicHoverMenu` component is rendering
- Check browser console for React errors

## Future Enhancements

### Option 1: Separate Menus for Shop vs Blacmelo Club
Add a `menu_target` metafield to specify which menu item shows the collection:
- `shop` - Appears under "Shop"
- `blacmelo-club` - Appears under "Blacmelo Club"
- `both` - Appears under both

### Option 2: Submenu Support
Add nested items under each collection section by creating a `parent_collection` metafield.

### Option 3: Menu Images
Add collection-specific images to the hover menu by using the collection's featured image or a dedicated metafield.

## Code Files

### New Files Created
- `app/graphql/DynamicHeaderMenuQuery.ts` - GraphQL query
- `app/lib/dynamicHeaderMenu.ts` - Parsing logic
- `app/components/ui/DynamicHoverMenu.tsx` - Menu component

### Modified Files
- `app/root.tsx` - Loads dynamic menu data
- `app/components/PageLayout.tsx` - Passes menu config to header
- `app/components/layout/Header.tsx` - Simplified header with new menu

### Unchanged
- All CSS files remain untouched
- Header right navigation unchanged
- Mobile menu unchanged
