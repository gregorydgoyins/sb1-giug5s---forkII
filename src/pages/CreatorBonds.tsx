import React from 'react';
import { CreatorBonds as CreatorBondsComponent } from '../components/CreatorBonds';

export function CreatorBonds() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Creator Bonds</h1>
      <CreatorBondsComponent />
    </div>
  );
}