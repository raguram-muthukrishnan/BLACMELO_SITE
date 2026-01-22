# Homepage Update - Figma Design Implementation

## Changes Made

### ✅ Removed
- Previous product recommendations section
- Featured collection query
- Deferred data loading for products
- All Shopify API calls from homepage

### ✅ Added

#### 1. Four Stacked Banner Images
The homepage now displays 4 full-width banner images stacked vertically, exactly as shown in the Figma design:

**Banner Images:**
- `1.jpeg` - First banner with hero overlay
- `2.jpeg` - Second banner
- `3.jpeg` - Third banner  
- `4.png` - Fourth banner

**Location:** `app/assets/banner images/`

**Dimensions:**
- Desktop: 1440px × 835px each
- Mobile: Full width × 400px each

#### 2. Hero Overlay (First Banner Only)
The first banner includes an overlay with:
- "NOW LIVE" label
- "LIVE COLLECTION NAME" title
- Two action buttons (Button 1, Button 2)
- Semi-transparent dark overlay for text readability
- White text with shadow

#### 3. Floating Menu
Positioned absolutely at `top: 1397px` (as per Figma):
- "EXPLORE COLLECTION" heading
- 3 collection links
- "Discover →" link
- White background with transparency
- Overlays the banner images

## File Structure

```
app/
├── routes/
│   └── ($locale)._index.tsx    [UPDATED] - Simplified homepage
├── assets/
│   └── banner images/
│       ├── 1.jpeg
│       ├── 2.jpeg
│       ├── 3.jpeg
│       └── 4.png
└── styles/
    └── tailwind.css            [UPDATED] - Banner styles
```

## Component Structure

```tsx
Homepage
├── HeroBanner
│   ├── First Banner (with overlay)
│   │   ├── Hero Content
│   │   │   ├── "NOW LIVE" label
│   │   │   ├── Collection title
│   │   │   └── Action buttons
│   ├── Second Banner
│   ├── Third Banner
│   └── Fourth Banner
└── FloatingMenu (absolute positioned)
    ├── Title
    ├── Collection links
    └── Discover link
```

## Styling Details

### Banner Images
```css
.hero-banner-wrapper,
.banner-wrapper {
  width: 100%;
  height: 835px;
  overflow: hidden;
}

.hero-banner-image,
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Hero Overlay
```css
.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
}

.hero-content {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

### Floating Menu
```css
.floating-menu {
  position: absolute;
  left: 50%;
  top: 1397px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  z-index: 50;
}
```

## Mobile Responsiveness

### Breakpoint: 768px

**Banner Images:**
- Height reduced to 400px
- Maintains full width
- Object-fit: cover

**Hero Content:**
- Smaller font sizes
- Reduced padding
- Buttons stack on very small screens

**Floating Menu:**
- Changes to relative positioning
- Removes absolute overlay
- Displays as normal section below banners

## Key Features

✅ **Exact Figma Match** - Layout matches design precisely
✅ **4 Stacked Images** - All banner images from assets
✅ **No API Calls** - Static content only
✅ **Floating Menu** - Positioned as overlay
✅ **Mobile Responsive** - Adapts to all screen sizes
✅ **Performance** - Fast loading with local images
✅ **Clean Code** - Simplified structure

## Testing

### Desktop (1440px)
- [ ] All 4 banners display correctly
- [ ] Hero overlay visible on first banner
- [ ] Floating menu positioned at correct location
- [ ] Buttons functional
- [ ] Images maintain aspect ratio

### Tablet (768px)
- [ ] Banners resize appropriately
- [ ] Floating menu becomes relative
- [ ] Text remains readable
- [ ] Navigation works

### Mobile (375px)
- [ ] Banners at 400px height
- [ ] Hero content centered
- [ ] Buttons accessible
- [ ] Menu displays below banners

## Next Steps

1. **Replace placeholder text** - Update "LIVE COLLECTION NAME" with actual collection name
2. **Update button labels** - Change "Button 1" and "Button 2" to meaningful CTAs
3. **Link collections** - Connect floating menu to real collection pages
4. **Optimize images** - Compress banner images for faster loading
5. **Add animations** - Subtle fade-in effects for banners
6. **A/B test CTAs** - Test different button text for conversions

## Notes

- All product-related code removed from homepage
- Homepage is now purely presentational
- Banner images are imported directly from assets
- No Shopify API dependencies on homepage
- Floating menu overlays images as per Figma design

---

**Updated:** January 19, 2026
**Design Source:** [Figma - BLACMELO_SITE](https://www.figma.com/design/mtYKHnYZwb0B7CqFlJLuf1/BLACMELO_SITE?node-id=1-2)
