import { filterLocalAgentId } from "@/lib/agents/utils"
import { validateUserIdentity } from "@/lib/server/api"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, updateDoc } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const { userId, chatId, agentId, isAuthenticated } = await request.json()

    if (!userId || !chatId) {
      return new Response(
        JSON.stringify({ error: "Missing userId or chatId" }),
        { status: 400 }
      )
    }

    // Filter out local agent IDs for database operations
    const dbAgentId = filterLocalAgentId(agentId)

    const isValidUser = await validateUserIdentity(userId, isAuthenticated)

    if (!isValidUser || !isFirebaseEnabled) {
      console.log("Firebase not enabled, skipping agent update")
      return new Response(
        JSON.stringify({ chat: { id: chatId, agent_id: dbAgentId } }),
        {
          status: 200,
        }
      )
    }

    const db = getFirebaseFirestore()
    if (!db) {
      console.log("Firebase Firestore not available, skipping agent update")
      return new Response(
        JSON.stringify({ chat: { id: chatId, agent_id: dbAgentId } }),
        {
          status: 200,
        }
      )
    }

    try {
      const chatRef = doc(db, "chats", chatId)
      await updateDoc(chatRef, { agent_id: dbAgentId || null })

      return new Response(
        JSON.stringify({ chat: { id: chatId, agent_id: dbAgentId } }),
        { status: 200 }
      )
    } catch (updateError) {
      console.error("Error updating chat agent:", updateError)
      return new Response(JSON.stringify({ error: "Failed to update chat" }), {
        status: 500,
      })
    }
  } catch (error) {
    console.error("Error updating chat agent:", error)
    return new Response(
      JSON.stringify({ error: "Failed to update chat agent" }),
      { status: 500 }
    )
  }
}
