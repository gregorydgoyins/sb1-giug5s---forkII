import { IsbndbClient } from './IsbndbClient';
import { ErrorHandler } from '../../utils/errors';
import type { CreatorBiography } from '../biography/types';

export class IsbndbTester {
  private static instance: IsbndbTester;
  private client: IsbndbClient;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.client = IsbndbClient.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public static getInstance(): IsbndbTester {
    if (!IsbndbTester.instance) {
      IsbndbTester.instance = new IsbndbTester();
    }
    return IsbndbTester.instance;
  }

  public async runTests(): Promise<{
    success: boolean;
    results: Array<{
      test: string;
      passed: boolean;
      error?: string;
      data?: unknown;
    }>;
  }> {
    const results = [];

    try {
      // Test 1: API Authentication
      results.push(await this.testAuthentication());

      // Test 2: Creator Biography Retrieval
      results.push(await this.testCreatorBiography());

      // Test 3: Book Search
      results.push(await this.testBookSearch());

      // Test 4: Error Handling
      results.push(await this.testErrorHandling());

      // Test 5: Rate Limiting
      results.push(await this.testRateLimiting());

      return {
        success: results.every(r => r.passed),
        results
      };
    } catch (error) {
      return {
        success: false,
        results: [
          {
            test: 'Test Suite',
            passed: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          }
        ]
      };
    }
  }

  private async testAuthentication(): Promise<{
    test: string;
    passed: boolean;
    error?: string;
  }> {
    try {
      // Test a simple API call to verify authentication
      const result = await this.client.searchBooks('test');
      return {
        test: 'API Authentication',
        passed: Array.isArray(result)
      };
    } catch (error) {
      return {
        test: 'API Authentication',
        passed: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  private async testCreatorBiography(): Promise<{
    test: string;
    passed: boolean;
    error?: string;
    data?: CreatorBiography;
  }> {
    try {
      const biography = await this.client.getCreatorBiography('Stan Lee');
      
      if (!biography) {
        return {
          test: 'Creator Biography Retrieval',
          passed: false,
          error: 'No biography data returned'
        };
      }

      // Validate biography data structure
      const isValid = this.validateBiographyData(biography);
      
      return {
        test: 'Creator Biography Retrieval',
        passed: isValid,
        data: biography
      };
    } catch (error) {
      return {
        test: 'Creator Biography Retrieval',
        passed: false,
        error: error instanceof Error ? error.message : 'Biography retrieval failed'
      };
    }
  }

  private async testBookSearch(): Promise<{
    test: string;
    passed: boolean;
    error?: string;
    data?: unknown;
  }> {
    try {
      const books = await this.client.searchBooks('Spider-Man');
      
      return {
        test: 'Book Search',
        passed: Array.isArray(books) && books.length > 0,
        data: { count: books.length }
      };
    } catch (error) {
      return {
        test: 'Book Search',
        passed: false,
        error: error instanceof Error ? error.message : 'Book search failed'
      };
    }
  }

  private async testErrorHandling(): Promise<{
    test: string;
    passed: boolean;
    error?: string;
  }> {
    try {
      // Test with invalid creator name
      const result = await this.client.getCreatorBiography('ThisCreatorDoesNotExist12345');
      
      return {
        test: 'Error Handling',
        passed: result === null,
        error: result ? 'Expected null for invalid creator' : undefined
      };
    } catch (error) {
      return {
        test: 'Error Handling',
        passed: true // Error was caught as expected
      };
    }
  }

  private async testRateLimiting(): Promise<{
    test: string;
    passed: boolean;
    error?: string;
  }> {
    try {
      // Make multiple rapid requests to test rate limiting
      const promises = Array(5).fill(null).map(() => 
        this.client.searchBooks('test')
      );
      
      await Promise.all(promises);
      
      return {
        test: 'Rate Limiting',
        passed: true
      };
    } catch (error) {
      return {
        test: 'Rate Limiting',
        passed: false,
        error: error instanceof Error ? error.message : 'Rate limiting test failed'
      };
    }
  }

  private validateBiographyData(biography: CreatorBiography): boolean {
    return (
      typeof biography.name === 'string' &&
      typeof biography.biography === 'string' &&
      Array.isArray(biography.notableWorks) &&
      Array.isArray(biography.awards) &&
      Array.isArray(biography.links) &&
      biography.lastUpdated instanceof Date
    );
  }

  public async generateTestReport(): Promise<string> {
    const { success, results } = await this.runTests();
    
    let report = '# ISBNdb API Test Report\n\n';
    report += `Test Suite Status: ${success ? '✅ PASSED' : '❌ FAILED'}\n\n`;
    
    results.forEach(result => {
      report += `## ${result.test}\n`;
      report += `Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
      
      if (result.error) {
        report += `Error: ${result.error}\n`;
      }
      
      if (result.data) {
        report += `Data: ${JSON.stringify(result.data, null, 2)}\n`;
      }
      
      report += '\n';
    });
    
    return report;
  }
}