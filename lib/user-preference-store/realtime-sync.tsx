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
  const { user, refreshUser } = useUser()
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
        
        // Update local preferences with server data
        if (userData.preferences) {
          Object.entries(userData.preferences).forEach(([key, value]) => {
            updatePreference(key, value)
          })
        }
        
        // If the user's preferred model changed, refresh the user data
        if (userData.preferred_model && userData.preferred_model !== user?.preferred_model) {
          console.log("Preferred model changed on server, refreshing user data")
          refreshUser()
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

  // Function to sync preferred model to Firebase
  const syncModelToFirebase = async (model: string) => {
    if (!isFirebaseEnabled || !user?.id) return

    const db = getFirebaseFirestore()
    if (!db) return

    try {
      const userRef = doc(db, "users", user.id)
      await updateDoc(userRef, {
        preferred_model: model,
        updated_at: serverTimestamp()
      })
    } catch (error) {
      console.error("Error syncing preferred model to Firebase:", error)
    }
  }

  return {
    syncToFirebase,
    syncModelToFirebase,
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
