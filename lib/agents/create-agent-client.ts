import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { isFirebaseEnabled } from "@/lib/firebase/config"

/**
 * Create an agent with proper authentication context
 * This function runs on the client with user auth context
 */
export async function createAgentWithAuth(agentData: any) {
  if (!isFirebaseEnabled) {
    throw new Error("Firebase not available")
  }

  const db = getFirebaseFirestore()
  if (!db) {
    throw new Error("Firebase Firestore not available")
  }

  try {
    const agentRef = doc(db, "agents", agentData.slug)
    
    // Create the agent document with server timestamp
    await setDoc(agentRef, {
      ...agentData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })

    return {
      ...agentData,
      id: agentData.slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error creating agent:", error)
    throw error
  }
}
