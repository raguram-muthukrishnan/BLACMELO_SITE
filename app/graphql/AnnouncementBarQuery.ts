/**
 * GraphQL query for dynamic announcement bar
 * Fetches shop metafields for announcements
 */

export const ANNOUNCEMENT_BAR_QUERY = `#graphql
  query AnnouncementBar {
    shop {
      # Announcement metafields
      announcement1: metafield(namespace: "custom", key: "announcement_1") {
        value
      }
      announcement1Enabled: metafield(namespace: "custom", key: "announcement_1_enabled") {
        value
      }
      announcement1Link: metafield(namespace: "custom", key: "announcement_1_link") {
        value
      }
      announcement2: metafield(namespace: "custom", key: "announcement_2") {
        value
      }
      announcement2Enabled: metafield(namespace: "custom", key: "announcement_2_enabled") {
        value
      }
      announcement2Link: metafield(namespace: "custom", key: "announcement_2_link") {
        value
      }
      announcement3: metafield(namespace: "custom", key: "announcement_3") {
        value
      }
      announcement3Enabled: metafield(namespace: "custom", key: "announcement_3_enabled") {
        value
      }
      announcement3Link: metafield(namespace: "custom", key: "announcement_3_link") {
        value
      }
    }
  }
` as const;
