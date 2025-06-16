import { Chat } from "@/app/components/chat/chat"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: { chatId: string } }) {
  if (!isFirebaseEnabled) {
    notFound()
  }

  const { chatId } = params

  // TODO: Implement Firebase server-side auth and chat fetching
  // For now, return the component with chatId
  return (
    <MessagesProvider>
      <LayoutApp>
        <Chat />
      </LayoutApp>
    </MessagesProvider>
  )
}
