import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/download/[id] - Download a script
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()
    const scriptId = params.id
    
    const client = await clientPromise
    const db = client.db()

    // Check if user has purchased the script
    const purchase = await db.collection("purchases").aggregate([
      { 
        $match: { 
          userId: user.id,
          scriptId: new ObjectId(scriptId),
          status: "COMPLETED"
        } 
      },
      { 
        $lookup: {
          from: "scripts",
          localField: "scriptId",
          foreignField: "_id",
          as: "script"
        }
      },
      { $unwind: "$script" }
    ]).toArray().then(results => results[0])

    if (!purchase) {
      return NextResponse.json({ error: "You do not own this script" }, { status: 403 })
    }

    // Check if user has verified their server IP
    const serverIp = await db.collection("serverIps").findOne({
      userId: user.id,
      scriptId
    })

    if (!serverIp || !serverIp.isVerified) {
      return NextResponse.json({ error: "Please verify your server IP before downloading" }, { status: 403 })
    }

    // In a real implementation, you would generate a download URL or serve the file
    // For this example, we'll just return a success message
    return NextResponse.json({
      success: true,
      downloadUrl: `https://example.com/downloads/${scriptId}?token=example-token`,
      script: {
        title: purchase.script.title,
        version: purchase.script.version,
      },
    })
  } catch (error) {
    console.error("Error downloading script:", error)
    return NextResponse.json({ error: "Failed to download script" }, { status: 500 })
  }
}

