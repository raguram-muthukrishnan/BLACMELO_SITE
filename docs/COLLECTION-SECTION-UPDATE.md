# Collection Section Update - Product Page

## Overview
Updated the collection sections on product pages to use the same ProductCard component as collection pages, display products in rows, and include a "Load More" button that loads 4 products at a time.

## Changes Made

### 1. New Component (`CollectionSection.tsx`)
Created a dedicated component for collection sections with:
- State management for visible product count
- Load More functionality (loads 4 products at a time)
- Uses ProductCard component for consistency
- Two action buttons: "Load More" and "View All"

### 2. Route Updates (`($locale).products.$handle.tsx`)
- Replaced inline product rendering with CollectionSection component
- Updated collection query to fetch 12 products (instead of 4)
- Added all necessary product data for ProductCard (variants, metafields, images)

### 3. GraphQL Query Updates
Enhanced COLLECTION_BY_HANDLE_QUERY to include:
- `products(first: 12)` - Fetch more products
- `maxVariantPrice` - For price range display
- `variants` with `selectedOptions` - For color/size info
- `metafields` - For proper color names
- Second image for hover effect

### 4. CSS Styles (`tailwind.css`)

#### Desktop Layout (> 1024px)
- **Padding**: 60px top/bottom, 80px left/right
- **Grid**: 4 columns
- **Gap**: 20px between cards
- **Title**: 1.5rem, centered, uppercase
- **Actions**: Centered with 20px gap

#### Tablet Layout (769px - 1024px)
- **Padding**: 50px top/bottom, 40px left/right
- **Grid**: 3 columns
- **Gap**: 16px between cards
- **Title**: 1.25rem

#### Mobile Layout (< 768px)
- **Padding**: 40px top/bottom, 20px left/right
- **Grid**: 2 columns
- **Gap**: 12px between cards
- **Title**: 1rem
- **Actions**: Stacked vertically, full-width buttons

## Features

✅ **Consistent Cards**: Uses same ProductCard as collection pages
✅ **Load More**: Loads 4 products at a time
✅ **Hover Effects**: Image swap on hover
✅ **Quick Add**: Plus icon for quick add to cart
✅ **Color Info**: Shows color name and count
✅ **Responsive Grid**: 4 cols → 3 cols → 2 cols
✅ **Two Actions**: Load More + View All buttons
✅ **Smart Loading**: Load More hides when all products shown

## Load More Logic

```typescript
const [visibleCount, setVisibleCount] = useState(4);

const handleLoadMore = () => {
  setVisibleCount(prev => Math.min(prev + 4, products.length));
};

const hasMore = visibleCount < products.length;
```

### Behavior:
1. Initially shows 4 products
2. Click "Load More" → Shows 8 products
3. Click again → Shows 12 products
4. "Load More" button disappears when all products visible
5. "View All" button always visible

## Visual Structure

### Desktop (4 columns)
```
┌─────────────────────────────────────────┐
│         COLLECTION TITLE                │
├──────────┬──────────┬──────────┬────────┤
│ Product1 │ Product2 │ Product3 │ Product4│
├──────────┼──────────┼──────────┼────────┤
│ Product5 │ Product6 │ Product7 │ Product8│
└──────────┴──────────┴──────────┴────────┘
│  [LOAD MORE]  [VIEW ALL COLLECTION]    │
└─────────────────────────────────────────┘
```

### Tablet (3 columns)
```
┌────────────────────────────────┐
│      COLLECTION TITLE          │
├─────────┬─────────┬───────────┤
│Product1 │Product2 │ Product3  │
├─────────┼─────────┼───────────┤
│Product4 │Product5 │ Product6  │
└─────────┴─────────┴───────────┘
│ [LOAD MORE] [VIEW ALL]        │
└────────────────────────────────┘
```

### Mobile (2 columns)
```
┌──────────────────┐
│  COLLECTION      │
├────────┬─────────┤
│Product1│Product2 │
├────────┼─────────┤
│Product3│Product4 │
└────────┴─────────┘
│  [LOAD MORE]     │
│  [VIEW ALL]      │
└──────────────────┘
```

## Button Styles

### Load More Button
- White background
- Black border and text
- Hover: Black background, white text
- Inline display

### View All Button
- Black background
- White text
- Hover: White background, black text
- Inline display

## ProductCard Features

Each card includes:
- Primary image (always visible)
- Secondary image (shows on hover)
- Product title
- Color name and count
- Price
- Quick add button (+ icon on hover)
- Size selector (appears on quick add hover)

## Benefits

1. **Consistency**: Same card design across site
2. **Better UX**: Load more instead of showing all at once
3. **Performance**: Loads 12 products but shows 4 initially
4. **Engagement**: Encourages interaction with Load More
5. **Flexibility**: Easy to adjust products per load
6. **Responsive**: Optimized for all screen sizes
7. **Rich Info**: Shows colors, variants, hover images

## Testing Recommendations

1. Test Load More button (should load 4 at a time)
2. Verify Load More disappears when all products shown
3. Test View All button navigation
4. Check hover effects on product cards
5. Test quick add functionality
6. Verify responsive grid (4 → 3 → 2 columns)
7. Test on desktop, tablet, mobile
8. Check with collections having < 4 products
9. Check with collections having > 12 products
10. Verify color names and counts display correctly

## Future Enhancements

### Infinite Scroll
Replace Load More with infinite scroll:
```typescript
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && hasMore) {
    handleLoadMore();
  }
});
```

### Pagination
Add page numbers instead of Load More:
```typescript
const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 4;
const startIndex = (currentPage - 1) * productsPerPage;
```

### Filter/Sort
Add filtering and sorting options:
```typescript
const [sortBy, setSortBy] = useState('featured');
const sortedProducts = sortProducts(products, sortBy);
```
