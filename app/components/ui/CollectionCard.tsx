import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

type CollectionCardProps = {
  collection: Pick<Collection, 'id' | 'title' | 'handle' | 'image'>;
};

export function CollectionCard({collection}: CollectionCardProps) {
  const {title, handle, image} = collection;

  return (
    <Link
      to={`/collections/${handle}`}
      prefetch="intent"
      className="collection-card"
    >
      {image && (
        <div className="collection-card-image">
          <Image
            data={image}
            aspectRatio="16/9"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      )}
      <div className="collection-card-content">
        <h3 className="collection-card-title">{title}</h3>
      </div>
    </Link>
  );
}
