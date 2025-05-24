import { ErrorHandler } from '../../utils/errors';
import type { CreatorBiography, BiographyValidationResult } from './types';

export class BiographyValidator {
  private static instance: BiographyValidator;
  private errorHandler: ErrorHandler;
  private readonly API_KEY = '57315_ed95014cfba5df379b56a019ba3c752c';
  private readonly API_BASE = 'https://api2.isbndb.com';

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  public static getInstance(): BiographyValidator {
    if (!BiographyValidator.instance) {
      BiographyValidator.instance = new BiographyValidator();
    }
    return BiographyValidator.instance;
  }

  public async validateCreatorBiographies(): Promise<BiographyValidationResult> {
    return this.errorHandler.withErrorHandling(async () => {
      const result: BiographyValidationResult = {
        validLinks: [],
        brokenLinks: [],
        missingBiographies: [],
        updatedContent: new Map(),
        timestamp: new Date()
      };

      const creators = await this.getCreatorList();
      
      for (const creator of creators) {
        const biographyUrl = `/creators/${creator.id}/biography`;
        const isValid = await this.validateBiographyUrl(biographyUrl);

        if (isValid) {
          result.validLinks.push({
            creatorId: creator.id,
            creatorName: creator.name,
            url: biographyUrl
          });
        } else {
          result.brokenLinks.push({
            creatorId: creator.id,
            creatorName: creator.name,
            url: biographyUrl
          });

          // Fetch biography data from ISBNdb
          const biographyData = await this.fetchCreatorBiography(creator.name);
          if (biographyData) {
            result.updatedContent.set(creator.id, biographyData);
          } else {
            result.missingBiographies.push({
              creatorId: creator.id,
              creatorName: creator.name
            });
          }
        }
      }

      return result;
    }, {
      context: 'BiographyValidator',
      operation: 'validateCreatorBiographies'
    });
  }

  private async validateBiographyUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }

  private async fetchCreatorBiography(creatorName: string): Promise<CreatorBiography | null> {
    try {
      const response = await fetch(`${this.API_BASE}/authors/${encodeURIComponent(creatorName)}`, {
        headers: {
          'Authorization': this.API_KEY
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        name: data.name,
        biography: data.bio || '',
        birthDate: data.born,
        deathDate: data.died,
        nationality: data.nationality,
        notableWorks: data.books || [],
        awards: data.awards || [],
        links: data.links || [],
        lastUpdated: new Date()
      };
    } catch {
      return null;
    }
  }

  private async getCreatorList(): Promise<Array<{ id: string; name: string }>> {
    // Mock creator list - in production, this would fetch from your database
    return [
      { id: 'TMFS', name: 'Todd McFarlane' },
      { id: 'SLES', name: 'Stan Lee' },
      { id: 'JLES', name: 'Jim Lee' },
      { id: 'DCTS', name: 'Donny Cates' },
      { id: 'ARTS', name: 'Stanley Artgerm Lau' }
    ];
  }
}