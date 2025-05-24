export interface MemoryStats {
  timestamp: Date;
  heapUsed: number;
  heapTotal: number;
  usagePercentage: number;
  rss: number;
  external: number;
}

export interface MemoryAlert {
  timestamp: Date;
  usagePercentage: number;
  heapUsed: number;
  heapTotal: number;
  actionTaken: string;
}