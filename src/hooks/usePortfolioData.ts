'use client';

import { useFetch } from './useFetch';
import type { Portfolio } from '@/types';

export function usePortfolioData(portfolioId: string) {
  return useFetch<Portfolio>(`/api/portfolio?id=${portfolioId}`, {
    enabled: !!portfolioId,
    dependencies: [portfolioId],
    onError: (error) => {
      console.error('Failed to fetch portfolio:', error);
    }
  });
}