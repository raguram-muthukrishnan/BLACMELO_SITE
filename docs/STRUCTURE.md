# Hydrogen Storefront Structure

## Overview
This Hydrogen storefront follows a clean, organized architecture that separates concerns and makes the codebase easy to navigate and maintain.

## Directory Structure

```
hydrogen-storefront/
├── app/
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageLayout.tsx
│   │   └── ui/               # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── ProductCard.tsx
│   │       └── CollectionCard.tsx
│   │
│   ├── routes/               # Route handlers (React Router)
│   │   ├── ($locale)._index.tsx      → Home (/)
│   │   ├── ($locale).shop.tsx        → Shop listing (/shop)
│   │   ├── ($locale).collections.$handle.tsx  → Collection detail (/collections/:slug)
│   │   ├── ($locale).products.$handle.tsx     → Product detail (/products/:handle)
│   │   ├── ($locale).about.tsx       → About page (/about)
│   │   ├── ($locale).faq.tsx         → FAQ page (/faq)
│   │   └── ($locale).contact.tsx     → Contact page (/contact)
│   │
│   ├── data/                 # Mock data layer (for development)
│   │   ├── products.ts
│   │   ├── collections.ts
│   │   └── nav.ts
│   │
│   ├── styles/               # Global styles
│   │   ├── tailwind.css      → Main Tailwind config + custom styles
│   │   ├── app.css
│   │   └── reset.css
│   │
│   ├── lib/                  # Utilities and helpers
│   ├── graphql/              # GraphQL queries and fragments
│   ├── assets/               # Static assets
│   ├── entry.client.tsx      # Client entry point
│   ├── entry.server.tsx      # Server entry point
│   └── root.tsx              # Root component
│
├── public/                   # Public static files
├── package.json
├── vite.config.js
├── react-router.config.ts
└── tsconfig.json
```

## Component Organization

### Layout Components (`/components/layout/`)
- **Header.tsx** - Global navigation header
- **Footer.tsx** - Global footer with links
- **PageLayout.tsx** - Main layout wrapper that includes Header and Footer

### UI Components (`/components/ui/`)
- **Button.tsx** - Reusable button component with variants
- **ProductCard.tsx** - Product display card for listings
- **CollectionCard.tsx** - Collection display card

## Routes

All routes follow React Router 7 conventions with the `($locale)` prefix for internationalization support:

| Route | File | Description |
|-------|------|-------------|
| `/` | `($locale)._index.tsx` | Home page |
| `/shop` | `($locale).shop.tsx` | All products listing |
| `/collections/:slug` | `($locale).collections.$handle.tsx` | Collection detail page |
| `/products/:handle` | `($locale).products.$handle.tsx` | Product detail page |
| `/about` | `($locale).about.tsx` | About page |
| `/faq` | `($locale).faq.tsx` | FAQ page |
| `/contact` | `($locale).contact.tsx` | Contact page |

## Data Layer

The `/data` folder contains mock data for development:
- **products.ts** - Mock product data
- **collections.ts** - Mock collection data
- **nav.ts** - Mock navigation data

These will be replaced with real Shopify API calls via GraphQL queries.

## Styling

Using **Tailwind CSS v4** with custom theme tokens:
- Custom CSS variables for colors and spacing
- Utility classes for rapid development
- Component-specific styles in `tailwind.css`

## Key Features

✅ **Server-Side Rendering (SSR)** - Fast initial page loads
✅ **Type Safety** - Full TypeScript support
✅ **Optimized Images** - Using Shopify's Image component
✅ **SEO Ready** - Meta tags and proper HTML structure
✅ **Responsive Design** - Mobile-first approach
✅ **Progressive Enhancement** - Works without JavaScript

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Build for production**: `npm run build`
3. **Type checking**: `npm run typecheck`
4. **Linting**: `npm run lint`
5. **Code generation**: `npm run codegen`

## Next Steps

1. Connect to Shopify Storefront API
2. Implement real GraphQL queries
3. Add cart functionality
4. Implement search
5. Add customer authentication
6. Deploy to Oxygen
