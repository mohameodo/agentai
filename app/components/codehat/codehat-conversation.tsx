"use client"

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { Message as MessageType } from "@ai-sdk/react"
import { useRef } from "react"
import { Message } from "../chat/message"
import { CodeHatMessage } from "./codehat-message"

type CodeHatConversationProps = {
  messages: MessageType[]
  status?: "streaming" | "ready" | "submitted" | "error"
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
  onReload: () => void
}

export function CodeHatConversation({
  messages,
  status = "ready",
  onDelete,
  onEdit,
  onReload,
}: CodeHatConversationProps) {
  const initialMessageCount = useRef(messages.length)

  if (!messages || messages.length === 0)
    return <div className="h-full w-full"></div>

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 mx-auto flex w-full flex-col justify-center">
        <div className="h-app-header bg-background flex w-full lg:hidden lg:h-0" />
        <div className="h-app-header bg-background flex w-full mask-b-from-4% mask-b-to-100% lg:hidden" />
      </div>
      <ChatContainerRoot className="relative w-full">
        <ChatContainerContent
          className="flex w-full flex-col items-center pt-20 pb-4"
          style={{
            scrollbarGutter: "stable both-edges",
            scrollbarWidth: "none",
          }}
        >
          {messages?.map((message, index) => {
            const isLast =
              index === messages.length - 1 && status !== "submitted"
            const hasScrollAnchor =
              isLast && messages.length > initialMessageCount.current

            // Use CodeHat message component for assistant messages with code blocks
            const hasCodeBlocks = message.role === "assistant" && 
              message.content && 
              /```[\s\S]*?```/.test(message.content)

            if (hasCodeBlocks) {
              return (
                <CodeHatMessage
                  key={message.id}
                  variant={message.role}
                  id={message.id}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onReload={onReload}
                  isLast={isLast}
                  hasScrollAnchor={hasScrollAnchor}
                  attachments={message.experimental_attachments}
                  parts={message.parts}
                  status={status}
                >
                  {message.content}
                </CodeHatMessage>
              )
            }

            return (
              <Message
                key={message.id}
                variant={message.role}
                id={message.id}
                onDelete={onDelete}
                onEdit={onEdit}
                onReload={onReload}
                isLast={isLast}
                hasScrollAnchor={hasScrollAnchor}
                attachments={message.experimental_attachments}
                parts={message.parts}
                status={status}
              >
                {message.content}
              </Message>
            )
          })}
        </ChatContainerContent>
        <ScrollButton />
      </ChatContainerRoot>
    </div>
  )
}
