export interface TestPlan {
  id: string;
  name: string;
  description: string;
  components: TestComponent[];
  schedule: TestSchedule;
  requirements: TestRequirement[];
}

export interface TestComponent {
  id: string;
  name: string;
  type: 'functional' | 'performance' | 'security' | 'compatibility';
  testCases: TestCase[];
  priority: 'high' | 'medium' | 'low';
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  steps: TestStep[];
  expectedResult: string;
  actualResult?: string;
  status: TestStatus;
  evidence?: TestEvidence[];
}

export interface TestStep {
  number: number;
  description: string;
  input?: unknown;
  expectedOutput?: unknown;
}

export interface TestEvidence {
  type: 'screenshot' | 'log' | 'metric';
  path: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface TestSchedule {
  startDate: Date;
  endDate: Date;
  milestones: TestMilestone[];
}

export interface TestMilestone {
  date: Date;
  description: string;
  deliverables: string[];
}

export interface TestRequirement {
  id: string;
  description: string;
  criteria: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface TestResult {
  testCase: TestCase;
  status: TestStatus;
  duration: number;
  error?: Error;
  metrics?: TestMetrics;
  timestamp: Date;
}

export interface TestMetrics {
  responseTime: number;
  resourceUsage: {
    cpu: number;
    memory: number;
    network: number;
  };
  coverage: number;
  errorRate: number;
}

export interface TestReport {
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    coverage: number;
    score: number;
  };
  results: TestResult[];
  metrics: TestMetrics;
  recommendations: string[];
  timestamp: Date;
  version: string;
}

export type TestStatus = 'passed' | 'failed' | 'skipped' | 'blocked' | 'inProgress';