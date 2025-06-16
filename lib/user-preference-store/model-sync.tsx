"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@/lib/user-store/provider"
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { isFirebaseEnabled } from "@/lib/firebase/config"

/**
 * Hook for real-time model preference synchronization across devices
 */
export function useModelPreferenceSync() {
  const { user, updateUser } = useUser()
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!isFirebaseEnabled || !user?.id) {
      return
    }

    const db = getFirebaseFirestore()
    if (!db) return

    // Set up real-time listener for model preferences
    const userRef = doc(db, "users", user.id)
    
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data()
        
        // Update local model preference if it changed on another device
        if (userData.model_preference && userData.model_preference !== user.preferred_model) {
          updateUser({ preferred_model: userData.model_preference })
        }

        // Update other preferences that might affect model behavior
        if (userData.preferences) {
          const relevantPrefs = {
            temperature: userData.preferences.temperature,
            max_tokens: userData.preferences.max_tokens,
            streaming: userData.preferences.streaming,
            system_prompt: userData.preferences.system_prompt,
          }
          
          // Only update if values have actually changed
          Object.entries(relevantPrefs).forEach(([key, value]) => {
            if (value !== undefined && user.preferences?.[key] !== value) {
              updateUser({ 
                preferences: { 
                  ...user.preferences, 
                  [key]: value 
                } 
              })
            }
          })
        }
      }
    }, (error) => {
      console.error("Error listening to model preferences:", error)
    })

    unsubscribeRef.current = unsubscribe

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [user?.id, user?.preferred_model, user?.preferences, updateUser])

  // Function to update model preference and sync to Firebase
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
    isConnected: !!unsubscribeRef.current
  }
}

/**
 * Component that automatically syncs model preferences across devices
 */
export function ModelPreferenceSync({ children }: { children: React.ReactNode }) {
  useModelPreferenceSync()
  return <>{children}</>
}
