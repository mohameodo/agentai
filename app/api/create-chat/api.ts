import { filterLocalAgentId } from "@/lib/agents/utils"
import { validateUserIdentity } from "@/lib/server/api"
import { checkUsageByModel } from "@/lib/usage"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

type CreateChatInput = {
  userId: string
  title?: string
  model: string
  isAuthenticated: boolean
  agentId?: string
}

export async function createChatInDb({
  userId,
  title,
  model,
  isAuthenticated,
  agentId,
}: CreateChatInput) {
  // Filter out local agent IDs for database operations
  const dbAgentId = filterLocalAgentId(agentId)

  const isValidUser = await validateUserIdentity(userId, isAuthenticated)
  if (!isValidUser || !isFirebaseEnabled) {
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      title: title || "New Chat",
      model,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      agent_id: dbAgentId,
    }
  }

  const db = getFirebaseFirestore()
  if (!db) {
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      title: title || "New Chat",
      model,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      agent_id: dbAgentId,
    }
  }

  try {
    // TODO: Update checkUsageByModel to use Firebase
    // await checkUsageByModel(userId, model, isAuthenticated)

    const insertData: any = {
      user_id: userId,
      title: title || "New Chat",
      model,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    }

    if (dbAgentId) {
      insertData.agent_id = dbAgentId
    }

    const docRef = await addDoc(collection(db, "chats"), insertData)
    
    return {
      id: docRef.id,
      ...insertData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error creating chat:", error)
    return null
  }
}
