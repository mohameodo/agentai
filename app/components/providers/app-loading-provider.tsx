"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/lib/user-store/provider"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { usePathname } from "next/navigation"

/**
 * Provider that shows loading screen while essential data is being loaded
 */
export function AppLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStage, setLoadingStage] = useState("Initializing...")
  const { user, isLoading: userLoading } = useUser()
  const pathname = usePathname()

  // Skip loading screen for chat pages
  const shouldSkipLoading = pathname?.startsWith('/chats/') || 
                           pathname?.startsWith('/c/') || 
                           pathname === '/chats'

  useEffect(() => {
    // Skip loading screen for chat pages
    if (shouldSkipLoading) {
      setIsLoading(false)
      return
    }

    // Check if loading screen has been shown before
    const hasShownLoading = typeof window !== 'undefined' && localStorage.getItem('hasShownInitialLoading')
    
    if (hasShownLoading && pathname === '/') {
      // If we've shown loading before and user is on home page, skip it
      setIsLoading(false)
      return
    }

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
        
        // Mark that we've shown the loading screen
        if (typeof window !== 'undefined') {
          localStorage.setItem('hasShownInitialLoading', 'true')
        }
        
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
  }, [user?.id, userLoading, shouldSkipLoading, pathname])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
