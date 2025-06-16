import { NextResponse, type NextRequest } from "next/server"
import { validateCsrfToken } from "./lib/csrf"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Enhanced cookie handling for better persistence
  const cookieOptions = {
    httpOnly: false, // Allow client-side access for Firebase
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  }

  // Set enhanced headers for better authentication persistence
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')

  // CSRF protection for state-changing requests
  if (["POST", "PUT", "DELETE"].includes(request.method)) {
    const csrfCookie = request.cookies.get("csrf_token")?.value
    const headerToken = request.headers.get("x-csrf-token")

    if (!csrfCookie || !headerToken || !validateCsrfToken(headerToken)) {
      return new NextResponse("Invalid CSRF token", { status: 403 })
    }
  }

  // Add cache control headers for better performance
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Enhanced CSP for Firebase and real-time features
  response.headers.set(
    "Content-Security-Policy",
    `default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob: data:; style-src 'self' 'unsafe-inline' https: data:; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self' https: wss: ws:; media-src 'self' https: data: blob:; object-src 'none'; child-src 'self' https: blob: data:; frame-src 'self' https:; worker-src 'self' blob:; frame-ancestors 'self'; form-action 'self'; base-uri 'self';`
  )

  // Add headers for better authentication persistence and real-time sync
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  
  // Add custom headers for Firebase Auth persistence
  response.headers.set('X-Firebase-Auth-Persistence', 'LOCAL')
  response.headers.set('X-Real-Time-Sync', 'enabled')

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  runtime: "nodejs",
}
