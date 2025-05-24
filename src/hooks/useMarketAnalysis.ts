```typescript
import { useQuery } from '@tanstack/react-query';
import { MarketAnalyzer } from '../services/analysis/MarketAnalyzer';

const analyzer = new MarketAnalyzer();

export function useMarketAnalysis(symbol: string) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12); // 12 months ago
  
  return useQuery({
    queryKey: ['marketAnalysis', symbol],
    queryFn: async () => {
      const correlation = await analyzer.analyzeMarketImpact(
        [], // Comic trends will be fetched inside analyzer
        symbol,
        startDate,
        new Date()
      );
      
      return analyzer.generateMarketSentiment(
        [correlation],
        [] // Events will be fetched inside analyzer
      );
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}
```