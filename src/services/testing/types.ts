export interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
  metrics: PerformanceMetrics;
  timestamp: Date;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  resourceUtilization: {
    cpu: number;
    memory: number;
    network: number;
  };
}

export interface LoadTestConfig {
  duration: number;
  rampUpTime: number;
  targetRPS: number;
  scenarios: string[];
  userBehaviors: string[];
}

export interface TestScenario {
  name: string;
  setup: () => Promise<void>;
  execute: () => Promise<void>;
  cleanup: () => Promise<void>;
  validate: () => Promise<boolean>;
}

export interface TestReport {
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    duration: number;
  };
  results: TestResult[];
  recommendations: string[];
  timestamp: Date;
}