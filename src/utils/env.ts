export const getEnvVar = (key: string, required: boolean = true): string | undefined => {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Base URLs with validation
export const API_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://api.panelprofits.com'
      : 'http://localhost:4040'
  );
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error(`Invalid API_URL: ${url}`);
  }
})();

export const SITE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_SITE_URL || (
    process.env.NODE_ENV === 'production'
      ? 'https://panelprofits.com'
      : 'http://localhost:4040'
  );
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error(`Invalid SITE_URL: ${url}`);
  }
})();

export const ENVIRONMENT = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = ENVIRONMENT === 'production';
export const IS_DEVELOPMENT = ENVIRONMENT === 'development';

// API configuration with secure defaults
export const API_CONFIG = {
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  }
} as const;

// Rate limiting configuration
export const RATE_LIMITS = {
  api: {
    points: 100,
    duration: 60 // 60 seconds
  },
  auth: {
    points: 5,
    duration: 60 // 60 seconds
  }
} as const;