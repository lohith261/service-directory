import React from 'react';

const CITIES = [
  { name: 'Austin', slug: 'austin' },
  { name: 'Los Angeles', slug: 'los-angeles' },
  { name: 'Miami', slug: 'miami' },
  { name: 'New York', slug: 'new-york' },
  { name: 'Chicago', slug: 'chicago' },
];

interface CityNavProps {
  activeCity?: string;
}

export default function CityNav({ activeCity }: CityNavProps) {
  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="container">
        <div className="flex gap-2 overflow-x-auto py-3">
          {CITIES.map((city) => (
            <a
              key={city.slug}
              href={`/${city.slug}`}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-medium text-sm ${
                activeCity === city.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {city.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
