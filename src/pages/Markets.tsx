import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MarketOverview } from '../components/MarketOverview';
import { MarketMetrics } from '../components/MarketMetrics';
import { TrendingStocks } from '../components/TrendingStocks';
import { MarketActivity } from '../components/MarketActivity';
import { MarketSentiment } from '../components/MarketSentiment';

export function Markets() {
  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold text-white mb-6">Markets</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MarketOverview />
          <MarketMetrics />
          <MarketSentiment />
          <TrendingStocks />
        </div>
        <div className="space-y-6">
          <MarketActivity />
        </div>
      </div>
    </div>
  );
}