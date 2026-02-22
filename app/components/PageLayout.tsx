import {Await, useLocation} from 'react-router';
import {Suspense} from 'react';
import * as React from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside, useAside} from '~/components/Aside';
import {Footer} from '~/components/layout/Footer';
import {Header} from '~/components/layout/Header';
import {DynamicAnnouncementBar, FallbackAnnouncementBar} from '~/components/DynamicAnnouncementBar';
import type {AnnouncementItem} from '~/components/DynamicAnnouncementBar';
import type {DynamicMenuConfig} from '~/lib/dynamicHeaderMenu';
import {CartMain} from '~/components/CartMain';
import {ScrollArea} from '~/components/ui/scroll-area';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  menMenuConfig?: DynamicMenuConfig | null;
  womenMenuConfig?: DynamicMenuConfig | null;
  announcements?: AnnouncementItem[];
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  menMenuConfig,
  womenMenuConfig,
  announcements,
}: PageLayoutProps) {
  const location = useLocation();
  const isProductPage = location.pathname.includes('/products/');

  // Pages that should render a white header with black text/icons
  const whiteHeaderPaths = ['/search', '/wishlist', '/faq', '/pages/', '/policies/'];
  const isWhiteHeaderPage = whiteHeaderPaths.some((p) =>
    location.pathname.includes(p),
  );

  return (
    <Aside.Provider>
      {/* Dynamic Announcement Bar - Always visible */}
      <DynamicAnnouncementBar announcements={announcements} />
      <MobileMenuAside 
        header={header} 
        publicStoreDomain={publicStoreDomain}
        menMenuConfig={menMenuConfig}
      />
      <CartAside cart={cart} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          isProductPage={isProductPage}
          isWhiteHeaderPage={isWhiteHeaderPage}
          menMenuConfig={menMenuConfig || undefined}
          womenMenuConfig={womenMenuConfig || undefined}
        />
      )}
      <main style={{margin: 0, padding: 0, width: '100%'}}>{children}</main>
      <Suspense fallback={null}>
        <Await resolve={footer}>
          {(footerData) => footerData && <Footer footer={footerData} />}
        </Await>
      </Suspense>
    </Aside.Provider>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
  menMenuConfig,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
  menMenuConfig?: DynamicMenuConfig | null;
}) {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set());
  const {open} = useAside();

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  if (!menMenuConfig || !menMenuConfig.sections || menMenuConfig.sections.length === 0) {
    // Fallback if no menu config
    return (
      <Aside type="mobile" heading="MENU">
        <div className="mobile-menu-content">
          <div className="mobile-menu-section">
            <ul className="mobile-menu-list">
              <li><a href="/collections" className="mobile-menu-item">Collections</a></li>
              <li><a href="/account" className="mobile-menu-item">Account</a></li>
            </ul>
          </div>
        </div>
      </Aside>
    );
  }

  // Use menu config from Shopify collections
  return (
    <Aside type="mobile" heading="MENU">
      <ScrollArea className="mobile-menu-scroll-container">
        <div className="mobile-menu-content">
          
          {/* Render sections from menu config */}
          {menMenuConfig.sections.map((section, sectionIdx) => {
            const sectionKey = `section-${sectionIdx}`;
            const sectionType = section.sectionType || 'category';
            
            // COMMON SECTION - Mixed permanent and dynamic items (no label, no expandable)
            if (sectionType === 'common') {
              return (
                <div key={sectionIdx} className="mobile-menu-section common-section">
                  <ul className="mobile-menu-list">
                    {section.items?.map((item, itemIdx) => {
                      const isPermanent = item.itemType === 'permanent';
                      return (
                        <li key={itemIdx}>
                          <a 
                            href={item.link} 
                            className={`mobile-menu-item ${isPermanent ? 'permanent-item' : ''}`}
                          >
                            {item.name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }

            // CATEGORY SECTION - Has label and expandable items
            return (
              <div key={sectionIdx} className="mobile-menu-section category-section">
                <h3 className="mobile-menu-section-title">{section.label}</h3>
                <ul className="mobile-menu-list">
                  {section.items?.map((item, itemIdx) => {
                    const itemKey = `${sectionKey}-${itemIdx}`;
                    const itemHasChildren = item.children && item.children.length > 0;
                    const itemIsExpanded = expandedSections.has(itemKey);

                    return (
                      <li key={itemIdx}>
                        <div className="mobile-menu-item-wrapper">
                          <a href={item.link} className="mobile-menu-item">
                            {item.name}
                          </a>
                          {itemHasChildren && (
                            <button
                              className="mobile-menu-expand-btn"
                              onClick={() => toggleSection(itemKey)}
                              aria-label={itemIsExpanded ? 'Collapse' : 'Expand'}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className={`expand-icon ${itemIsExpanded ? 'expanded' : ''}`}
                              >
                                <line x1="8" y1="4" x2="8" y2="12" />
                                <line x1="4" y1="8" x2="12" y2="8" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {itemHasChildren && itemIsExpanded && item.children && (
                          <ul className="mobile-menu-nested-list">
                            {item.children.map((child, childIdx) => (
                              <li key={childIdx}>
                                <a href={child.link} className="mobile-menu-item nested-item">
                                  {child.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {/* Divider */}
          <div className="mobile-menu-divider" />

          {/* EXPLORE - Static section */}
          <div className="mobile-menu-section">
            <h3 className="mobile-menu-section-title">EXPLORE</h3>
            <ul className="mobile-menu-list">
              <li><a href="/the-prestige" className="mobile-menu-item">The Prestige</a></li>
              <li><a href="/the-vault" className="mobile-menu-item">The Vault</a></li>
              <li><a href="/products/gift-card" className="mobile-menu-item">Gift Card</a></li>
            </ul>
          </div>

          {/* ACCOUNT - Static section */}
          <div className="mobile-menu-section">
            <h3 className="mobile-menu-section-title">ACCOUNT</h3>
            <ul className="mobile-menu-list">
              <li><a href="/account" className="mobile-menu-item">My Account</a></li>
              <li><a href="/wishlist" className="mobile-menu-item">Wishlist</a></li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside type="search" heading="SEARCH">
      <div className="search-aside-content">
        <p>Search functionality coming soon...</p>
      </div>
    </Aside>
  );
}

function CartAside({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  return (
    <Aside type="cart" heading="YOUR CART">
      <Suspense fallback={<p>Loading cart...</p>}>
        <Await resolve={cart}>
          {(cartData) => <CartMain cart={cartData} layout="aside" />}
        </Await>
      </Suspense>
    </Aside>
  );
}


