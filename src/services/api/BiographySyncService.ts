import { IsbndbClient } from './IsbndbClient';
import { MarvelApiClient } from './MarvelApiClient';
import { EntityManager } from '../database/EntityManager';
import { ErrorHandler } from '../../utils/errors';
import type { CreatorBiography } from '../biography/types';

export class BiographySyncService {
  private static instance: BiographySyncService;
  private isbndbClient: IsbndbClient;
  private marvelClient: MarvelApiClient;
  private entityManager: EntityManager;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.isbndbClient = IsbndbClient.getInstance();
    this.marvelClient = MarvelApiClient.getInstance();
    this.entityManager = new EntityManager();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public static getInstance(): BiographySyncService {
    if (!BiographySyncService.instance) {
      BiographySyncService.instance = new BiographySyncService();
    }
    return BiographySyncService.instance;
  }

  public async syncBiographies(): Promise<{
    updated: string[];
    failed: string[];
    skipped: string[];
  }> {
    return this.errorHandler.withErrorHandling(async () => {
      const result = {
        updated: [] as string[],
        failed: [] as string[],
        skipped: [] as string[]
      };

      const entities = await this.entityManager.queryEntities({ type: 'creator' });

      for (const entity of entities) {
        try {
          // Check if biography needs updating
          const currentBio = await this.entityManager.getHistory(entity.id, 'biography');
          const needsUpdate = this.needsBiographyUpdate(currentBio);

          if (!needsUpdate) {
            result.skipped.push(entity.id);
            continue;
          }

          // Fetch biography from ISBNdb
          const isbnBio = await this.isbndbClient.getCreatorBiography(entity.name);
          
          // Fetch additional data from Marvel API
          const marvelData = await this.marvelClient.getCreator(entity.code);

          if (isbnBio || marvelData) {
            const mergedBio = this.mergeBiographyData(isbnBio, marvelData);
            await this.updateBiography(entity.id, mergedBio);
            result.updated.push(entity.id);
          } else {
            result.failed.push(entity.id);
          }
        } catch (error) {
          result.failed.push(entity.id);
          this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
            context: 'BiographySyncService',
            entityId: entity.id
          });
        }
      }

      return result;
    }, {
      context: 'BiographySyncService',
      operation: 'syncBiographies'
    });
  }

  private needsBiographyUpdate(currentBio: any[]): boolean {
    if (!currentBio || currentBio.length === 0) return true;
    
    const lastUpdate = new Date(currentBio[currentBio.length - 1].timestamp);
    const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceUpdate > 7; // Update if more than 7 days old
  }

  private mergeBiographyData(
    isbnBio: CreatorBiography | null,
    marvelData: any
  ): CreatorBiography {
    return {
      name: isbnBio?.name || marvelData?.fullName || '',
      biography: isbnBio?.biography || marvelData?.description || '',
      birthDate: isbnBio?.birthDate,
      deathDate: isbnBio?.deathDate,
      nationality: isbnBio?.nationality,
      notableWorks: [
        ...(isbnBio?.notableWorks || []),
        ...(marvelData?.comics?.items?.map((c: any) => c.name) || [])
      ],
      awards: isbnBio?.awards || [],
      links: [
        ...(isbnBio?.links || []),
        ...(marvelData?.urls?.map((u: any) => u.url) || [])
      ],
      lastUpdated: new Date()
    };
  }

  private async updateBiography(entityId: string, biography: CreatorBiography): Promise<void> {
    await this.entityManager.addHistoricalRecord({
      entityId,
      type: 'biography',
      timestamp: new Date(),
      data: biography,
      source: 'BiographySyncService',
      confidence: 0.9
    });
  }
}