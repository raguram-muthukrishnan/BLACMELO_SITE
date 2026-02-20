# REPRESENT-Style Expandable Sections Implementation

## Overview
Implemented the Product Details and Shipping & Returns expandable sections to match REPRESENT's exact behavior - upward expansion with architectural precision.

## ✅ Critical Implementation Details

### 1. Positioning Model (Mandatory)

**Container:**
```css
.hero-expandable-sections {
  position: relative;  /* Creates positioning context */
  display: flex;
  border-top: 1px solid #e5e5e5;
}
```

**Section:**
```css
.expandable-section {
  flex: 1;
  position: relative;  /* CRITICAL: Each section is positioned */
  overflow: visible;   /* Allows content to float above */
}
```

**Content Panel:**
```css
.expandable-content {
  position: absolute;  /* NOT in document flow */
  bottom: 100%;        /* Anchored to bottom of parent */
  left: 0;             /* Aligned to left edge */
  z-index: 100;        /* Floats above everything */
}
```

**Result:** Content floats above, header never moves, no layout reflow.

---

### 2. Expansion Direction (UPWARD ONLY)

```css
@keyframes riseUpward {
  from {
    opacity: 0;
    transform: translateY(10px);  /* Starts 10px below */
  }
  to {
    opacity: 1;
    transform: translateY(0);     /* Rises to final position */
  }
}

.expandable-content {
  animation: riseUpward 0.28s ease-out forwards;
}
```

**Behavior:**
- Content rises from below its final position
- No downward growth
- No pushing of surrounding elements
- Panel visually floats upward like a drawer

---

### 3. Width & Editorial Offset

```css
.expandable-content {
  width: calc(100% + 260px);  /* Extends beyond trigger */
  max-width: 500px;           /* Maximum width cap */
  left: 0;                    /* Slight left offset (not centered) */
}
```

**Design Intent:**
- Content is wider than the trigger button
- Creates editorial magazine callout feel
- Intentional offset (not perfectly centered)
- Premium, architectural appearance

---

### 4. Animation Specification (Exact)

```css
.expandable-content {
  animation: riseUpward 0.28s ease-out forwards;
}

@keyframes riseUpward {
  from {
    opacity: 0;              /* Fade in */
    transform: translateY(10px);  /* Rise up */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Motion Language:**
- ✅ Opacity: 0 → 1
- ✅ Transform: translateY(10px) → translateY(0)
- ✅ Duration: 0.28s
- ✅ Easing: ease-out
- ❌ No scale
- ❌ No bounce
- ❌ No elastic easing

---

### 5. Interaction Logic

**Component State:**
```tsx
const [openSection, setOpenSection] = useState<'product' | 'shipping' | null>(null);

const toggleSection = (section: 'product' | 'shipping') => {
  setOpenSection(openSection === section ? null : section);
};
```

**Behavior:**
- Only one section open at a time
- Clicking same section → closes it
- Clicking other section → closes current, opens new
- Icon stays as `+` (minimal, no morphing)

---

### 6. Visual Hierarchy

```css
.expandable-content {
  background: #ffffff;           /* Pure white */
  border-top: 1px solid #e5e5e5; /* Top border only */
  padding: 20px 16px 32px;       /* Asymmetric padding */
  font-size: 12px;               /* Body size */
  line-height: 1.7;              /* Comfortable reading */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);  /* Subtle lift */
}
```

**Design:**
- Pure white background
- Top border only (light gray)
- Subtle shadow for depth
- Comfortable typography
- Feels detached from page, not embedded

---

### 7. Desktop vs Mobile

**Desktop (>1024px):**
```css
.expandable-content {
  position: absolute;
  bottom: 100%;
  animation: riseUpward 0.28s ease-out forwards;
}
```
- Upward-floating behavior only
- Content out of document flow

**Mobile (≤1024px):**
```css
@media (max-width: 1024px) {
  .expandable-content {
    position: static;  /* Back in document flow */
    animation: expandDownMobile 0.28s ease-out forwards;
  }

  @keyframes expandDownMobile {
    from {
      opacity: 0;
      max-height: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
    to {
      opacity: 1;
      max-height: 500px;
      padding-top: 20px;
      padding-bottom: 32px;
    }
  }
}
```
- Switches to standard downward accordion
- Different animation (height-based)
- Desktop logic NOT reused

---

## ✅ Validation Checklist

- ✅ Header button does not move
- ✅ Layout below never shifts
- ✅ Content floats above (position: absolute, bottom: 100%)
- ✅ Panel is wider than trigger (calc(100% + 260px))
- ✅ Animation rises upward (translateY(10px → 0))
- ✅ Only one section open at once
- ✅ Opacity-only hover (0.7)
- ✅ Pure white background with top border
- ✅ Mobile switches to downward accordion

---

## Component Structure

```tsx
<div className="hero-expandable-sections">
  <div className="expandable-section">
    <button 
      className="expandable-section-header"
      onClick={() => toggleSection('product')}
    >
      <span className="expandable-icon">+</span>
      <span className="expandable-title">Product Details</span>
    </button>
    {openSection === 'product' && (
      <div className="expandable-content">
        <p>{product.description}</p>
      </div>
    )}
  </div>

  <div className="expandable-section">
    <button 
      className="expandable-section-header"
      onClick={() => toggleSection('shipping')}
    >
      <span className="expandable-icon">+</span>
      <span className="expandable-title">Shipping & Returns</span>
    </button>
    {openSection === 'shipping' && (
      <div className="expandable-content">
        <p>Free shipping on orders over $300...</p>
      </div>
    )}
  </div>
</div>
```

---

## What This Is NOT ❌

- ❌ Not a standard accordion (no height animation in desktop)
- ❌ Not pushing content down (absolute positioning)
- ❌ Not centered modal (left-aligned with offset)
- ❌ Not dropdown (upward expansion)
- ❌ Not tooltip (larger, editorial panel)
- ❌ Not animated height only (opacity + transform)

---

## Key Differences from Standard Accordion

| Standard Accordion | REPRESENT Style |
|-------------------|-----------------|
| `position: static` | `position: absolute` |
| Expands downward | Expands upward |
| Pushes content below | Floats above, no reflow |
| Same width as trigger | Wider than trigger |
| Height animation | Opacity + transform |
| In document flow | Out of document flow |

---

## Files Modified

1. **hydrogen-storefront/app/components/ProductHero.tsx**
   - Correct button/content order
   - Simplified icon (always `+`)
   - Toggle logic for mutual exclusivity

2. **hydrogen-storefront/app/styles/tailwind.css**
   - `.expandable-section`: `position: relative`
   - `.expandable-content`: `position: absolute`, `bottom: 100%`, `left: 0`
   - Width: `calc(100% + 260px)`
   - Animation: `riseUpward` with opacity + translateY
   - Mobile: separate `expandDownMobile` animation

---

## Testing Verification

### Desktop (>1024px)
- [x] Click "Product Details" → panel rises upward
- [x] Header button stays fixed
- [x] Layout below doesn't shift
- [x] Panel is wider than button
- [x] Click "Shipping & Returns" → first closes, second opens
- [x] Click same section again → closes smoothly
- [x] Hover header → opacity reduces to 0.7

### Mobile (≤1024px)
- [x] Sections stack vertically
- [x] Content expands downward (normal accordion)
- [x] Smooth height animation
- [x] No upward floating behavior

---

**Implementation Date:** January 27, 2026  
**Reference:** REPRESENT product page expandable sections  
**Status:** ✅ Complete and verified - Upward floating behavior confirmed
