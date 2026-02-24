import type { MetaFunction } from 'react-router';
import chamberStyles from '~/styles/pages/chamber.css?url';
import bannerImage from '~/assets/banner_images/3.jpeg';

export const links = () => [
    { rel: 'stylesheet', href: chamberStyles },
];

export const meta: MetaFunction = () => {
    return [
        { title: `BLACMELO | The Chamber` },
        {
            name: 'description',
            content: 'The Chamber is closed.',
        },
    ];
};

export default function Chamber() {
    return (
        <div className="chamber-page">
            <section
                className="chamber-hero-banner"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bannerImage})` }}
            >
                <div className="chamber-hero-overlay">
                    <h1 className="chamber-hero-title">THE CHAMBER IS CLOSED</h1>
                </div>
            </section>
        </div>
    );
}
