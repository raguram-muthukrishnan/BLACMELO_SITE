import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';

type ProductCardProps = {
  product: Pick<Product, 'id' | 'title' | 'handle' | 'featuredImage'> & {
    priceRange: {
      minVariantPrice: MoneyV2;
    };
  };
};

export function ProductCard({product}: ProductCardProps) {
  const {title, handle, featuredImage, priceRange} = product;

  return (
    <Link
      to={`/products/${handle}`}
      prefetch="intent"
      className="product-card"
    >
      {featuredImage && (
        <div className="product-card-image">
          <Image
            data={featuredImage}
            aspectRatio="1/1"
            sizes="(min-width: 768px) 33vw, 50vw"
          />
        </div>
      )}
      <div className="product-card-content">
        <h3 className="product-card-title">{title}</h3>
        <div className="product-card-price">
          <Money data={priceRange.minVariantPrice} />
        </div>
      </div>
    </Link>
  );
}
