const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController.js");
const protectRoute = require("../Middleware/protectRoute.js")

router.get("/me", protectRoute, authController.getMe);

router.post("/signUp", authController.signUp);

router.post("/logIn", authController.logIn);

router.post("/logOut", authController.logOut);

module.exports = router;
