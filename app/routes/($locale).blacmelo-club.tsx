import type { MetaFunction } from 'react-router';
import clubStyles from '~/styles/pages/blacmelo-club.css?url';
import bannerImage from '~/assets/banner images/2.jpeg';

export const links = () => [
    { rel: 'stylesheet', href: clubStyles },
];

export const meta: MetaFunction = () => {
    return [
        { title: `BLACMELO | The Blacmelo Club` },
        {
            name: 'description',
            content: 'The Blacmelo Club - Coming Soon.',
        },
    ];
};

export default function BlacmeloClub() {
    return (
        <div className="club-page">
            <section
                className="club-hero-banner"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bannerImage})` }}
            >
                <div className="club-hero-overlay">
                    <h1 className="club-hero-title">THE BLACMELO CLUB</h1>
                    <p className="club-hero-subtitle">COMING SOON</p>
                </div>
            </section>
        </div>
    );
}
