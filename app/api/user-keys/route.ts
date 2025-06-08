import { createClient } from "@/lib/supabase/server"
import { validateCsrfToken } from "@/lib/csrf"
import { encryptKey, maskKey, decryptKey } from "@/lib/encryption"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not available" }, { status: 500 })
    }

    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userKeys, error } = await supabase
      .from("user_keys")
      .select("provider, encrypted_key, iv")
      .eq("user_id", authData.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const maskedKeys = userKeys?.map(key => {
      const decryptedKey = decryptKey(key.encrypted_key, key.iv)
      return {
        provider: key.provider,
        maskedKey: maskKey(decryptedKey)
      }
    }) || []

    return NextResponse.json({ keys: maskedKeys })
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

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not available" }, { status: 500 })
    }

    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { encrypted, iv } = encryptKey(apiKey)

    const { error } = await supabase
      .from("user_keys")
      .upsert({
        user_id: authData.user.id,
        provider,
        encrypted_key: encrypted,
        iv,
        updated_at: new Date().toISOString()
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in POST /api/user-keys:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
