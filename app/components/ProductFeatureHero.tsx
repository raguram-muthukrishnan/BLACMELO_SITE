import {Image} from '@shopify/hydrogen';

interface ProductFeatureHeroProps {
  image: any;
  title: string;
  product: any;
}

export function ProductFeatureHero({image, title, product}: ProductFeatureHeroProps) {
  if (!image) return null;

  // Helper to get metafield value
  const getMetafieldValue = (key: string, defaultText: string) => {
    const metafield = product.metafields?.find((m: any) => m?.key === key && m?.namespace === 'custom');
    return metafield?.value || defaultText;
  };

  // Get second description content - try metafield first, then product description, then fallback
  const secondDescription = getMetafieldValue(
    'second_description',
    product.description || 'Discover the perfect blend of style and comfort with this premium piece.'
  );

  // Format content with bullet points
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div style={{ lineHeight: '1.6' }}>
        {lines.map((line: string, idx: number) => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
            return <div key={idx} style={{ paddingLeft: '1rem', marginBottom: '0.5rem' }}>{trimmedLine}</div>;
          }
          return trimmedLine ? <div key={idx} style={{ marginBottom: '0.5rem' }}>{trimmedLine}</div> : <br key={idx} />;
        })}
      </div>
    );
  };

  return (
    <section className="product-feature-hero">
      <div className="product-feature-container">
        {/* Left: Product Details Content */}
        <div className="product-feature-content">
          <div className="product-feature-static-content">
            <h3 className="product-feature-static-title">Product Details</h3>
            <div className="product-feature-static-text">
              {formatContent(secondDescription)}
            </div>
          </div>
        </div>

        {/* Right: Product Image */}
        <div className="product-feature-image">
          <div className="product-feature-img-container">
            <Image
              data={image}
              alt={title}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="product-feature-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
