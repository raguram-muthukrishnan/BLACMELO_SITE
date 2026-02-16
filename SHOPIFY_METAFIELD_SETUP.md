# Shopify Metafield Setup for Dynamic Header Menu

This guide explains how to configure metafields in your Shopify Admin to control the dynamic header menu structure.

## Overview

The header menu now supports three types of sections with nested collection support:
1. **Permanent Section** - Always visible, hardcoded links (Shop All, Best Seller, New Arrival)
2. **Common Section** - Mix of permanent and dynamic links from collections
3. **Category Section** - Dynamic links grouped by category (CLOTHING, ACCESSORIES, etc.)
4. **Nested Collections** - Parent collections can contain child collections (e.g., "Winter Arrivals" → "Sweaters", "Caps")

---

## Required Metafield Definitions

Navigate to **Shopify Admin → Settings → Custom Data → Collections** and add the following metafield definitions:

### 1. Menu Enabled
- **Namespace and key**: `custom.menu_enabled`
- **Name**: Menu Enabled
- **Type**: Single line text
- **Description**: Enable this collection in the header menu
- **Values**: `true`, `false`, `1`, `0`, `yes`, `no`

### 2. Menu Category
- **Namespace and key**: `custom.menu_category`
- **Name**: Menu Category
- **Type**: Single line text
- **Description**: Category grouping for the menu
- **Common values**: `featured`, `clothing`, `accessories`, `seasonal`

### 3. Menu Order
- **Namespace and key**: `custom.menu_order`
- **Name**: Menu Order
- **Type**: Single line text (or Integer if available)
- **Description**: Display order within the category (lower numbers appear first)
- **Values**: `1`, `2`, `3`, etc.

### 4. Menu Gender
- **Namespace and key**: `custom.menu_gender`
- **Name**: Menu Gender
- **Type**: Single line text
- **Description**: Filter collections by gender
- **Values**: `men`, `women`, `both`, `all`, or leave empty for universal

### 5. Menu Section Type (NEW)
- **Namespace and key**: `custom.menu_section_type`
- **Name**: Menu Section Type
- **Type**: Single line text
- **Description**: Determines how the collection is grouped
- **Values**: 
  - `common` - Appears in the common section (mixed permanent/dynamic)
  - `category` - Appears in a category section (default)

### 6. Menu Item Type (NEW)
- **Namespace and key**: `custom.menu_item_type`
- **Name**: Menu Item Type
- **Type**: Single line text
- **Description**: Styling and behavior of the item
- **Values**: 
  - `permanent` - Bold, 16px, 500 weight
  - `dynamic` - Normal, 12px, 400 weight (default)

### 7. Menu Display Style (NEW - OPTIONAL)
- **Namespace and key**: `custom.menu_display_style`
- **Name**: Menu Display Style
- **Type**: Single line text
- **Description**: Custom display style (for future use)
- **Values**: `bold`, `normal`, `title-with-items`

### 8. Menu Parent Collection (NEW)
- **Namespace and key**: `custom.menu_parent_collection`
- **Name**: Menu Parent Collection
- **Type**: Single line text
- **Description**: Handle of parent collection for nested items
- **Values**: The collection handle (e.g., `winter-arrivals`)
- **Usage**: Leave empty for top-level items, set to parent's handle for child items

---

## Configuration Examples

### Example 1: Regular Category Item
```
Collection: "T-Shirts"
- menu_enabled: true
- menu_category: clothing
- menu_order: 1
- menu_gender: men
- menu_section_type: category (or leave empty)
- menu_item_type: dynamic (or leave empty)
```
**Result**: Appears in Men's menu under CLOTHING category, first item, normal styling

---

### Example 2: Common Section Item (Permanent Style)
```
Collection: "Exclusive Drops"
- menu_enabled: true
- menu_section_type: common
- menu_order: 1
- menu_gender: both
- menu_item_type: permanent
```
**Result**: Appears in Common section for both Men and Women, bold styling like permanent links

---

### Example 3: Common Section Item (Dynamic Style)
```
Collection: "Summer Collection"
- menu_enabled: true
- menu_section_type: common
- menu_order: 2
- menu_gender: women
- menu_item_type: dynamic
```
**Result**: Appears in Women's Common section, second item, normal styling

---

### Example 4: Featured Category for Men Only
```
Collection: "Best of 2026"
- menu_enabled: true
- menu_category: featured
- menu_order: 1
- menu_gender: men
- menu_section_type: category
```
**Result**: Appears in Men's menu under FEATURED category

---

### Example 5: Parent Collection with Nested Children
```
Parent Collection: "Winter Arrivals"
- menu_enabled: true
- menu_category: seasonal
- menu_order: 1
- menu_gender: both
- menu_item_type: permanent (makes it bold like a header)

Child Collection: "Sweaters"
- menu_enabled: true
- menu_parent_collection: winter-arrivals
- menu_order: 1
- menu_gender: both

Child Collection: "Caps"
- menu_enabled: true
- menu_parent_collection: winter-arrivals
- menu_order: 2
- menu_gender: both
```
**Result**: 
```
SEASONAL
  Winter Arrivals › (bold, 16px, arrow indicator)
  
On hover over "Winter Arrivals":
  - Image fades out
  - Right panel shows:
      Sweaters
      Caps
```

---

### Example 6: Multi-Level Common Section
```
Parent Collection: "Featured Drops"
- menu_enabled: true
- menu_section_type: common
- menu_order: 1
- menu_gender: men
- menu_item_type: permanent

Child Collection: "Limited Edition"
- menu_enabled: true
- menu_parent_collection: featured-drops
- menu_order: 1

Child Collection: "Pre-Order"
- menu_enabled: true
- menu_parent_collection: featured-drops
- menu_order: 2
```
**Result**: Appears in Common section with nested children

---

## Menu Structure Flow

```
MEN'S MENU:
│
├─ PERMANENT SECTION (Hardcoded)
│  ├─ Shop All (40px top padding)
│  ├─ Best Seller
│  └─ New Arrival (15px bottom padding)
│
├─ COMMON SECTION (if any collections have menu_section_type: common)
│  ├─ [Collection with menu_item_type: permanent] › (bold, 16px, arrow if has children)
│  │  └─ [On hover: Children shown in right panel]
│  └─ [Collection with menu_item_type: dynamic] (normal, 12px)
│
├─ FEATURED (menu_category: featured)
│  ├─ [Parent Collection] › (can have menu_item_type: permanent for bold, arrow if has children)
│  │  └─ [On hover: Children shown in right panel]
│  └─ [Collections filtered by men gender]
│
├─ CLOTHING (menu_category: clothing)
│  └─ [Collections filtered by men gender]
│
├─ ACCESSORIES (menu_category: accessories)
│  └─ [Collections filtered by men gender]
│
└─ ... other categories

WOMEN'S MENU: (Same structure but filtered by women gender)

NESTED COLLECTION BEHAVIOR:
- Parent items show arrow (›) indicator
- Hovering parent item triggers right panel transition:
  1. Image fades out (300ms)
  2. Nested panel fades in (300ms)
  3. Panel shows parent name as header + child links
- Moving mouse away restores image view
```

---

## Step-by-Step Setup Guide

### Step 1: Create Metafield Definitions
1. Go to **Shopify Admin → Settings → Custom Data**
2. Click **Collections**
3. Click **Add definition** for each metafield listed above
4. Save each definition

### Step 2: Configure Your Collections
1. Go to **Shopify Admin → Products → Collections**
2. Open each collection you want in the menu
3. Scroll to **Metafields** section
4. Fill in the values according to your desired menu structure

### Step 3: Test the Menu
1. The menu will automatically update based on your metafield values
2. Men's menu shows collections with `menu_gender: men`, `both`, `all`, or empty
3. Women's menu shows collections with `menu_gender: women`, `both`, `all`, or empty

---

## Common Patterns

### Pattern 1: Simple Category Menu (Old Behavior)
Just use the basic metafields:
- `menu_enabled: true`
- `menu_category: clothing`
- `menu_order: 1`
- `menu_gender: men`

### Pattern 2: Mixed Common Section
Create a flexible common section with both permanent and dynamic items:
- Set `menu_section_type: common` for selected collections
- Use `menu_item_type: permanent` for important items (bold)
- Use `menu_item_type: dynamic` for regular items

### Pattern 3: Gender-Specific Content
- Men's exclusive: `menu_gender: men`
- Women's exclusive: `menu_gender: women`
- Appears in both: `menu_gender: both`

### Pattern 4: Nested Parent-Child Collections
Create hierarchical menu structures:
1. Create parent collection (no `menu_parent_collection`)
2. Create child collections with `menu_parent_collection: parent-handle`
3. Use `menu_item_type: permanent` on parent for bold header style
4. Children automatically inherit parent's section and category
5. Order children with `menu_order` (lower numbers first)

---

## Troubleshooting

**Collection not appearing?**
- Check `menu_enabled` is set to `true`, `1`, or `yes`
- Check `menu_gender` matches the menu you're viewing
- Check collection is published

**Wrong order?**
- Lower `menu_order` values appear first
- Order is applied within each category

**Item has wrong styling?**
- Check `menu_item_type` is set correctly
- `permanent` = bold, 16px, 500 weight
- `dynamic` = normal, 12px, 400 weight

**Category not showing?**
- Ensure at least one collection has that `menu_category` value
- Category names are case-insensitive
- Use predefined categories: `featured`, `clothing`, `accessories`, `seasonal`

**Child collection not appearing under parent?**
- Check `menu_parent_collection` exactly matches parent's handle
- Ensure parent collection exists and is enabled (`menu_enabled: true`)
- Parent must not have a `menu_parent_collection` value (only top-level items can be parents)
- Child collections still need `menu_enabled: true`

**Nested items showing in wrong order?**
- Children are sorted by `menu_order` within their parent
- Lower numbers appear first
- Set `menu_order: 1, 2, 3...` for desired sequence

---

## Quick Reference Table

| Metafield | Required | Default | Purpose |
|-----------|----------|---------|---------|
| menu_enabled | Yes | false | Enable/disable in menu |
| menu_category | No | uncategorized | Group items together |
| menu_order | No | 999 | Display order |
| menu_gender | No | all | Filter by gender |
| menu_section_type | No | category | Section grouping |
| menu_item_type | No | dynamic | Item styling |
| menu_display_style | No | - | Future use |
| menu_parent_collection | No | - | Parent collection handle for nesting |

---

## Notes

- **Permanent Section** (Shop All, Best Seller, New Arrival) is always shown first and cannot be modified via Shopify
- **Common Section** allows you to add custom items that appear between permanent and category sections
- **Nested Collections** enable hierarchical menu structures with hover-based navigation
- Parent items with children display an arrow (›) indicator on the right
- Hovering a parent item shows its children in the right panel (replaces image temporarily)
- Smooth fade transitions (300ms) between image and nested panel
- Parent collections can use `menu_item_type: permanent` to appear bold like section headers
- Child collections are displayed in the right panel with 14px font, 12px spacing
- Nested panel uses same padding structure as left menu (10px left, 30px right)
- Mobile menu still uses inline nested lists (desktop only uses panel approach)
- Changes to metafields are reflected immediately after page refresh
- Cache may need to be cleared in production environments

## Visual Styling Reference

### Font Sizes & Weights
- **Permanent Items**: 16px, 500 weight, 22px line-height (bold style)
- **Dynamic Items**: 12px, 400 weight, 18px line-height (normal style)
- **Nested Panel Items**: 14px, 400 weight (child collections in right panel)

### Section Padding
- **Permanent Section**: 40px top, 15px bottom
- **Common Section**: 20px top, 20px bottom
- **Category Section**: 20px top, 20px bottom

### Nesting Indicators & Behavior
- Parent items with children show arrow (›) on the right side
- Arrow is 18px, gray (#666), moves 2px right on hover
- Hovering parent item triggers right panel overlay
- Nested panel appears on white background matching left menu padding (10px left, 30px right)
- Fade transitions: 300ms opacity change
- Nested panel scrollable if content exceeds height
- Child items have 12px vertical spacing

