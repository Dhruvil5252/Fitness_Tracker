const workoutPlanModel = require("../models/fullWeekPlan.model");

/**
 * Create or save a full week workout plan
 * Route: POST /api/workout/workout-plan
 */
async function workoutPlanController(req, res) {
    try {
        const { planName, days } = req.body;

        if (!days) {
            return res.status(400).json({
                message: "Please provide 'days' for the workout plan"
            });
        }

        const newWorkoutPlan = await workoutPlanModel.create({
            user: req.user.id,
            planName,
            days
        });

        res.status(201).json({
            message: "Workout plan created successfully",
            plan: newWorkoutPlan
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

/**
 * Fetch workout plans for the authenticated user
 * Route: GET /api/workout/workout-plan
 */
async function getWorkoutPlanController(req, res) {
    try {
        const plans = await workoutPlanModel.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Workout plans retrieved successfully",
            plans
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    workoutPlanController,
    getWorkoutPlanController
};