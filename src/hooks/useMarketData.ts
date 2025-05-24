'use client';

import { useFetch } from './useFetch';
import type { MarketData } from '@/types';

export function useMarketData() {
  return useFetch<MarketData>('/api/market', {
    enabled: true,
    dependencies: [],
    onError: (error) => {
      console.error('Failed to fetch market data:', error);
    }
  });
}