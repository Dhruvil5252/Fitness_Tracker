const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    // Register or Login requirements
    username: {
        type: String,
        required: [true, "Name is require"],
    },
    email: {
        type: String,
        required: [true, "Email is require"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },

    // Profile or fitness attributes
    age: {
        type: Number,
        required: [true, "Age is required"]
    },
    weight: {
        type: Number, //kg
        required: [true, "Weight is required"]
    },
    height: {
        type: Number, // cm
        required: [true, "Height is required"]
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: [true, "Gender is required"],
        default: "Male"
    },
    activityLevel: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active", "extreme"],
        default: "moderate",
    },
    goal: {
        type: String,
        enum: ["bulk", "cut", "muscle", "maintain"],
        default: "maintain",
    }
},
    {
        timestamps: true
    }
)

const userModel = mongoose.model("users",userSchema)

module.exports = userModel