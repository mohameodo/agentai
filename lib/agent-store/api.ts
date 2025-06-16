import { Agent } from "@/app/types/agent"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { CURATED_AGENTS_SLUGS } from "../config"
import { collection, query as firebaseQuery, where, getDocs, doc, getDoc } from "firebase/firestore"

export async function fetchCuratedAgentsFromDb(): Promise<Agent[] | null> {
  if (!isFirebaseEnabled) return null
  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    const agentsRef = collection(db, "agents")
    // First try to get curated agents by flag
    let q = firebaseQuery(agentsRef, where("is_curated", "==", true), where("is_public", "==", true))
    let querySnapshot = await getDocs(q)
    
    // If no curated agents found, fallback to slug-based query
    if (querySnapshot.empty && CURATED_AGENTS_SLUGS.length > 0) {
      q = firebaseQuery(agentsRef, where("slug", "in", CURATED_AGENTS_SLUGS))
      querySnapshot = await getDocs(q)
    }
    
    const agents: Agent[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      agents.push({
        id: doc.id,
        ...data,
      } as Agent)
    })
    
    // If no curated agents found, return empty array instead of null to prevent errors
    if (agents.length === 0) {
      console.warn("No curated agents found. You may need to seed them first.")
      return []
    }
    
    return agents
  } catch (error) {
    console.error("Error fetching curated agents:", error)
    // Return empty array instead of null to prevent UI errors
    return []
  }
}

export async function fetchUserAgentsFromDb(
  userId: string
): Promise<Agent[] | null> {
  if (!isFirebaseEnabled) return null
  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    const agentsRef = collection(db, "agents")
    const q = firebaseQuery(agentsRef, where("creator_id", "==", userId))
    const querySnapshot = await getDocs(q)
    const agents: Agent[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      agents.push({
        id: doc.id,
        ...data,
      } as Agent)
    })
    return agents
  } catch (error) {
    console.error("Error fetching user agents:", error)
    return null
  }
}

export async function fetchAgentBySlugOrId({
  slug,
  id,
}: {
  slug?: string
  id?: string | null
}): Promise<Agent | null> {
  if (!isFirebaseEnabled) return null
  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    if (id) {
      const agentRef = doc(db, "agents", id)
      const agentDoc = await getDoc(agentRef)
      if (agentDoc.exists()) {
        return {
          id: agentDoc.id,
          ...agentDoc.data(),
        } as Agent
      }
    }
    
    if (slug) {
      const agentsRef = collection(db, "agents")
      const q = firebaseQuery(agentsRef, where("slug", "==", slug))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0]
        return {
          id: docData.id,
          ...docData.data(),
        } as Agent
      }
    }
    
    return null
  } catch (error) {
    console.error("Error fetching agent:", error)
    return null
  }
}
