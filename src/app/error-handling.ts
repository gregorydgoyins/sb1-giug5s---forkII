import { ErrorHandler } from '@/utils/errors';

export const handleApiError = (error: unknown) => {
  const errorHandler = ErrorHandler.getInstance();
  
  if (error instanceof Response) {
    return {
      message: 'API request failed',
      status: error.status,
      timestamp: new Date().toISOString()
    };
  }

  errorHandler.handleError(error instanceof Error ? error : new Error(String(error)));
  
  return {
    message: 'An unexpected error occurred',
    status: 500,
    timestamp: new Date().toISOString()
  };
};

export const validateApiResponse = <T>(data: T): boolean => {
  if (!data) return false;
  if (Array.isArray(data) && data.length === 0) return false;
  if (typeof data === 'object' && Object.keys(data).length === 0) return false;
  return true;
};