import { CodeHatChat } from "@/app/components/codehat/codehat-chat"
import { LayoutCodeHat } from "@/app/components/codehat/layout/layout-codehat"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"

export default async function CodeHatPage() {
  return (
    <MessagesProvider>
      <LayoutCodeHat>
        <CodeHatChat />
      </LayoutCodeHat>
    </MessagesProvider>
  )
}
