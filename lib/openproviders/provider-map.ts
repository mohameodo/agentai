import type { Provider, SupportedModel } from "./types"

// map each model ID to its provider
const MODEL_PROVIDER_MAP: Record<string, Provider> = {
  "o1": "openai",
  "o1-2024-12-17": "openai",
  "o1-mini": "openai",
  "o1-mini-2024-09-12": "openai",
  "o1-preview": "openai",
  "o1-preview-2024-09-12": "openai",
  "o3-mini": "openai",
  "o3-mini-2025-01-31": "openai",
  "gpt-4.1": "openai",
  "gpt-4.1-2025-04-14": "openai",
  "gpt-4.1-mini": "openai",
  "gpt-4.1-mini-2025-04-14": "openai",
  "gpt-4.1-nano": "openai",
  "gpt-4.1-nano-2025-04-14": "openai",
  "gpt-4o": "openai",
  "gpt-4o-2024-05-13": "openai",
  "gpt-4o-2024-08-06": "openai",
  "gpt-4o-2024-11-20": "openai",
  "gpt-4o-audio-preview": "openai",
  "gpt-4o-audio-preview-2024-10-01": "openai",
  "gpt-4o-audio-preview-2024-12-17": "openai",
  "gpt-4o-search-preview": "openai",
  "gpt-4o-search-preview-2025-03-11": "openai",
  "gpt-4o-mini": "openai",
  "gpt-4o-mini-2024-07-18": "openai",
  "gpt-4-turbo": "openai",
  "gpt-4-turbo-2024-04-09": "openai",
  "gpt-4-turbo-preview": "openai",
  "gpt-4-0125-preview": "openai",
  "gpt-4-1106-preview": "openai",
  "gpt-4": "openai",
  "gpt-4-0613": "openai",
  "gpt-4.5-preview": "openai",
  "gpt-4.5-preview-2025-02-27": "openai",
  "gpt-3.5-turbo-0125": "openai",
  "gpt-3.5-turbo": "openai",
  "gpt-3.5-turbo-1106": "openai",
  "chatgpt-4o-latest": "openai",
  "gpt-3.5-turbo-instruct": "openai",

  // Mistral
  "ministral-3b-latest": "mistral",
  "ministral-8b-latest": "mistral",
  "mistral-large-latest": "mistral",
  "mistral-small-latest": "mistral",
  "pixtral-large-latest": "mistral",
  "pixtral-12b-2409": "mistral",
  "open-mistral-7b": "mistral",
  "open-mixtral-8x7b": "mistral",
  "open-mixtral-8x22b": "mistral",

  // Google
  "gemini-2.0-flash-001": "google",
  "gemini-1.5-flash": "google",
  "gemini-1.5-flash-latest": "google",
  "gemini-1.5-flash-001": "google",
  "gemini-1.5-flash-002": "google",
  "gemini-1.5-flash-8b": "google",
  "gemini-1.5-flash-8b-latest": "google",
  "gemini-1.5-flash-8b-001": "google",
  "gemini-1.5-pro": "google",
  "gemini-1.5-pro-latest": "google",
  "gemini-1.5-pro-001": "google",
  "gemini-1.5-pro-002": "google",
  "gemini-2.5-pro-exp-03-25": "google",
  "gemini-2.0-flash-lite-preview-02-05": "google",
  "gemini-2.0-pro-exp-02-05": "google",
  "gemini-2.0-flash-thinking-exp-01-21": "google",
  "gemini-2.0-flash-exp": "google",
  "gemini-exp-1206": "google",
  "gemma-3-27b-it": "google",
  "learnlm-1.5-pro-experimental": "google",

  // Anthropic
  "claude-3-7-sonnet-20250219": "anthropic",
  "claude-3-5-sonnet-latest": "anthropic",
  "claude-3-5-sonnet-20241022": "anthropic",
  "claude-3-5-sonnet-20240620": "anthropic",
  "claude-3-5-haiku-latest": "anthropic",
  "claude-3-5-haiku-20241022": "anthropic",
  "claude-3-opus-latest": "anthropic",
  "claude-3-opus-20240229": "anthropic",
  "claude-3-sonnet-20240229": "anthropic",
  "claude-3-haiku-20240307": "anthropic",

  // XAI
  "grok-3": "xai",
  "grok-3-latest": "xai",
  "grok-3-fast": "xai",
  "grok-3-fast-latest": "xai",
  "grok-3-mini": "xai",
  "grok-3-mini-latest": "xai",
  "grok-3-mini-fast": "xai",
  "grok-3-mini-fast-latest": "xai",
  "grok-2-vision-1212": "xai",
  "grok-2-vision": "xai",
  "grok-2-vision-latest": "xai",
  "grok-2-image-1212": "xai",
  "grok-2-image": "xai",
  "grok-2-image-latest": "xai",
  "grok-2-1212": "xai",
  "grok-2": "xai",
  "grok-2-latest": "xai",
  "grok-vision-beta": "xai",
  "grok-beta": "xai",

  // Cloudflare Workers AI
  "@cf/meta/llama-3.1-8b-instruct": "cloudflare",
  "@cf/meta/llama-2-7b-chat-int8": "cloudflare",
  "@cf/google/gemma-2b-it-lora": "cloudflare",
  "@cf/google/gemma-7b-it-lora": "cloudflare",
  "@cf/nexusflow/starling-lm-7b-beta": "cloudflare",
  "@cf/thebloke/llamaguard-7b-awq": "cloudflare",
  "@cf/thebloke/neural-chat-7b-v3-1-awq": "cloudflare",
  "@cf/mistral/mistral-7b-instruct-v0.2-lora": "cloudflare",
  "@cf/tinyllama/tinyllama-1.1b-chat-v1.0": "cloudflare",
  "@cf/mistral/mistral-7b-instruct-v0.2": "cloudflare",
  "@cf/fblgit/una-cybertron-7b-v2-bf16": "cloudflare",
  "@cf/thebloke/discolm-german-7b-v1-awq": "cloudflare",
  "@cf/thebloke/mistral-7b-instruct-v0.1-awq": "cloudflare",
  "@cf/qwen/qwen1.5-7b-chat-awq": "cloudflare",
  "@cf/thebloke/llama-2-13b-chat-awq": "cloudflare",
  "@cf/thebloke/deepseek-coder-6.7b-base-awq": "cloudflare",
  "@cf/meta-llama/llama-2-7b-chat-hf-lora": "cloudflare",
  "@cf/thebloke/openhermes-2.5-mistral-7b-awq": "cloudflare",
  "@cf/thebloke/deepseek-coder-6.7b-instruct-awq": "cloudflare",
  "@cf/deepseek-ai/deepseek-math-7b-instruct": "cloudflare",
  "@cf/tiiuae/falcon-7b-instruct": "cloudflare",
  "@cf/nousresearch/hermes-2-pro-mistral-7b": "cloudflare",
  "@cf/thebloke/zephyr-7b-beta-awq": "cloudflare",
  "@cf/qwen/qwen1.5-1.8b-chat": "cloudflare",
  "@cf/defog/sqlcoder-7b-2": "cloudflare",
  "@cf/microsoft/phi-2": "cloudflare",
  "@cf/google/gemma-7b-it": "cloudflare",
  "@cf/qwen/qwen1.5-14b-chat-awq": "cloudflare",
  "@cf/openchat/openchat-3.5-0106": "cloudflare",
  "@cf/llava-hf/llava-1.5-7b-hf": "cloudflare",
  "@cf/unum/uform-gen2-qwen-500m": "cloudflare",
  // Cloudflare Image Generation Models
  "@cf/runwayml/stable-diffusion-v1-5-inpainting": "cloudflare",
  "@cf/bytedance/stable-diffusion-xl-lightning": "cloudflare",
  "@cf/lykon/dreamshaper-8-lcm": "cloudflare",
  "@cf/stabilityai/stable-diffusion-xl-base-1.0": "cloudflare",
  "@cf/runwayml/stable-diffusion-v1-5-img2img": "cloudflare",
  "@cf/black-forest-labs/flux-1-schnell": "cloudflare",
  "@cf/ideogram-ai/ideogram-v2-turbo": "cloudflare",
  "@cf/prompthero/openjourney-v4": "cloudflare",
  "@cf/tencent/hunyuan-dit": "cloudflare",

  // Static Ollama models
  "llama3.2:latest": "ollama",
  "qwen2.5-coder:latest": "ollama",
}

// Function to check if a model is likely an Ollama model based on naming patterns
function isOllamaModel(modelId: string): boolean {
  // Common Ollama model patterns
  const ollamaPatterns = [
    /^llama/i,
    /^qwen/i,
    /^deepseek/i,
    /^mistral:/i,
    /^codellama/i,
    /^phi/i,
    /^gemma/i,
    /^codegemma/i,
    /^starcoder/i,
    /^wizardcoder/i,
    /^solar/i,
    /^yi/i,
    /^openchat/i,
    /^vicuna/i,
    /^orca/i,
    /:latest$/i,
    /:[\d.]+[bB]?$/i, // version tags like :7b, :13b, :1.5
  ]
  
  return ollamaPatterns.some(pattern => pattern.test(modelId))
}

export function getProviderForModel(model: SupportedModel): Provider {
  // First check the static mapping
  const provider = MODEL_PROVIDER_MAP[model]
  if (provider) return provider
  
  // If not found in static mapping, check if it looks like an Ollama model
  if (isOllamaModel(model)) {
    return "ollama"
  }
  
  throw new Error(`Unknown provider for model: ${model}`)
}
