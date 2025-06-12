"use client"

import { useAgentCommand } from "@/app/components/chat-input/use-agent-command"
import { ModelSelector } from "@/components/common/model-selector/base"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { useAgent } from "@/lib/agent-store/provider"
import { getModelInfo } from "@/lib/models"
import { cn } from "@/lib/utils"
import { ArrowUp, Lightbulb, Stop, Warning } from "@phosphor-icons/react"
import React, { useCallback, useEffect, useState } from "react"
import { PromptSystem } from "../suggestions/prompt-system"
import { AgentCommand } from "./agent-command"
import { ButtonFileUpload } from "./button-file-upload"
import { ButtonSearch } from "./button-search"
import { FileList } from "./file-list"
import { SelectedAgent } from "./selected-agent"
import { useSearchAgent } from "./use-search-agent"

type ChatInputProps = {
  value: string
  onValueChange: (value: string) => void
  onSend: () => void
  isSubmitting?: boolean
  hasMessages?: boolean
  files: File[]
  onFileUpload: (files: File[]) => void
  onFileRemove: (file: File) => void
  onFileProcessed?: (processedBlob: Blob, originalFile: File) => void
  onSuggestion: (suggestion: string) => void
  hasSuggestions?: boolean
  onSelectModel: (model: string) => void
  selectedModel: string
  isUserAuthenticated: boolean
  stop: () => void
  status?: "submitted" | "streaming" | "ready" | "error"
  onSearchToggle?: (enabled: boolean, agentId: string | null) => void
}

export function ChatInput({
  value,
  onValueChange,
  onSend,
  isSubmitting,
  files,
  onFileUpload,
  onFileRemove,
  onFileProcessed,
  onSuggestion,
  hasSuggestions,
  onSelectModel,
  selectedModel,
  isUserAuthenticated,
  stop,
  status,
  onSearchToggle,
}: ChatInputProps) {
  const { currentAgent, curatedAgents, userAgents } = useAgent()
  const [isThinkMode, setIsThinkMode] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const {
    isSearchEnabled,
    toggleSearch,

  } = useSearchAgent()

  const agentCommand = useAgentCommand({
    value,
    onValueChange,
    agents: [...(curatedAgents || []), ...(userAgents || [])],
    defaultAgent: currentAgent,
  })

  const selectModelConfig = getModelInfo(selectedModel)
  const hasToolSupport = Boolean(selectModelConfig?.tools)
  const isOnlyWhitespace = (text: string) => !/[^\s]/.test(text)

  // Handle search toggle
  const handleSearchToggle = useCallback(
    (enabled: boolean) => {
      toggleSearch(enabled)
      const agentId = enabled ? "search" : null
      onSearchToggle?.(enabled, agentId)
    },
    [toggleSearch, onSearchToggle]
  )

  const handleSend = useCallback(() => {
    if (isSubmitting) {
      return
    }

    if (status === "streaming") {
      stop()
      return
    }

    onSend()
  }, [isSubmitting, onSend, status, stop])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // First process agent command related key handling
      agentCommand.handleKeyDown(e)

      if (isSubmitting) {
        e.preventDefault()
        return
      }

      if (e.key === "Enter" && status === "streaming") {
        e.preventDefault()
        return
      }

      if (e.key === "Enter" && !e.shiftKey && !agentCommand.showAgentCommand) {
        if (isOnlyWhitespace(value)) {
          return
        }

        e.preventDefault()
        onSend()
      }
    },
    [agentCommand, isSubmitting, onSend, status, value]
  )

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const hasImageContent = Array.from(items).some((item) =>
        item.type.startsWith("image/")
      )

      if (!isUserAuthenticated && hasImageContent) {
        e.preventDefault()
        return
      }

      if (isUserAuthenticated && hasImageContent) {
        const imageFiles: File[] = []

        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile()
            if (file) {
              const newFile = new File(
                [file],
                `pasted-image-${Date.now()}.${file.type.split("/")[1]}`,
                { type: file.type }
              )
              imageFiles.push(newFile)
            }
          }
        }

        if (imageFiles.length > 0) {
          onFileUpload(imageFiles)
        }
      }
      // Text pasting will work by default for everyone
    },
    [isUserAuthenticated, onFileUpload]
  )

  useEffect(() => {
    const el = agentCommand.textareaRef.current
    if (!el) return
    el.addEventListener("paste", handlePaste)
    return () => el.removeEventListener("paste", handlePaste)
  }, [agentCommand.textareaRef, handlePaste])

  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <div className="relative flex w-full flex-col gap-4">
      {hasSuggestions && (
        <PromptSystem
          onValueChange={onValueChange}
          onSuggestion={onSuggestion}
          value={value}
        />
      )}
      <div className="relative order-2 px-2 pb-6 sm:pb-4 md:order-1">
        <PromptInput
          className="bg-popover relative z-10 p-0 pt-1 shadow-xs backdrop-blur-xl"
          maxHeight={200}
          value={value}
          onValueChange={agentCommand.handleValueChange}
        >
          {agentCommand.showAgentCommand && (
            <div className="absolute bottom-full left-0 w-full">
              <AgentCommand
                isOpen={agentCommand.showAgentCommand}
                searchTerm={agentCommand.agentSearchTerm}
                onSelect={agentCommand.handleAgentSelect}
                onClose={agentCommand.closeAgentCommand}
                activeIndex={agentCommand.activeAgentIndex}
                onActiveIndexChange={agentCommand.setActiveAgentIndex}
                curatedAgents={curatedAgents || []}
                userAgents={userAgents || []}
              />
            </div>
          )}
          <SelectedAgent
            selectedAgent={agentCommand.selectedAgent}
            removeSelectedAgent={agentCommand.removeSelectedAgent}
          />
          <FileList 
            files={files} 
            onFileRemove={onFileRemove} 
            onFileProcessed={onFileProcessed}
          />
          <PromptInputTextarea
            placeholder="Ask nexiloop anything..."
            onKeyDown={handleKeyDown}
            className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
            ref={agentCommand.textareaRef}
          />
          <PromptInputActions className="mt-5 w-full justify-between px-3 pb-3">
            <div className="flex gap-2">
              <ButtonFileUpload
                onFileUpload={onFileUpload}
                isUserAuthenticated={isUserAuthenticated}
                model={selectedModel}
              />
    
              <Button
                size="sm"
                variant="secondary"
                className={cn(
                  "border-border dark:bg-secondary rounded-full border bg-transparent transition-all duration-150 flex items-center gap-1 px-3 h-9",
                  isThinkMode &&
                    "border-pink-500/20 bg-pink-50 text-pink-700 hover:bg-pink-50 hover:text-pink-700 dark:bg-pink-500/10"
                )}
                onClick={() => setIsThinkMode(!isThinkMode)}
                aria-label="Think mode"
                title="Think mode"
              >
                <Lightbulb className="size-4" />
                <span className="text-sm">Think</span>
              </Button>
              <ButtonSearch
                isSelected={isSearchEnabled}
                onToggle={handleSearchToggle}
                isAuthenticated={isUserAuthenticated}
              />
              {currentAgent && !hasToolSupport && (
                <div className="flex items-center gap-1">
                  <Warning className="size-4" />
                  <p className="line-clamp-2 text-xs">
                    {selectedModel} does not support tools. Agents may not work
                    as expected.
                  </p>
                </div>
              )}
            </div>
            <PromptInputAction
              tooltip={status === "streaming" ? "Stop" : "Send"}
            >
              <Button
                size="sm"
                className="size-9 rounded-full transition-all duration-300 ease-out"
                disabled={hydrated ? (!value || isSubmitting || isOnlyWhitespace(value)) : true}
                type="button"
                variant="secondary"
                onClick={handleSend}
                aria-label={status === "streaming" ? "Stop" : "Send message"}
              >
                {status === "streaming" ? (
                  <Stop className="size-4" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  )
}
