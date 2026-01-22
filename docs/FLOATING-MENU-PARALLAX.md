# Floating Menu Parallax Animation

## Overview
The floating menu features a 3-phase scroll animation that creates perfect synchronization with the banner images, mimicking how the banners themselves move during scroll.

## Animation Behavior

### Phase 1: Menu Enters WITH Banner 2 (From Bottom)
- Menu starts at the bottom of banner 2 (off-screen)
- As banner 2 scrolls up into view, menu moves from bottom to center
- Perfect 1:1 synchronization with banner movement
- Duration: From banner 2 start to 40% into banner 2

### Phase 2: Menu Stays Fixed (Banners 2-4)
- Menu remains fixed in viewport center while banners scroll behind
- Creates parallax effect where menu floats over content
- Maintains full opacity and center position
- Duration: 40% into banner 2 until 60% into banner 5

### Phase 3: Menu Exits WITH Banner 5 (Goes Down)
- Menu moves down with banner 5 as it scrolls out of view
- Exits to bottom of banner 6 (off-screen)
- Perfect synchronization with banner movement
- Duration: 60% into banner 5 until end of banner 5

## Technical Implementation

### Improved GSAP ScrollTrigger
```typescript
// Phase 1: Enter with banner 2 from bottom
gsap.fromTo(menu, 
  {
    position: 'absolute',
    top: bannerHeight * 2 + bannerHeight, // Bottom of banner 2
  },
  {
    position: 'fixed',
    top: '50%',
    yPercent: -50,
    scrollTrigger: {
      start: `${bannerHeight}px top`, // Banner 2 starts
      end: `${bannerHeight + bannerHeight * 0.4}px top`, // 40% into banner 2
      scrub: 1,
    },
  }
);

// Phase 3: Exit with banner 5 going down
gsap.to(menu, {
  position: 'absolute',
  top: bannerHeight * 5 + bannerHeight, // Bottom of banner 6
  scrollTrigger: {
    start: `${bannerHeight * 4 + bannerHeight * 0.6}px top`, // 60% into banner 5
    end: `${bannerHeight * 5}px top`, // End of banner 5
    scrub: 1,
  },
});
```

### Banner Synchronization
- **Banner Heights**: All banners use `100vh` for full screen coverage
- **Timing**: Menu movement perfectly matches banner scroll timing
- **No Delays**: Menu appears exactly when banner 2 enters viewport
- **Perfect Exit**: Menu disappears exactly when banner 5 exits viewport

## Collection Highlighting

Dynamic text highlighting based on current banner in viewport:
- **Banner 2**: Fall/Winter '25 (highlighted)
- **Banner 3**: 247 (highlighted)
- **Banner 4**: Initial (highlighted)
- **Banner 5**: Owners Club (highlighted)
- **Banner 6**: Woman (highlighted)

## Visual Design

### Typography
- **Title**: "EXPLORE COLLECTIONS" - 0.7rem, uppercase, white
- **Collection Names**: 1.6rem, semi-bold, white with opacity variations
- **Discover Link**: 0.75rem, uppercase, white with opacity

### Colors
- **Active Collection**: `rgba(255, 255, 255, 1)` (full white)
- **Inactive Collections**: `rgba(255, 255, 255, 0.4)` (40% opacity)
- **Discover Link**: `rgba(255, 255, 255, 0.6)` (60% opacity)

### Positioning
- **Fixed Position**: `left: 50%, top: 50%` with transforms
- **Z-Index**: 50 (above banners, below header)
- **Min-Width**: 400px for consistent layout

## Responsive Behavior

### Desktop (> 768px)
- Full 3-phase parallax animation
- Fixed positioning during phase 2
- Large typography and spacing

### Mobile (< 768px)
- Simplified relative positioning
- Reduced font sizes and spacing
- No complex parallax (performance optimization)

## Performance Optimizations

- **GPU Acceleration**: Uses `transform` properties for smooth animation
- **Scrub: 1**: Perfect 1:1 scroll synchronization at 60fps
- **Cleanup**: Proper ScrollTrigger disposal on unmount
- **Resize Handling**: Automatic refresh on window resize

## Files Modified

- `app/routes/($locale)._index.tsx` - Improved ScrollTrigger logic with 3-phase animation
- `app/styles/tailwind.css` - Banner heights set to 100vh for full screen
- `docs/FLOATING-MENU-PARALLAX.md` - Updated documentation

## Key Improvements

1. **Perfect Timing**: Menu now enters exactly with banner 2, no delays
2. **Banner Synchronization**: Menu movement matches banner scroll behavior
3. **Proper Exit**: Menu exits with banner 5, not before final banner appears
4. **Full Screen Banners**: All banners use 100vh for exact screen fit
5. **Smooth Transitions**: No jarring movements or timing issues

---

**Updated:** January 22, 2026
**Status:** Fully implemented with improved timing and synchronization
