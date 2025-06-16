import { Markdown } from "@/components/prompt-kit/markdown"
import { cn } from "@/lib/utils"
import { CaretDown, Brain, CheckCircle } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect } from "react"

type ReasoningProps = {
  reasoning: string
  isStreaming?: boolean
}

const TRANSITION = {
  type: "spring" as const,
  duration: 0.2,
  stiffness: 260,
  damping: 20,
}

export function Reasoning({ reasoning, isStreaming = false }: ReasoningProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Start expanded by default
  
  // Auto-expand when streaming (thinking), but stay open when done
  useEffect(() => {
    if (isStreaming) {
      setIsExpanded(true)
    }
    // Remove the auto-collapse logic - let users manually control it
  }, [isStreaming])

  return (
    <div className="mb-4">
      <button
        className={cn(
          "text-muted-foreground hover:text-foreground flex items-center gap-2 transition-all px-3 py-2 rounded-lg border border-border/50",
          isStreaming 
            ? "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:border-blue-800 dark:text-blue-300"
            : "bg-muted/30 hover:bg-muted/50"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        {isStreaming ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="size-4 text-blue-500" />
          </motion.div>
        ) : (
          <CheckCircle className="size-4 text-green-500" />
        )}
        <span className="font-medium">
          {isStreaming ? "AI is thinking..." : "View AI Reasoning"}
        </span>
        <CaretDown
          className={cn(
            "size-3 transition-transform ml-auto",
            isExpanded ? "rotate-180" : ""
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-2 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITION}
          >
            <div className="text-muted-foreground border-muted-foreground/20 bg-muted/20 rounded-lg border p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown>{reasoning}</Markdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
