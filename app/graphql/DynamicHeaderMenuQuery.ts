/**
 * GraphQL query for dynamic header menu based on Shopify collections
 * Fetches collections to build dynamic menu sections
 */

export const DYNAMIC_HEADER_MENU_QUERY = `#graphql
  query DynamicHeaderMenu($first: Int = 50) {
    collections(first: $first, sortKey: TITLE) {
      nodes {
        id
        handle
        title
        image {
          url
          altText
        }
        # Try multiple metafield namespaces
        menuEnabled: metafield(namespace: "custom", key: "menu_enabled") {
          value
          type
        }
        menuCategory: metafield(namespace: "custom", key: "menu_category") {
          value
          type
        }
        menuOrder: metafield(namespace: "custom", key: "menu_order") {
          value
          type
        }
      }
    }
  }
` as const;
