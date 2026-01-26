import {NavLink} from 'react-router';
import {useState, useRef, useCallback} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import logo from '~/assets/logos/Logo.avif';
import HoverMenu from '~/components/ui/HoverMenu';
import menuManImage from '~/assets/menu/menu_man.jpeg';
import menuWomanImage from '~/assets/menu/menu_woman.jpeg';

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

// User Icon SVG Component
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Shopping Bag Icon SVG Component
function ShoppingBagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2.5 5L5 1.66667H15L17.5 5M2.5 5V16.6667C2.5 17.1087 2.67559 17.5326 2.98816 17.8452C3.30072 18.1577 3.72464 18.3333 4.16667 18.3333H15.8333C16.2754 18.3333 16.6993 18.1577 17.0118 17.8452C17.3244 17.5326 17.5 17.1087 17.5 16.6667V5M2.5 5H17.5M13.3333 8.33333C13.3333 9.21739 12.9821 10.0652 12.357 10.6904C11.7319 11.3155 10.8841 11.6667 10 11.6667C9.11595 11.6667 8.2681 11.3155 7.64298 10.6904C7.01786 10.0652 6.66667 9.21739 6.66667 8.33333" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Hamburger Menu Icon
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Search Icon
function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function Header({}: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = useCallback((menu: string) => {
    // Clear any pending close timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menu);
  }, []);

  const handleMenuLeave = useCallback(() => {
    // Add a delay before closing the menu when cursor moves away
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  }, []);

  return (
    <header className={`blacmelo-header ${activeMenu ? 'header-menu-active' : ''}`}>
      <div className="blacmelo-header-container">
        {/* Left Navigation */}
        <nav className="blacmelo-header-left">
          {/* Mobile Menu Button */}
          <button className="blacmelo-mobile-menu-btn" aria-label="Menu">
            <MenuIcon />
          </button>
          
          {/* Mobile Search Button */}
          <button className="blacmelo-mobile-search-btn" aria-label="Search">
            <SearchIcon />
          </button>
          
          {/* Desktop Links with Hover Menus */}
          <HoverMenu
            title="Man"
            sections={manMenuSections}
            isOpen={activeMenu === 'man'}
            onMouseEnter={() => handleMenuEnter('man')}
            onMouseLeave={handleMenuLeave}
            menuImage={menuManImage}
          />
          
          <HoverMenu
            title="Women"
            sections={womenMenuSections}
            isOpen={activeMenu === 'women'}
            onMouseEnter={() => handleMenuEnter('women')}
            onMouseLeave={handleMenuLeave}
            menuImage={menuWomanImage}
          />
          
          <HoverMenu
            title="Blacmelo +"
            sections={blacmeloPlusMenuSections}
            isOpen={activeMenu === 'blacmelo'}
            onMouseEnter={() => handleMenuEnter('blacmelo')}
            onMouseLeave={handleMenuLeave}
            menuImage={menuManImage}
          />
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
            <UserIcon />
          </NavLink>
          
          {/* Shopping Bag Icon (visible on all screens) */}
          <NavLink prefetch="intent" to="/cart" className="blacmelo-header-icon" aria-label="Shopping Bag">
            <ShoppingBagIcon />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
