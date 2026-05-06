module.exports = (req, res) => {
  res.status(200).json({
    message: "PrepAI Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      interview: "/api/interview"
    }
  })
}
