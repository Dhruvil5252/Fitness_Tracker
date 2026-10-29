const express = require("express")
const cookieParser = require('cookie-parser')
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/**
 * - Routes required
 */
const authRouter = require("./routes/auth.routes")
const workoutRouter = require("./routes/workout.routes")

/**
 * - Use Routes
 */
app.use("/api/auth", authRouter)

/**
 * - Workout Routes
 */
app.use("/api/workout", workoutRouter)

module.exports = app