"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DialogAuthProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function DialogAuth({ open, setOpen }: DialogAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const auth = getFirebaseAuth()
      if (!auth) {
        throw new Error("Firebase Auth is not available")
      }
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error signing in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Please sign in to continue using the chat features.
          </p>
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
