
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { CurrencyCode } from '@shopify/hydrogen/storefront-api-types';

interface Product {
    id: string;
    title: string;
    handle: string;
    variants?: {
        nodes: Array<{
            id: string;
            price: {
                amount: string;
                currencyCode: CurrencyCode;
            };
            compareAtPrice?: {
                amount: string;
                currencyCode: CurrencyCode;
            };
            selectedOptions?: Array<{
                name: string;
                value: string;
            }>;
            availableForSale?: boolean;
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
    options?: Array<{
        name: string;
        optionValues: Array<{
            name: string;
        }>;
    }>;
}

interface ProductGridProps {
    title?: string;
    products: Product[];
    tabs?: string[];
}

export function ProductGrid({ title, products, tabs }: ProductGridProps) {
    const [activeTab, setActiveTab] = useState(tabs ? tabs[0] : null);
    const [quickAddProduct, setQuickAddProduct] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    
    const itemsPerPage = 8; // Even number that works for both desktop (4 cols) and mobile (2 cols)
    const totalPages = Math.ceil(products.length / itemsPerPage);
    
    // Calculate which products to display
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayProducts = products.slice(startIndex, endIndex);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-close timer
    useEffect(() => {
        if (quickAddProduct && !isHovered) {
            const timer = setTimeout(() => {
                setQuickAddProduct(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [quickAddProduct, isHovered]);

    const handleQuickAddClick = (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (isMobile) {
            // On mobile, toggle the overlay
            setQuickAddProduct(quickAddProduct === productId ? null : productId);
        } else {
            // On desktop, show on hover
            setQuickAddProduct(productId);
        }
        setIsHovered(true);
    };

    const handleQuickAddHover = (productId: string) => {
        if (!isMobile) {
            setQuickAddProduct(productId);
            setIsHovered(true);
        }
    };

    const handleQuickAddLeave = () => {
        setIsHovered(false);
    };

    const handleSizesHover = () => {
        setIsHovered(true);
    };

    const handleSizesLeave = () => {
        setIsHovered(false);
    };

    const handleAddToCart = (e: React.MouseEvent, variantId: string) => {
        e.preventDefault();
        e.stopPropagation();
        // Trigger cart sidebar open - this would integrate with your cart context
        const event = new CustomEvent('openCart', { detail: { variantId } });
        window.dispatchEvent(event);
        setQuickAddProduct(null);
        setIsHovered(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                    const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size');
                    const isQuickAddOpen = quickAddProduct === product.id;

                    return (
                        <div key={product.id} className="product-card">
                            <Link to={`/products/${product.handle}`} className="card-link">
                                <div className="card-image-wrapper">
                                    {image && (
                                        <Image
                                            data={image}
                                            sizes="(min-width: 1024px) 25vw, 50vw"
                                            className="card-image"
                                        />
                                    )}
                                    
                                    {/* Quick Add Button */}
                                    <button 
                                        className={`quick-add-btn ${isQuickAddOpen ? 'active' : ''}`}
                                        onMouseEnter={() => handleQuickAddHover(product.id)}
                                        onMouseLeave={handleQuickAddLeave}
                                        onClick={(e) => handleQuickAddClick(e, product.id)}
                                        aria-label="Quick add"
                                    >
                                        <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            className={`plus-icon ${isQuickAddOpen ? 'rotated' : ''}`}
                                        >
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>

                                    {/* Size Selector Overlay */}
                                    {isQuickAddOpen && sizeOption && (
                                        <div 
                                            className="quick-add-overlay" 
                                            onClick={(e) => e.preventDefault()}
                                            onMouseEnter={handleSizesHover}
                                            onMouseLeave={handleSizesLeave}
                                        >
                                            <div className="quick-add-sizes">
                                                {sizeOption.optionValues.map((size) => {
                                                    const variant = product.variants?.nodes.find(v => 
                                                        v.selectedOptions?.some(opt => 
                                                            opt.name.toLowerCase() === 'size' && opt.value === size.name
                                                        )
                                                    );
                                                    const available = variant?.availableForSale !== false;

                                                    return (
                                                        <button
                                                            key={size.name}
                                                            className={`size-option ${!available ? 'disabled' : ''}`}
                                                            onClick={(e) => available && variant && handleAddToCart(e, variant.id)}
                                                            disabled={!available}
                                                        >
                                                            {size.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="card-info">
                                    <h3 className="card-title">{product.title}</h3>
                                    <div className="card-price">
                                        {price && <Money data={price} />}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                    
                    <button 
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            )}
        </section>
    );
}
