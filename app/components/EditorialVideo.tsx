import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';

interface EditorialVideoProps {
  video: string;
  poster?: string;
  alt?: string;
  showOverlay?: boolean;
  overlayLabel?: string;
  overlayTitle?: string;
  overlaySubtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export function EditorialVideo({
  video,
  poster,
  alt = '',
  showOverlay = false,
  overlayLabel = 'NOW LIVE',
  overlayTitle = 'COLLECTION',
  overlaySubtitle = 'ON A MISSION',
  primaryButtonText = 'SHOP NOW',
  primaryButtonLink = '#',
  secondaryButtonText = 'DISCOVER STORY',
  secondaryButtonLink = '#',
}: EditorialVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (!video || !videoRef.current || !sectionRef.current) return;

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
      {threshold: [0.5]}
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [video, isVideoLoaded]);

  return (
    <section
      ref={sectionRef}
      className="editorial-banner"
      style={{height: '100vh', minHeight: '600px', position: 'relative'}}
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
            <p className="banner-overlay-subtitle">{overlaySubtitle}</p>
            <div className="banner-overlay-buttons">
              <Link to={primaryButtonLink} className="banner-overlay-btn">
                {primaryButtonText}
              </Link>
              <Link to={secondaryButtonLink} className="banner-overlay-btn">
                {secondaryButtonText}
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
