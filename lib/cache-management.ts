/**
 * Cache management utilities - cache deletion functions removed to prevent Firebase quota exhaustion
 */

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
