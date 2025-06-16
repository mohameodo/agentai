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
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background",
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
        /* Nexiloop animated text loader */
        .nexiloop-loader {
          width: fit-content;
          font-size: 2.5rem;
          line-height: 1.5;
          font-family: system-ui, sans-serif;
          font-weight: bold;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1px hsl(var(--foreground));
          background:
            radial-gradient(1.13em at 50% 1.6em, hsl(var(--foreground)) 99%, transparent 101%) calc(50% - 1.6em) 0/3.2em 100%,
            radial-gradient(1.13em at 50% -0.8em, transparent 99%, hsl(var(--foreground)) 101%) 50% .8em/3.2em 100% repeat-x;
          -webkit-background-clip: text;
          background-clip: text;
          animation: nexiloop-anim 2s linear infinite;
        }

        .nexiloop-loader:before {
          content: "nexiloop ";
        }

        @keyframes nexiloop-anim {
          to {
            background-position: calc(50% + 1.6em) 0, calc(50% + 3.2em) .8em;
          }
        }

        /* Spinner loader without blur */
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
            radial-gradient(circle, hsl(var(--primary)) 30%, transparent 31%) 30px 30px/20px 20px;
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
            background-size: 15px 15px;
            background-position: 0 0, 45px 0, 45px 45px, 0 45px, 22.5px 22.5px;
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
      `}</style>
    </div>
  )
}
