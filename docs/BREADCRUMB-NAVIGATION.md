# Breadcrumb Navigation - Product Page

## Overview
Replaced the SplitFeatures section with a centered breadcrumb navigation matching the REPRESENT reference design. The breadcrumb provides clear navigation hierarchy and improves user experience.

## Changes Made

### 1. New Component (`Breadcrumb.tsx`)
Created a reusable breadcrumb component with:
- Flexible item structure (label + optional href)
- Semantic HTML using `<nav>` and `<ol>` elements
- Accessible with proper ARIA labels
- Link support for navigation
- Current page indicator (no link)
- Separator between items (›)

### 2. Route Updates (`($locale).products.$handle.tsx`)
- Removed `SplitFeatures` import and usage
- Added `Breadcrumb` component import
- Implemented breadcrumb with three levels:
  - Home → Discover All Products → Product Title
- Positioned between ProductHero and GalleryCarousel

### 3. CSS Styles (`tailwind.css`)

#### Desktop Layout (> 1024px)
- **Padding**: 60px top/bottom, 80px left/right
- **Alignment**: Center-aligned
- **Font**: DM Sans, 11px, regular weight
- **Colors**: 
  - Links: #000 (black)
  - Current page: #666 (gray)
  - Separator: #999 (light gray)
- **Spacing**: 8px gap between items

#### Tablet Layout (769px - 1024px)
- **Padding**: 50px top/bottom, 40px left/right
- **Font size**: 10px
- **Maintains center alignment**

#### Mobile Layout (< 768px)
- **Padding**: 40px top/bottom, 20px left/right
- **Alignment**: Left-aligned for better mobile UX
- **Font size**: 10px
- **Spacing**: 6px gap between items

## Visual Structure

### Desktop
```
┌─────────────────────────────────────────┐
│                                         │
│   Home › Discover All Products › Title │  ← Centered
│                                         │
└─────────────────────────────────────────┘
```

### Mobile
```
┌──────────────────────────┐
│                          │
│ Home › All › Title       │  ← Left-aligned
│                          │
└──────────────────────────┘
```

## Features

✅ **Semantic HTML**: Uses proper `<nav>` and `<ol>` elements
✅ **Accessible**: Includes ARIA labels for screen readers
✅ **Responsive**: Adapts padding and alignment for all screen sizes
✅ **Hover Effects**: Links have smooth opacity transition on hover
✅ **Text Transform**: Capitalizes first letter of each word
✅ **Clean Design**: Minimal, matching REPRESENT aesthetic
✅ **Reusable**: Component can be used on other pages
✅ **SEO Friendly**: Proper semantic structure helps search engines

## Breadcrumb Structure

```typescript
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Discover All Products', href: '/collections/all' },
    { label: product.title }, // Current page (no href)
  ]}
/>
```

## Customization

### Adding More Levels
```typescript
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: 'Men', href: '/collections/men' },
    { label: 'Hoodies', href: '/collections/men-hoodies' },
    { label: product.title },
  ]}
/>
```

### Changing Separator
Edit the separator in `Breadcrumb.tsx`:
```tsx
<span className="breadcrumb-separator">›</span>
// Change to: / or > or •
```

## Benefits

1. **Navigation**: Users can easily navigate back to parent pages
2. **Context**: Shows where the user is in the site hierarchy
3. **SEO**: Helps search engines understand site structure
4. **UX**: Reduces cognitive load by showing clear path
5. **Clean Design**: Replaces bulky SplitFeatures section
6. **Performance**: Lighter than image-heavy sections

## Testing Recommendations

1. Test breadcrumb links navigate correctly
2. Verify current page (last item) is not clickable
3. Check hover states on links
4. Test on desktop (centered, 60px/80px padding)
5. Test on tablet (centered, 50px/40px padding)
6. Test on mobile (left-aligned, 40px/20px padding)
7. Verify text capitalization works correctly
8. Test with long product titles (should wrap properly)
9. Check accessibility with screen readers
10. Verify separator displays correctly

## Browser Compatibility

- Works in all modern browsers
- Uses standard CSS flexbox
- No JavaScript required for styling
- Graceful degradation for older browsers
