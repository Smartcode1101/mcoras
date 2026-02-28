import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { trackPageView } from '@/lib/analytics';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // For API routes, let them handle authentication
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.next();
    }

    // Check for Authorization header with JWT token
    const authHeader = request.headers.get('authorization');
    console.log('Middleware: Checking admin route:', request.nextUrl.pathname);
    console.log('Middleware: Authorization header present:', !!authHeader);

    if (!authHeader) {
      console.log('Middleware: No authorization header, redirecting to login');
      // Redirect to login if no token
      const loginUrl = new URL('/auth/login', request.url);
      // Add the current path as a redirect parameter
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify JWT token
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    const payload = verifyToken(token);

    if (!payload) {
      console.log('Middleware: Invalid JWT token, redirecting to login');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    console.log('Middleware: JWT verified for user:', payload.username, 'with role:', payload.role);

    if (payload.role !== 'admin') {
      console.log('Middleware: User is not admin, redirecting to login');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Track page views for frontend routes
  if (!request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/api') &&
      !request.nextUrl.pathname.startsWith('/auth') &&
      !request.nextUrl.pathname.startsWith('/_next') &&
      !request.nextUrl.pathname.startsWith('/favicon') &&
      !request.nextUrl.pathname.includes('.') &&
      request.nextUrl.pathname !== '/') {

    try {
      // Get client information
      const userAgent = request.headers.get('user-agent') || '';
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
      const referrer = request.headers.get('referer') || undefined;

      console.log('🎯 Middleware tracking page view:', {
        page: request.nextUrl.pathname,
        userAgent: userAgent.substring(0, 50) + '...',
        ip,
        referrer
      });

      // Track the page view
      trackPageView({
        page: request.nextUrl.pathname,
        userAgent,
        ip,
        referrer,
      });

      console.log('✅ Page view tracked successfully in middleware');
    } catch (error) {
      console.error('❌ Middleware tracking error:', error);
    }
  }

  // Frontend routes are accessible to everyone (including subscribers and non-authenticated users)
  // No authentication required for public content

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};