import { Timestamp } from "firebase/firestore"

export interface FirebaseUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  profile_image?: string
  display_name?: string
  anonymous?: boolean
  special_agent_count?: number
  special_agent_reset?: Timestamp
  premium?: boolean
  daily_pro_message_count?: number
  daily_message_count?: number
  message_count?: number
  daily_pro_reset?: Timestamp
  last_active_at?: Timestamp
  model_preference?: string
  preferences?: {
    theme?: string
    language?: string
    model_preference?: string
    temperature?: number
    max_tokens?: number
    streaming?: boolean
    auto_save?: boolean
    notifications?: boolean
    analytics?: boolean
    beta_features?: boolean
    sidebar_collapsed?: boolean
    chat_history_enabled?: boolean
    system_prompt?: string
    [key: string]: any
  }
  system_prompt?: string
  created_at: Timestamp
  updated_at: Timestamp
}

export interface FirebaseAgent {
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
  mcp_config?: {
    server: string
    variables: string[]
  }
  tools?: string[]
  created_at: Timestamp
  updated_at: Timestamp
}

export interface FirebaseChat {
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

export interface FirebaseMessage {
  id: string
  chat_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model_provider?: string
  model_name?: string
  tokens_used?: number
  experimental_attachments?: any[]
  user_id?: string
  created_at: Timestamp
}

export interface FirebaseChatAttachment {
  id: string
  chat_id: string
  file_name: string
  file_type: string
  file_size: number
  storage_path: string
  download_url: string
  created_at: Timestamp
}

export interface FirebaseUserKey {
  id: string
  user_id: string
  provider: string
  encrypted_key: string
  iv: string
  created_at: Timestamp
  updated_at: Timestamp
}

export interface FirebaseFeedback {
  id: string
  user_id: string
  content: string
  rating?: number
  category?: string
  created_at: Timestamp
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  AGENTS: 'agents',
  CHATS: 'chats',
  MESSAGES: 'messages',
  CHAT_ATTACHMENTS: 'chat_attachments',
  USER_KEYS: 'user_keys',
  FEEDBACK: 'feedback'
} as const

// Helper types for API compatibility
export type DatabaseUser = FirebaseUser
export type DatabaseAgent = FirebaseAgent
export type DatabaseChat = FirebaseChat
export type DatabaseMessage = FirebaseMessage
