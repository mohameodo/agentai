"use client"

import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { getFirebaseAuth } from '../firebase/client'

/**
 * Enhanced authentication persistence hook
 * Handles both Firebase auth state and localStorage backup
 */
export function useAuthPersistence() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setIsLoading(false)
      setIsInitialized(true)
      return
    }

    // Check for stored user info on load
    const storedUserId = localStorage.getItem('firebase_user_uid')
    const storedUserEmail = localStorage.getItem('firebase_user_email')
    
    if (storedUserId && !isInitialized) {
      console.log('Found stored user info:', storedUserId)
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User authenticated' : 'User not authenticated')
      
      setUser(firebaseUser)
      setIsLoading(false)
      setIsInitialized(true)

      // Update localStorage
      if (firebaseUser) {
        localStorage.setItem('firebase_user_uid', firebaseUser.uid)
        localStorage.setItem('firebase_user_email', firebaseUser.email || '')
        
        // Set a flag to indicate auth state is restored
        sessionStorage.setItem('auth_restored', 'true')
      } else {
        localStorage.removeItem('firebase_user_uid')
        localStorage.removeItem('firebase_user_email')
        sessionStorage.removeItem('auth_restored')
      }
    }, (error) => {
      console.error('Auth state change error:', error)
      setIsLoading(false)
      setIsInitialized(true)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [isInitialized])

  // Force refresh auth state
  const refreshAuth = async () => {
    const auth = getFirebaseAuth()
    if (!auth) return

    try {
      setIsLoading(true)
      // Force reload user to get latest auth state
      if (auth.currentUser) {
        await auth.currentUser.reload()
        setUser(auth.currentUser)
      }
    } catch (error) {
      console.error('Error refreshing auth:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    isInitialized,
    refreshAuth,
    isAuthenticated: !!user,
  }
}
