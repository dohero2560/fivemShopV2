import clientPromise from "@/lib/mongodb"

async function initializeDatabase() {
  try {
    const client = await clientPromise
    const db = client.db()

    // Create collections
    await Promise.all([
      db.createCollection("users"),
      db.createCollection("scripts"),
      db.createCollection("purchases"),
      db.createCollection("payments"),
      db.createCollection("serverIps"),
      db.createCollection("pointsPackages"),
    ])

    // Create indexes
    await Promise.all([
      // Users collection
      db.collection("users").createIndexes([
        { key: { email: 1 }, unique: true },
        { key: { discordId: 1 }, sparse: true },
      ]),

      // Scripts collection
      db.collection("scripts").createIndexes([
        { key: { title: 1 } },
        { key: { category: 1 } },
        { key: { status: 1 } },
        { key: { createdAt: -1 } },
      ]),

      // Purchases collection
      db.collection("purchases").createIndexes([
        { key: { userId: 1 } },
        { key: { scriptId: 1 } },
        { key: { status: 1 } },
        { key: { createdAt: -1 } },
      ]),

      // Payments collection
      db.collection("payments").createIndexes([
        { key: { userId: 1 } },
        { key: { status: 1 } },
        { key: { transactionId: 1 }, unique: true },
        { key: { createdAt: -1 } },
      ]),

      // Server IPs collection
      db.collection("serverIps").createIndexes([
        { key: { userId: 1 } },
        { key: { scriptId: 1 } },
        { key: { ipAddress: 1 } },
        { key: { isVerified: 1 } },
      ]),

      // Points packages collection
      db.collection("pointsPackages").createIndexes([
        { key: { points: 1 } },
      ]),
    ])

    // Insert default points packages if none exist
    const pointsPackagesCount = await db.collection("pointsPackages").countDocuments()
    if (pointsPackagesCount === 0) {
      await db.collection("pointsPackages").insertMany([
        { points: 500, price: 100, bonus: 0 },
        { points: 1000, price: 200, bonus: 50 },
        { points: 2500, price: 500, bonus: 250 },
        { points: 5000, price: 1000, bonus: 750 },
      ])
    }

    console.log("Database initialized successfully!")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

initializeDatabase() 