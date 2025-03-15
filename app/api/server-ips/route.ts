import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/server-ips - Get user's server IPs
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    const client = await clientPromise
    const db = client.db()
    
    const serverIps = await db.collection("serverIps")
      .find({ userId: user.id })
      .toArray()

    return NextResponse.json(serverIps)
  } catch (error) {
    console.error("Error fetching server IPs:", error)
    return NextResponse.json({ error: "Failed to fetch server IPs" }, { status: 500 })
  }
}

// POST /api/server-ips - Create or update a server IP
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    const { scriptId, ipAddress } = await request.json()
    
    if (!scriptId || !ipAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if user owns the script
    const purchase = await db.collection("purchases").findOne({
      userId: user.id,
      scriptId: new ObjectId(scriptId),
      status: "COMPLETED",
    })

    if (!purchase) {
      return NextResponse.json({ error: "You do not own this script" }, { status: 403 })
    }

    // Get script details to get resourceName
    const script = await db.collection("scripts").findOne({
      _id: new ObjectId(scriptId)
    })

    if (!script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 })
    }

    const resourceName = script.resourceName || script.title.toLowerCase().replace(/[^a-z0-9]/g, '_')

    // Check if server IP already exists for this user and script
    const existingServerIp = await db.collection("serverIps").findOne({
      userId: user.id,
      resourceName,
    })

    let serverIp

    if (existingServerIp) {
      // Update existing server IP
      await db.collection("serverIps").updateOne(
        { _id: existingServerIp._id },
        { 
          $set: {
            ipAddress,
            isActive: false,
            lastActive: null,
            updatedAt: new Date()
          }
        }
      )
      
      serverIp = await db.collection("serverIps").findOne({ _id: existingServerIp._id })
    } else {
      // Create new server IP
      const newServerIp = {
        userId: user.id,
        resourceName,
        ipAddress,
        isActive: false,
        lastActive: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const result = await db.collection("serverIps").insertOne(newServerIp)
      serverIp = await db.collection("serverIps").findOne({ _id: result.insertedId })
    }

    return NextResponse.json(serverIp)
  } catch (error) {
    console.error("Error saving server IP:", error)
    return NextResponse.json({ error: "Failed to save server IP" }, { status: 500 })
  }
}

// PATCH /api/server-ips/verify - Verify server IP from FiveM server
export async function PATCH(request: NextRequest) {
  try {
    const { resourceName, ipAddress, serverIdentifier } = await request.json()

    if (!resourceName || !ipAddress || !serverIdentifier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Find server IP record
    const serverIp = await db.collection("serverIps").findOne({
      resourceName,
      ipAddress,
    })

    if (!serverIp) {
      return NextResponse.json({ 
        error: "IP ไม่ถูกต้อง กรุณาตรวจสอบการตั้งค่า IP ในเว็บไซต์",
        status: "UNAUTHORIZED"
      }, { status: 403 })
    }

    // Update active status
    await db.collection("serverIps").updateOne(
      { _id: serverIp._id },
      { 
        $set: { 
          isActive: true,
          lastActive: new Date(),
          serverIdentifier,
          updatedAt: new Date()
        } 
      }
    )

    return NextResponse.json({
      status: "AUTHORIZED",
      message: "IP verification successful"
    })

  } catch (error) {
    console.error("Error verifying server IP:", error)
    return NextResponse.json({ 
      error: "Failed to verify server IP",
      status: "ERROR"
    }, { status: 500 })
  }
}

