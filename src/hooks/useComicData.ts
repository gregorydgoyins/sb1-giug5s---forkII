import { useQuery } from '@tanstack/react-query';
import { MetronDataService } from '../services/metron/MetronDataService';

const metronService = new MetronDataService();

export function useComicSearch(params: {
  series?: string;
  issueNumber?: string;
  publicationDate?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['comics', params],
    queryFn: () => metronService.searchComics(params),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    cacheTime: 30 * 60 * 1000 // Keep in cache for 30 minutes
  });
}

export function useSeries(id: string) {
  return useQuery({
    queryKey: ['series', id],
    queryFn: () => metronService.getSeries(id),
    staleTime: 60 * 60 * 1000 // Series data stays fresh for 1 hour
  });
}

export function usePublisher(id: string) {
  return useQuery({
    queryKey: ['publisher', id],
    queryFn: () => metronService.getPublisher(id),
    staleTime: 24 * 60 * 60 * 1000 // Publisher data stays fresh for 24 hours
  });
}