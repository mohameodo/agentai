import { initializeApp, getApps } from "firebase/app"
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"
import { firebaseConfig, isFirebaseEnabled } from "./config"

// Global auth instance to ensure consistency
let authInstance: any = null

export function createFirebaseApp() {
  if (!isFirebaseEnabled) {
    return null
  }

  // Initialize Firebase only if it hasn't been initialized yet
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  
  return app
}

export function getFirebaseAuth() {
  const app = createFirebaseApp()
  if (!app) return null
  
  // Return cached instance if available
  if (authInstance) {
    return authInstance
  }
  
  const auth = getAuth(app)
  authInstance = auth
  
  // Set auth persistence to local storage for session persistence
  if (typeof window !== 'undefined') {
    // Use a more robust approach to set persistence with fallback
    const setPersistenceWithFallback = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence)
        console.log('Firebase Auth persistence set to LOCAL (persistent)')
      } catch (error) {
        console.warn('Failed to set LOCAL persistence, trying SESSION:', error)
        try {
          await setPersistence(auth, browserSessionPersistence)
          console.log('Firebase Auth persistence set to SESSION (tab-only)')
        } catch (sessionError) {
          console.warn('Failed to set any persistence:', sessionError)
        }
      }
    }
    
    setPersistenceWithFallback()
    
    // Add auth state listener to handle persistence
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Auth state restored:', user.uid)
        // Store additional user info in localStorage for quick access
        localStorage.setItem('firebase_user_uid', user.uid)
        localStorage.setItem('firebase_user_email', user.email || '')
      } else {
        console.log('Auth state cleared')
        localStorage.removeItem('firebase_user_uid')
        localStorage.removeItem('firebase_user_email')
      }
    })
  }
  
  // Connect to emulator in development only if not already connected
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    try {
      // Only connect if we're in development and localhost
      if (window.location.hostname === 'localhost') {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
        console.log('Connected to Firebase Auth emulator')
      }
    } catch (error) {
      // Emulator connection might fail if already connected
      console.log('Auth emulator connection skipped:', error)
    }
  }
  
  return auth
}

export function getFirebaseFirestore() {
  const app = createFirebaseApp()
  if (!app) return null
  
  const db = getFirestore(app)
  
  // Connect to emulator in development
  if (process.env.NODE_ENV === 'development' && !db.app.name.includes('emulator')) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080)
    } catch (error) {
      // Emulator connection might fail if already connected
      console.log('Firestore emulator connection skipped')
    }
  }
  
  return db
}

export function getFirebaseStorage() {
  const app = createFirebaseApp()
  if (!app) return null
  
  const storage = getStorage(app)
  
  // Connect to emulator in development
  if (process.env.NODE_ENV === 'development' && !storage.app.name.includes('emulator')) {
    try {
      connectStorageEmulator(storage, 'localhost', 9199)
    } catch (error) {
      // Emulator connection might fail if already connected
      console.log('Storage emulator connection skipped')
    }
  }
  
  return storage
}
