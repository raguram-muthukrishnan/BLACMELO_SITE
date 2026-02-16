interface StarRatingProps {
  value: number;
  maxStars?: number;
  readonly?: boolean;
}

export function StarRating({ value, maxStars = 5, readonly = false }: StarRatingProps) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[...Array(maxStars)].map((_, index) => {
        const isFilled = index < value;
        return (
          <span 
            key={index} 
            style={{ 
              color: '#000',
              fontSize: '12px',
              lineHeight: 1
            }}
          >
            {isFilled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
}
