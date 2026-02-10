/**
 * Dynamic Announcement Bar with Ticker Animation
 * Supports multiple announcements from Shopify metafields
 */

import {useState, useEffect, useRef} from 'react';

export interface AnnouncementItem {
  id: string;
  message: string;
  link?: string;
  enabled: boolean;
  order: number;
}

interface DynamicAnnouncementBarProps {
  announcements?: AnnouncementItem[];
}

export function DynamicAnnouncementBar({announcements}: DynamicAnnouncementBarProps) {
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Filter enabled announcements and sort by order
  const activeAnnouncements = announcements
    ?.filter(a => a.enabled)
    .sort((a, b) => a.order - b.order) || [];

  // If no announcements, use fallback
  if (activeAnnouncements.length === 0) {
    return <FallbackAnnouncementBar />;
  }

  // Create announcement text with separators
  const announcementText = activeAnnouncements
    .map(a => a.message)
    .join('  •  ');

  return (
    <div 
      className="dynamic-announcement-bar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="announcement-ticker-container">
        <div 
          ref={tickerRef}
          className={`announcement-ticker ${isPaused ? 'paused' : ''}`}
        >
          {/* Duplicate content for seamless loop */}
          <span className="announcement-ticker-content">
            {announcementText}
          </span>
          <span className="announcement-ticker-content" aria-hidden="true">
            {announcementText}
          </span>
        </div>
      </div>
    </div>
  );
}

// Fallback component with static announcement
export function FallbackAnnouncementBar() {
  return (
    <div className="dynamic-announcement-bar">
      <div className="announcement-ticker-container">
        <div className="announcement-ticker">
          <span className="announcement-ticker-content">
            FREE SHIPPING ON ORDERS OVER $100  •  NEW ARRIVALS EVERY WEEK  •  DOWNLOAD THE APP FOR 20% OFF
          </span>
          <span className="announcement-ticker-content" aria-hidden="true">
            FREE SHIPPING ON ORDERS OVER $100  •  NEW ARRIVALS EVERY WEEK  •  DOWNLOAD THE APP FOR 20% OFF
          </span>
        </div>
      </div>
    </div>
  );
}
