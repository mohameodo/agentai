import { isFirebaseEnabled } from "./firebase/config"
import { getFirebaseFirestore } from "./firebase/client"
import { doc, getDoc } from "firebase/firestore"
import { decryptKey } from "./encryption"
import { env } from "./openproviders/env"

export type Provider = "openai" | "mistral" | "google" | "anthropic" | "xai" | "cloudflare" | "ollama"

export async function getUserKey(userId: string, provider: Provider): Promise<string | null> {
  try {
    if (!isFirebaseEnabled) return null

    const db = getFirebaseFirestore()
    if (!db) return null

    const userKeyDoc = await getDoc(doc(db, "user_keys", `${userId}_${provider}`))
    if (!userKeyDoc.exists()) return null

    const data = userKeyDoc.data()
    if (!data.encrypted_key || !data.iv) return null

    return decryptKey(data.encrypted_key, data.iv)
  } catch (error) {
    console.error("Error retrieving user key:", error)
    return null
  }
}

export async function getEffectiveApiKey(userId: string | null, provider: Provider): Promise<string | null> {
  if (userId) {
    const userKey = await getUserKey(userId, provider)
    if (userKey) return userKey
  }

  const envKeyMap: Record<Provider, string | undefined> = {
    openai: env.OPENAI_API_KEY,
    mistral: env.MISTRAL_API_KEY,
    google: env.GOOGLE_GENERATIVE_AI_API_KEY,
    anthropic: env.ANTHROPIC_API_KEY,
    xai: env.XAI_API_KEY,
    cloudflare: process.env.CLOUDFLARE_API_TOKEN,
    ollama: undefined, // Ollama doesn't require API keys
  }

  return envKeyMap[provider] || null
}
