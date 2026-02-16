import type {Route} from './+types/_index';
import {useRef} from 'react';
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

export default function Homepage() {
  const banner3Ref = useRef<HTMLDivElement>(null);
  const banner4Ref = useRef<HTMLDivElement>(null);

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

      {/* Frame 3 - Image without Overlay (with Parallax Menu) */}
      <EditorialBanner
        ref={banner3Ref}
        image={banner3}
        alt="BLACMELO Style"
        showOverlay={false}
      />

      {/* Frame 4 - Video without Overlay */}
      <EditorialVideo
        ref={banner4Ref}
        video={video2}
        poster={banner4}
        alt="BLACMELO Premium"
        showOverlay={false}
      />

      {/* Parallax Menu */}
      <ParallaxMenu banner3Ref={banner3Ref} banner4Ref={banner4Ref} />
    </div>
  );
}
