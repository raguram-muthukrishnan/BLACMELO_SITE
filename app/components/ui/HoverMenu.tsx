import {NavLink} from 'react-router';
import {createPortal} from 'react-dom';
import {useEffect, useState, useRef, useCallback} from 'react';
import {ScrollArea} from '~/components/ui/scroll-area';
import {stopLenis, startLenis} from '~/lib/lenis';

interface SubMenuItem {
  name: string;
  link: string;
}

interface MenuItem {
  label: string;
  link: string;
  items?: (string | SubMenuItem)[];
  hasSubmenu?: boolean;
  description?: string;
  isBold?: boolean;
}

interface HoverMenuProps {
  title: string;
  sections: MenuItem[];
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  menuImage?: string;
  titleLink?: string; // Custom link for the title
}

// Arrow icon for expandable items
function ChevronRight() {
  return (
    <svg 
      width="12" 
      height="12" 
      viewBox="0 0 12 12" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="hover-menu-chevron"
    >
      <path 
        d="M4.5 2.5L8 6L4.5 9.5" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HoverMenu({
  title,
  sections,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  menuImage,
  titleLink,
}: HoverMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Prevent body scroll when menu is open - stop Lenis and lock body
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  // Reset expanded item when menu closes
  useEffect(() => {
    if (!isOpen) {
      setExpandedItem(null);
    }
  }, [isOpen]);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onMouseEnter();
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    // Add a small delay before closing to allow moving between trigger and menu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onMouseLeave();
    }, 100);
  }, [onMouseLeave]);

  const getItemLink = (item: string | SubMenuItem, sectionLink: string): string => {
    if (typeof item === 'string') {
      return `${sectionLink}/${item.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`;
    }
    return item.link;
  };

  const getItemName = (item: string | SubMenuItem): string => {
    if (typeof item === 'string') {
      return item;
    }
    return item.name;
  };
  
  const menuContent = isOpen && mounted ? (
    <div 
      ref={menuRef}
      className="hover-menu-overlay"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hover-menu-dropdown">
        <div className="hover-menu-content" key={title}>
          {/* Left side - Menu sections */}
          <ScrollArea className="hover-menu-sections">
            <div className="hover-menu-sections-content">
              {sections.map((section, idx) => (
                <div key={idx} className={`hover-menu-section ${section.isBold ? 'bold-section' : ''}`}>
                  {section.label && (
                    <h3 className="hover-menu-section-title">{section.label}</h3>
                  )}
                  {section.items && (
                    <ul className={`hover-menu-list ${section.isBold ? 'bold-list' : ''}`}>
                      {section.items.map((item, itemIdx) => {
                        const itemName = getItemName(item);
                        const hasSubmenu = section.hasSubmenu && 
                          ['Clothing', 'Collections', 'Collaborations', 'Footwear', 'Accessories'].includes(itemName);
                        const itemDescription = itemName === 'Outfits' ? 'Shop curated looks' : null;
                        
                        return (
                          <li key={itemIdx} className={hasSubmenu ? 'has-submenu' : ''}>
                            <NavLink 
                              to={getItemLink(item, section.link)}
                              className={`hover-menu-item-link ${section.isBold ? 'bold-item' : ''}`}
                              onMouseEnter={() => hasSubmenu && setExpandedItem(itemName)}
                            >
                              <span className="hover-menu-item-text">
                                {itemName}
                                {itemDescription && (
                                  <span className="hover-menu-item-description">{itemDescription}</span>
                                )}
                              </span>
                              {hasSubmenu && <ChevronRight />}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Right side - Image */}
          {menuImage && (
            <div ref={rightPanelRef} className="hover-menu-image">
              <img src={menuImage} alt={`${title} collection`} />
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div
      ref={triggerRef}
      className="hover-menu-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavLink prefetch="intent" to={titleLink || `/collections/${title.toLowerCase()}`} className="blacmelo-header-link">
        {title}
      </NavLink>
      
      {mounted && menuContent && createPortal(menuContent, document.body)}
    </div>
  );
}

export default HoverMenu;