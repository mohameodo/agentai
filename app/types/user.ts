// Firebase-compatible UserProfile type
export interface UserProfile {
  id: string
  email: string
  name?: string
  display_name?: string
  profile_image?: string
  avatar_url?: string
  anonymous?: boolean
  special_agent_count?: number
  premium?: boolean
  daily_pro_message_count?: number
  daily_message_count?: number
  message_count?: number
  preferred_model?: string
  preferences?: Record<string, any>
  system_prompt?: string
  created_at?: Date | string
  updated_at?: Date | string
  daily_reset?: Date | string
  special_agent_reset?: Date | string
  last_active_at?: Date | string
}
