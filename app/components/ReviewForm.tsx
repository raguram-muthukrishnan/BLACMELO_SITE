import { useState } from 'react';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  productTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewForm({ productId, productTitle, onClose, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('productId', productId.split('/').pop() || '');
    formData.append('rating', rating.toString());

    try {
      const response = await fetch('/api/submit-review', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <div className="review-form-header">
        <h3>Write a Review</h3>
        <button onClick={onClose} className="review-form-close">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="review-form-group">
          <label>Rating</label>
          <div className="star-rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className={`star-btn ${(hoveredRating || rating) >= star ? 'active' : ''}`}
              >
                <Star fill={(hoveredRating || rating) >= star ? "currentColor" : "none"} size={24} />
              </button>
            ))}
          </div>
        </div>

        <div className="review-form-row">
          <div className="review-form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required placeholder="Enter your name" />
          </div>
          <div className="review-form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="Enter your email" />
          </div>
        </div>

        <div className="review-form-group">
          <label htmlFor="title">Review Title</label>
          <input type="text" id="title" name="title" required placeholder="Give your review a title" />
        </div>

        <div className="review-form-group">
          <label htmlFor="body">Review</label>
          <textarea id="body" name="body" required rows={5} placeholder="Write your comments here"></textarea>
        </div>

        {error && <div className="review-form-error">{error}</div>}

        <button type="submit" disabled={isSubmitting} className="review-submit-btn">
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
        </button>
      </form>
    </div>
  );
}
