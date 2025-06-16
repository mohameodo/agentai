"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@/lib/user-store/provider"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { 
  saveUserActivity, 
  saveModelPreference, 
  saveUserPreferences,
  saveUserSession 
} from "@/lib/firebase/data-persistence"

/**
 * Provider that automatically saves all user data to Firestore
 */
export function DataPersistenceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const { preferences } = useUserPreferences()
  const lastPreferencesRef = useRef(preferences)
  const lastModelRef = useRef(user?.preferred_model)

  // Save user session on mount
  useEffect(() => {
    if (user?.id) {
      const sessionData = {
        userAgent: navigator.userAgent,
        deviceInfo: `${navigator.platform} - ${navigator.language}`,
        location: window.location.href
      }
      
      saveUserSession(user.id, sessionData)
      
      // Track page visit
      saveUserActivity(user.id, {
        type: "page_visit",
        data: { 
          path: window.location.pathname,
          referrer: document.referrer 
        }
      })
    }
  }, [user?.id])

  // Save model preference changes
  useEffect(() => {
    if (user?.id && user.preferred_model && user.preferred_model !== lastModelRef.current) {
      console.log("Saving model preference change:", user.preferred_model)
      saveModelPreference(user.id, user.preferred_model)
      lastModelRef.current = user.preferred_model
    }
  }, [user?.id, user?.preferred_model])

  // Save user preferences changes
  useEffect(() => {
    if (user?.id && preferences && preferences !== lastPreferencesRef.current) {
      console.log("Saving user preferences change")
      saveUserPreferences(user.id, preferences)
      lastPreferencesRef.current = preferences
    }
  }, [user?.id, preferences])

  // Track user activity patterns
  useEffect(() => {
    if (!user?.id) return

    const handleUserActivity = (event: string) => {
      saveUserActivity(user.id!, {
        type: "user_interaction",
        data: { 
          event,
          path: window.location.pathname,
          timestamp: new Date().toISOString()
        }
      })
    }

    // Track various user interactions
    const handleClick = () => handleUserActivity("click")
    const handleKeydown = () => handleUserActivity("keydown")
    const handleScroll = () => handleUserActivity("scroll")

    // Throttle activity tracking to avoid spam
    let activityTimeout: NodeJS.Timeout
    const throttledActivity = (eventType: string) => {
      clearTimeout(activityTimeout)
      activityTimeout = setTimeout(() => handleUserActivity(eventType), 1000)
    }

    const throttledClick = () => throttledActivity("click")
    const throttledKeydown = () => throttledActivity("keydown")
    const throttledScroll = () => throttledActivity("scroll")

    document.addEventListener("click", throttledClick)
    document.addEventListener("keydown", throttledKeydown)
    window.addEventListener("scroll", throttledScroll)

    return () => {
      document.removeEventListener("click", throttledClick)
      document.removeEventListener("keydown", throttledKeydown)
      window.removeEventListener("scroll", throttledScroll)
      clearTimeout(activityTimeout)
    }
  }, [user?.id])

  // Track page navigation
  useEffect(() => {
    if (!user?.id) return

    const handleBeforeUnload = () => {
      saveUserActivity(user.id!, {
        type: "page_leave",
        data: { 
          path: window.location.pathname,
          timeSpent: Date.now() - (window as any).pageLoadTime
        }
      })
    }

    // Track page load time
    ;(window as any).pageLoadTime = Date.now()

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [user?.id])

  return <>{children}</>
}
