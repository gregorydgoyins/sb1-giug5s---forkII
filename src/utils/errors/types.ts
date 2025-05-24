export type ErrorLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  url?: string;
  method?: string;
  params?: Record<string, unknown>;
  timestamp: string;
  environment: string;
  version: string;
}

export interface ErrorLog {
  level: ErrorLevel;
  message: string;
  code: string;
  stack?: string;
  context?: ErrorContext;
  timestamp: string;
}

export interface ErrorStats {
  byType: Record<string, number>;
  byTime: {
    lastHour: number;
    lastDay: number;
    lastWeek: number;
  };
  severity: Record<ErrorLevel, number>;
}

export interface ErrorReport {
  timestamp: Date;
  totalErrors: number;
  stats: ErrorStats;
  topErrors: Array<{
    name: string;
    count: number;
    example: string;
  }>;
  recentErrors: Error[];
  recommendations: string[];
}

export interface LoggerConfig {
  level: ErrorLevel;
  enableConsole?: boolean;
  enableFile?: boolean;
  filePath?: string;
  rotationInterval?: string;
  maxFiles?: number;
  maxSize?: string;
}