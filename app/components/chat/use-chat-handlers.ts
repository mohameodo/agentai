import { useChatDraft } from "@/app/hooks/use-chat-draft"
import { UserProfile } from "@/app/types/user"
import { toast } from "@/components/ui/toast"
import { Message } from "@ai-sdk/react"
import { useCallback } from "react"

type UseChatHandlersProps = {
  messages: Message[]
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
  setInput: (input: string) => void
  setSelectedModel: (model: string) => void
  selectedModel: string
  chatId: string | null
  updateChatModel: (chatId: string, model: string) => Promise<void>
  updateUser: (updates: Partial<UserProfile>) => Promise<boolean>
  user: UserProfile | null
}

export function useChatHandlers({
  messages,
  setMessages,
  setInput,
  setSelectedModel,
  selectedModel,
  chatId,
  updateChatModel,
  updateUser,
  user,
}: UseChatHandlersProps) {
  const { setDraftValue } = useChatDraft(chatId)

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value)
      setDraftValue(value)
    },
    [setInput, setDraftValue]
  )

  const handleModelChange = useCallback(
    async (model: string) => {
      if (!user?.id) {
        return
      }

      setSelectedModel(model)

      // If no chatId (new chat), update user's preferred model
      if (!chatId && user?.id) {
        try {
          const success = await updateUser({ preferred_model: model })
          if (!success) {
            console.error("Failed to save model preference")
          }
        } catch (error) {
          console.error("Error updating user preferred model:", error)
        }
        return
      }

      // If existing chat, update the chat's model
      const oldModel = selectedModel

      try {
        await updateChatModel(chatId!, model)
      } catch (err) {
        console.error("Failed to update chat model:", err)
        setSelectedModel(oldModel)
        toast({
          title: "Failed to update chat model",
          status: "error",
        })
      }
    },
    [chatId, selectedModel, setSelectedModel, updateChatModel, updateUser, user?.id]
  )

  const handleDelete = useCallback(
    (id: string) => {
      setMessages(messages.filter((message) => message.id !== id))
    },
    [messages, setMessages]
  )

  const handleEdit = useCallback(
    (id: string, newText: string) => {
      setMessages(
        messages.map((message) =>
          message.id === id ? { ...message, content: newText } : message
        )
      )
    },
    [messages, setMessages]
  )

  return {
    handleInputChange,
    handleModelChange,
    handleDelete,
    handleEdit,
  }
}
