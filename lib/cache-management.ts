/**
 * Cache management utilities to handle cache invalidation for user-specific data
 */

/**
 * Clears browser caches for user-specific data
 */
export async function clearUserDataCache() {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return
  }

  try {
    const cacheNames = await caches.keys()
    
    // Clear dynamic cache that might contain user data
    for (const cacheName of cacheNames) {
      if (cacheName.includes('dynamic')) {
        await caches.delete(cacheName)
        console.log(`Cleared cache: ${cacheName}`)
      }
    }
  } catch (error) {
    console.warn('Failed to clear user data cache:', error)
  }
}

/**
 * Forces a hard refresh of user preferences
 */
export function forceUserDataRefresh() {
  // Clear local storage items related to user data
  const keysToRemove = [
    'user-preferences',
    'preferred-layout',
    'guest-user-id',
    'auth-token'
  ]
  
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove ${key} from storage:`, error)
    }
  })
  
  // Clear user data cache
  clearUserDataCache()
}

/**
 * Triggers a soft reload to refresh cached content
 */
export function triggerSoftReload() {
  // Force reload without full page refresh
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

/**
 * Broadcasts user data changes to other tabs
 */
export function broadcastUserDataChange(type: string, data: any) {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
    return
  }

  try {
    const channel = new BroadcastChannel('user-data-updates')
    channel.postMessage({
      type,
      data,
      timestamp: Date.now()
    })
    channel.close()
  } catch (error) {
    console.warn('Failed to broadcast user data change:', error)
  }
}

/**
 * Listens for user data changes from other tabs
 */
export function listenForUserDataChanges(callback: (event: any) => void) {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
    return () => {}
  }

  try {
    const channel = new BroadcastChannel('user-data-updates')
    channel.addEventListener('message', callback)
    
    return () => {
      channel.removeEventListener('message', callback)
      channel.close()
    }
  } catch (error) {
    console.warn('Failed to setup user data change listener:', error)
    return () => {}
  }
}
