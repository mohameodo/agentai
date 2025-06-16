import { NextRequest, NextResponse } from "next/server"
import { getEffectiveApiKey, Provider } from "@/lib/user-keys"
import { validateCsrfToken } from "@/lib/csrf"
import { isFirebaseEnabled } from "@/lib/firebase/config"

export async function POST(request: NextRequest) {
  try {
    const { provider, userId, csrfToken } = await request.json()
    
    if (!validateCsrfToken(csrfToken)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 401 })
    }

    if (!isFirebaseEnabled) {
      return NextResponse.json({ error: "Firebase not available" }, { status: 500 })
    }

    const apiKey = await getEffectiveApiKey(userId, provider as Provider)
    
    const envKeyMap: Record<Provider, string | undefined> = {
      openai: process.env.OPENAI_API_KEY,
      mistral: process.env.MISTRAL_API_KEY,
      google: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      xai: process.env.XAI_API_KEY,
      cloudflare: process.env.CLOUDFLARE_API_TOKEN,
      ollama: undefined, // Ollama doesn't require API keys
    }
    
    return NextResponse.json({ 
      hasUserKey: !!apiKey && apiKey !== envKeyMap[provider as Provider],
      provider 
    })
  } catch (error) {
    console.error("Error checking provider keys:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
