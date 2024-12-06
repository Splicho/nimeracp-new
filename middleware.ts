import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value

  // Check if the path is /cabinet
  if (request.nextUrl.pathname.startsWith('/cabinet')) {
    // If no token exists, redirect to the login page
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/cabinet/:path*'
}
