export const TRUSTED_SOURCES = [
  { id: 'bloomberg', name: 'Bloomberg', verified: true },
  { id: 'reuters', name: 'Reuters', verified: true },
  { id: 'wsj', name: 'Wall Street Journal', verified: true },
  { id: 'ft', name: 'Financial Times', verified: true }
];

export const RSS_FEEDS = [
  {
    id: 'bloomberg-markets',
    name: 'Bloomberg Markets',
    url: 'https://www.bloomberg.com/markets/feed',
    priority: 1
  },
  {
    id: 'reuters-markets',
    name: 'Reuters Markets',
    url: 'https://www.reuters.com/markets/feed',
    priority: 2
  }
];