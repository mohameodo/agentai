import { UserProfile } from "@/app/types/user"
import { APP_DOMAIN, DAILY_SPECIAL_AGENT_LIMIT } from "@/lib/config"
import { fetchClient } from "./fetch"
import {
  API_ROUTE_CREATE_GUEST,
  API_ROUTE_UPDATE_CHAT_AGENT,
  API_ROUTE_UPDATE_CHAT_MODEL,
} from "./routes"
import { getCurrentUser, signInWithGoogle as firebaseSignInWithGoogle, signInAsGuest } from "./firebase/auth"
import { getDocument, updateDocument, createDocument } from "./firebase/firestore"
import { COLLECTIONS } from "@/app/types/firebase.types"
import type { FirebaseUser } from "@/app/types/firebase.types"

/**
 * Creates a guest user record on the server
 */
export async function createGuestUser(guestId: string) {
  try {
    const res = await fetchClient(API_ROUTE_CREATE_GUEST, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: guestId }),
    })
    const responseData = await res.json()
    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to create guest user: ${res.status} ${res.statusText}`
      )
    }

    return responseData
  } catch (err) {
    console.error("Error creating guest user:", err)
    throw err
  }
}

export class UsageLimitError extends Error {
  code: string
  constructor(message: string) {
    super(message)
    this.code = "DAILY_LIMIT_REACHED"
  }
}

/**
 * Checks the user's daily usage and increments both overall and daily counters.
 * Resets the daily counter if a new day (UTC) is detected.
 * Uses the `anonymous` flag from the user record to decide which daily limit applies.
 *
 * @param supabase - Your Supabase client.
 * @param userId - The ID of the user.
 * @returns The remaining daily limit.
 */
export async function checkRateLimits(
  userId: string,
  isAuthenticated: boolean
) {
  try {
    const res = await fetchClient(
      `/api/rate-limits?userId=${userId}&isAuthenticated=${isAuthenticated}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    const responseData = await res.json()
    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to check rate limits: ${res.status} ${res.statusText}`
      )
    }
    return responseData
  } catch (err) {
    console.error("Error checking rate limits:", err)
    throw err
  }
}

/**
 * Updates the model for an existing chat
 */
export async function updateChatModel(chatId: string, model: string) {
  try {
    const res = await fetchClient(API_ROUTE_UPDATE_CHAT_MODEL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, model }),
    })
    const responseData = await res.json()

    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to update chat model: ${res.status} ${res.statusText}`
      )
    }

    return responseData
  } catch (error) {
    console.error("Error updating chat model:", error)
    throw error
  }
}

/**
 * Signs in user with Google OAuth via Firebase
 */
export async function signInWithGoogle() {
  try {
    const user = await firebaseSignInWithGoogle()
    
    if (user) {
      // Create or update user profile in Firestore
      await createOrUpdateUserProfile(user)
    }
    
    return user
  } catch (err) {
    console.error("Error signing in with Google:", err)
    throw err
  }
}

/**
 * Creates or updates user profile in Firestore
 */
async function createOrUpdateUserProfile(user: any) {
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

    await createDocument(COLLECTIONS.USERS, userData, user.uid)
  } catch (error) {
    console.error("Error creating/updating user profile:", error)
  }
}

export const getOrCreateGuestUserId = async (
  user: UserProfile | null
): Promise<string | null> => {
  if (user?.id) return user.id

  const currentUser = getCurrentUser()
  
  // Check if we already have an anonymous user
  if (currentUser && currentUser.isAnonymous) {
    const anonUserId = currentUser.uid

    const profileCreationAttempted = localStorage.getItem(
      `guestProfileAttempted_${anonUserId}`
    )

    if (!profileCreationAttempted) {
      try {
        await createGuestUser(anonUserId)
        localStorage.setItem(`guestProfileAttempted_${anonUserId}`, "true")
      } catch (error) {
        console.error(
          "Failed to ensure guest user profile exists for existing anonymous auth user:",
          error
        )
        // Do not return null here, proceed to return anonUserId as the user exists in auth
      }
    }
    return anonUserId
  }

  try {
    const guestUser = await signInAsGuest()

    if (!guestUser) {
      console.error("Anonymous sign-in did not return a user.")
      return null
    }

    const guestIdFromAuth = guestUser.uid
    try {
      await createGuestUser(guestIdFromAuth)
      localStorage.setItem(`guestProfileAttempted_${guestIdFromAuth}`, "true")
    } catch (createError) {
      console.error(
        "Failed to create guest user profile for new anonymous auth user:",
        createError
      )
      // If profile creation fails, still return the guestIdFromAuth as the auth user was created
    }
    return guestIdFromAuth
  } catch (error) {
    console.error(
      "Error in getOrCreateGuestUserId during anonymous sign-in or profile creation:",
      error
    )
    return null
  }
}

export class SpecialAgentLimitError extends Error {
  code: string
  constructor(message: string = "Special agent usage limit reached.") {
    super(message)
    this.code = "SPECIAL_AGENT_LIMIT_REACHED"
  }
}

export async function checkSpecialAgentUsage(userId: string) {
  const user = await getDocument<FirebaseUser>(COLLECTIONS.USERS, userId)
  
  if (!user) {
    throw new Error("User not found")
  }

  const now = new Date()
  const lastReset = user.special_agent_reset?.toDate()
  let usageCount = user.special_agent_count || 0

  const isNewDay =
    !lastReset ||
    now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
    now.getUTCMonth() !== lastReset.getUTCMonth() ||
    now.getUTCDate() !== lastReset.getUTCDate()

  if (isNewDay) {
    usageCount = 0
    await updateDocument(COLLECTIONS.USERS, userId, {
      special_agent_count: 0,
      special_agent_reset: now as any,
    })
  }

  if (usageCount >= DAILY_SPECIAL_AGENT_LIMIT) {
    const err = new SpecialAgentLimitError()
    throw err
  }

  return {
    usageCount,
    limit: DAILY_SPECIAL_AGENT_LIMIT,
  }
}

export async function incrementSpecialAgentUsage(
  userId: string,
  currentCount?: number
): Promise<void> {
  let specialAgentCount: number

  if (typeof currentCount === "number") {
    specialAgentCount = currentCount
  } else {
    const user = await getDocument<FirebaseUser>(COLLECTIONS.USERS, userId)
    if (!user) {
      throw new Error("User not found")
    }
    specialAgentCount = user.special_agent_count || 0
  }

  await updateDocument(COLLECTIONS.USERS, userId, {
    special_agent_count: specialAgentCount + 1,
    last_active_at: new Date() as any,
  })
}

/**
 * Updates the agent for an existing chat
 */
export async function updateChatAgent(
  userId: string,
  chatId: string,
  agentId: string | null,
  isAuthenticated: boolean
) {
  try {
    const res = await fetchClient(API_ROUTE_UPDATE_CHAT_AGENT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, chatId, agentId, isAuthenticated }),
    })
    const responseData = await res.json()

    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to update chat agent: ${res.status} ${res.statusText}`
      )
    }

    return responseData
  } catch (error) {
    console.error("Error updating chat agent:", error)
    throw error
  }
}
