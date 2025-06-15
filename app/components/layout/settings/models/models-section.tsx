"use client"

import { ModelSelector } from "@/components/common/model-selector/base"
import { MODEL_DEFAULT } from "@/lib/config"
import { useUser } from "@/lib/user-store/provider"
import { useEffect, useState } from "react"
import { SystemPromptSection } from "../general/system-prompt"

export function ModelsSection() {
  const { user, updateUser, isLoading } = useUser()
  const [selectedModelId, setSelectedModelId] = useState<string>(
    user?.preferred_model || MODEL_DEFAULT
  )
  const [isSaving, setIsSaving] = useState(false)

  // Sync with user preferred model changes
  useEffect(() => {
    if (user?.preferred_model && user.preferred_model !== selectedModelId) {
      console.log("Syncing settings model selection with user preference:", user.preferred_model)
      setSelectedModelId(user.preferred_model)
    }
  }, [user?.preferred_model, selectedModelId])

  const handleModelSelection = async (value: string) => {
    try {
      setIsSaving(true)
      setSelectedModelId(value)
      
      // Only update user preference if user is logged in
      if (user?.id) {
        const success = await updateUser({ preferred_model: value })
        if (!success) {
          console.error("Failed to save model preference")
          // Revert the local state if save failed
          setSelectedModelId(user.preferred_model || MODEL_DEFAULT)
        }
      }
    } catch (error) {
      console.error("Error updating model selection:", error)
      // Revert on error
      setSelectedModelId(user?.preferred_model || MODEL_DEFAULT)
    } finally {
      setIsSaving(false)
    }
  }

  // Prevent render if user data is not loaded yet
  if (!user && isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-medium">Preferred chat model</h3>
          <div className="h-10 bg-muted animate-pulse rounded-md" />
          <p className="text-muted-foreground mt-2 text-xs">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium">Preferred chat model</h3>
        <div className="relative">
          <ModelSelector
            selectedModelId={selectedModelId}
            setSelectedModelId={handleModelSelection}
            className="w-full"
          />
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          This model will be used by default for new conversations.
          {isSaving && " Saving..."}
        </p>
      </div>

      <SystemPromptSection />
    </div>
  )
}
