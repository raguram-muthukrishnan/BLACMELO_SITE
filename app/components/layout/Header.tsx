import {NavLink} from 'react-router';
import {useState, useRef, useCallback, useEffect, Suspense} from 'react';
import {Await, useAsyncValue} from 'react-router';
import {useOptimisticCart, useAnalytics, type CartViewPayload} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {Menu, User, ShoppingBag} from 'lucide-react';
import logo from '~/assets/logos/Logo.avif';
import {DynamicHoverMenu} from '~/components/ui/DynamicHoverMenu';
import menuManImage from '~/assets/menu/menu_man.jpeg';
import {useAside} from '~/components/Aside';
import type {DynamicMenuConfig} from '~/lib/dynamicHeaderMenu';
import {getFallbackDynamicMenu} from '~/lib/dynamicHeaderMenu';

type HeaderProps = {
  header: HeaderQuery;
  cart: Promise<any>;
  isLoggedIn: Promise<boolean>;
  isProductPage?: boolean;
  dynamicMenuConfig?: DynamicMenuConfig;
};

export function Header({isProductPage = false, dynamicMenuConfig: providedMenuConfig, cart}: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {open: openAside} = useAside();

  // Use provided menu config or fallback
  const menuConfig = providedMenuConfig || getFallbackDynamicMenu(menuManImage);

  // Debug logging
  useEffect(() => {
    console.log('🎨 Header dynamic menu config:', {
      sections: menuConfig.sections.length,
      permanentSections: menuConfig.sections.filter(s => s.isPermanent).length,
      dynamicSections: menuConfig.sections.filter(s => !s.isPermanent).length,
    });
  }, [menuConfig]);

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
    <header className={`blacmelo-header ${activeMenu ? 'header-menu-active' : ''} ${isScrolled ? 'header-scrolled' : ''} ${isProductPage ? 'header-product-page' : ''}`}>
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
              to="/collections/all" 
              className={({isActive}) => `blacmelo-header-link ${isActive ? '' : ''}`}
              end={false}
            >
              Shop
            </NavLink>
          </div>
          
          <div
            className="hover-menu-trigger"
            onMouseEnter={() => handleTriggerEnter('blacmelo-club')}
          >
            <NavLink 
              prefetch="intent" 
              to="/blacmelo-club" 
              className={({isActive}) => `blacmelo-header-link ${isActive ? '' : ''}`}
              end={false}
            >
              Blacmelo Club
            </NavLink>
          </div>
        </nav>

        {/* Center Logo */}
        <NavLink prefetch="intent" to="/" className="blacmelo-header-logo">
          <img 
            src={logo} 
            alt="BLACMELO" 
            className="blacmelo-logo-image"
          />
        </NavLink>

        {/* Right Navigation */}
        <nav className="blacmelo-header-right">
          {/* Desktop Links */}
          <NavLink 
            prefetch="intent" 
            to="/about" 
            className={({isActive}) => `blacmelo-header-link ${isActive ? 'active' : ''}`}
          >
            About us
          </NavLink>
          <NavLink 
            prefetch="intent" 
            to="/contact" 
            className={({isActive}) => `blacmelo-header-link ${isActive ? 'active' : ''}`}
          >
            Contact us
          </NavLink>
          <NavLink 
            prefetch="intent" 
            to="/faq" 
            className={({isActive}) => `blacmelo-header-link ${isActive ? 'active' : ''}`}
          >
            FAQ
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
          menuConfig={menuConfig}
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
