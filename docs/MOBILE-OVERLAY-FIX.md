# Mobile Overlay Centering Fix

## Issue
On mobile devices, the banner overlay buttons, titles, and text were not properly centered on the screen.

## Root Cause
The `.banner-overlay-buttons` container in mobile view had `width: 100%` but was missing the `align-items: center` property to center the buttons within the flex container. Additionally, the buttons themselves needed `text-align: center` to ensure the text was centered.

## Solution
Updated `hydrogen-storefront/app/styles/pages/home.css` in the mobile media query section:

```css
@media (max-width: 768px) {
  .banner-overlay-buttons {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    align-items: center; /* Added to center buttons */
  }

  .banner-overlay-btn {
    padding: 12px 24px;
    font-size: 10px;
    width: 100%;
    max-width: 280px;
    text-align: center; /* Added to center button text */
  }
}
```

## Changes Made
1. Added `align-items: center` to `.banner-overlay-buttons` for mobile
2. Added `text-align: center` to `.banner-overlay-btn` for mobile

## Components Affected
- `EditorialBanner.tsx` - Uses banner overlay
- `EditorialVideo.tsx` - Uses banner overlay

## Testing
Test on mobile devices (max-width: 768px) to verify:
- Overlay label is centered
- Overlay title is centered
- Buttons are centered horizontally
- Button text is centered within buttons
