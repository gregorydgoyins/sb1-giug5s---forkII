export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  duration: number;
  xp: number;
  progress: number;
  skills: string[];
  prerequisites: string[];
  resources: {
    videos: string[];
    documents: string[];
    exercises: string[];
  };
  chapters: CourseChapter[];
}

export interface CourseChapter {
  id: string;
  title: string;
  content: string;
  exercises: Exercise[];
  quiz: Quiz;
  completed: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'simulation' | 'challenge';
  difficulty: Difficulty;
  xpReward: number;
  completed: boolean;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
  attempts: number;
  bestScore?: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  icon: string;
}

export interface LearningProgress {
  currentLevel: number;
  currentXp: number;
  xpForCurrentLevel: number;
  xpRequiredForNextLevel: number;
  completedCourses: number;
  unlockedAchievements: number;
  nextMilestone: string;
}