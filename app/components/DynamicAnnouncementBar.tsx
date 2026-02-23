/**
 * Dynamic Announcement Bar with Center Carousel + Arrows
 * Permanent version (no close button)
 */

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

export function DynamicAnnouncementBar({ announcements }: DynamicAnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default content if none provided
  const fallbackMessages = [
    'SECURE PAYMENTS',
    'FREE SHIPPING',
    'EASY RETURNS'
  ];

  // Filter enabled announcements and sort by order
  const activeAnnouncements = announcements
    ?.filter(a => a.enabled)
    .sort((a, b) => a.order - b.order) || [];

  const messages = activeAnnouncements.length > 0
    ? activeAnnouncements.map(a => a.message.toUpperCase())
    : fallbackMessages;

  // Carousel logic
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  }, [messages.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  }, [messages.length]);

  // Auto-slide
  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(handleNext, 2000); // Change every 2 seconds
    return () => clearInterval(interval);
  }, [handleNext, messages.length]);

  // Always sync visibility to body class for layout awareness
  useEffect(() => {
    document.body.classList.add('announcement-visible');
    document.body.classList.remove('announcement-hidden');

    return () => {
      document.body.classList.remove('announcement-visible');
    };
  }, []);

  return (
    <div className="dynamic-announcement-bar carousel-type">
      <div className="announcement-carousel-container">
        <button
          className="announcement-nav-btn prev"
          onClick={handlePrev}
          aria-label="Previous announcement"
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>

        <div className="announcement-carousel-content">
          <div
            className="announcement-carousel-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className="announcement-carousel-item">
                {msg}
              </div>
            ))}
          </div>
        </div>

        <button
          className="announcement-nav-btn next"
          onClick={handleNext}
          aria-label="Next announcement"
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export function FallbackAnnouncementBar() {
  return null;
}
