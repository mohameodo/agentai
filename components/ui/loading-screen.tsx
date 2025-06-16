"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

const loadingMessages = [
  "Cooking up the magic...",
  "Hold up, loading the slay...",
  "Nexiloop ain't slow, just dramatic."
]

export function LoadingScreen({ className }: { className?: string }) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center",
      "bg-white dark:bg-gray-900 text-black dark:text-white",
      "backdrop-blur-sm",
      className
    )}>
      {/* Nexiloop animated text */}
      <div className="nexiloop-loader mb-8" />
      
      {/* Animated loader */}
      <div className="spinner-loader mb-6" />
      
      {/* Loading message with proper animation */}
      <AnimatePresence mode="wait">
        <motion.p 
          key={messageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-semibold text-gray-600 dark:text-gray-300 text-center"
        >
          {loadingMessages[messageIndex]}
        </motion.p>
      </AnimatePresence>

      <style jsx>{`
        /* Nexiloop animated text loader - high contrast for both modes */
        .nexiloop-loader {
          width: fit-content;
          font-size: 2.5rem;
          line-height: 1.5;
          font-family: system-ui, sans-serif;
          font-weight: bold;
          text-transform: uppercase;
          color: #000;
          position: relative;
          animation: nexiloop-anim 2s linear infinite;
        }

        /* Dark mode text color */
        :global(.dark) .nexiloop-loader {
          color: #fff;
        }

        .nexiloop-loader:before {
          content: "nexiloop ";
          background: linear-gradient(
            90deg,
            #000 0%,
            #3b82f6 25%,
            #000 50%,
            #3b82f6 75%,
            #000 100%
          );
          background-size: 400% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wave-colors 2s ease-in-out infinite;
        }

        /* Dark mode gradient */
        :global(.dark) .nexiloop-loader:before {
          background: linear-gradient(
            90deg,
            #fff 0%,
            #60a5fa 25%,
            #fff 50%,
            #60a5fa 75%,
            #fff 100%
          );
          background-size: 400% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Fallback for browsers that don't support background-clip: text */
        @supports not (background-clip: text) {
          .nexiloop-loader:before {
            -webkit-text-fill-color: #000;
            color: #000;
          }
          
          :global(.dark) .nexiloop-loader:before {
            -webkit-text-fill-color: #fff;
            color: #fff;
          }
        }

        @keyframes wave-colors {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes nexiloop-anim {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        /* Spinner loader - high contrast for both modes */
        .spinner-loader {
          width: 80px;
          aspect-ratio: 1;
          position: relative;
        }

        .spinner-loader::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle, #000 30%, transparent 31%) 0 0/20px 20px,
            radial-gradient(circle, #000 30%, transparent 31%) 60px 0/20px 20px,
            radial-gradient(circle, #000 30%, transparent 31%) 60px 60px/20px 20px,
            radial-gradient(circle, #000 30%, transparent 31%) 0 60px/20px 20px,
            radial-gradient(circle, #3b82f6 40%, transparent 41%) 30px 30px/20px 20px;
          background-repeat: no-repeat;
          animation: spinner-anim 1.2s infinite ease-in-out;
        }

        /* Dark mode spinner */
        :global(.dark) .spinner-loader::before {
          background: 
            radial-gradient(circle, #fff 30%, transparent 31%) 0 0/20px 20px,
            radial-gradient(circle, #fff 30%, transparent 31%) 60px 0/20px 20px,
            radial-gradient(circle, #fff 30%, transparent 31%) 60px 60px/20px 20px,
            radial-gradient(circle, #fff 30%, transparent 31%) 0 60px/20px 20px,
            radial-gradient(circle, #60a5fa 40%, transparent 41%) 30px 30px/20px 20px;
          background-repeat: no-repeat;
        }

        @keyframes spinner-anim {
          0% { 
            background-position: 0 0, 60px 0, 60px 60px, 0 60px, 30px 30px;
          }
          25% { 
            background-position: 60px 0, 60px 60px, 0 60px, 0 0, 30px 30px;
          }
          50% { 
            background-position: 60px 60px, 0 60px, 0 0, 60px 0, 30px 30px;
          }
          75% { 
            background-position: 0 60px, 0 0, 60px 0, 60px 60px, 30px 30px;
          }
          100% { 
            background-position: 0 0, 60px 0, 60px 60px, 0 60px, 30px 30px;
          }
        }

        @media (max-width: 768px) {
          .nexiloop-loader {
            font-size: 1.75rem;
          }
          
          .spinner-loader {
            width: 60px;
          }

          .spinner-loader::before {
            background: 
              radial-gradient(circle, #000 30%, transparent 31%) 0 0/15px 15px,
              radial-gradient(circle, #000 30%, transparent 31%) 45px 0/15px 15px,
              radial-gradient(circle, #000 30%, transparent 31%) 45px 45px/15px 15px,
              radial-gradient(circle, #000 30%, transparent 31%) 0 45px/15px 15px,
              radial-gradient(circle, #3b82f6 40%, transparent 41%) 22.5px 22.5px/15px 15px;
            background-repeat: no-repeat;
          }

          :global(.dark) .spinner-loader::before {
            background: 
              radial-gradient(circle, #fff 30%, transparent 31%) 0 0/15px 15px,
              radial-gradient(circle, #fff 30%, transparent 31%) 45px 0/15px 15px,
              radial-gradient(circle, #fff 30%, transparent 31%) 45px 45px/15px 15px,
              radial-gradient(circle, #fff 30%, transparent 31%) 0 45px/15px 15px,
              radial-gradient(circle, #60a5fa 40%, transparent 41%) 22.5px 22.5px/15px 15px;
            background-repeat: no-repeat;
          }

          @keyframes spinner-anim {
            0% { 
              background-position: 0 0, 45px 0, 45px 45px, 0 45px, 22.5px 22.5px;
            }
            25% { 
              background-position: 45px 0, 45px 45px, 0 45px, 0 0, 22.5px 22.5px;
            }
            50% { 
              background-position: 45px 45px, 0 45px, 0 0, 45px 0, 22.5px 22.5px;
            }
            75% { 
              background-position: 0 45px, 0 0, 45px 0, 45px 45px, 22.5px 22.5px;
            }
            100% { 
              background-position: 0 0, 45px 0, 45px 45px, 0 45px, 22.5px 22.5px;
            }
          }
        }

        /* Remove the unnecessary media query overrides */
      `}</style>
    </div>
  )
}
