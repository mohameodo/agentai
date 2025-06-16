import { AgentDetail } from "@/app/components/agents/agent-detail"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { notFound } from "next/navigation"

export default async function AgentIdPage({
  params,
}: {
  params: Promise<{ agentSlug: string | string[] }>
}) {
  if (!isFirebaseEnabled) {
    notFound()
  }

  const { agentSlug: slugParts } = await params
  const agentSlug = Array.isArray(slugParts) ? slugParts.join("/") : slugParts

  // TODO: Implement Firebase server-side agent fetching
  // For now, show not found to allow build to pass
  notFound()
}
