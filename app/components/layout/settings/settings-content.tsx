"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { cn, isDev } from "@/lib/utils"
import { GearSix, PaintBrush, PlugsConnected, X, Sparkle, Brain, Robot } from "@phosphor-icons/react"
import { useState } from "react"
import { InteractionPreferences } from "./appearance/interaction-preferences"
import { LayoutSettings } from "./appearance/layout-settings"
// Appearance tab components
import { ThemeSelection } from "./appearance/theme-selection"
import { ConnectionsPlaceholder } from "./connections/connections-placeholder"
// Connections tab components
import { DeveloperTools } from "./connections/developer-tools"
import { ProviderSettings } from "./connections/provider-settings"
import { AccountManagement } from "./general/account-management"
import { FeaturesSection } from "./general/features-section"
// General tab components
import { UserProfile } from "./general/user-profile"
// Agents tab components
import { AgentsSection } from "./agents/agents-section"
// Models tab components
import { ModelsSection } from "./models/models-section"

type SettingsContentProps = {
  onClose?: () => void
  isDrawer?: boolean
  isStandalonePage?: boolean
}

type TabType = "general" | "agents" | "models" | "features" | "appearance" | "connections"

export function SettingsContent({
  onClose,
  isDrawer = false,
  isStandalonePage = false,
}: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("general")

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        isDrawer ? "h-full min-h-screen overflow-y-auto p-0" : "py-0 overflow-y-auto"
      )}
    >
      {isDrawer && !isStandalonePage && (
        <div className="border-border mb-4 flex items-center justify-between border-b bg-background px-4 py-4 sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)}
        className={cn(
          "flex w-full",
          isDrawer ? "h-full flex-col" : "flex-row min-h-[400px]"
        )}
      >
        {isDrawer ? (
          // Mobile version - tabs on top, full height
          <div className="flex h-full w-full flex-col">
            <TabsList className="mb-6 mx-4 grid w-auto grid-cols-6 bg-muted/50 h-12">
              <TabsTrigger value="general" className="flex items-center gap-1 h-10">
                <GearSix className="size-3" />
                <span className="text-xs font-medium">General</span>
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-1 h-10">
                <Robot className="size-3" />
                <span className="text-xs font-medium">Agents</span>
              </TabsTrigger>
              <TabsTrigger value="models" className="flex items-center gap-1 h-10">
                <Brain className="size-3" />
                <span className="text-xs font-medium">Models</span>
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="flex items-center gap-1 h-10"
              >
                <Sparkle className="size-3" />
                <span className="text-xs font-medium">Features</span>
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-1 h-10"
              >
                <PaintBrush className="size-3" />
                <span className="text-xs font-medium">Appearance</span>
              </TabsTrigger>
              <TabsTrigger
                value="connections"
                className="flex items-center gap-1 h-10"
              >
                <PlugsConnected className="size-3" />
                <span className="text-xs font-medium">Connections</span>
              </TabsTrigger>
            </TabsList>

            {/* Mobile tabs content with full height and better spacing */}
            <div className="flex-1 overflow-y-auto px-4 pb-8">
              <TabsContent value="general" className="mt-0 space-y-8 h-full">
                <UserProfile />
                {isFirebaseEnabled && (
                  <>
                    <AccountManagement />
                  </>
                )}
              </TabsContent>

              <TabsContent value="agents" className="mt-0 space-y-8 h-full">
                {isFirebaseEnabled && <AgentsSection />}
              </TabsContent>

              <TabsContent value="models" className="mt-0 space-y-8 h-full">
                {isFirebaseEnabled && <ModelsSection />}
              </TabsContent>

              <TabsContent value="features" className="mt-0 space-y-8 h-full">
                <FeaturesSection />
              </TabsContent>

              <TabsContent value="appearance" className="mt-0 space-y-8 h-full">
                <ThemeSelection />
                <LayoutSettings />
                <InteractionPreferences />
              </TabsContent>

              <TabsContent value="connections" className="mt-0 space-y-8 h-full">
                {!isDev && <ConnectionsPlaceholder />}
                {isDev && <ProviderSettings />}
                {isDev && <DeveloperTools />}
              </TabsContent>
            </div>
          </div>
        ) : (
          // Desktop version - tabs on left
          <>
            <TabsList className="block w-48 rounded-none bg-transparent px-3 pt-4">
              <div className="flex w-full flex-col gap-1">
                <TabsTrigger
                  value="general"
                  className="w-full justify-start rounded-md px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <GearSix className="size-4" />
                    <span>General</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="agents"
                  className="w-full justify-start rounded-md px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Robot className="size-4" />
                    <span>Agents</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="models"
                  className="w-full justify-start rounded-md px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="size-4" />
                    <span>Models</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="appearance"
                  className="w-full justify-start rounded-md px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <PaintBrush className="size-4" />
                    <span>Appearance</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="connections"
                  className="w-full justify-start rounded-md px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <PlugsConnected className="size-4" />
                    <span>Connections</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="features"
                  className="w-full justify-start rounded-md px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Sparkle className="size-4" />
                    <span>Features</span>
                  </div>
                </TabsTrigger>
              </div>
            </TabsList>

            {/* Desktop tabs content */}
            <div className="flex-1 overflow-auto px-6 pt-4">
              <TabsContent value="general" className="mt-0 space-y-6">
                <UserProfile />
                {isFirebaseEnabled && (
                  <>
                    <AccountManagement />
                  </>
                )}
              </TabsContent>

              <TabsContent value="agents" className="mt-0 space-y-6">
                {isFirebaseEnabled && <AgentsSection />}
              </TabsContent>

              <TabsContent value="models" className="mt-0 space-y-6">
                {isFirebaseEnabled && <ModelsSection />}
              </TabsContent>

              <TabsContent value="appearance" className="mt-0 space-y-6">
                <ThemeSelection />
                <LayoutSettings />
                <InteractionPreferences />
              </TabsContent>

              <TabsContent value="connections" className="mt-0 space-y-6">
                {!isDev && <ConnectionsPlaceholder />}
                {isDev && <ProviderSettings />}
                {isDev && <DeveloperTools />}
              </TabsContent>

              <TabsContent value="features" className="mt-0 space-y-6">
                <FeaturesSection />
              </TabsContent>
            </div>
          </>
        )}
      </Tabs>
    </div>
  )
}
