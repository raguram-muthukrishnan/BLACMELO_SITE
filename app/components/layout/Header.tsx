import { NavLink } from 'react-router';
import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { Await, useAsyncValue } from 'react-router';
import { useOptimisticCart, useAnalytics, type CartViewPayload } from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { Menu, User, ShoppingBag, Search, Bookmark, X } from 'lucide-react';
import { DynamicHoverMenu } from '~/components/ui/DynamicHoverMenu';
import menuManImage from '~/assets/menu/menu_man.jpeg';
import menuWomanImage from '~/assets/menu/menu_woman.jpeg';
import logoImage from '~/assets/logos/Logo.avif';
import { useAside } from '~/components/Aside';
import type { DynamicMenuConfig } from '~/lib/dynamicHeaderMenu';
import { getFallbackDynamicMenu } from '~/lib/dynamicHeaderMenu';

type HeaderProps = {
  header: HeaderQuery;
  cart: Promise<any>;
  isLoggedIn: Promise<boolean>;
  isProductPage?: boolean;
  isWhiteHeaderPage?: boolean;
  menMenuConfig?: DynamicMenuConfig;
  womenMenuConfig?: DynamicMenuConfig;
};

export function Header({ isProductPage = false, isWhiteHeaderPage = false, menMenuConfig: providedMenMenuConfig, womenMenuConfig: providedWomenMenuConfig, cart }: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuItemHovered, setIsMenuItemHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { open: openAside, close: closeAside, type: asideType } = useAside();

  const isMobileMenuOpen = asideType === 'mobile';
  const isCartOpen = asideType === 'cart';

  const menMenuConfig = providedMenMenuConfig || getFallbackDynamicMenu(menuManImage);
  const womenMenuConfig = providedWomenMenuConfig || getFallbackDynamicMenu(menuWomanImage);
  const currentMenuConfig = activeMenu === 'blacmelo-club' ? womenMenuConfig : menMenuConfig;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuEnter = useCallback((menu: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menu);
  }, []);

  const handleMenuLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  }, []);

  const handleTriggerEnter = useCallback((menu: string) => {
    handleMenuEnter(menu);
  }, [handleMenuEnter]);

  const handleMenuItemHover = useCallback((isHovered: boolean) => {
    setIsMenuItemHovered(isHovered);
  }, []);

  const handleMobileMenuClick = () => {
    if (isMobileMenuOpen || isCartOpen) closeAside();
    else openAside('mobile');
  };

  const handleMobileSearchClick = () => {
    if (isMobileMenuOpen || isCartOpen) closeAside();
    openAside('search');
  };

  return (
    <header className={`blacmelo-header ${activeMenu ? 'header-menu-active' : ''} ${isScrolled ? 'header-scrolled' : ''} ${isProductPage ? 'header-product-page' : ''} ${isWhiteHeaderPage ? 'header-white-page' : ''} ${isMobileMenuOpen || isCartOpen ? 'mobile-menu-open' : ''} ${isMenuItemHovered ? 'header-menu-hovered' : ''}`}>
      <div className="blacmelo-header-container">

        {/* ===== LEFT NAV ===== */}
        <nav className="blacmelo-header-left">

          {/* MOBILE — CLOSED: sandwich icon */}
          {!(isMobileMenuOpen || isCartOpen) && (
            <button
              className="blacmelo-mobile-menu-btn mobile-only"
              onClick={handleMobileMenuClick}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          )}

          {/* MOBILE — CLOSED: search icon (2nd slot) */}
          {!(isMobileMenuOpen || isCartOpen) && (
            <button
              className="blacmelo-header-icon mobile-only"
              onClick={handleMobileSearchClick}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}

          {/* MOBILE — OPEN (Menu or Cart): close icon (1st slot) */}
          {(isMobileMenuOpen || isCartOpen) && (
            <button
              className="blacmelo-mobile-menu-btn mobile-only"
              onClick={handleMobileMenuClick}
              aria-label="Close"
            >
              <X size={22} />
            </button>
          )}

          {/* MOBILE — OPEN (Menu or Cart): search icon (2nd slot) */}
          {(isMobileMenuOpen || isCartOpen) && (
            <button
              className="blacmelo-header-icon mobile-only"
              onClick={handleMobileSearchClick}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}

          {/* MOBILE — OPEN (Menu or Cart): wishlist icon (3rd slot) */}
          {(isMobileMenuOpen || isCartOpen) && (
            <NavLink
              prefetch="intent"
              to="/wishlist"
              className="blacmelo-header-icon mobile-only"
              aria-label="Wishlist"
              onClick={closeAside}
            >
              <Bookmark size={20} />
            </NavLink>
          )}

          {/* DESKTOP: Man hover link */}
          <div
            className="hover-menu-trigger desktop-only"
            onMouseEnter={() => handleTriggerEnter('shop')}
          >
            <NavLink
              prefetch="intent"
              to="/collections/full-collection"
              className="blacmelo-header-link"
              end={false}
            >
              Man
            </NavLink>
          </div>

          {/* DESKTOP: Women hover link */}
          <div
            className="hover-menu-trigger desktop-only"
            onMouseEnter={() => handleTriggerEnter('blacmelo-club')}
          >
            <NavLink
              prefetch="intent"
              to="/collections/full-collection"
              className="blacmelo-header-link"
              end={false}
            >
              Women
            </NavLink>
          </div>

          {/* DESKTOP: Blacmelo Club */}
          <NavLink
            prefetch="intent"
            to="/blacmelo-club"
            className={({ isActive }) => `blacmelo-header-link desktop-only ${isActive ? 'active' : ''}`}
          >
            Blacmelo Club
          </NavLink>
        </nav>

        {/* ===== CENTER LOGO — hidden on mobile when menu/cart is open ===== */}
        {!(isMobileMenuOpen || isCartOpen) && (
          <NavLink prefetch="intent" to="/" className="blacmelo-header-logo" aria-label="BLACMELO – home">
            <img src={logoImage} alt="BLACMELO" className="blacmelo-logo-image" />
          </NavLink>
        )}

        {/* ===== RIGHT NAV ===== */}
        <nav className="blacmelo-header-right">

          {/* MOBILE — OPEN: Man link on far right */}
          {(isMobileMenuOpen || isCartOpen) && (
            <NavLink
              prefetch="intent"
              to="/collections/full-collection"
              className="blacmelo-header-link mobile-only mobile-man-link"
              onClick={closeAside}
            >
              SHOP
            </NavLink>
          )}

          {/* DESKTOP: The Chamber */}
          <NavLink
            prefetch="intent"
            to="/the-chamber"
            className={({ isActive }) => `blacmelo-header-link desktop-only ${isActive ? 'active' : ''}`}
          >
            The Chamber
          </NavLink>

          {/* DESKTOP: Private Access */}
          <NavLink
            prefetch="intent"
            to="/the-private-access"
            className={({ isActive }) => `blacmelo-header-link desktop-only ${isActive ? 'active' : ''}`}
          >
            Private Access
          </NavLink>


          {/* DESKTOP only: Search + Wishlist */}
          <NavLink prefetch="intent" to="/search" className="blacmelo-header-icon desktop-only" aria-label="Search">
            <Search size={20} />
          </NavLink>
          <NavLink prefetch="intent" to="/wishlist" className="blacmelo-header-icon desktop-only" aria-label="Wishlist">
            <Bookmark size={20} />
          </NavLink>

          {/* Account — visible on all screens but hidden on mobile when menu/cart is open */}
          {!(isMobileMenuOpen || isCartOpen) && (
            <NavLink prefetch="intent" to="/account" className="blacmelo-header-icon" aria-label="Account">
              <User size={20} />
            </NavLink>
          )}

          {/* Cart — always visible (will trigger aside on mobile too) */}
          <CartToggle cart={cart} />
        </nav>
      </div>

      {/* Desktop hover menu */}
      {(activeMenu === 'shop' || activeMenu === 'blacmelo-club') && (
        <DynamicHoverMenu
          isActive={true}
          menuConfig={currentMenuConfig}
          onMouseLeave={handleMenuLeave}
          onMenuItemHover={handleMenuItemHover}
        />
      )}
    </header>
  );
}

function CartToggle({ cart }: { cart: Promise<CartApiQueryFragment | null> }) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function CartBadge({ count }: { count: number | null }) {
  const { open, close, type: asideType } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();
  const isCartOpen = asideType === 'cart';

  return (
    <button
      className="blacmelo-cart-icon"
      onClick={(e) => {
        e.preventDefault();
        if (isCartOpen) close();
        else {
          open('cart');
          publish('cart_viewed', {
            cart,
            prevCart,
            shop,
            url: window.location.href || '',
          } as CartViewPayload);
        }
      }}
      aria-label={`Cart with ${count ?? 0} items`}
    >
      <ShoppingBag size={20} />
      {count !== null && count > 0 && (
        <span className="blacmelo-cart-badge">{count}</span>
      )}
    </button>
  );
}