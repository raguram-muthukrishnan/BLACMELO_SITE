import { useEffect, useRef } from 'react';
import { Link } from 'react-router';

interface BannerLink {
  label: string;
  url: string;
}

interface ParallaxMenuProps {
  bannerRefs: React.RefObject<(HTMLDivElement | null)[]>;
  links: BannerLink[];
}

export function ParallaxMenu({ bannerRefs, links }: ParallaxMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const updatePosition = () => {
      const refs = bannerRefs.current;
      if (!refs || !menuRef.current) return;

      const vh = window.innerHeight;
      const n = refs.length;

      // Calculate each banner's center as % of viewport height
      const centers: number[] = [];
      for (let i = 0; i < n; i++) {
        const el = refs[i];
        if (!el) {
          centers.push(200); // off-screen default
          continue;
        }
        const rect = el.getBoundingClientRect();
        centers.push(((rect.top + rect.height / 2) / vh) * 100);
      }

      // ── Position logic ──
      let topVh: number;

      if (centers[0] > 50) {
        // First banner entering from bottom — menu tracks its center
        topVh = centers[0];
      } else if (centers[n - 1] < 50) {
        // Last banner scrolling up — menu tracks its center
        topVh = centers[n - 1];
      } else {
        // Between banners — locked at viewport center
        topVh = 50;
      }

      menuRef.current.style.top = `${topVh}vh`;

      // ── Per-link opacity logic ──
      const linkEls = menuRef.current.querySelectorAll<HTMLElement>(
        '.parallax-menu-link',
      );
      if (linkEls.length === 0) return;

      if (centers[0] > 50) {
        // Tracking first banner — first link active
        linkEls.forEach((el, i) => {
          el.style.opacity = i === 0 ? '1' : '0.3';
        });
      } else if (centers[n - 1] < 50) {
        // Tracking last banner — last link active
        linkEls.forEach((el, i) => {
          el.style.opacity = i === n - 1 ? '1' : '0.3';
        });
      } else {
        // Static phase — find which pair of banners we're between
        // and gradually transition the highlight
        let pairIndex = 0;
        for (let i = 0; i < n - 1; i++) {
          if (centers[i] <= 50 && centers[i + 1] > 50) {
            pairIndex = i;
            break;
          }
        }

        // Distance of each banner in the pair from viewport center
        const distPrev = 50 - centers[pairIndex]; // positive (above center)
        const distNext = centers[pairIndex + 1] - 50; // positive (below center)
        // progress: 0 = just left prev banner, 1 = about to reach next banner
        const progress = distPrev / (distPrev + distNext);

        linkEls.forEach((el, i) => {
          let opacity = 0.3;
          if (i === pairIndex) {
            // Active link fading out: 1.0 → 0.3
            opacity = 1 - progress * 0.7;
          } else if (i === pairIndex + 1) {
            // Next link fading in: 0.3 → 1.0
            opacity = 0.3 + progress * 0.7;
          }
          el.style.opacity = String(opacity);
        });
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updatePosition);
    updatePosition(); // Initial positioning

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePosition);
      cancelAnimationFrame(rafId);
    };
  }, [bannerRefs, links.length]);

  return (
    <div ref={menuRef} className="parallax-menu">
      <div className="parallax-menu-content">
        <p className="parallax-menu-label">EXPLORE COLLECTIONS</p>
        <nav className="parallax-menu-nav">
          {links.map((link) => (
            <Link
              key={link.url}
              to={link.url}
              className="parallax-menu-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link to="/collections/new-arrival" className="parallax-menu-discover">
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
