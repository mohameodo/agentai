import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
  User
} from "firebase/auth"
import { getFirebaseAuth } from "./client"
import { isFirebaseEnabled } from "./config"

export async function signInWithGoogle() {
  if (!isFirebaseEnabled) {
    throw new Error("Firebase is not configured")
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    throw new Error("Firebase Auth is not available")
  }

  const provider = new GoogleAuthProvider()
  provider.addScope('email')
  provider.addScope('profile')
  
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error("Google sign-in error:", error)
    throw error
  }
}

export async function signInWithEmail(email: string, password: string) {
  if (!isFirebaseEnabled) {
    throw new Error("Firebase is not configured")
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    throw new Error("Firebase Auth is not available")
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error("Email sign-in error:", error)
    throw error
  }
}

export async function signUpWithEmail(email: string, password: string) {
  if (!isFirebaseEnabled) {
    throw new Error("Firebase is not configured")
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    throw new Error("Firebase Auth is not available")
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error("Email sign-up error:", error)
    throw error
  }
}

export async function signInAsGuest() {
  if (!isFirebaseEnabled) {
    console.warn("Firebase is not available in this deployment.")
    return null
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    console.warn("Firebase Auth is not available")
    return null
  }

  try {
    const result = await signInAnonymously(auth)
    return result.user
  } catch (error) {
    console.error("Anonymous sign-in error:", error)
    return null
  }
}

export async function signOut() {
  if (!isFirebaseEnabled) {
    return false
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    return false
  }

  try {
    await firebaseSignOut(auth)
    return true
  } catch (error) {
    console.error("Sign out error:", error)
    return false
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!isFirebaseEnabled) {
    callback(null)
    return () => {}
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    callback(null)
    return () => {}
  }

  return onAuthStateChanged(auth, callback)
}

export function getCurrentUser(): User | null {
  if (!isFirebaseEnabled) {
    return null
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    return null
  }

  return auth.currentUser
}
