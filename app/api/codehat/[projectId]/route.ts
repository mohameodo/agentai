import { NextRequest, NextResponse } from "next/server"
import { updateCodeHatProject, getCodeHatProject } from "@/lib/codehat/api"
import { isFirebaseEnabled } from "@/lib/firebase/config"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  if (!isFirebaseEnabled) {
    return NextResponse.json(
      { error: "Firebase is not enabled" },
      { status: 503 }
    )
  }

  try {
    const { projectId } = await params
    // Updated to pass userId as well (mock for now)
    const project = await getCodeHatProject("mock-user-id", projectId)
    
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  if (!isFirebaseEnabled) {
    return NextResponse.json(
      { error: "Firebase is not enabled" },
      { status: 503 }
    )
  }

  try {
    const { projectId } = await params
    const updates = await request.json()
    
    // Updated to pass userId as well (mock for now)
    const project = await updateCodeHatProject("mock-user-id", projectId, updates)
    
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
  }
}

// Ensure this file is treated as a module