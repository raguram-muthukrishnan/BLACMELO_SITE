# Mobile Menu Structure

## Overview
The mobile menu uses the same dynamic menu configuration as the desktop hover menu, ensuring consistency across devices. The menu is organized using Shopify collection metafields.

## Menu Structure

### Section Types

1. **Common Section** (`sectionType: 'common'`)
   - No section title/label
   - Mixed item types (permanent and dynamic)
   - Appears at the top of the menu
   - Example: "New Arrivals", "Bestsellers", "Shop All"

2. **Category Section** (`sectionType: 'category'`)
   - Has a section title (e.g., "FEATURED", "SHOP", "CLOTHING")
   - Contains dynamic items from Shopify collections
   - Supports expandable items with nested children
   - Items can have + icon for expansion

### Item Types

1. **Permanent Items** (`itemType: 'permanent'`)
   - Bold font weight (600)
   - Slightly larger font size (15px)
   - Used for key navigation items
   - Example: "Shop All Mens", "New Arrivals"

2. **Dynamic Items** (`itemType: 'dynamic'`)
   - Normal font weight (400)
   - Standard font size (14px)
   - Populated from Shopify collections
   - Can have nested children

### Nested Items

Items can have children that appear when the parent is expanded:
- Parent item shows + icon on the right
- Clicking + icon expands to show children
- + icon rotates 45° to become × when expanded
- Children are indented and styled differently (13px, gray color)

## Implementation

### Data Flow

1. **Root Loader** (`root.tsx`)
   - Fetches collections with `DYNAMIC_HEADER_MENU_QUERY`
   - Parses data with `parseDynamicHeaderMenu(data, image, 'men')`
   - Passes `menMenuConfig` to PageLayout

2. **PageLayout** (`PageLayout.tsx`)
   - Receives `menMenuConfig` prop
   - Passes to `MobileMenuAside` component
   - Renders sections based on `sectionType`

3. **Mobile Menu Component** (`MobileMenuAside`)
   - Maps through `menMenuConfig.sections`
   - Renders common sections without labels
   - Renders category sections with labels and expandable items
   - Manages expansion state with React hooks

### Shopify Metafields

Collections need these metafields for menu organization:

- `menu_enabled`: "true" to include in menu
- `menu_category`: Category grouping (e.g., "featured", "shop", "clothing")
- `menu_section_type`: "common" or "category"
- `menu_item_type`: "permanent" or "dynamic"
- `menu_order`: Number for sorting (lower = higher in list)
- `menu_gender`: "men", "women", "both", or "all"
- `menu_parent_collection`: Handle of parent collection (for nested items)

## Visual Design

### REPRESENT-Style Organization

```
┌─────────────────────────────┐
│ MENU                    [×] │ ← Header
├─────────────────────────────┤
│                             │
│ New Arrivals                │ ← Common section (bold)
│ Bestsellers                 │   (no label)
│ Shop All                    │
│                             │
│ FEATURED                    │ ← Category section
│ Fall Winter '25             │   (with label)
│ Owners Club                 │
│ 247                         │
│                             │
│ SHOP                        │ ← Category section
│ Clothing                [+] │   (expandable)
│   ├─ T-Shirts               │   (nested when expanded)
│   ├─ Hoodies                │
│   └─ Jackets                │
│ Footwear                [+] │
│ Accessories             [+] │
│                             │
├─────────────────────────────┤ ← Divider
│ EXPLORE                     │ ← Static section
│ The Prestige                │
│ The Vault                   │
│ Gift Card                   │
│                             │
│ ACCOUNT                     │ ← Static section
│ My Account                  │
│ Wishlist                    │
└─────────────────────────────┘
```

## CSS Classes

- `.mobile-menu-content` - Main container
- `.mobile-menu-section` - Section wrapper
- `.mobile-menu-section.common-section` - Common section (no label)
- `.mobile-menu-section.category-section` - Category section (with label)
- `.mobile-menu-section-title` - Section label (uppercase, gray)
- `.mobile-menu-list` - List of items
- `.mobile-menu-item` - Individual menu item
- `.mobile-menu-item.permanent-item` - Bold permanent items
- `.mobile-menu-item-wrapper` - Wrapper for item + expand button
- `.mobile-menu-expand-btn` - + icon button
- `.expand-icon.expanded` - Rotated × icon
- `.mobile-menu-nested-list` - Nested children list
- `.mobile-menu-item.nested-item` - Nested child items
- `.mobile-menu-divider` - Section divider line

## Features

✅ Dynamic data from Shopify collections
✅ Section type organization (common vs category)
✅ Item type styling (permanent vs dynamic)
✅ Expandable items with + icons
✅ Nested children support
✅ Smooth animations
✅ Consistent with desktop menu structure
✅ Static sections (Explore, Account)
✅ Proper scrolling behavior
