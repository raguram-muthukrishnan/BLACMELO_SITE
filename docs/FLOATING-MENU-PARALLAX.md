# Floating Menu Parallax Implementation

## Overview
Implementation of the luxury streetwear parallax hero section inspired by Represent Clo, featuring a floating navigation menu and smooth scroll-triggered animations.

## Key Technical Corrections

### 1. Fixed "Double Scrub" Problem
- **Issue**: Separate ScrollTriggers for fade in/out caused flickering
- **Solution**: Single GSAP Timeline with both animations
- **Result**: Smooth, flicker-free content transitions

### 2. Image Sizing Uniformity (Critical Fix)
- **Issue**: Images with different aspect ratios (4:5, 16:9, 1:1) appeared inconsistent
- **Solution**: Force all images to occupy identical physical space using viewport units
- **Implementation**:
  ```css
  .hero-parallax-image {
    width: 100vw !important;
    min-width: 100vw !important;
    height: 120vh !important;
    min-height: 120vh !important;
    max-width: none !important; /* Prevents Tailwind overrides */
    object-fit: cover;
    object-position: center;
  }
  ```

### 3. "Pinned" Parallax Effect
- **Issue**: Images moving down felt disconnected
- **Solution**: Move images up slightly (-15%) to create "fixed" illusion
- **Result**: Curtain-reveal effect matching Represent aesthetic

### 4. Performance Optimizations
- Added `force3D: true` for hardware acceleration
- Used `useLayoutEffect` for proper DOM timing
- Implemented GSAP context management with cleanup
- Added `will-change` for transform properties

## Implementation Details

### Component Structure
```tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const items = gsap.utils.toArray('.hero-parallax-item');
    
    items.forEach((item: any, i: number) => {
      // 1. Image Parallax - "pinned" illusion
      gsap.to(img, {
        y: '-15%',
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // 2. Single Timeline for content (fixes double scrub)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        }
      });

      tl.fromTo(content, 
        { opacity: 0, y: 50, force3D: true }, 
        { opacity: 1, y: 0, duration: 1, force3D: true }
      ).to(content, 
        { opacity: 0, y: -50, duration: 1, force3D: true }, 
        "+=0.5"
      );
    });
  }, containerRef);

  return () => ctx.revert(); // Cleanup
}, []);
```

### HTML Structure
```tsx
<section className="hero-parallax-item relative h-screen w-full overflow-hidden m-0">
  <div className="absolute inset-0 h-full w-full">
    <img
      src={collection.image}
      className="hero-parallax-image absolute top-0 left-0 w-full h-[120vh] object-cover object-center max-w-none"
      alt={collection.name}
    />
  </div>
  <div className="hero-parallax-content">
    <h2>{collection.name}</h2>
  </div>
</section>
```

## Troubleshooting Checklist

### Images Still Different Sizes?
- ✅ Check for global `max-width: 100%` on images - this breaks parallax
- ✅ Ensure `max-w-none` class is applied
- ✅ Verify `!important` flags in CSS are not being overridden

### Images Look Blurry?
- ✅ Request higher resolution from Shopify (width: 2000+)
- ✅ Check image compression settings
- ✅ Verify `object-fit: cover` is applied

### Empty Spaces Between Sections?
- ✅ Ensure sections have `margin: 0`
- ✅ Parent container should use `display: flex; flex-direction: column`
- ✅ Check for unwanted padding/margins in global styles

### Flickering Content?
- ✅ Verify single timeline approach (not separate fade in/out)
- ✅ Check `force3D: true` is applied
- ✅ Ensure proper cleanup with `ctx.revert()`

## The "Represent" Logic

### Container Requirements
- Every image container: exactly `100vh` and `100vw`
- Image inside: `120vh` tall (20% extra for parallax room)
- `object-cover` handles cropping automatically

### Animation Philosophy
- Images stay relatively still (pinned feel)
- Next section "reveals" like a curtain
- Content fades in/out smoothly in center
- Menu updates based on scroll position

## Resources
- YouTube: Search "Awwwards Rebuild: Represent Clo"
- Reddit: r/Frontend - "curtain reveal effect using GSAP"
- Shopify: "Hydrogen Image Component Object Cover"

## Status
✅ Double scrub issue fixed
✅ Image sizing uniformity implemented
✅ Pinned parallax effect applied
✅ Performance optimizations added
✅ Proper cleanup and memory management

---

**Updated:** January 28, 2026
**Status:** Technical corrections applied - Represent aesthetic achieved
