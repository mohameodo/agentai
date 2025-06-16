"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@/lib/user-store/provider"
import { useUserPreferences } from "./provider"
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { isFirebaseEnabled } from "@/lib/firebase/config"

/**
 * Hook that provides real-time synchronization of user preferences across devices
 */
export function useRealtimePreferenceSync() {
  const { user } = useUser()
  const { updatePreference, preferences } = useUserPreferences()
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!isFirebaseEnabled || !user?.id) {
      return
    }

    const db = getFirebaseFirestore()
    if (!db) return

    // Set up real-time listener for user preferences
    const userRef = doc(db, "users", user.id)
    
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data()
        if (userData.preferences) {
          // Update local preferences with server data
          Object.entries(userData.preferences).forEach(([key, value]) => {
            updatePreference(key, value)
          })
        }
        
        // Sync model preference
        if (userData.model_preference) {
          updatePreference('model_preference', userData.model_preference)
        }
      }
    }, (error) => {
      console.error("Error listening to user preferences:", error)
    })

    unsubscribeRef.current = unsubscribe

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [user?.id, updatePreference])

  // Function to sync local changes to Firebase
  const syncToFirebase = async (key: string, value: any) => {
    if (!isFirebaseEnabled || !user?.id) return

    const db = getFirebaseFirestore()
    if (!db) return

    try {
      const userRef = doc(db, "users", user.id)
      await updateDoc(userRef, {
        [`preferences.${key}`]: value,
        updated_at: serverTimestamp()
      })
    } catch (error) {
      console.error("Error syncing preference to Firebase:", error)
    }
  }

  return {
    syncToFirebase,
    isConnected: !!unsubscribeRef.current
  }
}

/**
 * Component that automatically syncs user preferences across devices
 */
export function RealtimePreferenceSync({ children }: { children: React.ReactNode }) {
  useRealtimePreferenceSync()
  return <>{children}</>
}
