import { DatabaseService } from '../database/DatabaseService';
import { ErrorHandler } from '../../utils/errors';
import type { MajorKeyIssue, MinorKeyIssue, KeyIssueValuation } from './types';

export class KeyIssueService {
  private static instance: KeyIssueService;
  private db: DatabaseService;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public static getInstance(): KeyIssueService {
    if (!KeyIssueService.instance) {
      KeyIssueService.instance = new KeyIssueService();
    }
    return KeyIssueService.instance;
  }

  public async addMajorKeyIssue(issue: Omit<MajorKeyIssue, 'id'>): Promise<string> {
    return this.errorHandler.withErrorHandling(async () => {
      const result = await this.db.query(
        `INSERT INTO major_key_issues (
          series_name, issue_number, publication_date, key_event,
          importance_rating, market_value, condition_grade, historical_significance
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`,
        [
          issue.seriesName,
          issue.issueNumber,
          issue.publicationDate,
          issue.keyEvent,
          issue.importanceRating,
          issue.marketValue,
          issue.conditionGrade,
          issue.historicalSignificance
        ]
      );

      return result.rows[0].id;
    }, {
      context: 'KeyIssueService',
      operation: 'addMajorKeyIssue'
    });
  }

  public async addMinorKeyIssue(issue: Omit<MinorKeyIssue, 'id'>): Promise<string> {
    return this.errorHandler.withErrorHandling(async () => {
      const result = await this.db.query(
        `INSERT INTO minor_key_issues (
          series_name, issue_number, publication_date, significance_notes,
          key_designation, market_value, condition_grade, collector_interest_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`,
        [
          issue.seriesName,
          issue.issueNumber,
          issue.publicationDate,
          issue.significanceNotes,
          issue.keyDesignation,
          issue.marketValue,
          issue.conditionGrade,
          issue.collectorInterestScore
        ]
      );

      return result.rows[0].id;
    }, {
      context: 'KeyIssueService',
      operation: 'addMinorKeyIssue'
    });
  }

  public async updateValuation(valuation: KeyIssueValuation): Promise<void> {
    await this.errorHandler.withErrorHandling(async () => {
      await this.db.query(
        `INSERT INTO key_issue_valuations (
          major_key_id, minor_key_id, valuation_date, price, source, notes
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          valuation.majorKeyId,
          valuation.minorKeyId,
          valuation.valuationDate,
          valuation.price,
          valuation.source,
          valuation.notes
        ]
      );

      // Update current market value in respective table
      if (valuation.majorKeyId) {
        await this.db.query(
          `UPDATE major_key_issues 
           SET market_value = $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [valuation.price, valuation.majorKeyId]
        );
      } else if (valuation.minorKeyId) {
        await this.db.query(
          `UPDATE minor_key_issues 
           SET market_value = $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [valuation.price, valuation.minorKeyId]
        );
      }
    }, {
      context: 'KeyIssueService',
      operation: 'updateValuation'
    });
  }

  public async searchKeyIssues(params: {
    seriesName?: string;
    issueNumber?: string;
    importanceRating?: string;
    keyDesignation?: string;
    minValue?: number;
    maxValue?: number;
    limit?: number;
    offset?: number;
  }): Promise<Array<MajorKeyIssue | MinorKeyIssue>> {
    return this.errorHandler.withErrorHandling(async () => {
      let query = `
        SELECT 
          'major' as type,
          m.* 
        FROM major_key_issues m
        WHERE 1=1
        UNION ALL
        SELECT 
          'minor' as type,
          n.* 
        FROM minor_key_issues n
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramCount = 1;

      if (params.seriesName) {
        query += ` AND series_name ILIKE $${paramCount}`;
        params.push(`%${params.seriesName}%`);
        paramCount++;
      }

      if (params.issueNumber) {
        query += ` AND issue_number = $${paramCount}`;
        params.push(params.issueNumber);
        paramCount++;
      }

      if (params.minValue) {
        query += ` AND market_value >= $${paramCount}`;
        params.push(params.minValue);
        paramCount++;
      }

      if (params.maxValue) {
        query += ` AND market_value <= $${paramCount}`;
        params.push(params.maxValue);
        paramCount++;
      }

      query += ` ORDER BY publication_date DESC
                 LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(params.limit || 20, params.offset || 0);

      const result = await this.db.query(query, params);
      return result.rows;
    }, {
      context: 'KeyIssueService',
      operation: 'searchKeyIssues',
      params
    });
  }

  public async getValuationHistory(id: string, type: 'major' | 'minor'): Promise<KeyIssueValuation[]> {
    return this.errorHandler.withErrorHandling(async () => {
      const result = await this.db.query(
        `SELECT * FROM key_issue_valuations
         WHERE ${type === 'major' ? 'major_key_id' : 'minor_key_id'} = $1
         ORDER BY valuation_date DESC`,
        [id]
      );
      return result.rows;
    }, {
      context: 'KeyIssueService',
      operation: 'getValuationHistory',
      issueId: id,
      type
    });
  }
}