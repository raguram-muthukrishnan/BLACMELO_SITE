import {Await, useLocation} from 'react-router';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/layout/Footer';
import {Header} from '~/components/layout/Header';
import {DynamicAnnouncementBar, FallbackAnnouncementBar} from '~/components/DynamicAnnouncementBar';
import type {AnnouncementItem} from '~/components/DynamicAnnouncementBar';
import {HeaderMenu} from '~/components/Header';
import type {DynamicMenuConfig} from '~/lib/dynamicHeaderMenu';
import {CartMain} from '~/components/CartMain';

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
          {(footerData) => <Footer footer={footerData} />}
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
  if (!menMenuConfig) {
    // Fallback to old menu if no dynamic config
    return (
      header.menu &&
      header.shop.primaryDomain?.url && (
        <Aside type="mobile" heading="MENU">
          <HeaderMenu
            menu={header.menu}
            viewport="mobile"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </Aside>
      )
    );
  }

  // Use dynamic menu config — organised Represent-style layout
  return (
    <Aside type="mobile" heading="MENU">
      <div className="mobile-menu-content">
        {/* Dynamic sections from Shopify collections config */}
        {menMenuConfig.sections.map((section, idx) => {
          const sectionType = section.sectionType || (section.isPermanent ? 'permanent' : 'category');

          if (sectionType === 'permanent') {
            return (
              <div key={idx} className="mobile-menu-section permanent-section">
                <ul className="mobile-menu-list">
                  {section.items?.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a href={item.link} className="mobile-menu-item permanent-item">
                        {item.name}
                      </a>
                      {item.children && item.children.length > 0 && (
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
                  ))}
                </ul>
              </div>
            );
          }

          return (
            <div key={idx} className="mobile-menu-section">
              {section.label && section.label !== 'PERMANENT_LINKS' && section.label !== 'COMMON' && (
                <h3 className="mobile-menu-section-title">{section.label}</h3>
              )}
              <ul className="mobile-menu-list">
                {section.items?.map((item, itemIdx) => {
                  const itemClass = item.itemType === 'permanent'
                    ? 'mobile-menu-item permanent-item'
                    : 'mobile-menu-item';
                  return (
                    <li key={itemIdx}>
                      <a href={item.link} className={itemClass}>
                        {item.name}
                      </a>
                      {item.children && item.children.length > 0 && (
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

        {/* Explore — static links not in the dynamic config */}
        <div className="mobile-menu-section">
          <h3 className="mobile-menu-section-title">EXPLORE</h3>
          <ul className="mobile-menu-list">
            <li><a href="/the-prestige" className="mobile-menu-item">The Prestige</a></li>
            <li><a href="/the-vault" className="mobile-menu-item">The Vault</a></li>
            <li><a href="/products/gift-card" className="mobile-menu-item">Gift Card</a></li>
          </ul>
        </div>

        {/* Account & Services */}
        <div className="mobile-menu-section">
          <h3 className="mobile-menu-section-title">ACCOUNT</h3>
          <ul className="mobile-menu-list">
            <li><a href="/account" className="mobile-menu-item">My Account</a></li>
            <li><a href="/wishlist" className="mobile-menu-item">Wishlist</a></li>
            <li><a href="/search" className="mobile-menu-item">Search</a></li>
          </ul>
        </div>

        {/* Help */}
        <div className="mobile-menu-section">
          <h3 className="mobile-menu-section-title">HELP</h3>
          <ul className="mobile-menu-list">
            <li><a href="/pages/contact" className="mobile-menu-item">Contact Us</a></li>
            <li><a href="/faq" className="mobile-menu-item">FAQ</a></li>
            <li><a href="/pages/shipping-returns" className="mobile-menu-item">Shipping & Returns</a></li>
          </ul>
        </div>
      </div>
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


