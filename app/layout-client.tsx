"use client"

import { API_ROUTE_CSRF } from "@/lib/routes"
import { useEffect } from "react"

export function LayoutClient() {
  useEffect(() => {
    const init = async () => {
      // Initialize CSRF token
      fetch(API_ROUTE_CSRF)
      
      // Register service worker for better auth persistence
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        try {
          const registration = await navigator.serviceWorker.register('/sw-auth.js')
          console.log('Service Worker registered:', registration)
          
          // Listen for service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker installed, refresh for updates
                  newWorker.postMessage({ type: 'SKIP_WAITING' })
                }
              })
            }
          })
        } catch (error) {
          console.log('Service Worker registration failed:', error)
        }
      }
    }

    init()
  }, [])
  
  return null
}
