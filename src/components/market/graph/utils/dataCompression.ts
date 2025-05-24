interface DataPoint {
  date: string;
  value: number;
}

const COMPRESSION_RATIOS = {
  '1D': 5,    // 5-minute intervals
  '1W': 15,   // 15-minute intervals
  '1M': 60,   // Hourly intervals
  '3M': 1440, // Daily intervals
  '1Y': 10080, // Weekly intervals
  'ALL': 43200 // Monthly intervals
};

export function compressData(data: DataPoint[], timeRange: string): DataPoint[] {
  const ratio = COMPRESSION_RATIOS[timeRange as keyof typeof COMPRESSION_RATIOS] || 1;
  
  // Skip compression for small datasets
  if (data.length <= 100) return data;

  const compressed: DataPoint[] = [];
  let sum = 0;
  let count = 0;
  let currentDate = '';

  data.forEach((point, index) => {
    sum += point.value;
    count++;

    if (count === ratio || index === data.length - 1) {
      compressed.push({
        date: currentDate || point.date,
        value: sum / count
      });
      sum = 0;
      count = 0;
      currentDate = '';
    } else if (count === 1) {
      currentDate = point.date;
    }
  });

  return compressed;
}