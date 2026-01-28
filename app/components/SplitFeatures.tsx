
import { Image } from '@shopify/hydrogen';

interface Feature {
    title: string;
    description: string;
}

interface SplitFeaturesProps {
    features?: Feature[];
    image?: any;
}

export function SplitFeatures({ features, image }: SplitFeaturesProps) {
    // Default content if none provided
    const defaultFeatures = [
        { title: 'Courtside Layer', description: 'Inspired by classic basketball warm-up jackets.' },
        { title: 'Relaxed Structure', description: 'Easy fit designed for layering and movement.' },
        { title: 'Snap Front Closure', description: 'Functional detailing rooted in traditional coach silhouettes.' },
        { title: 'Statement Branding', description: 'Bold branding elements elevate the look.' },
    ];

    const displayFeatures = features || defaultFeatures;

    return (
        <section className="split-features">
            <div className="split-text">
                {displayFeatures.map((feature, index) => (
                    <div key={index} className="feature-item">
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-desc">{feature.description}</p>
                    </div>
                ))}
            </div>
            <div className="split-image">
                {image ? (
                    <Image data={image} sizes="(min-width: 1024px) 50vw, 100vw" />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                        FEATURE IMAGE
                    </div>
                )}
            </div>
        </section>
    );
}
