import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { IS_PRODUCTION, RATE_LIMITS } from './utils/env';
import { RateLimiter } from './utils/security/RateLimiter';

const rateLimiter = RateLimiter.getInstance();

export async function middleware(request: NextRequest) {
  // Enforce HTTPS in production
  if (IS_PRODUCTION && !request.url.startsWith('https://')) {
    return NextResponse.redirect(
      `https://${request.nextUrl.host}${request.nextUrl.pathname}`,
      301
    );
  }

  // Create response with enhanced security headers
  const response = NextResponse.next();
  
  // Security headers
  const securityHeaders = {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': [
      "default-src 'self'",
      "img-src 'self' https://images.unsplash.com data: blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' https://api.panelprofits.com wss://api.panelprofits.com",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // API request handling
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      // Rate limiting
      const clientId = request.ip || 'anonymous';
      await rateLimiter.consume(
        'api',
        RATE_LIMITS.api.points,
        clientId
      );

      // Validate origin for API requests
      const origin = request.headers.get('origin');
      if (IS_PRODUCTION && origin && !origin.endsWith('panelprofits.com')) {
        return new NextResponse(null, { status: 403 });
      }

    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};