'use client';

import { ErrorLogger } from './ErrorLogger';
import { BaseError } from './ErrorTypes';
import type { ErrorContext } from './types';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private logger: ErrorLogger;

  private constructor() {
    this.logger = ErrorLogger.getInstance();
    
    if (typeof window !== 'undefined') {
      this.setupGlobalHandlers();
    }
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalHandlers(): void {
    window.onerror = (message, source, lineno, colno, error) => {
      this.handleUnhandledError(error || new Error(String(message)), {
        source,
        lineNumber: lineno,
        columnNumber: colno
      });
    };

    window.onunhandledrejection = (event) => {
      this.handleUnhandledRejection(event.reason);
    };
  }

  public handleError(error: Error | BaseError, context?: ErrorContext): void {
    if (error instanceof BaseError) {
      this.logger.log(error.level, error, { ...error.context, ...context });
    } else {
      this.logger.error(error, context);
    }
  }

  private handleUnhandledError(error: Error, context?: Record<string, unknown>): void {
    this.logger.error(error, {
      ...context,
      unhandled: true,
      type: 'uncaught_error'
    });
  }

  private handleUnhandledRejection(reason: unknown): void {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    this.logger.error(error, {
      unhandled: true,
      type: 'unhandled_rejection'
    });
  }

  public async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: ErrorContext
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error instanceof Error ? error : new Error(String(error)), context);
      throw error;
    }
  }
}