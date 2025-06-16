"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@/lib/user-store/provider"
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { isFirebaseEnabled } from "@/lib/firebase/config"

/**
 * Hook for model preference synchronization (REAL-TIME DISABLED)
 * Disabled real-time listeners to prevent Firebase quota exhaustion
 */
export function useModelPreferenceSync() {
  const { user, updateUser } = useUser()

  // Disabled real-time listener to prevent Firebase quota exhaustion
  // Model preferences are now only synced when explicitly saved
  
  // Function to update model preference and sync to Firebase (one-way sync only)
  const updateModelPreference = async (modelId: string) => {
    if (!isFirebaseEnabled || !user?.id) return

    const db = getFirebaseFirestore()
    if (!db) return

    try {
      // Update locally first for immediate feedback
      await updateUser({ preferred_model: modelId })

      // Then sync to Firebase
      const userRef = doc(db, "users", user.id)
      await updateDoc(userRef, {
        model_preference: modelId,
        [`preferences.model_preference`]: modelId,
        updated_at: serverTimestamp()
      })
    } catch (error) {
      console.error("Error updating model preference:", error)
    }
  }

  // Function to update model parameters and sync to Firebase
  const updateModelParameters = async (params: {
    temperature?: number
    max_tokens?: number
    streaming?: boolean
    system_prompt?: string
  }) => {
    if (!isFirebaseEnabled || !user?.id) return

    const db = getFirebaseFirestore()
    if (!db) return

    try {
      // Update locally first
      await updateUser({ 
        preferences: { 
          ...user.preferences, 
          ...params 
        } 
      })

      // Then sync to Firebase
      const userRef = doc(db, "users", user.id)
      const updates: Record<string, any> = {
        updated_at: serverTimestamp()
      }

      Object.entries(params).forEach(([key, value]) => {
        updates[`preferences.${key}`] = value
      })

      await updateDoc(userRef, updates)
    } catch (error) {
      console.error("Error updating model parameters:", error)
    }
  }

  return {
    updateModelPreference,
    updateModelParameters,
    isConnected: false // No real-time connection to prevent quota exhaustion
  }
}

/**
 * Component that automatically syncs model preferences across devices
 */
export function ModelPreferenceSync({ children }: { children: React.ReactNode }) {
  useModelPreferenceSync()
  return <>{children}</>
}
