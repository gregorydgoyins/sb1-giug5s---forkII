import { ErrorHandler } from '../../utils/errors';
import { LEARNING_MODULES } from './config';
import type { 
  LearningModule, 
  ModuleProgress, 
  LearningPath,
  ModuleRecommendation 
} from './types';

export class LearningManager {
  private static instance: LearningManager;
  private errorHandler: ErrorHandler;
  private userProgress: Map<string, Map<string, ModuleProgress>>;
  private activeModules: Map<string, LearningModule>;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.userProgress = new Map();
    this.activeModules = new Map(
      LEARNING_MODULES.map(module => [module.id, module])
    );
  }

  public static getInstance(): LearningManager {
    if (!LearningManager.instance) {
      LearningManager.instance = new LearningManager();
    }
    return LearningManager.instance;
  }

  public async checkTriggers(
    userId: string,
    event: string,
    context: Record<string, any>
  ): Promise<LearningModule[]> {
    return this.errorHandler.withErrorHandling(async () => {
      const triggeredModules: LearningModule[] = [];

      for (const module of this.activeModules.values()) {
        if (await this.shouldTriggerModule(module, event, context)) {
          triggeredModules.push(module);
        }
      }

      return triggeredModules.sort((a, b) => {
        const aPriority = Math.max(...a.triggers.map(t => t.priority));
        const bPriority = Math.max(...b.triggers.map(t => t.priority));
        return bPriority - aPriority;
      });
    }, {
      context: 'LearningManager',
      operation: 'checkTriggers',
      userId,
      event
    });
  }

  private async shouldTriggerModule(
    module: LearningModule,
    event: string,
    context: Record<string, any>
  ): Promise<boolean> {
    for (const trigger of module.triggers) {
      switch (trigger.type) {
        case 'event':
          if (event === trigger.condition) return true;
          break;
        case 'threshold':
          if (this.evaluateThreshold(trigger.condition, context)) return true;
          break;
        case 'action':
          if (this.evaluateAction(trigger.condition, context)) return true;
          break;
        case 'schedule':
          if (this.evaluateSchedule(trigger.condition)) return true;
          break;
      }
    }
    return false;
  }

  private evaluateThreshold(condition: string, context: Record<string, any>): boolean {
    // Evaluate threshold conditions like "portfolioValue > 100000"
    const [metric, operator, value] = condition.split(' ');
    const contextValue = context[metric];
    
    switch (operator) {
      case '>': return contextValue > Number(value);
      case '<': return contextValue < Number(value);
      case '>=': return contextValue >= Number(value);
      case '<=': return contextValue <= Number(value);
      case '==': return contextValue == value;
      default: return false;
    }
  }

  private evaluateAction(condition: string, context: Record<string, any>): boolean {
    // Evaluate user action conditions
    return context.action === condition;
  }

  private evaluateSchedule(condition: string): boolean {
    // Evaluate time-based conditions
    return false; // Implement scheduling logic
  }

  public getLearningPath(userId: string): LearningPath {
    const userModules = this.userProgress.get(userId) || new Map();
    const availableModules = Array.from(this.activeModules.values())
      .filter(module => this.arePrerequisitesMet(userId, module));

    return {
      modules: availableModules.map(m => m.id),
      currentModule: this.getCurrentModule(userId),
      progress: this.calculateOverallProgress(userId),
      prerequisites: this.getPrerequisiteStatus(userId)
    };
  }

  private arePrerequisitesMet(userId: string, module: LearningModule): boolean {
    const userModules = this.userProgress.get(userId) || new Map();
    return module.prerequisites.every(prereq => {
      const progress = userModules.get(prereq);
      return progress?.completed;
    });
  }

  private getCurrentModule(userId: string): string {
    const userModules = this.userProgress.get(userId) || new Map();
    const incomplete = Array.from(this.activeModules.values())
      .filter(module => !userModules.get(module.id)?.completed)
      .sort((a, b) => a.order - b.order);
    
    return incomplete[0]?.id || '';
  }

  private calculateOverallProgress(userId: string): number {
    const userModules = this.userProgress.get(userId) || new Map();
    const totalModules = this.activeModules.size;
    const completedModules = Array.from(userModules.values())
      .filter(progress => progress.completed).length;

    return (completedModules / totalModules) * 100;
  }

  private getPrerequisiteStatus(userId: string): Record<string, boolean> {
    const userModules = this.userProgress.get(userId) || new Map();
    const status: Record<string, boolean> = {};

    for (const module of this.activeModules.values()) {
      status[module.id] = module.prerequisites.every(prereq => 
        userModules.get(prereq)?.completed
      );
    }

    return status;
  }

  public getRecommendedModules(userId: string): ModuleRecommendation[] {
    const userModules = this.userProgress.get(userId) || new Map();
    const recommendations: ModuleRecommendation[] = [];

    for (const module of this.activeModules.values()) {
      if (!userModules.get(module.id)?.completed) {
        const relevance = this.calculateModuleRelevance(module, userModules);
        if (relevance > 0) {
          recommendations.push({
            moduleId: module.id,
            relevance,
            reason: this.getRecommendationReason(module, userModules),
            prerequisites: module.prerequisites
          });
        }
      }
    }

    return recommendations.sort((a, b) => b.relevance - a.relevance);
  }

  private calculateModuleRelevance(
    module: LearningModule,
    userModules: Map<string, ModuleProgress>
  ): number {
    let relevance = 1;

    // Adjust based on prerequisites
    const prereqsCompleted = module.prerequisites.every(p => userModules.get(p)?.completed);
    if (!prereqsCompleted) relevance *= 0.5;

    // Adjust based on difficulty progression
    switch (module.difficulty) {
      case 'beginner':
        relevance *= 1.2;
        break;
      case 'intermediate':
        relevance *= 1.0;
        break;
      case 'advanced':
        relevance *= 0.8;
        break;
    }

    return relevance;
  }

  private getRecommendationReason(
    module: LearningModule,
    userModules: Map<string, ModuleProgress>
  ): string {
    if (module.prerequisites.length === 0) {
      return 'Recommended for beginners';
    }

    const completedPrereqs = module.prerequisites.filter(p => 
      userModules.get(p)?.completed
    );

    if (completedPrereqs.length === module.prerequisites.length) {
      return 'All prerequisites completed';
    }

    return `Complete ${module.prerequisites.length - completedPrereqs.length} more prerequisites`;
  }
}