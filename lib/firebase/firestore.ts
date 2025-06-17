import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from "firebase/firestore"
import { getFirebaseFirestore } from "./client"
import { isFirebaseEnabled } from "./config"

export interface FirestoreUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  profile_image?: string
  anonymous?: boolean
  special_agent_count?: number
  special_agent_reset?: Timestamp
  premium?: boolean
  daily_pro_message_count?: number
  daily_pro_reset?: Timestamp
  last_active_at?: Timestamp
  preferences?: any
  system_prompt?: string
  created_at: Timestamp
  updated_at: Timestamp
}

export interface FirestoreAgent {
  id: string
  name: string
  slug: string
  description: string
  system_prompt: string
  creator_id?: string
  creator_name?: string
  avatar_url?: string
  is_public: boolean
  is_curated: boolean
  remixable: boolean
  tools_enabled: boolean
  example_inputs?: string[]
  tags?: string[]
  category?: string
  model_preference?: string
  max_steps?: number
  mcp_config?: any
  tools?: string[]
  created_at: Timestamp
  updated_at: Timestamp
}

export interface FirestoreChat {
  id: string
  user_id: string
  agent_id?: string
  title?: string
  summary?: string
  model_provider?: string
  model_name?: string
  temperature?: number
  max_tokens?: number
  created_at: Timestamp
  updated_at: Timestamp
}

export interface FirestoreMessage {
  id: string
  chat_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model_provider?: string
  model_name?: string
  tokens_used?: number
  created_at: Timestamp
}

// Generic Firestore operations
export async function createDocument<T>(collectionName: string, data: Partial<T>, customId?: string) {
  if (!isFirebaseEnabled) {
    return null
  }

  const db = getFirebaseFirestore()
  if (!db) {
    return null
  }

  try {
    const timestamp = serverTimestamp()
    const docData = {
      ...data,
      created_at: timestamp,
      updated_at: timestamp
    }

    if (customId) {
      const docRef = doc(db, collectionName, customId)
      await setDoc(docRef, docData)
      return { id: customId, ...docData }
    } else {
      const docRef = await addDoc(collection(db, collectionName), docData)
      return { id: docRef.id, ...docData }
    }
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error)
    return null
  }
}

export async function getDocument<T>(collectionName: string, documentId: string): Promise<T | null> {
  if (!isFirebaseEnabled) {
    return null
  }

  const db = getFirebaseFirestore()
  if (!db) {
    return null
  }

  try {
    const docRef = doc(db, collectionName, documentId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }
    return null
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error)
    return null
  }
}

export async function updateDocument<T>(collectionName: string, documentId: string, updates: Partial<T>) {
  if (!isFirebaseEnabled) {
    return false
  }

  const db = getFirebaseFirestore()
  if (!db) {
    return false
  }

  try {
    const docRef = doc(db, collectionName, documentId)
    const updateData = {
      ...updates as any,
      updated_at: serverTimestamp()
    }
    await updateDoc(docRef, updateData)
    return true
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    return false
  }
}

export async function deleteDocument(collectionName: string, documentId: string) {
  // Document deletion disabled to prevent accidental data loss and reduce Firebase writes
  console.warn(`Document deletion disabled for ${collectionName}/${documentId} to prevent Firebase quota exhaustion`)
  return false
}

export async function queryDocuments<T>(
  collectionName: string,
  filters: Array<{ field: string; operator: any; value: any }> = [],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'asc',
  limitCount?: number
): Promise<T[]> {
  if (!isFirebaseEnabled) {
    return []
  }

  const db = getFirebaseFirestore()
  if (!db) {
    return []
  }

  try {
    let q = collection(db, collectionName)
    let queryRef: any = q

    // Apply filters
    filters.forEach(filter => {
      queryRef = query(queryRef, where(filter.field, filter.operator, filter.value))
    })

    // Apply ordering
    if (orderByField) {
      queryRef = query(queryRef, orderBy(orderByField, orderDirection))
    }

    // Apply limit
    if (limitCount) {
      queryRef = query(queryRef, limit(limitCount))
    }

    const querySnapshot = await getDocs(queryRef)
    const documents: T[] = []
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...(doc.data() as any) } as T)
    })

    return documents
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error)
    return []
  }
}

export function subscribeToDocument<T>(
  collectionName: string,
  documentId: string,
  callback: (data: T | null) => void
) {
  // Real-time sync disabled to prevent Firebase quota exhaustion
  callback(null)
  return () => {}
}

export function subscribeToCollection<T>(
  collectionName: string,
  callback: (data: T[]) => void,
  filters: Array<{ field: string; operator: any; value: any }> = [],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'asc'
) {
  // Real-time sync disabled to prevent Firebase quota exhaustion
  callback([])
  return () => {}
}
