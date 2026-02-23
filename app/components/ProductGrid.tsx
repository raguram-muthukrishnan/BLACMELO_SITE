
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { Plus } from 'lucide-react';
import { AddToCartButton } from '~/components/AddToCartButton';
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
    horizontalScroll?: boolean;
    showViewMore?: boolean;
}

export function ProductGrid({ title, products, tabs, horizontalScroll = false, showViewMore = false }: ProductGridProps) {
    const [activeTab, setActiveTab] = useState(tabs ? tabs[0] : null);
    const [quickAddProduct, setQuickAddProduct] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsToShow, setItemsToShow] = useState(8);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    // Calculate which products to display
    const displayProducts = horizontalScroll
        ? products.slice(0, itemsToShow)
        : products.slice((currentPage - 1) * 8, currentPage * 8);

    const hasMore = products.length > itemsToShow;

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

    const handleViewMore = () => {
        setItemsToShow(prev => prev + 4);
    };

    const totalPages = Math.ceil(products.length / 8);

    return (
        <section className={`section-styled ${horizontalScroll ? 'horizontal-mode' : ''}`}>
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

            <div className={`product-grid ${horizontalScroll ? 'horizontal-scroll' : ''}`}>
                {displayProducts.map((product) => {
                    const price = product.variants?.nodes[0]?.price || product.priceRange?.minVariantPrice;
                    const image = product.featuredImage || product.images?.nodes[0];
                    const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size');
                    const isQuickAddOpen = quickAddProduct === product.id;

                    return (
                        <div key={product.id} className="product-card">
                            <div onClick={() => navigate(`/products/${product.handle}`)} className="card-link cursor-pointer">
                                <div className="card-image-wrapper group relative overflow-hidden">
                                    {image && (
                                        <Image
                                            data={image}
                                            sizes="(min-width: 1024px) 25vw, 50vw"
                                            className="card-image"
                                        />
                                    )}

                                    {/* Quick Add Reveal Button (Mobile Only) */}
                                    <button
                                        className={`md:hidden absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center border border-black/10 bg-white/90 backdrop-blur-sm text-black shadow-sm transition-all duration-300 z-10 ${isQuickAddOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}
                                        onMouseEnter={() => handleQuickAddHover(product.id)}
                                        onMouseLeave={handleQuickAddLeave}
                                        onClick={(e) => handleQuickAddClick(e, product.id)}
                                        aria-label="Quick add"
                                    >
                                        <Plus size={16} />
                                    </button>

                                    {/* Size Selector Overlay */}
                                    <div
                                        className={`absolute bottom-3 left-0 right-0 flex flex-wrap gap-1.5 justify-center px-2 transition-all duration-300 z-20 opacity-0 pointer-events-none translate-y-2 md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 ${isQuickAddOpen ? '!opacity-100 !pointer-events-auto !translate-y-0' : ''}`}
                                        onClick={(e) => e.preventDefault()}
                                        onMouseEnter={handleSizesHover}
                                        onMouseLeave={handleSizesLeave}
                                    >
                                        {sizeOption?.optionValues.map((size) => {
                                            const variant = product.variants?.nodes.find(v =>
                                                v.selectedOptions?.some(opt =>
                                                    opt.name.toLowerCase() === 'size' && opt.value === size.name
                                                )
                                            );
                                            const available = variant?.availableForSale !== false;

                                            return (
                                                <AddToCartButton
                                                    key={size.name}
                                                    lines={[{ merchandiseId: variant?.id || '', quantity: 1 }]}
                                                    className={`text-[10px] font-medium uppercase min-w-[28px] px-1.5 py-1 text-center border transition-all duration-200 ${!available
                                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-white/70 backdrop-blur-md'
                                                        : 'border-transparent bg-white/95 backdrop-blur-md text-gray-500 hover:text-black hover:border-black hover:bg-white hover:scale-105 hover:font-bold cursor-pointer shadow-sm'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    disabled={!available}
                                                >
                                                    {size.name}
                                                </AddToCartButton>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="card-info">
                                    <h3 className="card-title">{product.title}</h3>
                                    <div className="card-price">
                                        {price && <Money data={price} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {horizontalScroll && showViewMore && hasMore && (
                    <div className="view-more-container">
                        <button className="view-more-btn" onClick={handleViewMore}>
                            VIEW MORE
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!horizontalScroll && totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            )}
        </section>
    );
}
