// app/providers/user-provider.tsx
"use client"

import { UserProfile } from "@/app/types/user"
import {
  fetchUserProfile,
  signOutUser,
  subscribeToUserUpdates,
  updateUserProfile,
} from "@/lib/user-store/api"
import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChange } from "@/lib/firebase/auth"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getUserProfile, ensureUserDocumentExists } from "@/lib/firebase/user-api"
import { useAuthPersistence } from "@/lib/hooks/use-auth-persistence"
import { broadcastUserDataChange, listenForUserDataChanges } from "@/lib/cache-management"

type UserContextType = {
  user: UserProfile | null
  isLoading: boolean
  updateUser: (updates: Partial<UserProfile>) => Promise<boolean>
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: UserProfile | null
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const { user: firebaseUser, isLoading: authLoading, refreshAuth, isInitialized } = useAuthPersistence()

  // Listen to Firebase Auth state changes with improved persistence
  useEffect(() => {
    if (!isFirebaseEnabled || !isInitialized) {
      return
    }

    let unsubscribed = false

    const handleAuthStateChange = async (firebaseUser: any) => {
      if (unsubscribed) return
      
      console.log("Auth state changed:", firebaseUser ? "User signed in" : "User signed out")
      
      if (firebaseUser) {
        // User is signed in, ensure their document exists and get their profile
        setIsLoading(true)
        try {
          console.log("Ensuring user document exists for:", firebaseUser.uid)
          
          // Ensure user document exists before fetching profile
          await ensureUserDocumentExists(firebaseUser.uid)
          
          console.log("Fetching user profile...")
          const userProfile = await getUserProfile()
          console.log("User profile fetched:", userProfile ? "Success" : "Failed")
          
          if (!unsubscribed) {
            setUser(userProfile)
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
          if (!unsubscribed) {
            setUser(null)
          }
        } finally {
          if (!unsubscribed) {
            setIsLoading(false)
          }
        }
      } else {
        // User is signed out
        console.log("User signed out, clearing user state")
        if (!unsubscribed) {
          setUser(null)
          setIsLoading(false)
        }
      }
    }

    // Handle auth state change
    if (firebaseUser) {
      handleAuthStateChange(firebaseUser)
    } else if (isInitialized && !authLoading) {
      // Auth is initialized and user is not signed in
      setUser(null)
      setIsLoading(false)
    }

    return () => {
      unsubscribed = true
    }
  }, [firebaseUser, isInitialized, authLoading])

  const refreshUser = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const updatedUser = await fetchUserProfile(user.id)
      if (updatedUser) setUser(updatedUser)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user?.id) return false

    setIsLoading(true)
    try {
      const success = await updateUserProfile(user.id, updates)
      if (success) {
        setUser((prev) => (prev ? { ...prev, ...updates } : null))
        
        // Broadcast user data changes to other tabs
        broadcastUserDataChange('user-profile-updated', { userId: user.id, updates })
      }
      return success
    } catch (error) {
      console.error("Error updating user profile:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const success = await signOutUser()
      if (success) setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Set up realtime subscription for user data changes
  useEffect(() => {
    if (!user?.id) return

    const unsubscribe = subscribeToUserUpdates(user.id, (newData) => {
      setUser((prev) => (prev ? { ...prev, ...newData } : null))
    })

    return () => {
      unsubscribe()
    }
  }, [user?.id])

  // Listen for user data changes from other tabs
  useEffect(() => {
    const cleanup = listenForUserDataChanges((event) => {
      if (event.data.type === 'user-profile-updated' && event.data.data.userId === user?.id) {
        console.log('Received user profile update from another tab')
        refreshUser()
      }
    })

    return cleanup
  }, [user?.id, refreshUser])

  return (
    <UserContext.Provider
      value={{ user, isLoading, updateUser, refreshUser, signOut, refreshAuth }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
