"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/lib/user-store/provider"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { usePathname } from "next/navigation"

/**
 * Provider that shows loading screen while essential data is being loaded
 */
export function AppLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false) // Disabled by default
  const [loadingStage, setLoadingStage] = useState("Initializing...")
  const { user, isLoading: userLoading } = useUser()
  const pathname = usePathname()

  // Loading screen is disabled by default - never show it
  const shouldSkipLoading = true // Always skip loading screen

  useEffect(() => {
    // Loading screen is always disabled
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
