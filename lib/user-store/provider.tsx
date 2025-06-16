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

type UserContextType = {
  user: UserProfile | null
  isLoading: boolean
  updateUser: (updates: Partial<UserProfile>) => Promise<boolean>
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
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

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!isFirebaseEnabled) {
      return
    }

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, ensure their document exists and get their profile
        setIsLoading(true)
        try {
          // Ensure user document exists before fetching profile
          await ensureUserDocumentExists(firebaseUser.uid)
          
          const userProfile = await getUserProfile()
          setUser(userProfile)
        } catch (error) {
          console.error("Error fetching user profile:", error)
          setUser(null)
        } finally {
          setIsLoading(false)
        }
      } else {
        // User is signed out
        setUser(null)
      }
    })

    return unsubscribe
  }, [])

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

  return (
    <UserContext.Provider
      value={{ user, isLoading, updateUser, refreshUser, signOut }}
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
