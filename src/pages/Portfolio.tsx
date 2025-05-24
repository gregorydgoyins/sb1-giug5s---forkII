import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PortfolioManager } from '../components/portfolio/PortfolioManager';

export function Portfolio() {
  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PortfolioManager />
    </div>
  );
}