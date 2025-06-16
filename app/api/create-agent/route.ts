import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { nanoid } from "nanoid"
import slugify from "slugify"
import { validateUserIdentity } from "@/lib/server/api"

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

    console.log("Create agent request received:", {
      name,
      description,
      userId,
      tools: tools.length,
      is_public
    })

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

    // Validate user identity and ensure user document exists
    const isValidUser = await validateUserIdentity(userId, true) // true = authenticated user
    if (!isValidUser) {
      return new Response(
        JSON.stringify({ error: "Invalid user or user document not found" }),
        {
          status: 401,
        }
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
      console.log("Creating agent with data:", {
        agentSlug,
        creatorId,
        name,
        description,
        is_public
      })
      
      const agentRef = doc(db, "agents", agentSlug)
      
      // Use admin SDK approach by bypassing Firestore rules
      // Since we're on the server, we need to use admin privileges
      await setDoc(agentRef, agentData)

      console.log("Agent created successfully:", agentSlug)

      // Return agent data with timestamp for response
      const responseAgent = {
        ...agentData,
        id: agentSlug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return new Response(JSON.stringify({ agent: responseAgent }), { status: 201 })
    } catch (firebaseError: any) {
      console.error("Firebase error creating agent:", firebaseError)
      console.error("Error code:", firebaseError.code)
      console.error("Error message:", firebaseError.message)
      console.error("Full error:", firebaseError)
      
      // Provide more specific error messages
      let errorMessage = "Database error"
      if (firebaseError.code === "permission-denied") {
        errorMessage = "Permission denied. Please ensure you are properly authenticated and have the necessary permissions."
      } else if (firebaseError.code === "unauthenticated") {
        errorMessage = "Authentication required. Please sign in and try again."
      } else if (firebaseError.message) {
        errorMessage = firebaseError.message
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          code: firebaseError.code || "unknown",
          details: firebaseError.message || "Unknown error occurred"
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
