"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithGoogle } from "@/lib/api"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseEnabled } from "@/lib/supabase/config"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HeaderGoBack } from "../components/header-go-back"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  async function handleContinueAsGuest() {
    // Simply redirect to the main page, the app will handle anonymous user creation
    router.push("/")
  }

  async function handleSignInWithGoogle() {
    const supabase = createClient()

    if (!supabase || !isSupabaseEnabled) {
      setError("Google Sign-in is not available. Please use guest mode or contact support.")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log("Starting Google sign-in...")
      const data = await signInWithGoogle(supabase)
      console.log("Google sign-in response:", data)

      // Redirect to the provider URL
      if (data?.url) {
        console.log("Redirecting to:", data.url)
        window.location.href = data.url
      } else {
        throw new Error("No redirect URL received from authentication provider")
      }
    } catch (err: unknown) {
      console.error("Error signing in with Google:", err)
      const errorMessage = (err as Error).message || "An unexpected error occurred. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Remove the entire handleSignInWithGitHub function

  async function handleEmailAuth() {
    const supabase = createClient()

    if (!supabase || !isSupabaseEnabled) {
      setError("Email authentication is not available. Please use guest mode or contact support.")
      return
    }

    try {
      setIsEmailLoading(true)
      setError(null)

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) {
          setError(error.message)
        } else {
          setError("Check your email for a confirmation link!")
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          setError(error.message)
        } else {
          router.push("/")
        }
      }
    } catch (err: unknown) {
      console.error("Error with email auth:", err)
      setError(
        (err as Error).message ||
          "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsEmailLoading(false)
    }
  }

  return (
    <div className="bg-background flex h-dvh w-full flex-col">
      <HeaderGoBack href="/" />

      <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-foreground text-3xl font-medium tracking-tight sm:text-4xl">
              Welcome to Nexiloop
            </h1>
            <p className="text-muted-foreground mt-3">
              Sign in to unlock your full potential with higher message limits.
            </p>
          </div>
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailLoading || isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isEmailLoading || isLoading}
              />
            </div>
            <Button
              className="w-full text-base sm:text-base"
              size="lg"
              onClick={handleEmailAuth}
              disabled={isEmailLoading || isLoading || !email || !password}
            >
              {isEmailLoading 
                ? "Processing..." 
                : isSignUp 
                  ? "Sign Up" 
                  : "Sign In"
              }
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                disabled={isEmailLoading || isLoading}
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <Button
              variant="secondary"
              className="w-full text-base sm:text-base"
              size="lg"
              onClick={handleSignInWithGoogle}
              disabled={isLoading || isEmailLoading}
              id="google-signin-button" // Added id attribute
              name="google-signin-button" // Added name attribute
            >
              <svg
                className="mr-2 size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>
                {isLoading ? "Connecting..." : "Continue with Google"}
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full text-base sm:text-base"
              size="lg"
              onClick={handleContinueAsGuest}
              disabled={isLoading || isEmailLoading}
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </main>

    <footer className="text-muted-foreground py-6 text-center text-sm">
  <p>
    By signing in, you agree to the{" "}
    <Link
      href="https://www.nexiloop.com/docs/legal/terms-conditions"
      className="text-foreground hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Terms & Conditions
    </Link>{" "}
    and{" "}
    <Link
      href="https://www.nexiloop.com/docs/legal/privacy-policy"
      className="text-foreground hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Privacy Policy
    </Link>
    .
  </p>
</footer>

    </div>
  )
}
