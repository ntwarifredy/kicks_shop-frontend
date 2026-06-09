import { HiStar, HiOutlineStar } from 'react-icons/hi';

const StarRating = ({ rating = 0, maxStars = 5, size = 'sm' }) => {
  const sizeClass = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const fill = rating >= starValue ? 'full' : rating >= starValue - 0.5 ? 'half' : 'empty';
        return (
          <span key={i} className="relative">
            <HiOutlineStar className={`${sizeClass} text-surface-600`} />
            {fill !== 'empty' && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: fill === 'half' ? '50%' : '100%' }}>
                <HiStar className={`${sizeClass} text-amber-400`} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
