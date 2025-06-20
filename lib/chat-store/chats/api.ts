import { filterLocalAgentId } from "@/lib/agents/utils"
import { readFromIndexedDB, writeToIndexedDB } from "@/lib/chat-store/persist"
import type { Chat, Chats } from "@/lib/chat-store/types"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { MODEL_DEFAULT } from "../../config"
import { fetchClient } from "../../fetch"
import {
  API_ROUTE_CREATE_CHAT,
  API_ROUTE_UPDATE_CHAT_AGENT,
  API_ROUTE_UPDATE_CHAT_MODEL,
} from "../../routes"
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore"

export async function getChatsForUserInDb(userId: string): Promise<Chats[]> {
  if (!isFirebaseEnabled) return []
  const db = getFirebaseFirestore()
  if (!db) return []

  try {
    const chatsRef = collection(db, "chats")
    const q = query(chatsRef, where("user_id", "==", userId), orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(q)
    const chats: Chats[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      chats.push({
        id: doc.id,
        title: data.title,
        created_at: (data.created_at as Timestamp)?.toDate()?.toISOString() || new Date().toISOString(),
        model: data.model,
        agent_id: data.agent_id || null,
        user_id: data.user_id,
        public: data.public || true,
      } as Chats)
    })
    return chats
  } catch (error) {
    console.error("Failed to fetch chats:", error)
    return []
  }
}

export async function updateChatTitleInDb(id: string, title: string) {
  if (!isFirebaseEnabled) return
  const db = getFirebaseFirestore()
  if (!db) return

  try {
    const chatRef = doc(db, "chats", id)
    await updateDoc(chatRef, { title })
  } catch (error) {
    console.error("Error updating chat title:", error)
    throw error
  }
}

export async function deleteChatInDb(id: string) {
  // Chat deletion disabled to prevent accidental data loss and reduce Firebase writes
  console.warn("Chat deletion disabled to prevent Firebase quota exhaustion")
  return
}

export async function getAllUserChatsInDb(userId: string): Promise<Chats[]> {
  return getChatsForUserInDb(userId)
}

export async function createChatInDb(
  userId: string,
  title: string,
  model: string,
  systemPrompt: string
): Promise<string | null> {
  if (!isFirebaseEnabled) return null
  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    const docRef = await addDoc(collection(db, "chats"), {
      user_id: userId,
      title,
      model,
      system_prompt: systemPrompt,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating chat:", error)
    return null
  }
}

export async function fetchAndCacheChats(userId: string): Promise<Chats[]> {
  if (!isFirebaseEnabled) {
    return await getCachedChats()
  }

  const data = await getChatsForUserInDb(userId)

  if (data.length > 0) {
    await writeToIndexedDB("chats", data)
  }

  return data
}

export async function getCachedChats(): Promise<Chats[]> {
  const all = await readFromIndexedDB<Chats>("chats")
  return (all as Chats[]).sort(
    (a, b) => +new Date(b.created_at || "") - +new Date(a.created_at || "")
  )
}

export async function updateChatTitle(
  id: string,
  title: string
): Promise<void> {
  await updateChatTitleInDb(id, title)
  const all = await getCachedChats()
  const updated = (all as Chats[]).map((c) =>
    c.id === id ? { ...c, title } : c
  )
  await writeToIndexedDB("chats", updated)
}

export async function deleteChat(id: string): Promise<void> {
  // Chat deletion disabled to prevent accidental data loss and reduce Firebase writes
  console.warn("Chat deletion disabled to prevent Firebase quota exhaustion")
  return
}

export async function getChat(chatId: string): Promise<Chat | null> {
  const all = await readFromIndexedDB<Chat>("chats")
  return (all as Chat[]).find((c) => c.id === chatId) || null
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const data = await getAllUserChatsInDb(userId)
  if (!data) return []
  await writeToIndexedDB("chats", data)
  return data
}

export async function createChat(
  userId: string,
  title: string,
  model: string,
  systemPrompt: string
): Promise<string> {
  const id = await createChatInDb(userId, title, model, systemPrompt)
  const finalId = id ?? crypto.randomUUID()

  await writeToIndexedDB("chats", {
    id: finalId,
    title,
    model,
    user_id: userId,
    system_prompt: systemPrompt,
    created_at: new Date().toISOString(),
  })

  return finalId
}

export async function updateChatModel(chatId: string, model: string) {
  try {
    const res = await fetchClient(API_ROUTE_UPDATE_CHAT_MODEL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, model }),
    })
    const responseData = await res.json()

    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to update chat model: ${res.status} ${res.statusText}`
      )
    }

    const all = await getCachedChats()
    const updated = (all as Chats[]).map((c) =>
      c.id === chatId ? { ...c, model } : c
    )
    await writeToIndexedDB("chats", updated)

    return responseData
  } catch (error) {
    console.error("Error updating chat model:", error)
    throw error
  }
}

export async function createNewChat(
  userId: string,
  title?: string,
  model?: string,
  isAuthenticated?: boolean,
  agentId?: string
): Promise<Chats> {
  try {
    // Note: Local agent IDs are filtered out at the API level (create-chat route)
    const payload: { userId: string; title: string; model: string; isAuthenticated?: boolean; agentId?: string } = {
      userId,
      title: title || (agentId ? `Conversation with agent` : "New Chat"),
      model: model || MODEL_DEFAULT,
      isAuthenticated,
    }

    if (agentId) {
      payload.agentId = agentId
    }

    const res = await fetchClient(API_ROUTE_CREATE_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const responseData = await res.json()

    if (!res.ok || !responseData.chat) {
      throw new Error(responseData.error || "Failed to create chat")
    }

    const chat: Chats = {
      id: responseData.chat.id,
      title: responseData.chat.title,
      created_at: responseData.chat.created_at,
      model: responseData.chat.model,
      agent_id: responseData.chat.agent_id,
      user_id: responseData.chat.user_id,
      public: responseData.chat.public,
    }

    await writeToIndexedDB("chats", chat)
    return chat
  } catch (error) {
    console.error("Error creating new chat:", error)
    throw error
  }
}

export async function updateChatAgent(
  userId: string,
  chatId: string,
  agentId: string | null,
  isAuthenticated: boolean
) {
  try {
    // Filter out local agent IDs for database operations
    const dbAgentId = filterLocalAgentId(agentId)

    const res = await fetchClient(API_ROUTE_UPDATE_CHAT_AGENT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        chatId,
        agentId: dbAgentId,
        isAuthenticated,
      }),
    })
    const responseData = await res.json()

    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to update chat agent: ${res.status} ${res.statusText}`
      )
    }

    const all = await getCachedChats()
    const updated = (all as Chats[]).map((c) =>
      c.id === chatId ? { ...c, agent_id: dbAgentId } : c
    )
    await writeToIndexedDB("chats", updated)

    return responseData
  } catch (error) {
    console.error("Error updating chat agent:", error)
    throw error
  }
}
