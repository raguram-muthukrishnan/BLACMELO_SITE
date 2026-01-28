
import { Image } from '@shopify/hydrogen';

interface GalleryCarouselProps {
    images: any[];
}

export function GalleryCarousel({ images }: GalleryCarouselProps) {
    if (!images || images.length === 0) return null;

    return (
        <section className="gallery-module">
            <div className="gallery-scroll">
                {images.map((image, index) => (
                    <div key={image.id || index} className="gallery-item">
                        <Image
                            data={image}
                            sizes="(min-width: 768px) 40vw, 80vw"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
