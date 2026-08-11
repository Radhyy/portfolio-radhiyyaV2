import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user is trying to access the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('admin_token')?.value;

    // If no token or invalid token, redirect to login
    const validToken = process.env.JWT_SECRET || 'auth_token';
    if (!token || token !== validToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Only run middleware on dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
