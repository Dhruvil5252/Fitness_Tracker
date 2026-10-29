const express = require("express");
const workoutController = require("../controller/workout-plan.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

/* POST /api/workout/workout-plan */
router.post("/workout-plan", authMiddleware.authUser, workoutController.workoutPlanController)

/* GET /api/workout/workout-plan */
router.get("/workout-plan", authMiddleware.authUser, workoutController.getWorkoutPlanController)

module.exports = router