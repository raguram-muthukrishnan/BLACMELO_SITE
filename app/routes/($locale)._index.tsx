import type {Route} from './+types/_index';
import {EditorialBanner} from '~/components/EditorialBanner';
import {EditorialVideo} from '~/components/EditorialVideo';
import banner1 from '~/assets/banner images/1.jpeg';
import banner2 from '~/assets/banner images/2.jpeg';
import banner3 from '~/assets/banner images/3.jpeg';
import banner4 from '~/assets/banner images/4.png';
import video1 from '~/assets/banner images/vid 1.mp4';
import video2 from '~/assets/banner images/vid 2.mp4';

export const meta: Route.MetaFunction = () => {
  return [{title: 'BLACMELO | The Missing Piece of Luxury'}];
};

export default function Homepage() {
  return (
    <div className="homepage">

      {/* Frame 1 - Image with Overlay and Buttons */}
      <EditorialBanner
        image={banner1}
        alt="BLACMELO Collection"
        showOverlay={true}
        overlayLabel="NOW LIVE"
        overlayTitle="ARC-4 & ULTRA COLLECTION"
        overlaySubtitle="ON A MISSION"
        primaryButtonText="SHOP NOW"
        primaryButtonLink="/collections/new-in"
        secondaryButtonText="DISCOVER STORY"
        secondaryButtonLink="/about"
      />

      {/* Frame 2 - Video with Overlay */}
      <EditorialVideo
        video={video1}
        poster={banner2}
        alt="BLACMELO Luxury"
        showOverlay={true}
        overlayLabel="COLLECTION 2"
        overlayTitle="BESTSELLER COLLECTION"
        overlaySubtitle="EXPLORE OUR FAVORITES"
        primaryButtonText="SHOP NOW"
        primaryButtonLink="/collections/bestseller"
        secondaryButtonText="VIEW ALL"
        secondaryButtonLink="/collections/all"
      />

      {/* Frame 3 - Image with Overlay */}
      <EditorialBanner
        image={banner3}
        alt="BLACMELO Style"
        showOverlay={true}
        overlayLabel="COLLECTION 3"
        overlayTitle="247 COLLECTION"
        overlaySubtitle="EVERYDAY ESSENTIALS"
        primaryButtonText="SHOP NOW"
        primaryButtonLink="/collections/247"
        secondaryButtonText="LEARN MORE"
        secondaryButtonLink="/about"
      />

      {/* Frame 4 - Video with Overlay */}
      <EditorialVideo
        video={video2}
        poster={banner4}
        alt="BLACMELO Premium"
        showOverlay={true}
        overlayLabel="COLLECTION 4"
        overlayTitle="PREMIUM COLLECTION"
        overlaySubtitle="LUXURY REDEFINED"
        primaryButtonText="SHOP NOW"
        primaryButtonLink="/collections/all"
        secondaryButtonText="EXPLORE"
        secondaryButtonLink="/collections/all"
      />
    </div>
  );
}
