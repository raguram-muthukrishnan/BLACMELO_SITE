import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import banner1 from '~/assets/banner_images/1.jpeg';
import banner2 from '~/assets/banner_images/2.jpeg';
import banner3 from '~/assets/banner_images/3.jpeg';
import aboutContactStyles from '~/styles/pages/about-contact.css?url';

export const links = () => [
  { rel: 'stylesheet', href: aboutContactStyles },
];

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `BLACMELO | About Us` },
    {
      name: 'description',
      content: 'Learn more about BLACMELO - Our vision, mission, and values.',
    },
  ];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  return {};
}

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero-section" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${banner1})`
      }}>
        <div className="about-hero-overlay">
          <p className="about-hero-subtitle">WELCOME TO</p>
          <h1 className="about-hero-title">BLACMELO</h1>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="about-vision-section">
        <div className="about-vision-image">
          <img
            src={banner2}
            alt="BLACMELO Vision - Desert landscape"
          />
        </div>
        <div className="about-vision-content">
          <h2 className="about-section-title">OUR VISION</h2>
          <p className="about-section-text">
            Our vision is far more nuanced, more personal. It's about discovering
            that singular piece, that perfect harmony of style and substance, that
            feels inner you. It's about the quiet thrill of owning something truly
            exceptional. But from a yearning to redefine the landscape of luxury.
            We sought to create a brand that embodies a more, intuitive form of
            luxury, one that doesn't impose, but rather complements.
          </p>
        </div>
      </section>

      {/* Content Section with Image */}
      <section className="about-content-section">
        <div className="about-content-text">
          <p className="about-paragraph">
            Blacmelo isn't just a brand; it's a philosophy. It's a rejection of the
            ostentatious, a celebration of the understated. It's about pieces that
            whisper rather than shout, that reveal their depth gradually, rewarding
            closer inspection. The design ethos is built upon a foundation of clean
            lines and timeless silhouettes, yet it's far from austere. There's a
            deliberate tension, a subtle interplay of contrasts that keeps the eye
            engaged and the mind intrigued.
          </p>
          <p className="about-paragraph">
            The aesthetic isn't a fleeting trend, limited by traditional gender norms.
            It's a pure aesthetic decision, a celebration of artistry in its most
            expressive form. The florals inherent duality allows it to be simultaneously
            bold and understated, striking yet refined, a testament to its timeless and
            versatile nature. intertwined "B" and "M" emblem serves as a visual
            representation symbolises the harmonious convergence of seemingly disparate
            elements, the fusion of boldness and minimalism. It's a reminder that true
            elegance lies in the delicate balance of contrasts. It's a quiet rebellion
            against the predictable, a testament to the power of unexpected pairings.
            Visual statement of our belief that true luxury isn't defined by what has
            been, but by what has never been done before.
          </p>
          <p className="about-paragraph">
            Blacmelo isn't about blending into the background; it's about illuminating
            the space you occupy. We're here to fill a void, to provide that missing
            element in the landscape of luxury. We believe that true luxury isn't about
            rehashing the past; It's about forging the future. It's about what's yet to
            come. It's about pushing boundaries, challenging conventions, and daring to
            create some missed pieces. True luxury isn't about what has been, it's about
            what's never been done before. "Blacmelo is what's never been done before"
            Blacmelo ! "The MISSING PIECE OF LUXURY"!"
          </p>
        </div>
        <div className="about-content-image">
          <img
            src={banner3}
            alt="BLACMELO Collection"
          />
        </div>
      </section>
    </div>
  );
}
