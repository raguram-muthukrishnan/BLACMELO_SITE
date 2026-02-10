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
  dynamicMenuConfig?: DynamicMenuConfig | null;
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
  dynamicMenuConfig,
  announcements,
}: PageLayoutProps) {
  const location = useLocation();
  const isProductPage = location.pathname.includes('/products/');

  return (
    <Aside.Provider>
      {/* Dynamic Announcement Bar - Always visible */}
      <DynamicAnnouncementBar announcements={announcements} />
      <MobileMenuAside 
        header={header} 
        publicStoreDomain={publicStoreDomain}
        dynamicMenuConfig={dynamicMenuConfig}
      />
      <CartAside cart={cart} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          isProductPage={isProductPage}
          dynamicMenuConfig={dynamicMenuConfig || undefined}
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
  dynamicMenuConfig,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
  dynamicMenuConfig?: DynamicMenuConfig | null;
}) {
  if (!dynamicMenuConfig) {
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

  // Use dynamic menu config
  return (
    <Aside type="mobile" heading="MENU">
      <div className="mobile-menu-content">
        {/* Permanent sections */}
        {dynamicMenuConfig.sections
          .filter(section => section.isPermanent)
          .map((section, idx) => (
            <div key={idx} className="mobile-menu-section">
              <ul className="mobile-menu-list">
                <li>
                  <a href={section.link} className="mobile-menu-item bold-item">
                    {section.label}
                  </a>
                </li>
              </ul>
            </div>
          ))}

        {/* Category sections */}
        {dynamicMenuConfig.sections
          .filter(section => !section.isPermanent && section.items && section.items.length > 0)
          .map((section, idx) => (
            <div key={idx} className="mobile-menu-section">
              {section.label && (
                <h3 className="mobile-menu-section-title">{section.label}</h3>
              )}
              <ul className="mobile-menu-list">
                {section.items?.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <a href={item.link} className="mobile-menu-item">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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


