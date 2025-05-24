export interface LearningModule {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  topics: string[];
  triggers: ModuleTrigger[];
  dependencies: string[];
  order: number;
  completed?: boolean;
  progress?: number;
}

export interface ModuleTrigger {
  type: 'event' | 'threshold' | 'action' | 'schedule';
  condition: string;
  priority: number;
}

export interface ModuleProgress {
  userId: string;
  moduleId: string;
  completed: boolean;
  progress: number;
  startDate: Date;
  lastAccessed: Date;
  completionDate?: Date;
  assessmentScores?: Record<string, number>;
}

export interface LearningPath {
  modules: string[];
  currentModule: string;
  progress: number;
  prerequisites: Record<string, boolean>;
}

export interface ModuleRecommendation {
  moduleId: string;
  relevance: number;
  reason: string;
  prerequisites: string[];
}