import React from 'react';
import { Breadcrumbs } from './common/Breadcrumbs';
import { TradingDesk } from './TradingDesk';
import { MarketSentiment } from './MarketSentiment';
import { MarketActivity } from './MarketActivity';

export function Trading() {
  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold text-white mb-6">Trading</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TradingDesk />
          <MarketSentiment />
        </div>
        <div className="space-y-6">
          <MarketActivity />
        </div>
      </div>
    </div>
  );
}