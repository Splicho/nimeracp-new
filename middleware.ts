import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Allow auth-related paths
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Protect cabinet routes
  if (request.nextUrl.pathname.startsWith('/cabinet')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
