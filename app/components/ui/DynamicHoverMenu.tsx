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
  const [hoveredParent, setHoveredParent] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    }, 100);
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
    }, 150);
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
    }, 150);
  }, []);

  // Helper to render menu item with optional children
  const renderMenuItem = (item: any, itemIdx: number, itemClass: string) => {
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <li 
        key={itemIdx} 
        className={hasChildren ? 'has-children' : ''}
        onMouseEnter={() => hasChildren && handleParentEnter(item)}
        onMouseLeave={() => hasChildren && handleParentLeave()}
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
          
          {/* Right side - Image or Nested Menu */}
          <div className="hover-menu-right-panel">
            {/* Image */}
            {menuConfig.image && (
              <div 
                className={`hover-menu-image ${hoveredParent ? 'fade-out' : 'fade-in'}`}
              >
                <img src={menuConfig.image} alt="Menu" />
              </div>
            )}
            
            {/* Nested Collections Panel */}
            {hoveredParent && (
              <div 
                className="hover-menu-nested-panel fade-in"
                onMouseEnter={handleNestedPanelEnter}
                onMouseLeave={handleNestedPanelLeave}
              >
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
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}
