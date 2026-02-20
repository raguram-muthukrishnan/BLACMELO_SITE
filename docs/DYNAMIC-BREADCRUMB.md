# Dynamic Breadcrumb Navigation

## Overview
Enhanced the breadcrumb navigation to dynamically follow the actual navigation route based on the product's collection associations, providing accurate navigation hierarchy.

## Implementation

### 1. GraphQL Query Updates
Added collection data to the product query:
```graphql
collections(first: 5) {
  nodes {
    id
    title
    handle
  }
}
```

### 2. Dynamic Breadcrumb Builder
Created `buildBreadcrumbItems()` function that:
- Always starts with "Home"
- Uses the product's primary collection (first collection)
- Falls back to "All Products" if no collection is assigned
- Ends with the current product title

### Logic Flow
```typescript
buildBreadcrumbItems() {
  1. Start with Home
  2. If product has collections:
     a. Get primary collection (collections.nodes[0])
     b. Check if collection is gender-specific:
        - If "men" in handle → Add "Men" + subcategory (if any)
        - If "women" in handle → Add "Women" + subcategory (if any)
        - Else → Add collection directly
  3. Else:
     → Add "All Products" fallback
  4. Add current product title
}
```

## Examples

### Product in "Men's Hoodies" Collection
```
Home › Men › Men's Hoodies › Dark Romance Hoodie
```

### Product in "Men" Collection (Top Level)
```
Home › Men › Signature Tee
```

### Product in "Women's Dresses" Collection
```
Home › Women › Women's Dresses › Summer Dress
```

### Product in "New Arrivals" Collection (No Gender)
```
Home › New Arrivals › Premium Jacket
```

### Product with No Collection
```
Home › All Products › Product Name
```

## Benefits

✅ **Accurate Navigation**: Reflects actual product categorization
✅ **Dynamic**: Automatically adapts to product's collection
✅ **Gender Detection**: Automatically detects Men/Women categories
✅ **Hierarchical**: Shows parent category (Men/Women) + subcategory
✅ **Fallback Handling**: Shows "All Products" if no collection
✅ **SEO Friendly**: Proper hierarchy for search engines
✅ **User Context**: Users know exactly where they are
✅ **Clickable Path**: Can navigate back through actual route
✅ **Smart Logic**: Avoids duplicate entries (e.g., Men › Men)

## Future Enhancements

### Multi-Level Collections
To support nested collections (e.g., Men > Hoodies > Oversized):

1. **Add Parent Collection to Query**:
```graphql
collections(first: 5) {
  nodes {
    id
    title
    handle
    metafield(namespace: "custom", key: "parent_collection") {
      value
    }
  }
}
```

2. **Build Hierarchy**:
```typescript
const buildHierarchy = (collection) => {
  const items = [];
  let current = collection;
  
  while (current) {
    items.unshift({
      label: current.title,
      href: `/collections/${current.handle}`
    });
    current = current.parent; // If parent exists
  }
  
  return items;
};
```

### Collection Type Detection
Detect collection type and adjust breadcrumb:
```typescript
if (collection.handle.includes('men')) {
  items.push({ label: 'Men', href: '/collections/men' });
  items.push({ label: collection.title, href: `/collections/${collection.handle}` });
}
```

## Testing

1. **Product with Collection**: Verify collection appears in breadcrumb
2. **Product without Collection**: Verify "All Products" fallback
3. **Multiple Collections**: Verify first collection is used
4. **Collection Links**: Click collection link, verify navigation
5. **Home Link**: Click home, verify navigation to homepage
6. **Current Product**: Verify product name is not clickable

## Shopify Collection Setup

### Assigning Products to Collections
1. Go to Shopify Admin > Products
2. Select a product
3. In "Product organization" section
4. Add to collections (e.g., "Hoodies", "New Arrivals")
5. The first collection will be used in breadcrumb

### Collection Order
Collections are returned in the order they were added. To control which appears in breadcrumb:
- Reorder collections in product admin
- Or use metafields to specify primary collection

## Advanced: Custom Breadcrumb Paths

For specific products that need custom breadcrumb paths, use metafields:

```graphql
metafield(namespace: "custom", key: "breadcrumb_path") {
  value
}
```

Then in code:
```typescript
const customPath = product.metafield?.value;
if (customPath) {
  // Parse custom path: "Men > Clothing > Hoodies"
  return parseCustomBreadcrumb(customPath);
}
```

## Performance

- Collections are fetched with the product query (no extra requests)
- Limited to first 5 collections (sufficient for most cases)
- Breadcrumb builds on render (no additional API calls)
- Cached with product data

## Accessibility

- Semantic HTML structure maintained
- ARIA labels for navigation
- Keyboard navigable
- Screen reader friendly
