require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

let dbConnected = false

// Reuse database connection
const connectDB = async () => {
  if (!dbConnected) {
    try {
      await connectToDB()
      dbConnected = true
    } catch (error) {
      console.error("Database connection failed:", error)
      throw error
    }
  }
}

// AWS Lambda handler for serverless deployment
exports.handler = async (event, context) => {
  try {
    // Set context to not wait for event loop
    context.callbackWaitsForEmptyEventLoop = false

    // Connect to database if not already connected
    await connectDB()

    // Handle the request
    return app(event, context)
  } catch (error) {
    console.error("Handler error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    }
  }
}

// Export app for other serverless platforms (Vercel, etc.)
module.exports = app
