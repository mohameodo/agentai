"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/lib/user-store/provider"
import { useState, useEffect } from "react"


export function ProviderSettings() {
  const { user } = useUser()
  const [openRouterAPIKey, setOpenRouterAPIKey] = useState("")
  const [enableOpenRouter, setEnableOpenRouter] = useState(false)
  const [openaiAPIKey, setOpenaiAPIKey] = useState("")
  const [enableOpenAI, setEnableOpenAI] = useState(false)
  const [mistralAPIKey, setMistralAPIKey] = useState("")
  const [enableMistral, setEnableMistral] = useState(false)
  const [anthropicAPIKey, setAnthropicAPIKey] = useState("")
  const [enableAnthropic, setEnableAnthropic] = useState(false)
  const [xaiAPIKey, setXaiAPIKey] = useState("")
  const [enableXai, setEnableXai] = useState(false)
  const [googleAPIKey, setGoogleAPIKey] = useState("")
  const [enableGoogle, setEnableGoogle] = useState(false)
  const [cloudflareAccountId, setCloudflareAccountId] = useState("")
  const [cloudflareApiToken, setCloudflareApiToken] = useState("")
  const [enableCloudflare, setEnableCloudflare] = useState(false)
  const [ollamaEndpoint, setOllamaEndpoint] = useState("http://localhost:11434")
  const [enableOllama, setEnableOllama] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [csrfToken, setCsrfToken] = useState("")

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("/api/csrf")
        if (response.ok) {
          const cookies = document.cookie.split(";")
          const csrfCookie = cookies.find(c => c.trim().startsWith("csrf_token="))
          if (csrfCookie) {
            setCsrfToken(csrfCookie.split("=")[1])
          }
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error)
      }
    }

    const fetchUserKeys = async () => {
      if (!user?.id) return
      
      try {
        const response = await fetch(`/api/user-keys?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          data.keys.forEach((key: { provider: string; maskedKey: string }) => {
            switch (key.provider) {
              case "openai":
                setOpenaiAPIKey(key.maskedKey)
                break
              case "mistral":
                setMistralAPIKey(key.maskedKey)
                break
              case "google":
                setGoogleAPIKey(key.maskedKey)
                break
              case "anthropic":
                setAnthropicAPIKey(key.maskedKey)
                break
              case "xai":
                setXaiAPIKey(key.maskedKey)
                break
              case "cloudflare":
                setCloudflareApiToken(key.maskedKey)
                break
            }
          })
        }
      } catch (error) {
        console.error("Failed to fetch user keys:", error)
      }
    }

    fetchCsrfToken()
    fetchUserKeys()
  }, [])

  const handleSave = async () => {
    if (!csrfToken) {
      console.error("CSRF token not available")
      return
    }

    setIsLoading(true)
    try {
      const keysToSave = [
        { provider: "openai", key: openaiAPIKey },
        { provider: "mistral", key: mistralAPIKey },
        { provider: "google", key: googleAPIKey },
        { provider: "anthropic", key: anthropicAPIKey },
        { provider: "xai", key: xaiAPIKey },
        { provider: "cloudflare", key: cloudflareApiToken },
      ]

      for (const { provider, key } of keysToSave) {
        if (key && !key.includes("*")) {
          await fetch("/api/user-keys", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider,
              apiKey: key,
              csrfToken,
              userId: user?.id, // Pass userId to API
            }),
          })
        }
      }

      console.log("Provider settings saved successfully")
    } catch (error) {
      console.error("Failed to save provider settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-medium">Provider Settings</h3>
        <p className="text-muted-foreground text-sm">
          Configure your AI model provider settings and API keys.
        </p>
      </div>

      <Tabs defaultValue="openrouter" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="openrouter">OpenRouter</TabsTrigger>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="mistral">Mistral</TabsTrigger>
          <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          <TabsTrigger value="xai">xAI</TabsTrigger>
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="cloudflare">Cloudflare</TabsTrigger>
          <TabsTrigger value="ollama">Ollama</TabsTrigger>
        </TabsList>

        <TabsContent value="openrouter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>OpenRouter</span>
                <Switch
                  checked={enableOpenRouter}
                  onCheckedChange={setEnableOpenRouter}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="openrouter-key">API Key</Label>
                <Input
                  id="openrouter-key"
                  type="password"
                  placeholder="your-openrouter-api-key"
                  value={openRouterAPIKey}
                  onChange={(e) => setOpenRouterAPIKey(e.target.value)}
                  disabled={!enableOpenRouter}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="openai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>OpenAI</span>
                <Switch
                  checked={enableOpenAI}
                  onCheckedChange={setEnableOpenAI}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="openai-key">API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  value={openaiAPIKey}
                  onChange={(e) => setOpenaiAPIKey(e.target.value)}
                  disabled={!enableOpenAI}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mistral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Mistral</span>
                <Switch
                  checked={enableMistral}
                  onCheckedChange={setEnableMistral}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mistral-key">API Key</Label>
                <Input
                  id="mistral-key"
                  type="password"
                  placeholder="your-mistral-api-key"
                  value={mistralAPIKey}
                  onChange={(e) => setMistralAPIKey(e.target.value)}
                  disabled={!enableMistral}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anthropic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Anthropic</span>
                <Switch
                  checked={enableAnthropic}
                  onCheckedChange={setEnableAnthropic}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="anthropic-key">API Key</Label>
                <Input
                  id="anthropic-key"
                  type="password"
                  placeholder="sk-ant-..."
                  value={anthropicAPIKey}
                  onChange={(e) => setAnthropicAPIKey(e.target.value)}
                  disabled={!enableAnthropic}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="xai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>xAI</span>
                <Switch checked={enableXai} onCheckedChange={setEnableXai} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="xai-key">API Key</Label>
                <Input
                  id="xai-key"
                  type="password"
                  placeholder="xai-..."
                  value={xaiAPIKey}
                  onChange={(e) => setXaiAPIKey(e.target.value)}
                  disabled={!enableXai}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="google" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Google</span>
                <Switch
                  checked={enableGoogle}
                  onCheckedChange={setEnableGoogle}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="google-key">API Key</Label>
                <Input
                  id="google-key"
                  type="password"
                  placeholder="your-google-api-key"
                  value={googleAPIKey}
                  onChange={(e) => setGoogleAPIKey(e.target.value)}
                  disabled={!enableGoogle}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cloudflare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cloudflare Workers AI</span>
                <Switch
                  checked={enableCloudflare}
                  onCheckedChange={setEnableCloudflare}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cloudflare-account-id">Account ID</Label>
                <Input
                  id="cloudflare-account-id"
                  type="text"
                  placeholder="your-cloudflare-account-id"
                  value={cloudflareAccountId}
                  onChange={(e) => setCloudflareAccountId(e.target.value)}
                  disabled={!enableCloudflare}
                />
              </div>
              <div>
                <Label htmlFor="cloudflare-api-token">API Token</Label>
                <Input
                  id="cloudflare-api-token"
                  type="password"
                  placeholder="your-cloudflare-api-token"
                  value={cloudflareApiToken}
                  onChange={(e) => setCloudflareApiToken(e.target.value)}
                  disabled={!enableCloudflare}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ollama" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Ollama</span>
                <Switch
                  checked={enableOllama}
                  onCheckedChange={setEnableOllama}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ollama-endpoint">Endpoint</Label>
                <Input
                  id="ollama-endpoint"
                  type="url"
                  placeholder="http://localhost:11434"
                  value={ollamaEndpoint}
                  onChange={(e) => setOllamaEndpoint(e.target.value)}
                  disabled={!enableOllama}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
