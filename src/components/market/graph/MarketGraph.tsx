'use client';

import React, { useMemo, lazy, Suspense } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { LoadingState } from '@/app/loading-state';
import { compressData } from './utils/dataCompression';
import { MarketGraphControls } from './MarketGraphControls';
import { GraphTooltip } from './GraphTooltip';
import { formatCurrency } from '@/utils/formatters';

// Lazy load the heavy chart component
const Chart = lazy(() => import('./Chart'));

export function MarketGraph() {
  const { data: marketData, isLoading } = useMarketData();
  const [timeRange, setTimeRange] = React.useState('1M');

  const compressedData = useMemo(() => {
    if (!marketData?.historicalData) return [];
    return compressData(marketData.historicalData, timeRange);
  }, [marketData?.historicalData, timeRange]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="card">
      <MarketGraphControls 
        timeRange={timeRange} 
        onTimeRangeChange={setTimeRange}
      />

      <div className="h-[400px] w-full">
        <Suspense fallback={<LoadingState />}>
          <Chart
            data={compressedData}
            tooltipContent={GraphTooltip}
            yAxisFormatter={formatCurrency}
            xAxisFormatter={(date: string) => new Date(date).toLocaleDateString()}
          />
        </Suspense>
      </div>
    </div>
  );
}