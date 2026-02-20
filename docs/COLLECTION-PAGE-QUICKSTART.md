# Collection Page Quick Start Guide

## What Was Implemented

A premium Represent Clo-inspired collection page with:
- ✅ Static hero banner (50vh)
- ✅ Sticky filter/sort navigation
- ✅ 4-column responsive grid (2 mobile, 3 tablet, 4 desktop)
- ✅ Smooth image swap on hover (0.7s transition)
- ✅ GSAP scroll-triggered staggered animations
- ✅ Lenis smooth scroll integration
- ✅ Automatic scroll reset on page load

## Files Created/Modified

### New Files
1. `app/components/RepresentCollectionPage.tsx` - Main collection component
2. `app/lib/lenis.ts` - Lenis scroll utilities
3. `app/routes/($locale).collections.$handle.represent.tsx` - Alternative route
4. `docs/REPRESENT-COLLECTION-PAGE.md` - Full documentation
5. `docs/COLLECTION-PAGE-QUICKSTART.md` - This file

### Modified Files
1. `app/routes/($locale).collections.$handle.tsx` - Now uses RepresentCollectionPage
2. `app/components/smooth-scroll/LenisProvider.tsx` - Added global instance management
3. `app/styles/app.css` - Added Represent collection styles

## How to Use

### 1. View a Collection

Navigate to any collection URL:
```
http://localhost:3000/collections/fall-winter-25
http://localhost:3000/collections/woman
http://localhost:3000/collections/initial
```

### 2. Test the Features

**Hero Banner**:
- Should display collection image at 50vh height
- Title overlaid in center, italic, bold, uppercase

**Sticky Navigation**:
- Scroll down - filter bar should stick to top
- Shows product count and filter/sort buttons

**Product Grid**:
- Hover over products - images should swap smoothly (0.7s)
- Grid should have 1px gray lines between products
- Responsive: 2 cols mobile → 3 tablet → 4 desktop

**Scroll Animations**:
- Products fade in with stagger effect as you scroll
- Smooth, premium feel

**Navigation from Homepage**:
- Click collection links on homepage parallax
- Should land at top of collection page (not mid-scroll)

### 3. Customize

**Change Grid Columns**:
```css
/* In app/styles/app.css */
.represent-product-grid {
  grid-template-columns: repeat(3, 1fr); /* Change 4 to 3 */
}
```

**Adjust Hover Transition Speed**:
```css
.represent-card-image {
  transition: opacity 0.5s ease-in-out; /* Change from 0.7s */
}
```

**Modify Hero Height**:
```css
.represent-hero {
  height: 60vh; /* Change from 50vh */
}
```

## Key Technical Details

### Image Swap Technique

Both images are absolutely positioned in the same space:
```tsx
<div className="wrapper">
  <Image className="primary" /> {/* opacity: 1 */}
  <Image className="secondary" /> {/* opacity: 0 */}
</div>
```

On hover, opacity values flip. This is GPU-accelerated and smooth.

### Grid Lines

The "lines" between products are created by:
1. Grid container has `background: #e5e5e5`
2. Grid has `gap: 1px`
3. Cards have `background: white`

The gray background shows through the 1px gaps.

### Scroll Reset

When navigating to a collection page:
```tsx
useEffect(() => {
  scrollToTop(true); // immediate: true
}, []);
```

This ensures users always start at the top, not mid-page.

## Testing Checklist

Quick tests to verify everything works:

- [ ] Collection page loads without errors
- [ ] Hero banner displays with correct height
- [ ] Filter bar sticks when scrolling
- [ ] Products display in correct grid (2/3/4 columns)
- [ ] Hovering products swaps images smoothly
- [ ] Scroll animations trigger correctly
- [ ] Navigating from homepage resets scroll to top
- [ ] "Load More" button works (if more than 30 products)
- [ ] Mobile responsive (test on small screen)

## Common Issues

### "Images not swapping on hover"
- Check that products have at least 2 images in Shopify
- Verify CSS classes are correct
- Inspect element to see if both images are rendered

### "GSAP animations not working"
- Ensure GSAP and ScrollTrigger are installed
- Check browser console for errors
- Verify `isClient` state is true before animations run

### "Scroll not resetting"
- Confirm Lenis is initialized in root layout
- Check that `scrollToTop` is imported correctly
- Try hard refresh (Ctrl+Shift+R)

### "Grid lines not showing"
- Verify `gap: 1px` on grid container
- Check that container has `background: #e5e5e5`
- Ensure cards have `background: white`

## Next Steps

1. **Add Filter Functionality**:
   - Implement filter drawer for mobile
   - Add price, color, size filters
   - Connect to Shopify's filter API

2. **Add Sort Options**:
   - Price: Low to High / High to Low
   - Newest / Best Selling
   - Update GraphQL query with sort parameters

3. **Enhance Product Cards**:
   - Add quick view modal
   - Implement size selector on hover
   - Add "Add to Cart" functionality

4. **Optimize Performance**:
   - Implement image lazy loading
   - Add blur-up placeholders
   - Consider infinite scroll instead of pagination

## Support

For detailed technical documentation, see:
- [REPRESENT-COLLECTION-PAGE.md](./REPRESENT-COLLECTION-PAGE.md)

For homepage parallax integration:
- [FLOATING-MENU-PARALLAX.md](./FLOATING-MENU-PARALLAX.md)

For overall architecture:
- [ARCHITECTURE.md](./ARCHITECTURE.md)
