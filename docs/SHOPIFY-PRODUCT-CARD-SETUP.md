# Shopify Product Card Setup Guide

This guide explains how to set up your Shopify products to display correctly in the product cards with the Represent-style layout.

## Product Card Display Structure

The product cards now display information in this format:
```
[Product Image]

Product Name                    $Price
Color Name  X Colours
```

Example:
```
247 Arc 4 Elite Race            $340
Flat White Jet Black  2 Colours
```

---

## Required Shopify Setup

### 1. Product Variants Setup

Each product should have variants with **Color** and **Size** options:

#### Step 1: Create Product Options
1. Go to **Products** in Shopify Admin
2. Click on a product or create a new one
3. In the **Variants** section, add options:
   - **Option 1**: `Color` (or `Colour`)
   - **Option 2**: `Size`

#### Step 2: Add Variant Values
For each color/size combination, create a variant:
- Example: `Flat White Jet Black / S`
- Example: `Flat White Jet Black / M`
- Example: `Black / S`
- Example: `Black / M`

**Important**: The system will automatically count unique colors to display "X Colours"

---

### 2. Metafield Setup for Proper Color Names (OPTIONAL - Already Working!)

**Good News**: The code is already configured to work with your existing "Color" metafield under "Category metafields"!

The system automatically looks for color information in these metafield locations:
- **Key**: `color_name`, `color`, or `Color`
- **Namespace**: `custom`, `category`, or any namespace containing "tshirt"

#### How to Use Your Existing Setup:

1. Go to **Products** in Shopify Admin
2. Click on a product
3. Scroll down to **Metafields** section
4. Find **Color** field under "Category metafields"
5. Enter the formatted color name (e.g., "Flat White Jet Black", "Black", "Glacier Fade Out")
6. Click **Save**

**Note**: This metafield should contain the color name of the **first/default variant** of the product.

#### Alternative: Create Custom Metafield (Optional)

If you prefer to create a dedicated metafield specifically for product cards:

1. Go to **Settings** → **Custom data** in Shopify Admin
2. Click **Products**
3. Click **Add definition**
4. Fill in the details:
   - **Name**: `Color Name`
   - **Namespace and key**: `custom.color_name`
   - **Description**: "Formatted color name for display on product cards"
   - **Type**: `Single line text`
   - **Validation**: None required
5. Click **Save**

---

## Data Entry Examples

### Example 1: Single Color Product (Using Category Metafield)

**Product**: "247 Ultra Jacket"
- **Title**: `247 Ultra Jacket`
- **Variants**:
  - `Black Fade Out / S`
  - `Black Fade Out / M`
  - `Black Fade Out / L`
  - `Black Fade Out / XL`
- **Metafield** (Category metafields → Color): `Black Fade Out`
- **Display**: 
  ```
  247 Ultra Jacket                $285
  Black Fade Out
  ```

### Example 2: Multiple Color Product (Using Category Metafield)

**Product**: "247 Arc 4 Elite Race"
- **Title**: `247 Arc 4 Elite Race`
- **Variants**:
  - `Flat White Jet Black / S`
  - `Flat White Jet Black / M`
  - `Flat White Jet Black / L`
  - `Black / S`
  - `Black / M`
  - `Black / L`
- **Metafield** (Category metafields → Color): `Flat White Jet Black`
- **Display**: 
  ```
  247 Arc 4 Elite Race            $340
  Flat White Jet Black  2 Colours
  ```

### Example 3: Product with Special Color Name (Using Category Metafield)

**Product**: "Glacier Fade Out Jacket"
- **Title**: `Glacier Fade Out Jacket`
- **Variants**:
  - `Glacier Fade Out / S`
  - `Glacier Fade Out / M`
  - `Waterproof Black / S`
  - `Waterproof Black / M`
- **Metafield** (Category metafields → Color): `Glacier Fade Out`
- **Display**: 
  ```
  Glacier Fade Out Jacket         $295
  Glacier Fade Out  2 Colours
  ```

---

## Bulk Data Entry Tips

### Using Shopify CSV Import

1. Export your products as CSV
2. Add a column for your color metafield (check the exact column name in Shopify's CSV format)
3. Fill in the formatted color names for each product
4. Import the CSV back to Shopify

**Note**: The exact column name depends on your metafield namespace and key. For category metafields, it might be `Metafield: color [category.color]`

### Using Shopify API/Apps

You can use apps like:
- **Metafields Editor** by Accentuate
- **Bulk Product Edit** by Hextom
- **Shopify Flow** (for automated metafield population)

---

## GraphQL Query Update

The product card component automatically queries for metafields. The queries have been updated to include:

```graphql
fragment ProductItem on Product {
  id
  title
  handle
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  featuredImage {
    url
    altText
    width
    height
  }
  images(first: 2) {
    nodes {
      url
      altText
      width
      height
    }
  }
  variants(first: 100) {
    nodes {
      id
      selectedOptions {
        name
        value
      }
    }
  }
  metafields(first: 10) {
    key
    value
    namespace
  }
}
```

**Note**: The code automatically searches for color metafields with these patterns:
- Keys: `color_name`, `color`, or `Color`
- Namespaces: `custom`, `category`, or any containing "tshirt"

---

## Fallback Behavior

If no color metafield is set:
- The system will use the color value from the first variant's options
- Example: If variant has `Color: Black`, it will display as "Black"

**Recommendation**: Set the color metafield for better formatting and display, especially for multi-word color names like "Flat White Jet Black".

---

## Font Sizes Reference

The product card uses these font sizes (matching Represent design):

- **Product Title**: 11px, Bold (DM Sans)
- **Color Name**: 10px, Regular (DM Sans)
- **Color Count**: 10px, Regular (DM Sans)
- **Price**: 11px, Bold (DM Sans)

**Mobile**:
- **Product Title**: 10px
- **Color Name**: 9px
- **Color Count**: 9px
- **Price**: 10px

---

## Testing Checklist

- [ ] Product has Color and Size variants
- [ ] Color metafield is set with formatted color name (in Category metafields or custom metafield)
- [ ] Multiple colors show "X Colours" text
- [ ] Single color products don't show color count
- [ ] Price displays correctly on the right
- [ ] Text layout matches Represent design
- [ ] Mobile view displays correctly with smaller fonts

---

## Common Issues

### Issue: Color count shows wrong number
**Solution**: Check that all variants have the Color option properly set

### Issue: Color name not displaying
**Solution**: 
1. Check that you've filled in the Color metafield under "Category metafields"
2. Or verify your custom metafield namespace and key
3. The code looks for: `color_name`, `color`, or `Color` in `custom`, `category`, or tshirt-related namespaces

### Issue: "undefined Colours" showing
**Solution**: Ensure at least one variant has a Color option value

### Issue: Text too large/small
**Solution**: Font sizes are set in `tailwind.css` - adjust the `.product-card-*` classes if needed

---

## Support

For questions or issues with the product card setup, refer to:
- Shopify Metafields Documentation: https://shopify.dev/docs/apps/custom-data/metafields
- Hydrogen Documentation: https://shopify.dev/docs/custom-storefronts/hydrogen
