"use client"

/**
 * Real-time synchronization disabled to prevent Firebase quota exhaustion
 */
export function useRealtimePreferenceSync() {
  // Real-time sync disabled to prevent Firebase quota exhaustion
  return {
    syncToFirebase: () => Promise.resolve(),
    syncModelToFirebase: () => Promise.resolve(),
    isConnected: false
  }
}

/**
 * Component that previously synced user preferences across devices (now disabled)
 */
export function RealtimePreferenceSync({ children }: { children: React.ReactNode }) {
  // Real-time sync disabled to prevent Firebase quota exhaustion
  return <>{children}</>
}
