import {Await} from 'react-router';
import {Suspense} from 'react';
import type {HeaderQuery, FooterQuery} from 'storefrontapi.generated';
import {Header} from './Header';
import {Footer} from './Footer';

type PageLayoutProps = {
  header: HeaderQuery;
  footer: FooterQuery;
  cart: Promise<any>;
  isLoggedIn: Promise<boolean>;
  children?: React.ReactNode;
};

export function PageLayout({
  header,
  footer,
  cart,
  isLoggedIn,
  children,
}: PageLayoutProps) {
  return (
    <div className="page-layout">
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
      <main className="main-content">{children}</main>
      <Footer footer={footer} />
    </div>
  );
}
