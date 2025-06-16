import { NextRequest, NextResponse } from "next/server"
import { createCodeHatProject, getCodeHatProjects } from "@/lib/codehat/api"
import { isFirebaseEnabled } from "@/lib/firebase/config"

export async function GET(request: NextRequest) {
  if (!isFirebaseEnabled) {
    return NextResponse.json(
      { error: "Firebase is not enabled" },
      { status: 503 }
    )
  }

  try {
    // TODO: Get actual user ID from Firebase auth
    const projects = await getCodeHatProjects("mock-user-id")
    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!isFirebaseEnabled) {
    return NextResponse.json(
      { error: "Firebase is not enabled" },
      { status: 503 }
    )
  }

  try {
    const data = await request.json()
    // TODO: Get actual user ID from Firebase auth
    const project = await createCodeHatProject("mock-user-id", data)
    return NextResponse.json({ project })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
