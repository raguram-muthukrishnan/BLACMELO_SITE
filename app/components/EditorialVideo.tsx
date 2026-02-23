import { useEffect, useRef, useState, forwardRef, useCallback } from 'react';
import { Link } from 'react-router';

interface EditorialVideoProps {
  video: string;
  poster?: string;
  alt?: string;
  showOverlay?: boolean;
  overlayLabel?: string;
  overlayTitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export const EditorialVideo = forwardRef<HTMLDivElement, EditorialVideoProps>(function EditorialVideo({
  video,
  poster,
  alt = '',
  showOverlay = false,
  overlayLabel = 'NOW LIVE',
  overlayTitle = 'COLLECTION',
  primaryButtonText = 'SHOP NOW',
  primaryButtonLink = '#',
  secondaryButtonText,
  secondaryButtonLink,
}, forwardedRef) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const internalRef = useRef<HTMLDivElement | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Merge refs
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [forwardedRef]
  );

  useEffect(() => {
    if (!video || !videoRef.current || !internalRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Start loading and playing video when 50% visible
            if (videoRef.current && !isVideoLoaded) {
              videoRef.current.load();
              videoRef.current.play().catch(() => {
                // Autoplay failed, user interaction required
              });
              setIsVideoLoaded(true);
            }
          }
        });
      },
      { threshold: [0.5] }
    );

    observer.observe(internalRef.current);

    return () => {
      observer.disconnect();
    };
  }, [video, isVideoLoaded]);

  return (
    <section
      ref={setRefs}
      className="editorial-banner"
      style={{ height: '100vh', minHeight: '600px', position: 'relative' }}
    >
      <div className="editorial-banner-media">
        {/* Video Only */}
        <video
          ref={videoRef}
          className="editorial-banner-video"
          loop
          muted
          playsInline
          preload="none"
          poster={poster}
        >
          <source src={video} type="video/mp4" />
        </video>
      </div>

      {/* Banner Overlay (optional) */}
      {showOverlay && (
        <div className="banner-overlay">
          <div className="banner-overlay-content">
            <p className="banner-overlay-label">{overlayLabel}</p>
            <h1 className="banner-overlay-title">{overlayTitle}</h1>
            <div className="banner-overlay-buttons">
              <Link to={primaryButtonLink} className="banner-overlay-btn">
                {primaryButtonText}
              </Link>
              {secondaryButtonText && secondaryButtonLink && (
                <Link to={secondaryButtonLink} className="banner-overlay-btn">
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
});
