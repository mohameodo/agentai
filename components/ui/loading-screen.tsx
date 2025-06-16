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
      "bg-white dark:bg-gray-900",
      className
    )}>
      {/* 3D Cube Animation */}
      <div className="scene mb-8">
        <div className="cube-wrapper">
          <div className="cube">
            <div className="cube-faces">
              <div className="cube-face shadow"></div>
              <div className="cube-face bottom"></div>
              <div className="cube-face top"></div>
              <div className="cube-face left"></div>
              <div className="cube-face right"></div>
              <div className="cube-face back"></div>
              <div className="cube-face front"></div>
            </div>
          </div>
        </div>
      </div>
      
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
        /* 3D Cube Animation - Theme Aware */
        .scene {
          position: relative;
          z-index: 2;
          height: 220px;
          width: 220px;
          display: grid;
          place-items: center;
        }

        .cube-wrapper {
          transform-style: preserve-3d;
          animation: bouncing 2s infinite;
        }

        .cube {
          transform-style: preserve-3d;
          transform: rotateX(45deg) rotateZ(45deg);
          animation: rotation 2s infinite;
        }

        .cube-faces {
          transform-style: preserve-3d;
          height: 80px;
          width: 80px;
          position: relative;
          transform-origin: 0 0;
          transform: translateX(0) translateY(0) translateZ(-40px);
        }

        .cube-face {
          position: absolute;
          inset: 0;
          background: #000;
          border: solid 1px #666;
        }

        /* Dark mode cube colors */
        :global(.dark) .cube-face {
          background: #fff;
          border: solid 1px #ccc;
        }

        .cube-face.shadow {
          transform: translateZ(-80px);
          animation: bouncing-shadow 2s infinite;
          opacity: 0.1;
        }

        .cube-face.top {
          transform: translateZ(80px);
        }

        .cube-face.front {
          transform-origin: 0 50%;
          transform: rotateY(-90deg);
        }

        .cube-face.back {
          transform-origin: 0 50%;
          transform: rotateY(-90deg) translateZ(-80px);
        }

        .cube-face.right {
          transform-origin: 50% 0;
          transform: rotateX(-90deg) translateY(-80px);
        }

        .cube-face.left {
          transform-origin: 50% 0;
          transform: rotateX(-90deg) translateY(-80px) translateZ(80px);
        }

        @keyframes rotation {
          0% {
            transform: rotateX(45deg) rotateY(0) rotateZ(45deg);
            animation-timing-function: cubic-bezier(0.17,0.84,0.44,1);
          }
          50% {
            transform: rotateX(45deg) rotateY(0) rotateZ(225deg);
            animation-timing-function: cubic-bezier(0.76,0.05,0.86,0.06);
          }
          100% {
            transform: rotateX(45deg) rotateY(0) rotateZ(405deg);
            animation-timing-function: cubic-bezier(0.17,0.84,0.44,1);
          }
        }

        @keyframes bouncing {
          0% {
            transform: translateY(-40px);
            animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
          }
          45% {
            transform: translateY(40px);
            animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
          }
          100% {
            transform: translateY(-40px);
            animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
          }
        }

        @keyframes bouncing-shadow {
          0% {
            transform: translateZ(-80px) scale(1.3);
            animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
            opacity: 0.05;
          }
          45% {
            transform: translateZ(0);
            animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
            opacity: 0.3;
          }
          100% {
            transform: translateZ(-80px) scale(1.3);
            animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
            opacity: 0.05;
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .scene {
            height: 180px;
            width: 180px;
          }
          
          .cube-faces {
            height: 60px;
            width: 60px;
            transform: translateX(0) translateY(0) translateZ(-30px);
          }
          
          .cube-face.shadow {
            transform: translateZ(-60px);
          }
          
          .cube-face.top {
            transform: translateZ(60px);
          }
          
          .cube-face.back {
            transform: rotateY(-90deg) translateZ(-60px);
          }
          
          .cube-face.right {
            transform: rotateX(-90deg) translateY(-60px);
          }
          
          .cube-face.left {
            transform: rotateX(-90deg) translateY(-60px) translateZ(60px);
          }
          
          @keyframes bouncing {
            0% {
              transform: translateY(-30px);
              animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
            }
            45% {
              transform: translateY(30px);
              animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
            }
            100% {
              transform: translateY(-30px);
              animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
            }
          }
          
          @keyframes bouncing-shadow {
            0% {
              transform: translateZ(-60px) scale(1.3);
              animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
              opacity: 0.05;
            }
            45% {
              transform: translateZ(0);
              animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
              opacity: 0.3;
            }
            100% {
              transform: translateZ(-60px) scale(1.3);
              animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
              opacity: 0.05;
            }
          }
        }
      `}</style>
    </div>
  )
}
