import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// This webhook would be called by Discord when events happen
// For example, when a user joins or leaves a Discord server
export async function POST(request: NextRequest) {
  try {
    // Verify that the request is coming from Discord
    const signature = request.headers.get("x-signature-ed25519")
    const timestamp = request.headers.get("x-signature-timestamp")

    if (!signature || !timestamp) {
      return NextResponse.json({ error: "Missing signature or timestamp" }, { status: 401 })
    }

    // In a real implementation, you would verify the signature here
    // using the Discord public key and the request body

    const data = await request.json()

    // Handle different types of Discord events
    switch (data.type) {
      case 1: // Discord sends a ping to verify the webhook
        return NextResponse.json({ type: 1 })

      case 2: // Discord sends an event
        const { event_type, user_id } = data

        // Handle user joining or leaving the Discord server
        if (event_type === "GUILD_MEMBER_ADD" || event_type === "GUILD_MEMBER_REMOVE") {
          const client = await clientPromise
          const db = client.db()
          
          // Update user status in the database
          await db.collection("users").updateMany(
            { discordId: user_id },
            { 
              $set: { 
                // You could update user status or role based on Discord membership
                updatedAt: new Date()
              } 
            }
          )
        }

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Unknown event type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing Discord webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

