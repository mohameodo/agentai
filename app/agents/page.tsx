import { AgentsPage } from "@/app/components/agents/agents-page"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { CURATED_AGENTS_SLUGS } from "@/lib/config"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page() {
  if (!isFirebaseEnabled) {
    notFound()
  }

  const db = getFirebaseFirestore()

  if (!db) {
    notFound()
  }

  // TODO: Implement Firebase agent fetching
  // For now, show empty agents to allow build to pass
  const curatedAgents: any[] = []
  const userAgents: any[] = []
  const publicAgents: any[] = []

  return (
    <MessagesProvider>
      <LayoutApp>
        <AgentsPage
          curatedAgents={curatedAgents}
          userAgents={userAgents || null}
          publicAgents={publicAgents || null}
          userId={null}
        />
      </LayoutApp>
    </MessagesProvider>
  )
}
