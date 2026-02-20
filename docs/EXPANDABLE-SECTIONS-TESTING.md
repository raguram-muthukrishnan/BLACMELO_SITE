# Expandable Sections - Visual Testing Guide

## How to Verify REPRESENT-Style Behavior

### ✅ Test 1: Upward Expansion (CRITICAL)

**Action:** Click "Product Details" button

**Expected Behavior:**
1. Content panel appears ABOVE the button
2. Panel rises upward with smooth animation (0.28s)
3. Button stays in exact same position
4. Content below button doesn't move at all
5. Panel is wider than the button

**Visual Check:**
```
Before Click:          After Click:
                       ┌─────────────────────────┐
                       │ Product details text... │
                       │ More content here...    │
                       └─────────────────────────┘
┌──────────────┐       ┌──────────────┐
│ + Product... │  →    │ + Product... │  ← Button didn't move!
└──────────────┘       └──────────────┘
```

**❌ FAIL if:**
- Content appears below button
- Button moves up
- Layout shifts
- Content is same width as button

---

### ✅ Test 2: No Layout Reflow

**Action:** Open expandable section

**Expected Behavior:**
1. Elements below the expandable sections stay in exact same position
2. No scrollbar appears
3. No content jumps or shifts
4. Page height doesn't change

**Visual Check:**
- Mark the position of an element below (e.g., footer)
- Open expandable section
- Element should be in EXACT same position

**❌ FAIL if:**
- Anything moves
- Scrollbar appears
- Page gets taller

---

### ✅ Test 3: Mutual Exclusivity

**Action:** 
1. Click "Product Details" (opens)
2. Click "Shipping & Returns"

**Expected Behavior:**
1. Product Details closes smoothly
2. Shipping & Returns opens smoothly
3. Only one panel visible at a time
4. Smooth transition between states

**❌ FAIL if:**
- Both panels open simultaneously
- Panels overlap
- Abrupt closing/opening

---

### ✅ Test 4: Toggle Behavior

**Action:**
1. Click "Product Details" (opens)
2. Click "Product Details" again

**Expected Behavior:**
1. Panel closes smoothly
2. Fades out with same animation timing
3. Button stays in place

**❌ FAIL if:**
- Panel doesn't close
- Abrupt disappearance
- Button moves

---

### ✅ Test 5: Width & Offset

**Action:** Open any expandable section

**Expected Behavior:**
1. Panel is visibly wider than the button
2. Panel extends beyond button edges
3. Left edge aligns with button's left edge
4. Right edge extends past button's right edge

**Visual Measurement:**
- Button width: ~50% of container
- Panel width: ~50% + 260px
- Max width: 500px

**❌ FAIL if:**
- Panel is same width as button
- Panel is perfectly centered
- Panel clips at viewport edge

---

### ✅ Test 6: Animation Quality

**Action:** Open expandable section slowly (watch carefully)

**Expected Behavior:**
1. Panel fades in (opacity 0 → 1)
2. Panel rises upward (translateY 10px → 0)
3. Duration feels like ~0.3 seconds
4. Easing is smooth (ease-out)
5. No bounce or elastic effect

**❌ FAIL if:**
- Animation is instant
- Panel slides from side
- Bouncy or elastic motion
- Too fast (<0.2s) or too slow (>0.4s)

---

### ✅ Test 7: Hover Behavior

**Action:** Hover over button (don't click)

**Expected Behavior:**
1. Button opacity reduces to 0.7
2. No background color change
3. No border change
4. No movement
5. Smooth transition

**❌ FAIL if:**
- Background color changes
- Button moves
- Border appears
- Abrupt opacity change

---

### ✅ Test 8: Visual Hierarchy

**Action:** Open expandable section and inspect visually

**Expected Behavior:**
1. Pure white background (#ffffff)
2. Top border visible (1px solid #e5e5e5)
3. Subtle shadow underneath panel
4. Text is readable (12px, line-height 1.7)
5. Panel feels "floating" above page

**❌ FAIL if:**
- Background is gray or transparent
- No border
- No shadow
- Text too small or cramped
- Panel feels embedded in page

---

### ✅ Test 9: Mobile Behavior (≤1024px)

**Action:** Resize browser to mobile width, click expandable

**Expected Behavior:**
1. Sections stack vertically
2. Content expands DOWNWARD (not upward)
3. Normal accordion behavior
4. Smooth height animation
5. Full width panels

**❌ FAIL if:**
- Still expands upward on mobile
- Panels side-by-side
- Clipping or overflow
- Abrupt expansion

---

### ✅ Test 10: Z-Index & Layering

**Action:** Open expandable section

**Expected Behavior:**
1. Panel appears above all other content
2. Panel doesn't go behind header
3. Panel doesn't clip at container edges
4. Panel is fully visible

**❌ FAIL if:**
- Panel goes behind other elements
- Panel is partially hidden
- Panel clips unexpectedly

---

## Quick Visual Checklist

Open the product page and verify:

- [ ] Click button → content rises upward
- [ ] Button never moves
- [ ] Layout below stays fixed
- [ ] Panel wider than button
- [ ] Only one panel open at a time
- [ ] Smooth 0.28s animation
- [ ] Opacity + translateY motion
- [ ] White background with top border
- [ ] Hover reduces opacity to 0.7
- [ ] Mobile switches to downward expansion

---

## Common Issues & Fixes

### Issue: Content appears below button
**Fix:** Check `position: absolute` and `bottom: 100%` on `.expandable-content`

### Issue: Button moves when opening
**Fix:** Ensure `.expandable-section` has `position: relative`

### Issue: Layout shifts
**Fix:** Verify content is `position: absolute` (not static or relative)

### Issue: Panel same width as button
**Fix:** Check `width: calc(100% + 260px)` on `.expandable-content`

### Issue: No animation
**Fix:** Verify `@keyframes riseUpward` is defined and applied

### Issue: Both panels open
**Fix:** Check toggle logic in component state management

---

## Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

**Last Updated:** January 27, 2026
