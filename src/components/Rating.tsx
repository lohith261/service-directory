import React from 'react';

interface RatingProps {
  rating: number;
  reviewCount: number;
}

export default function Rating({ rating, reviewCount }: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? '★' : '☆');

  return (
    <div className="flex items-center gap-2">
      <span className="text-yellow-500 text-lg">{stars.join('')}</span>
      <span className="text-sm text-gray-700">
        {rating.toFixed(1)} ({reviewCount} reviews)
      </span>
    </div>
  );
}
