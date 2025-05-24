import { DatabaseService } from '../database/DatabaseService';
import { ErrorHandler } from '../../utils/errors';
import { RateLimiter } from '../../utils/security/RateLimiter';
import type { Character, Creator, Publisher, Team, StoryArc } from './types';

export class UniverseDataService {
  private static instance: UniverseDataService;
  private db: DatabaseService;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
  }

  public static getInstance(): UniverseDataService {
    if (!UniverseDataService.instance) {
      UniverseDataService.instance = new UniverseDataService();
    }
    return UniverseDataService.instance;
  }

  public async getCharacter(id: string): Promise<Character> {
    return this.errorHandler.withErrorHandling(async () => {
      const result = await this.db.query(
        `SELECT c.*, 
                array_agg(DISTINCT p.name) as powers,
                array_agg(DISTINCT t.name) as teams
         FROM characters c
         LEFT JOIN character_powers cp ON c.id = cp.character_id
         LEFT JOIN powers p ON cp.power_id = p.id
         LEFT JOIN team_members tm ON c.id = tm.character_id
         LEFT JOIN teams t ON tm.team_id = t.id
         WHERE c.id = $1
         GROUP BY c.id`,
        [id]
      );

      if (!result.rows[0]) {
        throw new Error(`Character not found: ${id}`);
      }

      return result.rows[0];
    }, {
      context: 'UniverseDataService',
      operation: 'getCharacter',
      characterId: id
    });
  }

  public async getCreator(id: string): Promise<Creator> {
    return this.errorHandler.withErrorHandling(async () => {
      const result = await this.db.query(
        `SELECT c.*, 
                array_agg(DISTINCT cw.*) as works
         FROM creators c
         LEFT JOIN creator_works cw ON c.id = cw.creator_id
         WHERE c.id = $1
         GROUP BY c.id`,
        [id]
      );

      if (!result.rows[0]) {
        throw new Error(`Creator not found: ${id}`);
      }

      return result.rows[0];
    }, {
      context: 'UniverseDataService',
      operation: 'getCreator',
      creatorId: id
    });
  }

  public async getPublisher(id: string): Promise<Publisher> {
    return this.errorHandler.withErrorHandling(async () => {
      const result = await this.db.query(
        `SELECT p.*,
                COUNT(DISTINCT c.id) as character_count,
                COUNT(DISTINCT t.id) as team_count,
                COUNT(DISTINCT sa.id) as story_arc_count
         FROM publishers p
         LEFT JOIN characters c ON p.id = c.publisher_id
         LEFT JOIN teams t ON p.id = t.publisher_id
         LEFT JOIN story_arcs sa ON p.id = sa.publisher_id
         WHERE p.id = $1
         GROUP BY p.id`,
        [id]
      );

      if (!result.rows[0]) {
        throw new Error(`Publisher not found: ${id}`);
      }

      return result.rows[0];
    }, {
      context: 'UniverseDataService',
      operation: 'getPublisher',
      publisherId: id
    });
  }

  public async searchCharacters(params: {
    name?: string;
    publisher?: string;
    team?: string;
    powers?: string[];
    limit?: number;
    offset?: number;
  }): Promise<Character[]> {
    return this.errorHandler.withErrorHandling(async () => {
      let query = `
        SELECT DISTINCT c.*
        FROM characters c
        LEFT JOIN character_powers cp ON c.id = cp.character_id
        LEFT JOIN powers p ON cp.power_id = p.id
        LEFT JOIN team_members tm ON c.id = tm.character_id
        LEFT JOIN teams t ON tm.team_id = t.id
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramCount = 1;

      if (params.name) {
        query += ` AND c.name ILIKE $${paramCount}`;
        params.push(`%${params.name}%`);
        paramCount++;
      }

      if (params.publisher) {
        query += ` AND c.publisher_id = $${paramCount}`;
        params.push(params.publisher);
        paramCount++;
      }

      if (params.team) {
        query += ` AND t.name ILIKE $${paramCount}`;
        params.push(`%${params.team}%`);
        paramCount++;
      }

      if (params.powers?.length) {
        query += ` AND p.name = ANY($${paramCount})`;
        params.push(params.powers);
        paramCount++;
      }

      query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(params.limit || 20, params.offset || 0);

      const result = await this.db.query(query, params);
      return result.rows;
    }, {
      context: 'UniverseDataService',
      operation: 'searchCharacters',
      params
    });
  }

  public async getCharacterValuation(characterId: string): Promise<{
    currentValue: number;
    historicalValues: Array<{
      date: Date;
      value: number;
    }>;
  }> {
    return this.errorHandler.withErrorHandling(async () => {
      const result = await this.db.query(
        `SELECT valuation_date, market_value
         FROM character_valuations
         WHERE character_id = $1
         ORDER BY valuation_date DESC`,
        [characterId]
      );

      return {
        currentValue: result.rows[0]?.market_value || 0,
        historicalValues: result.rows.map(row => ({
          date: row.valuation_date,
          value: row.market_value
        }))
      };
    }, {
      context: 'UniverseDataService',
      operation: 'getCharacterValuation',
      characterId
    });
  }
}