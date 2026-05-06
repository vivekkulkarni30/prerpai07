require("dotenv").config()
const app = require("../src/app")
const connectToDB = require("../src/config/database")

let dbConnected = false
let connectionPromise = null
let lastConnectionAttempt = 0

const connectDB = async () => {
  // Return existing connection if available
  if (connectionPromise) {
    return connectionPromise
  }

  if (dbConnected) {
    return
  }

  // Prevent rapid reconnection attempts
  const now = Date.now()
  if (now - lastConnectionAttempt < 1000) {
    throw new Error("Connection attempt rate limited")
  }
  lastConnectionAttempt = now

  connectionPromise = (async () => {
    try {
      console.log("🔗 Connecting to database...")
      await connectToDB()
      dbConnected = true
      console.log("✓ Database connected successfully")
      return true
    } catch (error) {
      console.error("✗ Database connection error:", error.message)
      dbConnected = false
      connectionPromise = null
      throw error
    }
  })()

  return await connectionPromise
}

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Set response timeout to handle 10s Vercel limit
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          error: "Function timeout",
          message: "Request exceeded execution time"
        })
      }
    }, 9000) // 9 seconds to give buffer

    res.on("finish", () => clearTimeout(timeoutId))
    res.on("close", () => clearTimeout(timeoutId))

    // Ensure database is connected
    try {
      await connectDB()
    } catch (dbError) {
      console.error("DB connection failed:", dbError.message)
      clearTimeout(timeoutId)
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Database connection failed. Retrying..."
      })
    }

    // Pass request to Express app
    app(req, res)
  } catch (error) {
    console.error("Handler error:", error.message)
    res.status(500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
}

