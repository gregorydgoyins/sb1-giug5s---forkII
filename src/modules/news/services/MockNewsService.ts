import { ErrorHandler } from '@/utils/errors';
import type { NewsItem } from '../types';

export class MockNewsService {
  private static instance: MockNewsService;
  private errorHandler: ErrorHandler;
  private mockNews: NewsItem[];

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.mockNews = [
      {
        id: '1',
        title: 'Marvel Announces New Spider-Man Series',
        impact: 'positive',
        timestamp: new Date(),
        summary: 'Major creative team reveals plans for groundbreaking storyline',
        source: 'Marvel Entertainment',
        url: 'https://example.com/news/1',
        relatedSecurity: {
          type: 'comic',
          symbol: 'ASM300',
          name: 'Amazing Spider-Man #300'
        },
        content: 'Full article content here...',
        category: 'publisher',
        author: 'John Smith',
        tags: ['marvel', 'spider-man', 'comics']
      },
      {
        id: '2',
        title: 'Todd McFarlane Reveals New Spawn Universe',
        impact: 'positive',
        timestamp: new Date(Date.now() - 1800000),
        summary: 'Legendary creator expands Spawn franchise with multiple new titles',
        source: 'Industry News',
        url: 'https://example.com/news/2',
        relatedSecurity: {
          type: 'creator',
          symbol: 'TMFS',
          name: 'Todd McFarlane'
        },
        content: 'Full article content here...',
        category: 'creator',
        author: 'Jane Doe',
        tags: ['spawn', 'mcfarlane', 'image-comics']
      },
      {
        id: '3',
        title: 'DC Comics Reports Record Digital Sales',
        impact: 'positive',
        timestamp: new Date(Date.now() - 3600000),
        summary: 'Q1 earnings exceed expectations with digital sales surge',
        source: 'DC Comics',
        url: 'https://example.com/news/3',
        relatedSecurity: {
          type: 'publisher',
          symbol: 'DCCP',
          name: 'DC Comics'
        },
        content: 'Full article content here...',
        category: 'publisher',
        author: 'Mike Wilson',
        tags: ['dc-comics', 'earnings', 'digital']
      }
    ];
  }

  public static getInstance(): MockNewsService {
    if (!MockNewsService.instance) {
      MockNewsService.instance = new MockNewsService();
    }
    return MockNewsService.instance;
  }

  public async getLatestNews(): Promise<NewsItem[]> {
    return this.errorHandler.withErrorHandling(async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.mockNews;
    }, {
      context: 'MockNewsService',
      operation: 'getLatestNews'
    });
  }

  public async getNewsByCategory(category: string): Promise<NewsItem[]> {
    return this.errorHandler.withErrorHandling(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.mockNews.filter(item => item.category === category);
    }, {
      context: 'MockNewsService',
      operation: 'getNewsByCategory',
      category
    });
  }

  public async getNewsById(id: string): Promise<NewsItem | undefined> {
    return this.errorHandler.withErrorHandling(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.mockNews.find(item => item.id === id);
    }, {
      context: 'MockNewsService',
      operation: 'getNewsById',
      id
    });
  }
}