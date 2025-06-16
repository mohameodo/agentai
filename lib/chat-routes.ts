"use client"

import { usePathname } from "next/navigation"

export function useChatRoute() {
  const pathname = usePathname()
  
  const isCodeHat = pathname.startsWith('/codehat')
  
  const getChatRoute = (chatId: string) => {
    return isCodeHat ? `/codehat/${chatId}` : `/chats/${chatId}`
  }
  
  const getNewChatRoute = () => {
    return isCodeHat ? '/codehat' : '/'
  }

  return {
    isCodeHat,
    getChatRoute,
    getNewChatRoute,
  }
}