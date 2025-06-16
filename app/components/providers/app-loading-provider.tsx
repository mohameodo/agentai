"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/lib/user-store/provider"
import { LoadingScreen } from "@/components/ui/loading-screen"

/**
 * Provider that shows loading screen while essential data is being loaded
 */
export function AppLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStage, setLoadingStage] = useState("Initializing...")
  const { user, isLoading: userLoading } = useUser()

  useEffect(() => {
    const loadApp = async () => {
      try {
        // Stage 1: Wait for user auth
        setLoadingStage("Checking authentication...")
        
        // Wait a bit for auth to settle
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Stage 2: Load user data
        if (user?.id) {
          setLoadingStage("Loading your data...")
          
          // Wait for user-specific data to load
          await new Promise(resolve => setTimeout(resolve, 800))
          
          setLoadingStage("Setting up your workspace...")
          await new Promise(resolve => setTimeout(resolve, 600))
        } else {
          setLoadingStage("Preparing guest experience...")
          await new Promise(resolve => setTimeout(resolve, 400))
        }
        
        // Stage 3: Final setup
        setLoadingStage("Almost ready...")
        await new Promise(resolve => setTimeout(resolve, 300))
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error during app loading:", error)
        setIsLoading(false)
      }
    }

    // Only start loading once user loading is complete
    if (!userLoading) {
      loadApp()
    }
  }, [user?.id, userLoading])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
