# Hover Menu Z-Index Fix

## Issue
The hover menu was overlapping the header and covering the navigation links, making them unclickable.

## Root Cause
The hover menu had a z-index of 150, which was higher than the header's z-index of 100, causing it to appear on top of the header instead of below it.

## Solution
Changed the hover menu z-index from 150 to 50, ensuring proper layering:

```css
.unified-hover-menu-overlay {
  position: fixed;
  top: 80px;
  left: 0;
  width: 50vw;
  height: calc(100vh - 80px);
  z-index: 50; /* Changed from 150 to 50 */
  background: white;
  pointer-events: auto;
  display: flex;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
  will-change: opacity;
}
```

## Z-Index Hierarchy

Now the proper stacking order is:

1. **Announcement Bar**: z-index 200 (top layer)
2. **Header**: z-index 100 (middle layer)
3. **Hover Menu**: z-index 50 (below header)

## Positioning

### With Announcement Bar
- Announcement bar: `top: 0` (36px height)
- Header: `top: 36px` (44px height)
- Hover menu: `top: 80px` (36px + 44px)

### Without Announcement Bar
- Header: `top: 0` (44px height)
- Hover menu: `top: 44px`

## Visual Behavior

✅ **Before Fix**: Menu appeared on top of header, covering navigation links
✅ **After Fix**: Menu appears below header, header remains fully visible and clickable

## Files Modified

- `hydrogen-storefront/app/styles/tailwind.css`
  - Changed `.unified-hover-menu-overlay` z-index from 150 to 50

## Testing

- [x] Menu appears below header
- [x] Header links remain clickable when menu is open
- [x] Header elements turn black when menu is active
- [x] Menu positioning correct with announcement bar
- [x] Menu positioning correct without announcement bar
- [x] No visual overlap or covering
