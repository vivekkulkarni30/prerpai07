require("dotenv").config()
const app = require("../src/app")
const connectToDB = require("../src/config/database")

let dbConnected = false

// Initialize database connection on cold start
const initializeDB = async () => {
  if (!dbConnected) {
    try {
      console.log("🔗 Initializing database connection...")
      await connectToDB()
      dbConnected = true
      console.log("✓ Database connected successfully")
    } catch (error) {
      console.error("✗ Database connection error:", error.message)
      throw error
    }
  }
}

// Initialize DB on module load
initializeDB().catch(console.error)

// Export the Express app directly for Vercel
module.exports = app

