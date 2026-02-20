# Represent Collection Page Implementation

## Overview

This document describes the implementation of a high-performance, Represent Clo-inspired collection page for the BLACMELO Hydrogen storefront. The design features a premium aesthetic with smooth image transitions, sticky navigation, and optimized performance.

## Design Reference

- **Inspiration**: [Represent Clo Collections](https://row.representclo.com/collections/mens-new-arrivals-all)
- **Key Features**: 
  - Static hero banner (50vh)
  - Sticky filter/sort navigation
  - Grid layout with 1px gaps
  - Smooth image swap on hover (0.7s transition)
  - GSAP scroll-triggered animations
  - Lenis smooth scrolling integration

## Architecture

### Components

1. **RepresentCollectionPage** (`app/components/RepresentCollectionPage.tsx`)
   - Main collection page component
   - Handles layout, filtering UI, and pagination
   - Integrates GSAP ScrollTrigger for staggered product reveals

2. **RepresentProductCard** (internal to RepresentCollectionPage)
   - Individual product card with dual-image hover effect
   - Optimized image loading with Shopify's Image component
   - Smooth opacity transitions (0.7s ease-in-out)

### Routes

- **Primary Route**: `app/routes/($locale).collections.$handle.tsx`
  - Uses RepresentCollectionPage by default
  - Fetches collection data with image field
  
- **Alternative Route**: `app/routes/($locale).collections.$handle.represent.tsx`
  - Standalone Represent-style route (for testing/comparison)

### Utilities

- **Lenis Utilities** (`app/lib/lenis.ts`)
  - Global Lenis instance management
  - Scroll reset helpers for navigation transitions
  - Ensures smooth scroll-to-top when entering collection pages

## Technical Implementation

### 1. Hero Banner

```tsx
<header className="represent-hero">
  <img src={collection.image.url} className="represent-hero-image" />
  <div className="represent-hero-overlay">
    <h1 className="represent-hero-title">{collection.title}</h1>
  </div>
</header>
```

**Styling**:
- Height: `50vh` (fixed)
- Image: `object-fit: cover` with 80% opacity
- Title: Italic, bold, uppercase, responsive sizing (3rem → 8rem)

### 2. Sticky Navigation Bar

```tsx
<nav className="represent-filter-bar">
  <div className="represent-filter-left">
    <button>Filter</button>
    <span>{productCount} Products</span>
  </div>
  <div className="represent-filter-right">
    <button>Sort</button>
  </div>
</nav>
```

**Behavior**:
- `position: sticky; top: 0; z-index: 40`
- Stays visible during scroll
- Typography: 10px, uppercase, wide letter-spacing

### 3. Product Grid

**Grid Configuration**:
- Mobile: 2 columns
- Tablet (768px+): 3 columns
- Desktop (1024px+): 4 columns
- Gap: `1px` with `background: #e5e5e5` (creates grid lines)

**Grid Lines Technique**:
```css
.represent-product-grid {
  display: grid;
  gap: 1px;
  background: #e5e5e5; /* This creates the "lines" */
}

.represent-product-card {
  background: white; /* Cards have white background */
}
```

### 4. Image Swap on Hover

**HTML Structure**:
```tsx
<div className="represent-card-image-wrapper">
  <Image className="represent-card-image-primary" /> {/* opacity: 1 */}
  <Image className="represent-card-image-secondary" /> {/* opacity: 0 */}
</div>
```

**CSS Logic**:
```css
.represent-card-image {
  position: absolute;
  inset: 0;
  transition: opacity 0.7s ease-in-out;
}

.represent-product-card:hover .represent-card-image-primary {
  opacity: 0;
}

.represent-product-card:hover .represent-card-image-secondary {
  opacity: 1;
}
```

**Why This Works**:
- Both images are absolutely positioned in the same space
- Only opacity changes (no layout shifts)
- 0.7s duration creates a premium, smooth transition
- Hardware-accelerated (opacity is GPU-friendly)

### 5. GSAP Scroll Animations

```tsx
useEffect(() => {
  const cards = gridRef.current.querySelectorAll('.represent-product-card');
  
  gsap.fromTo(
    cards,
    {opacity: 0, y: 30},
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
      },
    }
  );

  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, [isClient, collection.products.nodes]);
```

**Animation Details**:
- Cards fade in from `y: 30px` to `y: 0`
- Stagger: 0.1s between each card
- Triggers when grid enters viewport (80% from top)
- Cleanup prevents memory leaks on unmount

### 6. Scroll Reset on Navigation

```tsx
// In RepresentCollectionPage
useEffect(() => {
  scrollToTop(true); // immediate: true
}, []);
```

**Purpose**:
- Prevents users from landing mid-page when navigating from homepage
- Uses Lenis instance if available, falls back to native scroll
- `immediate: true` ensures instant reset (no smooth scroll)

## GraphQL Query Updates

Added `image` field to collection query:

```graphql
collection(handle: $handle) {
  id
  handle
  title
  description
  image {
    url
    altText
  }
  products(first: $first, ...) {
    nodes {
      ...ProductItem
    }
  }
}
```

## Styling Guidelines

### Typography

- **Hero Title**: 3rem → 8rem (responsive), italic, bold, uppercase
- **Filter Bar**: 10px, uppercase, 0.15em letter-spacing
- **Product Title**: 11px, bold, uppercase, tight letter-spacing
- **Product Price**: 10px, medium weight, gray (#666)

### Colors

- **Background**: White (#ffffff)
- **Grid Lines**: Light gray (#e5e5e5)
- **Text Primary**: Black (#000000)
- **Text Secondary**: Gray (#666666)
- **Hover States**: 50% opacity

### Spacing

- **Hero**: 50vh height
- **Filter Bar**: 1rem vertical padding, 1.5rem horizontal
- **Card Info**: 1.5rem padding
- **Grid Gap**: 1px (creates lines)

## Performance Optimizations

1. **Image Loading**:
   - Primary image: `loading="lazy"`
   - Uses Shopify's Image component with responsive sizes
   - Sizes attribute: `(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw`

2. **GSAP Cleanup**:
   - ScrollTrigger instances killed on unmount
   - Prevents memory leaks and animation conflicts

3. **Client-Side Rendering**:
   - GSAP animations only run after `isClient` is true
   - Prevents SSR hydration mismatches

4. **Hardware Acceleration**:
   - Opacity transitions (GPU-accelerated)
   - `will-change: transform` on parallax elements

## Integration with Homepage

### Navigation Flow

1. User clicks "Shop Now" on homepage parallax
2. React Router navigates to `/collections/{handle}`
3. RepresentCollectionPage mounts
4. `scrollToTop(true)` executes immediately
5. GSAP animations trigger as user scrolls

### GSAP Cleanup

The HeroParallax component already includes proper cleanup:

```tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // ... animations
  }, containerRef);

  return () => ctx.revert(); // Cleans up all animations
}, []);
```

## Usage

### Accessing the Collection Page

1. **Default Route**: `/collections/{handle}`
   - Example: `/collections/fall-winter-25`
   - Uses RepresentCollectionPage automatically

2. **Direct Links**: Update homepage parallax links
   ```tsx
   <Link to={`/collections/${collection.handle}`}>
     {collection.name}
   </Link>
   ```

### Switching Between Styles

To revert to the original CollectionPage:

```tsx
// In app/routes/($locale).collections.$handle.tsx
import {CollectionPage} from '~/components/CollectionPage';
// import {RepresentCollectionPage} from '~/components/RepresentCollectionPage';

export default function Collection() {
  return <CollectionPage collection={collection} />;
}
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **CSS Grid**: IE11+ (with autoprefixer)
- **GSAP**: All browsers
- **Lenis**: Modern browsers with smooth scrolling support

## Future Enhancements

1. **Filter Functionality**:
   - Implement side drawer for mobile filters
   - Add price range, color, size filters
   - URL parameter persistence

2. **Sort Options**:
   - Price: Low to High / High to Low
   - Newest / Best Selling
   - A-Z / Z-A

3. **Quick Add to Cart**:
   - Size selector on hover
   - Direct add-to-cart without page navigation

4. **Infinite Scroll**:
   - Replace "Load More" button with automatic loading
   - Intersection Observer API

5. **Image Optimization**:
   - WebP format with fallbacks
   - Blur-up placeholder technique
   - Progressive image loading

## Testing Checklist

- [ ] Hero banner displays correctly on all screen sizes
- [ ] Filter bar stays sticky during scroll
- [ ] Grid layout responds correctly (2/3/4 columns)
- [ ] Image swap transitions smoothly on hover
- [ ] GSAP animations trigger at correct scroll position
- [ ] Scroll resets to top when navigating from homepage
- [ ] Pagination works correctly
- [ ] No console errors or warnings
- [ ] Performance: Lighthouse score > 90
- [ ] Accessibility: Proper alt text, keyboard navigation

## Troubleshooting

### Images Not Swapping

- Verify both images exist in `product.images.nodes`
- Check CSS specificity for hover states
- Ensure `group` class is on parent element

### GSAP Animations Not Triggering

- Confirm `isClient` state is true
- Check ScrollTrigger registration
- Verify `gridRef` is attached to correct element

### Scroll Not Resetting

- Ensure Lenis instance is initialized
- Check `scrollToTop` is called in useEffect
- Verify no conflicting scroll behavior

### Grid Lines Not Showing

- Confirm `gap: 1px` and `background: #e5e5e5` on grid
- Ensure cards have `background: white`
- Check for conflicting CSS

## Related Documentation

- [FLOATING-MENU-PARALLAX.md](./FLOATING-MENU-PARALLAX.md) - Homepage parallax implementation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall project structure
- [DESIGN-CONSISTENCY-FIX.md](./DESIGN-CONSISTENCY-FIX.md) - Design system guidelines
