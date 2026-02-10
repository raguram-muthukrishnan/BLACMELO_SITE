import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';

interface EditorialBannerProps {
  image: string;
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

export function EditorialBanner({
  image,
  alt = '',
  showOverlay = false,
  overlayLabel = 'NOW LIVE',
  overlayTitle = 'COLLECTION',
  overlaySubtitle = 'ON A MISSION',
  primaryButtonText = 'SHOP NOW',
  primaryButtonLink = '#',
  secondaryButtonText = 'DISCOVER STORY',
  secondaryButtonLink = '#',
}: EditorialBannerProps) {
  return (
    <section
      className="editorial-banner"
      style={{height: '100vh', minHeight: '600px', position: 'relative'}}
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
          <img
            src={image}
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
