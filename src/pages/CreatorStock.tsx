import React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CreatorProfile } from '../components/CreatorProfile';
import { CreatorStockChart } from '../components/CreatorStockChart';
import { CreatorOptions } from '../components/CreatorOptions';
import { CreatorNews } from '../components/CreatorNews';
import { RelatedCreators } from '../components/RelatedCreators';

export function CreatorStock() {
  const { symbol } = useParams<{ symbol: string }>();

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CreatorProfile symbol={symbol} />
          <CreatorStockChart symbol={symbol} />
          <CreatorOptions symbol={symbol} />
        </div>
        <div className="space-y-6">
          <CreatorNews symbol={symbol} />
          <RelatedCreators symbol={symbol} />
        </div>
      </div>
    </div>
  );
}