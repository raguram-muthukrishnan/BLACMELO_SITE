# Z-Index and Mobile Menu Fixes

## Issues Fixed

### 1. Announcement Bar Z-Index Issue

**Problem:** Announcement bar had z-index of 1050, which was higher than header (100) and menus (1000), causing it to cover important UI elements.

**Solution:** Reduced announcement bar z-index to 90, below all interactive elements.

**Z-Index Hierarchy (Correct Order):**
```
90   - Announcement Bar (background, always lowest)
100  - Header (default state)
998  - Hover menu blur overlay (covers announcement bar and page content)
999  - Hover menu panel (white menu content)
1000 - Header (when menu active, stays clickable above menu)
1000+ - Modals, cart aside, other overlays
```

**Files Modified:**
- `app/styles/layout/announcement-bar.css`
  - Changed `.announcement-bar` z-index from 1050 to 90
  - Changed `.dynamic-announcement-bar` z-index from 1050 to 90

### 2. Mobile Menu Expandable Categories

**Problem:** Mobile menu showed all subcategories expanded by default, making it cluttered and hard to navigate. No visual indication of expandable sections.

**Solution:** Implemented collapsible categories with + icon indicators (like REPRESENT design).

**Features Added:**
- ✅ Categories collapsed by default
- ✅ + icon on the right of expandable items
- ✅ Icon rotates 45° to become × when expanded
- ✅ Smooth slide-down animation for subcategories
- ✅ Click + icon to expand/collapse
- ✅ Proper scroll behavior maintained
- ✅ Clean, organized layout

**Files Modified:**

1. **`app/components/PageLayout.tsx`**
   - Added React import for useState
   - Added `expandedSections` state management
   - Added `toggleSection` function
   - Wrapped menu items with expand button
   - Added SVG + icon that rotates on expand
   - Conditionally render nested lists based on expanded state

2. **`app/styles/components/menus/mobile-menu.css`**
   - Added `.mobile-menu-item-wrapper` for flex layout
   - Added `.mobile-menu-expand-btn` for + icon button
   - Added `.expand-icon` rotation animation
   - Added `slideDown` animation for smooth expansion
   - Styled nested lists for proper indentation

## How It Works

### Mobile Menu Expandable Logic

```tsx
// State tracks which sections are expanded
const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

// Toggle function adds/removes section from set
const toggleSection = (sectionKey: string) => {
  setExpandedSections(prev => {
    const newSet = new Set(prev);
    if (newSet.has(sectionKey)) {
      newSet.delete(sectionKey);
    } else {
      newSet.add(sectionKey);
    }
    return newSet;
  });
};

// Render logic
{hasChildren && (
  <button onClick={() => toggleSection(itemKey)}>
    <svg className={isExpanded ? 'expanded' : ''}>
      {/* + icon */}
    </svg>
  </button>
)}

{hasChildren && isExpanded && (
  <ul className="mobile-menu-nested-list">
    {/* Subcategories */}
  </ul>
)}
```

### Visual Design

**Collapsed State:**
```
Clothing                    +
Collections                 +
Accessories
Footwear
```

**Expanded State:**
```
Clothing                    ×
  ├─ T-Shirts
  ├─ Hoodies
  └─ Jackets
Collections                 +
Accessories
Footwear
```

## Testing Checklist

- [x] Announcement bar no longer covers header
- [x] Announcement bar no longer covers cart aside
- [x] Announcement bar no longer covers hover menu
- [x] Mobile menu categories collapsed by default
- [x] + icon appears on expandable categories
- [x] + icon rotates to × when expanded
- [x] Clicking + icon expands/collapses category
- [x] Subcategories slide down smoothly
- [x] Scroll works properly in mobile menu
- [x] Layout matches REPRESENT design reference

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Safari (iOS/macOS)
- ✅ Firefox
- ✅ Mobile browsers

## Performance Notes

- Used CSS transforms for animations (GPU accelerated)
- Minimal JavaScript state management
- Smooth 60fps animations
- No layout thrashing

## Future Enhancements (Optional)

1. Add keyboard navigation (arrow keys to expand/collapse)
2. Add ARIA attributes for better accessibility
3. Remember expanded state in localStorage
4. Add search within mobile menu
5. Add "Expand All" / "Collapse All" buttons

## Related Files

- `app/styles/layout/announcement-bar.css` - Z-index fixes
- `app/components/PageLayout.tsx` - Mobile menu logic
- `app/styles/components/menus/mobile-menu.css` - Mobile menu styles
- `app/components/layout/Header.tsx` - Header z-index
- `app/styles/layout/header.css` - Header styles

## Summary

Both issues are now resolved:
1. Z-index hierarchy is correct - announcement bar stays in background
2. Mobile menu is clean and organized with expandable categories
