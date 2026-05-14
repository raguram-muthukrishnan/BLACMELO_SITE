import { useState, useEffect } from 'react';
import { JudgemeReviewWidget, JudgemePreviewBadge } from '@judgeme/shopify-hydrogen';
import { ReviewForm } from './ReviewForm';
import { Star } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
  productTitle: string;
  productHandle: string;
}

export function ProductReviews({ productId, productTitle, productHandle }: ProductReviewsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [hasReviews, setHasReviews] = useState(false);

  // Check if product has reviews via DOM (since Judge.me handles its own data)
  useEffect(() => {
    let checks = 0;
    const checkInterval = setInterval(() => {
      const badgeElement = document.querySelector('.jdgm-prev-badge');
      if (badgeElement) {
        const count = parseInt(badgeElement.getAttribute('data-number-of-reviews') || '0');
        if (count > 0) {
          setHasReviews(true);
          clearInterval(checkInterval);
        }
      }
      checks++;
      if (checks > 10) clearInterval(checkInterval); // Stop after 5 seconds
    }, 500);

    return () => clearInterval(checkInterval);
  }, [productId]);


  const numericId = productId.split('/').pop() || '';

  return (
    <section className="product-reviews-section" id="reviews">
      <div className="container">
        <div className="reviews-header">
          <div className="reviews-title-group">
            <h2 className="reviews-title">Customer Reviews</h2>
            <div className="reviews-summary-badge">
              <JudgemePreviewBadge id={numericId} handle={productHandle} />
            </div>
          </div>
          
          {!isFormOpen && !reviewSubmitted && (
            <button 
              className="write-review-btn"
              onClick={() => setIsFormOpen(true)}
            >
              WRITE A REVIEW
            </button>
          )}
        </div>

        {isFormOpen && (
          <div className="review-form-wrapper">
            <ReviewForm 
              productId={productId}
              productTitle={productTitle}
              onClose={() => setIsFormOpen(false)}
              onSuccess={() => {
                setIsFormOpen(false);
                setReviewSubmitted(true);
              }}
            />
          </div>
        )}

        {reviewSubmitted && (
          <div className="review-success-msg">
            <h3>Thank you for your review!</h3>
            <p>Your feedback is being processed and will appear soon.</p>
            <button onClick={() => setReviewSubmitted(false)} className="close-msg-btn">Close</button>
          </div>
        )}

        <div className="reviews-widget-container">
          {/* Always render the widget so it can load, but we wrap it for styling */}
          <JudgemeReviewWidget id={numericId} handle={productHandle} />
          
          {!hasReviews && !isFormOpen && !reviewSubmitted && (
            <div className="no-reviews-placeholder">
              <div className="placeholder-stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} color="#e0e0e0" />)}
              </div>
              <p>Be the first to review this product</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
