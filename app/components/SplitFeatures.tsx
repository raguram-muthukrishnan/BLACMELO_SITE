
import { Image } from '@shopify/hydrogen';

interface Feature {
    title: string;
    description: string;
}

interface SplitFeaturesProps {
    features?: Feature[];
    image?: any;
    secondDescription?: string;
}

export function SplitFeatures({ features, image, secondDescription }: SplitFeaturesProps) {
    // Default placeholder text if no second description is provided
    const defaultText = "Experience premium quality and timeless design. Each piece is crafted with attention to detail, combining comfort with contemporary style for the modern wardrobe.";
    
    // Use secondDescription if available, otherwise use default
    const displayText = secondDescription || defaultText;

    // Always use center format for text display
    return (
        <section className="split-features-center">
            <div className="split-features-center-content">
                <div 
                    className="split-features-center-text"
                    dangerouslySetInnerHTML={{ __html: displayText }}
                />
            </div>
        </section>
    );
}
