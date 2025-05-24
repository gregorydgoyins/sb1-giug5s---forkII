import React, { createContext, useContext, useEffect, useState } from 'react';
import { MarketDataIntegrator } from '../services/marketData/MarketDataIntegrator';
import { ErrorHandler } from '../utils/errors';
import type { ComicData, MarketTrend } from '../services/marketData/types';

interface MarketDataContextType {
  trendingComics: MarketTrend[];
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
  searchComics: (query: string) => Promise<ComicData[]>;
  getComicDetails: (id: string) => Promise<ComicData>;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [trendingComics, setTrendingComics] = useState<MarketTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [marketDataIntegrator] = useState(() => MarketDataIntegrator.getInstance());
  const errorHandler = ErrorHandler.getInstance();

  const refreshData = async () => {
    return errorHandler.withErrorHandling(async () => {
      try {
        setIsLoading(true);
        setError(null);
        const trends = await marketDataIntegrator.getTrendingComics();
        setTrendingComics(trends);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch market data'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, {
      context: 'MarketDataProvider',
      operation: 'refreshData'
    });
  };

  const searchComics = async (query: string): Promise<ComicData[]> => {
    return errorHandler.withErrorHandling(async () => {
      return marketDataIntegrator.searchComics({ query });
    }, {
      context: 'MarketDataProvider',
      operation: 'searchComics',
      query
    });
  };

  const getComicDetails = async (id: string): Promise<ComicData> => {
    return errorHandler.withErrorHandling(async () => {
      return marketDataIntegrator.getComicData(id);
    }, {
      context: 'MarketDataProvider',
      operation: 'getComicDetails',
      comicId: id
    });
  };

  useEffect(() => {
    refreshData().catch(err => {
      console.error('Failed to initialize market data:', err);
    });
  }, []);

  const value = {
    trendingComics,
    isLoading,
    error,
    refreshData,
    searchComics,
    getComicDetails
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
}