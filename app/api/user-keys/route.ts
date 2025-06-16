import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore, getFirebaseAuth } from "@/lib/firebase/client"
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { validateCsrfToken } from "@/lib/csrf"
import { encryptKey, maskKey, decryptKey } from "@/lib/encryption"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!isFirebaseEnabled) {
      return NextResponse.json({ error: "Firebase not available" }, { status: 500 })
    }

    const auth = getFirebaseAuth()
    const db = getFirebaseFirestore()

    if (!auth || !db) {
      return NextResponse.json({ error: "Firebase services not available" }, { status: 500 })
    }

    const user = auth.currentUser
    if (!user?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const q = query(
      collection(db, "user_keys"),
      where("user_id", "==", user.uid)
    )

    try {
      const querySnapshot = await getDocs(q)
      const maskedKeys: Array<{ provider: string; maskedKey: string }> = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.encrypted_key && data.iv) {
          const decryptedKey = decryptKey(data.encrypted_key, data.iv)
          maskedKeys.push({
            provider: data.provider,
            maskedKey: maskKey(decryptedKey),
          })
        }
      })

      return NextResponse.json({ keys: maskedKeys })
    } catch (error) {
      console.error("Error fetching user keys:", error)
      return NextResponse.json({ error: "Failed to fetch user keys" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in GET /api/user-keys:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { provider, apiKey, csrfToken } = await request.json()

    if (!validateCsrfToken(csrfToken)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }

    if (!provider || !apiKey) {
      return NextResponse.json({ error: "Provider and API key are required" }, { status: 400 })
    }

    if (!isFirebaseEnabled) {
      return NextResponse.json({ error: "Firebase not available" }, { status: 500 })
    }

    const auth = getFirebaseAuth()
    const db = getFirebaseFirestore()

    if (!auth || !db) {
      return NextResponse.json({ error: "Firebase services not available" }, { status: 500 })
    }

    const user = auth.currentUser
    if (!user?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { encrypted, iv } = encryptKey(apiKey)

    try {
      // Use compound key: user_id + provider
      const userKeyRef = doc(db, "user_keys", `${user.uid}_${provider}`)
      await setDoc(userKeyRef, {
        user_id: user.uid,
        provider,
        encrypted_key: encrypted,
        iv,
        updated_at: serverTimestamp(),
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error saving user key:", error)
      return NextResponse.json({ error: "Failed to save user key" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in POST /api/user-keys:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
