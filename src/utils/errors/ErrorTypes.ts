import { ErrorLevel } from './types';

export class BaseError extends Error {
  public readonly level: ErrorLevel;
  public readonly timestamp: Date;
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    level: ErrorLevel = 'error',
    code: string = 'UNKNOWN_ERROR',
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.level = level;
    this.timestamp = new Date();
    this.code = code;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConfigurationError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'error', 'CONFIGURATION_ERROR', context);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'warning', 'VALIDATION_ERROR', context);
  }
}

export class NetworkError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'error', 'NETWORK_ERROR', context);
  }
}

export class MarketError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'error', 'MARKET_ERROR', context);
  }
}

export class TradingError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'error', 'TRADING_ERROR', context);
  }
}

export class DataError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'error', 'DATA_ERROR', context);
  }
}

export class RateLimitError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'warning', 'RATE_LIMIT_ERROR', context);
  }
}