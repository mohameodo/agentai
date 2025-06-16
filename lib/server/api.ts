import { getFirebaseFirestore } from "@/lib/firebase/client"
import { doc, getDoc } from "firebase/firestore"
import { isFirebaseEnabled } from "@/lib/firebase/config"

/**
 * Validates the user's identity
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

  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firebase Firestore not available")
    }

    // Check if user exists in Firestore (works for both authenticated and guest users)
    const userDoc = await getDoc(doc(db, "users", userId))
    
    if (!userDoc.exists()) {
      return false
    }

    const userData = userDoc.data()
    
    if (isAuthenticated) {
      // For authenticated users, ensure they are not anonymous
      return !userData.anonymous
    } else {
      // For guest users, ensure they are anonymous
      return userData.anonymous === true
    }
  } catch (error) {
    console.error("Error validating user identity:", error)
    return false
  }
}
