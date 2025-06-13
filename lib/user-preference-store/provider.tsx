"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type LayoutType = "sidebar" | "fullscreen"

type UserPreferences = {
  layout: LayoutType
  promptSuggestions: boolean
  showToolInvocations: boolean
  showConversationPreviews: boolean
  defaultImageModel: string
  backgroundRemovalEnabled: boolean
  videoStreamingEnabled: boolean
}

const defaultPreferences: UserPreferences = {
  layout: "fullscreen",
  promptSuggestions: true,
  showToolInvocations: true,
  showConversationPreviews: true,
  defaultImageModel: "@cf/lykon/dreamshaper-8-lcm",
  backgroundRemovalEnabled: false,
  videoStreamingEnabled: true,
}

const PREFERENCES_STORAGE_KEY = "user-preferences"
const LAYOUT_STORAGE_KEY = "preferred-layout"

interface UserPreferencesContextType {
  preferences: UserPreferences
  setLayout: (layout: LayoutType) => void
  setPromptSuggestions: (enabled: boolean) => void
  setShowToolInvocations: (enabled: boolean) => void
  setShowConversationPreviews: (enabled: boolean) => void
  setDefaultImageModel: (model: string) => void
  setBackgroundRemovalEnabled: (enabled: boolean) => void
  setVideoStreamingEnabled: (enabled: boolean) => void
}

const UserPreferencesContext = createContext<
  UserPreferencesContextType | undefined
>(undefined)

export function UserPreferencesProvider({
  children,
  userId,
}: {
  children: React.ReactNode
  userId?: string
}) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences)
  const [isInitialized, setIsInitialized] = useState(false)
  const isAuthenticated = !!userId

  useEffect(() => {
    if (!isAuthenticated) {
      setPreferences((prev) => ({ ...prev, layout: "fullscreen" }))
      setIsInitialized(true)
      return
    }

    try {
      const storedPrefs = localStorage.getItem(PREFERENCES_STORAGE_KEY)

      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs))
      } else {
        const storedLayout = localStorage.getItem(
          LAYOUT_STORAGE_KEY
        ) as LayoutType
        if (storedLayout) {
          setPreferences((prev) => ({ ...prev, layout: storedLayout }))
        }
      }
    } catch (error) {
      console.error("Failed to load user preferences:", error)
    } finally {
      setIsInitialized(true)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      try {
        localStorage.setItem(
          PREFERENCES_STORAGE_KEY,
          JSON.stringify(preferences)
        )
        localStorage.setItem(LAYOUT_STORAGE_KEY, preferences.layout)
      } catch (error) {
        console.error("Failed to save user preferences:", error)
      }
    }
  }, [preferences, isInitialized, isAuthenticated])

  const setLayout = (layout: LayoutType) => {
    if (isAuthenticated || layout === "fullscreen") {
      setPreferences((prev) => ({ ...prev, layout }))
    }
  }

  const setPromptSuggestions = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, promptSuggestions: enabled }))
  }

  const setShowToolInvocations = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, showToolInvocations: enabled }))
  }

  const setShowConversationPreviews = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, showConversationPreviews: enabled }))
  }

  const setDefaultImageModel = (model: string) => {
    setPreferences((prev) => ({ ...prev, defaultImageModel: model }))
  }

  const setBackgroundRemovalEnabled = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, backgroundRemovalEnabled: enabled }))
  }

  const setVideoStreamingEnabled = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, videoStreamingEnabled: enabled }))
  }

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        setLayout,
        setPromptSuggestions,
        setShowToolInvocations,
        setShowConversationPreviews,
        setDefaultImageModel,
        setBackgroundRemovalEnabled,
        setVideoStreamingEnabled,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider"
    )
  }
  return context
}
