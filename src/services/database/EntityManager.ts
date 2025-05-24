import { ErrorHandler, DataError } from '../../utils/errors';
import type { 
  FinancialEntity, 
  AssetRelationship, 
  HistoricalRecord,
  Personnel,
  DigitalAsset,
  Version,
  MarketData,
  EntityGrade,
  EntityMetrics 
} from './types';

export class EntityManager {
  private entities: Map<string, FinancialEntity>;
  private relationships: Map<string, AssetRelationship[]>;
  private history: Map<string, HistoricalRecord[]>;
  private personnel: Map<string, Personnel>;
  private assets: Map<string, DigitalAsset[]>;
  private versions: Map<string, Version[]>;
  private marketData: Map<string, MarketData[]>;
  private grades: Map<string, EntityGrade[]>;
  private metrics: Map<string, EntityMetrics[]>;
  private errorHandler: ErrorHandler;

  constructor() {
    this.entities = new Map();
    this.relationships = new Map();
    this.history = new Map();
    this.personnel = new Map();
    this.assets = new Map();
    this.versions = new Map();
    this.marketData = new Map();
    this.grades = new Map();
    this.metrics = new Map();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public async createEntity(entity: Omit<FinancialEntity, 'id'>): Promise<string> {
    return this.errorHandler.withErrorHandling(async () => {
      const id = crypto.randomUUID();
      const newEntity: FinancialEntity = {
        ...entity,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.entities.set(id, newEntity);
      return id;
    }, {
      context: 'EntityManager',
      operation: 'createEntity'
    });
  }

  public async getEntity(id: string): Promise<FinancialEntity | null> {
    return this.errorHandler.withErrorHandling(async () => {
      const entity = this.entities.get(id);
      if (!entity) {
        throw new DataError(`Entity not found: ${id}`);
      }
      return entity;
    }, {
      context: 'EntityManager',
      operation: 'getEntity',
      entityId: id
    });
  }

  // ... rest of the class implementation remains the same
}