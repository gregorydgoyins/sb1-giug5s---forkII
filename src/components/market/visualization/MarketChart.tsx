'use client';

import React, { useRef, useEffect, useState } from 'react';
import { createChart, IChartApi, ColorType } from 'lightweight-charts';
import { useMarketData } from '@/hooks/useMarketData';
import { LoadingState } from '@/app/loading-state';
import { compressTimeSeriesData } from './utils/compression';
import { initializeOfflineCache } from './utils/offlineCache';
import { ChartControls } from './ChartControls';
import type { ChartData } from './types';

export function MarketChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const { data: marketData, isLoading } = useMarketData();
  const [timeframe, setTimeframe] = useState('1D');

  useEffect(() => {
    // Initialize offline cache
    initializeOfflineCache();

    if (chartContainerRef.current) {
      const chartInstance = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#1e293b' },
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { color: '#334155' },
          horzLines: { color: '#334155' },
        },
        crosshair: {
          mode: 0,
          vertLine: { color: '#818cf8', width: 1 },
          horzLine: { color: '#818cf8', width: 1 },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: '#334155',
        },
        rightPriceScale: {
          borderColor: '#334155',
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      setChart(chartInstance);

      return () => {
        chartInstance.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (chart && marketData?.historicalData) {
      const compressedData = compressTimeSeriesData(marketData.historicalData, timeframe);
      
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      candlestickSeries.setData(compressedData);

      // Add volume histogram
      const volumeSeries = chart.addHistogramSeries({
        color: '#818cf8',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });

      volumeSeries.setData(compressedData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? '#22c55e' : '#ef4444'
      })));

      return () => {
        chart.removeSeries(candlestickSeries);
        chart.removeSeries(volumeSeries);
      };
    }
  }, [chart, marketData, timeframe]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="card">
      <ChartControls 
        timeframe={timeframe} 
        onTimeframeChange={setTimeframe}
      />
      <div 
        ref={chartContainerRef} 
        className="h-[500px] w-full"
      />
    </div>
  );
}