
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('authToken')
  
  // Allow authentication-related paths
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // Protect all other routes
  if (!currentUser) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
