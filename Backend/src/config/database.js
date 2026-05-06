const mongoose = require("mongoose")

async function connectToDB() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("✓ Already connected to Database")
      return
    }

    // Connection options optimized for serverless free tier (10s limit)
    const mongooseOptions = {
      maxPoolSize: 3,
      minPoolSize: 1,
      maxIdleTimeMS: 20000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      retryWrites: true,
      family: 4,
      appName: "PrepAI-Backend"
    }

    console.log("🔗 Connecting to MongoDB with timeouts: 5s each...")
    await mongoose.connect(process.env.MONGO_URI, mongooseOptions)
    console.log("✓ Connected to Database successfully")
    
    return mongoose.connection
  } catch (err) {
    console.error("✗ Database Connection Error:", err.message)
    throw new Error(`Database connection failed: ${err.message}`)
  }
}

module.exports = connectToDB
