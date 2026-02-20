import {useState, useCallback, useEffect} from 'react';
import type {MetaFunction} from 'react-router';
import lookbooksStyles from '~/styles/pages/lookbooks.css?url';

import banner1 from '~/assets/banner images/1.jpeg';
import banner2 from '~/assets/banner images/2.jpeg';
import banner3 from '~/assets/banner images/3.jpeg';
import banner4 from '~/assets/banner images/4.png';
import menuMan from '~/assets/menu/menu_man.jpeg';
import menuWoman from '~/assets/menu/menu_woman.jpeg';

export const links = () => [{rel: 'stylesheet', href: lookbooksStyles}];

export const meta: MetaFunction = () => {
  return [
    {title: 'BLACMELO | Lookbooks'},
    {
      name: 'description',
      content: 'Browse the BLACMELO lookbook — editorial imagery from our collections.',
    },
  ];
};

interface LookbookImage {
  src: string;
  alt: string;
}

const IMAGES: LookbookImage[] = [
  {src: banner1, alt: 'BLACMELO Collection Editorial 1'},
  {src: banner2, alt: 'BLACMELO Collection Editorial 2'},
  {src: menuMan, alt: 'BLACMELO Menswear'},
  {src: banner3, alt: 'BLACMELO Collection Editorial 3'},
  {src: menuWoman, alt: 'BLACMELO Womenswear'},
  {src: banner4, alt: 'BLACMELO Collection Editorial 4'},
];

export default function Lookbooks() {
  const [activeImage, setActiveImage] = useState<LookbookImage | null>(null);

  const openLightbox = useCallback((image: LookbookImage) => {
    setActiveImage(image);
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveImage(null);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!activeImage) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [activeImage, closeLightbox]);

  return (
    <div className="lookbooks-page">
      {/* Header */}
      <div className="lookbooks-header">
        <p className="lookbooks-label">BLACMELO</p>
        <h1 className="lookbooks-title">LOOKBOOK</h1>
      </div>

      {/* Image Grid */}
      <div className="lookbooks-grid">
        {IMAGES.map((image, i) => (
          <button
            key={i}
            className="lookbooks-card"
            onClick={() => openLightbox(image)}
            type="button"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="lookbooks-card-image"
              loading={i < 4 ? 'eager' : 'lazy'}
            />
            <div className="lookbooks-card-overlay">
              <span className="lookbooks-card-view">VIEW</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {activeImage && (
        <div className="lookbooks-lightbox" onClick={closeLightbox}>
          <button
            className="lookbooks-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="lookbooks-lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
