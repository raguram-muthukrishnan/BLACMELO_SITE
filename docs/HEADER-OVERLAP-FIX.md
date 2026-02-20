# Header Overlap Fix - Product Hero Section

## Issue Identified
The product hero section was overlapping with the fixed header, causing a "double header" visual issue. The `.hero-product` section was set to `height: 100vh` without accounting for the 44px fixed header at the top.

## Root Cause
- The BLACMELO header is `position: fixed` with `height: 44px`
- The `.hero-product` section was using `height: 100vh` (full viewport height)
- This caused the product hero to start at the top of the viewport, behind the header
- Result: Header overlapped the product content

## Solution Applied

### 1. **Adjusted Hero Product Height** ✅
```css
/* BEFORE */
.hero-product {
  height: 100vh;
}

/* AFTER */
.hero-product {
  height: calc(100vh - 44px);  /* Account for header height */
  margin-top: 44px;  /* Offset for fixed header */
}
```

**Why:** 
- `calc(100vh - 44px)` ensures the hero section fits below the header
- `margin-top: 44px` pushes the content down to start below the fixed header

---

### 2. **Adjusted Hero Left Height** ✅
```css
/* BEFORE */
.hero-left { 
  height: 100vh;
}

/* AFTER */
.hero-left { 
  height: calc(100vh - 44px);  /* Account for header height */
}
```

**Why:** The left image gallery should match the adjusted hero product height.

---

### 3. **Mobile Responsive** ✅
```css
@media (max-width: 1024px) {
  .hero-product { 
    margin-top: 44px;  /* Keep header offset on mobile */
  }
}
```

**Why:** Mobile also has the fixed header, so the offset is needed.

---

## Visual Result

### Before Fix:
```
┌─────────────────────────────┐
│ BLACMELO Header (44px)      │ ← Fixed header
├─────────────────────────────┤
│ Product Hero (100vh)        │ ← Started at top, overlapped header
│                             │
│ [Image]      [Details]      │
│                             │
└─────────────────────────────┘
```

### After Fix:
```
┌─────────────────────────────┐
│ BLACMELO Header (44px)      │ ← Fixed header
├─────────────────────────────┤ ← margin-top: 44px
│ Product Hero (calc(100vh-44))│ ← Starts below header
│                             │
│ [Image]      [Details]      │
│                             │
└─────────────────────────────┘
```

---

## Header Specifications

From the CSS:
```css
.blacmelo-header {
  width: 100%;
  height: 44px;
  background: transparent;
  border-bottom: none;
  position: fixed;  /* Fixed at top */
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
```

**Key Properties:**
- Height: `44px`
- Position: `fixed` (always at top)
- Z-index: `100` (above content)

---

## Layout Structure

```
root.tsx
└── PageLayout
    ├── Header (fixed, 44px)
    └── main
        └── Outlet
            └── Product Page
                └── ProductHero (.hero-product)
```

The header is rendered in `PageLayout` and is fixed at the top, so all page content needs to account for its height.

---

## Testing Verification

### Desktop (>1024px)
- [x] Header visible at top
- [x] Product hero starts below header
- [x] No overlap
- [x] Full viewport height utilized (minus header)
- [x] Image gallery height correct

### Mobile (≤1024px)
- [x] Header visible at top
- [x] Product hero starts below header
- [x] No overlap
- [x] Responsive layout works

---

## Files Modified

1. **hydrogen-storefront/app/styles/tailwind.css**
   - `.hero-product`: Added `calc(100vh - 44px)` and `margin-top: 44px`
   - `.hero-left`: Added `calc(100vh - 44px)`
   - Mobile media query: Added `margin-top: 44px`

---

## Related Components

- **Header**: `hydrogen-storefront/app/components/layout/Header.tsx`
- **PageLayout**: `hydrogen-storefront/app/components/PageLayout.tsx`
- **ProductHero**: `hydrogen-storefront/app/components/ProductHero.tsx`

---

## Design Consistency Maintained ✅

- ✅ Header remains fixed at top
- ✅ Product hero section properly positioned
- ✅ No visual overlap
- ✅ Full viewport height utilized
- ✅ REPRESENT-style expandable sections still work
- ✅ All other design elements intact
- ✅ Responsive behavior preserved

---

**Fixed Date:** January 27, 2026  
**Issue:** Header overlap causing "double header" appearance  
**Status:** ✅ Complete - Header and content properly aligned
