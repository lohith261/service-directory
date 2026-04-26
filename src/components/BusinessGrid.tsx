import React, { useState } from 'react';
import type { Business } from '../lib/types';
import BusinessCard from './BusinessCard';
import LeadForm from './LeadForm';

interface BusinessGridProps {
  businesses: Business[];
  cityName: string;
}

export default function BusinessGrid({ businesses, cityName }: BusinessGridProps) {
  const [activeLead, setActiveLead] = useState<{ id: string; name: string } | null>(null);

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No providers found in {cityName} yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            onLeadClick={(id, name) => setActiveLead({ id, name })}
          />
        ))}
      </div>

      {activeLead && (
        <LeadForm
          businessId={activeLead.id}
          businessName={activeLead.name}
          onClose={() => setActiveLead(null)}
        />
      )}
    </>
  );
}
