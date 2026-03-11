import type { Route } from './+types/_index';
import { useRef, useCallback } from 'react';
import { Analytics } from '@shopify/hydrogen';
import { EditorialBanner } from '~/components/EditorialBanner';
import { ParallaxMenu } from '~/components/ParallaxMenu';
import bannerSS26 from '~/assets/final_banners/spring_summer.jpeg';
import bannerSignatureJacketDesktop from '~/assets/final_banners/the_signature_jacket_desktop.jpeg';
import bannerOriginals from '~/assets/final_banners/bl_originals.jpeg';
import bannerArchive from '~/assets/final_banners/bl_archive.jpeg';
import homeStyles from '~/styles/pages/home.css?url';
import parallaxMenuStyles from '~/styles/components/parallax-menu.css?url';

export const links = () => [
  { rel: 'stylesheet', href: homeStyles },
  { rel: 'stylesheet', href: parallaxMenuStyles },
];

export const meta: Route.MetaFunction = () => {
  return [{ title: "BLACMELO - The Missing Piece of Luxury" }];
};

/**
 * Collection banners config — each entry creates a full-screen banner
 * AND a corresponding link in the parallax menu.
 *
 * To add a new collection: append an entry here. The parallax menu
 * will automatically pick up the new link and the ending animation
 * will attach to whatever the last banner is.
 */
const COLLECTION_BANNERS: CollectionBannerConfig[] = [
  {
    type: 'image',
    image: bannerOriginals,
    alt: 'The Blacmelo Originals',
    linkLabel: 'BLACMELO ORIGINALS',
    linkUrl: '/collections/the-blacmelo-originals',
  },
  {
    type: 'image',
    image: bannerArchive,
    alt: 'The Blacmelo Archive',
    linkLabel: 'BLACMELO ARCHIVE',
    linkUrl: '/collections/the-blacmelo-archive',
  },
];

interface CollectionBannerConfig {
  type: 'image' | 'video';
  image?: string;
  video?: string;
  poster?: string;
  alt: string;
  linkLabel: string;
  linkUrl: string;
}

export default function Homepage() {
  const bannerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setBannerRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      bannerRefs.current[index] = el;
    },
    [],
  );

  const menuLinks = COLLECTION_BANNERS.map((b) => ({
    label: b.linkLabel,
    url: b.linkUrl,
  }));

  return (
    <div className="homepage-container">
      <div className="homepage">
        {/* Frame 1 - SS26 */}
        <EditorialBanner
          image={bannerSS26}
          alt="BLACMELO SS26"
          showOverlay={true}
          overlayLabel="NOW LIVE"
          overlayTitle="SPRING SUMMER '26"
          primaryButtonText="SHOP NOW"
          primaryButtonLink="/collections/spring-summer"
          className="hero-ss26"
        />

        {/* Frame 2 - Signature Jacket */}
        <EditorialBanner
          image={bannerSignatureJacketDesktop}
          alt="BLACMELO Signature Jacket"
          showOverlay={true}
          overlayLabel="NOW LIVE"
          overlayTitle="THE SIGNATURE JACKET"
          primaryButtonText="SHOP NOW"
          primaryButtonLink="/products/the-signature-jacket?Size=XS"
          className="hero-signature-jacket"
        />

        {/* Collection Banners — driven by config array */}
        {COLLECTION_BANNERS.map((banner, i) => (
          <EditorialBanner
            key={banner.linkUrl}
            ref={setBannerRef(i)}
            image={banner.image!}
            alt={banner.alt}
            showOverlay={false}
            className={banner.linkLabel.toLowerCase().includes('originals') ? 'hero-originals' : 'hero-archive'}
          />
        ))}

        {/* Parallax Menu — auto-scales with COLLECTION_BANNERS */}
        <ParallaxMenu bannerRefs={bannerRefs} links={menuLinks} />
      </div>
      <Analytics.PageView />
    </div>
  );
}
