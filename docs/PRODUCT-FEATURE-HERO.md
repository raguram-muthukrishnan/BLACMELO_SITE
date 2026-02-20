# Product Feature Hero Section

## Overview
Added a new hero section below the breadcrumb that displays the second product image with a list of product features on the left side, matching the Represent design pattern.

## Implementation

### Component Created

**File**: `app/components/ProductFeatureHero.tsx`

```tsx
import {Image} from '@shopify/hydrogen';

interface ProductFeatureHeroProps {
  image: any;
  title: string;
  features: Array<{
    title: string;
    description: string;
  }>;
}

export function ProductFeatureHero({image, title, features}: ProductFeatureHeroProps) {
  if (!image) return null;

  return (
    <section className="product-feature-hero">
      <div className="product-feature-container">
        {/* Left: Features List */}
        <div className="product-feature-content">
          <div className="product-feature-list">
            {features.map((feature, index) => (
              <div key={index} className="product-feature-item">
                <h3 className="product-feature-title">{feature.title}</h3>
                <p className="product-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Image */}
        <div className="product-feature-image">
          <Image
            data={image}
            alt={title}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="product-feature-img"
          />
        </div>
      </div>
    </section>
  );
}
```

### Integration

**File**: `app/routes/($locale).products.$handle.tsx`

Added between Breadcrumb and GalleryCarousel:

```tsx
<Breadcrumb items={buildBreadcrumbItems()} />

{/* Product Feature Hero - Second Image with Features */}
{product.images?.nodes?.[1] && (
  <ProductFeatureHero
    image={product.images.nodes[1]}
    title={product.title}
    features={[
      {
        title: 'Slightly Oversized',
        description: 'Our Owners Club Fit'
      },
      {
        title: 'Metal Hardware',
        description: 'Represent Bar'
      },
      {
        title: 'Tactile Graphic',
        description: 'For a Fly Poster Feel'
      }
    ]}
  />
)}

<GalleryCarousel images={product.images?.nodes || []} />
```

## Layout Structure

### Desktop (> 768px)
```
┌─────────────────────────────────────┐
│         BREADCRUMB                  │
├──────────────────┬──────────────────┤
│  Features List   │  Product Image   │
│  (Left 50%)      │  (Right 50%)     │
│                  │                  │
│  • Feature 1     │                  │
│  • Feature 2     │     [IMAGE]      │
│  • Feature 3     │                  │
│                  │                  │
└──────────────────┴──────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────────────────────────┐
│         BREADCRUMB                  │
├─────────────────────────────────────┤
│                                     │
│         [PRODUCT IMAGE]             │
│         (Full Width)                │
│                                     │
├─────────────────────────────────────┤
│      Features List (Centered)       │
│                                     │
│         • Feature 1                 │
│         • Feature 2                 │
│         • Feature 3                 │
│                                     │
└─────────────────────────────────────┘
```

## CSS Styles

**File**: `app/styles/app.css`

### Container
```css
.product-feature-hero {
  width: 100%;
  background: #ffffff;
  margin: 0;
}

.product-feature-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 60vh;
  gap: 0;
}
```

### Features Content (Left Side)
```css
.product-feature-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 60px;
  background: #ffffff;
}

.product-feature-list {
  max-width: 400px;
  width: 100%;
}

.product-feature-item {
  margin-bottom: 48px;
}

.product-feature-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
  letter-spacing: 0.02em;
}

.product-feature-description {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #666666;
  margin: 0;
  line-height: 1.6;
}
```

### Product Image (Right Side)
```css
.product-feature-image {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 60vh;
  overflow: hidden;
  background: #f5f5f5;
}

.product-feature-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

### Mobile Responsive
```css
@media (max-width: 768px) {
  .product-feature-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .product-feature-image {
    order: -1;
    min-height: 50vh;
  }

  .product-feature-content {
    padding: 40px 20px;
  }

  .product-feature-item {
    margin-bottom: 32px;
    text-align: center;
  }

  .product-feature-title {
    font-size: 16px;
  }

  .product-feature-description {
    font-size: 12px;
  }
}
```

## Design Specifications

### Desktop
- **Layout**: 50/50 split (features left, image right)
- **Min Height**: 60vh
- **Features Padding**: 80px 60px
- **Feature Spacing**: 48px between items
- **Title Font**: 18px, 600 weight
- **Description Font**: 13px, 400 weight

### Mobile
- **Layout**: Stacked (image top, features bottom)
- **Image Height**: 50vh minimum
- **Features Padding**: 40px 20px
- **Feature Spacing**: 32px between items
- **Text Alignment**: Centered
- **Title Font**: 16px
- **Description Font**: 12px

## Features

### Automatic Image Selection
- Uses second image from product (`product.images.nodes[1]`)
- Falls back gracefully if second image doesn't exist
- No manual configuration needed

### Customizable Features
- Features array passed as props
- Easy to modify per product
- Can be fetched from metafields in future

### Responsive Design
- Desktop: Side-by-side layout
- Mobile: Stacked with image first
- Smooth transitions between breakpoints

### Performance
- Uses Shopify's optimized Image component
- Responsive image sizes
- Lazy loading support

## Future Enhancements

### Dynamic Features from Metafields
```tsx
// Fetch from product metafield
const featuresMetafield = product.metafields?.find(
  (field) => field?.key === 'product_features'
);
const features = featuresMetafield?.value 
  ? JSON.parse(featuresMetafield.value)
  : defaultFeatures;
```

### Multiple Images Support
```tsx
// Carousel of feature images
<ProductFeatureHero
  images={product.images.nodes.slice(1, 4)}
  features={features}
/>
```

### Animation on Scroll
```tsx
// Fade in features as user scrolls
useEffect(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });
  
  document.querySelectorAll('.product-feature-item').forEach(item => {
    observer.observe(item);
  });
}, []);
```

## Usage Example

### Basic Usage
```tsx
<ProductFeatureHero
  image={product.images.nodes[1]}
  title={product.title}
  features={[
    {
      title: 'Premium Quality',
      description: 'Crafted with attention to detail'
    },
    {
      title: 'Sustainable',
      description: 'Made from eco-friendly materials'
    }
  ]}
/>
```

### With Conditional Rendering
```tsx
{product.images?.nodes?.[1] && (
  <ProductFeatureHero
    image={product.images.nodes[1]}
    title={product.title}
    features={productFeatures}
  />
)}
```

## Benefits

1. **Clear Product Communication**: Features are prominently displayed
2. **Visual Appeal**: Large hero image showcases product
3. **Responsive**: Works perfectly on all devices
4. **Flexible**: Easy to customize features per product
5. **Performance**: Optimized images and minimal code
6. **Accessible**: Semantic HTML and proper structure

## Testing Checklist

- [ ] Section displays below breadcrumb
- [ ] Second image loads correctly
- [ ] Features list displays properly
- [ ] Desktop shows side-by-side layout
- [ ] Mobile shows stacked layout
- [ ] Image on top on mobile
- [ ] Text centered on mobile
- [ ] Responsive breakpoints work
- [ ] Typography matches design
- [ ] Spacing is correct
- [ ] Falls back gracefully if no second image

## Notes

- Section only renders if second image exists
- Features are hardcoded but can be made dynamic
- Matches Represent design aesthetic
- Clean, minimal styling
- Professional presentation
- Easy to maintain and update
