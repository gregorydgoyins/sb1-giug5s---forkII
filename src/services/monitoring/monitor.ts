import { PerformanceMonitor } from './PerformanceMonitor';
import { ErrorHandler } from '../../utils/errors';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function startMonitoring() {
  const errorHandler = ErrorHandler.getInstance();

  try {
    console.log('Starting performance monitoring...');
    const monitor = PerformanceMonitor.getInstance();

    // Generate initial report
    const now = new Date();
    const report = await monitor.generateReport({
      start: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
      end: now
    });

    console.log('Initial performance report:', report);
  } catch (error) {
    errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
      context: 'monitor',
      operation: 'startMonitoring'
    });
  }
}

startMonitoring();