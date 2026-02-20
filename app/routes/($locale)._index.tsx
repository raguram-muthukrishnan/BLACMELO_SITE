import type {Route} from './+types/_index';
import {useRef, useCallback} from 'react';
import {EditorialBanner} from '~/components/EditorialBanner';
import {EditorialVideo} from '~/components/EditorialVideo';
import {ParallaxMenu} from '~/components/ParallaxMenu';
import banner1 from '~/assets/banner images/1.jpeg';
import banner2 from '~/assets/banner images/2.jpeg';
import banner3 from '~/assets/banner images/3.jpeg';
import banner4 from '~/assets/banner images/4.png';
import video1 from '~/assets/banner images/vid 1.mp4';
import video2 from '~/assets/banner images/vid 2.mp4';
import homeStyles from '~/styles/pages/home.css?url';
import parallaxMenuStyles from '~/styles/components/parallax-menu.css?url';

export const links = () => [
  {rel: 'stylesheet', href: homeStyles},
  {rel: 'stylesheet', href: parallaxMenuStyles},
];

export const meta: Route.MetaFunction = () => {
  return [{title: 'BLACMELO | The Missing Piece of Luxury'}];
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
    image: banner3,
    alt: 'BLACMELO Style',
    linkLabel: 'SEASON 01',
    linkUrl: '/collections/season-01',
  },
  {
    type: 'video',
    video: video2,
    poster: banner4,
    alt: 'BLACMELO Premium',
    linkLabel: 'SEASON 02',
    linkUrl: '/collections/season-02',
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
    <div className="homepage">
      {/* Frame 1 - Image with Overlay and Buttons */}
      <EditorialBanner
        image={banner1}
        alt="BLACMELO Collection"
        showOverlay={true}
        overlayLabel="NOW LIVE"
        overlayTitle="MICRO OWNERS CLUB"
        primaryButtonText="SHOP NOW"
        primaryButtonLink="/collections/micro-owners-club"
        secondaryButtonText="VIEW STORY"
        secondaryButtonLink="/pages/micro-owners-club"
      />

      {/* Frame 2 - Video with Overlay */}
      <EditorialVideo
        video={video1}
        poster={banner2}
        alt="BLACMELO Luxury"
        showOverlay={true}
        overlayLabel="NOW LIVE"
        overlayTitle="247 COLLECTION"
        primaryButtonText="SHOP NOW"
        primaryButtonLink="/collections/247"
        secondaryButtonText="VIEW STORY"
        secondaryButtonLink="/pages/247"
      />

      {/* Collection Banners — driven by config array */}
      {COLLECTION_BANNERS.map((banner, i) =>
        banner.type === 'image' ? (
          <EditorialBanner
            key={banner.linkUrl}
            ref={setBannerRef(i)}
            image={banner.image!}
            alt={banner.alt}
            showOverlay={false}
          />
        ) : (
          <EditorialVideo
            key={banner.linkUrl}
            ref={setBannerRef(i)}
            video={banner.video!}
            poster={banner.poster}
            alt={banner.alt}
            showOverlay={false}
          />
        ),
      )}

      {/* Parallax Menu — auto-scales with COLLECTION_BANNERS */}
      <ParallaxMenu bannerRefs={bannerRefs} links={menuLinks} />
    </div>
  );
}
