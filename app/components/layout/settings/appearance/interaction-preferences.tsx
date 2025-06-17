"use client"

import { Switch } from "@/components/ui/switch"
import { useUserPreferences } from "@/lib/user-preference-store/provider"

export function InteractionPreferences() {
  const { preferences, setPromptSuggestions, setShowToolInvocations, setShowConversationPreviews, updatePreference } =
    useUserPreferences()

  return (
    <div className="space-y-6">
      {/* Prompt Suggestions */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Prompt suggestions</h3>
            <p className="text-muted-foreground text-xs">
              Show suggested prompts when starting a new conversation
            </p>
          </div>
          <Switch
            checked={preferences.promptSuggestions}
            onCheckedChange={setPromptSuggestions}
          />
        </div>
      </div>

      {/* Tool Invocations */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Tool invocations</h3>
            <p className="text-muted-foreground text-xs">
              Show tool execution details in conversations
            </p>
          </div>
          <Switch
            checked={preferences.showToolInvocations}
            onCheckedChange={setShowToolInvocations}
          />
        </div>
      </div>

      {/* Conversation Previews */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Conversation previews</h3>
            <p className="text-muted-foreground text-xs">
              Show conversation previews in history
            </p>
          </div>
          <Switch
            checked={preferences.showConversationPreviews}
            onCheckedChange={setShowConversationPreviews}
          />
        </div>
      </div>

      {/* Disable Loading Screen */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Disable loading screen</h3>
            <p className="text-muted-foreground text-xs">
              Skip the loading screen when starting the app
            </p>
          </div>
          <Switch
            checked={(preferences as any).disableLoadingScreen || false}
            onCheckedChange={(checked: boolean) => {
              updatePreference('disableLoadingScreen', checked)
            }}
          />
        </div>
      </div>
    </div>
  )
}
