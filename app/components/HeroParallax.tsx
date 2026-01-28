import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import banner1 from '~/assets/banner images/1.jpeg';
import banner2 from '~/assets/banner images/2.jpeg';
import banner3 from '~/assets/banner images/3.jpeg';
import banner4 from '~/assets/banner images/4.png';

gsap.registerPlugin(ScrollTrigger);

interface Collection {
  id: number;
  name: string;
  handle: string;
  image: string;
}

const collections: Collection[] = [
  {id: 1, name: "Fall Winter '25", handle: 'fall-winter-25', image: banner2},
  {id: 2, name: '247', handle: '247', image: banner3},
  {id: 3, name: 'Initial', handle: 'initial', image: banner4},
  {id: 4, name: 'Owners Club', handle: 'owners-club', image: banner2},
  {id: 5, name: 'Woman', handle: 'woman', image: banner1},
];

export function HeroParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCollection, setActiveCollection] = useState(0);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const container = containerRef.current;
    const viewportHeight = window.innerHeight;
    const totalHeight = viewportHeight * collections.length;

    // Set container height to accommodate all collections
    gsap.set(container, {
      height: totalHeight,
    });

    const triggers: ScrollTrigger[] = [];

    // Create scroll triggers for each collection
    collections.forEach((collection, index) => {
      const startScroll = index * viewportHeight;
      const endScroll = (index + 1) * viewportHeight;
      const itemElement = container.querySelector(
        `[data-collection-index="${index}"]`
      ) as HTMLElement;

      if (!itemElement) return;

      // Image parallax effect - images scroll slower creating parallax
      const imageElement = itemElement.querySelector(
        '.hero-parallax-image'
      ) as HTMLElement;
      
      if (imageElement) {
        // Parallax: image moves up slower than scroll
        const parallaxTrigger = gsap.to(imageElement, {
          y: -viewportHeight * 0.25, // 25% parallax effect
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: `${startScroll}px top`,
            end: `${endScroll}px top`,
            scrub: 1,
          },
        });
        if (parallaxTrigger.scrollTrigger) {
          triggers.push(parallaxTrigger.scrollTrigger);
        }
      }

      // Content fade in/out based on scroll position
      const contentElement = itemElement.querySelector(
        '.hero-parallax-content'
      ) as HTMLElement;

      if (contentElement) {
        // Fade in when entering viewport center (30% to 50% of section)
        const fadeInTrigger = gsap.fromTo(
          contentElement,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: `${startScroll + viewportHeight * 0.3}px top`,
              end: `${startScroll + viewportHeight * 0.5}px top`,
              scrub: 1,
            },
          }
        );
        if (fadeInTrigger.scrollTrigger) {
          triggers.push(fadeInTrigger.scrollTrigger);
        }

        // Fade out when leaving viewport center (50% to 70% of section)
        const fadeOutTrigger = gsap.to(contentElement, {
          opacity: 0,
          y: -40,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: container,
            start: `${startScroll + viewportHeight * 0.5}px top`,
            end: `${startScroll + viewportHeight * 0.7}px top`,
            scrub: 1,
          },
        });
        if (fadeOutTrigger.scrollTrigger) {
          triggers.push(fadeOutTrigger.scrollTrigger);
        }
      }

      // Set active collection when section is in viewport center
      const activeTrigger = ScrollTrigger.create({
        trigger: container,
        start: `${startScroll + viewportHeight * 0.35}px top`,
        end: `${endScroll - viewportHeight * 0.35}px top`,
        onEnter: () => setActiveCollection(index),
        onEnterBack: () => setActiveCollection(index),
      });
      triggers.push(activeTrigger);
    });

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      triggers.forEach((trigger) => {
        if (trigger && typeof trigger.kill === 'function') {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-parallax relative select-none grid grid-cols-1 [&>*]:col-start-1 [&>*]:col-end-2 [&>*]:row-start-1 [&>*]:row-end-2"
      data-active={`collection-${collections[activeCollection]?.handle || 'fall-winter-25'}`}
    >
      {collections.map((collection, index) => (
        <div
          key={collection.id}
          data-collection-index={index}
          className="hero-parallax-item relative w-full h-screen"
        >
          {/* Background Image */}
          <div className="hero-parallax-image-wrapper absolute inset-0 overflow-hidden">
            <img
              src={collection.image}
              alt={collection.name}
              className="hero-parallax-image w-full h-[120%] object-cover"
            />
          </div>

          {/* Content Overlay - Hidden by default, shown via GSAP */}
          <div className="hero-parallax-content absolute inset-0 flex flex-col items-center justify-center z-10 opacity-0">
            <div className="hero-parallax-text text-center">
              <h2 className="hero-parallax-title text-white text-5xl md:text-6xl font-bold tracking-tight">
                {collection.name}
              </h2>
            </div>
          </div>
        </div>
      ))}

      {/* Floating Menu - Always visible and centered */}
      <div className="hero-parallax-menu fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none">
        <h3 className="hero-parallax-menu-title text-white text-xs font-bold uppercase tracking-widest mb-4">
          EXPLORE COLLECTIONS
        </h3>
        <nav className="hero-parallax-menu-nav flex flex-col gap-0 mb-6">
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              className={`hero-parallax-menu-item text-white text-xl md:text-2xl font-semibold transition-all duration-300 pointer-events-auto leading-tight ${
                activeCollection === index
                  ? 'opacity-100'
                  : 'opacity-40 hover:opacity-70'
              }`}
            >
              {collection.name}
            </Link>
          ))}
        </nav>
        <Link
          to="/collections"
          className="hero-parallax-discover text-white text-xs font-normal uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity duration-300 pointer-events-auto inline-block"
        >
          → DISCOVER
        </Link>
      </div>
    </div>
  );
}
