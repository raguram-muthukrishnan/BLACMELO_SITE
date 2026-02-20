/**
 * LottieHeaderLogo  –  scroll-driven animation for the header centre logo.
 *
 * Animation anatomy (Scene-1.json, 640×360, 60 fps):
 *   Frame 0–19   : banner image only (logo opacity = 0)   ← user was seeing THIS
 *   Frame 20–42  : banner + logo overlap
 *   Frame 43–82  : logo only, scaling 120 % → 100 %
 *   Frame 83–239 : FULLY STATIC – logo, 100 % scale, no banner
 *
 * The "static logo at the top" the user expects is frame 83.
 * We initialise there and scrub BACKWARDS as the page is scrolled:
 *
 *   scrollY = 0           → frame 83  (static logo, fully settled)
 *   scrollY = SCROLL_RANGE → frame 0  (entrance animation fully reversed)
 *   scroll back up        → exact reverse – logo re-enters
 *
 * This means scrolling down plays the entrance in reverse (logo departs),
 * scrolling back to top plays it forward (logo returns).  Visual result:
 * the logo is always visible at rest and animates responsively with scroll.
 *
 * SSR note: lottie-web touches DOM / SVG APIs immediately on creation.
 * The entire player is gated behind `isMounted` so it never runs on the
 * server.  An identical-sized placeholder keeps layout stable on hydration.
 */

import Lottie, {type LottieRefCurrentProps} from 'lottie-react';
import {useCallback, useEffect, useRef, useState} from 'react';

// JSON must be imported directly (not lazy) so lottie-web can access the
// embedded base64 image assets (the `"e":1` flag in the assets array).
import sceneData from '~/animations/Scene-1.json';

// ─── tuneable constants ────────────────────────────────────────────────────
/**
 * The first fully-static "logo only" frame.
 * Frames 83-239 are all identical: logo at 100 % scale, no banner.
 * This is the idle / zero-scroll state.
 */
const IDLE_FRAME = 83;

/**
 * How many pixels of downward scroll drive the animation from IDLE_FRAME
 * back to frame 0 (the very start of the entrance animation).
 * Smaller value = faster/snappier scrub.  200–300 px feels natural.
 */
const SCROLL_RANGE = 250;
// ──────────────────────────────────────────────────────────────────────────

/** Map scroll position → frame number. */
function scrollToFrame(scrollY: number): number {
  const progress = Math.min(1, scrollY / SCROLL_RANGE);
  // progress 0 → IDLE_FRAME,  progress 1 → frame 0  (reversed direction)
  return Math.round(IDLE_FRAME * (1 - progress));
}

export function LottieHeaderLogo() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const lastFrame  = useRef<number>(-1);

  // --- SSR guard -----------------------------------------------------------
  // lottie-web must only ever run in the browser.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // --- Visibility flag: keep the player invisible until the first correct
  //     frame is painted to avoid a flash of the banner (frame 0). ---------
  const [isReady, setIsReady] = useState(false);

  // --- Stable goToFrame helper --------------------------------------------
  const goToFrame = useCallback((frame: number) => {
    if (!lottieRef.current) return;
    if (frame === lastFrame.current) return;   // skip redundant calls
    lastFrame.current = frame;
    lottieRef.current.goToAndStop(frame, true);
  }, []);

  // --- Scroll listener: attached once isMounted is true -------------------
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      goToFrame(scrollToFrame(window.scrollY));
    };

    window.addEventListener('scroll', handleScroll, {passive: true});

    // Handle the case where the browser restores a non-zero scroll position
    // (e.g. back-navigation).  The onDOMLoaded callback below handles the
    // initial paint; this just keeps things in sync on rapid back-navigations.
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted, goToFrame]);

  // --- SSR placeholder (invisible, same size as the wrapper) ---------------
  if (!isMounted) {
    return (
      <span
        className="blacmelo-lottie-logo-ssr-placeholder"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="blacmelo-lottie-logo-wrapper"
      /*
       * Hide via opacity (not display:none) so we don't re-trigger a layout
       * when we reveal.  The placeholder already reserved the space.
       */
      style={{opacity: isReady ? 1 : 0, transition: 'opacity 0.1s'}}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={sceneData}
        loop={false}
        autoplay={false}
        renderer="svg"
        style={{width: '100%', height: '100%'}}
        /*
         * onDOMLoaded fires once the SVG tree is ready but before the first
         * frame is painted.  Jump to the correct idle frame HERE so the very
         * first visible pixel is the static logo, never the banner.
         */
        onDOMLoaded={() => {
          goToFrame(scrollToFrame(window.scrollY));
          setIsReady(true);
        }}
      />
    </div>
  );
}
