/**
 * Simplified GraphQL query for header menu metaobjects
 * Works with Shopify Storefront API
 */

export const HEADER_MENU_QUERY = `#graphql
  query HeaderMenus {
    metaobjects(type: "header_menu_config", first: 10) {
      nodes {
        id
        handle
        type
        field(key: "menu_key") {
          value
        }
        title: field(key: "title") {
          value
        }
        sections: field(key: "sections") {
          value
        }
        image: field(key: "image") {
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
        defaultCollection: field(key: "default_collection") {
          reference {
            ... on Collection {
              id
              handle
              title
            }
          }
        }
      }
    }
  }
` as const;
