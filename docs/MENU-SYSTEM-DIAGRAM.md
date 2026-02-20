# Dynamic Header Menu System - Visual Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SHOPIFY ADMIN                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Collections with Metafields:                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Collection: "New Arrivals"                                │  │
│  │ • menu.category: "man"                                    │  │
│  │ • menu.section: "top"                                     │  │
│  │ • menu.order: 1                                           │  │
│  │ • menu.is_bold: true                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Collection: "Fall Winter 25"                              │  │
│  │ • menu.category: "man"                                    │  │
│  │ • menu.section: "featured"                                │  │
│  │ • menu.order: 1                                           │  │
│  │ • menu.is_bold: false                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ GraphQL Query
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HYDROGEN STOREFRONT                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  app/root.tsx (loadCriticalData)                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Query collections with metafields                      │  │
│  │ 2. Parse data using parseCollectionMenus()                │  │
│  │ 3. Return menuConfigs or null                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  app/components/PageLayout.tsx                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pass menuConfigs to Header component                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  app/components/layout/Header.tsx                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Use menuConfigs or fallback to hardcoded menus            │  │
│  │ Pass to UnifiedHoverMenu component                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  app/components/ui/UnifiedHoverMenu.tsx                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Render menu sections and items                            │  │
│  │ Display on hover                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Header with Dynamic Menus:                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [Man] [Women] [Blacmelo+]    LOGO    [About] [Contact]  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Hover Menu (Man):                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  New Arrivals (bold)          ┌──────────────────────┐   │  │
│  │  Bestsellers (bold)            │                      │   │  │
│  │  Shop All (bold)               │   Menu Image         │   │  │
│  │                                │                      │   │  │
│  │  FEATURED                      │                      │   │  │
│  │  • Fall Winter '25             └──────────────────────┘   │  │
│  │  • Owners Club                                            │  │
│  │                                                            │  │
│  │  SHOP                                                      │  │
│  │  • Clothing                                                │  │
│  │  • Footwear                                                │  │
│  │  • Accessories                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Shopify Collections
        │
        │ (with metafields)
        ▼
CollectionMenuQuery.ts
        │
        │ (GraphQL query)
        ▼
root.tsx (loader)
        │
        │ (fetch data)
        ▼
collectionMenu.ts
        │
        │ (parse & group)
        ▼
MenuConfigs Object
        │
        │ {
        │   man: { sections: [...], image: "..." },
        │   women: { sections: [...], image: "..." },
        │   blacmelo: { sections: [...], image: "..." }
        │ }
        ▼
PageLayout.tsx
        │
        │ (pass as prop)
        ▼
Header.tsx
        │
        │ (use or fallback)
        ▼
UnifiedHoverMenu.tsx
        │
        │ (render)
        ▼
User sees dynamic menu
```

## Menu Structure

```
MenuConfigs
├── man
│   ├── sections
│   │   ├── Section 1 (top)
│   │   │   ├── New Arrivals (bold)
│   │   │   ├── Bestsellers (bold)
│   │   │   └── Shop All (bold)
│   │   ├── Section 2 (featured)
│   │   │   ├── Fall Winter '25
│   │   │   ├── Owners Club
│   │   │   └── 247
│   │   └── Section 3 (shop)
│   │       ├── Clothing
│   │       ├── Footwear
│   │       └── Accessories
│   └── image: "menu_man.jpeg"
│
├── women
│   ├── sections
│   │   └── (similar structure)
│   └── image: "menu_woman.jpeg"
│
└── blacmelo
    ├── sections
    │   └── (similar structure)
    └── image: "menu_man.jpeg"
```

## Collection Metafield Mapping

```
Collection in Shopify
┌─────────────────────────────────────┐
│ Title: "New Arrivals"                │
│ Handle: new-arrivals                 │
│                                      │
│ Metafields:                          │
│ ┌─────────────────────────────────┐ │
│ │ menu.category → "man"            │ │ ───┐
│ │ menu.section  → "top"            │ │    │
│ │ menu.order    → 1                │ │    │
│ │ menu.is_bold  → true             │ │    │
│ └─────────────────────────────────┘ │    │
└─────────────────────────────────────┘    │
                                            │
                                            ▼
                                    Grouped by category
                                            │
                                            ▼
                                    man → top → [
                                      {
                                        name: "New Arrivals",
                                        link: "/collections/new-arrivals"
                                      }
                                    ]
                                            │
                                            ▼
                                    Sorted by order
                                            │
                                            ▼
                                    Built into MenuSection
                                            │
                                            ▼
                                    Rendered in menu
```

## Fallback System

```
┌─────────────────────────────────────┐
│ Try to fetch collection menu data   │
└─────────────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ Data exists?  │
        └───────────────┘
         │           │
      Yes│           │No
         │           │
         ▼           ▼
┌──────────────┐  ┌──────────────────────┐
│ Parse data   │  │ Use fallback configs │
│ into configs │  │ from headerMenu.ts   │
└──────────────┘  └──────────────────────┘
         │                    │
         └────────┬───────────┘
                  ▼
        ┌──────────────────┐
        │ Pass to Header   │
        └──────────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │ Render menu      │
        └──────────────────┘
```

## Section Types

```
Section Key    Label         Position    Bold    Submenu
─────────────────────────────────────────────────────────
top            (none)        Top         Yes     No
featured       FEATURED      Middle      No      No
shop           SHOP          Middle      No      Yes
exclusive      EXCLUSIVE     Middle      No      No
collections    COLLECTIONS   Middle      No      No
```

## File Dependencies

```
root.tsx
├── imports CollectionMenuQuery.ts
├── imports collectionMenu.ts
├── imports headerMenu.ts (fallback)
└── passes data to PageLayout.tsx
                │
                └── passes to Header.tsx
                            │
                            └── passes to UnifiedHoverMenu.tsx
```

## Query Flow

```
Page Load
    │
    ▼
root.tsx loader
    │
    ├─► Query HEADER_QUERY (existing)
    │
    └─► Query COLLECTION_MENU_QUERY (new)
            │
            ├─► Fetch all collections
            │
            ├─► Include metafields:
            │   • menu.category
            │   • menu.section
            │   • menu.order
            │   • menu.is_bold
            │   • menu.label
            │
            └─► Return collection data
                    │
                    ▼
            parseCollectionMenus()
                    │
                    ├─► Group by category
                    ├─► Group by section
                    ├─► Sort by order
                    └─► Build MenuConfigs
                            │
                            ▼
                    Return to loader
                            │
                            ▼
                    Pass to components
```

This visual representation should help you understand how the entire system works together!
