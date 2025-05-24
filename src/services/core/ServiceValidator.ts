import { ErrorHandler, ValidationError } from '../../utils/errors';
import type { ServiceStatus } from './types';

export class ServiceValidator {
  private static instance: ServiceValidator;
  private errorHandler: ErrorHandler;
  private validationRules: Map<string, Array<(service: any) => boolean>>;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.validationRules = new Map();
  }

  public static getInstance(): ServiceValidator {
    if (!ServiceValidator.instance) {
      ServiceValidator.instance = new ServiceValidator();
    }
    return ServiceValidator.instance;
  }

  public addValidationRule(
    service: string,
    rule: (service: any) => boolean
  ): void {
    const rules = this.validationRules.get(service) || [];
    rules.push(rule);
    this.validationRules.set(service, rules);
  }

  public async validateService(
    name: string,
    service: any
  ): Promise<ServiceStatus> {
    return this.errorHandler.withErrorHandling(async () => {
      const rules = this.validationRules.get(name) || [];
      const validationResults = await Promise.all(
        rules.map(rule => this.executeRule(rule, service))
      );

      const isValid = validationResults.every(result => result);

      if (!isValid) {
        throw new ValidationError(`Service validation failed: ${name}`);
      }

      return {
        name,
        status: 'healthy',
        lastCheck: new Date()
      };
    }, {
      context: 'ServiceValidator',
      operation: 'validateService',
      service: name
    });
  }

  private async executeRule(
    rule: (service: any) => boolean,
    service: any
  ): Promise<boolean> {
    try {
      return await rule(service);
    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'ServiceValidator',
        operation: 'executeRule'
      });
      return false;
    }
  }

  public getValidationRules(service: string): Array<(service: any) => boolean> {
    return this.validationRules.get(service) || [];
  }
}