import { useState } from 'react';
import { StarRating } from './StarRating';

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

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [helpfulVote, setHelpfulVote] = useState<boolean | null>(null);

    const handleHelpful = (isHelpful: boolean) => {
        setHelpfulVote(isHelpful);
    };

    return (
        <div className="review-card">
            <div className="review-header">
                <div className="reviewer-info">
                    <span className="reviewer-name">{review.reviewerName}</span>
                    {review.verifiedBuyer && (
                        <span className="verified-badge">Verified Buyer</span>
                    )}
                </div>
                <span className="review-date">{review.date}</span>
            </div>

            <div className="review-rating">
                <StarRating value={review.rating} />
            </div>

            {review.title && (
                <h3 className="review-title">{review.title}</h3>
            )}

            {review.body && (
                <div className="review-body">
                    <p>{isExpanded ? review.body : review.body.slice(0, 150)}</p>
                    {review.body.length > 150 && !isExpanded && (
                        <button 
                            className="see-more-btn"
                            onClick={() => setIsExpanded(true)}
                        >
                            SEE MORE
                        </button>
                    )}
                </div>
            )}

            <div className="review-meta">
                <div className="review-details">
                    <span className="review-recommend">
                        <strong>Recommend?</strong> {review.recommend ? 'Yes' : 'No'}
                    </span>
                    <span className="review-size">
                        <strong>Size:</strong> {review.size}
                    </span>
                </div>
            </div>

            <div className="review-product">
                <span className="product-label">Product reviewed:</span>
                <span className="product-name">{review.productVariant}</span>
            </div>

            <div className="review-helpful">
                <span className="helpful-label">Was this review helpful?</span>
                <div className="helpful-buttons">
                    <button 
                        className={`helpful-btn ${helpfulVote === true ? 'active' : ''}`}
                        onClick={() => handleHelpful(true)}
                    >
                        👍 {review.helpfulCount + (helpfulVote === true ? 1 : 0)}
                    </button>
                    <button 
                        className={`helpful-btn ${helpfulVote === false ? 'active' : ''}`}
                        onClick={() => handleHelpful(false)}
                    >
                        👎 {review.notHelpfulCount + (helpfulVote === false ? 1 : 0)}
                    </button>
                </div>
            </div>
        </div>
    );
}
