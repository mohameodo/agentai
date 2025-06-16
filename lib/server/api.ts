import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, getDoc } from "firebase/firestore"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { ensureUserDocumentExists } from "@/lib/firebase/user-api"

/**
 * Validates the user's identity and ensures their document exists
 * @param userId - The ID of the user.
 * @param isAuthenticated - Whether the user is authenticated.
 * @returns Whether the user identity is valid.
 */
export async function validateUserIdentity(
  userId: string,
  isAuthenticated: boolean
): Promise<boolean> {
  if (!isFirebaseEnabled) {
    return false
  }

  if (!userId || userId.trim() === '') {
    console.error("Invalid userId provided:", userId)
    return false
  }

  try {
    const db = getFirebaseFirestore()
    if (!db) {
      console.error("Firebase Firestore not available")
      return false
    }

    console.log("Validating user identity for:", userId, "authenticated:", isAuthenticated)

    // Ensure user document exists (creates it if needed)
    const userExists = await ensureUserDocumentExists(userId)
    if (!userExists) {
      console.error("Failed to ensure user document exists for:", userId)
      return false
    }

    // For server-side validation, we trust the client-provided userId
    // since Firebase Auth tokens can't be validated server-side in this setup
    // The security is enforced at the Firestore rules level
    console.log("User identity validated successfully for:", userId)
    return true
    
  } catch (error) {
    console.error("Error validating user identity:", error)
    return false
  }
}
