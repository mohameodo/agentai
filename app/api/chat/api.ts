import { saveFinalAssistantMessage } from "@/app/api/chat/db"
import { checkSpecialAgentUsage, incrementSpecialAgentUsage } from "@/lib/api"
import { sanitizeUserInput } from "@/lib/sanitize"
import { validateUserIdentity } from "@/lib/server/api"
import { checkUsageByModel, incrementUsageByModel } from "@/lib/usage"
import { addDoc, collection } from "firebase/firestore"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import type { 
  ChatApiParams, 
  LogUserMessageParams, 
  StoreAssistantMessageParams 
} from "@/app/types/api.types"

export async function validateAndTrackUsage({
  userId,
  model,
  isAuthenticated,
}: ChatApiParams): Promise<boolean> {
  const isValid = await validateUserIdentity(userId, isAuthenticated)
  if (!isValid) return false

  // TODO: Update usage tracking for Firebase
  // await checkUsageByModel(userId, model, isAuthenticated)
  return true
}

export async function logUserMessage({
  userId,
  chatId,
  content,
  attachments,
  model,
  isAuthenticated,
}: LogUserMessageParams): Promise<void> {
  const db = getFirebaseFirestore()
  if (!db) {
    console.error("Firebase Firestore not available")
    return
  }

  try {
    await addDoc(collection(db, "messages"), {
      chat_id: chatId,
      role: "user",
      content: sanitizeUserInput(content),
      experimental_attachments: attachments,
      user_id: userId,
      created_at: new Date(),
    })
    
    // TODO: Update usage tracking for Firebase
    // await incrementUsageByModel(userId, model, isAuthenticated)
  } catch (error) {
    console.error("Error saving user message:", error)
  }
}

export async function trackSpecialAgentUsage(userId: string): Promise<void> {
  await checkSpecialAgentUsage(userId)
  await incrementSpecialAgentUsage(userId)
}

export async function storeAssistantMessage({
  chatId,
  messages,
}: StoreAssistantMessageParams): Promise<void> {
  try {
    await saveFinalAssistantMessage(chatId, messages)
  } catch (err) {
    console.error("Failed to save assistant messages:", err)
  }
}
