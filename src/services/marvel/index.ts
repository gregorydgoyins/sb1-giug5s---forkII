export * from './MarvelApiClient';
export * from './MarvelDataManager';
export * from './types';

export const DEFAULT_CONFIG = {
  publicKey: process.env.MARVEL_PUBLIC_KEY || '',
  privateKey: process.env.MARVEL_PRIVATE_KEY || '',
  baseUrl: 'https://gateway.marvel.com/v1/public',
  rateLimit: {
    maxRequests: 3000,
    perMilliseconds: 24 * 60 * 60 * 1000 // 24 hours
  }
};