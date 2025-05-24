import type { ScraperConfig } from './types';

export const DEFAULT_CONFIG: ScraperConfig = {
  timeout: 10000,
  retries: 3,
  concurrency: 2,
  userAgent: 'Panel Profits/1.0 (Comic Market Analysis Platform)'
};

export const SELECTORS = {
  comicDetails: [
    {
      name: 'title',
      query: '.comic-title',
      type: 'text'
    },
    {
      name: 'price',
      query: '.price',
      type: 'text'
    },
    {
      name: 'description',
      query: '.description',
      type: 'html'
    },
    {
      name: 'creators',
      query: '.creator',
      type: 'text',
      multiple: true
    },
    {
      name: 'images',
      query: 'img',
      type: 'attr',
      attribute: 'src',
      multiple: true
    }
  ]
} as const;