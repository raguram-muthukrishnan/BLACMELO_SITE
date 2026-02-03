import {useEffect, useRef, useState} from 'react';

interface EditorialVideoProps {
  video: string;
  poster?: string;
  alt?: string;
}

export function EditorialVideo({
  video,
  poster,
  alt = '',
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
      style={{height: '100vh', minHeight: '600px'}}
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
    </section>
  );
}
