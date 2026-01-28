
import { useState } from 'react';
import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { CurrencyCode } from '@shopify/hydrogen/storefront-api-types';

interface Product {
    id: string;
    title: string;
    handle: string;
    variants?: {
        nodes: Array<{
            price: {
                amount: string;
                currencyCode: CurrencyCode;
            };
            compareAtPrice?: {
                amount: string;
                currencyCode: CurrencyCode;
            };
        }>;
    };
    priceRange?: {
        minVariantPrice: {
            amount: string;
            currencyCode: CurrencyCode;
        };
    };
    featuredImage?: any;
    images?: {
        nodes: any[];
    };
}

interface ProductGridProps {
    title?: string;
    products: Product[];
    tabs?: string[];
}

export function ProductGrid({ title, products, tabs }: ProductGridProps) {
    const [activeTab, setActiveTab] = useState(tabs ? tabs[0] : null);

    // In a real implementation, tabs would filter products or fetch different collections
    // For now, we simulate by showing all or random slice.
    const displayProducts = products.slice(0, 4);

    return (
        <section className="section-styled">
            {title && <h2 className="section-title">{title}</h2>}

            {tabs && (
                <div className="tabs-header">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            )}

            <div className="product-grid">
                {displayProducts.map((product) => {
                    const price = product.variants?.nodes[0]?.price || product.priceRange?.minVariantPrice;
                    const image = product.featuredImage || product.images?.nodes[0];

                    return (
                        <Link key={product.id} to={`/products/${product.handle}`} className="product-card">
                            <div className="card-image-wrapper">
                                {image && (
                                    <Image
                                        data={image}
                                        sizes="(min-width: 1024px) 25vw, 50vw"
                                        className="card-image"
                                    />
                                )}
                            </div>
                            <div className="card-info">
                                <h3 className="card-title">{product.title}</h3>
                                <div className="card-price">
                                    {price && <Money data={price} />}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {products.length > 4 && (
                <button className="load-more-btn">LOAD MORE</button>
            )}
        </section>
    );
}
