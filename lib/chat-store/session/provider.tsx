"use client"

import { usePathname } from "next/navigation"
import { createContext, useContext, useMemo } from "react"

const ChatSessionContext = createContext<{ chatId: string | null }>({
  chatId: null,
})

export const useChatSession = () => useContext(ChatSessionContext)

export function ChatSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const chatId = useMemo(() => {
    // Handle regular chat routes
    if (pathname?.startsWith("/chats/")) return pathname.split("/chats/")[1]
    // Handle CodeHat routes
    if (pathname?.startsWith("/codehat/")) return pathname.split("/codehat/")[1]
    // Handle public share routes
    if (pathname?.startsWith("/agents/")) return pathname.split("/agents/")[1]
    return null
  }, [pathname])

  return (
    <ChatSessionContext.Provider value={{ chatId }}>
      {children}
    </ChatSessionContext.Provider>
  )
}
