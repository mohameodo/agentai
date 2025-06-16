import { NextRequest, NextResponse } from "next/server"
import { isFirebaseEnabled } from "@/lib/firebase/config"
import { getFirebaseFirestore, getFirebaseAuth } from "@/lib/firebase/client"
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"

export async function PUT(request: NextRequest) {
  if (!isFirebaseEnabled) {
    return NextResponse.json(
      { error: "Firebase is not enabled" },
      { status: 500 }
    )
  }

  try {
    const auth = getFirebaseAuth()
    const db = getFirebaseFirestore()
    
    if (!auth || !db) {
      return NextResponse.json(
        { error: "Firebase services not available" },
        { status: 500 }
      )
    }

    const user = auth.currentUser
    if (!user?.uid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      id,
      name, 
      description, 
      systemPrompt, 
      tools, 
      avatarUrl, 
      isPublic 
    } = body

    // Validate required fields
    if (!id || !name || !description || !systemPrompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if agent exists and user owns it
    const agentRef = doc(db, "agents", id)
    const agentDoc = await getDoc(agentRef)

    if (!agentDoc.exists()) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      )
    }

    const agentData = agentDoc.data()
    if (agentData.creator_id !== user.uid) {
      return NextResponse.json(
        { error: "You can only edit your own agents" },
        { status: 403 }
      )
    }

    // Update the agent
    const updateData = {
      name,
      description,
      system_prompt: systemPrompt,
      tools: tools || [],
      avatar_url: avatarUrl || null,
      is_public: isPublic || false,
      updated_at: serverTimestamp(),
    }

    try {
      await updateDoc(agentRef, updateData)
      
      // Return updated agent data
      const updatedAgent = {
        id,
        ...updateData,
        creator_id: agentData.creator_id,
        created_at: agentData.created_at,
        updated_at: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        agent: updatedAgent,
      })
    } catch (updateError) {
      console.error("Error updating agent:", updateError)
      return NextResponse.json(
        { error: "Failed to update agent" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Error in update-agent API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  if (!isFirebaseEnabled) {
    return NextResponse.json(
      { error: "Firebase is not enabled" },
      { status: 500 }
    )
  }

  try {
    const auth = getFirebaseAuth()
    const db = getFirebaseFirestore()
    
    if (!auth || !db) {
      return NextResponse.json(
        { error: "Firebase services not available" },
        { status: 500 }
      )
    }

    const user = auth.currentUser
    if (!user?.uid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      )
    }

    // Check if agent exists and user owns it
    const agentRef = doc(db, "agents", id)
    const agentDoc = await getDoc(agentRef)

    if (!agentDoc.exists()) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      )
    }

    const agentData = agentDoc.data()
    if (agentData.creator_id !== user.uid) {
      return NextResponse.json(
        { error: "You can only delete your own agents" },
        { status: 403 }
      )
    }

    // Delete the agent
    try {
      await deleteDoc(agentRef)
      return NextResponse.json({
        success: true,
        message: "Agent deleted successfully",
      })
    } catch (deleteError) {
      console.error("Error deleting agent:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete agent" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Error in delete-agent API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
