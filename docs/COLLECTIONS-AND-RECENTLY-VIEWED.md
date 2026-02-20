# Collections & Recently Viewed Implementation

## Overview
This implementation adds two key features to the homepage:
1. **Collection Tabs** - Displays products from multiple Shopify collections with tab navigation
2. **Recently Viewed** - Shows products the user has recently viewed, stored in browser localStorage

## Components

### 1. CollectionTabs Component
**Location:** `app/components/CollectionTabs.tsx`

Displays multiple collections with tab navigation. Users can switch between collections to see different products.

**Features:**
- Fetches collections from Shopify API
- Tab navigation between collections
- Shows 4 products per collection
- "View All" button links to full collection page

**Usage:**
```tsx
<CollectionTabs collections={collections} title="SHOP BY COLLECTION" />
```

### 2. RecentlyViewed Component
**Location:** `app/components/RecentlyViewed.tsx`

Displays products the user has recently viewed, pulled from browser localStorage.

**Features:**
- Client-side only (uses localStorage)
- Shows up to 4 most recent products
- Automatically hides if no products viewed
- Persists across sessions

**Usage:**
```tsx
<RecentlyViewed />
```

## Utilities

### Recently Viewed Manager
**Location:** `app/lib/recentlyViewed.ts`

Provides functions to manage recently viewed products in localStorage:

- `getRecentlyViewed()` - Get all recently viewed products
- `addToRecentlyViewed(product)` - Add a product to the list
- `clearRecentlyViewed()` - Clear all recently viewed products
- `getRecentlyViewedIds()` - Get product IDs for GraphQL queries

**Storage:**
- Key: `blacmelo_recently_viewed`
- Max items: 8 products
- Sorted by most recent first

## Implementation Details

### Homepage (_index.tsx)
The homepage now:
1. Fetches 4 specific collections by handle: `bestseller`, `new-in`, `bottoms`, `tops`
2. Gets the first 4 products from each collection
3. Displays collections with tab navigation
4. Shows recently viewed products from localStorage
5. Shows recommended products

**Collection Handles Required in Shopify:**
Make sure these collection handles exist in your Shopify store:
- `bestseller`
- `new-in`
- `bottoms`
- `tops`

### Product Page (products.$handle.tsx)
The product page now:
1. Tracks product views using `useEffect`
2. Saves product data to localStorage via `addToRecentlyViewed()`
3. Displays recently viewed products at the bottom

### GraphQL Query
The homepage fetches 4 specific collections by handle:
- **bestseller** - Best selling products
- **new-in** - New arrivals
- **bottoms** - Bottom wear (pants, jeans, etc.)
- **tops** - Top wear (shirts, t-shirts, etc.)

Each collection returns the first 4 available products.

```graphql
query CollectionByHandle($handle: String!) {
  collection(handle: $handle) {
    id
    title
    handle
    products(first: 4) {
      nodes {
        id
        title
        handle
        priceRange { ... }
        featuredImage { ... }
        images { ... }
      }
    }
  }
}
```

The query is executed in parallel for all 4 collections for optimal performance.

## Data Flow

### Collections
1. Homepage loader fetches collections from Shopify API
2. Collections passed to `CollectionTabs` component
3. User clicks tabs to switch between collections
4. Products displayed in grid layout

### Recently Viewed
1. User visits product page
2. `useEffect` hook triggers on mount
3. Product data saved to localStorage via `addToRecentlyViewed()`
4. `RecentlyViewed` component reads from localStorage on mount
5. Products displayed in grid layout

## Browser Storage

Recently viewed products are stored in localStorage as:
```json
[
  {
    "id": "gid://shopify/Product/123",
    "handle": "product-handle",
    "title": "Product Title",
    "price": {
      "amount": "99.99",
      "currencyCode": "USD"
    },
    "image": {
      "url": "https://...",
      "altText": "Product image"
    },
    "viewedAt": 1234567890
  }
]
```

## Styling

Both components use existing CSS classes from `app.css`:
- `.section-styled` - Section wrapper
- `.section-title` - Section heading
- `.tabs-header` - Tab navigation
- `.tab-btn` - Individual tab button
- `.product-grid` - Product grid layout
- `.product-card` - Individual product card

## Future Enhancements

Possible improvements:
1. Add collection filtering/sorting options
2. Implement infinite scroll for collections
3. Add "Clear Recently Viewed" button
4. Sync recently viewed across devices (requires backend)
5. Add analytics tracking for viewed products
6. Show view count or timestamps on recently viewed
