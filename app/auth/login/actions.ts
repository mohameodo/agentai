"use server"

import { toast } from "@/components/ui/toast"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signOut() {
  if (!isFirebaseEnabled) {
    toast({
      title: "Sign out is not supported in this deployment",
      status: "info",
    })
    return
  }

  // Firebase auth sign out is handled on the client side
  // This server action just handles the redirect
  revalidatePath("/", "layout")
  redirect("/auth")
}
