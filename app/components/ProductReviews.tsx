import { useState, useEffect } from 'react';
import { ReviewCard } from './ReviewCard';
import { StarRating } from './StarRating';
import { ReviewForm } from './ReviewForm';

interface Review {
    id: string;
    reviewerName: string;
    verifiedBuyer: boolean;
    rating: number;
    title: string;
    body: string;
    recommend: boolean;
    size: string;
    date: string;
    helpfulCount: number;
    notHelpfulCount: number;
    productVariant: string;
}

interface ProductReviewsProps {
    productId: string;
    productHandle?: string;
}

export function ProductReviews({ productId, productHandle }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Most relevant');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [productTitle, setProductTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    
    const reviewsPerPage = 6;
    
    // Convert Shopify GID to numeric ID
    const numericId = productId.includes('gid://') 
        ? productId.split('/').pop() 
        : productId;

    // Fetch Judge.me reviews
    useEffect(() => {
        const fetchJudgemeReviews = async () => {
            try {
                // Wait for Judge.me to initialize
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Access Judge.me widget data from DOM
                const widgetElement = document.querySelector(`[data-jdgm-product-id="${numericId}"]`);
                
                if (widgetElement) {
                    // Get data from Judge.me's data attributes
                    const rating = widgetElement.getAttribute('data-average-rating');
                    const count = widgetElement.getAttribute('data-number-of-reviews');
                    
                    if (rating) setAverageRating(parseFloat(rating));
                    if (count) setTotalReviews(parseInt(count));
                }

                // Fetch reviews via Judge.me API if available
                if (typeof window !== 'undefined' && (window as any).jdgm) {
                    const jdgmData = (window as any).jdgm;
                    // Judge.me exposes review data through their widget
                    // We'll parse it from the rendered HTML
                    const reviewElements = document.querySelectorAll('.jdgm-rev');
                    const fetchedReviews: Review[] = [];
                    
                    reviewElements.forEach((el, index) => {
                        const reviewer = el.querySelector('.jdgm-rev__author')?.textContent || 'Anonymous';
                        const ratingEl = el.querySelector('[data-score]');
                        const rating = ratingEl ? parseInt(ratingEl.getAttribute('data-score') || '5') : 5;
                        const title = el.querySelector('.jdgm-rev__title')?.textContent || '';
                        const body = el.querySelector('.jdgm-rev__body')?.textContent || '';
                        const date = el.querySelector('.jdgm-rev__timestamp')?.textContent || '';
                        
                        fetchedReviews.push({
                            id: `review-${index}`,
                            reviewerName: reviewer,
                            verifiedBuyer: el.classList.contains('jdgm-verified-buyer'),
                            rating,
                            title,
                            body,
                            recommend: rating >= 4,
                            size: '',
                            date,
                            helpfulCount: 0,
                            notHelpfulCount: 0,
                            productVariant: '',
                        });
                    });
                    
                    if (fetchedReviews.length > 0) {
                        setReviews(fetchedReviews);
                    }
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching Judge.me reviews:', error);
                setIsLoading(false);
            }
        };

        fetchJudgemeReviews();
        
        // Get product title from page
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            setProductTitle(titleElement.textContent || '');
        }
    }, [numericId]);

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const displayReviews = reviews.slice(startIndex, endIndex);

    // Rating categories - these would ideally come from Judge.me custom fields
    const ratingCategories = [
        { label: 'Comfort', value: averageRating * 0.98, description: 'Very Comfortable' },
        { label: 'Fit', value: averageRating * 0.92, description: 'True To Size' },
        { label: 'Quality', value: averageRating, description: 'Exceptional Quality' },
        { label: 'Length', value: averageRating * 0.96, description: 'Just Right' },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openReviewForm = () => {
        setShowReviewForm(true);
    };

    const closeReviewForm = () => {
        setShowReviewForm(false);
    };

    const handleReviewSubmit = () => {
        // Refresh reviews after submission
        window.location.reload();
    };

    if (isLoading) {
        return (
            <section className="product-reviews-section">
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    Loading reviews...
                </div>
            </section>
        );
    }

    return (
        <section className="product-reviews-section">
            {/* Judge.me Hidden Widget - For Data Collection */}
            <div style={{ display: 'none' }}>
                <div 
                    className="jdgm-widget jdgm-review-widget" 
                    data-id={numericId}
                    data-jdgm-product-id={numericId}
                ></div>
            </div>

            {/* Rating Summary */}
            <div className="reviews-summary">
                <div className="summary-rating">
                    <div className="rating-large">
                        {averageRating > 0 ? (
                            <>
                                <span className="rating-number">{averageRating.toFixed(1)}</span>
                                <StarRating value={Math.round(averageRating)} />
                            </>
                        ) : (
                            <>
                                <span className="rating-number">0.0</span>
                                <StarRating value={0} />
                            </>
                        )}
                    </div>
                    <button className="reviews-count" onClick={openReviewForm}>
                        {totalReviews > 0 ? `${totalReviews} Community Reviews` : 'No reviews yet'}
                    </button>
                </div>

                <div className="rating-bars">
                    {ratingCategories.map((category) => (
                        <div key={category.label} className="rating-category">
                            <div className="category-header">
                                <span className="category-label">{category.label}</span>
                            </div>
                            <div className="rating-bar-container">
                                <div 
                                    className="rating-bar-fill"
                                    style={{ width: `${(category.value / 5) * 100}%` }}
                                />
                            </div>
                            <div className="category-description">{category.description}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search and Sort */}
            <div className="reviews-controls">
                <div className="search-reviews">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search reviews"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="sort-reviews">
                    <label>Sort by</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option>Most relevant</option>
                        <option>Newest</option>
                        <option>Highest rated</option>
                        <option>Lowest rated</option>
                    </select>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 4h18M3 12h18M3 20h18"/>
                    </svg>
                </div>
                <button className="write-review-btn" onClick={openReviewForm}>
                    Write a Review
                </button>
            </div>

            {/* Review Cards */}
            {displayReviews.length > 0 ? (
                <div className="reviews-list">
                    {displayReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <div className="no-reviews">
                    <p>Be the first to review this product!</p>
                    <button className="write-review-btn" onClick={openReviewForm}>
                        Write a Review
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="reviews-pagination">
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

            {/* Review Form Modal */}
            {showReviewForm && numericId && (
                <ReviewForm
                    productId={numericId.toString()}
                    productHandle={productHandle || ''}
                    productTitle={productTitle}
                    onClose={closeReviewForm}
                    onSubmit={handleReviewSubmit}
                />
            )}
        </section>
    );
}
