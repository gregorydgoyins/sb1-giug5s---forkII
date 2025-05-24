import pino from 'pino';
import type { ErrorLevel, LoggerConfig, ErrorLog } from './types';

export class ErrorLogger {
  private static instance: ErrorLogger;
  private logger: pino.Logger;
  private config: LoggerConfig;

  private constructor(config: LoggerConfig) {
    this.config = config;
    this.logger = pino({
      level: config.level,
      browser: {
        asObject: true,
        write: {
          info: (o) => console.log(o),
          warn: (o) => console.warn(o),
          error: (o) => console.error(o),
          fatal: (o) => console.error(o),
          debug: (o) => console.debug(o)
        }
      }
    });
  }

  public static getInstance(config?: LoggerConfig): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger(config || {
        level: 'info',
        enableConsole: true
      });
    }
    return ErrorLogger.instance;
  }

  public log(level: ErrorLevel, error: Error | string, context?: Record<string, unknown>): void {
    const errorLog: ErrorLog = {
      level,
      message: error instanceof Error ? error.message : error,
      code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
      },
      timestamp: new Date().toISOString()
    };

    this.logger[level](errorLog);
  }

  public fatal(error: Error | string, context?: Record<string, unknown>): void {
    this.log('fatal', error, context);
  }

  public error(error: Error | string, context?: Record<string, unknown>): void {
    this.log('error', error, context);
  }

  public warn(error: Error | string, context?: Record<string, unknown>): void {
    this.log('warning', error, context);
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }
}