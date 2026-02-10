import {NavLink} from 'react-router';
import {useState, useRef, useCallback, useEffect} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import {Menu, User} from 'lucide-react';
import logo from '~/assets/logos/Logo.avif';
import {UnifiedHoverMenu} from '~/components/ui/UnifiedHoverMenu';
import menuManImage from '~/assets/menu/menu_man.jpeg';
import menuWomanImage from '~/assets/menu/menu_woman.jpeg';
import {useAside} from '~/components/Aside';
import type {MenuConfigs} from '~/lib/headerMenu';
import {getFallbackMenuConfigs} from '~/lib/headerMenu';

type HeaderProps = {
  header: HeaderQuery;
  cart: Promise<any>;
  isLoggedIn: Promise<boolean>;
  isProductPage?: boolean;
  menuConfigs?: MenuConfigs;
};

export function Header({isProductPage = false, menuConfigs: providedMenuConfigs}: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {open: openAside} = useAside();

  // Get fallback configs
  const fallbackConfigs = getFallbackMenuConfigs({
    man: menuManImage,
    women: menuWomanImage,
    blacmelo: menuManImage,
  });

  // Use provided menu configs, but merge with fallback for missing keys
  const menuConfigs = {
    man: providedMenuConfigs?.man || fallbackConfigs.man,
    women: providedMenuConfigs?.women || fallbackConfigs.women,
    blacmelo: providedMenuConfigs?.blacmelo || fallbackConfigs.blacmelo,
  };

  // Debug logging
  useEffect(() => {
    console.log('🎨 Header menuConfigs:', {
      hasMan: !!menuConfigs.man,
      hasWomen: !!menuConfigs.women,
      hasBlacmelo: !!menuConfigs.blacmelo,
      manSections: menuConfigs.man?.sections?.length || 0,
    });
  }, [menuConfigs]);

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
          
          {/* Desktop Links - Simple triggers */}
          <div
            className="hover-menu-trigger"
            onMouseEnter={() => handleTriggerEnter('man')}
          >
            <NavLink 
              prefetch="intent" 
              to="/collections/unisex" 
              className={({isActive}) => `blacmelo-header-link ${isActive ? '' : ''}`}
              end={false}
            >
              Man
            </NavLink>
          </div>
          
          <div
            className="hover-menu-trigger"
            onMouseEnter={() => handleTriggerEnter('women')}
          >
            <NavLink 
              prefetch="intent" 
              to="/collections/unisex" 
              className={({isActive}) => `blacmelo-header-link ${isActive ? '' : ''}`}
              end={false}
            >
              Women
            </NavLink>
          </div>
          
          <div
            className="hover-menu-trigger"
            onMouseEnter={() => handleTriggerEnter('blacmelo')}
          >
            <NavLink 
              prefetch="intent" 
              to="/collections/unisex" 
              className={({isActive}) => `blacmelo-header-link ${isActive ? '' : ''}`}
              end={false}
            >
              Blacmelo +
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
        </nav>
      </div>

      {/* Unified Menu Container */}
      <UnifiedHoverMenu
        activeMenu={activeMenu}
        menuConfigs={menuConfigs}
        onMouseLeave={handleMenuLeave}
      />
    </header>
  );
}
