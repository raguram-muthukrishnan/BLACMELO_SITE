import {NavLink} from 'react-router';
import {useState, useRef, useCallback, useEffect, Suspense} from 'react';
import {Await, useAsyncValue} from 'react-router';
import {useOptimisticCart, useAnalytics, type CartViewPayload} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {Menu, User, ShoppingBag, Search, Bookmark} from 'lucide-react';
import {LottieHeaderLogo} from '~/components/ui/LottieHeaderLogo';
import {DynamicHoverMenu} from '~/components/ui/DynamicHoverMenu';
import menuManImage from '~/assets/menu/menu_man.jpeg';
import menuWomanImage from '~/assets/menu/menu_woman.jpeg';
import {useAside} from '~/components/Aside';
import type {DynamicMenuConfig} from '~/lib/dynamicHeaderMenu';
import {getFallbackDynamicMenu} from '~/lib/dynamicHeaderMenu';
import headerStyles from '~/styles/layout/header.css?url';

type HeaderProps = {
  header: HeaderQuery;
  cart: Promise<any>;
  isLoggedIn: Promise<boolean>;
  isProductPage?: boolean;
  isWhiteHeaderPage?: boolean;
  menMenuConfig?: DynamicMenuConfig;
  womenMenuConfig?: DynamicMenuConfig;
};

export function Header({isProductPage = false, isWhiteHeaderPage = false, menMenuConfig: providedMenMenuConfig, womenMenuConfig: providedWomenMenuConfig, cart}: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {open: openAside} = useAside();

  // Use provided menu configs or fallback
  const menMenuConfig = providedMenMenuConfig || getFallbackDynamicMenu(menuManImage);
  const womenMenuConfig = providedWomenMenuConfig || getFallbackDynamicMenu(menuWomanImage);
  
  // Select the appropriate menu config based on active menu
  const currentMenuConfig = activeMenu === 'blacmelo-club' ? womenMenuConfig : menMenuConfig;

  // Debug logging
  useEffect(() => {
    console.log('🎨 Header menu configs:', {
      menSections: menMenuConfig.sections.length,
      womenSections: womenMenuConfig.sections.length,
      activeMenu: activeMenu,
    });
  }, [menMenuConfig, womenMenuConfig, activeMenu]);

  // Handle scroll to change header background
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMenuEnter = useCallback((menu: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menu);
  }, []);

  const handleMenuLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, []);

  const handleTriggerEnter = useCallback((menu: string) => {
    console.log('🖱️ Mouse entered:', menu);
    handleMenuEnter(menu);
  }, [handleMenuEnter]);

  const handleMobileMenuClick = () => {
    openAside('mobile');
  };

  return (
    <header className={`blacmelo-header ${activeMenu ? 'header-menu-active' : ''} ${isScrolled ? 'header-scrolled' : ''} ${isProductPage ? 'header-product-page' : ''} ${isWhiteHeaderPage ? 'header-white-page' : ''}`}>
      <div className="blacmelo-header-container">
        {/* Left Navigation */}
        <nav className="blacmelo-header-left">
          {/* Mobile Menu Button */}
          <button 
            className="blacmelo-mobile-menu-btn" 
            onClick={handleMobileMenuClick}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          
          {/* Desktop Links - Only Shop and Blacmelo Club */}
          <div
            className="hover-menu-trigger"
            onMouseEnter={() => handleTriggerEnter('shop')}
          >
            <NavLink
              prefetch="intent"
              to="/collections/full-collection"
              className={({isActive}) => `blacmelo-header-link ${isActive ? '' : ''}`}
              end={false}
            >
              Man
            </NavLink>
          </div>
          
          <div
            className="hover-menu-trigger"
            onMouseEnter={() => handleTriggerEnter('blacmelo-club')}
          >
            <NavLink
              prefetch="intent"
              to="/collections/full-collection"
              className={({isActive}) => `blacmelo-header-link ${isActive ? '' : ''}`}
              end={false}
            >
              Women
            </NavLink>
          </div>
        </nav>

        {/* Center Logo — Lottie scroll-driven animation */}
        <NavLink prefetch="intent" to="/" className="blacmelo-header-logo" aria-label="BLACMELO – home">
          <LottieHeaderLogo />
        </NavLink>

        {/* Right Navigation */}
        <nav className="blacmelo-header-right">
          {/* Desktop Links */}
          <NavLink 
            prefetch="intent" 
            to="/the-vault" 
            className={({isActive}) => `blacmelo-header-link ${isActive ? 'active' : ''}`}
          >
            The Vault
          </NavLink>
          <NavLink 
            prefetch="intent" 
            to="/the-prestige" 
            className={({isActive}) => `blacmelo-header-link ${isActive ? 'active' : ''}`}
          >
            The Prestige
          </NavLink>
          
          {/* Search Icon */}
          <NavLink prefetch="intent" to="/search" className="blacmelo-header-icon" aria-label="Search">
            <Search size={20} />
          </NavLink>
          
          {/* Wishlist Icon */}
          <NavLink prefetch="intent" to="/wishlist" className="blacmelo-header-icon" aria-label="Wishlist">
            <Bookmark size={20} />
          </NavLink>
          
          {/* User Icon (visible on all screens) */}
          <NavLink prefetch="intent" to="/account" className="blacmelo-header-icon" aria-label="Account">
            <User size={20} />
          </NavLink>

          {/* Cart Icon with Badge */}
          <CartToggle cart={cart} />
        </nav>
      </div>

      {/* Dynamic Hover Menu - Shows for both Shop and Blacmelo Club */}
      {(activeMenu === 'shop' || activeMenu === 'blacmelo-club') && (
        <DynamicHoverMenu
          isActive={true}
          menuConfig={currentMenuConfig}
          onMouseLeave={handleMenuLeave}
        />
      )}
    </header>
  );
}

function CartToggle({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
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

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="blacmelo-cart-icon"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
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
