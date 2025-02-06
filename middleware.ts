import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add rate limiting configuration
const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Max requests per minute

// Store for rate limiting (Note: In production, use Redis or similar)
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function middleware(req: NextRequest) {
  // Rate limiting check
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitKey = `rate-limit:${ip}`;
  
  const now = Date.now();
  const rateData = rateLimit.get(rateLimitKey);
  
  if (rateData) {
    if (now - rateData.timestamp < RATE_LIMIT_DURATION) {
      if (rateData.count >= MAX_REQUESTS) {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
      rateData.count++;
    } else {
      rateData.count = 1;
      rateData.timestamp = now;
    }
  } else {
    rateLimit.set(rateLimitKey, { count: 1, timestamp: now });
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  const protectedRoutes = ['/dashboard', '/tokens', '/settings']
  if (protectedRoutes.includes(req.nextUrl.pathname) && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Auth routes (when already logged in)
  const authRoutes = ['/login', '/register']
  if (authRoutes.includes(req.nextUrl.pathname) && session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 