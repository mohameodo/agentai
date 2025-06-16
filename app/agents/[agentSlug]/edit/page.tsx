import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore, getFirebaseAuth } from "@/lib/firebase/client"
import { doc, getDoc } from "firebase/firestore"
import { notFound, redirect } from "next/navigation"
import { EditAgentPage } from "./edit-agent-page"

export const dynamic = "force-dynamic"

export default async function Page({
  params,
}: {
  params: Promise<{ agentSlug: string }>
}) {
  if (!isFirebaseEnabled) {
    notFound()
  }

  const db = getFirebaseFirestore()
  const auth = getFirebaseAuth()
  
  if (!db || !auth) {
    notFound()
  }

  // TODO: Implement proper Firebase server-side auth check
  // For now, we'll need to handle auth on client side since this is server component
  const { agentSlug } = await params

  try {
    // Get the agent from Firestore
    const agentRef = doc(db, "agents", agentSlug)
    const agentDoc = await getDoc(agentRef)

    if (!agentDoc.exists()) {
      notFound()
    }

    const agent = { id: agentDoc.id, ...agentDoc.data() } as any

    // Note: Server-side auth check would need firebase-admin
    // For now, we'll rely on client-side auth in the EditAgentPage component
    
    return (
      <MessagesProvider>
        <LayoutApp>
          <EditAgentPage agent={agent} />
        </LayoutApp>
      </MessagesProvider>
    )
  } catch (error) {
    console.error("Error fetching agent:", error)
    notFound()
  }
}
