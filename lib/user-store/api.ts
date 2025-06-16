// @todo: move in /lib/user/api.ts
import { UserProfile } from "@/app/types/user"
import { toast } from "@/components/ui/toast"
import { getUserProfile, updateUserProfile as updateFirebaseUserProfile } from "@/lib/firebase/user-api"
import { signOut } from "@/lib/firebase/auth"
import { isFirebaseEnabled } from "@/lib/firebase/config"

export async function fetchUserProfile(
  id: string
): Promise<UserProfile | null> {
  return getUserProfile()
}

export async function updateUserProfile(
  id: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  return updateFirebaseUserProfile(id, updates)
}

export async function signOutUser(): Promise<boolean> {
  if (!isFirebaseEnabled) {
    toast({
      title: "Sign out is not supported in this deployment",
      status: "info",
    })
    return false
  }

  const success = await signOut()
  if (!success) {
    console.error("Failed to sign out")
    return false
  }

  return true
}

export function subscribeToUserUpdates(
  userId: string,
  onUpdate: (newData: Partial<UserProfile>) => void
) {
  if (!isFirebaseEnabled) return () => {}

  // Firebase auth state changes will handle user updates
  // For now, return empty unsubscribe function
  return () => {}
}
