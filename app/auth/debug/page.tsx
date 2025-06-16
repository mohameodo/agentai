"use client"

import { Button } from "@/components/ui/button"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseAuth } from "@/lib/firebase/client"
import { signInWithGoogle } from "@/lib/firebase/auth"
import { useEffect, useState } from "react"

export default function AuthDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const checkConfig = () => {
      const auth = getFirebaseAuth()
      
      setDebugInfo({
        isFirebaseEnabled,
        hasFirebaseConfig: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasFirebaseProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        firebaseAuth: !!auth,
        currentUser: auth?.currentUser?.uid || null,
        windowOrigin: typeof window !== "undefined" ? window.location.origin : "N/A",
        nodeEnv: process.env.NODE_ENV,
      })
    }

    checkConfig()
  }, [])

  const testAuth = async () => {
    try {
      if (!isFirebaseEnabled) {
        alert("Firebase is not enabled")
        return
      }

      console.log("Testing Google auth...")
      
      const user = await signInWithGoogle()
      
      if (user) {
        alert(`Auth successful! User: ${user.email}`)
        // Refresh debug info
        setDebugInfo((prev: any) => ({
          ...prev,
          currentUser: user.uid
        }))
      } else {
        alert("Auth cancelled or failed")
      }
    } catch (err) {
      console.error("Test auth error:", err)
      alert(`Test error: ${(err as Error).message}`)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-6">Firebase Authentication Debug Page</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Configuration Status</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Test Authentication</h2>
          <div className="flex space-x-4">
            <Button onClick={testAuth} variant="outline">
              Test Google Auth
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Common Issues:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Check that NEXT_PUBLIC_FIREBASE_API_KEY is set</li>
            <li>• Check that NEXT_PUBLIC_FIREBASE_PROJECT_ID is set</li>
            <li>• Verify Google OAuth provider is configured in Firebase console</li>
            <li>• Ensure authorized domains match in Firebase settings</li>
            <li>• Check browser console for detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
