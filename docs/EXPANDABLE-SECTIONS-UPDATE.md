# Expandable Sections Update - Product Page

## Overview
Updated the product page hero right section to include 4 horizontal expandable sections fetching data from Shopify metafields, with full responsive optimization and default fallback text.

## Changes Made

### 1. GraphQL Query Updates (`($locale).products.$handle.tsx`)
- Added metafield fetching for:
  - `second_description` - Secondary product description
  - `fit` - Fit information
  - `fabric_care` - Fabric care instructions
  - `shipping_returns` - Shipping and returns policy

### 2. Component Updates (`ProductHero.tsx`)
- Added four expandable sections: "Description", "Fit", "Fabric Care", and "Shipping & Returns"
- Updated state management to handle `'description' | 'fit' | 'fabric' | 'shipping' | 'sizechart'` section types
- Implemented metafield data fetching with fallback defaults
- Added helper function `getMetafieldValue()` to retrieve metafield data or default text
- **Added Size Chart functionality**: Clicking "Size Guide" button opens size_chart.jpeg in the same expandable view
- Size chart displays as a responsive image within the hero-expanded-view container

#### Default Text (when metafields are empty):
- **Description**: Uses product description or "Discover the perfect blend of style and comfort with this premium piece."
- **Fit**: "Model wears size M. Designed for a relaxed, slightly oversized fit."
- **Fabric Care**: "Professional grade cloth only. Do not machine wash. Avoid prolonged exposure to moisture or sunlight."
- **Shipping & Returns**: Standard shipping info and 14-day return policy

### 3. CSS Updates (`tailwind.css`)

#### Desktop Layout (> 1024px)
- **2x2 Grid layout** (2 buttons per row, 2 rows)
- CSS Grid with `grid-template-columns: 1fr 1fr`
- Border right on left column items
- Border bottom on top row items
- Padding: 14px 12px
- Font size: 12px for titles
- Icon size: 16px

#### Tablet Layout (769px - 1024px)
- **2x2 Grid layout** maintained
- Slightly reduced padding (12px 10px)
- Font size: 11px for better fit
- Same border management as desktop

#### Mobile Layout (< 768px)
- **2x2 Grid layout** maintained
- Compact padding (12px 8px)
- Font size: 10px with line-height 1.3
- Icon size: 14px
- Text can wrap to multiple lines if needed

## Shopify Metafield Setup

### Required Metafields (namespace: "custom"):
1. **second_description** (type: multi_line_text_field)
   - Secondary product description
   
2. **fit** (type: multi_line_text_field)
   - Fit information (e.g., "Model wears size M. Designed for a relaxed fit.")
   
3. **fabric_care** (type: multi_line_text_field)
   - Care instructions (e.g., "Professional grade cloth only...")
   
4. **shipping_returns** (type: multi_line_text_field)
   - Shipping and returns policy

### How to Add in Shopify Admin:
1. Go to Settings > Custom data > Products
2. Add metafield definitions with namespace "custom" and the keys above
3. Edit products and fill in the metafield values
4. Products without these fields will show default text automatically

## Features
- ✅ 2x2 grid layout (2 rows, 2 buttons per row) on all screen sizes
- ✅ Fetches data from Shopify metafields
- ✅ Default fallback text for products without metafields
- ✅ **Size Chart integration**: Opens size_chart.jpeg in expandable view when clicking "Size Guide"
- ✅ Consistent grid layout across desktop, tablet, and mobile
- ✅ Smooth transitions and hover effects
- ✅ Accessible button elements with proper ARIA labels
- ✅ Clean, minimal aesthetic matching brand style
- ✅ Supports multi-line text with proper formatting
- ✅ Smart border management (right borders on left column, bottom borders on top row)
- ✅ Responsive image display for size chart with scroll support

## Responsive Breakpoints
- **Mobile**: < 768px (2x2 grid, compact spacing)
- **Tablet**: 769px - 1024px (2x2 grid, medium spacing)
- **Desktop**: > 1024px (2x2 grid, comfortable spacing)

## Testing Recommendations
1. Test products WITH metafields filled
2. Test products WITHOUT metafields (should show defaults)
3. **Test Size Guide button** - should open size_chart.jpeg in expandable view
4. Test on mobile devices (< 768px width) - verify 2x2 grid
5. Test on tablets (768px - 1024px width) - verify 2x2 grid
6. Test on desktop (> 1024px width) - verify 2x2 grid
7. Verify all sections (including size chart) expand correctly with proper content
8. Check hover states and transitions
9. Verify text doesn't overflow on smaller screens
10. Test size chart image responsiveness and scroll behavior

## Size Chart Setup
- Place your size chart image at: `hydrogen-storefront/app/assets/size_chart.jpeg`
- The image will be displayed responsively within the expandable section
- Supports scrolling for large images
- Image path: `/app/assets/size_chart.jpeg`
