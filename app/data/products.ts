// Mock product data for development
export const mockProducts = [
  {
    id: 'gid://shopify/Product/1',
    title: 'Classic T-Shirt',
    handle: 'classic-t-shirt',
    description: 'A comfortable and stylish classic t-shirt',
    featuredImage: {
      id: 'gid://shopify/ProductImage/1',
      url: 'https://cdn.shopify.com/s/files/1/0000/0000/products/tshirt.jpg',
      altText: 'Classic T-Shirt',
      width: 800,
      height: 800,
    },
    priceRange: {
      minVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD',
      },
    },
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Denim Jeans',
    handle: 'denim-jeans',
    description: 'Premium quality denim jeans',
    featuredImage: {
      id: 'gid://shopify/ProductImage/2',
      url: 'https://cdn.shopify.com/s/files/1/0000/0000/products/jeans.jpg',
      altText: 'Denim Jeans',
      width: 800,
      height: 800,
    },
    priceRange: {
      minVariantPrice: {
        amount: '79.99',
        currencyCode: 'USD',
      },
    },
  },
  {
    id: 'gid://shopify/Product/3',
    title: 'Sneakers',
    handle: 'sneakers',
    description: 'Comfortable everyday sneakers',
    featuredImage: {
      id: 'gid://shopify/ProductImage/3',
      url: 'https://cdn.shopify.com/s/files/1/0000/0000/products/sneakers.jpg',
      altText: 'Sneakers',
      width: 800,
      height: 800,
    },
    priceRange: {
      minVariantPrice: {
        amount: '89.99',
        currencyCode: 'USD',
      },
    },
  },
];
