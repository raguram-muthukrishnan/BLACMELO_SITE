# Design Consistency Fix - Product Hero Section

## Issue Identified
The ProductHero component had been modified with a different accordion system (`.hero-info-sections`) that conflicted with the REPRESENT-style expandable sections implementation. This caused design inconsistencies.

## Changes Made

### 1. **Component State Management** ✅
Restored the correct state management for REPRESENT-style expandable sections:

```tsx
// BEFORE (Incorrect - generic accordion)
const [openAccordion, setOpenAccordion] = useState<string | null>('details');
const toggleAccordion = (id: string) => {
  setOpenAccordion(openAccordion === id ? null : id);
};

// AFTER (Correct - REPRESENT style)
const [openSection, setOpenSection] = useState<'product' | 'shipping' | null>(null);
const toggleSection = (section: 'product' | 'shipping') => {
  setOpenSection(openSection === section ? null : section);
};
```

**Why:** REPRESENT style uses specific section types with mutual exclusivity.

---

### 2. **Expandable Sections Structure** ✅
Replaced generic accordion with REPRESENT-style expandable sections:

```tsx
// BEFORE (Incorrect - generic accordion with 3 sections)
<div className="hero-info-sections">
  <div className="info-item">
    <button className="info-toggle">
      <span>Product Details</span>
      <span>{openAccordion === 'details' ? '−' : '+'}</span>
    </button>
    {openAccordion === 'details' && <div className="info-content">...</div>}
  </div>
  // ... more sections
</div>

// AFTER (Correct - REPRESENT style with 2 sections)
<div className="hero-expandable-sections">
  <div className="expandable-section">
    <button className="expandable-section-header">
      <span className="expandable-icon">+</span>
      <span className="expandable-title">Product Details</span>
    </button>
    {openSection === 'product' && <div className="expandable-content">...</div>}
  </div>
  <div className="expandable-section">
    <button className="expandable-section-header">
      <span className="expandable-icon">+</span>
      <span className="expandable-title">Shipping & Returns</span>
    </button>
    {openSection === 'shipping' && <div className="expandable-content">...</div>}
  </div>
</div>
```

**Key Differences:**
- Only 2 sections (Product Details, Shipping & Returns)
- Icon always shows `+` (not toggling between + and −)
- Button comes first, content conditionally renders below
- Uses specific class names for REPRESENT styling

---

### 3. **Added Missing CSS Styles** ✅

Added styles for components that were missing from `tailwind.css`:

#### **Thumbnails**
```css
.hero-thumbnails {
  display: none;
}

@media (min-width: 1024px) {
  .hero-thumbnails {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    width: 80px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
  }
}

.hero-thumbnail-item {
  width: 100%;
  aspect-ratio: 3/4;
  cursor: pointer;
  border: 1px solid transparent;
  opacity: 0.7;
}

.hero-thumbnail-item.active {
  border-color: #000;
  opacity: 1;
}
```

#### **Quantity Selector**
```css
.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  width: 120px;
  height: 40px;
}

.quantity-btn {
  background: transparent;
  border: none;
  color: #000;
  width: 33%;
  height: 100%;
  cursor: pointer;
}

.quantity-display {
  flex: 1;
  text-align: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
}
```

#### **Size Header**
```css
.size-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
}

.size-guide-btn {
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  font-size: 12px;
}
```

---

## Design Consistency Maintained ✅

### **Original Design Elements Preserved:**
1. ✅ Two-column layout (image left, details right)
2. ✅ Thumbnail navigation on desktop
3. ✅ Image gallery with crossfade transitions
4. ✅ Color swatches
5. ✅ Size selector grid
6. ✅ Quantity selector
7. ✅ Add to cart button
8. ✅ Benefits section
9. ✅ Fullscreen gallery

### **REPRESENT-Style Elements Restored:**
1. ✅ Upward-expanding sections
2. ✅ Two sections side-by-side (50/50)
3. ✅ Absolute positioning (no layout reflow)
4. ✅ Content wider than trigger
5. ✅ Smooth rise animation (0.28s ease-out)
6. ✅ Mutual exclusivity (only one open)
7. ✅ Minimal `+` icon (no toggle)
8. ✅ Mobile switches to downward accordion

---

## Functional Verification ✅

### **Component Functionality:**
- [x] Image gallery navigation works
- [x] Thumbnail selection works
- [x] Color selection updates variant
- [x] Size selection updates variant
- [x] Quantity selector increments/decrements
- [x] Add to cart button functional
- [x] Expandable sections toggle correctly
- [x] Only one section open at a time
- [x] Content expands upward on desktop
- [x] Content expands downward on mobile

### **Design Consistency:**
- [x] All original styles preserved
- [x] REPRESENT expandable sections work correctly
- [x] No CSS conflicts
- [x] No layout shifts
- [x] Responsive behavior intact

---

## Files Modified

1. **hydrogen-storefront/app/components/ProductHero.tsx**
   - Restored `openSection` state management
   - Replaced `.hero-info-sections` with `.hero-expandable-sections`
   - Fixed section structure (2 sections, button first)
   - Simplified icon (always `+`)

2. **hydrogen-storefront/app/styles/tailwind.css**
   - Added `.hero-thumbnails` styles
   - Added `.quantity-selector` styles
   - Added `.size-header` and `.size-guide-btn` styles
   - Maintained `.hero-expandable-sections` styles

---

## Testing Checklist

### Desktop (>1024px)
- [x] Thumbnails visible on left
- [x] Main image gallery works
- [x] Expandable sections rise upward
- [x] No layout reflow
- [x] All interactions functional

### Mobile (≤1024px)
- [x] Thumbnails hidden
- [x] Image gallery works
- [x] Expandable sections expand downward
- [x] All interactions functional

---

## Summary

The design consistency issue was caused by a conflicting accordion implementation that replaced the REPRESENT-style expandable sections. This fix:

1. **Restored** the correct REPRESENT-style expandable sections
2. **Preserved** all original design elements and functionality
3. **Added** missing CSS for thumbnails, quantity selector, and size header
4. **Maintained** responsive behavior for both desktop and mobile

The product hero section now has consistent design with fully functional REPRESENT-style upward-expanding sections while keeping all other features intact.

---

**Fixed Date:** January 27, 2026  
**Status:** ✅ Complete - Design consistency restored
