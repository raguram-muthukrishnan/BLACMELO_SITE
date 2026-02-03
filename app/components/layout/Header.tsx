import {NavLink} from 'react-router';
import {useState, useRef, useCallback, useEffect} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import {Menu, User} from 'lucide-react';
import logo from '~/assets/logos/Logo.avif';
import {UnifiedHoverMenu} from '~/components/ui/UnifiedHoverMenu';
import menuManImage from '~/assets/menu/menu_man.jpeg';
import menuWomanImage from '~/assets/menu/menu_woman.jpeg';
import {useAside} from '~/components/Aside';

type HeaderProps = {
  header: HeaderQuery;
  cart: Promise<any>;
  isLoggedIn: Promise<boolean>;
};

// Menu configurations based on the reference image
// Both Man and Women sections point to the same Unisex collection
const manMenuSections = [
  {
    label: '', // No label - these appear bold at the top
    link: '/collections/unisex',
    items: [
      {name: 'New Arrivals', link: '/collections/unisex'},
      {name: 'Bestsellers', link: '/collections/unisex'},
      {name: 'Restocked', link: '/collections/unisex'},
      {name: 'Shop All', link: '/collections/unisex'}
    ],
    hasSubmenu: false,
    isBold: true
  },
  {
    label: 'FEATURED',
    link: '/collections/unisex',
    items: [
      {name: 'Fall Winter \'25', link: '/collections/unisex'},
      {name: 'Owners Club', link: '/collections/unisex'},
      {name: '247', link: '/collections/unisex'},
      {name: 'Initial', link: '/collections/unisex'}
    ],
    hasSubmenu: false,
    isBold: false
  },
  {
    label: 'SHOP',
    link: '/collections/unisex',
    items: [
      {name: 'Clothing', link: '/collections/unisex'},
      {name: 'Footwear', link: '/collections/unisex'},
      {name: 'Accessories', link: '/collections/unisex'}
    ],
    hasSubmenu: true,
    isBold: false
  }
];

const womenMenuSections = [
  {
    label: '', // No label - these appear bold at the top
    link: '/collections/unisex',
    items: [
      {name: 'New Arrivals', link: '/collections/unisex'},
      {name: 'Bestsellers', link: '/collections/unisex'},
      {name: 'Restocked', link: '/collections/unisex'},
      {name: 'Shop All', link: '/collections/unisex'}
    ],
    hasSubmenu: false,
    isBold: true
  },
  {
    label: 'FEATURED',
    link: '/collections/unisex',
    items: [
      {name: 'Fall Winter \'25', link: '/collections/unisex'},
      {name: 'Woman', link: '/collections/unisex'},
      {name: 'Unisex', link: '/collections/unisex'}
    ],
    hasSubmenu: false,
    isBold: false
  },
  {
    label: 'SHOP',
    link: '/collections/unisex',
    items: [
      {name: 'Clothing', link: '/collections/unisex'},
      {name: 'Footwear', link: '/collections/unisex'},
      {name: 'Accessories', link: '/collections/unisex'}
    ],
    hasSubmenu: true,
    isBold: false
  }
];

const blacmeloPlusMenuSections = [
  {
    label: '', // No label - these appear bold at the top
    link: '/collections/unisex',
    items: [
      {name: 'Owners Club', link: '/collections/unisex'},
      {name: 'Join Now', link: '/collections/unisex'},
      {name: 'Benefits', link: '/collections/unisex'}
    ],
    hasSubmenu: false,
    isBold: true
  },
  {
    label: 'EXCLUSIVE',
    link: '/collections/unisex',
    items: [
      {name: 'Early Access', link: '/collections/unisex'},
      {name: 'VIP Events', link: '/collections/unisex'},
      {name: 'Personal Styling', link: '/collections/unisex'},
      {name: 'Priority Support', link: '/collections/unisex'}
    ],
    hasSubmenu: false,
    isBold: false
  },
  {
    label: 'COLLECTIONS',
    link: '/collections/unisex',
    items: [
      {name: 'Members Only', link: '/collections/unisex'},
      {name: 'Limited Editions', link: '/collections/unisex'},
      {name: 'Collaborations', link: '/collections/unisex'}
    ],
    hasSubmenu: false,
    isBold: false
  }
];




export function Header({}: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {open: openAside} = useAside();

  // Menu configurations
  const menuConfigs = {
    man: {
      sections: manMenuSections,
      image: menuManImage,
    },
    women: {
      sections: womenMenuSections,
      image: menuWomanImage,
    },
    blacmelo: {
      sections: blacmeloPlusMenuSections,
      image: menuManImage,
    },
  };

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
    handleMenuEnter(menu);
  }, [handleMenuEnter]);

  const handleMobileMenuClick = () => {
    openAside('mobile');
  };

  return (
    <header className={`blacmelo-header ${activeMenu ? 'header-menu-active' : ''} ${isScrolled ? 'header-scrolled' : ''}`}>
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
            <NavLink prefetch="intent" to="/collections/unisex" className="blacmelo-header-link">
              Man
            </NavLink>
          </div>
          
          <div
            className="hover-menu-trigger"
            onMouseEnter={() => handleTriggerEnter('women')}
          >
            <NavLink prefetch="intent" to="/collections/unisex" className="blacmelo-header-link">
              Women
            </NavLink>
          </div>
          
          <div
            className="hover-menu-trigger"
            onMouseEnter={() => handleTriggerEnter('blacmelo')}
          >
            <NavLink prefetch="intent" to="/collections/unisex" className="blacmelo-header-link">
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
          <NavLink prefetch="intent" to="/about" className="blacmelo-header-link">
            About us
          </NavLink>
          <NavLink prefetch="intent" to="/contact" className="blacmelo-header-link">
            Contact us
          </NavLink>
          <NavLink prefetch="intent" to="/faq" className="blacmelo-header-link">
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
