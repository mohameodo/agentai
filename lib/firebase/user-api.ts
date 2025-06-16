import type { UserProfile } from "@/app/types/user"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getCurrentUser, onAuthStateChange } from "@/lib/firebase/auth"
import { getDocument, updateDocument, createDocument } from "@/lib/firebase/firestore"
import { COLLECTIONS } from "@/app/types/firebase.types"
import type { FirebaseUser } from "@/app/types/firebase.types"

export async function getFirebaseUser() {
  const user = getCurrentUser()
  return user
}

export async function getUserProfile(): Promise<UserProfile | null> {
  if (!isFirebaseEnabled) {
    // return fake user profile for no firebase
    return {
      id: "guest",
      email: "guest@ai.nexiloop.com",
      display_name: "Guest",
      profile_image: "",
      anonymous: true,
    } as UserProfile
  }

  const user = getCurrentUser()
  if (!user) return null

  const userProfile = await getDocument<FirebaseUser>(COLLECTIONS.USERS, user.uid)
  
  // Don't load anonymous users in the user store
  if (userProfile?.anonymous) return null

  return {
    id: user.uid,
    email: user.email || "",
    display_name: user.displayName || userProfile?.name || "",
    profile_image: user.photoURL || userProfile?.avatar_url || "",
    name: userProfile?.name,
    avatar_url: userProfile?.avatar_url,
    anonymous: userProfile?.anonymous || false,
    special_agent_count: userProfile?.special_agent_count || 0,
    premium: userProfile?.premium || false,
    daily_pro_message_count: userProfile?.daily_pro_message_count || 0,
    daily_message_count: userProfile?.daily_pro_message_count || 0,
    message_count: 0,
    preferred_model: userProfile?.model_preference,
    preferences: userProfile?.preferences || {},
    system_prompt: userProfile?.system_prompt,
    created_at: userProfile?.created_at?.toDate?.() || new Date(),
    updated_at: userProfile?.updated_at?.toDate?.() || new Date(),
    daily_reset: userProfile?.special_agent_reset?.toDate?.(),
    special_agent_reset: userProfile?.special_agent_reset?.toDate?.(),
    last_active_at: userProfile?.last_active_at?.toDate?.(),
  }
}

export async function updateUserProfile(
  id: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  if (!isFirebaseEnabled) {
    return false
  }

  try {
    const success = await updateDocument(COLLECTIONS.USERS, id, updates)
    return success
  } catch (error) {
    console.error("Failed to update user:", error)
    return false
  }
}

export async function createUserProfile(user: any): Promise<boolean> {
  if (!isFirebaseEnabled) {
    return false
  }

  try {
    const userData: Partial<FirebaseUser> = {
      email: user.email,
      name: user.displayName,
      avatar_url: user.photoURL,
      profile_image: user.photoURL,
      display_name: user.displayName,
      anonymous: user.isAnonymous,
      special_agent_count: 0,
      premium: false,
      daily_pro_message_count: 0,
      preferences: {}
    }

    const result = await createDocument(COLLECTIONS.USERS, userData, user.uid)
    return !!result
  } catch (error) {
    console.error("Failed to create user profile:", error)
    return false
  }
}

export function subscribeToUserUpdates(
  userId: string,
  onUpdate: (newData: Partial<UserProfile>) => void
) {
  if (!isFirebaseEnabled) {
    return () => {}
  }

  return onAuthStateChange((user) => {
    if (user && user.uid === userId) {
      onUpdate({
        id: user.uid,
        email: user.email || "",
        display_name: user.displayName || "",
        profile_image: user.photoURL || "",
      })
    }
  })
}
