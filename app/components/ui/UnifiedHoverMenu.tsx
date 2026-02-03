import {NavLink} from 'react-router';
import {createPortal} from 'react-dom';
import {useEffect, useState, useRef, useCallback} from 'react';

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

interface MenuConfig {
  sections: MenuItem[];
  image: string;
}

interface UnifiedHoverMenuProps {
  activeMenu: string | null;
  menuConfigs: {
    man: MenuConfig;
    women: MenuConfig;
    blacmelo: MenuConfig;
  };
  onMouseLeave: () => void;
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

export function UnifiedHoverMenu({
  activeMenu,
  menuConfigs,
  onMouseLeave,
}: UnifiedHoverMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset expanded item when menu changes
  useEffect(() => {
    if (!activeMenu) {
      setExpandedItem(null);
    }
  }, [activeMenu]);

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

  if (!activeMenu || !mounted) return null;

  const currentConfig = menuConfigs[activeMenu as keyof typeof menuConfigs];
  if (!currentConfig) return null;

  const menuContent = (
    <div 
      ref={menuRef}
      className="unified-hover-menu-overlay"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hover-menu-dropdown">
        <div className="hover-menu-content" key={activeMenu}>
          {/* Left side - Menu sections */}
          <div className="hover-menu-sections">
            {currentConfig.sections.map((section, idx) => (
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
          
          {/* Right side - Image */}
          <div className="hover-menu-image">
            <img src={currentConfig.image} alt={`${activeMenu} collection`} />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}

export default UnifiedHoverMenu;
