```typescript
'use client';

import React from 'react';
import { MarketChart } from '../visualization/MarketChart';
import { MarketMetrics } from './MarketMetrics';
import { MediaPerformance } from './MediaPerformance';
import { MarketIndicators } from './MarketIndicators';
import { MarketFilters } from './MarketFilters';

export function MarketAnalysisDashboard() {
  return (
    <div className="space-y-6">
      {/* Market Filters */}
      <MarketFilters />

      {/* Main Chart and Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketChart />
        </div>
        <div>
          <MarketMetrics />
        </div>
      </div>

      {/* Media Performance and Market Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MediaPerformance />
        <MarketIndicators />
      </div>
    </div>
  );
}
```