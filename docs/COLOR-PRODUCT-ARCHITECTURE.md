# Color Product Architecture - Clothing Store Structure

## Overview
This implementation follows the premium clothing store pattern where:
- **Color = Separate Product** (Blue Hoodie, Green Hoodie, Maroon Hoodie)
- **Size = Variant** (XS, S, M, L, XL within each product)

## Why This Structure?

### Benefits
1. **Different imagery per color** - Each color product has its own lookbook images
2. **Unique styling per color** - Different mood and presentation for each color
3. **Better SEO** - Each color gets its own URL and can rank independently
4. **Separate inventory** - Easier inventory management per color
5. **Flexible pricing** - Different colors can have different prices
6. **Better analytics** - Track performance per color product

### Example Structure
```
Blue Hoodie      → /products/blue-hoodie
  ├─ Variant: XS
  ├─ Variant: S
  ├─ Variant: M
  ├─ Variant: L
  └─ Variant: XL

Green Hoodie     → /products/green-hoodie
  ├─ Variant: XS
  ├─ Variant: S
  ├─ Variant: M
  ├─ Variant: L
  └─ Variant: XL

Maroon Hoodie    → /products/maroon-hoodie
  ├─ Variant: XS
  ├─ Variant: S
  ├─ Variant: M
  ├─ Variant: L
  └─ Variant: XL
```

## Shopify Setup

### Step 1: Create Products
For each color, create a separate product:
- Blue Hoodie
- Green Hoodie
- Maroon Hoodie

Each product should have:
- Unique handle (e.g., `blue-hoodie`, `green-hoodie`)
- Unique images for that color
- Variants for sizes only (XS, S, M, L, XL)
- **DO NOT** add Color as a variant option

### Step 2: Add Metafields
For each product, add these metafields:

#### Required Metafield: `color_family`
- **Namespace:** `custom`
- **Key:** `color_family`
- **Type:** Single line text
- **Value:** Same for all related products (e.g., `hoodie-core-01`)

This groups products together as color variations of the same item.

#### Optional Metafield: `color_name`
- **Namespace:** `custom`
- **Key:** `color_name`
- **Type:** Single line text
- **Value:** Display name for the color (e.g., `Ocean Blue`, `Forest Green`)

If not provided, the product title will be used.

### Example Metafield Setup
```
Product: Blue Hoodie
├─ custom.color_family: "hoodie-core-01"
└─ custom.color_name: "Ocean Blue"

Product: Green Hoodie
├─ custom.color_family: "hoodie-core-01"
└─ custom.color_name: "Forest Green"

Product: Maroon Hoodie
├─ custom.color_family: "hoodie-core-01"
└─ custom.color_name: "Deep Maroon"
```

## Implementation Details

### 1. Loader Logic (`($locale).products.$handle.tsx`)

The loader fetches:
1. Current product
2. Related color products (via `color_family` metafield)
3. Recommendations
4. Best sellers

```typescript
// Get color_family metafield
const colorFamily = product.metafields?.find(
  (m: any) => m.namespace === 'custom' && m.key === 'color_family'
)?.value;

// Fetch all products with same color_family
if (colorFamily) {
  const { products } = await storefront.query(COLOR_FAMILY_PRODUCTS_QUERY, {
    variables: { 
      query: `metafields.custom.color_family:${colorFamily}`,
      first: 20 
    },
  });
  relatedColorProducts = products?.nodes || [];
}
```

### 2. Color Product Switcher Component

**File:** `app/components/ColorProductSwitcher.tsx`

Displays a grid of product swatches with:
- Product featured image
- Color name
- Price
- Availability status
- Active state for current product

### 3. User Flow

1. **User lands on Blue Hoodie** (`/products/blue-hoodie`)
2. **Sees color swatches** for Green and Maroon variants
3. **Clicks Green swatch** → Full page navigation to `/products/green-hoodie`
4. **Green Hoodie loads** with its own images, content, and size variants
5. **User selects size M** → Variant changes within Green Hoodie product
6. **Adds to cart** → Green Hoodie, Size M added

### 4. Size Selection

Size selection works normally within each product:
- Uses standard Hydrogen `ProductOptions` component
- Size changes update the selected variant
- No page reload for size changes
- Only color changes trigger navigation

## Styling

**File:** `app/styles/components/color-product-switcher.css`

Features:
- Responsive grid layout (4 columns desktop, 3 mobile, 2 small mobile)
- Hover effects with scale and shadow
- Active state with bold border
- Out of stock overlay
- Smooth transitions

## Advanced Enhancements (Optional)

### 1. Smooth Transitions
Use `prefetch="intent"` on color links for faster navigation:
```tsx
<Link to={`/products/${product.handle}`} prefetch="intent">
```

### 2. Framer Motion Animations
Add fade animations between product switches:
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Product content */}
</motion.div>
```

### 3. Skeleton Loading
Show loading state during navigation:
```tsx
const navigation = useNavigation();
const isLoading = navigation.state === 'loading';
```

## Fallback Behavior

If a product doesn't have a `color_family` metafield:
- The color product switcher won't display
- Falls back to standard variant-based color selection
- Existing products continue to work normally

## Testing Checklist

- [ ] Products with same `color_family` are grouped together
- [ ] Color swatches display product images correctly
- [ ] Clicking a color swatch navigates to the correct product
- [ ] Active color is highlighted
- [ ] Out of stock colors show overlay
- [ ] Size selection works within each color product
- [ ] Add to cart adds correct product + variant
- [ ] Mobile responsive layout works
- [ ] Prefetch improves navigation speed

## Migration Guide

### From Variant-Based to Product-Based Colors

1. **Audit existing products** - Identify products with color variants
2. **Create separate products** - One product per color
3. **Add metafields** - Set `color_family` for related products
4. **Update images** - Ensure each product has color-specific images
5. **Test thoroughly** - Verify navigation and cart functionality
6. **Update redirects** - If needed, redirect old variant URLs

## Best Practices

1. **Consistent naming** - Use clear, descriptive product titles
2. **Quality images** - Each color should have professional product photos
3. **Accurate metafields** - Double-check `color_family` values match
4. **Stock management** - Keep inventory updated per product
5. **SEO optimization** - Unique meta descriptions per color product
6. **Performance** - Limit related products query to reasonable number (20)

## Troubleshooting

### Color swatches not showing
- Check `color_family` metafield exists and matches across products
- Verify GraphQL query includes metafields
- Check loader is passing `relatedColorProducts` to component

### Wrong product loads
- Verify product handles are correct
- Check Link `to` prop uses correct handle
- Ensure no URL parameter conflicts

### Images not displaying
- Confirm `featuredImage` exists on products
- Check Image component data prop
- Verify image URLs are accessible

## Related Files

- `app/routes/($locale).products.$handle.tsx` - Product route with loader
- `app/components/ColorProductSwitcher.tsx` - Color switcher component
- `app/components/ProductHero.tsx` - Updated to use color switcher
- `app/styles/components/color-product-switcher.css` - Switcher styles
- `app/lib/variantHelpers.ts` - Legacy variant helpers (kept for fallback)
