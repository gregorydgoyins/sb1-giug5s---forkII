export const scrapingConfig = {
  interval: 6 * 60 * 60 * 1000, // 6 hours
  rateLimit: {
    points: 100,
    duration: 60 * 60 // 1 hour
  },
  sources: [
    {
      name: 'ComicVine',
      type: 'api',
      url: 'https://comicvine.gamespot.com/api',
      priority: 1
    },
    {
      name: 'GoCollect',
      type: 'api',
      url: 'https://gocollect.com/api/v1',
      priority: 2
    },
    {
      name: 'KeyCollector',
      type: 'api',
      url: 'https://keycollectorcomics.com/api/v1',
      priority: 3
    }
  ],
  retryOptions: {
    retries: 3,
    minTimeout: 1000,
    maxTimeout: 5000
  }
};