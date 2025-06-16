import { Agent } from "@/app/types/agent"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useAgent } from "@/lib/agent-store/provider"
import { useUser } from "@/lib/user-store/provider"
import { Robot, Plus, Trash, PencilSimple, ArrowSquareOut } from "@phosphor-icons/react"
import { useState } from "react"
import { DialogCreateAgentTrigger } from "../../../agents/dialog-create-agent/dialog-trigger-create-agent"

export function AgentsSection() {
  const { user } = useUser()
  const { userAgents, curatedAgents } = useAgent()
  const [deletingAgentId, setDeletingAgentId] = useState<string | null>(null)
  
  // Combine user agents and filter for agents created by current user
  const allAgents = [...(userAgents || []), ...(curatedAgents || [])]
  const myAgents = allAgents.filter((agent: Agent) => 
    agent.creator_id === user?.id
  )

  const handleDeleteAgent = async (agentId: string) => {
    if (!user?.id) return
    
    setDeletingAgentId(agentId)
    try {
      const response = await fetch(`/api/delete-agent`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: agentId, userId: user.id }),
      })
      
      if (response.ok) {
        // Refresh agents list
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to delete agent:", error)
    } finally {
      setDeletingAgentId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Robot className="h-4 w-4" />
            My Agents
          </h3>
          <p className="text-muted-foreground text-xs mt-1">
            Manage the agents you've created
          </p>
        </div>
        <DialogCreateAgentTrigger
          trigger={
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-3 w-3" />
              Create Agent
            </Button>
          }
        />
      </div>

      {myAgents.length === 0 ? (
        <Card>
          <CardHeader className="text-center py-8">
            <Robot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-base">No agents yet</CardTitle>
            <CardDescription>
              Create your first custom agent to get started
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          {myAgents.map((agent) => (
            <Card key={agent.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{agent.name}</h4>
                  </div>
                  <p className="text-muted-foreground text-xs line-clamp-2">
                    {agent.description}
                  </p>
                  {agent.tools && agent.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {agent.tools.slice(0, 3).map((tool) => (
                        <span 
                          key={tool} 
                          className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                        >
                          {tool}
                        </span>
                      ))}
                      {agent.tools.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{agent.tools.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(`/agents/${agent.id}`, '_blank')}
                      >
                        <ArrowSquareOut className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Agent</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(`/agents/${agent.id}/edit`, '_blank')}
                      >
                        <PencilSimple className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit Agent</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteAgent(agent.id)}
                        disabled={deletingAgentId === agent.id}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Agent</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
