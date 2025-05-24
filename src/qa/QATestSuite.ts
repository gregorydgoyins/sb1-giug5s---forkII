import { ErrorHandler } from '../utils/errors';
import { TestRunner } from './TestRunner';
import { ReportGenerator } from './ReportGenerator';
import { TestDataManager } from './TestDataManager';
import type { TestPlan, TestResult, TestReport } from './types';

export class QATestSuite {
  private static instance: QATestSuite;
  private errorHandler: ErrorHandler;
  private testRunner: TestRunner;
  private reportGenerator: ReportGenerator;
  private testDataManager: TestDataManager;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.testRunner = new TestRunner();
    this.reportGenerator = new ReportGenerator();
    this.testDataManager = new TestDataManager();
  }

  public static getInstance(): QATestSuite {
    if (!QATestSuite.instance) {
      QATestSuite.instance = new QATestSuite();
    }
    return QATestSuite.instance;
  }

  public async executeTestPlan(): Promise<TestReport> {
    return this.errorHandler.withErrorHandling(async () => {
      // Initialize test data
      await this.testDataManager.initializeTestData();

      // Execute test plan
      const results = await this.testRunner.runTests();

      // Generate report
      const report = await this.reportGenerator.generateReport(results);

      // Archive results
      await this.archiveResults(results, report);

      return report;
    }, {
      context: 'QATestSuite',
      operation: 'executeTestPlan'
    });
  }

  private async archiveResults(results: TestResult[], report: TestReport): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `/QA_Reports/Panel_Profits/comprehensive_log/${timestamp}`;

    await this.testDataManager.archiveData(path, {
      results,
      report,
      metadata: {
        timestamp,
        version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
        environment: process.env.NODE_ENV
      }
    });
  }
}