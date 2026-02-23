/**
 * Lenis Scroll Utilities
 * Provides helpers for managing Lenis smooth scroll instance
 */

let lenisInstance: any = null;
let lenisRafId: number = 0;
let lenisOptions: any = null; // stored so we can recreate with same config

export function setLenisInstance(instance: any) {
  lenisInstance = instance;
}

export function setLenisRafId(id: number) {
  lenisRafId = id;
}

export function setLenisOptions(opts: any) {
  lenisOptions = opts;
}

export function getLenisInstance() {
  return lenisInstance;
}

/** Pause scroll animation — does NOT remove touch listeners */
export function stopLenis() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

/** Resume scroll animation */
export function startLenis() {
  if (lenisInstance) {
    lenisInstance.start();
  }
}

/**
 * Fully destroy the Lenis instance (removes all touch/wheel listeners).
 * Call this before opening any panel that needs its own touch scroll.
 */
export function destroyLenis() {
  if (lenisRafId) {
    window.cancelAnimationFrame(lenisRafId);
    lenisRafId = 0;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

/**
 * Recreate a fresh Lenis instance using the stored options.
 * Call this after closing the panel.
 */
export function recreateLenis() {
  if (lenisInstance || !lenisOptions) return; // already running or no options saved
  const { Lenis: LenisCtor, options } = lenisOptions;
  const lenis = new LenisCtor(options);
  lenisInstance = lenis;

  const raf = (time: number) => {
    lenis.raf(time);
    lenisRafId = window.requestAnimationFrame(raf);
  };
  lenisRafId = window.requestAnimationFrame(raf);
}

export function scrollToTop(immediate = true) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate });
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
  }
}

export function scrollTo(
  target: number | string,
  options?: { immediate?: boolean; offset?: number },
) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
  } else if (typeof window !== 'undefined' && typeof target === 'number') {
    window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
  }
}
