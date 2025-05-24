export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: Date;
  error?: string;
}

export interface BackupConfig {
  location: string;
  retention: number;
  schedule: string;
  compress: boolean;
}

export interface MaintenanceWindow {
  start: Date;
  end: Date;
  reason: string;
  services: string[];
}

export interface ServiceMetrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastUpdated: Date;
}