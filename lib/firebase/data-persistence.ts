import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"
import { getFirebaseFirestore } from "./client"
import { isFirebaseEnabled } from "./config"

/**
 * Saves user activity to Firestore
 */
export async function saveUserActivity(userId: string, activity: {
  type: string
  data: any
  timestamp?: any
}) {
  if (!isFirebaseEnabled || !userId) return

  const db = getFirebaseFirestore()
  if (!db) return

  try {
    const activityRef = doc(db, "user_activities", userId)
    
    // Use Date.now() instead of serverTimestamp() in arrayUnion
    await setDoc(activityRef, {
      activities: arrayUnion({
        ...activity,
        timestamp: activity.timestamp || Date.now()
      }),
      updated_at: serverTimestamp()
    }, { merge: true })
    
    console.log("User activity saved:", activity.type)
  } catch (error) {
    console.error("Error saving user activity:", error)
  }
}

/**
 * Saves user model preference to Firestore
 */
export async function saveModelPreference(userId: string, model: string) {
  if (!isFirebaseEnabled || !userId) return

  const db = getFirebaseFirestore()
  if (!db) return

  try {
    const userRef = doc(db, "users", userId)
    
    await updateDoc(userRef, {
      preferred_model: model,
      updated_at: serverTimestamp()
    })
    
    // Also save as an activity
    await saveUserActivity(userId, {
      type: "model_preference_changed",
      data: { model, previous_model: null }
    })
    
    console.log("Model preference saved to Firestore:", model)
  } catch (error) {
    console.error("Error saving model preference:", error)
  }
}

/**
 * Saves chat message to Firestore
 */
export async function saveChatMessage(userId: string, chatId: string, message: {
  id: string
  content: string
  role: "user" | "assistant"
  model?: string
  timestamp?: any
}) {
  if (!isFirebaseEnabled || !userId || !chatId) return

  const db = getFirebaseFirestore()
  if (!db) return

  try {
    const chatRef = doc(db, "chats", chatId)
    const messageRef = doc(db, "messages", message.id)
    
    // Save individual message
    await setDoc(messageRef, {
      ...message,
      chatId,
      userId,
      timestamp: message.timestamp || serverTimestamp()
    })
    
    // Update chat with message reference
    await setDoc(chatRef, {
      id: chatId,
      userId,
      messages: arrayUnion(message.id),
      lastMessage: message.content,
      lastMessageAt: serverTimestamp(),
      model: message.model || null,
      updated_at: serverTimestamp()
    }, { merge: true })
    
    // Save as user activity
    await saveUserActivity(userId, {
      type: "message_sent",
      data: {
        chatId,
        messageId: message.id,
        role: message.role,
        model: message.model
      }
    })
    
    console.log("Chat message saved to Firestore:", message.id)
  } catch (error) {
    console.error("Error saving chat message:", error)
  }
}

/**
 * Saves chat history to Firestore
 */
export async function saveChatHistory(userId: string, chatId: string, chatData: {
  title?: string
  model?: string
  agent?: string
  messages: any[]
}) {
  if (!isFirebaseEnabled || !userId || !chatId) return

  const db = getFirebaseFirestore()
  if (!db) return

  try {
    const chatRef = doc(db, "chats", chatId)
    
    await setDoc(chatRef, {
      id: chatId,
      userId,
      title: chatData.title || "New Chat",
      model: chatData.model || null,
      agent: chatData.agent || null,
      messageCount: chatData.messages.length,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }, { merge: true })
    
    // Save each message
    for (const message of chatData.messages) {
      await saveChatMessage(userId, chatId, message)
    }
    
    console.log("Chat history saved to Firestore:", chatId)
  } catch (error) {
    console.error("Error saving chat history:", error)
  }
}

/**
 * Saves user preferences to Firestore
 */
export async function saveUserPreferences(userId: string, preferences: any) {
  if (!isFirebaseEnabled || !userId) return

  const db = getFirebaseFirestore()
  if (!db) return

  try {
    const userRef = doc(db, "users", userId)
    
    await updateDoc(userRef, {
      preferences,
      updated_at: serverTimestamp()
    })
    
    // Save as user activity
    await saveUserActivity(userId, {
      type: "preferences_updated",
      data: { preferences }
    })
    
    console.log("User preferences saved to Firestore")
  } catch (error) {
    console.error("Error saving user preferences:", error)
  }
}

/**
 * Saves user session data to Firestore
 */
export async function saveUserSession(userId: string, sessionData: {
  deviceInfo?: string
  location?: string
  userAgent?: string
}) {
  if (!isFirebaseEnabled || !userId) return

  const db = getFirebaseFirestore()
  if (!db) return

  try {
    const sessionRef = doc(db, "user_sessions", `${userId}_${Date.now()}`)
    
    await setDoc(sessionRef, {
      userId,
      ...sessionData,
      timestamp: serverTimestamp()
    })
    
    console.log("User session saved to Firestore")
  } catch (error) {
    console.error("Error saving user session:", error)
  }
}

/**
 * Retrieves user's chat history from Firestore
 */
export async function getUserChatHistory(userId: string) {
  if (!isFirebaseEnabled || !userId) return null

  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      return userDoc.data()
    }
    
    return null
  } catch (error) {
    console.error("Error retrieving user chat history:", error)
    return null
  }
}

/**
 * Comprehensive user data backup
 */
export async function backupUserData(userId: string, userData: {
  profile: any
  preferences: any
  chats: any[]
  activities: any[]
}) {
  if (!isFirebaseEnabled || !userId) return

  const db = getFirebaseFirestore()
  if (!db) return

  try {
    const backupRef = doc(db, "user_backups", `${userId}_${Date.now()}`)
    
    await setDoc(backupRef, {
      userId,
      ...userData,
      timestamp: serverTimestamp()
    })
    
    console.log("User data backup completed")
  } catch (error) {
    console.error("Error backing up user data:", error)
  }
}
