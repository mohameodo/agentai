import { NextResponse, type NextRequest } from "next/server"
import { validateCsrfToken } from "./lib/csrf"

export async function middleware(request: NextRequest) {
  // TODO: Implement Firebase Auth session management in middleware if needed
  const response = NextResponse.next()

  // CSRF protection for state-changing requests
  if (["POST", "PUT", "DELETE"].includes(request.method)) {
    const csrfCookie = request.cookies.get("csrf_token")?.value
    const headerToken = request.headers.get("x-csrf-token")

    if (!csrfCookie || !headerToken || !validateCsrfToken(headerToken)) {
      return new NextResponse("Invalid CSRF token", { status: 403 })
    }
  }

  // Temporarily disable CSP completely to allow all Google APIs
  // response.headers.set(
  //   "Content-Security-Policy",
  //   `default-src *; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data: blob:; img-src * data: blob:; font-src * data:; connect-src *; media-src * data: blob:; object-src *; child-src * data: blob:; frame-src *; worker-src * blob:; frame-ancestors *; form-action *; base-uri *;`
  // )

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  runtime: "nodejs",
}
