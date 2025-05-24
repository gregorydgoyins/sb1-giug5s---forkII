```typescript
import { EntityManager } from '../database/EntityManager';
import { ErrorHandler } from '../../utils/errors';
import type { IssueSynopsis, Character, StoryBeat, ContinuityLink } from './types';

export class SynopsisManager {
  private static instance: SynopsisManager;
  private entityManager: EntityManager;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.entityManager = new EntityManager();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public static getInstance(): SynopsisManager {
    if (!SynopsisManager.instance) {
      SynopsisManager.instance = new SynopsisManager();
    }
    return SynopsisManager.instance;
  }

  public async createSynopsis(issueId: string, synopsis: Omit<IssueSynopsis, 'id'>): Promise<string> {
    return this.errorHandler.withErrorHandling(async () => {
      const id = await this.entityManager.addHistoricalRecord({
        entityId: issueId,
        type: 'synopsis',
        timestamp: new Date(),
        data: synopsis,
        source: 'SynopsisManager',
        confidence: 1
      });

      await this.updateContinuityLinks(issueId, synopsis.continuityLinks);
      await this.updateCharacterRoster(issueId, synopsis.characters);

      return id;
    }, {
      context: 'SynopsisManager',
      operation: 'createSynopsis',
      issueId
    });
  }

  private async updateContinuityLinks(issueId: string, links: ContinuityLink[]): Promise<void> {
    for (const link of links) {
      await this.entityManager.addRelationship({
        sourceId: issueId,
        targetId: link.issueId,
        type: link.type,
        strength: link.significance,
        metadata: {
          description: link.description,
          impact: link.impact
        },
        validFrom: new Date()
      });
    }
  }

  private async updateCharacterRoster(issueId: string, characters: Character[]): Promise<void> {
    for (const character of characters) {
      await this.entityManager.addHistoricalRecord({
        entityId: character.id,
        type: 'appearance',
        timestamp: new Date(),
        data: {
          issueId,
          role: character.role,
          significance: character.significance,
          developments: character.developments
        },
        source: 'SynopsisManager',
        confidence: 1
      });
    }
  }

  public async getSynopsis(issueId: string): Promise<IssueSynopsis | null> {
    return this.errorHandler.withErrorHandling(async () => {
      const records = await this.entityManager.getHistory(issueId, 'synopsis');
      if (!records.length) return null;

      const latest = records[records.length - 1];
      return latest.data as IssueSynopsis;
    }, {
      context: 'SynopsisManager',
      operation: 'getSynopsis',
      issueId
    });
  }
}
```