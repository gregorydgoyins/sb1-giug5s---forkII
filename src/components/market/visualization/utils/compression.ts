import { compress, decompress } from 'lz-string';
import type { ChartData } from '../types';

export function compressTimeSeriesData(data: any[], timeframe: string): ChartData[] {
  // Determine compression ratio based on timeframe
  const ratios = {
    '1D': 5,    // 5-minute intervals
    '1W': 15,   // 15-minute intervals
    '1M': 60,   // Hourly intervals
    '3M': 1440, // Daily intervals
    '1Y': 10080, // Weekly intervals
    'ALL': 43200 // Monthly intervals
  };

  const ratio = ratios[timeframe as keyof typeof ratios] || 1;
  
  // Skip compression for small datasets
  if (data.length <= 100) return data;

  const compressed: ChartData[] = [];
  let sum = { open: 0, high: 0, low: 0, close: 0, volume: 0 };
  let count = 0;
  let currentTime = '';

  data.forEach((point, index) => {
    sum.open += point.open;
    sum.high = Math.max(sum.high, point.high);
    sum.low = Math.min(sum.low, point.low);
    sum.close += point.close;
    sum.volume += point.volume;
    count++;

    if (count === ratio || index === data.length - 1) {
      compressed.push({
        time: currentTime || point.time,
        open: sum.open / count,
        high: sum.high,
        low: sum.low,
        close: sum.close / count,
        volume: sum.volume
      });

      // Reset accumulators
      sum = { open: 0, high: 0, low: Infinity, close: 0, volume: 0 };
      count = 0;
      currentTime = '';
    } else if (count === 1) {
      currentTime = point.time;
    }
  });

  return compressed;
}

export function compressForStorage(data: ChartData[]): string {
  return compress(JSON.stringify(data));
}

export function decompressFromStorage(compressed: string): ChartData[] {
  return JSON.parse(decompress(compressed) || '[]');
}