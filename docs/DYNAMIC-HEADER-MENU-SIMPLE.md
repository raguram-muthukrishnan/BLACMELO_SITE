# Simple Dynamic Header Menu (Collections-Based)

This is a simpler alternative to the metaobject approach. Instead of creating complex metaobject structures, you can use Shopify collections with metafields to drive your header menus.

## Approach

Use collection metafields to organize your menu structure. This is simpler to set up and maintain.

## Step 1: Create Collection Metafields

Go to Shopify Admin → Settings → Custom Data → Collections → Add definition

### Metafield 1: Menu Category
- **Namespace and key:** `menu.category`
- **Name:** Menu Category
- **Type:** Single line text
- **Values:** "man", "women", "blacmelo", "featured", etc.

### Metafield 2: Menu Section
- **Namespace and key:** `menu.section`
- **Name:** Menu Section
- **Type:** Single line text
- **Values:** "new-arrivals", "bestsellers", "featured", "shop", etc.

### Metafield 3: Menu Order
- **Namespace and key:** `menu.order`
- **Name:** Menu Order
- **Type:** Integer
- **Description:** Order in which this collection appears in the menu

### Metafield 4: Is Bold
- **Namespace and key:** `menu.is_bold`
- **Name:** Display Bold
- **Type:** True/False
- **Description:** Whether to display this item in bold

### Metafield 5: Menu Label
- **Namespace and key:** `menu.label`
- **Name:** Menu Label
- **Type:** Single line text
- **Description:** Custom label (if different from collection title)

## Step 2: Configure Your Collections

For each collection you want in the menu:

1. Go to the collection in Shopify Admin
2. Scroll to Metafields
3. Set the values:
   - **Menu Category:** "man" (or "women", "blacmelo")
   - **Menu Section:** "new-arrivals" (or "featured", "shop", etc.)
   - **Menu Order:** 1, 2, 3, etc.
   - **Is Bold:** true/false
   - **Menu Label:** Optional custom label

### Example Configuration

**Collection: "New Arrivals"**
- menu.category: "man"
- menu.section: "top"
- menu.order: 1
- menu.is_bold: true

**Collection: "Fall Winter 25"**
- menu.category: "man"
- menu.section: "featured"
- menu.order: 1
- menu.is_bold: false

**Collection: "Clothing"**
- menu.category: "man"
- menu.section: "shop"
- menu.order: 1
- menu.is_bold: false

## Step 3: GraphQL Query

The implementation will query collections with these metafields and automatically build the menu structure.

## Benefits

- ✅ Simpler setup than metaobjects
- ✅ Direct connection to your actual collections
- ✅ Easy to manage from collection pages
- ✅ Automatically updates when you add/remove collections
- ✅ No need to create separate metaobject entries

## Comparison with Metaobject Approach

**Metaobject Approach:**
- More flexible structure
- Can include non-collection items
- Better for complex menu hierarchies
- More setup required

**Collections Metafield Approach:**
- Simpler and faster to set up
- Direct link to collections
- Easier to maintain
- Best for collection-focused menus

Choose the approach that best fits your needs!
