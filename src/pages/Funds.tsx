import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FundCatalog } from '../components/funds/FundCatalog';

export function Funds() {
  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <FundCatalog />
    </div>
  );
}