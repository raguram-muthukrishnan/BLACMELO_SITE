/**
 * Dynamic Hover Menu Component
 * Displays dynamic menu sections based on Shopify collections
 * Uses existing unified-hover-menu CSS classes
 */

import {NavLink} from 'react-router';
import {createPortal} from 'react-dom';
import {useEffect, useState, useRef, useCallback} from 'react';
import type {DynamicMenuConfig} from '~/lib/dynamicHeaderMenu';

interface DynamicHoverMenuProps {
  isActive: boolean;
  menuConfig: DynamicMenuConfig;
  onMouseLeave: () => void;
}

export function DynamicHoverMenu({
  isActive,
  menuConfig,
  onMouseLeave,
}: DynamicHoverMenuProps) {
  const [mounted, setMounted] = useState(false);
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

  if (!isActive || !mounted) return null;

  console.log('🎯 DynamicHoverMenu render:', {
    isActive,
    mounted,
    sections: menuConfig.sections.length,
    permanentSections: menuConfig.sections.filter(s => s.isPermanent).length,
    dynamicSections: menuConfig.sections.filter(s => !s.isPermanent).length,
  });

  const menuContent = (
    <div 
      ref={menuRef}
      className="unified-hover-menu-overlay"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hover-menu-dropdown">
        <div className="hover-menu-content">
          {/* Left side - Menu sections */}
          <div className="hover-menu-sections">
            {menuConfig.sections.map((section, idx) => (
              <div key={idx} className={`hover-menu-section ${section.isPermanent ? 'bold-section' : ''}`}>
                {/* Section title (for categories) or direct link (for permanent sections) */}
                {section.items && section.items.length > 0 ? (
                  // Category section with items
                  <>
                    {section.label && (
                      <h3 className="hover-menu-section-title">{section.label}</h3>
                    )}
                    <ul className="hover-menu-list">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <NavLink 
                            to={item.link}
                            className="hover-menu-item-link"
                          >
                            <span className="hover-menu-item-text">
                              {item.name}
                            </span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  // Permanent section (direct link)
                  <ul className={`hover-menu-list ${section.isPermanent ? 'bold-list' : ''}`}>
                    <li>
                      <NavLink 
                        to={section.link}
                        className={`hover-menu-item-link ${section.isPermanent ? 'bold-item' : ''}`}
                      >
                        <span className="hover-menu-item-text">
                          {section.label}
                        </span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </div>
            ))}
          </div>
          
          {/* Right side - Image */}
          {menuConfig.image && (
            <div className="hover-menu-image">
              <img src={menuConfig.image} alt="Menu" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}
