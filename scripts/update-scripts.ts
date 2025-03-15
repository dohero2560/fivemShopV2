const { MongoClient } = require("mongodb")


// MongoDB connection string
const uri ="mongodb+srv://tammai488:123456789Do@listworking.lytld.mongodb.net/DoDatabasse?retryWrites=true&w=majority&appName=ListWorking"

const updateScripts = async () => {
  try {
    const client = await MongoClient.connect(uri)
    const db = client.db()

    // Get all scripts
    const scripts = await db.collection("scripts").find({}).toArray()

    // Update each script
    for (const script of scripts) {
      const resourceName = script.resourceName || script.title.toLowerCase().replace(/[^a-z0-9]/g, '_')
      
      await db.collection("scripts").updateOne(
        { _id: script._id },
        { 
          $set: { 
            resourceName,
            updatedAt: new Date()
          } 
        }
      )

      console.log(`Updated script: ${script.title} -> ${resourceName}`)
    }

    console.log("All scripts updated successfully!")
    await client.close()
    process.exit(0)
  } catch (error) {
    console.error("Error updating scripts:", error)
    process.exit(1)
  }
}

updateScripts() 