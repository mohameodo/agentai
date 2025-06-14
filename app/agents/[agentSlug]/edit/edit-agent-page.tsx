"use client"

import { EditAgentForm } from "@/app/components/agents/dialog-create-agent/edit-agent-form"
import type { Agent } from "@/app/types/agent"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface EditAgentPageProps {
  agent: Agent
}

export function EditAgentPage({ agent }: EditAgentPageProps) {
  const router = useRouter()

  const handleSave = async (formData: {
    name: string
    description: string
    systemPrompt: string
    tools: string[]
    avatarUrl: string
    isPublic: boolean
  }) => {
    try {
      const response = await fetch("/api/update-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: agent.id,
          name: formData.name,
          description: formData.description,
          system_prompt: formData.systemPrompt,
          tools: formData.tools,
          avatar_url: formData.avatarUrl,
          is_public: formData.isPublic,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update agent")
      }

      toast.success("Agent updated successfully!")
      router.push(`/agents/${agent.slug}`)
      router.refresh()
    } catch (error) {
      console.error("Error updating agent:", error)
      toast.error("Failed to update agent")
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/delete-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: agent.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete agent")
      }

      toast.success("Agent deleted successfully!")
      router.push("/agents")
      router.refresh()
    } catch (error) {
      console.error("Error deleting agent:", error)
      toast.error("Failed to delete agent")
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Agent</h1>
        <p className="text-muted-foreground">Update your agent's details</p>
      </div>
      
      <EditAgentForm
        agent={agent}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => router.back()}
      />
    </div>
  )
}
