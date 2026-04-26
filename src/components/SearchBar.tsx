import React, { useState } from 'react';

const CITIES = ['Austin', 'Los Angeles', 'Miami', 'New York', 'Chicago'];
const TRADES = ['All Trades', 'Plumber', 'Electrician', 'HVAC', 'General'];

const CITY_SLUGS: Record<string, string> = {
  'Austin': 'austin',
  'Los Angeles': 'los-angeles',
  'Miami': 'miami',
  'New York': 'new-york',
  'Chicago': 'chicago',
};

interface SearchBarProps {
  initialCity?: string;
}

export default function SearchBar({ initialCity = 'Austin' }: SearchBarProps) {
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedTrade, setSelectedTrade] = useState('All Trades');

  const handleSearch = () => {
    const slug = CITY_SLUGS[selectedCity] ?? selectedCity.toLowerCase().replace(/\s+/g, '-');
    const params = selectedTrade !== 'All Trades' ? `?trade=${selectedTrade.toLowerCase()}` : '';
    window.location.href = `/${slug}${params}`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4">
      <div className="container">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Find Local Service Providers
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            {TRADES.map((trade) => (
              <option key={trade} value={trade}>
                {trade}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
