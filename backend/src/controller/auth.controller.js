const userModel = require("../models/user.model")
const tokenBlacklistModel = require("../models/blacklist.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function userRegisterController(req, res) {

    if (!req.body) {
        return res.status(400).json({
            message: "Please provide username, email, password, age, weight, height, gender, activityLevel, and goal"
        })
    }

    const { username, email, password, age, weight,
        height, gender, activityLevel, goal } = req.body


    if (!email || !password || !username || !age || !weight ||
        !height) {
        return res.status(400).json({
            message: "Please provide username, email password, age, weight, height, gender, activityLevel, and goal"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        email: email
    })

    if (isUserAlreadyExists) {
        return res.status(422).json({
            message: "User already exists with this email.",
            status: "failed"
        })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        email, password: passwordHash, username, age, weight,
        height, gender, activityLevel, goal
    })

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie('token', token)

    res.status(201).json({
        message: "User register successfully",
        user: {
            _id: user._id, email,
            username: user.username,
            age, weight,
            height, gender, activityLevel, goal
        },
        token
    })
}

async function userLoginController(req, res) {

    if (!req.body) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token)

    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function userLogoutController(req, res) {

    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({
            message: "token is not provided"
        })
    }

    await tokenBlacklistModel.create({ token })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

module.exports = {
    userRegisterController, userLoginController, userLogoutController, getMeController
}