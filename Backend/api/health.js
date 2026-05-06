module.exports = (req, res) => {
  try {
    res.status(200).json({
      status: "ok",
      message: "Backend is running on Vercel",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "production"
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
