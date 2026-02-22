# Fix Your Color Family Values

## Problem

You currently have 17 different products all using the SAME `color_family` value. This causes unrelated products (hoodies, jeans, jackets) to be grouped together.

## Current Situation (Wrong)

All these products have the same `color_family`:
- Blue Hoodie
- Green Hoodie  
- Maroon Hoodie
- Brown Wash Hoodie
- Black Optic Wash Hoodie
- Blue Wash Hoodie
- Floral Aesthetics Jean
- Dark Romance Jean
- Afterlife
- Vision
- Fury Wings
- The Signature Jacket
- Born To Rule
- Dark Romance
- Rose Rush
- Wild and Free
- Green Flower

## Solution: Use Different Values Per Product Type

### Step 1: Group Hoodies Together

For all hoodie products, use:
```
color_family: hoodie-core-01
```

Products:
- Blue Hoodie → `hoodie-core-01`
- Green Hoodie → `hoodie-core-01`
- Maroon Hoodie → `hoodie-core-01`
- Brown Wash Hoodie → `hoodie-core-01`
- Black Optic Wash Hoodie → `hoodie-core-01`
- Blue Wash Hoodie → `hoodie-core-01`

### Step 2: Group Jeans Together

For all jean products, use:
```
color_family: jean-collection-01
```

Products:
- Floral Aesthetics Jean → `jean-collection-01`
- Dark Romance Jean → `jean-collection-01`
- Afterlife Jean → `jean-collection-01`
- (any other jean variants)

### Step 3: Group Jackets Together

For all jacket products, use:
```
color_family: jacket-signature-01
```

Products:
- The Signature Jacket → `jacket-signature-01`
- (any other jacket color variants)

### Step 4: Other Products

For standalone products or other categories:
```
color_family: tshirt-graphic-01
color_family: accessories-01
color_family: pants-01
```

## How to Update in Shopify

### Method 1: Individual Products

1. Go to **Products** in Shopify Admin
2. Click on a product (e.g., "Blue Hoodie")
3. Scroll to **Metafields** section
4. Find **Color Family** field
5. Change value to: `hoodie-core-01`
6. Click **Save**

Repeat for all hoodie products with the SAME value.

### Method 2: Bulk Edit (Faster)

1. Go to **Products**
2. Filter or search for hoodies
3. Select all hoodie products (checkboxes)
4. Click **Bulk edit**
5. Select **Color Family** from dropdown
6. Enter: `hoodie-core-01`
7. Click **Save**

Repeat for jeans with `jean-collection-01`, etc.

## Recommended Color Family Values

| Product Type | color_family Value | Example Products |
|--------------|-------------------|------------------|
| Hoodies | `hoodie-core-01` | Blue, Green, Maroon Hoodies |
| Jeans | `jean-collection-01` | Floral, Dark Romance Jeans |
| Jackets | `jacket-signature-01` | Signature Jacket variants |
| T-Shirts | `tshirt-graphic-01` | Graphic tee variants |
| Pants | `pants-casual-01` | Casual pant variants |

## Naming Convention

Use this format:
```
{product-type}-{collection-name}-{version}
```

Examples:
- `hoodie-core-01` (core hoodie collection, version 1)
- `hoodie-premium-01` (premium hoodie collection, version 1)
- `jean-collection-01` (jean collection, version 1)
- `tshirt-graphic-01` (graphic tshirt collection, version 1)

## After Updating

Once you update the metafields:

1. **Blue Hoodie page** will show: Blue, Green, Maroon, Brown, Black Optic, Blue Wash hoodies (6 colors)
2. **Floral Aesthetics Jean page** will show: Floral, Dark Romance, Afterlife jeans (3 colors)
3. **Signature Jacket page** will show: Only jacket color variants

## Quick Fix Checklist

- [ ] Identify product categories (hoodies, jeans, jackets, etc.)
- [ ] Choose unique `color_family` value per category
- [ ] Update all hoodies to `hoodie-core-01`
- [ ] Update all jeans to `jean-collection-01`
- [ ] Update all jackets to `jacket-signature-01`
- [ ] Test each product page
- [ ] Verify only related colors show up

## Testing

After updating:

1. Visit Blue Hoodie page
2. Should see ONLY hoodie color swatches (not jeans or jackets)
3. Click a hoodie color swatch
4. Should navigate to that hoodie color
5. Repeat for jeans and jackets

## Common Mistakes

❌ **Using the same value for all products**
```
All products: hoodie-core-01  (WRONG!)
```

✅ **Using different values per product type**
```
Hoodies: hoodie-core-01
Jeans: jean-collection-01
Jackets: jacket-signature-01
```

❌ **Using generic values**
```
color_family: 1
color_family: products
color_family: clothing
```

✅ **Using descriptive values**
```
color_family: hoodie-core-01
color_family: jean-collection-01
color_family: tshirt-graphic-01
```

## Need Help?

The system is working correctly - you just need to organize your products into proper groups using different `color_family` values for each product type.
