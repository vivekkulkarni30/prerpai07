require("dotenv").config()
const app = require("../src/app")
const connectToDB = require("../src/config/database")

let dbConnected = false
let connectionPromise = null

const connectDB = async () => {
  if (connectionPromise) {
    return connectionPromise
  }

  if (dbConnected) {
    return
  }

  connectionPromise = (async () => {
    try {
      await connectToDB()
      dbConnected = true
      console.log("✓ Database connected successfully")
    } catch (error) {
      console.error("✗ Database connection error:", error.message)
      dbConnected = false
      throw error
    }
  })()

  await connectionPromise
}

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Ensure database is connected
    try {
      await connectDB()
    } catch (dbError) {
      console.error("DB connection failed:", dbError)
      return res.status(503).json({
        error: "Database connection failed",
        message: "Service temporarily unavailable"
      })
    }

    // Pass request to Express app
    app(req, res)
  } catch (error) {
    console.error("Handler error:", error)
    return res.status(500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
      requestId: req.headers["x-vercel-id"]
    })
  }
}

