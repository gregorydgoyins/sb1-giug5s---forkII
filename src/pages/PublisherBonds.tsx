import React from 'react';
import { PublisherBonds as PublisherBondsComponent } from '../components/PublisherBonds';

export function PublisherBonds() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Publisher Bonds</h1>
      <PublisherBondsComponent />
    </div>
  );
}