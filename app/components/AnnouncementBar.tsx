import {useState, useEffect} from 'react';
import {X} from 'lucide-react';

/**
 * AnnouncementBar Component
 * 
 * This component displays a dismissible announcement banner at the top of the page.
 * Developers can control the content via the announcementConfig object below.
 * 
 * To update the announcement:
 * 1. Modify the announcementConfig object
 * 2. Set 'enabled' to true/false to show/hide
 * 3. Update 'message' with your announcement text
 * 4. Optionally add a 'link' and 'linkText' for call-to-action
 */
interface AnnouncementConfig {
  enabled: boolean;
  message: string;
  link?: string;
  linkText?: string;
  expiresAt?: string; // ISO date string
}

// ============================================
// DEVELOPER CONFIGURATION
// ============================================
const announcementConfig: AnnouncementConfig = {
  enabled: true,
  message: 'DOWNLOAD THE APP FOR 20% OFF YOUR FIRST ORDER',
  // link: '/app-download',
  // linkText: 'Download Now',
  // expiresAt: '2026-12-31T23:59:59Z',
};

export function AnnouncementBar() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Skip if disabled
    if (!announcementConfig.enabled) {
      return;
    }

    // Check expiration
    if (announcementConfig.expiresAt) {
      const expirationDate = new Date(announcementConfig.expiresAt);
      if (new Date() > expirationDate) {
        return;
      }
    }

    // Check localStorage
    try {
      const key = `announcement-${announcementConfig.message}`;
      const dismissed = localStorage.getItem(key);
      if (!dismissed) {
        setShouldShow(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleDismiss = () => {
    setShouldShow(false);
    try {
      const key = `announcement-${announcementConfig.message}`;
      localStorage.setItem(key, 'true');
    } catch {
      // Ignore localStorage errors
    }
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="announcement-bar">
      <div className="announcement-bar-content">
        {announcementConfig.link ? (
          <a href={announcementConfig.link} className="announcement-bar-link">
            {announcementConfig.message}
            {announcementConfig.linkText && (
              <span className="announcement-bar-link-text">
                {' '}{announcementConfig.linkText}
              </span>
            )}
          </a>
        ) : (
          <span className="announcement-bar-text">
            {announcementConfig.message}
          </span>
        )}
      </div>
      <button
        className="announcement-bar-close"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
