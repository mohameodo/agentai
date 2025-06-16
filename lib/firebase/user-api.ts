import type { UserProfile } from "@/app/types/user"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getCurrentUser, onAuthStateChange } from "@/lib/firebase/auth"
import { getDocument, updateDocument, createDocument } from "@/lib/firebase/firestore"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
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
    // Ensure user document exists before updating
    const userExists = await ensureUserDocumentExists(id)
    if (!userExists) {
      console.error("Failed to ensure user document exists before update")
      return false
    }

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
    const db = getFirebaseFirestore()
    if (!db) {
      return false
    }

    const userData: Partial<FirebaseUser> = {
      email: user.email,
      name: user.displayName,
      avatar_url: user.photoURL,
      profile_image: user.photoURL,
      display_name: user.displayName,
      anonymous: user.isAnonymous,
      preferences: {
        theme: 'system',
        language: 'en',
        model_preference: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 4000,
        streaming: true,
        auto_save: true,
        notifications: true,
        analytics: false,
        beta_features: false,
        sidebar_collapsed: false,
        chat_history_enabled: true,
        system_prompt: '',
      },
      model_preference: 'gpt-4o',
      system_prompt: '',
      daily_message_count: 0,
      daily_pro_message_count: 0,
      message_count: 0,
      special_agent_count: 0,
      premium: false,
    }

    const userRef = doc(db, COLLECTIONS.USERS, user.uid)
    await setDoc(userRef, {
      ...userData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }, { merge: true })

    return true
  } catch (error) {
    console.error("Failed to create user profile:", error)
    return false
  }
}

/**
 * Ensures a user document exists in Firestore. Creates one if it doesn't exist.
 * This should be called before any update operations.
 */
export async function ensureUserDocumentExists(userId: string): Promise<boolean> {
  if (!isFirebaseEnabled) {
    return false
  }

  try {
    // Check if user document already exists
    const existingUser = await getDocument<FirebaseUser>(COLLECTIONS.USERS, userId)
    if (existingUser) {
      return true // Document already exists
    }

    // Get current Firebase user to create the document
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.uid !== userId) {
      console.error("Cannot create user document: Firebase user not available or mismatched")
      return false
    }

    // Create user document with basic info using setDoc with merge
    const db = getFirebaseFirestore()
    if (!db) {
      return false
    }

    const userData: Partial<FirebaseUser> = {
      email: currentUser.email || "",
      name: currentUser.displayName || "",
      avatar_url: currentUser.photoURL || "",
      profile_image: currentUser.photoURL || "",
      display_name: currentUser.displayName || "",
      anonymous: currentUser.isAnonymous || false,
      special_agent_count: 0,
      premium: false,
      daily_pro_message_count: 0,
      preferences: {}
    }

    const userRef = doc(db, COLLECTIONS.USERS, userId)
    await setDoc(userRef, {
      ...userData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }, { merge: true })

    console.log("Created user document for:", userId)
    return true
  } catch (error) {
    console.error("Failed to ensure user document exists:", error)
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
