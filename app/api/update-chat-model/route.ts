import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, updateDoc } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const { chatId, model } = await request.json()

    if (!chatId || !model) {
      return new Response(
        JSON.stringify({ error: "Missing chatId or model" }),
        { status: 400 }
      )
    }

    // If Firebase is not available, we still return success
    if (!isFirebaseEnabled) {
      console.log("Firebase not enabled, skipping DB update")
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }

    const db = getFirebaseFirestore()
    if (!db) {
      console.log("Firebase Firestore not available, skipping DB update")
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }

    try {
      const chatRef = doc(db, "chats", chatId)
      await updateDoc(chatRef, { model })

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      })
    } catch (error) {
      console.error("Error updating chat model:", error)
      return new Response(
        JSON.stringify({
          error: "Failed to update chat model",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        { status: 500 }
      )
    }
  } catch (err: unknown) {
    console.error("Error in update-chat-model endpoint:", err)
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500 }
    )
  }
}
