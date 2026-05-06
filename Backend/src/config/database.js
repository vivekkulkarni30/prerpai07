const mongoose = require("mongoose")

async function connectToDB() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("✓ Already connected to Database")
      return
    }

    // Connection options optimized for serverless
    const mongooseOptions = {
      maxPoolSize: 5,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      connectionTimeoutMS: 10000,
      retryWrites: true,
      family: 4 // Use IPv4
    }

    await mongoose.connect(process.env.MONGO_URI, mongooseOptions)
    console.log("✓ Connected to Database successfully")
    
    return mongoose.connection
  } catch (err) {
    console.error("✗ Database Connection Error:", err.message)
    throw new Error(`Database connection failed: ${err.message}`)
  }
}

module.exports = connectToDB
