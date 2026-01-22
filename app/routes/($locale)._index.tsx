import {Link} from 'react-router';
import {useEffect, useRef} from 'react';
import type {Route} from './+types/_index';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import banner1 from '~/assets/banner images/1.jpeg';
import banner2 from '~/assets/banner images/2.jpeg';
import banner3 from '~/assets/banner images/3.jpeg';
import banner4 from '~/assets/banner images/4.png';


gsap.registerPlugin(ScrollTrigger);

export const meta: Route.MetaFunction = () => {
  return [{title: 'BLACMELO | The Missing Piece of Luxury'}];
};

export default function Homepage() {
  const floatingMenuRef = useRef<HTMLElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!floatingMenuRef.current || !heroSectionRef.current) return;

    const menu = floatingMenuRef.current;
    const heroSection = heroSectionRef.current;

    // Use viewport height for banner calculations
    const bannerHeight = window.innerHeight;

    // Set initial position - menu starts hidden, will come with banner 2
    gsap.set(menu, {
      position: 'absolute',
      left: '50%',
      top: bannerHeight * 2, // Start at the top of banner 2
      xPercent: -50,
      yPercent: 0,
      opacity: 1,
    });

    // Phase 1: Menu enters WITH banner 2 from bottom (like banner movement)
    // Menu moves from bottom of banner 2 to center as banner 2 scrolls up
    gsap.fromTo(menu, 
      {
        position: 'absolute',
        top: bannerHeight * 2 + bannerHeight, // Start at bottom of banner 2
        yPercent: 0,
      },
      {
        position: 'fixed',
        top: '50%',
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: `${bannerHeight}px top`, // When banner 2 starts entering
          end: `${bannerHeight + bannerHeight * 0.4}px top`, // 40% into banner 2
          scrub: 1,
        },
      }
    );

    // Phase 2: Menu stays fixed in center while banners 2-4 scroll behind
    ScrollTrigger.create({
      trigger: heroSection,
      start: `${bannerHeight + bannerHeight * 0.4}px top`,
      end: `${bannerHeight * 4 + bannerHeight * 0.6}px top`, // Until 60% into banner 5
      onEnter: () => {
        gsap.set(menu, {
          position: 'fixed',
          top: '50%',
          yPercent: -50,
        });
      },
      onEnterBack: () => {
        gsap.set(menu, {
          position: 'fixed',
          top: '50%',
          yPercent: -50,
        });
      },
    });

    // Phase 3: Menu exits WITH banner 5 (goes down with the banner)
    gsap.to(menu, {
      position: 'absolute',
      top: bannerHeight * 5 + bannerHeight, // Bottom of banner 6
      yPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: `${bannerHeight * 4 + bannerHeight * 0.6}px top`, // 60% into banner 5
        end: `${bannerHeight * 5}px top`, // End of banner 5
        scrub: 1,
      },
    });

    // Text highlighting based on current banner
    const collections = menu.querySelectorAll('.floating-menu-item');
    
    // Banner 2 highlight
    ScrollTrigger.create({
      trigger: heroSection,
      start: `${bannerHeight}px top`,
      end: `${bannerHeight * 2}px top`,
      onEnter: () => highlightCollection(collections, 0), // Fall/Winter '25
      onEnterBack: () => highlightCollection(collections, 0),
    });

    // Banner 3 highlight
    ScrollTrigger.create({
      trigger: heroSection,
      start: `${bannerHeight * 2}px top`,
      end: `${bannerHeight * 3}px top`,
      onEnter: () => highlightCollection(collections, 1), // 247
      onEnterBack: () => highlightCollection(collections, 1),
    });

    // Banner 4 highlight
    ScrollTrigger.create({
      trigger: heroSection,
      start: `${bannerHeight * 3}px top`,
      end: `${bannerHeight * 4}px top`,
      onEnter: () => highlightCollection(collections, 2), // Initial
      onEnterBack: () => highlightCollection(collections, 2),
    });

    // Banner 5 highlight
    ScrollTrigger.create({
      trigger: heroSection,
      start: `${bannerHeight * 4}px top`,
      end: `${bannerHeight * 5}px top`,
      onEnter: () => highlightCollection(collections, 3), // Owners Club
      onEnterBack: () => highlightCollection(collections, 3),
    });

    // Banner 6 highlight
    ScrollTrigger.create({
      trigger: heroSection,
      start: `${bannerHeight * 5}px top`,
      end: `${bannerHeight * 6}px top`,
      onEnter: () => highlightCollection(collections, 4), // Woman
      onEnterBack: () => highlightCollection(collections, 4),
    });

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    };
  }, []);

  // Helper function to highlight active collection
  const highlightCollection = (collections: NodeListOf<Element>, activeIndex: number) => {
    collections.forEach((item, index) => {
      if (index === activeIndex) {
        gsap.to(item, {color: 'rgba(255, 255, 255, 1)', duration: 0.3});
      } else {
        gsap.to(item, {color: 'rgba(255, 255, 255, 0.4)', duration: 0.3});
      }
    });
  };

  return (
    <div className="homepage">
      <HeroBanner heroSectionRef={heroSectionRef} />
      <FloatingMenu floatingMenuRef={floatingMenuRef} />
    </div>
  );
}

function HeroBanner({
  heroSectionRef,
}: {
  heroSectionRef: React.RefObject<HTMLElement>;
}) {
  const banners = [
    {id: 1, src: banner1, alt: 'Banner 1'},
    {id: 2, src: banner2, alt: 'Banner 2'},
    {id: 3, src: banner3, alt: 'Banner 3'},
    {id: 4, src: banner4, alt: 'Banner 4'},
    {id: 5, src: banner2, alt: 'Banner 5'}, // Repeat banner 2
    {id: 6, src: banner1, alt: 'Banner 6'}, // Repeat banner 1
  ];

  return (
    <section className="hero-section" ref={heroSectionRef}>
      {/* First Banner with Hero Content */}
      <div className="hero-banner-wrapper">
        <img
          src={banners[0].src}
          alt={banners[0].alt}
          className="hero-banner-image"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <p className="hero-label">NOW LIVE</p>
            <h1 className="hero-title">REPRESENT X PUMA HOOPS</h1>
            <div className="hero-buttons">
              <Link to="/shop" className="hero-button">
                NEW ARRIVALS
              </Link>
              <Link to="/collections" className="hero-button">
                VIEW LOOKBOOK
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Banners */}
      {banners.slice(1).map((banner) => (
        <div key={banner.id} className="banner-wrapper">
          <img src={banner.src} alt={banner.alt} className="banner-image" />
        </div>
      ))}
    </section>
  );
}

function FloatingMenu({
  floatingMenuRef,
}: {
  floatingMenuRef: React.RefObject<HTMLElement>;
}) {
  const collections = [
    {id: 1, name: "Fall/Winter '25", handle: 'fall-winter-25'},
    {id: 2, name: '247', handle: '247'},
    {id: 3, name: 'Initial', handle: 'initial'},
    {id: 4, name: 'Owners Club', handle: 'owners-club'},
    {id: 5, name: 'Woman', handle: 'woman'},
  ];

  return (
    <section className="floating-menu" ref={floatingMenuRef}>
      <h2 className="floating-menu-title">EXPLORE COLLECTIONS</h2>
      <nav className="floating-menu-nav">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            className="floating-menu-item"
          >
            {collection.name}
          </Link>
        ))}
      </nav>
      <Link to="/collections" className="floating-menu-discover">
        → DISCOVER
      </Link>
    </section>
  );
}
