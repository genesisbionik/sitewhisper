import { NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Add rate limiting configuration
const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Max requests per minute

// Store for rate limiting (Note: In production, use Redis or similar)
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function middleware(req: Request) {
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

  // Existing authentication middleware
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users to the login page
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // paths that require authentication
}; 