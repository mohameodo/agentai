import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore } from "@/lib/firebase/client"
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { validateCsrfToken } from "@/lib/csrf"
import { encryptKey, maskKey, decryptKey } from "@/lib/encryption"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    if (!isFirebaseEnabled) {
      return NextResponse.json({ error: "Firebase not available" }, { status: 500 })
    }

    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 401 })
    }

    const db = getFirebaseFirestore()

    if (!db) {
      return NextResponse.json({ error: "Firebase services not available" }, { status: 500 })
    }

    const q = query(
      collection(db, "user_keys"),
      where("user_id", "==", userId)
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
    const { provider, apiKey, csrfToken, userId } = await request.json()

    if (!validateCsrfToken(csrfToken)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }

    if (!provider || !apiKey) {
      return NextResponse.json({ error: "Provider and API key are required" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 401 })
    }

    if (!isFirebaseEnabled) {
      return NextResponse.json({ error: "Firebase not available" }, { status: 500 })
    }

    const db = getFirebaseFirestore()

    if (!db) {
      return NextResponse.json({ error: "Firebase services not available" }, { status: 500 })
    }

    const { encrypted, iv } = encryptKey(apiKey)

    try {
      // Use compound key: user_id + provider
      const userKeyRef = doc(db, "user_keys", `${userId}_${provider}`)
      await setDoc(userKeyRef, {
        user_id: userId,
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
