# Metaobject Setup Steps - Complete Guide

## Current Status

✅ You've created the metaobject **definitions** (Header Menu Config, Header Menu Section, Header Menu Item)  
✅ Code is now configured to use metaobjects  
❌ You need to create metaobject **entries** with actual menu data  

## What You Need to Do

You've created the structure (definitions), now you need to fill it with data (entries).

## Step-by-Step: Create Menu Entries

### Step 1: Create Menu Items for "Man" Menu

Go to **Shopify Admin → Content → Metaobjects → Header Menu Item → Add entry**

Create these entries:

#### Top Section Items (Bold)

**Entry 1: New Arrivals**
- name: `New Arrivals`
- link: (leave empty or add custom URL)
- collection: Select "New Arrivals" collection
- is_bold: `true`
- description: (leave empty)

**Entry 2: Bestsellers**
- name: `Bestsellers`
- collection: Select "Bestsellers" collection
- is_bold: `true`

**Entry 3: Shop All**
- name: `Shop All`
- collection: Select your main collection
- is_bold: `true`

#### Featured Section Items

**Entry 4: Fall Winter '25**
- name: `Fall Winter '25`
- collection: Select appropriate collection
- is_bold: `false`

**Entry 5: Owners Club**
- name: `Owners Club`
- collection: Select appropriate collection
- is_bold: `false`

**Entry 6: 247**
- name: `247`
- collection: Select appropriate collection
- is_bold: `false`

#### Shop Section Items

**Entry 7: Clothing**
- name: `Clothing`
- collection: Select clothing collection
- is_bold: `false`

**Entry 8: Footwear**
- name: `Footwear`
- collection: Select footwear collection
- is_bold: `false`

**Entry 9: Accessories**
- name: `Accessories`
- collection: Select accessories collection
- is_bold: `false`

### Step 2: Create Menu Sections

Go to **Content → Metaobjects → Header Menu Section → Add entry**

**Section 1: Top Section**
- label: (leave empty - no label for top section)
- items: Select entries 1, 2, 3 (New Arrivals, Bestsellers, Shop All)
- has_submenu: `false`
- is_bold: `true`

**Section 2: Featured Section**
- label: `FEATURED`
- items: Select entries 4, 5, 6 (Fall Winter '25, Owners Club, 247)
- has_submenu: `false`
- is_bold: `false`

**Section 3: Shop Section**
- label: `SHOP`
- items: Select entries 7, 8, 9 (Clothing, Footwear, Accessories)
- has_submenu: `true`
- is_bold: `false`

### Step 3: Create Menu Config for "Man"

Go to **Content → Metaobjects → Header Menu Config → Add entry**

**Man Menu Config**
- menu_key: `man`
- title: `Man`
- sections: Select all 3 sections created above
- image: Upload menu image (or leave empty)
- default_collection: Select your main unisex collection

### Step 4: Repeat for "Women" and "Blacmelo"

Create similar entries for:
- Women menu (menu_key: `women`)
- Blacmelo+ menu (menu_key: `blacmelo`)

## Quick Reference

### Metaobject Structure

```
Header Menu Config (menu_key: "man")
├── Section 1 (label: "")
│   ├── Item: New Arrivals (bold)
│   ├── Item: Bestsellers (bold)
│   └── Item: Shop All (bold)
├── Section 2 (label: "FEATURED")
│   ├── Item: Fall Winter '25
│   ├── Item: Owners Club
│   └── Item: 247
└── Section 3 (label: "SHOP")
    ├── Item: Clothing
    ├── Item: Footwear
    └── Item: Accessories
```

## Important Notes

1. **menu_key must be exact:** Use `man`, `women`, or `blacmelo` (lowercase)
2. **Order matters:** Items appear in the order you add them to the section
3. **Collections:** Link each item to an actual collection in your store
4. **Images:** Optional - can be added later

## After Creating Entries

1. Save all entries
2. The dev server should automatically pick up the changes
3. Refresh your browser
4. Check the header menus

## Troubleshooting

### Still seeing fallback menus?
- Verify menu_key is exactly `man`, `women`, or `blacmelo`
- Check that all sections are added to the menu config
- Ensure all items are added to sections
- Refresh the page (may need to clear cache)

### GraphQL errors?
- Check that all required fields are filled
- Verify collections are published
- Make sure metaobject entries are saved

### Items not appearing?
- Check the order of items in sections
- Verify items are linked to sections
- Ensure sections are linked to menu config

## Verification Checklist

- [ ] Created at least 9 menu items
- [ ] Created 3 menu sections
- [ ] Created 1 menu config with menu_key: `man`
- [ ] All items linked to collections
- [ ] All items added to appropriate sections
- [ ] All sections added to menu config
- [ ] menu_key is exactly `man` (lowercase)
- [ ] Saved all entries
- [ ] Refreshed browser

## Next Steps

Once you've created the entries:
1. The site will automatically fetch them
2. Header menus will display your metaobject data
3. You can edit entries anytime from Shopify admin
4. Changes will reflect after page refresh

## Need Help?

If you're having trouble:
1. Start with just the "Man" menu first
2. Create minimal entries (3 items, 1 section, 1 config)
3. Test before creating more
4. Check browser console for errors
