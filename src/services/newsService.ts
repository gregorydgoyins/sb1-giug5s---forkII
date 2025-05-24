import axios from 'axios';
import { useNewsStore } from '../store/newsStore';

// Expanded mock news data
const MOCK_NEWS = [
  {
    id: '1',
    title: 'Marvel Announces New Spider-Man Series',
    impact: 'positive',
    timestamp: new Date()
  },
  {
    id: '2',
    title: 'DC Comics Reports Record Sales',
    impact: 'positive',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: '3',
    title: 'Major Creator Signs Exclusive Contract',
    impact: 'neutral',
    timestamp: new Date(Date.now() - 7200000)
  },
  {
    id: '4',
    title: 'Image Comics Announces New Spawn Universe',
    impact: 'positive',
    timestamp: new Date(Date.now() - 10800000)
  },
  {
    id: '5',
    title: 'Comic Convention Dates Announced for 2024',
    impact: 'neutral',
    timestamp: new Date(Date.now() - 14400000)
  },
  {
    id: '6',
    title: 'Rare Golden Age Comic Discovered',
    impact: 'positive',
    timestamp: new Date(Date.now() - 18000000)
  },
  {
    id: '7',
    title: 'Digital Comics Platform Launches New Features',
    impact: 'positive',
    timestamp: new Date(Date.now() - 21600000)
  },
  {
    id: '8',
    title: 'Independent Publisher Reports Strong Growth',
    impact: 'positive',
    timestamp: new Date(Date.now() - 25200000)
  }
];

export const fetchComicNews = async () => {
  const store = useNewsStore.getState();
  store.setLoading(true);
  store.setError(null);

  try {
    // Use mock data in development to avoid API rate limits
    if (process.env.NODE_ENV === 'development') {
      // Rotate mock news by moving first item to end every 10 seconds
      const currentNews = [...MOCK_NEWS];
      setInterval(() => {
        const rotatedNews = [...currentNews];
        const firstItem = rotatedNews.shift();
        if (firstItem) {
          firstItem.timestamp = new Date(); // Update timestamp
          rotatedNews.push(firstItem);
          store.setNews(rotatedNews);
        }
      }, 10000);

      store.setNews(currentNews);
      return;
    }

    const response = await axios.get('/api/news');
    store.setNews(response.data);
  } catch (error) {
    store.setError('Failed to fetch news');
    console.error('News fetch error:', error);
  } finally {
    store.setLoading(false);
  }
};