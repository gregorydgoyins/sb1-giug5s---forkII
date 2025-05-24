'use client';

import React from 'react';
import { useTradingContext } from '../context/TradingContext';
import { PriceChart } from '../Common/PriceChart';
import { OrderBook } from '../Common/OrderBook';
import { VolumeMetrics } from '../Common/VolumeMetrics';

export function MarketData() {
  const { marketData, currentAsset } = useTradingContext();

  if (!currentAsset) {
    return null;
  }

  return (
    <div className="card">
      <h2 className="section-header trading-header">Market Data</h2>
      <div className="space-y-6">
        <PriceChart data={marketData?.priceHistory || []} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderBook data={marketData?.orderBook} />
          <VolumeMetrics data={marketData?.volumeMetrics} />
        </div>
      </div>
    </div>
  );
}