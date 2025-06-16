import { UsageLimitError } from "@/lib/api"
import {
  AUTH_DAILY_MESSAGE_LIMIT,
  DAILY_LIMIT_PRO_MODELS,
  FREE_MODELS_IDS,
  NON_AUTH_DAILY_MESSAGE_LIMIT,
} from "@/lib/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore"

const isFreeModel = (modelId: string) => FREE_MODELS_IDS.includes(modelId)
const isProModel = (modelId: string) => !isFreeModel(modelId)

/**
 * Checks the user's daily usage to see if they've reached their limit.
 * Uses the `anonymous` flag from the user record to decide which daily limit applies.
 *
 * @param userId - The ID of the user.
 * @param trackDaily - Whether to track the daily message count (default is true)
 * @throws UsageLimitError if the daily limit is reached, or a generic Error if checking fails.
 * @returns User data including message counts and reset date
 */
export async function checkUsage(userId: string) {
  if (!isFirebaseEnabled) {
    // Skip usage checking if Firebase is not enabled
    return {
      message_count: 0,
      daily_message_count: 0,
      daily_reset: new Date().toISOString(),
      anonymous: true,
      premium: false
    }
  }

  const db = getFirebaseFirestore()
  if (!db) {
    throw new Error("Firebase Firestore not available")
  }

  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error("User record not found for id: " + userId)
    }

    const userData = userDoc.data()

    // Decide which daily limit to use.
    const isAnonymous = userData.anonymous
    const dailyLimit = isAnonymous
      ? NON_AUTH_DAILY_MESSAGE_LIMIT
      : AUTH_DAILY_MESSAGE_LIMIT

    // Reset the daily counter if the day has changed (using UTC).
    const now = new Date()
    let dailyCount = userData.daily_message_count || 0
    const lastReset = userData.daily_reset ? new Date(userData.daily_reset) : null

    const isNewDay =
      !lastReset ||
      now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
      now.getUTCMonth() !== lastReset.getUTCMonth() ||
      now.getUTCDate() !== lastReset.getUTCDate()

    if (isNewDay) {
      dailyCount = 0
      await updateDoc(userRef, { 
        daily_message_count: 0, 
        daily_reset: Timestamp.fromDate(now) 
      })
    }

    // Check if the daily limit is reached.
    if (dailyCount >= dailyLimit) {
      throw new UsageLimitError("Daily message limit reached.")
    }

    return {
      userData,
      dailyCount,
      dailyLimit,
    }
  } catch (error) {
    console.error("Error checking usage:", error)
    throw error
  }
}

/**
 * Increments both overall and daily message counters for a user.
 *
 * @param userId - The ID of the user.
 * @param currentCounts - Current message counts (optional, will be fetched if not provided)
 * @param trackDaily - Whether to track the daily message count (default is true)
 * @throws Error if updating fails.
 */
export async function incrementUsage(
  userId: string
): Promise<void> {
  if (!isFirebaseEnabled) {
    // Skip usage tracking if Firebase is not enabled
    return
  }

  const db = getFirebaseFirestore()
  if (!db) {
    throw new Error("Firebase Firestore not available")
  }

  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error("User record not found for id: " + userId)
    }

    const userData = userDoc.data()
    const messageCount = userData.message_count || 0
    const dailyCount = userData.daily_message_count || 0

    // Increment both overall and daily message counts.
    const newOverallCount = messageCount + 1
    const newDailyCount = dailyCount + 1

    await updateDoc(userRef, {
      message_count: newOverallCount,
      daily_message_count: newDailyCount,
      last_active_at: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error incrementing usage:", error)
    throw error
  }
}

export async function checkProUsage(userId: string) {
  if (!isFirebaseEnabled) {
    // Skip usage checking if Firebase is not enabled
    return {
      daily_pro_message_count: 0,
      daily_pro_reset: new Date().toISOString()
    }
  }

  const db = getFirebaseFirestore()
  if (!db) {
    throw new Error("Firebase Firestore not available")
  }

  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error("User not found for ID: " + userId)
    }

    const userData = userDoc.data()
    let dailyProCount = userData.daily_pro_message_count || 0
    const now = new Date()
    const lastReset = userData.daily_pro_reset
      ? new Date(userData.daily_pro_reset)
      : null

    const isNewDay =
      !lastReset ||
      now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
      now.getUTCMonth() !== lastReset.getUTCMonth() ||
      now.getUTCDate() !== lastReset.getUTCDate()

    if (isNewDay) {
      dailyProCount = 0
      await updateDoc(userRef, {
        daily_pro_message_count: 0,
        daily_pro_reset: Timestamp.fromDate(now),
      })
    }

    if (dailyProCount >= DAILY_LIMIT_PRO_MODELS) {
      throw new UsageLimitError("Daily Pro model limit reached.")
    }

    return {
      dailyProCount,
      limit: DAILY_LIMIT_PRO_MODELS,
    }
  } catch (error) {
    console.error("Error checking pro usage:", error)
    throw error
  }
}

export async function incrementProUsage(
  userId: string
) {
  if (!isFirebaseEnabled) {
    // Skip usage tracking if Firebase is not enabled
    return
  }

  const db = getFirebaseFirestore()
  if (!db) {
    throw new Error("Firebase Firestore not available")
  }

  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error("Failed to fetch user usage for increment")
    }

    const data = userDoc.data()
    const count = data.daily_pro_message_count || 0

    await updateDoc(userRef, {
      daily_pro_message_count: count + 1,
      last_active_at: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error incrementing pro usage:", error)
    throw error
  }
}

export async function checkUsageByModel(
  userId: string,
  modelId: string,
  isAuthenticated: boolean
) {
  if (isProModel(modelId)) {
    if (!isAuthenticated) {
      throw new UsageLimitError("You must log in to use this model.")
    }
    return await checkProUsage(userId)
  }

  return await checkUsage(userId)
}

export async function incrementUsageByModel(
  userId: string,
  modelId: string,
  isAuthenticated: boolean
) {
  if (isProModel(modelId)) {
    if (!isAuthenticated) return
    return await incrementProUsage(userId)
  }

  return await incrementUsage(userId)
}
