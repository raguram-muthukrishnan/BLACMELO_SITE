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
import {AnnouncementBar} from '~/components/AnnouncementBar';
import {HeaderMenu} from '~/components/Header';
import type {MenuConfigs} from '~/lib/headerMenu';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  menuConfigs?: MenuConfigs | null;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  menuConfigs,
}: PageLayoutProps) {
  const location = useLocation();
  const isProductPage = location.pathname.includes('/products/');

  return (
    <Aside.Provider>
      <Suspense fallback={null}>
        <AnnouncementBar />
      </Suspense>
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          isProductPage={isProductPage}
          menuConfigs={menuConfigs || undefined}
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
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
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

function SearchAside() {
  return (
    <Aside type="search" heading="SEARCH">
      <div className="search-aside-content">
        <p>Search functionality coming soon...</p>
      </div>
    </Aside>
  );
}


