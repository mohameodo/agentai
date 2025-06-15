"use client"

import { Button } from "@/components/ui/button"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function AuthDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const checkConfig = () => {
      const supabase = createClient()
      
      setDebugInfo({
        isSupabaseEnabled,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseClient: !!supabase,
        windowOrigin: typeof window !== "undefined" ? window.location.origin : "N/A",
        nodeEnv: process.env.NODE_ENV,
      })
    }

    checkConfig()
  }, [])

  const testAuth = async (provider: 'github' | 'google') => {
    try {
      const supabase = createClient()
      if (!supabase) {
        alert("Supabase client not available")
        return
      }

      console.log(`Testing ${provider} auth...`)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log("Auth response:", { data, error })
      
      if (error) {
        alert(`Auth error: ${error.message}`)
      } else if (data?.url) {
        alert(`Auth URL generated: ${data.url}`)
        window.open(data.url, '_blank')
      } else {
        alert("No URL returned from auth")
      }
    } catch (err) {
      console.error("Test auth error:", err)
      alert(`Test error: ${(err as Error).message}`)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
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
            <Button onClick={() => testAuth('github')} variant="outline">
              Test GitHub Auth
            </Button>
            <Button onClick={() => testAuth('google')} variant="outline">
              Test Google Auth  
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Common Issues:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Check that NEXT_PUBLIC_SUPABASE_URL is set</li>
            <li>• Check that NEXT_PUBLIC_SUPABASE_ANON_KEY is set</li>
            <li>• Verify OAuth providers are configured in Supabase dashboard</li>
            <li>• Ensure redirect URLs match in Supabase settings</li>
            <li>• Check browser console for detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
