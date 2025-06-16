import { isFirebaseEnabled } from "@/lib/firebase/config"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (!isFirebaseEnabled) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent("Firebase is not enabled in this deployment.")}`
    )
  }

  // Firebase Auth typically handles the callback on the client side.
  // The client SDK will parse the URL, handle the token exchange, and update the auth state.
  // This server-side route is mostly a pass-through or can handle specific post-auth actions if needed.

  // If there's a 'code' (though less common for Firebase client SDKs unless using custom flows)
  // or other specific query params, you might handle them here.
  // For standard Firebase email/password or social sign-in, the client SDK manages this.

  // Redirect to the 'next' URL (or home) and let the client-side Firebase SDK
  // pick up the auth state.
  const host = request.headers.get("host")
  const protocol = host?.includes("localhost") ? "http" : "https"
  const redirectUrl = `${protocol}://${host}${next}`

  return NextResponse.redirect(redirectUrl)
}
