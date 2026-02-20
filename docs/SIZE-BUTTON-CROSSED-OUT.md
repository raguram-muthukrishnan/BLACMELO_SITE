# Size Button Crossed-Out Effect

## Overview
Added diagonal line (cross) styling for unavailable/disabled size buttons to match the reference design.

## Implementation

### CSS Changes (`tailwind.css`)

#### Desktop Styles
- Added `position: relative` to `.size-btn` for pseudo-element positioning
- Created `.size-btn.disabled::before` pseudo-element with diagonal line (bottom-left to top-right)
- Created `.size-btn.disabled::after` pseudo-element with diagonal line (top-left to bottom-right)
- Used CSS `linear-gradient` to create clean diagonal lines forming an X
- Line color: `#ccc` (light gray) matching the disabled text color
- Line thickness: 2px (1px on each side of center)

#### Mobile Styles
- Thinner diagonal lines (1px total) for smaller buttons
- Maintains same X-shaped visual effect with better proportions on mobile

## Visual Effect

### Available Size
```
┌─────────┐
│    M    │
└─────────┘
```

### Unavailable Size (X-Crossed Out)
```
┌─────────┐
│  ╲ M ╱  │
│  ╱   ╲  │
└─────────┘
```

## Technical Details

The X-shaped cross is created using two CSS linear-gradients:
- `::before`: Diagonal line from bottom-left to top-right
- `::after`: Diagonal line from top-left to bottom-right
- Each creates a 2px line in the center using gradient stops
- `pointer-events: none` ensures the lines don't interfere with clicks
- Both pseudo-elements overlay to form a perfect X

## Browser Compatibility
- Works in all modern browsers
- Uses standard CSS properties (no vendor prefixes needed)
- Fallback: If gradient not supported, button still shows as disabled with opacity

## Testing
1. Find a product with some sizes out of stock
2. Verify unavailable sizes show X-shaped cross (diagonal lines from both corners)
3. Check on desktop (2px lines)
4. Check on mobile (1px lines)
5. Ensure lines don't interfere with text readability
6. Verify hover states don't apply to disabled buttons
7. Confirm both diagonal lines form a clear X pattern
