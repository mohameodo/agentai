import { initializeApp, getApps } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"
import { firebaseConfig, isFirebaseEnabled } from "./config"

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
  
  const auth = getAuth(app)
  
  // Connect to emulator in development
  if (process.env.NODE_ENV === 'development' && !auth.app.name.includes('emulator')) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099')
    } catch (error) {
      // Emulator connection might fail if already connected
      console.log('Auth emulator connection skipped')
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
