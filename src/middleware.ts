// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      // Triggers browser basic auth prompt
      'WWW-Authenticate': 'Basic realm="Shego Admin"',
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔐 Protect /admin and anything under it
  if (pathname.startsWith('/admin')) {
    const authHeader = req.headers.get('authorization');
    const expectedUser = process.env.SHEGO_ADMIN_USER;
    const expectedPass = process.env.SHEGO_ADMIN_PASS;

    // Fail closed if envs are missing
    if (!expectedUser || !expectedPass) {
      console.error('[MIDDLEWARE] SHEGO_ADMIN_USER / SHEGO_ADMIN_PASS missing in env.');
      return unauthorized();
    }

    if (!authHeader) {
      return unauthorized();
    }

    const [scheme, encoded] = authHeader.split(' ');

    if (scheme !== 'Basic' || !encoded) {
      return unauthorized();
    }

    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const [user, pass] = decoded.split(':');

    if (user !== expectedUser || pass !== expectedPass) {
      return unauthorized();
    }

    // ✅ Correct credentials – allow through to /admin
    return NextResponse.next();
  }

  // 🌍 Everything else: just pass through
  return NextResponse.next();
}

// Only run middleware on "real" routes, not assets/_next/etc.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets/).*)'],
};
