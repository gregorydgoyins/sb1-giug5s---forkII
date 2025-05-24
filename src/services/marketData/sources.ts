export const MARKET_DATA_SOURCES = [
  {
    name: 'GoCollect',
    baseUrl: 'https://gocollect.com/api/v1',
    priority: 1,
    endpoints: {
      sales: '/sales',
      trends: '/trends',
      prices: '/prices'
    },
    rateLimit: {
      requests: 100,
      window: 60000 // 1 minute
    }
  },
  {
    name: 'Key Collector Comics',
    baseUrl: 'https://keycollectorcomics.com/api/v1',
    priority: 2,
    endpoints: {
      market: '/market',
      prices: '/prices',
      trends: '/trends'
    },
    rateLimit: {
      requests: 60,
      window: 60000 // 1 minute
    }
  },
  {
    name: 'Heritage Auctions',
    baseUrl: 'https://comics.ha.com/c/search',
    priority: 3,
    endpoints: {
      search: '/search.zx',
      lots: '/lots',
      results: '/results'
    },
    rateLimit: {
      requests: 30,
      window: 60000 // 1 minute
    }
  }
];