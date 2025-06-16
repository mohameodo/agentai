import {
  AUTH_DAILY_MESSAGE_LIMIT,
  DAILY_LIMIT_PRO_MODELS,
  NON_AUTH_DAILY_MESSAGE_LIMIT,
} from "@/lib/config"
import { validateUserIdentity } from "@/lib/server/api"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, getDoc } from "firebase/firestore"

export async function getMessageUsage(
  userId: string,
  isAuthenticated: boolean
) {
  const isValidUser = await validateUserIdentity(userId, isAuthenticated)
  if (!isValidUser) return null

  const db = getFirebaseFirestore()
  if (!db) {
    throw new Error("Firebase Firestore not available")
  }

  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    
    if (!userDoc.exists()) {
      throw new Error("User not found")
    }

    const data = userDoc.data()
    const dailyLimit = isAuthenticated
      ? AUTH_DAILY_MESSAGE_LIMIT
      : NON_AUTH_DAILY_MESSAGE_LIMIT

    const dailyCount = data.daily_message_count || 0
    const dailyProCount = data.daily_pro_message_count || 0

    return {
      dailyCount,
      dailyProCount,
      dailyLimit,
      remaining: dailyLimit - dailyCount,
      remainingPro: DAILY_LIMIT_PRO_MODELS - dailyProCount,
    }
  } catch (error) {
    throw new Error("Failed to fetch message usage")
  }
}
