"use client"

import { AgentProvider } from "@/lib/agent-store/provider"
import { ChatsProvider } from "@/lib/chat-store/chats/provider"
import { UserPreferencesProvider } from "@/lib/user-preference-store/provider"
import { RealtimePreferenceSync } from "@/lib/user-preference-store/realtime-sync"
import { ModelPreferenceSync } from "@/lib/user-preference-store/model-sync"
import { useUser } from "@/lib/user-store/provider"
import { ReactNode } from "react"
import { DataPersistenceProvider } from "./data-persistence-provider"

interface DataProvidersProps {
  children: ReactNode
}

/**
 * Client-side wrapper that provides user-specific data providers
 * This ensures chat history, agents, and preferences are loaded for authenticated users
 */
export function DataProviders({ children }: DataProvidersProps) {
  const { user } = useUser()
  
  return (
    <ChatsProvider userId={user?.id}>
      <AgentProvider userId={user?.id}>
        <UserPreferencesProvider userId={user?.id}>
          <DataPersistenceProvider>
            <RealtimePreferenceSync>
              <ModelPreferenceSync>
                {children}
              </ModelPreferenceSync>
            </RealtimePreferenceSync>
          </DataPersistenceProvider>
        </UserPreferencesProvider>
      </AgentProvider>
    </ChatsProvider>
  )
}
