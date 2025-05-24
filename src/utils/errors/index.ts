import { ErrorHandler } from './ErrorHandler';
import { ErrorLogger } from './ErrorLogger';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorMonitor } from './ErrorMonitor';
import { ErrorReporter } from './ErrorReporter';
import { 
  BaseError,
  ConfigurationError,
  ValidationError,
  NetworkError,
  MarketError,
  TradingError,
  DataError,
  RateLimitError
} from './ErrorTypes';
import type { 
  ErrorLevel, 
  ErrorContext, 
  ErrorLog, 
  LoggerConfig,
  ErrorStats,
  ErrorReport 
} from './types';

// Initialize singleton instances
const errorLogger = ErrorLogger.getInstance({
  level: 'info',
  enableConsole: true
});

const errorHandler = ErrorHandler.getInstance();
const errorMonitor = ErrorMonitor.getInstance();
const errorReporter = ErrorReporter.getInstance();

// Export all error-related utilities
export {
  ErrorHandler,
  ErrorLogger,
  ErrorBoundary,
  ErrorMonitor,
  ErrorReporter,
  BaseError,
  ConfigurationError,
  ValidationError,
  NetworkError,
  MarketError,
  TradingError,
  DataError,
  RateLimitError
};

// Export types
export type {
  ErrorLevel,
  ErrorContext,
  ErrorLog,
  LoggerConfig,
  ErrorStats,
  ErrorReport
};

// Export convenience functions
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: ErrorContext
): Promise<T> => {
  return errorHandler.withErrorHandling(operation, context);
};

export const logError = (error: Error | string, context?: Record<string, unknown>): void => {
  errorLogger.error(error, context);
};

export const logWarning = (message: string, context?: Record<string, unknown>): void => {
  errorLogger.warn(message, context);
};

export const logInfo = (message: string, context?: Record<string, unknown>): void => {
  errorLogger.info(message, context);
};

export const trackError = (error: Error, context?: Record<string, unknown>): void => {
  errorMonitor.trackError(error, context);
};

export const generateErrorReport = (): ErrorReport => {
  return errorReporter.generateReport();
};