"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
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
      "bg-background text-foreground",
      "backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95",
      className
    )}>
      {/* Nexiloop animated text */}
      <div className="nexiloop-loader mb-8" />
      
      {/* Animated loader */}
      <div className="spinner-loader mb-6" />
      
      {/* Loading message */}
      <motion.p 
        key={messageIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-lg font-semibold text-muted-foreground text-center"
      >
        {loadingMessages[messageIndex]}
      </motion.p>

      <style jsx>{`
        /* Nexiloop animated text loader - visible in both light and dark modes */
        .nexiloop-loader {
          width: fit-content;
          font-size: 2.5rem;
          line-height: 1.5;
          font-family: system-ui, sans-serif;
          font-weight: bold;
          text-transform: uppercase;
          color: hsl(var(--foreground));
          position: relative;
          animation: nexiloop-anim 2s linear infinite;
        }

        .nexiloop-loader:before {
          content: "nexiloop ";
          background: linear-gradient(
            90deg,
            hsl(var(--foreground)) 0%,
            hsl(var(--primary)) 25%,
            hsl(var(--foreground)) 50%,
            hsl(var(--primary)) 75%,
            hsl(var(--foreground)) 100%
          );
          background-size: 400% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wave-colors 2s ease-in-out infinite;
        }

        /* Fallback for browsers that don't support background-clip: text */
        @supports not (background-clip: text) {
          .nexiloop-loader:before {
            -webkit-text-fill-color: hsl(var(--foreground));
            color: hsl(var(--foreground));
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

        /* Spinner loader without blur - theme aware */
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
            radial-gradient(circle, hsl(var(--foreground)) 30%, transparent 31%) 0 0/20px 20px,
            radial-gradient(circle, hsl(var(--foreground)) 30%, transparent 31%) 60px 0/20px 20px,
            radial-gradient(circle, hsl(var(--foreground)) 30%, transparent 31%) 60px 60px/20px 20px,
            radial-gradient(circle, hsl(var(--foreground)) 30%, transparent 31%) 0 60px/20px 20px,
            radial-gradient(circle, hsl(var(--primary)) 40%, transparent 41%) 30px 30px/20px 20px;
          background-repeat: no-repeat;
          animation: spinner-anim 1.2s infinite ease-in-out;
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
              radial-gradient(circle, hsl(var(--foreground)) 30%, transparent 31%) 0 0/15px 15px,
              radial-gradient(circle, hsl(var(--foreground)) 30%, transparent 31%) 45px 0/15px 15px,
              radial-gradient(circle, hsl(var(--foreground)) 30%, transparent 31%) 45px 45px/15px 15px,
              radial-gradient(circle, hsl(var(--foreground)) 30%, transparent 31%) 0 45px/15px 15px,
              radial-gradient(circle, hsl(var(--primary)) 40%, transparent 41%) 22.5px 22.5px/15px 15px;
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

        /* Dark mode specific enhancements */
        @media (prefers-color-scheme: dark) {
          .nexiloop-loader {
            /* Enhance visibility in dark mode */
            filter: brightness(1.1);
          }
        }

        /* Light mode specific enhancements */
        @media (prefers-color-scheme: light) {
          .nexiloop-loader {
            /* Ensure visibility in light mode */
            filter: contrast(1.2);
          }
        }
      `}</style>
    </div>
  )
}
