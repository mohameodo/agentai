import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { notFound } from "next/navigation"
import { BrowseAgentsPage } from "@/app/components/agents/browse-agents-page"

export const dynamic = "force-dynamic"

export default async function Page() {
  if (!isFirebaseEnabled) {
    notFound()
  }

  // TODO: Implement Firebase server-side auth and Firestore queries
  // For now, return empty data to prevent build errors
  const publicAgents: any[] = []
  const userId: string | null = null

  return (
    <MessagesProvider>
      <LayoutApp>
        <BrowseAgentsPage
          agents={publicAgents}
          userId={userId}
        />
      </LayoutApp>
    </MessagesProvider>
  )
}
