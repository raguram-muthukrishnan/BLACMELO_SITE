import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import banner1 from '~/assets/banner_images/1.jpeg';
import banner2 from '~/assets/banner_images/2.jpeg';
import banner3 from '~/assets/banner_images/3.jpeg';
import banner4 from '~/assets/banner_images/4.jpeg';

gsap.registerPlugin(ScrollTrigger);

interface Collection {
  id: number;
  name: string;
  handle: string;
  image: string;
}

const collections: Collection[] = [
  { id: 1, name: "Fall Winter '25", handle: 'fall-winter-25', image: banner2 },
  { id: 2, name: '247', handle: '247', image: banner3 },
  { id: 3, name: 'Initial', handle: 'initial', image: banner4 },
  { id: 4, name: 'Owners Club', handle: 'owners-club', image: banner2 },
  { id: 5, name: 'Woman', handle: 'woman', image: banner1 },
];

export function HeroParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.hero-parallax-item');

      items.forEach((item: any, i: number) => {
        const img = item.querySelector('.hero-parallax-image');
        const content = item.querySelector('.hero-parallax-content');

        // 1. Image Parallax with hardware acceleration - "pinned" illusion
        gsap.to(img, {
          y: '-15%', // Move image up slightly to counteract scroll for "fixed" feel
          ease: 'none',
          force3D: true, // Hardware acceleration for WebKit browsers
          scrollTrigger: {
            trigger: item,
            start: 'top bottom', // Start when section enters from bottom
            end: 'bottom top',   // End when it leaves through the top
            scrub: true,
          },
        });

        // 2. Content Sequence (In and Out in one timeline) - fixes double scrub issue
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            onEnter: () => setActiveIndex(i),
            onEnterBack: () => setActiveIndex(i),
          }
        });

        tl.fromTo(content,
          { opacity: 0, y: 50, force3D: true },
          { opacity: 1, y: 0, duration: 1, force3D: true }
        ).to(content,
          { opacity: 0, y: -50, duration: 1, force3D: true },
          "+=0.5"
        );
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup prevents memory leaks
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Floating Menu */}
      <nav className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center pointer-events-none">
        <p className="text-[10px] tracking-[0.2em] text-white mb-4 opacity-60">
          EXPLORE COLLECTIONS
        </p>
        <div className="flex flex-col gap-2">
          {collections.map((col, i) => (
            <Link
              key={col.id}
              to={`/collections/${col.handle}`}
              className={`text-2xl font-bold uppercase transition-all duration-500 pointer-events-auto cursor-pointer ${activeIndex === i ? 'text-white scale-110' : 'text-white/30'
                }`}
            >
              {col.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Sections */}
      {collections.map((collection, index) => (
        <section
          key={collection.id}
          className="hero-parallax-item relative h-screen w-full overflow-hidden m-0"
        >
          <div className="absolute inset-0 h-full w-full">
            <img
              src={collection.image}
              className="hero-parallax-image absolute top-0 left-0 w-full h-[120vh] object-cover object-center max-w-none"
              style={{
                willChange: 'transform'
              }}
              alt={collection.name}
            />
          </div>
          <div className="hero-parallax-content relative z-10 flex h-full items-center justify-center pointer-events-none">
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter">
              {collection.name}
            </h2>
          </div>
        </section>
      ))}
    </div>
  );
}
