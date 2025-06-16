import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
      })
    }

    if (!isFirebaseEnabled) {
      console.log("Firebase not enabled, skipping guest creation.")
      return new Response(
        JSON.stringify({ user: { id: userId, anonymous: true } }),
        {
          status: 200,
        }
      )
    }

    const db = getFirebaseFirestore()
    if (!db) {
      return new Response(
        JSON.stringify({ user: { id: userId, anonymous: true } }),
        {
          status: 200,
        }
      )
    }

    // Check if the user record already exists
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    let userData
    if (!userDoc.exists()) {
      // Create new guest user
      const newUserData = {
        id: userId,
        email: `${userId}@anonymous.example`,
        anonymous: true,
        message_count: 0,
        premium: false,
        created_at: serverTimestamp(),
      }

      try {
        await setDoc(userRef, newUserData)
        // Return user data with current timestamp for response
        userData = {
          ...newUserData,
          created_at: new Date().toISOString(),
        }
      } catch (error) {
        console.error("Error creating guest user:", error)
        return new Response(
          JSON.stringify({
            error: "Failed to create guest user",
            details: error instanceof Error ? error.message : "Unknown error",
          }),
          { status: 500 }
        )
      }
    } else {
      // Return existing user data
      userData = { id: userId, ...userDoc.data() }
    }

    return new Response(JSON.stringify({ user: userData }), { status: 200 })
  } catch (err: unknown) {
    console.error("Error in create-guest endpoint:", err)

    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500 }
    )
  }
}
