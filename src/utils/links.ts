import { SITE_URL } from './env';

export const getInternalUrl = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  try {
    // Validate and construct URL
    return new URL(normalizedPath, SITE_URL).toString();
  } catch {
    console.error(`Invalid URL path: ${path}`);
    return SITE_URL;
  }
};

export const getEntityUrl = (type: string, symbol: string): string => {
  // Sanitize inputs
  const safeType = encodeURIComponent(type.toLowerCase());
  const safeSymbol = encodeURIComponent(symbol.toUpperCase());
  return getInternalUrl(`/${safeType}/${safeSymbol}`);
};

export const getCreatorUrl = (symbol: string): string => {
  return getEntityUrl('creator', symbol);
};

export const getFundUrl = (symbol: string): string => {
  return getEntityUrl('fund', symbol);
};

export const getBondUrl = (symbol: string): string => {
  return getEntityUrl('bond', symbol);
};

export const getOptionChainUrl = (symbol: string): string => {
  return getEntityUrl('options', symbol);
};

export const navigateToEntity = (
  navigate: (path: string) => void,
  type: string,
  symbol: string
): void => {
  const url = getEntityUrl(type, symbol);
  navigate(new URL(url).pathname);
};

export const validateUrl = async (url: string): Promise<boolean> => {
  try {
    const parsedUrl = new URL(url);
    // Only allow specific domains
    if (!parsedUrl.hostname.endsWith('panelprofits.com') && 
        !parsedUrl.hostname.includes('localhost')) {
      return false;
    }
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
    return response.ok;
  } catch {
    return false;
  }
};