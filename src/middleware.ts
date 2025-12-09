// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(_req: NextRequest) {
  void _req;
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
