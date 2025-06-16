import { getFirebaseFirestore } from "@/lib/firebase/client" // Changed import
import { isFirebaseEnabled } from "@/lib/firebase/config"
import type { Message as MessageAISDK } from "ai"
import { readFromIndexedDB, writeToIndexedDB } from "../persist"
import { collection, query, where, getDocs, orderBy, addDoc, writeBatch, doc, Timestamp } from "firebase/firestore";

export async function getMessagesFromDb(
  chatId: string
): Promise<MessageAISDK[]> {
  if (!isFirebaseEnabled) {
    const cached = await getCachedMessages(chatId)
    return cached
  }

  const db = getFirebaseFirestore()
  if (!db) return []

  try {
    const messagesRef = collection(db, "messages")
    const q = query(messagesRef, where("chat_id", "==", chatId), orderBy("created_at", "asc"))
    const querySnapshot = await getDocs(q)
    const messages: MessageAISDK[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      messages.push({
        id: doc.id,
        content: data.content ?? "",
        role: data.role as MessageAISDK['role'],
        createdAt: (data.created_at as Timestamp)?.toDate() || new Date(),
        experimental_attachments: data.experimental_attachments,
        parts: data.parts,
      } as MessageAISDK)
    })
    return messages
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return []
  }
}

async function insertMessageToDb(chatId: string, message: MessageAISDK) {
  if (!isFirebaseEnabled) return;
  const db = getFirebaseFirestore()
  if (!db) return

  try {
    await addDoc(collection(db, "messages"), {
      chat_id: chatId,
      role: message.role,
      content: message.content,
      experimental_attachments: message.experimental_attachments,
      created_at: message.createdAt || Timestamp.now(),
      parts: message.parts,
      // user_id: message.user_id // Assuming user_id might be part of MessageAISDK or added if needed
    })
  } catch (error) {
    console.error("Error inserting message to DB:", error)
  }
}

async function insertMessagesToDb(chatId: string, messages: MessageAISDK[]) {
  if (!isFirebaseEnabled) return;
  const db = getFirebaseFirestore()
  if (!db) return

  try {
    const batch = writeBatch(db)
    messages.forEach((message) => {
      const docRef = doc(collection(db, "messages")) // Automatically generate ID
      batch.set(docRef, {
        chat_id: chatId,
        role: message.role,
        content: message.content,
        experimental_attachments: message.experimental_attachments,
        created_at: message.createdAt || Timestamp.now(),
        parts: message.parts,
        // user_id: message.user_id
      })
    })
    await batch.commit()
  } catch (error) {
    console.error("Error inserting messages to DB:", error)
  }
}

async function deleteMessagesFromDb(chatId: string) {
  // Message deletion disabled to prevent accidental data loss and reduce Firebase writes
  console.warn("Message deletion disabled to prevent Firebase quota exhaustion")
  return
}

type ChatMessageEntry = {
  id: string
  messages: MessageAISDK[]
}

export async function getCachedMessages(
  chatId: string
): Promise<MessageAISDK[]> {
  const entry = await readFromIndexedDB<ChatMessageEntry>("messages", chatId)

  if (!entry || Array.isArray(entry)) return []

  return (entry.messages || []).sort(
    (a, b) => +new Date(a.createdAt || 0) - +new Date(b.createdAt || 0)
  )
}

export async function cacheMessages(
  chatId: string,
  messages: MessageAISDK[]
): Promise<void> {
  await writeToIndexedDB("messages", { id: chatId, messages })
}

export async function addMessage(
  chatId: string,
  message: MessageAISDK
): Promise<void> {
  await insertMessageToDb(chatId, message)
  const current = await getCachedMessages(chatId)
  const updated = [...current, message]

  await writeToIndexedDB("messages", { id: chatId, messages: updated })
}

export async function setMessages(
  chatId: string,
  messages: MessageAISDK[]
): Promise<void> {
  await insertMessagesToDb(chatId, messages)
  await writeToIndexedDB("messages", { id: chatId, messages })
}

export async function clearMessagesCache(chatId: string): Promise<void> {
  await writeToIndexedDB("messages", { id: chatId, messages: [] })
}

export async function clearMessagesForChat(chatId: string): Promise<void> {
  // Message deletion disabled to prevent accidental data loss and reduce Firebase writes
  console.warn("Message clearing disabled to prevent Firebase quota exhaustion")
  return
}
