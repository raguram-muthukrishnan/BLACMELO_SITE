# Category-Based Dynamic Menu

## 🎯 How It Works

Collections are now **grouped by their Menu Category** and displayed as sections in the hover menu.

### Menu Structure

```
┌─────────────────────────────────────────┐
│         HOVER MENU                      │
├─────────────────────────────────────────┤
│                                         │
│  PERMANENT SECTIONS                     │
│  • Shop All                             │
│  • Best Seller                          │
│  • New Arrival                          │
│                                         │
│  FEATURED                               │
│  • Unisex                               │
│  • [Other featured collections]         │
│                                         │
│  CLOTHING                               │
│  • Hoodies                              │
│  • T-Shirts                             │
│  • [Other clothing collections]         │
│                                         │
│  ACCESSORIES                            │
│  • Bags                                 │
│  • Hats                                 │
│  • [Other accessory collections]        │
│                                         │
│  SEASONAL                               │
│  • Summer Collection                    │
│  • Winter Collection                    │
│  • [Other seasonal collections]         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📋 Shopify Setup

### Step 1: Create Metafield Definitions

Go to **Settings → Custom Data → Collections**

Create these 3 metafields:

#### 1. Menu Enabled
```
Name: Menu Enabled
Namespace and key: custom.menu_enabled
Type: True or false
Description: Enable this collection in the header menu
```

#### 2. Menu Category
```
Name: Menu Category
Namespace and key: custom.menu_category
Type: Single line text
Description: Category for grouping (featured, clothing, accessories, seasonal)
```

#### 3. Menu Order
```
Name: Menu Order
Namespace and key: custom.menu_order
Type: Integer
Description: Display order within category (lower numbers appear first)
```

---

### Step 2: Configure Collections

For each collection you want in the menu:

#### Example 1: Unisex Collection
```
Collection: Unisex
├─ Menu Enabled: ✓ (checked)
├─ Menu Category: featured
└─ Menu Order: 1
```
**Result**: Appears first in the FEATURED section

#### Example 2: Hoodies Collection
```
Collection: Hoodies
├─ Menu Enabled: ✓ (checked)
├─ Menu Category: clothing
└─ Menu Order: 1
```
**Result**: Appears first in the CLOTHING section

#### Example 3: T-Shirts Collection
```
Collection: T-Shirts
├─ Menu Enabled: ✓ (checked)
├─ Menu Category: clothing
└─ Menu Order: 2
```
**Result**: Appears second in the CLOTHING section (after Hoodies)

#### Example 4: Summer Collection
```
Collection: Summer Collection
├─ Menu Enabled: ✓ (checked)
├─ Menu Category: seasonal
└─ Menu Order: 1
```
**Result**: Appears first in the SEASONAL section

---

## 🎨 Supported Categories

### Predefined Categories (with labels)

| Category Value | Display Label | Use For |
|----------------|---------------|---------|
| `featured` | FEATURED | Highlighted collections |
| `clothing` | CLOTHING | Apparel items |
| `accessories` | ACCESSORIES | Bags, hats, jewelry, etc. |
| `seasonal` | SEASONAL | Seasonal collections |

### Custom Categories

You can use **any category name** you want! For example:
- `new` → Displays as "NEW"
- `sale` → Displays as "SALE"
- `limited-edition` → Displays as "LIMITED-EDITION"

The system will automatically:
1. Group collections by category
2. Display the category name in uppercase
3. Sort collections within each category by Menu Order

---

## 📊 Category Display Order

Categories appear in this order:
1. **FEATURED** (if any collections have `category: featured`)
2. **CLOTHING** (if any collections have `category: clothing`)
3. **ACCESSORIES** (if any collections have `category: accessories`)
4. **SEASONAL** (if any collections have `category: seasonal`)
5. **Custom categories** (in alphabetical order)

---

## 🧪 Testing

### Start Dev Server
```bash
cd hydrogen-storefront
npm run dev
```

### Check Browser Console

Look for these logs:
```
🔍 All collections with their metafields:
  1. Unisex (unisex): { menuEnabled: "true", menuOrder: "1", menuCategory: "featured" }
  2. Hoodies (hoodies): { menuEnabled: "true", menuOrder: "1", menuCategory: "clothing" }
  ...

📂 Collections grouped by category: ["featured", "clothing", "seasonal"]

➕ Added category "featured" with 1 collections
➕ Added category "clothing" with 2 collections
➕ Added category "seasonal" with 1 collections

✅ Built dynamic menu with 6 sections (3 permanent + 3 category sections)
```

### Test Menu

1. Hover over "Shop" or "Blacmelo Club"
2. You should see:
   - Shop All, Best Seller, New Arrival (permanent)
   - FEATURED section with Unisex
   - CLOTHING section with Hoodies, T-Shirts
   - SEASONAL section with Summer Collection
   - etc.

---

## 🎯 Example Configurations

### Fashion Store Setup

```
PERMANENT SECTIONS
├─ Shop All
├─ Best Seller
└─ New Arrival

FEATURED
├─ New Arrivals (order: 1)
├─ Best Sellers (order: 2)
└─ Sale (order: 3)

CLOTHING
├─ T-Shirts (order: 1)
├─ Hoodies (order: 2)
├─ Jackets (order: 3)
└─ Pants (order: 4)

ACCESSORIES
├─ Bags (order: 1)
├─ Hats (order: 2)
└─ Jewelry (order: 3)

SEASONAL
├─ Summer 2024 (order: 1)
└─ Winter 2024 (order: 2)
```

### Minimal Setup

```
PERMANENT SECTIONS
├─ Shop All
├─ Best Seller
└─ New Arrival

FEATURED
└─ Unisex (order: 1)
```

---

## 🔧 Customization

### Change Category Labels

Edit `app/lib/dynamicHeaderMenu.ts`:

```typescript
const categoryLabels: { [key: string]: string } = {
  featured: 'FEATURED',
  clothing: 'CLOTHING',
  accessories: 'ACCESSORIES',
  seasonal: 'SEASONAL',
  sale: 'SALE', // Add custom label
  new: 'NEW ARRIVALS', // Add custom label
};
```

### Change Category Order

Edit `app/lib/dynamicHeaderMenu.ts`:

```typescript
const categoryOrder = [
  'featured',
  'new', // Add your category
  'clothing',
  'accessories',
  'seasonal',
  'sale', // Add your category
];
```

---

## 🐛 Troubleshooting

### Collections not appearing in menu

**Check:**
1. Menu Enabled is checked (true)
2. Menu Category is set
3. Menu Order is set
4. Browser console shows the collection in logs

### Collections in wrong category

**Fix:**
- Check the Menu Category value matches exactly (case-sensitive)
- Use lowercase for predefined categories: `featured`, `clothing`, `accessories`, `seasonal`

### Collections in wrong order within category

**Fix:**
- Check Menu Order values
- Lower numbers appear first
- Use 1, 2, 3... or 10, 20, 30... for easier reordering

### Category not showing

**Check:**
- At least one collection must have that category
- Collection must have Menu Enabled = true
- Check browser console for logs

---

## 📝 Summary

**How It Works:**
1. Collections with `menu_enabled = true` are fetched
2. Collections are grouped by `menu_category`
3. Within each category, collections are sorted by `menu_order`
4. Categories are displayed in predefined order
5. Each category becomes a section in the menu

**Benefits:**
- ✅ Organized menu structure
- ✅ Easy to manage in Shopify
- ✅ Flexible category system
- ✅ Automatic grouping and sorting
- ✅ Scalable to many collections

**Result:**
A clean, organized menu that automatically groups your collections by category! 🎉
