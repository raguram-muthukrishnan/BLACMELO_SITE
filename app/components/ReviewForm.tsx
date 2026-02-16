import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';

interface ReviewFormProps {
    productId: string;
    productHandle: string;
    productTitle: string;
    onClose: () => void;
    onSubmit: () => void;
}

export function ReviewForm({ productId, productHandle, productTitle, onClose, onSubmit }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [reviewerEmail, setReviewerEmail] = useState('');
    const [size, setSize] = useState('');
    const [recommend, setRecommend] = useState(true);
    const [photos, setPhotos] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPhotos = Array.from(e.target.files).slice(0, 5 - photos.length);
            setPhotos([...photos, ...newPhotos]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare form data for server-side submission
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('email', reviewerEmail);
            formData.append('name', reviewerName);
            formData.append('rating', rating.toString());
            formData.append('title', title);
            formData.append('body', body);
            
            if (size) {
                formData.append('size', size);
            }
            
            formData.append('recommend', recommend ? 'true' : 'false');

            // Add photos
            formData.append('photoCount', photos.length.toString());
            photos.forEach((photo, index) => {
                formData.append(`photo_${index}`, photo);
            });

            // Submit to our API route
            const response = await fetch('/api/submit-review', {
                method: 'POST',
                body: formData,
            });

            const responseData = await response.json() as { success: boolean; error?: string; message?: string };
            
            if (responseData.success) {
                alert('Thank you for your review! It will appear after moderation.');
                onSubmit();
                onClose();
            } else {
                console.error('Review submission error:', responseData);
                alert(`Failed to submit review: ${responseData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="review-form-overlay" onClick={onClose}>
            <div className="review-form-modal" onClick={(e) => e.stopPropagation()}>
                <div className="review-form-header">
                    <h2>Write a Review</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
                </div>

                <div className="review-form-product">
                    <span>{productTitle}</span>
                </div>

                <form onSubmit={handleSubmit} className="review-form">
                    {/* Star Rating */}
                    <div className="form-group">
                        <label>Your Rating</label>
                        <div className="star-selector">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="star-btn"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                    aria-label={`Rate ${star} stars`}
                                >
                                    {star <= (hoveredRating || rating) ? '★' : '☆'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Title */}
                    <div className="form-group">
                        <label>Review Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Summarize your experience"
                            required
                        />
                    </div>

                    {/* Review Body */}
                    <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Share your thoughts on quality, fit, and style"
                            rows={4}
                            required
                        />
                    </div>

                    {/* Name */}
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            placeholder="Your name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={reviewerEmail}
                            onChange={(e) => setReviewerEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>

                    {/* Size */}
                    <div className="form-group">
                        <label>Size Purchased</label>
                        <select value={size} onChange={(e) => setSize(e.target.value)}>
                            <option value="">Not specified</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                    </div>

                    {/* Recommend */}
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={recommend}
                                onChange={(e) => setRecommend(e.target.checked)}
                            />
                            <span>I would recommend this product</span>
                        </label>
                    </div>

                    {/* Photo Upload */}
                    <div className="form-group">
                        <label>Add Images</label>
                        <div className="photo-upload">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                className="upload-btn"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={photos.length >= 5}
                            >
                                {photos.length > 0 ? `${photos.length} Image${photos.length > 1 ? 's' : ''} Added` : 'Add Images'}
                            </button>
                            {photos.length > 0 && (
                                <div className="photo-preview">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="photo-item">
                                            <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} />
                                            <button
                                                type="button"
                                                className="remove-photo"
                                                onClick={() => removePhoto(index)}
                                                aria-label="Remove photo"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-review-btn"
                        disabled={isSubmitting || rating === 0}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}
