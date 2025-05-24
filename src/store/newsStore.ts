import { create } from 'zustand';

interface NewsItem {
  id: string;
  title: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
}

interface NewsStore {
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
  setNews: (news: NewsItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNewsStore = create<NewsStore>((set) => ({
  news: [],
  isLoading: false,
  error: null,
  setNews: (news) => set({ news }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));