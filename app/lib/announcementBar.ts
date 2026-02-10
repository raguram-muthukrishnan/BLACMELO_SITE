/**
 * Utility functions for parsing announcement bar data
 */

import type {AnnouncementItem} from '~/components/DynamicAnnouncementBar';

interface AnnouncementBarData {
  shop: {
    announcement1?: { value: string };
    announcement1Enabled?: { value: string };
    announcement1Link?: { value: string };
    announcement2?: { value: string };
    announcement2Enabled?: { value: string };
    announcement2Link?: { value: string };
    announcement3?: { value: string };
    announcement3Enabled?: { value: string };
    announcement3Link?: { value: string };
  };
}

/**
 * Parse announcement bar data from Shopify metafields
 */
export function parseAnnouncementBar(
  data: AnnouncementBarData | null
): AnnouncementItem[] {
  if (!data?.shop) {
    console.warn('⚠️ No announcement bar data found');
    return [];
  }

  const announcements: AnnouncementItem[] = [];

  // Parse announcement 1
  if (data.shop.announcement1?.value) {
    const enabled = data.shop.announcement1Enabled?.value?.toLowerCase() === 'true' ||
                   data.shop.announcement1Enabled?.value === '1';
    
    announcements.push({
      id: 'announcement-1',
      message: data.shop.announcement1.value,
      link: data.shop.announcement1Link?.value || undefined,
      enabled,
      order: 1,
    });
  }

  // Parse announcement 2
  if (data.shop.announcement2?.value) {
    const enabled = data.shop.announcement2Enabled?.value?.toLowerCase() === 'true' ||
                   data.shop.announcement2Enabled?.value === '1';
    
    announcements.push({
      id: 'announcement-2',
      message: data.shop.announcement2.value,
      link: data.shop.announcement2Link?.value || undefined,
      enabled,
      order: 2,
    });
  }

  // Parse announcement 3
  if (data.shop.announcement3?.value) {
    const enabled = data.shop.announcement3Enabled?.value?.toLowerCase() === 'true' ||
                   data.shop.announcement3Enabled?.value === '1';
    
    announcements.push({
      id: 'announcement-3',
      message: data.shop.announcement3.value,
      link: data.shop.announcement3Link?.value || undefined,
      enabled,
      order: 3,
    });
  }

  console.log(`📢 Parsed ${announcements.length} announcements, ${announcements.filter(a => a.enabled).length} enabled`);

  return announcements;
}

/**
 * Get fallback announcements when no data is available
 */
export function getFallbackAnnouncements(): AnnouncementItem[] {
  return [
    {
      id: 'fallback-1',
      message: 'FREE SHIPPING ON ORDERS OVER $100',
      enabled: true,
      order: 1,
    },
    {
      id: 'fallback-2',
      message: 'NEW ARRIVALS EVERY WEEK',
      enabled: true,
      order: 2,
    },
    {
      id: 'fallback-3',
      message: 'DOWNLOAD THE APP FOR 20% OFF',
      enabled: true,
      order: 3,
    },
  ];
}
