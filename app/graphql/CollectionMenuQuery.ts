/**
 * GraphQL query to fetch collections with menu metafields for dynamic header menu
 * This is a simpler alternative to the metaobject approach
 */

export const COLLECTION_MENU_QUERY = `#graphql
  query CollectionMenu($first: Int = 50) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        image {
          url
          altText
        }
        menuCategory: metafield(namespace: "menu", key: "category") {
          value
        }
        menuSection: metafield(namespace: "menu", key: "section") {
          value
        }
        menuOrder: metafield(namespace: "menu", key: "order") {
          value
        }
        isBold: metafield(namespace: "menu", key: "is_bold") {
          value
        }
        menuLabel: metafield(namespace: "menu", key: "label") {
          value
        }
        menuImage: metafield(namespace: "menu", key: "image") {
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
` as const;
