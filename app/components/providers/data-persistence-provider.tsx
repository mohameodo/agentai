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
 * Provider that saves essential user data to Firestore (NO ACTIVITY TRACKING)
 * Disabled all activity tracking to prevent Firebase quota exhaustion
 */
export function DataPersistenceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const { preferences } = useUserPreferences()
  const lastPreferencesRef = useRef(preferences)
  const lastModelRef = useRef(user?.preferred_model)

  // Only save model preference changes (essential for app functionality)
  useEffect(() => {
    if (user?.id && user.preferred_model && user.preferred_model !== lastModelRef.current) {
      // Reduced logging to prevent spam
      saveModelPreference(user.id, user.preferred_model)
      lastModelRef.current = user.preferred_model
    }
  }, [user?.id, user?.preferred_model])

  // Only save user preferences changes (essential for app functionality)
  useEffect(() => {
    if (user?.id && preferences && preferences !== lastPreferencesRef.current) {
      // Reduced logging to prevent spam
      saveUserPreferences(user.id, preferences)
      lastPreferencesRef.current = preferences
    }
  }, [user?.id, preferences])

  // Completely disabled all activity tracking to prevent Firebase quota exhaustion
  // No session tracking, no user activity, no page visits - only essential data

  return <>{children}</>
}
