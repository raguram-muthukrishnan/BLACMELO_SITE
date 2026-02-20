# New Header Structure Diagram

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BLACMELO HEADER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  [☰] Shop  Blacmelo Club    [LOGO]    About  Contact  FAQ  [👤]    │
│       ↓         ↓                                                     │
│       └─────────┴─── Same Dynamic Menu                               │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Header Sections

### Left Navigation (Simplified)
```
┌──────────────────────┐
│ [☰] Mobile Menu      │  ← Mobile only
│                      │
│ Shop                 │  ← Hover shows menu
│ Blacmelo Club        │  ← Hover shows menu
└──────────────────────┘
```

### Center
```
┌──────────────────────┐
│   [BLACMELO LOGO]    │  ← Links to home
└──────────────────────┘
```

### Right Navigation (Unchanged)
```
┌──────────────────────┐
│ About us             │
│ Contact us           │
│ FAQ                  │
│ [👤] Account         │
└──────────────────────┘
```

## Dynamic Hover Menu Structure

### When hovering "Shop" or "Blacmelo Club":

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DYNAMIC HOVER MENU                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────┐  ┌─────────────────────────┐  │
│  │  PERMANENT SECTIONS             │  │                         │  │
│  │  (Always visible)               │  │    [Menu Image]         │  │
│  │                                 │  │                         │  │
│  │  • Shop All                     │  │                         │  │
│  │  • Best Seller                  │  │                         │  │
│  │  • New Arrival                  │  │                         │  │
│  │                                 │  │                         │  │
│  │  DYNAMIC SECTIONS               │  │                         │  │
│  │  (From Shopify Collections)     │  │                         │  │
│  │                                 │  │                         │  │
│  │  • Summer Collection            │  │                         │  │
│  │  • Hoodies                      │  │                         │  │
│  │  • T-Shirts                     │  │                         │  │
│  │  • Accessories                  │  │                         │  │
│  │  • ...more collections          │  │                         │  │
│  └─────────────────────────────────┘  └─────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SHOPIFY ADMIN                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Collections                                                          │
│  ├─ Summer Collection                                                │
│  │  ├─ custom.menu_enabled: true                                    │
│  │  ├─ custom.menu_order: 1                                         │
│  │  └─ custom.menu_category: seasonal                               │
│  │                                                                    │
│  ├─ Hoodies                                                          │
│  │  ├─ custom.menu_enabled: true                                    │
│  │  ├─ custom.menu_order: 2                                         │
│  │  └─ custom.menu_category: featured                               │
│  │                                                                    │
│  └─ T-Shirts                                                         │
│     ├─ custom.menu_enabled: true                                    │
│     ├─ custom.menu_order: 3                                         │
│     └─ custom.menu_category: featured                               │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ GraphQL Query
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    HYDROGEN STOREFRONT                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  root.tsx (loader)                                                   │
│  ├─ Fetch collections with DYNAMIC_HEADER_MENU_QUERY                │
│  ├─ Parse with parseDynamicHeaderMenu()                             │
│  └─ Return dynamicMenuConfig                                         │
│                                                                       │
│                          ↓                                            │
│                                                                       │
│  PageLayout.tsx                                                      │
│  └─ Pass dynamicMenuConfig to Header                                 │
│                                                                       │
│                          ↓                                            │
│                                                                       │
│  Header.tsx                                                          │
│  ├─ Render "Shop" and "Blacmelo Club" links                         │
│  ├─ Handle hover state                                               │
│  └─ Show DynamicHoverMenu when active                                │
│                                                                       │
│                          ↓                                            │
│                                                                       │
│  DynamicHoverMenu.tsx                                                │
│  ├─ Render permanent sections (Shop All, Best Seller, New Arrival)  │
│  ├─ Render dynamic sections from collections                         │
│  └─ Display menu image                                               │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Menu Configuration Object

```typescript
{
  sections: [
    // Permanent sections (always present)
    {
      label: 'Shop All',
      link: '/collections/all',
      items: [],
      isPermanent: true
    },
    {
      label: 'Best Seller',
      link: '/collections/best-seller',
      items: [],
      isPermanent: true
    },
    {
      label: 'New Arrival',
      link: '/collections/new-arrival',
      items: [],
      isPermanent: true
    },
    
    // Dynamic sections (from Shopify collections)
    {
      label: 'Summer Collection',
      link: '/collections/summer-collection',
      items: [],
      isPermanent: false
    },
    {
      label: 'Hoodies',
      link: '/collections/hoodies',
      items: [],
      isPermanent: false
    },
    // ... more dynamic sections
  ],
  image: '/assets/menu/menu_man.jpeg'
}
```

## Comparison: Old vs New

### Old Header (Before)
```
Left:  Man | Women | Blacmelo +
       ↓     ↓       ↓
     Menu1  Menu2   Menu3
     (separate menus with complex structure)
```

### New Header (After)
```
Left:  Shop | Blacmelo Club
       ↓           ↓
       └───────────┴─── Same Dynamic Menu
                        (3 permanent + dynamic from Shopify)
```

## Benefits of New Structure

### 1. Simplified Navigation
- Only 2 main categories instead of 3
- Clearer user intent (Shop vs Club)
- Less cognitive load

### 2. Dynamic Content
- Menu updates automatically with collections
- No code changes needed for new items
- Managed entirely in Shopify admin

### 3. Consistent Experience
- Same menu for both Shop and Blacmelo Club
- Unified navigation pattern
- Easier to maintain

### 4. Scalability
- Easy to add new collections
- Order control via metafields
- Future-proof for expansion

## Mobile Behavior

```
┌─────────────────────┐
│  [☰]  [LOGO]  [👤] │  ← Header
└─────────────────────┘
         │
         │ Click [☰]
         ↓
┌─────────────────────┐
│   MOBILE MENU       │
│                     │
│   Shop              │
│   Blacmelo Club     │
│   ─────────────     │
│   About us          │
│   Contact us        │
│   FAQ               │
└─────────────────────┘
```

## Responsive Breakpoints

```
Desktop (> 768px):
├─ Show all header links
├─ Hover menus enabled
└─ Hide mobile menu button

Mobile (≤ 768px):
├─ Show only logo and icons
├─ Show mobile menu button
└─ Disable hover menus
```

## CSS Classes (Unchanged)

All existing CSS classes are preserved:
- `.blacmelo-header`
- `.blacmelo-header-container`
- `.blacmelo-header-left`
- `.blacmelo-header-right`
- `.blacmelo-header-logo`
- `.blacmelo-header-link`
- `.blacmelo-hover-menu-container`
- `.blacmelo-hover-menu-content`
- `.blacmelo-hover-menu-sections`
- `.blacmelo-hover-menu-image-container`

## Future Enhancement Ideas

### 1. Separate Menus
```
Shop → Shows product collections
Blacmelo Club → Shows club-specific content
```

### 2. Submenu Support
```
Shop
├─ Shop All
├─ Best Seller
├─ New Arrival
└─ Categories
    ├─ Hoodies
    ├─ T-Shirts
    └─ Accessories
```

### 3. Featured Items
```
Menu with product previews:
├─ Collection Name
│  ├─ Product 1 (with image)
│  ├─ Product 2 (with image)
│  └─ View All →
```

### 4. Seasonal Banners
```
Menu with promotional banner:
├─ [SUMMER SALE - 50% OFF]
├─ Shop All
├─ Best Seller
└─ ...
```
