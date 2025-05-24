```typescript
'use client';

import React from 'react';
import { MarketAnalysisDashboard } from '../market/analysis/MarketAnalysisDashboard';

export function Markets() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Markets</h1>
      <MarketAnalysisDashboard />
    </div>
  );
}
```