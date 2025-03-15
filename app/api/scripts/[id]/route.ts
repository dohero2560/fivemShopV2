import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/scripts/[id] - Get a script by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const client = await clientPromise
    const db = client.db()
    
    const script = await db.collection("scripts").findOne({
      _id: new ObjectId(id)
    })

    if (!script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 })
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error("Error fetching script:", error)
    return NextResponse.json({ error: "Failed to fetch script" }, { status: 500 })
  }
}

// PATCH /api/scripts/[id] - Update a script (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    await requireAdmin()

    const id = params.id
    const data = await request.json()
    
    const client = await clientPromise
    const db = client.db()

    await db.collection("scripts").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        } 
      }
    )
    
    const script = await db.collection("scripts").findOne({ _id: new ObjectId(id) })

    return NextResponse.json(script)
  } catch (error) {
    console.error("Error updating script:", error)
    return NextResponse.json({ error: "Failed to update script" }, { status: 500 })
  }
}

// DELETE /api/scripts/[id] - Delete a script (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    await requireAdmin()

    const id = params.id
    
    const client = await clientPromise
    const db = client.db()

    await db.collection("scripts").deleteOne({
      _id: new ObjectId(id)
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting script:", error)
    return NextResponse.json({ error: "Failed to delete script" }, { status: 500 })
  }
}

