/**
 * Lenis Scroll Utilities
 * Provides helpers for managing Lenis smooth scroll instance
 */

let lenisInstance: any = null;

export function setLenisInstance(instance: any) {
  lenisInstance = instance;
}

export function getLenisInstance() {
  return lenisInstance;
}

export function stopLenis() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

export function startLenis() {
  if (lenisInstance) {
    lenisInstance.start();
  }
}

export function scrollToTop(immediate = true) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, {immediate});
  } else if (typeof window !== 'undefined') {
    window.scrollTo({top: 0, behavior: immediate ? 'auto' : 'smooth'});
  }
}

export function scrollTo(
  target: number | string,
  options?: {immediate?: boolean; offset?: number},
) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
  } else if (typeof window !== 'undefined' && typeof target === 'number') {
    window.scrollTo({top: target, behavior: options?.immediate ? 'auto' : 'smooth'});
  }
}
