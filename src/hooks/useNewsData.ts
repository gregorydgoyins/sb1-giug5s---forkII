import { useState, useEffect } from 'react';
import type { NewsItem } from '@/types';

// Generate 45 detailed mock news stories with balanced impact
const generateMockNews = (): NewsItem[] => {
  const mockNews: NewsItem[] = [
    // Positive News
    {
      id: 'news-1',
      title: 'Marvel Announces New Spider-Man Series with Superstar Creative Team',
      impact: 'positive',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'comic',
        symbol: 'ASM300',
        name: 'Amazing Spider-Man #300'
      }
    },
    {
      id: 'news-2',
      title: 'DC Comics Reports Record Digital Sales Growth',
      impact: 'positive',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'publisher',
        symbol: 'DCCP',
        name: 'DC Comics'
      }
    },

    // Negative News
    {
      id: 'news-3',
      title: 'Major Publisher Delays Key Series Launch',
      impact: 'negative',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'publisher',
        symbol: 'MRVL',
        name: 'Marvel Entertainment'
      }
    },
    {
      id: 'news-4',
      title: 'Comic Convention Circuit Faces Logistical Challenges',
      impact: 'negative',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },

    // Neutral News
    {
      id: 'news-5',
      title: 'Industry Group Announces New Grading Standards',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 'news-6',
      title: 'Creator Transitions to Digital-First Publishing',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'creator',
        symbol: 'TMFS',
        name: 'Todd McFarlane'
      }
    },

    // More balanced news items...
    {
      id: 'news-7',
      title: 'Supply Chain Issues Impact Comic Production',
      impact: 'negative',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000)
    },
    {
      id: 'news-8',
      title: 'Independent Publishers Report Mixed Q1 Results',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
    },
    {
      id: 'news-9',
      title: 'New Grading Company Enters Market',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000)
    },
    {
      id: 'news-10',
      title: 'Key Issue Prices Drop Amid Market Correction',
      impact: 'negative',
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000)
    },
    {
      id: 'news-11',
      title: 'Exclusive Creator Deal Boosts Publisher Stock',
      impact: 'positive',
      timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000)
    },
    {
      id: 'news-12',
      title: 'Digital Platform Experiences Technical Issues',
      impact: 'negative',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      id: 'news-13',
      title: 'Market Analysis Shows Shifting Collector Preferences',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 13 * 60 * 60 * 1000)
    },
    {
      id: 'news-14',
      title: 'Rising Shipping Costs Affect Comic Retailers',
      impact: 'negative',
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000)
    },
    {
      id: 'news-15',
      title: 'International Comic Sales Show Strong Growth',
      impact: 'positive',
      timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000)
    },

    // Continue with more balanced news...
    {
      id: 'news-16',
      title: 'Major Retailer Files for Bankruptcy',
      impact: 'negative',
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000)
    },
    {
      id: 'news-17',
      title: 'New Authentication Technology Launches',
      impact: 'positive',
      timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000)
    },
    {
      id: 'news-18',
      title: 'Industry Veterans Form New Publishing House',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000)
    },
    {
      id: 'news-19',
      title: 'Print Costs Rise Amid Paper Shortage',
      impact: 'negative',
      timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000)
    },
    {
      id: 'news-20',
      title: 'Successful NFT Launch for Classic Comics',
      impact: 'positive',
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000)
    },

    // Additional balanced entries...
    {
      id: 'news-21',
      title: 'Market Volatility Impacts Collector Confidence',
      impact: 'negative',
      timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000)
    },
    {
      id: 'news-22',
      title: 'New Investment Fund Focuses on Comics',
      impact: 'positive',
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000)
    },
    {
      id: 'news-23',
      title: 'Industry Survey Shows Mixed Outlook',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000)
    },
    {
      id: 'news-24',
      title: 'Grading Backlog Causes Market Uncertainty',
      impact: 'negative',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'news-25',
      title: 'Innovative Storage Solution Gains Traction',
      impact: 'positive',
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000)
    },

    // More varied news items...
    {
      id: 'news-26',
      title: 'Publisher Restructuring Raises Concerns',
      impact: 'negative',
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000)
    },
    {
      id: 'news-27',
      title: 'New Market Analysis Tool Launches',
      impact: 'positive',
      timestamp: new Date(Date.now() - 27 * 60 * 60 * 1000)
    },
    {
      id: 'news-28',
      title: 'Industry Standards Committee Formed',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000)
    },
    {
      id: 'news-29',
      title: 'Key Creator Announces Retirement',
      impact: 'negative',
      timestamp: new Date(Date.now() - 29 * 60 * 60 * 1000)
    },
    {
      id: 'news-30',
      title: 'Successful Auction Sets New Records',
      impact: 'positive',
      timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000)
    },

    // Final set of balanced news...
    {
      id: 'news-31',
      title: 'Distribution Network Faces Disruption',
      impact: 'negative',
      timestamp: new Date(Date.now() - 31 * 60 * 60 * 1000)
    },
    {
      id: 'news-32',
      title: 'New Market Makers Enter Trading Space',
      impact: 'positive',
      timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000)
    },
    {
      id: 'news-33',
      title: 'Regulatory Changes Under Review',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 33 * 60 * 60 * 1000)
    },
    {
      id: 'news-34',
      title: 'Major Collection Liquidation Announced',
      impact: 'negative',
      timestamp: new Date(Date.now() - 34 * 60 * 60 * 1000)
    },
    {
      id: 'news-35',
      title: 'Tech Partnership Enhances Trading Platform',
      impact: 'positive',
      timestamp: new Date(Date.now() - 35 * 60 * 60 * 1000)
    },
    {
      id: 'news-36',
      title: 'Market Research Report Released',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000)
    },
    {
      id: 'news-37',
      title: 'Counterfeit Detection System Fails Test',
      impact: 'negative',
      timestamp: new Date(Date.now() - 37 * 60 * 60 * 1000)
    },
    {
      id: 'news-38',
      title: 'New Trading Algorithm Shows Promise',
      impact: 'positive',
      timestamp: new Date(Date.now() - 38 * 60 * 60 * 1000)
    },
    {
      id: 'news-39',
      title: 'Industry Conference Dates Announced',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 39 * 60 * 60 * 1000)
    },
    {
      id: 'news-40',
      title: 'Market Liquidity Concerns Emerge',
      impact: 'negative',
      timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000)
    },
    {
      id: 'news-41',
      title: 'Innovative Pricing Model Adopted',
      impact: 'positive',
      timestamp: new Date(Date.now() - 41 * 60 * 60 * 1000)
    },
    {
      id: 'news-42',
      title: 'Trading Volume Analysis Published',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 42 * 60 * 60 * 1000)
    },
    {
      id: 'news-43',
      title: 'System Upgrade Causes Trading Delays',
      impact: 'negative',
      timestamp: new Date(Date.now() - 43 * 60 * 60 * 1000)
    },
    {
      id: 'news-44',
      title: 'Strategic Partnership Announcement',
      impact: 'positive',
      timestamp: new Date(Date.now() - 44 * 60 * 60 * 1000)
    },
    {
      id: 'news-45',
      title: 'Market Structure Review Underway',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 45 * 60 * 60 * 1000)
    }
  ];

  return mockNews.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const MOCK_NEWS = generateMockNews();

export function useNewsData() {
  const [data, setData] = useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // In development, use mock data
        if (process.env.NODE_ENV === 'development') {
          setData(MOCK_NEWS);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const newsData = await response.json();
        setData(newsData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch news'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { data, isLoading, error };
}