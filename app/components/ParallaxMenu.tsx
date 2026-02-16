import {useEffect, useState, useRef} from 'react';
import {Link} from 'react-router';

interface ParallaxMenuProps {
  banner3Ref: React.RefObject<HTMLDivElement>;
  banner4Ref: React.RefObject<HTMLDivElement>;
}

type MenuPosition = 'banner3' | 'static' | 'banner4';

export function ParallaxMenu({banner3Ref, banner4Ref}: ParallaxMenuProps) {
  const [position, setPosition] = useState<MenuPosition>('banner3');
  const [fixedTop, setFixedTop] = useState<number>(50);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!banner3Ref.current || !banner4Ref.current) return;

      const banner3Rect = banner3Ref.current.getBoundingClientRect();
      const banner4Rect = banner4Ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Hide menu when banner3 is completely above viewport
      if (banner3Rect.bottom < 0) {
        setIsVisible(false);
        setPosition('banner3');
        setFixedTop(50);
        return;
      }

      // Hide menu when banner3 hasn't started entering viewport yet
      if (banner3Rect.top > viewportHeight) {
        setIsVisible(false);
        setPosition('banner3');
        setFixedTop(50);
        return;
      }

      // Show menu when banner3 is in viewport
      setIsVisible(true);

      // Phase 1: Banner3 scrolling up - menu moves UP with banner3
      // Menu appears to be "stuck" to banner3, moving at same speed
      if (banner3Rect.bottom > viewportHeight * 0.5) {
        setPosition('banner3');
        // Calculate menu position relative to banner3's center
        // As banner3 scrolls up, menu scrolls up with it
        const banner3Center = banner3Rect.top + (banner3Rect.height / 2);
        const topPercent = (banner3Center / viewportHeight) * 100;
        setFixedTop(topPercent);
      }
      // Phase 2: Menu locked at center between banners
      else if (banner4Rect.top > viewportHeight * 0.5) {
        setPosition('static');
        setFixedTop(50);
      }
      // Phase 3: Banner4 scrolling up - menu moves UP with banner4
      // Menu appears to be "stuck" to banner4, moving at same speed
      else {
        setPosition('banner4');
        // Calculate menu position relative to banner4's center
        // As banner4 scrolls up, menu scrolls up with it
        const banner4Center = banner4Rect.top + (banner4Rect.height / 2);
        const topPercent = (banner4Center / viewportHeight) * 100;
        setFixedTop(topPercent);
      }
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [banner3Ref, banner4Ref]);

  return (
    <div
      ref={menuRef}
      className="parallax-menu"
      style={{
        top: `${fixedTop}vh`,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      data-position={position}
    >
      <div className="parallax-menu-content">
        <p className="parallax-menu-label">EXPLORE COLLECTIONS</p>
        <nav className="parallax-menu-nav">
          <Link to="/collections/season-01" className="parallax-menu-link">
            SEASON 01
          </Link>
          <Link to="/collections/season-02" className="parallax-menu-link">
            SEASON 02
          </Link>
        </nav>
        <Link to="/collections" className="parallax-menu-discover">
          <span>DISCOVER</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
