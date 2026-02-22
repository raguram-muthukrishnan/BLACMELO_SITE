# Color Products - Quick Start Guide

## What Is This?

A premium clothing store color system where each color is a separate product (not a variant).

**Example:**
- Blue Hoodie → `/products/blue-hoodie` (with size variants)
- Green Hoodie → `/products/green-hoodie` (with size variants)
- Maroon Hoodie → `/products/maroon-hoodie` (with size variants)

## Quick Setup (3 Steps)

### 1. Set Up Shopify Metafields

In Shopify Admin → Settings → Custom data → Products:

Create metafield:
```
Name: Color Family
Namespace: custom
Key: color_family
Type: Single line text
```

### 2. Add Metafield to Products

For each color product, add:
```
custom.color_family: "hoodie-core-01"
```

All products in the same family must have the EXACT same value.

### 3. Test It

1. Navigate to a product page
2. Look for color swatches
3. Click a color
4. Verify it loads the correct product

## Documentation

| Document | Purpose |
|----------|---------|
| [SHOPIFY-COLOR-FAMILY-SETUP.md](./SHOPIFY-COLOR-FAMILY-SETUP.md) | Step-by-step Shopify setup |
| [COLOR-PRODUCT-ARCHITECTURE.md](./COLOR-PRODUCT-ARCHITECTURE.md) | Technical details |
| [COLOR-PRODUCT-VISUAL-GUIDE.md](./COLOR-PRODUCT-VISUAL-GUIDE.md) | Visual diagrams |
| [IMPLEMENTATION-CHECKLIST.md](./IMPLEMENTATION-CHECKLIST.md) | Complete checklist |

## Key Files

| File | Description |
|------|-------------|
| `app/components/ColorProductSwitcher.tsx` | Color switcher component |
| `app/routes/($locale).products.$handle.tsx` | Product route with loader |
| `app/styles/components/color-product-switcher.css` | Switcher styles |

## How It Works

```
User visits Blue Hoodie
    ↓
Sees color swatches (Blue, Green, Maroon)
    ↓
Clicks Green swatch
    ↓
Navigates to Green Hoodie (new product)
    ↓
Selects size M (variant within product)
    ↓
Adds to cart
```

## Benefits

✅ Unique images per color  
✅ Better SEO (separate URLs)  
✅ Flexible pricing per color  
✅ Easier inventory management  
✅ Premium user experience  

## Troubleshooting

**Color swatches not showing?**
- Check `color_family` metafield exists
- Verify values match exactly across products
- Ensure namespace is `custom`

**Wrong products grouped?**
- Check `color_family` values
- Values are case-sensitive
- Must match exactly

## Need Help?

1. Read [SHOPIFY-COLOR-FAMILY-SETUP.md](./SHOPIFY-COLOR-FAMILY-SETUP.md)
2. Check [COLOR-PRODUCT-ARCHITECTURE.md](./COLOR-PRODUCT-ARCHITECTURE.md)
3. Review [COLOR-PRODUCT-VISUAL-GUIDE.md](./COLOR-PRODUCT-VISUAL-GUIDE.md)

## Quick Reference

**Required Metafield:**
```
Namespace: custom
Key: color_family
Type: Single line text
Value: Unique identifier (e.g., "hoodie-core-01")
```

**Product Structure:**
```
Blue Hoodie
├─ custom.color_family: "hoodie-core-01"
└─ Variants: XS, S, M, L, XL (sizes only, no color)
```

**User Flow:**
```
Color selection → Product navigation (page reload)
Size selection → Variant change (no reload)
```

---

**Status:** ✅ Implementation Complete

**Next:** Set up Shopify metafields and test
