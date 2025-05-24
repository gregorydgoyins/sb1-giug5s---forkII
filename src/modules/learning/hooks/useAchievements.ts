import { useQuery, useMutation } from '@tanstack/react-query';
import type { Achievement } from '../types';

export function useAchievements() {
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: async (): Promise<Achievement[]> => {
      const response = await fetch('/api/achievements');
      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }
      return response.json();
    }
  });

  const { mutate: unlockAchievement } = useMutation({
    mutationFn: async (achievementId: string) => {
      const response = await fetch(`/api/achievements/${achievementId}/unlock`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to unlock achievement');
      }
      return response.json();
    }
  });

  return { achievements, unlockAchievement };
}