import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { nanoid } from "nanoid"
import slugify from "slugify"

function generateAgentSlug(title: string) {
  const base = slugify(title, { lower: true, strict: true, trim: true })
  const id = nanoid(6)
  return `${base}-${id}`
}

export async function POST(request: Request) {
  try {
    const {
      name,
      description,
      systemPrompt,
      mcp_config,
      example_inputs,
      avatar_url,
      tools = [],
      remixable = false,
      is_public = true,
      max_steps = 5,
      useNexiloopAsCreator = true, // Default to true, user can set to false
      userId, // Accept userId from client
    } = await request.json()

    if (!name || !description || !systemPrompt) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      )
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        {
          status: 401,
        }
      )
    }

    if (!isFirebaseEnabled) {
      return new Response(
        JSON.stringify({ error: "Firebase not available in this deployment." }),
        { status: 200 }
      )
    }

    const db = getFirebaseFirestore()

    if (!db) {
      return new Response(
        JSON.stringify({ error: "Firebase services not available." }),
        { status: 500 }
      )
    }

    // Always use the provided user ID as creator_id for database integrity
    const creatorId = userId
    const agentSlug = generateAgentSlug(name)

    const agentData = {
      slug: agentSlug,
      name,
      description,
      avatar_url: null, // Remove MCP-related avatar
      mcp_config: null, // Always set to null since we're removing MCP
      example_inputs,
      tools,
      remixable,
      is_public,
      system_prompt: systemPrompt,
      max_steps,
      creator_id: creatorId,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    }

    try {
      const agentRef = doc(db, "agents", agentSlug)
      await setDoc(agentRef, agentData)

      // Return agent data with timestamp for response
      const responseAgent = {
        ...agentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return new Response(JSON.stringify({ agent: responseAgent }), { status: 201 })
    } catch (firebaseError) {
      console.error("Firebase error:", firebaseError)
      return new Response(
        JSON.stringify({ 
          error: firebaseError instanceof Error ? firebaseError.message : "Database error" 
        }),
        { status: 500 }
      )
    }
  } catch (err: unknown) {
    console.error("Error in create-agent endpoint:", err)

    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500 }
    )
  }
}
