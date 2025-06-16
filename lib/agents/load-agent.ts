import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, getDoc } from "firebase/firestore"
import { TOOL_REGISTRY, ToolId } from "../tools"
import { localAgents } from "./local-agents"

export async function loadAgent(agentId: string) {
  // Check local agents first
  if (localAgents[agentId as keyof typeof localAgents]) {
    const localAgent = localAgents[agentId as keyof typeof localAgents]

    return {
      systemPrompt: localAgent.system_prompt,
      tools: localAgent.tools,
      maxSteps: 5,
    }
  }

  // Fallback to database agents
  if (!isFirebaseEnabled) {
    throw new Error("Firebase is not configured")
  }

  const db = getFirebaseFirestore()
  if (!db) {
    throw new Error("Firebase Firestore not available")
  }

  try {
    const agentRef = doc(db, "agents", agentId)
    const agentDoc = await getDoc(agentRef)

    if (!agentDoc.exists()) {
      throw new Error("Agent not found")
    }

    const agent = agentDoc.data() as any

    const activeTools = Array.isArray(agent.tools)
      ? agent.tools.reduce((acc: Record<string, unknown>, toolId: string) => {
          const tool = TOOL_REGISTRY[toolId as ToolId]
          if (!tool) return acc
          if (tool.isAvailable?.() === false) return acc
          acc[toolId] = tool
          return acc
        }, {})
      : {}

    return {
      systemPrompt: agent.system_prompt,
      tools: activeTools,
      maxSteps: agent.max_steps ?? 5,
    }
  } catch (error) {
    console.error("Error loading agent:", error)
    throw new Error("Agent not found")
  }
}
