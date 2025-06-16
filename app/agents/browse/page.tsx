import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { notFound } from "next/navigation"
import { BrowseAgentsPage } from "@/app/components/agents/browse-agents-page"

export const dynamic = "force-dynamic"

export default async function Page() {
  if (!isFirebaseEnabled) {
    notFound()
  }

  // TODO: Implement Firebase server-side data fetching
  // For now, return with empty data to allow build to pass
  const publicAgents: any[] = []
  const userId = null

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
