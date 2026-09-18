const express = require("express")
const authController = require("../controller/auth.controller.js")
const authMiddleware = require("../middlewares/auth.middleware.js")

const router = express.Router()

/* POST /api/auth/register */
router.post("/register", authController.userRegisterController)

/* POST /api/auth/login */
router.post("/login", authController.userLoginController)

/* GET /api/auth/logout */
router.get("/logout", authController.userLogoutController)

/* GET /api/auth/get-me */
router.get("/get-me", authMiddleware.authUser, authController.getMeController)

module.exports = router