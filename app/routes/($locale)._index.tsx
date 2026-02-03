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
      {/* Frame 1 - Image Only */}
      <EditorialBanner
        image={banner1}
        alt="BLACMELO Collection"
      />

      {/* Frame 2 - Video Only */}
      <EditorialVideo
        video={video1}
        poster={banner2}
        alt="BLACMELO Luxury"
      />

      {/* Frame 3 - Image Only */}
      <EditorialBanner
        image={banner3}
        alt="BLACMELO Style"
      />

      {/* Frame 4 - Video Only */}
      <EditorialVideo
        video={video2}
        poster={banner4}
        alt="BLACMELO Premium"
      />
    </div>
  );
}
