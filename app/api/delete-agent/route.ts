import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, deleteDoc, getDoc } from "firebase/firestore"

export async function DELETE(request: Request) {
  try {
    const { slug, userId } = await request.json()

    if (!slug) {
      return new Response(JSON.stringify({ error: "Missing agent slug" }), {
        status: 400,
      })
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 401,
      })
    }

    if (!isFirebaseEnabled) {
      return new Response(
        JSON.stringify({ error: "Firebase not available in this deployment." }),
        { status: 500 }
      )
    }

    const db = getFirebaseFirestore()

    if (!db) {
      return new Response(
        JSON.stringify({ error: "Firebase services not available." }),
        { status: 500 }
      )
    }

    // First, check if the agent exists and the user owns it
    const agentRef = doc(db, "agents", slug)
    const agentDoc = await getDoc(agentRef)

    if (!agentDoc.exists()) {
      return new Response(JSON.stringify({ error: "Agent not found" }), {
        status: 404,
      })
    }

    const agentData = agentDoc.data()
    if (agentData.creator_id !== userId) {
      return new Response(
        JSON.stringify({
          error: "You can only delete agents that you created",
        }),
        { status: 403 }
      )
    }

    // Delete the agent
    try {
      await deleteDoc(agentRef)
      return new Response(
        JSON.stringify({ message: "Agent deleted successfully" }),
        { status: 200 }
      )
    } catch (deleteError) {
      console.error("Error deleting agent:", deleteError)
      return new Response(
        JSON.stringify({
          error: "Failed to delete agent",
          details: deleteError instanceof Error ? deleteError.message : "Unknown error",
        }),
        { status: 500 }
      )
    }
  } catch (err: unknown) {
    console.error("Error in delete-agent endpoint:", err)

    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500 }
    )
  }
}
