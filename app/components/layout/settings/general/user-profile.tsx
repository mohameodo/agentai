"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/prompt-kit/loader"
import { useUser } from "@/lib/user-store/provider"
import { User, PencilSimple, Check, X } from "@phosphor-icons/react"

export function UserProfile() {
  const { user, updateUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.display_name || "")
  const [isSaving, setIsSaving] = useState(false)

  if (!user) return null

  const handleSave = async () => {
    if (!editName.trim()) return
    
    setIsSaving(true)
    try {
      const success = await updateUser({ display_name: editName.trim() })
      if (success) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Failed to update name:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditName(user?.display_name || "")
    setIsEditing(false)
  }

  return (
    <div className="group">
      <h3 className="mb-3 text-sm font-medium">Profile</h3>
      <div className="flex items-center space-x-4">
        <div className="bg-muted flex items-center justify-center overflow-hidden rounded-full">
          {user?.profile_image ? (
            <Avatar className="size-12">
              <AvatarImage src={user.profile_image} className="object-cover" />
              <AvatarFallback>{user?.display_name?.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <User className="text-muted-foreground size-12" />
          )}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
                className="text-sm font-medium"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSave()
                  } else if (e.key === "Escape") {
                    e.preventDefault()
                    handleCancel()
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !editName.trim()}
                  className="h-6 px-2"
                >
                  {isSaving ? (
                    <div className="w-3 h-3">
                      <Loader />
                    </div>
                  ) : (
                    <Check size={12} />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="h-6 px-2"
                >
                  <X size={12} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div>
                <h4 className="text-sm font-medium">{user?.display_name}</h4>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <PencilSimple size={12} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
