"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

const loadingMessages = [
  "Cooking up the magic...",
  "Hold up, loading the slay...",
  "Nexiloop ain't slow, just dramatic."
]

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Nexiloop animated text */}
        <div className="nexiloop-loader" />
        
        {/* Animated loader */}
        <div className="spinner-loader" />
        
        {/* Loading message */}
        <motion.p 
          key={messageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="loading-message"
        >
          {loadingMessages[messageIndex]}
        </motion.p>
      </div>

      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        /* Nexiloop animated text loader */
        .nexiloop-loader {
          width: fit-content;
          font-size: 40px;
          line-height: 1.5;
          font-family: system-ui, sans-serif;
          font-weight: bold;
          text-transform: uppercase;
          color: #0000;
          -webkit-text-stroke: 1px #fff;
          background:
            radial-gradient(1.13em at 50% 1.6em, #fff 99%, #0000 101%) calc(50% - 1.6em) 0/3.2em 100%,
            radial-gradient(1.13em at 50% -0.8em, #0000 99%, #fff 101%) 50% .8em/3.2em 100% repeat-x;
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

        /* Spinner loader */
        .spinner-loader {
          width: 80px;
          aspect-ratio: 1;
          border: 10px solid #0000;
          box-sizing: border-box;
          background: 
            radial-gradient(farthest-side, #fff 98%, #0000) 0 0/20px 20px,
            radial-gradient(farthest-side, #fff 98%, #0000) 100% 0/20px 20px,
            radial-gradient(farthest-side, #fff 98%, #0000) 100% 100%/20px 20px,
            radial-gradient(farthest-side, #fff 98%, #0000) 0 100%/20px 20px,
            linear-gradient(#fff 0 0) 50%/40px 40px,
            rgba(255, 255, 255, 0.1);
          background-repeat: no-repeat;
          filter: blur(4px) contrast(10);
          animation: spinner-anim 0.8s infinite;
        }

        @keyframes spinner-anim {
          100% {
            background-position: 100% 0, 100% 100%, 0 100%, 0 0, center;
          }
        }

        .loading-message {
          color: white;
          font-size: 18px;
          font-weight: 600;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          margin: 0;
        }

        @media (max-width: 768px) {
          .nexiloop-loader {
            font-size: 28px;
          }
          
          .spinner-loader {
            width: 60px;
          }
          
          .loading-message {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}
