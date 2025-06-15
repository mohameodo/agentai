"use client"

import { HistoryTrigger } from "@/app/components/history/history-trigger"
import { AppInfoTrigger } from "@/app/components/layout/app-info/app-info-trigger"
import { ButtonNewChat } from "@/app/components/layout/button-new-chat"
import { UserMenu } from "@/app/components/layout/user-menu"
import { Logo } from "@/app/components/logo"
import { ModelSelector } from "@/components/common/model-selector/base"
import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import type { Agent } from "@/app/types/agent"
import { Button } from "@/components/ui/button"
import { useAgent } from "@/lib/agent-store/provider"
import { APP_NAME, MODEL_DEFAULT } from "@/lib/config"
import { useUser } from "@/lib/user-store/provider"
import { Info, Code } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

import { DialogPublish } from "./dialog-publish"
import { HeaderSidebarTrigger } from "./header-sidebar-trigger"

export type AgentHeader = Pick<
  Agent,
  "name" | "description" | "avatar_url" | "slug"
>

export function Header({ hasSidebar }: { hasSidebar: boolean }) {
  const isMobile = useBreakpoint(768)
  const { user, updateUser } = useUser()
  const { currentAgent } = useAgent()
  const pathname = usePathname()
  const [selectedModelId, setSelectedModelId] = useState<string>(
    user?.preferred_model || MODEL_DEFAULT
  )

  useEffect(() => {
    if (user?.preferred_model) {
      setSelectedModelId(user.preferred_model)
    }
  }, [user?.preferred_model])

  const handleModelSelection = async (value: string) => {
    setSelectedModelId(value)
    await updateUser({ preferred_model: value })
  }

  const isLoggedIn = !!user
  const isCodeHatActive = pathname.startsWith('/codehat')
  const isChatPage = pathname.startsWith('/c/') || pathname === '/'

  return (
    <header className="h-app-header pointer-events-none fixed top-0 right-0 left-0 z-50">
      <div className="relative mx-auto flex h-full max-w-full items-center justify-between bg-transparent px-4 sm:px-6 lg:bg-transparent lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-1 items-center gap-2 pl-0 md:pl-0.5">
            {hasSidebar && !isCodeHatActive && <HeaderSidebarTrigger />}
            {Boolean(!currentAgent || !isMobile) && (
              <div className="flex flex-1 items-center gap-6">
                <Link
                  href="/"
                  className="pointer-events-auto flex items-center  text-xl font-medium tracking-tight"
                >
                  <Logo className="h-8 w-8" />
                </Link>
                
                {/* Navigation Tabs */}
                
                {/* Model Selector - Left side for desktop on chat pages */}
                {isChatPage && isLoggedIn && !isMobile && (
                  <div className="pointer-events-auto ml-2 mt-2">
                    <ModelSelector
                      selectedModelId={selectedModelId}
                      setSelectedModelId={handleModelSelection}
                      className="border-0 bg-transparent shadow-none hover:bg-transparent focus:bg-transparent px-1 py-1"
                      align="start"
                      side="bottom"
                    />
                  </div>
                )}
                
                {/* Model Selector - Center for mobile on chat pages */}
                {isChatPage && isLoggedIn && isMobile && (
                  <div className="pointer-events-auto flex-1 flex justify-center max-w-xs">
                    <ModelSelector
                      selectedModelId={selectedModelId}
                      setSelectedModelId={handleModelSelection}
                      className="w-full border-0 bg-transparent shadow-none hover:bg-transparent focus:bg-transparent"
                      align="center"
                      side="bottom"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <div />
          {!isLoggedIn ? (
            <div className="pointer-events-auto flex flex-1 items-center justify-end gap-4">
              <AppInfoTrigger
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background hover:bg-muted text-muted-foreground h-8 w-8 rounded-full"
                    aria-label={`About ${APP_NAME}`}
                  >
                    <Info className="size-4" />
                  </Button>
                }
              />
              <Link
                href="/auth"
                className="font-base text-muted-foreground hover:text-foreground text-base transition-colors"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="pointer-events-auto flex flex-1 items-center justify-end gap-2">
              {currentAgent && <DialogPublish />}
              {!isCodeHatActive && <ButtonNewChat />}
              {!hasSidebar && !isCodeHatActive && <HistoryTrigger hasSidebar={hasSidebar} />}
              {!isCodeHatActive && <UserMenu />}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
