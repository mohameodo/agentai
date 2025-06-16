"use client"

import { PopoverContentAuth } from "@/app/components/chat-input/popover-content-auth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/toast"
import { fetchClient } from "@/lib/fetch"
import { API_ROUTE_CREATE_AGENT } from "@/lib/routes"
import { useUser } from "@/lib/user-store/provider"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { useBreakpoint } from "../../../hooks/use-breakpoint"
import { CreateAgentForm } from "./create-agent-form"

type AgentFormData = {
  name: string
  description: string
  systemPrompt: string
  tools: string[]
  useNexiloopAsCreator: boolean
  avatarUrl: string
  isPublic: boolean
}

type DialogCreateAgentTrigger = {
  trigger: React.ReactNode
}

// @todo: add drawer
export function DialogCreateAgentTrigger({
  trigger,
}: DialogCreateAgentTrigger) {
  const { user } = useUser()
  const isAuthenticated = !!user?.id
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    description: "",
    systemPrompt: "You are a helpful assistant created by Nexiloop. You help users with their questions and tasks. Be friendly, helpful, and informative in your responses.",
    tools: [],
    useNexiloopAsCreator: true,
    avatarUrl: "",
    isPublic: true,
  })
  const [error, setError] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isMobile = useBreakpoint(768)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error for this field if it exists
    if (error[name]) {
      setError({ ...error, [name]: "" })
    }
  }

  const handleToolsChange = (selectedTools: string[]) => {
    setFormData({ ...formData, tools: selectedTools })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Agent name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.systemPrompt.trim()) {
      newErrors.systemPrompt = "System prompt is required"
    }

    setError(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFormDataChange = (data: Partial<AgentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create an agent.",
      })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const apiResponse = await fetchClient(API_ROUTE_CREATE_AGENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          systemPrompt: formData.systemPrompt,
          avatar_url: formData.avatarUrl || null,
          mcp_config: null,
          example_inputs: [
            `How can you help me with ${formData.name.toLowerCase()}?`,
            "What are your capabilities?",
            "Can you assist me with my questions?",
          ],
          tools: formData.tools,
          remixable: false,
          is_public: formData.isPublic,
          max_steps: 5,
          useNexiloopAsCreator: formData.useNexiloopAsCreator,
          userId: user?.id, // Pass userId to API
        }),
      })

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json()
        throw new Error(errorData.error || "Failed to create agent")
      }

      const { agent } = await apiResponse.json()

      // Close the dialog and redirect
      setOpen(false)
      router.push(`/?agent=${agent.slug}`)
    } catch (error: unknown) {
      console.error("Agent creation error:", error)
      toast({
        title: "Error creating agent",
        description:
          (error as Error).message || "Failed to create agent. Please try again.",
      })
      setError({ form: "Failed to create agent. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const content = (
    <CreateAgentForm
      formData={formData}
      error={error}
      isLoading={isLoading}
      handleInputChange={handleInputChange}
      handleToolsChange={handleToolsChange}
      handleFormDataChange={handleFormDataChange}
      handleSubmit={handleSubmit}
      onClose={() => setOpen(false)}
      isDrawer={isMobile}
    />
  )

  if (!isAuthenticated) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContentAuth />
      </Popover>
    )
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">{content}</DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-xl">
        <div
          className="h-full w-full"
          // Prevent the dialog from closing when clicking on the content, needed because of the agent-command component
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <DialogHeader className="border-border border-b px-6 py-4">
            <DialogTitle>Create agent (experimental)</DialogTitle>
          </DialogHeader>
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}
