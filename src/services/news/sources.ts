import type { NewsSource } from './types';

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'cbr',
    name: 'Comic Book Resources',
    url: 'https://www.cbr.com/feed/',
    language: 'en',
    category: 'comics',
    updateInterval: 15 * 60 * 1000, // 15 minutes
    reliability: 0.9,
    parser: 'rss',
    mockData: {
      articles: [
        {
          title: 'Marvel Announces New Spider-Man Series',
          description: 'Major creative team reveals plans for groundbreaking storyline',
          content: 'Marvel Comics has announced a new Spider-Man series...',
          publishedAt: new Date().toISOString(),
          author: 'John Doe',
          urlToImage: 'https://images.unsplash.com/photo-1612036782180-6f0822045d23?w=800&h=400&fit=crop'
        },
        {
          title: 'DC Comics Reports Record Sales',
          description: 'Q1 earnings exceed expectations with digital sales surge',
          content: 'DC Comics has reported record-breaking sales figures...',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          author: 'Jane Smith',
          urlToImage: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=800&h=400&fit=crop'
        }
      ]
    }
  },
  {
    id: 'newsarama',
    name: 'Newsarama',
    url: 'https://www.newsarama.com/feeds/all',
    language: 'en',
    category: 'comics',
    updateInterval: 15 * 60 * 1000,
    reliability: 0.85,
    parser: 'rss',
    mockData: {
      articles: [
        {
          title: 'Comic Convention Dates Announced',
          description: 'Major publishers confirm attendance and exclusive releases',
          content: 'The dates for next year\'s major comic conventions...',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          author: 'Mike Johnson',
          urlToImage: 'https://images.unsplash.com/photo-1612036782180-6f0822045d23?w=800&h=400&fit=crop'
        }
      ]
    }
  }
];