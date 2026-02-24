import { useEffect, useRef, useState, forwardRef } from 'react';
import { Link } from 'react-router';

interface EditorialBannerProps {
  image: string;
  mobileImage?: string;
  alt?: string;
  showOverlay?: boolean;
  overlayLabel?: string;
  overlayTitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
}

export const EditorialBanner = forwardRef<HTMLDivElement, EditorialBannerProps>(function EditorialBanner({
  image,
  mobileImage,
  alt = '',
  showOverlay = false,
  overlayLabel = 'NOW LIVE',
  overlayTitle = 'COLLECTION',
  primaryButtonText = 'SHOP NOW',
  primaryButtonLink = '#',
  secondaryButtonText,
  secondaryButtonLink,
  className = '',
}, ref) {
  return (
    <section
      ref={ref}
      className={`editorial-banner ${className}`}
    >
      <div className="editorial-banner-media">
        {/* Image Only */}
        <picture className="editorial-banner-picture">
          <source
            media="(min-width: 1920px)"
            srcSet={`${image} 1x, ${image} 2x`}
          />
          <source
            media="(min-width: 1440px)"
            srcSet={`${image} 1x, ${image} 2x`}
          />
          <source
            media="(min-width: 1024px)"
            srcSet={`${image} 1x, ${image} 2x`}
          />
          <source
            media="(min-width: 768px)"
            srcSet={`${image} 1x, ${image} 2x`}
          />
          {/* Mobile: use mobileImage if provided, otherwise fallback to desktop image */}
          <img
            src={mobileImage || image}
            alt={alt}
            loading="lazy"
            className="editorial-banner-image"
          />
        </picture>
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
