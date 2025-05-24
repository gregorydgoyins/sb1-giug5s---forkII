import { SystemMonitor } from './SystemMonitor';
import { ErrorHandler } from '../../utils/errors';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function analyzeSystem() {
  const errorHandler = ErrorHandler.getInstance();

  try {
    console.log('Starting system analysis...');
    const monitor = SystemMonitor.getInstance();

    // Generate report for last 24 hours
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    await monitor.generateReport({
      start: yesterday,
      end: now
    });

    console.log('System analysis completed successfully');
  } catch (error) {
    errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
      context: 'analyze',
      operation: 'analyzeSystem'
    });
  }
}

analyzeSystem();