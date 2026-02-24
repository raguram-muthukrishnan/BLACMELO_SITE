import type { MetaFunction } from 'react-router';
import privateAccessStyles from '~/styles/pages/private-access.css?url';
import bannerImage from '~/assets/banner_images/2.jpeg';

export const links = () => [
    { rel: 'stylesheet', href: privateAccessStyles },
];

export const meta: MetaFunction = () => {
    return [
        { title: `BLACMELO | The Private Access` },
        {
            name: 'description',
            content: 'The Private Access — Coming Soon.',
        },
    ];
};

export default function PrivateAccess() {
    return (
        <div className="private-access-page">
            <section
                className="private-access-hero-banner"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bannerImage})` }}
            >
                <div className="private-access-hero-overlay">
                    <p className="private-access-hero-subtitle">THE PRIVATE ACCESS</p>
                    <h1 className="private-access-hero-title">COMING SOON</h1>
                </div>
            </section>
        </div>
    );
}
