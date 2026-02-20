# Hydrogen Storefront Architecture

## Frontend Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     HYDROGEN FRONTEND                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         ROUTES                               │
├─────────────────────────────────────────────────────────────┤
│  /                    → Home (index)                         │
│  /shop                → Shop listing (all products)          │
│  /collections/:slug   → Collection detail page               │
│  /products/:handle    → Product detail page                  │
│  /about               → About page                           │
│  /faq                 → FAQ page                             │
│  /contact             → Contact page                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    LAYOUT & UI LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Layout Components:                                          │
│    • PageLayout    → Wraps all pages                         │
│    • Header        → Global navigation                       │
│    • Footer        → Global footer                           │
│                                                              │
│  UI Components:                                              │
│    • Button        → Reusable button                         │
│    • ProductCard   → Product display card                    │
│    • CollectionCard → Collection display card                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  Mock Data (Development):                                    │
│    • products.ts    → Mock product data                      │
│    • collections.ts → Mock collection data                   │
│    • nav.ts         → Mock navigation data                   │
│                                                              │
│  Future: GraphQL Queries to Shopify Storefront API          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    STYLING LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  • Tailwind CSS v4                                           │
│  • Custom theme tokens (colors, spacing)                     │
│  • Component-specific styles                                 │
│  • Utility classes                                           │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
PageLayout
├── Header
│   ├── Logo/Brand
│   ├── Navigation Menu
│   └── Actions (Search, Cart, Account)
│
├── Main Content (children)
│   └── Route-specific content
│       ├── Home
│       ├── Shop (ProductCard grid)
│       ├── Collections (CollectionCard grid)
│       ├── Product Detail
│       ├── About
│       ├── FAQ
│       └── Contact (Form with Button)
│
└── Footer
    ├── Footer Menu
    └── Copyright
```

## Data Flow

```
User Request
     ↓
React Router (Route Handler)
     ↓
Loader Function (Server-side)
     ↓
Data Fetching (GraphQL/Mock)
     ↓
Component Rendering (SSR)
     ↓
HTML Response to Browser
     ↓
Client Hydration
     ↓
Interactive UI
```

## File Organization Pattern

```
/app
  /components
    /layout          → Page structure components
    /ui              → Reusable UI components
  /routes            → Route handlers (pages)
  /data              → Mock data / data utilities
  /styles            → Global styles
  /lib               → Utilities and helpers
  /graphql           → GraphQL queries
  /assets            → Static assets
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Router 7 |
| UI Library | React 18 |
| Styling | Tailwind CSS v4 |
| Type Safety | TypeScript |
| API | Shopify Storefront API (GraphQL) |
| Build Tool | Vite |
| Hosting | Oxygen (Shopify) |

## Key Principles

1. **Separation of Concerns** - Layout, UI, Routes, and Data are separated
2. **Component Reusability** - UI components are generic and reusable
3. **Type Safety** - Full TypeScript coverage
4. **Server-First** - SSR for performance and SEO
5. **Progressive Enhancement** - Works without JavaScript
6. **Scalability** - Easy to add new routes and components

## Development Guidelines

### Adding a New Route
1. Create file in `/app/routes/($locale).routename.tsx`
2. Export `loader` function for data fetching
3. Export `meta` function for SEO
4. Export default component for UI

### Adding a New Component
1. Create file in `/app/components/ui/ComponentName.tsx`
2. Define TypeScript types for props
3. Export component
4. Add to `/app/components/ui/index.ts`

### Adding Mock Data
1. Create or update file in `/app/data/`
2. Export data structure
3. Import in route loader

## Backend Integration (Future)

The current structure is frontend-only with mock data. To integrate with Shopify:

1. Replace mock data with GraphQL queries
2. Use Shopify Storefront API
3. Implement cart mutations
4. Add customer authentication
5. Connect to Shopify Admin for content management
