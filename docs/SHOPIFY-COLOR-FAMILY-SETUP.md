# Shopify Color Family Setup Guide

## Quick Start: Setting Up Product Colors

This guide shows you how to set up your Shopify products to use the product-based color system.

## Step 1: Create Your Products

Instead of one product with color variants, create separate products for each color:

### Example: Hoodie Collection

Create these products:
1. **Blue Hoodie** (handle: `blue-hoodie`)
2. **Green Hoodie** (handle: `green-hoodie`)
3. **Maroon Hoodie** (handle: `maroon-hoodie`)

Each product should have:
- ✅ Unique product title
- ✅ Unique handle
- ✅ Color-specific images
- ✅ Size variants only (XS, S, M, L, XL)
- ❌ NO color variants

## Step 2: Add Metafield Definitions

### In Shopify Admin:

1. Go to **Settings** → **Custom data** → **Products**
2. Click **Add definition**

### Create `color_family` metafield:

```
Name: Color Family
Namespace and key: custom.color_family
Type: Single line text
Description: Groups related color products together (e.g., "hoodie-core-01")
```

### Create `color_name` metafield (optional):

```
Name: Color Name
Namespace and key: custom.color_name
Type: Single line text
Description: Display name for the color (e.g., "Ocean Blue")
```

## Step 3: Set Metafield Values

For each product in your color family:

### Blue Hoodie
```
custom.color_family: hoodie-core-01
custom.color_name: Ocean Blue
```

### Green Hoodie
```
custom.color_family: hoodie-core-01
custom.color_name: Forest Green
```

### Maroon Hoodie
```
custom.color_family: hoodie-core-01
custom.color_name: Deep Maroon
```

**Important:** All products in the same family MUST have the exact same `color_family` value.

## Step 4: Add Product Images

Each color product should have its own set of images:

### Blue Hoodie
- Front view (blue)
- Back view (blue)
- Detail shots (blue)
- Lifestyle photos (blue)

### Green Hoodie
- Front view (green)
- Back view (green)
- Detail shots (green)
- Lifestyle photos (green)

And so on...

## Step 5: Create Size Variants

For each product, add size variants:

1. Go to product → **Variants**
2. Add option: **Size**
3. Add values: XS, S, M, L, XL
4. Set prices and SKUs for each size
5. Manage inventory per size

**Do NOT add Color as a variant option!**

## Example Product Structure in Shopify

```
Product: Blue Hoodie
├─ Handle: blue-hoodie
├─ Metafields:
│  ├─ custom.color_family: "hoodie-core-01"
│  └─ custom.color_name: "Ocean Blue"
├─ Images: [blue-front.jpg, blue-back.jpg, blue-detail.jpg]
└─ Variants:
   ├─ XS - $49.99
   ├─ S - $49.99
   ├─ M - $49.99
   ├─ L - $49.99
   └─ XL - $49.99

Product: Green Hoodie
├─ Handle: green-hoodie
├─ Metafields:
│  ├─ custom.color_family: "hoodie-core-01"
│  └─ custom.color_name: "Forest Green"
├─ Images: [green-front.jpg, green-back.jpg, green-detail.jpg]
└─ Variants:
   ├─ XS - $49.99
   ├─ S - $49.99
   ├─ M - $49.99
   ├─ L - $49.99
   └─ XL - $49.99
```

## Naming Conventions

### Color Family Values
Use descriptive, unique identifiers:
- ✅ `hoodie-core-01`
- ✅ `tshirt-premium-02`
- ✅ `jacket-winter-03`
- ❌ `hoodie` (too generic)
- ❌ `1` (not descriptive)

### Product Handles
Use clear, SEO-friendly handles:
- ✅ `blue-hoodie`
- ✅ `ocean-blue-premium-hoodie`
- ✅ `forest-green-tshirt`
- ❌ `product-1`
- ❌ `blue`

## Testing Your Setup

1. **Check metafields are set:**
   - Open each product in Shopify admin
   - Scroll to metafields section
   - Verify `color_family` matches across related products

2. **Test on storefront:**
   - Navigate to a product page
   - Look for color swatches below the title
   - Click a color swatch
   - Verify it loads the correct product

3. **Verify size selection:**
   - Select a color product
   - Choose a size
   - Add to cart
   - Check cart has correct product + size

## Bulk Setup with CSV

You can bulk import products with metafields using CSV:

```csv
Handle,Title,Variant SKU,Variant Price,Metafield: custom.color_family,Metafield: custom.color_name
blue-hoodie,Blue Hoodie,BH-XS,49.99,hoodie-core-01,Ocean Blue
blue-hoodie,Blue Hoodie,BH-S,49.99,hoodie-core-01,Ocean Blue
blue-hoodie,Blue Hoodie,BH-M,49.99,hoodie-core-01,Ocean Blue
green-hoodie,Green Hoodie,GH-XS,49.99,hoodie-core-01,Forest Green
green-hoodie,Green Hoodie,GH-S,49.99,hoodie-core-01,Forest Green
```

## Common Mistakes to Avoid

1. ❌ **Different `color_family` values** - Must match exactly
2. ❌ **Adding Color as variant** - Color should be product-level
3. ❌ **Missing metafields** - All related products need `color_family`
4. ❌ **Wrong namespace** - Must be `custom.color_family`
5. ❌ **Typos in values** - `hoodie-core-01` ≠ `hoodie-core-1`

## Troubleshooting

### Color swatches not appearing
- Check all products have `custom.color_family` metafield
- Verify the values match exactly (case-sensitive)
- Ensure metafield namespace is `custom`

### Wrong products grouped together
- Check `color_family` values
- Make sure you're using unique identifiers per product family

### Images not showing
- Verify each product has a featured image
- Check image URLs are accessible
- Ensure images are published

## Need Help?

Refer to the main documentation:
- [COLOR-PRODUCT-ARCHITECTURE.md](./COLOR-PRODUCT-ARCHITECTURE.md) - Full technical details
- Shopify Metafields Guide: https://help.shopify.com/en/manual/custom-data/metafields

## Quick Reference

| Field | Namespace | Key | Type | Required |
|-------|-----------|-----|------|----------|
| Color Family | `custom` | `color_family` | Single line text | Yes |
| Color Name | `custom` | `color_name` | Single line text | No |

**Remember:** All products in the same color family must have the exact same `color_family` value!
