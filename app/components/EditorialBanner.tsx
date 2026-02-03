import {useEffect, useRef, useState} from 'react';

interface EditorialBannerProps {
  image: string;
  alt?: string;
}

export function EditorialBanner({
  image,
  alt = '',
}: EditorialBannerProps) {
  return (
    <section
      className="editorial-banner"
      style={{height: '100vh', minHeight: '600px'}}
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
    </section>
  );
}
