import { useQuery, useMutation } from '@tanstack/react-query';
import type { LearningProgress } from '../types';

export function useLearningProgress() {
  const { data: progress = defaultProgress } = useQuery({
    queryKey: ['learning-progress'],
    queryFn: async (): Promise<LearningProgress> => {
      const response = await fetch('/api/learning/progress');
      if (!response.ok) {
        throw new Error('Failed to fetch learning progress');
      }
      return response.json();
    }
  });

  const { mutate: updateProgress } = useMutation({
    mutationFn: async (newProgress: Partial<LearningProgress>) => {
      const response = await fetch('/api/learning/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgress)
      });
      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      return response.json();
    }
  });

  return { progress, updateProgress };
}

const defaultProgress: LearningProgress = {
  currentLevel: 1,
  currentXp: 0,
  xpForCurrentLevel: 0,
  xpRequiredForNextLevel: 1000,
  completedCourses: 0,
  unlockedAchievements: 0,
  nextMilestone: 'Complete your first course'
};