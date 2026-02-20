# Quick Start Checklist - Dynamic Header Menus

Use this checklist to activate dynamic header menus in your Shopify store.

## ✅ Pre-Implementation (Already Done)

- [x] Code implementation complete
- [x] TypeScript types defined
- [x] GraphQL queries created
- [x] Parser functions implemented
- [x] Fallback system in place
- [x] All files compile without errors

## 📋 Shopify Setup (You Need to Do)

### Step 1: Create Collection Metafields

Go to: **Shopify Admin → Settings → Custom Data → Collections → Add definition**

Create these 5 metafields:

- [ ] **Menu Category**
  - Namespace and key: `menu.category`
  - Type: Single line text
  - Description: "Which menu this appears in (man, women, blacmelo)"

- [ ] **Menu Section**
  - Namespace and key: `menu.section`
  - Type: Single line text
  - Description: "Section within the menu (top, featured, shop)"

- [ ] **Menu Order**
  - Namespace and key: `menu.order`
  - Type: Integer
  - Description: "Display order (1, 2, 3, etc.)"

- [ ] **Display Bold**
  - Namespace and key: `menu.is_bold`
  - Type: True/False
  - Description: "Show in bold font"

- [ ] **Menu Label** (Optional)
  - Namespace and key: `menu.label`
  - Type: Single line text
  - Description: "Custom label (if different from collection title)"

### Step 2: Configure Collections for "Man" Menu

#### Top Section (Bold Items)
- [ ] **New Arrivals Collection**
  - menu.category: `man`
  - menu.section: `top`
  - menu.order: `1`
  - menu.is_bold: `true`

- [ ] **Bestsellers Collection**
  - menu.category: `man`
  - menu.section: `top`
  - menu.order: `2`
  - menu.is_bold: `true`

- [ ] **Shop All Collection**
  - menu.category: `man`
  - menu.section: `top`
  - menu.order: `3`
  - menu.is_bold: `true`

#### Featured Section
- [ ] **Fall Winter '25 Collection**
  - menu.category: `man`
  - menu.section: `featured`
  - menu.order: `1`
  - menu.is_bold: `false`

- [ ] **Owners Club Collection**
  - menu.category: `man`
  - menu.section: `featured`
  - menu.order: `2`
  - menu.is_bold: `false`

- [ ] **247 Collection**
  - menu.category: `man`
  - menu.section: `featured`
  - menu.order: `3`
  - menu.is_bold: `false`

#### Shop Section
- [ ] **Clothing Collection**
  - menu.category: `man`
  - menu.section: `shop`
  - menu.order: `1`
  - menu.is_bold: `false`

- [ ] **Footwear Collection**
  - menu.category: `man`
  - menu.section: `shop`
  - menu.order: `2`
  - menu.is_bold: `false`

- [ ] **Accessories Collection**
  - menu.category: `man`
  - menu.section: `shop`
  - menu.order: `3`
  - menu.is_bold: `false`

### Step 3: Configure Collections for "Women" Menu

Repeat the same process with `menu.category: women`

- [ ] Configure top section collections
- [ ] Configure featured section collections
- [ ] Configure shop section collections

### Step 4: Configure Collections for "Blacmelo+" Menu

Repeat the same process with `menu.category: blacmelo`

- [ ] Configure exclusive collections
- [ ] Configure special collections

## 🧪 Testing

- [ ] Restart dev server: `npm run dev`
- [ ] Navigate to your site
- [ ] Hover over "Man" in header
  - [ ] Menu appears
  - [ ] Collections display correctly
  - [ ] Bold items are bold
  - [ ] Sections are labeled correctly
  - [ ] Links work
- [ ] Hover over "Women" in header
  - [ ] Menu appears with women's collections
- [ ] Hover over "Blacmelo+" in header
  - [ ] Menu appears with blacmelo collections
- [ ] Check browser console
  - [ ] No errors
  - [ ] Menu data loads successfully

## 🔍 Verification

- [ ] All collections appear in correct menus
- [ ] Order is correct (based on menu.order)
- [ ] Bold styling applied correctly
- [ ] Section labels display correctly
- [ ] All links navigate to correct collections
- [ ] Menu images display (if configured)
- [ ] Fallback works if metafields missing

## 📚 Documentation Reference

If you need help:

- **Quick Reference:** `HEADER-MENU-QUICK-REFERENCE.md`
- **Complete Guide:** `DYNAMIC-HEADER-MENU-GUIDE.md`
- **Visual Diagram:** `MENU-SYSTEM-DIAGRAM.md`
- **Code Changes:** `ROOT-TSX-CHANGES.md`
- **Implementation Summary:** `IMPLEMENTATION-SUMMARY.md`

## 🐛 Troubleshooting

### Issue: Menus not showing
- [ ] Check metafield namespace is exactly `menu`
- [ ] Verify collections have metafields set
- [ ] Check browser console for errors
- [ ] Clear cache and restart dev server

### Issue: Wrong order
- [ ] Check `menu.order` values (1, 2, 3...)
- [ ] Ensure no duplicate order numbers

### Issue: Collections missing
- [ ] Ensure both `menu.category` and `menu.section` are set
- [ ] Verify collections are published
- [ ] Check collection handles are correct

### Issue: Fallback menus showing
- [ ] This is normal if metafields aren't set yet
- [ ] Complete Shopify setup steps above
- [ ] Restart dev server after setting metafields

## ✨ Success Criteria

You'll know it's working when:

✅ Hovering over header links shows dynamic menus  
✅ Menus display your actual Shopify collections  
✅ Adding/removing collections in Shopify updates menus automatically  
✅ No code changes needed to update menu content  
✅ Fallback menus work if metafields aren't set  

## 🎉 Next Steps

Once everything is working:

1. Add more collections to your menus
2. Experiment with different section arrangements
3. Update menu.order to reorder items
4. Add custom menu.label values for special names
5. Consider adding menu images via metafields

## 💡 Tips

- Start with one menu (e.g., "Man") to test
- Use consistent naming for collections
- Keep menu.order sequential (1, 2, 3...)
- Test after each collection configuration
- Use menu.label for custom display names

---

**Current Status:** Code is ready, waiting for Shopify metafield configuration.

**Estimated Setup Time:** 15-30 minutes for all three menus.

**Difficulty:** Easy - just filling in metafield values in Shopify admin.
