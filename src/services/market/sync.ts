import { PrimaryPriceIndex } from './PrimaryPriceIndex';
import { MarketDataService } from './MarketDataService';
import { ErrorHandler } from '../../utils/errors';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function syncMarketData() {
  const errorHandler = ErrorHandler.getInstance();

  try {
    console.log('Starting market data synchronization...');
    
    const priceIndex = PrimaryPriceIndex.getInstance();
    const marketData = MarketDataService.getInstance();

    // Calculate current index value
    const indexValue = priceIndex.calculateIndex();
    console.log('Current Price Index:', indexValue);

    // Get age distribution
    const distribution = priceIndex.getAgeDistribution();
    console.log('Age Distribution:', distribution);

    // Get historical performance
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const ytdPerformance = priceIndex.getHistoricalPerformance(yearStart, now);
    console.log('YTD Performance:', `${ytdPerformance}%`);

    // Update market data
    await marketData.updateMarketData('CMI', {
      symbol: 'CMI',
      data: [{
        timestamp: Date.now(),
        price: indexValue,
        volume: 0,
        high: indexValue,
        low: indexValue,
        open: indexValue,
        close: indexValue
      }],
      indicators: [],
      lastUpdate: Date.now()
    });

    console.log('Market data synchronized successfully');
  } catch (error) {
    errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
      context: 'sync',
      operation: 'syncMarketData'
    });
  }
}

syncMarketData();