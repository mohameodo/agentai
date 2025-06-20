export type OpenAIModel =
  | "o1"
  | "o1-2024-12-17"
  | "o1-mini"
  | "o1-mini-2024-09-12"
  | "o1-preview"
  | "o1-preview-2024-09-12"
  | "o3-mini"
  | "o3-mini-2025-01-31"
  | "o3"
  | "gpt-4.1"
  | "gpt-4.1-2025-04-14"
  | "gpt-4.1-mini"
  | "gpt-4.1-mini-2025-04-14"
  | "gpt-4.1-nano"
  | "gpt-4.1-nano-2025-04-14"
  | "gpt-4o"
  | "gpt-4o-2024-05-13"
  | "gpt-4o-2024-08-06"
  | "gpt-4o-2024-11-20"
  | "gpt-4o-audio-preview"
  | "gpt-4o-audio-preview-2024-10-01"
  | "gpt-4o-audio-preview-2024-12-17"
  | "gpt-4o-search-preview"
  | "gpt-4o-search-preview-2025-03-11"
  | "gpt-4o-mini"
  | "gpt-4o-mini-2024-07-18"
  | "gpt-4-turbo"
  | "gpt-4-turbo-2024-04-09"
  | "gpt-4-turbo-preview"
  | "gpt-4-0125-preview"
  | "gpt-4-1106-preview"
  | "gpt-4"
  | "gpt-4-0613"
  | "gpt-4.5-preview"
  | "gpt-4.5-preview-2025-02-27"
  | "gpt-3.5-turbo-0125"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-1106"
  | "chatgpt-4o-latest"
  | "gpt-3.5-turbo-instruct"

export type MistralModel =
  | "ministral-3b-latest"
  | "ministral-8b-latest"
  | "mistral-large-latest"
  | "mistral-small-latest"
  | "pixtral-large-latest"
  | "pixtral-12b-2409"
  | "open-mistral-7b"
  | "open-mixtral-8x7b"
  | "open-mixtral-8x22b"

export type GeminiModel =
  | "gemini-2.0-flash-001"
  | "gemini-1.5-flash"
  | "gemini-1.5-flash-latest"
  | "gemini-1.5-flash-001"
  | "gemini-1.5-flash-002"
  | "gemini-1.5-flash-8b"
  | "gemini-1.5-flash-8b-latest"
  | "gemini-1.5-flash-8b-001"
  | "gemini-1.5-pro"
  | "gemini-1.5-pro-latest"
  | "gemini-1.5-pro-001"
  | "gemini-1.5-pro-002"
  | "gemini-2.5-pro-exp-03-25"
  | "gemini-2.0-flash-lite-preview-02-05"
  | "gemini-2.0-pro-exp-02-05"
  | "gemini-2.0-flash-thinking-exp-01-21"
  | "gemini-2.0-flash-exp"
  | "gemini-exp-1206"
  | "gemma-3-27b-it"
  | "learnlm-1.5-pro-experimental"

export type AnthropicModel =
  | "claude-3-7-sonnet-20250219"
  | "claude-3-5-sonnet-latest"
  | "claude-3-5-sonnet-20241022"
  | "claude-3-5-sonnet-20240620"
  | "claude-3-5-haiku-latest"
  | "claude-3-5-haiku-20241022"
  | "claude-3-opus-latest"
  | "claude-3-opus-20240229"
  | "claude-3-sonnet-20240229"
  | "claude-3-haiku-20240307"

export type XaiModel =
  | "grok-3"
  | "grok-3-latest"
  | "grok-3-fast"
  | "grok-3-fast-latest"
  | "grok-3-mini"
  | "grok-3-mini-latest"
  | "grok-3-mini-fast"
  | "grok-3-mini-fast-latest"
  | "grok-2-vision-1212"
  | "grok-2-vision"
  | "grok-2-vision-latest"
  | "grok-2-image-1212"
  | "grok-2-image"
  | "grok-2-image-latest"
  | "grok-2-1212"
  | "grok-2"
  | "grok-2-latest"
  | "grok-vision-beta"
  | "grok-beta"

// Static Ollama models for type safety
export type StaticOllamaModel =
  | "llama3.2:latest"
  | "qwen2.5-coder:latest"

// Dynamic Ollama model type - allows any string for auto-detected models
export type OllamaModel = StaticOllamaModel | (string & {})

// Cloudflare Workers AI models
export type CloudflareModel =
  | "@cf/meta/llama-3.1-8b-instruct"
  | "@cf/meta/llama-2-7b-chat-int8"
  | "@cf/google/gemma-2b-it-lora"
  | "@cf/google/gemma-7b-it-lora"
  | "@cf/nexusflow/starling-lm-7b-beta"
  | "@cf/thebloke/llamaguard-7b-awq"
  | "@cf/thebloke/neural-chat-7b-v3-1-awq"
  | "@cf/mistral/mistral-7b-instruct-v0.2-lora"
  | "@cf/tinyllama/tinyllama-1.1b-chat-v1.0"
  | "@cf/mistral/mistral-7b-instruct-v0.2"
  | "@cf/fblgit/una-cybertron-7b-v2-bf16"
  | "@cf/thebloke/discolm-german-7b-v1-awq"
  | "@cf/thebloke/mistral-7b-instruct-v0.1-awq"
  | "@cf/qwen/qwen1.5-7b-chat-awq"
  | "@cf/thebloke/llama-2-13b-chat-awq"
  | "@cf/thebloke/deepseek-coder-6.7b-base-awq"
  | "@cf/meta-llama/llama-2-7b-chat-hf-lora"
  | "@cf/thebloke/openhermes-2.5-mistral-7b-awq"
  | "@cf/thebloke/deepseek-coder-6.7b-instruct-awq"
  | "@cf/deepseek-ai/deepseek-math-7b-instruct"
  | "@cf/tiiuae/falcon-7b-instruct"
  | "@cf/nousresearch/hermes-2-pro-mistral-7b"
  | "@cf/thebloke/zephyr-7b-beta-awq"
  | "@cf/qwen/qwen1.5-1.8b-chat"
  | "@cf/defog/sqlcoder-7b-2"
  | "@cf/microsoft/phi-2"
  | "@cf/google/gemma-7b-it"
  | "@cf/qwen/qwen1.5-14b-chat-awq"
  | "@cf/openchat/openchat-3.5-0106"
  | "@cf/llava-hf/llava-1.5-7b-hf"
  | "@cf/unum/uform-gen2-qwen-500m"
  // Image Generation Models
  | "@cf/runwayml/stable-diffusion-v1-5-inpainting"
  | "@cf/bytedance/stable-diffusion-xl-lightning"
  | "@cf/lykon/dreamshaper-8-lcm"
  | "@cf/stabilityai/stable-diffusion-xl-base-1.0"
  | "@cf/runwayml/stable-diffusion-v1-5-img2img"

export type Provider = "openai" | "mistral" | "google" | "anthropic" | "xai" | "ollama" | "cloudflare"

export type SupportedModel =
  | OpenAIModel
  | MistralModel
  | GeminiModel
  | AnthropicModel
  | XaiModel
  | OllamaModel
  | CloudflareModel
