import { loadAgent } from "@/lib/agents/load-agent"
import { SYSTEM_PROMPT_DEFAULT } from "@/lib/config"
import { getAllModels } from "@/lib/models"
import { getProviderForModel } from "@/lib/openproviders/provider-map"
import { Provider } from "@/lib/user-keys"
import { Attachment } from "@ai-sdk/ui-utils"
import { Message as MessageAISDK, streamText, ToolSet } from "ai"
import {
  logUserMessage,
  storeAssistantMessage,
  trackSpecialAgentUsage,
  validateAndTrackUsage,
} from "./api"
import { TOOL_REGISTRY } from "@/lib/tools"
import { movieSearchTool } from "@/lib/tools/tmdb/movieSearch/tool"
import { cleanMessagesForTools } from "./utils"

export const maxDuration = 60

type ChatRequest = {
  messages: MessageAISDK[]
  chatId: string
  userId: string
  model: string
  isAuthenticated: boolean
  systemPrompt: string
  agentId?: string
  preferredImageModel?: string  
  videoStreamingEnabled?: boolean
  isThinkMode?: boolean
}

// Image generation keywords and patterns
const IMAGE_GENERATION_PATTERNS = [
  /\b(generate|create|make|draw|paint|design|produce)\s+(?:an?\s+)?(image|picture|photo|artwork|illustration|drawing|painting)\b/i,
  /\b(image|picture|photo|artwork|illustration|drawing|painting)\s+(?:of|for|with|showing|depicting)\b/i,
  /\b(visualize|illustrate|depict|show\s+me)\b/i,
  /\b(text\s*to\s*image|t2i)\b/i,
]

// Movie and TV search keywords and patterns
const MOVIE_SEARCH_PATTERNS = [
  /\b(movie|film|cinema|flick)\b/i,
  /\b(tv\s*show|television|series|episode)\b/i,
  /\b(watch|stream|streaming)\b/i,
  /\b(actor|actress|director|cast)\b/i,
  /\b(recommend|suggestion|similar\s+to)\b.*\b(movie|film|show|series)\b/i,
  /\b(what\s+should\s+i\s+watch|good\s+movies|best\s+shows)\b/i,
  /\b(netflix|hulu|disney|amazon\s+prime|hbo)\b/i,
  /\b(genre|comedy|drama|action|thriller|horror|romance|sci-fi|fantasy)\b.*\b(movie|film|show|series)\b/i,
]

function detectImageGenerationRequest(content: string): boolean {
  return IMAGE_GENERATION_PATTERNS.some(pattern => pattern.test(content))
}

function detectMovieSearchRequest(content: string): boolean {
  return MOVIE_SEARCH_PATTERNS.some(pattern => pattern.test(content))
}

async function handleImageGeneration(
  content: string, 
  userId: string, 
  isAuthenticated: boolean,
  chatId: string,
  preferredImageModel?: string
): Promise<Response> {
  try {
    // Extract the prompt from the message
    let prompt = content
    
    // Clean up the prompt by removing generation keywords
    prompt = prompt.replace(/\b(please\s+)?(generate|create|make|draw|paint|design|produce)\s+(?:an?\s+)?(image|picture|photo|artwork|illustration|drawing|painting)\s+(?:of|for|with|showing|depicting)?\s*/gi, '').trim()
    prompt = prompt.replace(/\b(visualize|illustrate|depict|show\s+me)\s*/gi, '').trim()
    
    if (!prompt) {
      prompt = content // Fallback to original content if cleaning removes everything
    }

    // Use user's preferred model or default
    const defaultImageModel = preferredImageModel || "@cf/lykon/dreamshaper-8-lcm"

    // Generate image using the existing API
    const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: defaultImageModel,
        userId,
        isAuthenticated,
      }),
    })

    const imageData = await imageResponse.json()

    if (!imageResponse.ok) {
      throw new Error(imageData.error || "Failed to generate image")
    }

    // Create a response message with the generated image data
    const assistantMessage = `I've generated an image for you based on your prompt: "${prompt}"`

    // Store the assistant message with special image metadata
    const messageWithImage = {
      role: "assistant" as const,
      content: assistantMessage,
      imageData: {
        imageUrl: imageData.imageUrl,
        prompt,
        model: defaultImageModel,
        remainingGenerations: imageData.remainingGenerations
      }
    }

    // TODO: Store the assistant message in Firebase if needed
    // For now, just log the image generation result
    console.log("Image generated:", {
      chatId,
      prompt,
      model: defaultImageModel,
      imageUrl: imageData.imageUrl
    })

    // Return a streaming response with image data
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Send the text content
        controller.enqueue(encoder.encode(`0:${JSON.stringify(assistantMessage)}\n`))
        
        // Send image data as a custom data chunk
        controller.enqueue(encoder.encode(`2:${JSON.stringify({
          type: "image-generation",
          imageUrl: imageData.imageUrl,
          prompt,
          model: defaultImageModel,
          remainingGenerations: imageData.remainingGenerations
        })}\n`))
        
        // Close the stream
        setTimeout(() => {
          controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`))
          controller.close()
        }, 100)
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Chat-Id': chatId,
      }
    })

  } catch (error) {
    console.error("Image generation error:", error)
    
    // Return error as assistant message with proper streaming format
    const errorMessage = `I apologize, but I couldn't generate an image right now. ${(error as Error).message || 'Please try again later.'}`
    
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Send error message directly
        controller.enqueue(encoder.encode(`0:${JSON.stringify(errorMessage)}\n`))
        controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`))
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Chat-Id': chatId,
      }
    })
  }
}

export async function POST(req: Request) {
  try {
    const {
      messages,
      chatId,
      userId,
      model,
      isAuthenticated,
      systemPrompt,
      agentId,
      preferredImageModel,
      videoStreamingEnabled,
      isThinkMode,
    } = (await req.json()) as ChatRequest

    if (!messages || !chatId || !userId) {
      return new Response(
        JSON.stringify({ error: "Error, missing information" }),
        { status: 400 }
      )
    }

    const isValidUser = await validateAndTrackUsage({
      userId,
      model,
      isAuthenticated,
    })

    const userMessage = messages[messages.length - 1]

    if (isValidUser && userMessage?.role === "user") {
      await logUserMessage({
        userId,
        chatId,
        content: userMessage.content,
        attachments: userMessage.experimental_attachments as Attachment[],
        model,
        isAuthenticated,
      })
    }

    // Check if this is an image generation request
    if (userMessage?.role === "user" && typeof userMessage.content === "string") {
      if (detectImageGenerationRequest(userMessage.content)) {
        return await handleImageGeneration(
          userMessage.content,
          userId,
          isAuthenticated,
          chatId,
          preferredImageModel
        )
      }
    }

    let agentConfig = null

    if (agentId) {
      agentConfig = await loadAgent(agentId)
    }

    const allModels = await getAllModels()
    const modelConfig = allModels.find((m) => m.id === model)

    if (!modelConfig || !modelConfig.apiSdk) {
      throw new Error(`Model ${model} not found`)
    }

    const effectiveSystemPrompt =
      agentConfig?.systemPrompt || systemPrompt || SYSTEM_PROMPT_DEFAULT

    // Enhanced system prompt for Think Mode
    let finalSystemPrompt = effectiveSystemPrompt
    
    // Check if Think Mode is enabled and model supports reasoning
    const supportsReasoning = modelConfig.reasoning === true
    if (isThinkMode && supportsReasoning) {
      finalSystemPrompt = `${effectiveSystemPrompt}

THINK MODE ENABLED: You are now in enhanced reasoning mode. Please think through this problem step by step. Show your reasoning process, consider multiple perspectives, analyze potential solutions, and provide a thorough, well-reasoned response. Take your time to carefully consider all aspects of the question or problem before providing your final answer.`
    }

    let toolsToUse = undefined

    if (agentConfig?.tools) {
      toolsToUse = agentConfig.tools
      if (isValidUser) {
        await trackSpecialAgentUsage(userId)
      }
    } else {
      // Check if the user's message suggests movie/TV search and if streaming is enabled
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage && lastUserMessage.role === 'user') {
        const isMovieRequest = detectMovieSearchRequest(lastUserMessage.content)
        
        if (isMovieRequest && process.env.TMDB_API_KEY && videoStreamingEnabled !== false) {
          toolsToUse = {
            tmdbMovieSearch: movieSearchTool
          }
        }
      }
    }

    // Clean messages when switching between agents with different tool capabilities
    const hasTools = !!toolsToUse && Object.keys(toolsToUse).length > 0
    const cleanedMessages = cleanMessagesForTools(messages, hasTools)

    let streamError: Error | null = null

    let apiKey: string | undefined
    if (isAuthenticated && userId) {
      const { getEffectiveApiKey } = await import("@/lib/user-keys")
      const provider = getProviderForModel(model)
      apiKey =
        (await getEffectiveApiKey(userId, provider as Provider)) || undefined
    }

    const result = streamText({
      model: modelConfig.apiSdk(apiKey),
      system: finalSystemPrompt,
      messages: cleanedMessages,
      tools: toolsToUse as ToolSet,
      maxSteps: 10,
      onError: (err: unknown) => {
        console.error("🛑 streamText error:", err)
        streamError = new Error(
          (err as { error?: string })?.error ||
            "AI generation failed. Please check your model or API key."
        )
      },

      onFinish: async ({ response }) => {
        if (isValidUser) {
          await storeAssistantMessage({
            chatId,
            messages:
              response.messages as unknown as import("@/app/types/api.types").Message[],
          })
        }
      },
    })

    if (streamError) {
      throw streamError
    }

    const originalResponse = result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
    })
    const headers = new Headers(originalResponse.headers)
    headers.set("X-Chat-Id", chatId)

    return new Response(originalResponse.body, {
      status: originalResponse.status,
      headers,
    })
  } catch (err: unknown) {
    console.error("Error in /api/chat:", err)
    // Return a structured error response if the error is a UsageLimitError.
    const error = err as { code?: string; message?: string }
    if (error.code === "DAILY_LIMIT_REACHED") {
      return new Response(
        JSON.stringify({ error: error.message, code: error.code }),
        { status: 403 }
      )
    }

    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    )
  }
}
