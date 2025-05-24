import { openDB, IDBPDatabase } from 'idb';
import { compressForStorage, decompressFromStorage } from './compression';
import type { ChartData } from '../types';

const DB_NAME = 'market_chart_cache';
const STORE_NAME = 'time_series';

interface CacheDB extends IDBPDatabase {
  objectStoreNames: string[];
}

let db: CacheDB | null = null;

export async function initializeOfflineCache(): Promise<void> {
  if (!db) {
    db = await openDB(DB_NAME, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
        }
      },
    });
  }
}

export async function cacheTimeSeriesData(
  symbol: string,
  timeframe: string,
  data: ChartData[]
): Promise<void> {
  if (!db) await initializeOfflineCache();

  const compressed = compressForStorage(data);
  const id = `${symbol}-${timeframe}`;

  await db?.put(STORE_NAME, {
    id,
    symbol,
    timeframe,
    data: compressed,
    timestamp: Date.now(),
  });
}

export async function getCachedData(
  symbol: string,
  timeframe: string
): Promise<ChartData[] | null> {
  if (!db) await initializeOfflineCache();

  const id = `${symbol}-${timeframe}`;
  const cached = await db?.get(STORE_NAME, id);

  if (!cached) return null;

  // Check if cache is still valid (24 hours)
  if (Date.now() - cached.timestamp > 24 * 60 * 60 * 1000) {
    await db?.delete(STORE_NAME, id);
    return null;
  }

  return decompressFromStorage(cached.data);
}

export async function clearOldCache(): Promise<void> {
  if (!db) await initializeOfflineCache();

  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const tx = db?.transaction(STORE_NAME, 'readwrite');
  const store = tx?.objectStore(STORE_NAME);
  const index = store?.index('timestamp');

  if (index) {
    let cursor = await index.openCursor();
    while (cursor) {
      if (cursor.value.timestamp < oneDayAgo) {
        await cursor.delete();
      }
      cursor = await cursor.continue();
    }
  }
}