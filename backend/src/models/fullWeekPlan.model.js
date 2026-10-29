const mongoose = require('mongoose')

// One set of an exercise: reps done and weight lifted in that set
const setSchema = new mongoose.Schema({
    setNumber: { type: Number, required: true, min: 1, max: 100 },
    reps: { type: Number, required: true, min: 1, max: 500 },
    weight: { type: Number, min: 0, max: 1000, default: 0 },  // 0 for bodyweight exercises
},
    { _id: false }
)

// One exercise inside a day's workout
const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    totalSets: { type: Number, required: true, min: 1, max: 20 },
    weightUnit: { type: String, enum: ["kg", "lb"], default: "kg" },
    sets: { type: [setSchema], default: [] }
},
    { _id: false }
)

// One day of the plan
const dayPlanSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ]
    },
    workoutName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    exercises: { type: [exerciseSchema], default: [] }
})

// Full plan, linked to a user 
const fullWeekPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    planName: { type: String, trim: true, maxlength: 100, default: "My Workout Plan" },
    days: { type: [dayPlanSchema], default: [] }
},
    { timestamps: true }
)

// Keep totalSets in sync with the sets array, and block duplicate days in a plan

fullWeekPlanSchema.pre("validate", function () {
    const seen = new Set();

    for (const d of this.days) {
        if (seen.has(d.day)) {
            throw new Error(`Duplicate day in plan: ${d.day}`);
        }
        seen.add(d.day);

        for (const ex of d.exercises) {
            if (ex.sets.length && ex.sets.length !== ex.totalSets) {
                throw new Error(
                    `"${ex.name}": totalSets (${ex.totalSets}) must match number of sets entered (${ex.sets.length})`
                );
            }
        }
    }
});

const workoutPlanModel = mongoose.model("workoutPlan", fullWeekPlanSchema)
module.exports = workoutPlanModel