# Fabric Care Implementation

## Overview
The fabric care metafield has been implemented across the product pages with fallback content for products that don't have this metafield defined.

## Changes Made

### 1. ProductFeatureHero Component
**File:** `app/components/ProductFeatureHero.tsx`

**Features:**
- Dynamically reads metafields: `second_description`, `fit`, `fabric_care`
- Shows fallback content if no metafields are available
- Formats content with proper bullet point handling
- Fully responsive design

**Fallback Content:**
When no metafields are available, displays:
- Premium Quality
- Comfortable Fit
- Easy Care

### 2. ProductHero Component
**File:** `app/components/ProductHero.tsx`

**Features:**
- Fabric Care expandable section with formatted content
- Proper line break and bullet point handling

### 3. ProductPage Component
**File:** `app/components/ProductPage.tsx`

**Features:**
- Fabric Care expandable section in product details
- Formatted content display with bullet points

### 4. Responsive Styles
**File:** `app/styles/app.css`

**Updates:**
- Mobile responsive (max-width: 768px)
- Tablet responsive (769px - 1024px)
- Desktop optimized (1024px+)

## Metafield Configuration

The following metafields are fetched in the product query:

```graphql
metafields(identifiers: [
  {namespace: "custom", key: "second_description"}
  {namespace: "custom", key: "fit"}
  {namespace: "custom", key: "fabric_care"}
  {namespace: "custom", key: "shipping_returns"}
])
```

## Where It's Used

1. **ProductFeatureHero** - Shows on product detail page with second image
2. **ProductHero** - Expandable section in main product sidebar
3. **ProductPage** - Expandable section in product details (REPRESENT style layout)

## Shopify Setup

To add fabric care content in Shopify:

1. Go to Products → Select a product
2. Scroll to Metafields section
3. Find or create `fabric_care` metafield (namespace: custom)
4. Add content with line breaks and bullet points:
   ```
   • Professional grade cloth only
   • Do not machine wash
   • Avoid prolonged exposure to moisture or sunlight
   ```

## Format Support

The implementation supports:
- Plain text
- Line breaks (`\n`)
- Bullet points (• or -)
- Multi-line content

## Responsive Behavior

### Mobile (< 768px)
- Image displays first
- Content stacks below
- Reduced padding and font sizes
- Full-width layout

### Tablet (769px - 1024px)
- Side-by-side layout maintained
- Adjusted padding
- Optimized font sizes

### Desktop (> 1024px)
- Full side-by-side layout
- Maximum readability
- Optimal spacing
