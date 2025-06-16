import { DAILY_IMAGE_GENERATION_LIMIT } from "@/lib/config"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { NextResponse } from "next/server"

export const maxDuration = 60

type ImageGenerationRequest = {
  prompt: string
  model: string
  userId: string
  isAuthenticated: boolean
}

async function checkImageGenerationUsage(userId: string): Promise<{ canGenerate: boolean; usageCount: number }> {
  if (!isFirebaseEnabled) {
    return { canGenerate: false, usageCount: 0 }
  }

  const db = getFirebaseFirestore()
  if (!db) {
    return { canGenerate: false, usageCount: 0 }
  }

  const today = new Date().toISOString().split('T')[0]
  const startOfDay = new Date(`${today}T00:00:00.000Z`)
  const endOfDay = new Date(`${today}T23:59:59.999Z`)
  
  try {
    const q = query(
      collection(db, 'image_generations'),
      where('user_id', '==', userId),
      where('created_at', '>=', startOfDay),
      where('created_at', '<=', endOfDay)
    )

    const querySnapshot = await getDocs(q)
    const usageCount = querySnapshot.size
    const canGenerate = usageCount < DAILY_IMAGE_GENERATION_LIMIT

    return { canGenerate, usageCount }
  } catch (error) {
    console.error('Error checking image generation usage:', error)
    return { canGenerate: false, usageCount: 0 }
  }
}

async function trackImageGeneration(userId: string, model: string, prompt: string): Promise<void> {
  if (!isFirebaseEnabled) return

  const db = getFirebaseFirestore()
  if (!db) return

  try {
    await addDoc(collection(db, 'image_generations'), {
      user_id: userId,
      model,
      prompt,
      created_at: serverTimestamp(),
      generation_date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    })
  } catch (error) {
    console.error('Error tracking image generation:', error)
  }
}

export async function POST(req: Request) {
  try {
    const { prompt, model, userId, isAuthenticated } = (await req.json()) as ImageGenerationRequest

    if (!prompt || !model || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required for image generation" },
        { status: 401 }
      )
    }

    // Check daily usage limit
    const { canGenerate, usageCount } = await checkImageGenerationUsage(userId)
    
    if (!canGenerate) {
      return NextResponse.json(
        { 
          error: "Daily image generation limit reached",
          usageCount,
          limit: DAILY_IMAGE_GENERATION_LIMIT
        },
        { status: 429 }
      )
    }

    // Generate image using Cloudflare Workers AI
    try {
      // Get Cloudflare credentials from environment or user settings
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
      const apiToken = process.env.CLOUDFLARE_API_TOKEN

      if (!accountId || !apiToken) {
        return NextResponse.json(
          { error: "Cloudflare credentials not configured" },
          { status: 500 }
        )
      }

      // Call Cloudflare Workers AI API directly for image generation
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            num_inference_steps: 20,
            guidance_scale: 7.5,
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Cloudflare API error:', errorText)
        return NextResponse.json(
          { error: "Failed to generate image with Cloudflare Workers AI" },
          { status: 500 }
        )
      }

      // Handle the response - Cloudflare returns image data
      const result = await response.arrayBuffer()
      const base64Image = Buffer.from(result).toString('base64')
      const imageUrl = `data:image/png;base64,${base64Image}`

      // Track the generation
      await trackImageGeneration(userId, model, prompt)

      return NextResponse.json({
        success: true,
        imageUrl,
        usageCount: usageCount + 1,
        remainingGenerations: DAILY_IMAGE_GENERATION_LIMIT - (usageCount + 1)
      })

    } catch (imageError) {
      console.error('Image generation error:', imageError)
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Image generation API error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
