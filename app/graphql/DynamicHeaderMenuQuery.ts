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
        # Menu control metafields
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
        menuGender: metafield(namespace: "custom", key: "menu_gender") {
          value
          type
        }
        menuSectionType: metafield(namespace: "custom", key: "menu_section_type") {
          value
          type
        }
        menuItemType: metafield(namespace: "custom", key: "menu_item_type") {
          value
          type
        }
        menuDisplayStyle: metafield(namespace: "custom", key: "menu_display_style") {
          value
          type
        }
        menuParentCollection: metafield(namespace: "custom", key: "menu_parent_collection") {
          value
          type
        }
      }
    }
  }
` as const;
