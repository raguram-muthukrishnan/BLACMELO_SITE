import type {MetaFunction} from 'react-router';
import prestigeStyles from '~/styles/pages/prestige.css?url';
import bannerImage from '~/assets/banner images/2.jpeg';

export const links = () => [
  {rel: 'stylesheet', href: prestigeStyles},
];

export const meta: MetaFunction = () => {
  return [
    {title: `BLACMELO | The Prestige`},
    {
      name: 'description',
      content: 'The Prestige — Coming Soon.',
    },
  ];
};

export default function Prestige() {
  return (
    <div className="prestige-page">
      <section
        className="prestige-hero-banner"
        style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bannerImage})`}}
      >
        <div className="prestige-hero-overlay">
          <p className="prestige-hero-subtitle">THE PRESTIGE</p>
          <h1 className="prestige-hero-title">COMING SOON</h1>
        </div>
      </section>
    </div>
  );
}
