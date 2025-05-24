'use client';

import React from 'react';
import { OrderEntry } from './OrderEntry';
import { MarketData } from './MarketData';
import { ExecutionPanel } from './ExecutionPanel';

export function TradingInterface() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketData />
        </div>
        <div>
          <OrderEntry />
        </div>
      </div>
      <ExecutionPanel />
    </div>
  );
}