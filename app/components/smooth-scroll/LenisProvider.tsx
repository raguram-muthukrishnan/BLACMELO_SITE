import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenisInstance, setLenisRafId, setLenisOptions } from '~/lib/lenis';

/**
 * Client-only smooth scrolling (Represent-style inertia).
 * Safe for SSR: does nothing until mounted.
 *
 * KEY: `prevent` callback tells Lenis to skip touch/wheel handling on any
 * element that lives inside `.overlay aside` — those panels control their
 * own scroll. Without this, `syncTouch: true` intercepts ALL touchmove
 * events globally, making inside-panel finger-scroll impossible.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const LENIS_OPTIONS = {
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
      syncTouch: true,
      // Skip Lenis touch handling for any element inside an aside overlay panel
      prevent: (node: Element) => {
        return !!node.closest?.('.overlay aside');
      },
    };

    const lenis = new Lenis(LENIS_OPTIONS);

    // Store constructor + options so destroyLenis/recreateLenis can rebuild
    setLenisOptions({ Lenis, options: LENIS_OPTIONS });
    setLenisInstance(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);
    setLenisRafId(rafId);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return <>{children}</>;
}
