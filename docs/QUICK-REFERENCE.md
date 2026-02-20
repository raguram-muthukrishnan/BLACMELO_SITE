# Dynamic Header - Quick Reference Card

## 🎯 What Changed

### Header Left (Simplified)
```
Before: Man | Women | Blacmelo +
After:  Shop | Blacmelo Club
```

### Menu System
- **3 Permanent**: Shop All, Best Seller, New Arrival
- **Dynamic**: From Shopify collections (unlimited)
- **Updates**: Automatic when collections change

---

## ⚡ Quick Setup (15 minutes)

### 1. Shopify Metafields (5 min)
**Settings → Custom Data → Collections**

Create 3 metafields:
- `custom.menu_enabled` (True/False)
- `custom.menu_order` (Integer)
- `custom.menu_category` (Text) - optional

### 2. Required Collections (5 min)
Create these collections:
- `all` - All products
- `best-seller` - Best sellers
- `new-arrival` - New arrivals

### 3. Configure Collections (5 min)
For each collection in menu:
- ✅ Menu Enabled: Checked
- 🔢 Menu Order: 1, 2, 3...

---

## 🧪 Testing

### Start Dev Server
```bash
cd hydrogen-storefront
npm run dev
```

### Check Console
Look for:
```
📊 Found X collections enabled for menu
✅ Built dynamic menu with Y sections
```

### Test Functionality
- Hover "Shop" → Menu appears
- Hover "Blacmelo Club" → Menu appears
- Click items → Navigate to collections

---

## 📁 Key Files

### New Files
```
app/graphql/DynamicHeaderMenuQuery.ts
app/lib/dynamicHeaderMenu.ts
app/components/ui/DynamicHoverMenu.tsx
```

### Modified Files
```
app/root.tsx
app/components/PageLayout.tsx
app/components/layout/Header.tsx
```

---

## 🔧 Common Tasks

### Add Collection to Menu
1. Go to collection in Shopify
2. Set metafields:
   - Menu Enabled: ✓
   - Menu Order: [number]
3. Done! (auto-updates)

### Change Menu Order
1. Go to collection
2. Change Menu Order value
3. Done! (auto-updates)

### Hide Collection from Menu
1. Go to collection
2. Uncheck Menu Enabled
3. Done! (auto-updates)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Only 3 sections | Check `menu_enabled = true` |
| Wrong order | Verify `menu_order` values |
| Menu not showing | Check browser console |
| TypeScript errors | Run `npm run typecheck` |

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `DYNAMIC-HEADER-QUICK-SETUP.md` | **Start here!** |
| `NEW-DYNAMIC-HEADER-SETUP.md` | Full guide |
| `NEW-HEADER-STRUCTURE.md` | Visual diagrams |
| `METAFIELDS-VS-SHOPIFY-MENUS.md` | Approach comparison |
| `IMPLEMENTATION-COMPLETE.md` | What was done |

---

## 💡 Pro Tips

1. **Order Numbers**: Use 10, 20, 30... (easier to insert later)
2. **Categories**: Use for future filtering/grouping
3. **Testing**: Always check console logs
4. **Caching**: Clear cache if changes don't appear
5. **Backup**: Keep old menu code until tested

---

## ✅ Success Checklist

- [ ] Metafields created in Shopify
- [ ] Required collections exist
- [ ] Collections configured with metafields
- [ ] Dev server running
- [ ] Console shows correct logs
- [ ] Menu appears on hover
- [ ] Collections navigate correctly
- [ ] Mobile menu works
- [ ] No errors in console

---

## 🚀 Next Steps

1. Complete Shopify setup
2. Test in development
3. Add more collections
4. Customize styling (optional)
5. Deploy to production

---

## 📞 Need Help?

Check documentation in `hydrogen-storefront/docs/`:
- Full setup guide
- Visual diagrams
- Troubleshooting tips
- Code examples

**Status**: Ready to use! 🎉
