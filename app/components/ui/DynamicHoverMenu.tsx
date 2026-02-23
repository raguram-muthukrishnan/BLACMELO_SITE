/**
 * Dynamic Hover Menu Component
 * Displays dynamic menu sections based on Shopify collections
 * Uses existing unified-hover-menu CSS classes
 */

import { NavLink } from 'react-router';
import { createPortal } from 'react-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { DynamicMenuConfig } from '~/lib/dynamicHeaderMenu';
import { ScrollArea } from '~/components/ui/scroll-area';
import { stopLenis, startLenis } from '~/lib/lenis';

// Import banner images for hover effects
import ss26Banner from '~/assets/home_page_banners/ss26.jpeg';
import archiveBanner from '~/assets/home_page_banners/bl_archive.jpeg';
import originalsBanner from '~/assets/home_page_banners/bl_originals.jpeg';

interface DynamicHoverMenuProps {
  isActive: boolean;
  menuConfig: DynamicMenuConfig;
  onMouseLeave: () => void;
  onMenuItemHover?: (isHovered: boolean) => void;
}

export function DynamicHoverMenu({
  isActive,
  menuConfig,
  onMouseLeave,
  onMenuItemHover,
}: DynamicHoverMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredParent, setHoveredParent] = useState<any>(null);
  const [hoveredItemMedia, setHoveredItemMedia] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [overlayElement, setOverlayElement] = useState<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Callback ref to capture the overlay element
  const overlayRef = useCallback((node: HTMLDivElement | null) => {
    setOverlayElement(node);
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Prevent body scroll when menu is active - stop Lenis and lock body
  useEffect(() => {
    if (isActive) {
      // Stop Lenis smooth scroll
      stopLenis();

      // Save current scroll position
      const scrollY = window.scrollY;
      const body = document.body;

      // Store original styles
      const originalOverflow = body.style.overflow;
      const originalPosition = body.style.position;
      const originalTop = body.style.top;
      const originalWidth = body.style.width;

      // Lock body scroll using position fixed method
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';

      return () => {
        // Restore body styles
        body.style.position = originalPosition;
        body.style.top = originalTop;
        body.style.width = originalWidth;
        body.style.overflow = originalOverflow;

        // Restore scroll position
        window.scrollTo(0, scrollY);

        // Restart Lenis smooth scroll
        startLenis();
      };
    }
  }, [isActive]);

  // Toggle overlay visibility class to drive the CSS opacity transition
  useEffect(() => {
    const el = overlayElement;

    if (!el) {
      return;
    }

    // Defer one frame so the element is painted before the transition starts
    const raf = requestAnimationFrame(() => {
      el.classList.toggle('is-visible', isActive);
    });
    return () => cancelAnimationFrame(raf);
  }, [isActive, overlayElement]);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onMouseLeave();
      setHoveredParent(null);
    }, 150);
  }, [onMouseLeave]);

  // Clear any pending timeout when entering parent item
  const handleParentEnter = useCallback((item: any) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredParent(item);
  }, []);

  // Start timeout to clear hover when leaving parent item
  const handleParentLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredParent(null);
    }, 200);
  }, []);

  // Handle item hover for media changes
  const handleItemHover = useCallback((itemName: string) => {
    const name = itemName.toLowerCase();
    if (name.includes('spring summer') || name.includes('ss26')) {
      setHoveredItemMedia(ss26Banner);
    } else if (name.includes('archive')) {
      setHoveredItemMedia(archiveBanner);
    } else if (name.includes('originals')) {
      setHoveredItemMedia(originalsBanner);
    } else {
      setHoveredItemMedia(null);
    }
  }, []);

  // Keep panel open when entering it
  const handleNestedPanelEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  // Clear hover when leaving the nested panel
  const handleNestedPanelLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredParent(null);
    }, 200);
  }, []);

  // Helper to render menu item with optional children
  const renderMenuItem = (item: any, itemIdx: number, itemClass: string) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li
        key={itemIdx}
        className={hasChildren ? 'has-children' : ''}
        onMouseEnter={() => {
          if (hasChildren) handleParentEnter(item);
          handleItemHover(item.name);
          onMenuItemHover?.(true);
        }}
        onMouseLeave={() => {
          if (hasChildren) handleParentLeave();
          setHoveredItemMedia(null);
          onMenuItemHover?.(false);
        }}
      >
        <NavLink
          to={item.link}
          className={itemClass}
        >
          <span className="hover-menu-item-text">
            {item.name}
          </span>
          {hasChildren && <span className="hover-menu-arrow">›</span>}
        </NavLink>
      </li>
    );
  };

  // Overlay stays mounted after first render so the fade-out transition plays.
  // The menu panel is still fully unmounted when inactive (preserving existing behaviour).
  if (!mounted) {
    return null;
  }

  console.log('🎯 Hover Menu:', { isActive, sections: menuConfig.sections.length });

  // Overlay element - always rendered when mounted
  const overlayEl = (
    <div
      ref={overlayRef}
      className="hover-menu-page-overlay"
      aria-hidden="true"
    />
  );

  // Menu content - only rendered when active
  const menuContent = !isActive ? null : (
    <div
      ref={menuRef}
      className="unified-hover-menu-overlay"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="hover-menu-dropdown">
        <div className="hover-menu-content">
          {/* Left side - Menu sections */}
          <ScrollArea className="hover-menu-sections">
            <div className="hover-menu-sections-content">
              {menuConfig.sections.map((section, idx) => {
                const sectionType = section.sectionType || (section.isPermanent ? 'permanent' : 'category');

                // Permanent section - render items in a list
                if (sectionType === 'permanent') {
                  return (
                    <div key={idx} className="hover-menu-section permanent-section">
                      <ul className="hover-menu-list permanent-list">
                        {section.items.map((item, itemIdx) =>
                          renderMenuItem(item, itemIdx, 'hover-menu-item-link permanent-item')
                        )}
                      </ul>
                    </div>
                  );
                }

                // Common section - can have mixed item types
                if (sectionType === 'common') {
                  return (
                    <div key={idx} className="hover-menu-section common-section">
                      <ul className="hover-menu-list common-list">
                        {section.items.map((item, itemIdx) => {
                          const itemClass = item.itemType === 'permanent'
                            ? 'hover-menu-item-link permanent-item'
                            : 'hover-menu-item-link dynamic-item';
                          return renderMenuItem(item, itemIdx, itemClass);
                        })}
                      </ul>
                    </div>
                  );
                }

                // Category section - has title and items
                return (
                  <div key={idx} className="hover-menu-section category-section">
                    {section.label && (
                      <h3 className="hover-menu-section-title">{section.label}</h3>
                    )}
                    <ul className="hover-menu-list category-list">
                      {section.items.map((item, itemIdx) =>
                        renderMenuItem(item, itemIdx, 'hover-menu-item-link dynamic-item')
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Right side - Image or Nested Menu */}
          <div className="hover-menu-right-panel">
            {/* Base Image or Hovered Banner */}
            <div className={`hover-menu-media-container ${hoveredParent ? 'fade-out' : ''}`}>
              <div className="hover-menu-image-wrapper">
                <img
                  src={hoveredItemMedia || menuConfig.image}
                  alt="Menu Banner"
                  className="menu-banner-img"
                  key={hoveredItemMedia || menuConfig.image}
                />
              </div>
            </div>

            {/* Nested Collections Panel */}
            {hoveredParent && (
              <ScrollArea
                className="hover-menu-nested-panel fade-in"
                onMouseEnter={handleNestedPanelEnter}
                onMouseLeave={handleNestedPanelLeave}
              >
                <div className="nested-panel-content">
                  <ul className="nested-panel-list">
                    {hoveredParent.children.map((child: any, childIdx: number) => (
                      <li key={childIdx}>
                        <NavLink
                          to={child.link}
                          className="nested-panel-item"
                        >
                          {child.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <>
      {overlayEl}
      {menuContent}
    </>,
    document.body,
  );
}
