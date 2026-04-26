import React from 'react';
import type { Business } from '../lib/types';
import Rating from './Rating';

interface BusinessCardProps {
  business: Business;
  onLeadClick: (businessId: string, businessName: string) => void;
}

export default function BusinessCard({ business, onLeadClick }: BusinessCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {business.image_url && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={business.image_url}
            alt={business.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 flex-1">{business.name}</h3>
          {business.verified && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2 shrink-0">
              ✓ Verified
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-2 capitalize">{business.trade_type}</p>

        <Rating rating={business.rating} reviewCount={business.reviews_count} />

        {business.hours && (
          <p className="text-xs text-gray-500 mt-2">🕐 {business.hours}</p>
        )}

        <div className="mt-4 space-y-2">
          <a
            href={`tel:${business.phone}`}
            className="block text-sm text-blue-600 font-semibold hover:text-blue-700"
          >
            📞 {business.phone}
          </a>
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-600 font-semibold hover:text-blue-700"
            >
              🌐 Visit Website
            </a>
          )}
        </div>

        <button
          onClick={() => onLeadClick(business.id, business.name)}
          className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Get Estimate
        </button>
      </div>
    </div>
  );
}
