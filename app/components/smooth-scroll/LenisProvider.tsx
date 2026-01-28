import {useEffect} from 'react';
import Lenis from 'lenis';

/**
 * Client-only smooth scrolling (Represent-style inertia).
 * Safe for SSR: does nothing until mounted.
 */
export function LenisProvider({children}: {children: React.ReactNode}) {
  useEffect(() => {
    const lenis = new Lenis({
      // Tuned for a “premium” feel; adjust as needed.
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
      syncTouch: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

