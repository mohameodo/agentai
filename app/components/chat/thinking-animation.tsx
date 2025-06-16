"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Brain, Sparkle, Lightbulb, Gear } from "@phosphor-icons/react"
import { useState, useEffect } from "react"

const THINKING_STATES = [
  { icon: Brain, text: "AI is thinking...", color: "text-blue-500" },
  { icon: Sparkle, text: "Reasoning through the problem...", color: "text-purple-500" },
  { icon: Lightbulb, text: "Connecting ideas...", color: "text-yellow-500" },
  { icon: Gear, text: "Processing information...", color: "text-green-500" },
  { icon: Brain, text: "Putting everything together...", color: "text-indigo-500" },
]

type ThinkingAnimationProps = {
  isVisible: boolean
  modelId: string
}

export function ThinkingAnimation({ isVisible, modelId }: ThinkingAnimationProps) {
  const [currentStateIndex, setCurrentStateIndex] = useState(0)
  
  // Only show thinking animation for reasoning models
  const isReasoningModel = modelId.includes('o1') || 
                          modelId.includes('o3') || 
                          modelId.includes('o4') || 
                          modelId.includes('deepseek') || 
                          modelId.toLowerCase().includes('reasoning') ||
                          modelId.includes('r1')

  useEffect(() => {
    if (!isVisible || !isReasoningModel) return

    const interval = setInterval(() => {
      setCurrentStateIndex((prev) => (prev + 1) % THINKING_STATES.length)
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval)
  }, [isVisible, isReasoningModel])

  if (!isVisible || !isReasoningModel) return null

  const currentState = THINKING_STATES[currentStateIndex]
  const Icon = currentState.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 px-6 py-4 bg-muted/50 rounded-lg border border-border/50 mb-4"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`${currentState.color} flex-shrink-0`}
        >
          <Icon size={20} />
        </motion.div>
        
        <motion.div
          key={currentState.text}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <p className="text-sm text-muted-foreground font-medium">
            {currentState.text}
          </p>
          
          {/* New animated loader */}
          <div className="mt-2">
            <div className="loader opacity-60"></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
